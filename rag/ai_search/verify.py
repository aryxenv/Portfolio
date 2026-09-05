"""Verification Script for Portfolio Azure AI Search Index.

Demonstrates that the 'ais-portfolio' index contains uploaded chunks,
that vector similarity search functions properly using Azure AI Foundry embeddings,
and that metadata fields are queryable and filterable.

Functional implementation (no classes).
"""

from __future__ import annotations

import os
import time
from typing import Any

from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from azure.search.documents import SearchClient
from azure.search.documents.models import VectorizedQuery

SEARCH_ENDPOINT = os.getenv("AZURE_SEARCH_ENDPOINT", "https://ais-portfolio.search.windows.net")
INDEX_NAME = os.getenv("AZURE_SEARCH_INDEX_NAME", "ais-portfolio")
FOUNDRY_ENDPOINT = os.getenv(
    "AZURE_FOUNDRY_PROJECT_ENDPOINT",
    "https://ai-portfolio-resource.services.ai.azure.com/api/projects/ai-portfolio",
)
AZURE_OPENAI_BASE_URL = os.getenv(
    "AZURE_OPENAI_BASE_URL",
    "https://ai-portfolio-resource.openai.azure.com/openai/v1",
)
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-large")


def get_embedding_vector(text: str, credential: Any, max_retries: int = 5) -> list[float]:
    """Generate a single embedding vector using AIProjectClient with retry backoff."""
    project = AIProjectClient(endpoint=FOUNDRY_ENDPOINT, credential=credential)
    openai_client = project.get_openai_client(base_url=AZURE_OPENAI_BASE_URL)
    for attempt in range(1, max_retries + 1):
        try:
            response = openai_client.embeddings.create(model=EMBEDDING_MODEL, input=text)
            return response.data[0].embedding
        except Exception as err:
            if attempt < max_retries:
                wait_sec = attempt * 3
                print(f"  [WARN] Embedding attempt {attempt} failed: {err}. Retrying in {wait_sec}s...")
                time.sleep(wait_sec)
            else:
                print(f"  [ERROR] Embedding failed after {max_retries} attempts: {err}")
                raise
    raise RuntimeError('Unreachable')


