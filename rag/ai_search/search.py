from __future__ import annotations
import time
from typing import Any
from azure.core.exceptions import HttpResponseError
from azure.search.documents import SearchClient
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (HnswAlgorithmConfiguration, HnswParameters, SearchableField, SearchField, SearchFieldDataType, SearchIndex, SimpleField, VectorSearch, VectorSearchAlgorithmMetric, VectorSearchProfile)
from config import EMBEDDING_DIMENSIONS, UPLOAD_BATCH_SIZE, DEFAULT_EMBEDDING_MODEL

# ---------------------------------------------------------------------------
# Azure AI Search Schema Definition & Creation
# ---------------------------------------------------------------------------

def build_search_index_schema(index_name: str) -> SearchIndex:
    """Build the Azure AI Search index schema accommodating vectors and metadata fields."""
    fields = [
        SimpleField(
            name="chunk_id",
            type="Edm.String",
            key=True,
            filterable=True,
            sortable=True,
        ),
        SearchableField(
            name="id",
            type="Edm.String",
            filterable=True,
            facetable=True,
            sortable=True,
        ),
        SearchableField(
            name="doc_id",
            type="Edm.String",
            filterable=True,
            facetable=True,
        ),
        SimpleField(
            name="chunk_index",
            type="Edm.Int32",
            filterable=True,
            sortable=True,
        ),
        SimpleField(
            name="total_chunks",
            type="Edm.Int32",
            filterable=True,
        ),
        SearchableField(
            name="title",
            type="Edm.String",
            filterable=True,
            sortable=True,
        ),
        SearchableField(
            name="header",
            type="Edm.String",
            filterable=True,
        ),
        SearchableField(
            name="header_path",
            type="Edm.String",
            filterable=True,
        ),
        SearchableField(
            name="type",
            type="Edm.String",
            filterable=True,
            facetable=True,
        ),
        SearchableField(
            name="category",
            type="Edm.String",
            filterable=True,
            facetable=True,
        ),
        SearchableField(
            name="company",
            type="Edm.String",
            filterable=True,
            facetable=True,
        ),
        SearchableField(
            name="role",
            type="Edm.String",
            filterable=True,
        ),
        SearchableField(
            name="project_name",
            type="Edm.String",
            filterable=True,
        ),
        SearchField(
            name="tech_stack",
            type="Collection(Edm.String)",
            filterable=True,
            facetable=True,
            searchable=True,
        ),
        SearchField(
            name="tags",
            type="Collection(Edm.String)",
            filterable=True,
            facetable=True,
            searchable=True,
        ),
        SearchableField(
            name="summary",
            type="Edm.String",
        ),
        SimpleField(
            name="source",
            type="Edm.String",
            filterable=True,
        ),
        SearchableField(
            name="location",
            type="Edm.String",
            filterable=True,
        ),
        SimpleField(
            name="date_range",
            type="Edm.String",
            filterable=True,
        ),
        SimpleField(
            name="log_date",
            type="Edm.String",
            filterable=True,
        ),
        SimpleField(
            name="status",
            type="Edm.String",
            filterable=True,
        ),
        SearchableField(
            name="education",
            type="Edm.String",
        ),
        SimpleField(
            name="github_url",
            type="Edm.String",
        ),
        SimpleField(
            name="demo_url",
            type="Edm.String",
        ),
        SearchField(
            name="personal_interests",
            type="Collection(Edm.String)",
            filterable=True,
            facetable=True,
            searchable=True,
        ),
        SimpleField(
            name="week_number",
            type="Edm.Int32",
            filterable=True,
            sortable=True,
            facetable=True,
        ),
        SimpleField(
            name="nda_redacted",
            type="Edm.Boolean",
            filterable=True,
            facetable=True,
        ),
        SimpleField(
            name="has_external_logs",
            type="Edm.Boolean",
            filterable=True,
            facetable=True,
        ),
        SearchableField(
            name="content",
            type="Edm.String",
        ),
        SearchField(
            name="content_vector",
            type="Collection(Edm.Single)",
            searchable=True,
            vector_search_dimensions=EMBEDDING_DIMENSIONS,
            vector_search_profile_name="vector-profile",
        ),
    ]

    vector_search = VectorSearch(
        algorithms=[
            HnswAlgorithmConfiguration(
                name="hnsw-config",
                parameters=HnswParameters(metric=VectorSearchAlgorithmMetric.COSINE),
            )
        ],
        profiles=[
            VectorSearchProfile(
                name="vector-profile",
                algorithm_configuration_name="hnsw-config",
            )
        ],
    )

    return SearchIndex(name=index_name, fields=fields, vector_search=vector_search)


