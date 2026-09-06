"""Portfolio RAG Search Tools for Azure AI Search & Azure Cosmos DB NoSQL.

Provides hybrid retrieval (dense vector + keyword) over Aryan Shah's portfolio
knowledge base with structured metadata filtering optimized for LLM agent function calling.
"""
from __future__ import annotations

import logging
import os
from typing import Annotated, Any, Literal
from pydantic import Field
from agent_framework import tool
from azure.identity import DefaultAzureCredential
from azure.search.documents import SearchClient
from azure.search.documents.models import VectorizedQuery
from azure.cosmos import CosmosClient
from azure.ai.projects import AIProjectClient

logger = logging.getLogger("server.tools")

# 1. Credential
credential = DefaultAzureCredential()

# 2. Azure AI Search
search_client = SearchClient(
    endpoint=os.getenv("AZURE_SEARCH_ENDPOINT", "https://ais-portfolio.search.windows.net"),
    index_name=os.getenv("AZURE_SEARCH_INDEX_NAME", "ais-portfolio"),
    credential=credential,
)

# 3. Azure Cosmos DB Container
cosmos_client = CosmosClient(
    url=os.getenv("AZURE_COSMOS_ENDPOINT", "https://cdb-portfolio.documents.azure.com:443/"),
    credential=credential,
)

cosmos_container = cosmos_client.get_database_client(
    os.getenv("AZURE_COSMOS_DATABASE_NAME", "portfolio")
).get_container_client(os.getenv("AZURE_COSMOS_CONTAINER_NAME", "chunks"))

# 4. Embedding Client via AIProjectClient
project_client = AIProjectClient(
    endpoint=os.getenv(
        "AZURE_FOUNDRY_PROJECT_ENDPOINT",
        os.getenv(
            "AZURE_AI_PROJECT_ENDPOINT",
            "https://ai-portfolio-resource.services.ai.azure.com/api/projects/ai-portfolio",
        ),
    ),
    credential=credential,
)
openai_client = project_client.get_openai_client(
    base_url=os.getenv(
        "AZURE_OPENAI_BASE_URL",
        "https://ai-portfolio-resource.openai.azure.com/openai/v1",
    )
)


def generate_query_embedding(query: str, max_retries: int = 3) -> list[float]:
    """Generate 3072-dimension query vector using Azure AI Foundry."""
    import time

    for attempt in range(1, max_retries + 1):
        try:
            response = openai_client.embeddings.create(
                model=os.getenv("EMBEDDING_MODEL", "text-embedding-3-large"),
                input=query,
            )
            return response.data[0].embedding
        except Exception as err:
            if attempt == max_retries:
                logger.error(f"Embedding generation failed for query: {err}")
                raise
            time.sleep(attempt * 1.0)
    raise RuntimeError("Unreachable")

# ---------------------------------------------------------------------------
# Tool 1: Azure AI Search (Hybrid Vector + Keyword Search)
# ---------------------------------------------------------------------------