def verify_all() -> bool:
    """Run verification checks on Azure AI Search index."""
    print("=" * 60)
    print(f"Verifying Azure AI Search Index: {INDEX_NAME}")
    print("=" * 60)

    credential = DefaultAzureCredential()
    search_client = SearchClient(
        endpoint=SEARCH_ENDPOINT,
        index_name=INDEX_NAME,
        credential=credential,
    )

    # 1. Verify Document Count
    count = search_client.get_document_count()
    print(f"\n[CHECK 1] Total indexed chunks: {count}")
    if count == 0:
        print("[FAIL] Index is empty!")
        return False
    print("[PASS] Index contains documents.")

    # 2. Verify Metadata Filter: type eq 'project'
    print("\n[CHECK 2] Filter by metadata field 'type eq \"project\"'...")
    proj_results = list(
        search_client.search(
            search_text="*",
            filter="type eq 'project'",
            select=["chunk_id", "id", "title", "project_name", "tech_stack"],
            top=3,
        )
    )
    print(f"  Found {len(proj_results)} sample project results:")
    for r in proj_results:
        print(f"    - [{r.get('id')}] {r.get('title')} | Tech: {(r.get('tech_stack') or [])[:3]}")
    if not proj_results:
        print("[FAIL] No project results found!")
        return False
    print("[PASS] 'type' filter works.")

    # 3. Verify Metadata Filter: company eq 'Microsoft'
    print("\n[CHECK 3] Filter by metadata field 'company eq \"Microsoft\"'...")
    ms_results = list(
        search_client.search(
            search_text="*",
            filter="company eq 'Microsoft'",
            select=["chunk_id", "id", "title", "header", "company"],
            top=3,
        )
    )
    print(f"  Found {len(ms_results)} sample Microsoft results:")
    for r in ms_results:
        print(f"    - [{r.get('company')}] {r.get('title')} -> {r.get('header')}")
    if not ms_results:
        print("[FAIL] No Microsoft company results found!")
        return False
    print("[PASS] 'company' filter works.")

    # 4. Verify Collection Filter: tech_stack/any(t: t eq 'Python')
    print("\n[CHECK 4] Filter by collection field 'tech_stack/any(t: t eq \"Python\")'...")
    py_results = list(
        search_client.search(
            search_text="*",
            filter="tech_stack/any(t: t eq 'Python')",
            select=["chunk_id", "title", "tech_stack"],
            top=3,
        )
    )
    print(f"  Found {len(py_results)} sample Python tech_stack results:")
    for r in py_results:
        print(f"    - {r.get('title')} | Stack: {r.get('tech_stack')}")
    if not py_results:
        print("[FAIL] No Python tech_stack results found!")
        return False
    print("[PASS] 'tech_stack' collection filter works.")

    # 5. Verify Metadata Filter: id eq 'about-bio'
    print("\n[CHECK 5] Filter by document id 'id eq \"about-bio\"'...")
    bio_results = list(
        search_client.search(
            search_text="*",
            filter="id eq 'about-bio'",
            select=["chunk_id", "id", "title", "header", "chunk_index", "total_chunks"],
            top=5,
        )
    )
    print(f"  Found {len(bio_results)} chunks for doc 'about-bio':")
    for r in bio_results:
        print(f"    - Chunk {(r.get('chunk_index') or 0) + 1}/{r.get('total_chunks')}: {r.get('header')}")
    if not bio_results:
        print("[FAIL] No chunks found for 'about-bio'!")
        return False
    print("[PASS] 'id' filter works.")

    # 6. Verify Vector Similarity Search using AIProjectClient
    query_text = "What experience does Aryan have with Azure Kubernetes Service and multi-agent systems?"
    print(f"\n[CHECK 6] Vector Search for: '{query_text}'...")
    print("  Generating 3072-dimension query vector via AIProjectClient...")
    vector = get_embedding_vector(query_text, credential)
    print(f"  Generated vector dimension: {len(vector)}")

    vector_query = VectorizedQuery(
        vector=vector,
        k_nearest_neighbors=3,
        fields="content_vector",
    )
    vector_results = list(
        search_client.search(
            search_text=None,
            vector_queries=[vector_query],
            select=["chunk_id", "id", "title", "header", "header_path"],
            top=3,
        )
    )
    print("  Top Vector Search Results:")
    for idx, r in enumerate(vector_results, 1):
        print(f"    {idx}. [{r.get('id')}] {r.get('title')} -> {r.get('header')}")
    if not vector_results:
        print("[FAIL] Vector search returned no results!")
        return False
    print("[PASS] Vector search executed successfully.")

    # 7. Verify Hybrid Search (Vector + Keyword)
    print("\n[CHECK 7] Hybrid Search (Keyword + Vector)...")
    hybrid_results = list(
        search_client.search(
            search_text="AKS governance sidecar",
            vector_queries=[vector_query],
            select=["chunk_id", "title", "header"],
            top=3,
        )
    )
    print("  Top Hybrid Search Results:")
    for idx, r in enumerate(hybrid_results, 1):
        print(f"    {idx}. {r.get('title')} -> {r.get('header')}")
    if not hybrid_results:
        print("[FAIL] Hybrid search returned no results!")
        return False
    print("[PASS] Hybrid search executed successfully.")

    # 8. Verify Metadata Filter: week_number and company
    print("\n[CHECK 8] Filter by 'company eq \"Microsoft\" and week_number eq 1'...")
    week_results = list(
        search_client.search(
            search_text="*",
            filter="company eq 'Microsoft' and week_number eq 1",
            select=["chunk_id", "id", "title", "week_number", "header"],
            top=3,
        )
    )
    print(f"  Found {len(week_results)} chunks for Microsoft Week 1:")
    for r in week_results:
        print(f"    - [{r.get('id')}] Week {r.get('week_number')}: {r.get('header')}")
    if not week_results:
        print("[FAIL] No chunks found for Microsoft Week 1!")
        return False
    print("[PASS] 'week_number' filter works.")

    # 9. Verify Metadata Filter: nda_redacted eq true
    print("\n[CHECK 9] Filter by 'nda_redacted eq true'...")
    nda_results = list(
        search_client.search(
            search_text="*",
            filter="nda_redacted eq true",
            select=["chunk_id", "title", "nda_redacted"],
            top=3,
        )
    )
    print(f"  Found {len(nda_results)} sample NDA redacted results:")
    for r in nda_results:
        print(f"    - {r.get('title')} (nda_redacted: {r.get('nda_redacted')})")
    if not nda_results:
        print("[FAIL] No nda_redacted results found!")
        return False
    print("[PASS] 'nda_redacted' filter works.")

    # 10. Verify Metadata Filter: has_external_logs eq false
    print("\n[CHECK 10] Filter by 'has_external_logs eq false'...")
    ext_results = list(
        search_client.search(
            search_text="*",
            filter="has_external_logs eq false",
            select=["chunk_id", "title", "has_external_logs"],
            top=3,
        )
    )
    print(f"  Found {len(ext_results)} sample has_external_logs results:")
    for r in ext_results:
        print(f"    - {r.get('title')} (has_external_logs: {r.get('has_external_logs')})")
    if not ext_results:
        print("[FAIL] No has_external_logs results found!")
        return False
    print("[PASS] 'has_external_logs' filter works.")

    print("\n" + "=" * 60)
    print("All Verification Checks Passed Successfully!")
    print("=" * 60)
    return True


if __name__ == "__main__":
    import sys
    success = verify_all()
    sys.exit(0 if success else 1)