def create_or_update_index(
    index_client: SearchIndexClient, index_name: str
) -> SearchIndex:
    """Create or update the Azure AI Search index."""
    schema = build_search_index_schema(index_name)
    print(f"[INFO] Creating or updating Azure AI Search index '{index_name}'...")
    result = index_client.create_or_update_index(schema)
    print(f"[INFO] Azure AI Search index '{result.name}' is ready.")
    return result

# ---------------------------------------------------------------------------
# Upload Documents to Azure AI Search
# ---------------------------------------------------------------------------

def upload_documents_to_search(
    search_client: SearchClient,
    chunks: list[dict[str, Any]],
    batch_size: int = UPLOAD_BATCH_SIZE,
    max_retries: int = 5,
) -> None:
    """Upload chunk documents and their vector embeddings to Azure AI Search.
    
    Tracks per-document upload results using positional alignment (preventing
    data loss if result keys are None), retries transient failures with backoff,
    and dynamically splits batches on payload size limits (HTTP 413) or timeouts.
    """
    if not chunks:
        print("[INFO] No chunks provided for upload.")
        return

    print(f"[INFO] Uploading {len(chunks)} documents to Azure AI Search...")
    
    # Strip temporary internal keys before upload
    docs_to_upload = [
        {k: v for k, v in c.items() if not k.startswith("_")}
        for c in chunks
    ]
        
    def upload_batch_recursive(batch: list[dict[str, Any]], depth: int = 0) -> None:
        if not batch:
            return
            
        pending = list(batch)
        for attempt in range(1, max_retries + 1):
            try:
                results = list(search_client.upload_documents(documents=pending))
                
                # Pair results with pending documents by position (guaranteed 1:1 order)
                failed_docs: list[dict[str, Any]] = []
                failed_details: list[str] = []
                for doc, res in zip(pending, results):
                    if not getattr(res, "succeeded", False):
                        failed_docs.append(doc)
                        failed_details.append(
                            f"{getattr(res, 'key', None) or doc.get('chunk_id')}: "
                            f"{getattr(res, 'error_message', 'Unknown error')} "
                            f"(code: {getattr(res, 'status_code', 0)})"
                        )
                # In case results list was shorter than pending batch
                if len(results) < len(pending):
                    failed_docs.extend(pending[len(results):])
                    
                if not failed_docs:
                    return
                
                print(f"[WARN] Batch of {len(pending)}: {len(failed_docs)} documents failed in attempt {attempt}: {failed_details}")
                pending = failed_docs
                
                if attempt < max_retries:
                    wait_sec = attempt * 3
                    print(f"[WARN] Retrying {len(pending)} failed documents in {wait_sec}s...")
                    time.sleep(wait_sec)
                else:
                    if len(pending) > 1 and depth < 3:
                        mid = len(pending) // 2
                        print(f"[WARN] Splitting failing batch of {len(pending)} into sub-batches of {mid} and {len(pending)-mid}...")
                        upload_batch_recursive(pending[:mid], depth + 1)
                        upload_batch_recursive(pending[mid:], depth + 1)
                        return
                    raise RuntimeError(
                        f"Failed to upload {len(pending)} documents after {max_retries} attempts: {failed_details}"
                    )
            except HttpResponseError as err:
                # If payload too large (413) or timeout (408/504), split immediately if batch > 1
                if getattr(err, "status_code", 0) in (413, 408, 504) and len(pending) > 1:
                    mid = len(pending) // 2
                    print(f"[WARN] HTTP {err.status_code} on batch of {len(pending)}. Splitting into sub-batches of {mid} and {len(pending)-mid}...")
                    upload_batch_recursive(pending[:mid], depth + 1)
                    upload_batch_recursive(pending[mid:], depth + 1)
                    return
                    
                if attempt < max_retries:
                    wait_sec = attempt * 3
                    print(f"[WARN] Upload HTTP error in attempt {attempt} ({getattr(err, 'status_code', 'unknown')}): retrying in {wait_sec}s...")
                    time.sleep(wait_sec)
                else:
                    if len(pending) > 1 and depth < 3:
                        mid = len(pending) // 2
                        print(f"[WARN] Splitting batch of {len(pending)} after HTTP errors...")
                        upload_batch_recursive(pending[:mid], depth + 1)
                        upload_batch_recursive(pending[mid:], depth + 1)
                        return
                    print(f"[ERROR] Upload batch failed after {max_retries} attempts: {err}")
                    raise

    total = len(docs_to_upload)
    for start_idx in range(0, total, batch_size):
        end_idx = min(start_idx + batch_size, total)
        current_batch = docs_to_upload[start_idx:end_idx]
        upload_batch_recursive(current_batch)
        print(f"[INFO] Uploaded documents {start_idx + 1}-{end_idx} ({len(current_batch)}/{len(current_batch)} processed)")
        time.sleep(0.3)