@tool(approval_mode="never_require")
def vector_search_ai_search(
    query: Annotated[
        str,
        Field(description="Semantic search query describing the technical topic or question."),
    ],
    doc_type: Annotated[
        str | None,
        Field(description="Filter by document type discovered via inspect_metadata_options."),
    ] = None,
    company: Annotated[
        str | None,
        Field(description="Filter by organization name discovered via inspect_metadata_options."),
    ] = None,
    tech: Annotated[
        str | None,
        Field(description="Filter by technology tag matching tech_stack entries."),
    ] = None,
    week_number: Annotated[
        int | None,
        Field(description="Filter by chronological internship week number."),
    ] = None,
    doc_id: Annotated[
        str | None,
        Field(description="Filter by specific document identifier."),
    ] = None,
    filters: Annotated[
        dict[str, Any] | None,
        Field(description="Optional dictionary for additional filter criteria."),
    ] = None,
) -> list[dict[str, Any]]:
    """Search Aryan Shah's portfolio knowledge base via Azure AI Search.

    Executes dense vector similarity and BM25 keyword hybrid search with OData metadata filtering.
    Returns the top 3 most relevant documentation chunks.
    """
    try:
        query_vector = generate_query_embedding(query)

        # Merge explicit args with any passed in filters dict
        merged_doc_type = doc_type or (filters.get("type") or filters.get("doc_type") if filters else None)
        merged_company = company or (filters.get("company") if filters else None)
        merged_tech = tech or (filters.get("tech") or filters.get("tech_stack") if filters else None)
        merged_week = week_number if week_number is not None else (filters.get("week_number") if filters else None)
        merged_doc_id = doc_id or (filters.get("doc_id") or filters.get("id") if filters else None)

        filter_parts: list[str] = []
        if merged_doc_type:
            clean_type = str(merged_doc_type).replace("'", "''")
            filter_parts.append(f"type eq '{clean_type}'")
        if merged_company:
            clean_company = str(merged_company).replace("'", "''")
            filter_parts.append(f"company eq '{clean_company}'")
        if merged_week is not None:
            filter_parts.append(f"week_number eq {int(merged_week)}")
        if merged_tech:
            clean_tech = str(merged_tech).replace("'", "''")
            filter_parts.append(f"tech_stack/any(t: t eq '{clean_tech}')")
        if merged_doc_id:
            clean_id = str(merged_doc_id).replace("'", "''")
            filter_parts.append(f"doc_id eq '{clean_id}'")

        odata_filter = " and ".join(filter_parts) if filter_parts else None

        # Hybrid Search: VectorizedQuery (HNSW cosine) + search_text (BM25 keyword)
        vector_query = VectorizedQuery(
            vector=query_vector,
            k_nearest_neighbors=3,
            fields="content_vector",
        )

        results = list(
            search_client.search(
                search_text=query,
                vector_queries=[vector_query],
                filter=odata_filter,
                select=[
                    "chunk_id",
                    "doc_id",
                    "title",
                    "header",
                    "header_path",
                    "type",
                    "company",
                    "role",
                    "project_name",
                    "tech_stack",
                    "content",
                    "source",
                    "week_number",
                ],
                top=3,
            )
        )

        output: list[dict[str, Any]] = []
        for r in results:
            output.append({
                "chunk_id": r.get("chunk_id"),
                "doc_id": r.get("doc_id"),
                "title": r.get("title"),
                "section": r.get("header_path") or r.get("header"),
                "type": r.get("type"),
                "company": r.get("company"),
                "week_number": r.get("week_number"),
                "tech_stack": r.get("tech_stack"),
                "content": r.get("content"),
                "source": r.get("source"),
            })

        return output
    except Exception as err:
        logger.error(f"Error in vector_search (AI Search): {err}")
        return [{"error": f"Search failed: {err}"}]


# ---------------------------------------------------------------------------
# Tool 2: Azure Cosmos DB NoSQL (Hybrid Search: DiskANN Vector + Full-Text RRF)
# ---------------------------------------------------------------------------


@tool(approval_mode="never_require")
def vector_search(
    query: Annotated[
        str,
        Field(description="Semantic search query describing the technical topic or question."),
    ],
    doc_type: Annotated[
        str | None,
        Field(description="Filter by document type discovered via inspect_metadata_options."),
    ] = None,
    company: Annotated[
        str | None,
        Field(description="Filter by organization name discovered via inspect_metadata_options."),
    ] = None,
    tech: Annotated[
        str | None,
        Field(description="Filter by technology tag matching tech_stack entries."),
    ] = None,
    week_number: Annotated[
        int | None,
        Field(description="Filter by chronological internship week number."),
    ] = None,
    doc_id: Annotated[
        str | None,
        Field(description="Filter by specific document identifier."),
    ] = None,
    filters: Annotated[
        dict[str, Any] | None,
        Field(description="Optional dictionary for additional filter criteria."),
    ] = None,
) -> list[dict[str, Any]]:
    """Search Aryan Shah's portfolio knowledge base via Azure Cosmos DB NoSQL.

    Executes RRF hybrid search combining DiskANN vector distance and full text score with parameterized SQL WHERE clauses.
    Returns the top 3 most relevant documentation chunks.
    """
    try:
        query_vector = generate_query_embedding(query)

        # Merge args with filters dict
        merged_doc_type = doc_type or (filters.get("type") or filters.get("doc_type") if filters else None)
        merged_company = company or (filters.get("company") if filters else None)
        merged_tech = tech or (filters.get("tech") or filters.get("tech_stack") if filters else None)
        merged_week = week_number if week_number is not None else (filters.get("week_number") if filters else None)
        merged_doc_id = doc_id or (filters.get("doc_id") or filters.get("id") if filters else None)

        where_clauses: list[str] = []
        parameters: list[dict[str, object]] = [
            {"name": "@query_vector", "value": query_vector},
            {"name": "@text_query", "value": query},
        ]

        if merged_doc_type:
            where_clauses.append("c.type = @doc_type")
            parameters.append({"name": "@doc_type", "value": str(merged_doc_type)})
        if merged_company:
            where_clauses.append("c.company = @company")
            parameters.append({"name": "@company", "value": str(merged_company)})
        if merged_week is not None:
            where_clauses.append("c.week_number = @week_number")
            parameters.append({"name": "@week_number", "value": int(merged_week)})
        if merged_tech:
            where_clauses.append("ARRAY_CONTAINS(c.tech_stack, @tech)")
            parameters.append({"name": "@tech", "value": str(merged_tech)})
        if merged_doc_id:
            where_clauses.append("c.doc_id = @doc_id")
            parameters.append({"name": "@doc_id", "value": str(merged_doc_id)})

        where_sql = (" WHERE " + " AND ".join(where_clauses)) if where_clauses else ""

        sql_query = (
            "SELECT TOP 3 c.id, c.doc_id, c.title, c.header, c.header_path, "
            "c.type, c.company, c.role, c.project_name, c.tech_stack, "
            "c.content, c.source, c.week_number "
            f"FROM c{where_sql} "
            "ORDER BY RANK RRF(VectorDistance(c.content_vector, @query_vector), FullTextScore(c.content, @text_query))"
        )

        items = list(
            cosmos_container.query_items(
                query=sql_query,
                parameters=parameters,
                enable_cross_partition_query=True,
            )
        )

        output: list[dict[str, Any]] = []
        for item in items:
            output.append({
                "chunk_id": item.get("id"),
                "doc_id": item.get("doc_id"),
                "title": item.get("title"),
                "section": item.get("header_path") or item.get("header"),
                "type": item.get("type"),
                "company": item.get("company"),
                "week_number": item.get("week_number"),
                "tech_stack": item.get("tech_stack"),
                "content": item.get("content"),
                "source": item.get("source"),
            })

        return output
    except Exception as err:
        logger.error(f"Error in vector_search_cosmosdb: {err}")
        return [{"error": f"Cosmos DB search failed: {err}"}]


# ---------------------------------------------------------------------------
# Tool 3: Metadata Facet Inspector
# ---------------------------------------------------------------------------


@tool(approval_mode="never_require")
def inspect_metadata_options(
    field: Annotated[
        Literal[
            "all",
            "type",
            "company",
            "category",
            "tech_stack",
            "tags",
            "doc_id",
            "week_number",
        ]
        | None,
        Field(
            description=(
                "Metadata dimension to inspect: "
                "'all', 'type', 'company', 'category', 'tech_stack', 'tags', 'doc_id' or 'week_number'."
            )
        ),
    ] = "all",
    filter_context: Annotated[
        str | None,
        Field(
            description="Optional OData filter string (e.g. \"company eq 'Microsoft'\") to scope inspected values."
        ),
    ] = None,
) -> dict[str, Any]:
    """Inspect live metadata values and facets in Aryan Shah's portfolio index.

    Call this tool to discover exact categories, companies, technologies or document IDs
    before setting filters in search tools.
    """
    try:
        facet_map: dict[str, list[str]] = {
            "type": ["type,count:50"],
            "company": ["company,count:50"],
            "category": ["category,count:50"],
            "tech_stack": ["tech_stack,count:100"],
            "tags": ["tags,count:50"],
            "doc_id": ["doc_id,count:100"],
            "week_number": ["week_number,count:50"],
            "all": [
                "type,count:20",
                "company,count:10",
                "category,count:20",
                "tech_stack,count:40",
                "week_number,count:30",
            ],
        }

        requested_key = field or "all"
        facets_to_request = facet_map.get(requested_key, facet_map["all"])

        response = search_client.search(
            search_text="*",
            filter=filter_context,
            facets=facets_to_request,
            top=0,
        )

        facets_dict = response.get_facets() or {}
        output: dict[str, Any] = {}

        for k, v in facets_dict.items():
            if not v:
                output[k] = []
                continue
            vals = [item["value"] for item in v if isinstance(item, dict) and item.get("value") is not None]
            if k == "week_number":
                vals = sorted([x for x in vals if isinstance(x, int)])
            output[k] = vals

        return output
    except Exception as err:
        logger.error(f"Error in inspect_metadata_options: {err}")
        return {"error": f"Failed to inspect metadata: {err}"}