# ---------------------------------------------------------------------------
# Verification & Query Testing
# ---------------------------------------------------------------------------

def verify_uploaded_index(
    search_client: SearchClient,
    index_name: str,
    openai_client: Any | None = None,
) -> bool:
    """Verify that documents are indexed and metadata fields are queryable."""
    print("\n" + "=" * 60)
    print(f"[VERIFICATION] Verifying index '{index_name}'...")
    print("=" * 60)
    
    all_passed = True
    doc_count = search_client.get_document_count()
    print(f"[VERIFICATION] Document count in index: {doc_count}")
    if doc_count == 0:
        print("[FAIL] Index contains 0 documents!")
        all_passed = False
    
    # Test 1: Simple keyword query
    print("\n[TEST 1] Keyword search for 'Microsoft Solutions Engineer'...")
    results = list(
        search_client.search(
            search_text="Microsoft Solutions Engineer",
            select=["chunk_id", "id", "title", "company", "role"],
            top=3,
        )
    )
    for idx, r in enumerate(results, 1):
        print(f"  Result {idx}: [{r.get('company')}] {r.get('title')} ({r.get('chunk_id')})")
    if not results:
        print("[FAIL] Test 1 keyword search returned no results.")
        all_passed = False
        
    # Test 2: Filter by 'type' metadata field
    print("\n[TEST 2] Metadata filter: type eq 'project'...")
    results = list(
        search_client.search(
            search_text="*",
            filter="type eq 'project'",
            select=["chunk_id", "id", "title", "project_name", "tech_stack"],
            top=3,
        )
    )
    for idx, r in enumerate(results, 1):
        print(f"  Project {idx}: {r.get('title')} | Tech Stack: {(r.get('tech_stack') or [])[:3]}")
    if not results:
        print("[FAIL] Test 2 filter 'type eq project' returned no results.")
        all_passed = False

    # Test 3: Filter by 'company' metadata field
    print("\n[TEST 3] Metadata filter: company eq 'Microsoft'...")
    results = list(
        search_client.search(
            search_text="*",
            filter="company eq 'Microsoft'",
            select=["chunk_id", "id", "title", "header"],
            top=3,
        )
    )
    for idx, r in enumerate(results, 1):
        print(f"  Microsoft Doc {idx}: {r.get('title')} -> {r.get('header')}")
    if not results:
        print("[FAIL] Test 3 filter 'company eq Microsoft' returned no results.")
        all_passed = False

    # Test 4: Collection filter on 'tech_stack'
    print("\n[TEST 4] Collection filter: tech_stack/any(t: t eq 'Python')...")
    results = list(
        search_client.search(
            search_text="*",
            filter="tech_stack/any(t: t eq 'Python')",
            select=["chunk_id", "title", "tech_stack"],
            top=3,
        )
    )
    for idx, r in enumerate(results, 1):
        print(f"  Python Match {idx}: {r.get('title')}")
    if not results:
        print("[FAIL] Test 4 filter on 'tech_stack' returned no results.")
        all_passed = False

    # Test 5: Filter by 'week_number' and 'company'
    print("\n[TEST 5] Metadata filter: company eq 'Microsoft' and week_number eq 1...")
    results = list(
        search_client.search(
            search_text="*",
            filter="company eq 'Microsoft' and week_number eq 1",
            select=["chunk_id", "id", "title", "week_number", "header"],
            top=3,
        )
    )
    for idx, r in enumerate(results, 1):
        print(f"  Week 1 Doc {idx}: {r.get('title')} (Week: {r.get('week_number')}) -> {r.get('header')}")
    if not results:
        print("[FAIL] Test 5 filter 'week_number and company' returned no results.")
        all_passed = False

    # Test 6: Filter by 'nda_redacted'
    print("\n[TEST 6] Metadata filter: nda_redacted eq true...")
    results = list(
        search_client.search(
            search_text="*",
            filter="nda_redacted eq true",
            select=["chunk_id", "title", "nda_redacted"],
            top=2,
        )
    )
    for idx, r in enumerate(results, 1):
        print(f"  NDA Doc {idx}: {r.get('title')} (NDA: {r.get('nda_redacted')})")
    if not results:
        print("[FAIL] Test 6 filter 'nda_redacted eq true' returned no results.")
        all_passed = False

    # Test 7: Filter by 'has_external_logs'
    print("\n[TEST 7] Metadata filter: has_external_logs eq false...")
    results = list(
        search_client.search(
            search_text="*",
            filter="has_external_logs eq false",
            select=["chunk_id", "title", "has_external_logs"],
            top=2,
        )
    )
    for idx, r in enumerate(results, 1):
        print(f"  External Logs Doc {idx}: {r.get('title')} (External Logs: {r.get('has_external_logs')})")
    if not results:
        print("[FAIL] Test 7 filter 'has_external_logs eq false' returned no results.")
        all_passed = False

    # Test 8 & 9: Vector & Hybrid search verification (if openai_client provided)
    if openai_client is not None:
        try:
            from azure.search.documents.models import VectorizedQuery
            query_text = "What experience does Aryan have with Azure Kubernetes Service and multi-agent systems?"
            print(f"\n[TEST 8] Vector Search for: '{query_text}'...")
            q_emb = openai_client.embeddings.create(model=DEFAULT_EMBEDDING_MODEL, input=query_text)
            q_vec = q_emb.data[0].embedding
            v_query = VectorizedQuery(vector=q_vec, k_nearest_neighbors=3, fields="content_vector")
            v_results = list(
                search_client.search(
                    search_text=None,
                    vector_queries=[v_query],
                    select=["chunk_id", "id", "title", "header"],
                    top=3,
                )
            )
            for idx, r in enumerate(v_results, 1):
                print(f"  Vector Match {idx}: [{r.get('id')}] {r.get('title')} -> {r.get('header')}")
            if not v_results:
                print("[FAIL] Test 8 vector search returned no results.")
                all_passed = False

            print("\n[TEST 9] Hybrid Search (Keyword + Vector)...")
            h_results = list(
                search_client.search(
                    search_text="AKS governance sidecar",
                    vector_queries=[v_query],
                    select=["chunk_id", "title", "header"],
                    top=3,
                )
            )
            for idx, r in enumerate(h_results, 1):
                print(f"  Hybrid Match {idx}: {r.get('title')} -> {r.get('header')}")
            if not h_results:
                print("[FAIL] Test 9 hybrid search returned no results.")
                all_passed = False
        except Exception as v_err:
            print(f"[WARN] Vector/hybrid verification encountered error: {v_err}")
            all_passed = False

    if all_passed:
        print("\n[VERIFICATION SUCCESS] Index verified: documents present and metadata fields fully queryable.")
    else:
        print("\n[VERIFICATION FAILED] One or more verification checks failed.")
    return all_passed



