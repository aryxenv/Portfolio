"""Verification Script for Portfolio Azure Cosmos DB Container.

Demonstrates that the Cosmos DB container contains uploaded chunks,
that vector similarity search functions properly using Azure AI Foundry embeddings,
and that metadata fields are queryable and filterable.

Functional implementation (no classes).
"""
from __future__ import annotations

import argparse
import os
import sys
import time
from pathlib import Path
from typing import Any

# Ensure local and parent directories are in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from azure.ai.projects import AIProjectClient
from azure.cosmos import CosmosClient
from azure.identity import DefaultAzureCredential

from config import (
    DEFAULT_AZURE_OPENAI_BASE_URL,
    DEFAULT_COSMOS_CONTAINER_NAME,
    DEFAULT_COSMOS_DATABASE_NAME,
    DEFAULT_COSMOS_ENDPOINT,
    DEFAULT_EMBEDDING_MODEL,
    DEFAULT_FOUNDRY_PROJECT_ENDPOINT,
)


def parse_cli_args(args: list[str] | None = None) -> argparse.Namespace:
    """Parse command-line arguments for verification."""
    parser = argparse.ArgumentParser(
        description="Verify Portfolio Azure Cosmos DB Container and Vector/Metadata Queryability",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--cosmos-endpoint",
        type=str,
        default=os.getenv("AZURE_COSMOS_ENDPOINT", DEFAULT_COSMOS_ENDPOINT),
        help="Cosmos DB endpoint URL",
    )
    parser.add_argument(
        "--database-name",
        type=str,
        default=os.getenv("AZURE_COSMOS_DATABASE_NAME", DEFAULT_COSMOS_DATABASE_NAME),
        help="Cosmos DB database name",
    )
    parser.add_argument(
        "--container-name",
        type=str,
        default=os.getenv("AZURE_COSMOS_CONTAINER_NAME", DEFAULT_COSMOS_CONTAINER_NAME),
        help="Cosmos DB container name",
    )
    parser.add_argument(
        "--foundry-endpoint",
        type=str,
        default=os.getenv("AZURE_FOUNDRY_PROJECT_ENDPOINT", DEFAULT_FOUNDRY_PROJECT_ENDPOINT),
        help="Azure AI Foundry project endpoint URL",
    )
    parser.add_argument(
        "--openai-base-url",
        type=str,
        default=os.getenv("AZURE_OPENAI_BASE_URL", DEFAULT_AZURE_OPENAI_BASE_URL),
        help="Azure OpenAI base URL for embeddings",
    )
    parser.add_argument(
        "--embedding-model",
        type=str,
        default=os.getenv("EMBEDDING_MODEL", DEFAULT_EMBEDDING_MODEL),
        help="Embedding model deployment name",
    )
    return parser.parse_args(args)


def get_embedding_vector(
    text: str,
    credential: Any,
    foundry_endpoint: str = DEFAULT_FOUNDRY_PROJECT_ENDPOINT,
    openai_base_url: str = DEFAULT_AZURE_OPENAI_BASE_URL,
    embedding_model: str = DEFAULT_EMBEDDING_MODEL,
    max_retries: int = 5,
) -> list[float]:
    """Generate a single embedding vector using AIProjectClient with retry backoff."""
    project = AIProjectClient(endpoint=foundry_endpoint, credential=credential)
    openai_client = project.get_openai_client(base_url=openai_base_url)
    for attempt in range(1, max_retries + 1):
        try:
            response = openai_client.embeddings.create(model=embedding_model, input=text)
            return response.data[0].embedding
        except Exception as err:
            if attempt < max_retries:
                wait_sec = attempt * 3
                print(f"  [WARN] Embedding attempt {attempt} failed: {err}. Retrying in {wait_sec}s...")
                time.sleep(wait_sec)
            else:
                print(f"  [ERROR] Embedding failed after {max_retries} attempts: {err}")
                raise
    raise RuntimeError("Unreachable")


def verify_all(
    cosmos_endpoint: str = DEFAULT_COSMOS_ENDPOINT,
    database_name: str = DEFAULT_COSMOS_DATABASE_NAME,
    container_name: str = DEFAULT_COSMOS_CONTAINER_NAME,
    foundry_endpoint: str = DEFAULT_FOUNDRY_PROJECT_ENDPOINT,
    openai_base_url: str = DEFAULT_AZURE_OPENAI_BASE_URL,
    embedding_model: str = DEFAULT_EMBEDDING_MODEL,
) -> bool:
    """Run verification checks on live Azure Cosmos DB container."""
    print("=" * 60)
    print(f"Verifying Cosmos DB Container: {database_name}/{container_name}")
    print(f"Endpoint: {cosmos_endpoint}")
    print("=" * 60)

    credential = DefaultAzureCredential()
    client = CosmosClient(cosmos_endpoint, credential=credential)
    db = client.get_database_client(database_name)
    container = db.get_container_client(container_name)

    all_passed = True

    # 1. Verify Document Count
    try:
        print("\n[CHECK 1] Verifying document count in container...")
        count_query = "SELECT VALUE COUNT(1) FROM c"
        counts = list(container.query_items(query=count_query, enable_cross_partition_query=True))
        count = counts[0] if counts else 0
        print(f"  Total indexed chunks: {count}")
        if count == 0:
            print("[FAIL] Container is empty!")
            all_passed = False
        else:
            print("[PASS] Container contains documents.")
    except Exception as err:
        print(f"[FAIL] Error verifying document count: {err}")
        all_passed = False

    # 2. Verify Metadata Filter: type = 'project'
    try:
        print("\n[CHECK 2] Filter by metadata field 'type = \"project\"'...")
        proj_query = (
            "SELECT TOP 3 c.id, c.doc_id, c.title, c.project_name, c.tech_stack "
            "FROM c WHERE c.type = 'project'"
        )
        proj_results = list(container.query_items(query=proj_query, enable_cross_partition_query=True))
        print(f"  Found {len(proj_results)} sample project results:")
        for r in proj_results:
            print(f"    - [{r.get('doc_id')}] {r.get('title')} | Tech: {(r.get('tech_stack') or [])[:3]}")
        if not proj_results:
            print("[FAIL] No project results found!")
            all_passed = False
        else:
            print("[PASS] 'type' filter works.")
    except Exception as err:
        print(f"[FAIL] Error in 'type' filter: {err}")
        all_passed = False

    # 3. Verify Metadata Filter: company = 'Microsoft'
    try:
        print("\n[CHECK 3] Filter by metadata field 'company = \"Microsoft\"'...")
        ms_query = (
            "SELECT TOP 3 c.id, c.doc_id, c.title, c.header, c.company "
            "FROM c WHERE c.company = 'Microsoft'"
        )
        ms_results = list(container.query_items(query=ms_query, enable_cross_partition_query=True))
        print(f"  Found {len(ms_results)} sample Microsoft results:")
        for r in ms_results:
            print(f"    - [{r.get('company')}] {r.get('title')} -> {r.get('header')}")
        if not ms_results:
            print("[FAIL] No Microsoft company results found!")
            all_passed = False
        else:
            print("[PASS] 'company' filter works.")
    except Exception as err:
        print(f"[FAIL] Error in 'company' filter: {err}")
        all_passed = False

    # 4. Verify Collection Filter: ARRAY_CONTAINS(c.tech_stack, 'Python')
    try:
        print("\n[CHECK 4] Filter by collection field ARRAY_CONTAINS(c.tech_stack, 'Python')...")
        py_query = (
            "SELECT TOP 3 c.id, c.title, c.tech_stack "
            "FROM c WHERE ARRAY_CONTAINS(c.tech_stack, 'Python')"
        )
        py_results = list(container.query_items(query=py_query, enable_cross_partition_query=True))
        print(f"  Found {len(py_results)} sample Python tech_stack results:")
        for r in py_results:
            print(f"    - {r.get('title')} | Stack: {r.get('tech_stack')}")
        if not py_results:
            print("[FAIL] No Python tech_stack results found!")
            all_passed = False
        else:
            print("[PASS] 'tech_stack' collection filter works.")
    except Exception as err:
        print(f"[FAIL] Error in 'tech_stack' collection filter: {err}")
        all_passed = False

    # 5. Verify Filter: doc_id = 'about-bio'
    try:
        print("\n[CHECK 5] Filter by document doc_id 'about-bio'...")
        bio_query = (
            "SELECT TOP 5 c.id, c.doc_id, c.title, c.header, c.chunk_index, c.total_chunks "
            "FROM c WHERE c.doc_id = 'about-bio'"
        )
        bio_results = list(container.query_items(query=bio_query, enable_cross_partition_query=True))
        print(f"  Found {len(bio_results)} chunks for doc 'about-bio':")
        for r in bio_results:
            print(f"    - Chunk {(r.get('chunk_index') or 0) + 1}/{r.get('total_chunks')}: {r.get('header')}")
        if not bio_results:
            print("[FAIL] No chunks found for 'about-bio'!")
            all_passed = False
        else:
            print("[PASS] 'doc_id' filter works.")
    except Exception as err:
        print(f"[FAIL] Error in 'doc_id' filter: {err}")
        all_passed = False

    # 6. Verify Vector Similarity Search using AIProjectClient
    vector: list[float] | None = None
    try:
        query_text = "What experience does Aryan have with Azure Kubernetes Service and multi-agent systems?"
        print(f"\n[CHECK 6] Vector Search for: '{query_text}'...")
        print("  Generating 3072-dimension query vector via AIProjectClient...")
        vector = get_embedding_vector(
            text=query_text,
            credential=credential,
            foundry_endpoint=foundry_endpoint,
            openai_base_url=openai_base_url,
            embedding_model=embedding_model,
        )
        print(f"  Generated vector dimension: {len(vector)}")

        vector_query = (
            "SELECT TOP 3 c.id, c.doc_id, c.title, c.header, c.header_path, "
            "VectorDistance(c.content_vector, @query_vector) AS SimilarityScore "
            "FROM c "
            "ORDER BY VectorDistance(c.content_vector, @query_vector)"
        )
        params: list[dict[str, object]] = [{"name": "@query_vector", "value": vector}]
        vector_results = list(
            container.query_items(
                query=vector_query,
                parameters=params,
                enable_cross_partition_query=True,
            )
        )
        print("  Top Vector Search Results:")
        for idx, r in enumerate(vector_results, 1):
            score = r.get("SimilarityScore")
            score_str = f"{score:.4f}" if isinstance(score, (int, float)) else str(score)
            print(f"    {idx}. [{r.get('doc_id')}] {r.get('title')} -> {r.get('header')} (Score: {score_str})")
        if not vector_results:
            print("[FAIL] Vector search returned no results!")
            all_passed = False
        else:
            print("[PASS] Vector search executed successfully.")
    except Exception as err:
        print(f"[FAIL] Error in vector search: {err}")
        all_passed = False

    # 7. Verify Filtered Vector Search (Metadata Filter + VectorDistance)
    try:
        if vector is not None:
            print("\n[CHECK 7] Filtered Vector Search (WHERE c.company = 'Microsoft')...")
            filtered_vec_query = (
                "SELECT TOP 3 c.id, c.doc_id, c.title, c.header, "
                "VectorDistance(c.content_vector, @query_vector) AS SimilarityScore "
                "FROM c "
                "WHERE c.company = 'Microsoft' "
                "ORDER BY VectorDistance(c.content_vector, @query_vector)"
            )
            filtered_params: list[dict[str, object]] = [{"name": "@query_vector", "value": vector}]
            hybrid_results = list(
                container.query_items(
                    query=filtered_vec_query,
                    parameters=filtered_params,
                    enable_cross_partition_query=True,
                )
            )
            print("  Top Filtered Vector Search Results:")
            for idx, r in enumerate(hybrid_results, 1):
                score = r.get("SimilarityScore")
                score_str = f"{score:.4f}" if isinstance(score, (int, float)) else str(score)
                print(f"    {idx}. [{r.get('doc_id')}] {r.get('title')} -> {r.get('header')} (Score: {score_str})")
            if not hybrid_results:
                print("[FAIL] Filtered vector search returned no results!")
                all_passed = False
            else:
                print("[PASS] Filtered vector search executed successfully.")
        else:
            print("\n[CHECK 7] [SKIP] Query vector not generated from Check 6.")
            all_passed = False
    except Exception as err:
        print(f"[FAIL] Error in filtered vector search: {err}")
        all_passed = False

    # 8. Verify Composite Metadata Filter & Sort: company = 'Microsoft' AND week_number = 1
    # Exercises the composite index [path: /company, path: /week_number] with ORDER BY
    try:
        print("\n[CHECK 8] Composite Filter & Sort ('company = \"Microsoft\" AND week_number = 1' ORDER BY c.company, c.week_number)...")
        comp_query = (
            "SELECT TOP 3 c.id, c.doc_id, c.title, c.week_number, c.header "
            "FROM c "
            "WHERE c.company = 'Microsoft' AND c.week_number = 1 "
            "ORDER BY c.company ASC, c.week_number ASC"
        )
        week_results = list(container.query_items(query=comp_query, enable_cross_partition_query=True))
        print(f"  Found {len(week_results)} chunks for Microsoft Week 1:")
        for r in week_results:
            print(f"    - [{r.get('doc_id')}] Week {r.get('week_number')}: {r.get('header')}")
        if not week_results:
            print("[FAIL] No chunks found for Microsoft Week 1!")
            all_passed = False
        else:
            print("[PASS] Composite 'company' and 'week_number' filter with ORDER BY works.")
    except Exception as err:
        print(f"[FAIL] Error in composite filter query: {err}")
        all_passed = False

    # 9. Verify Metadata Filter: nda_redacted = true
    try:
        print("\n[CHECK 9] Filter by 'nda_redacted = true'...")
        nda_query = "SELECT TOP 3 c.id, c.title, c.nda_redacted FROM c WHERE c.nda_redacted = true"
        nda_results = list(container.query_items(query=nda_query, enable_cross_partition_query=True))
        print(f"  Found {len(nda_results)} sample NDA redacted results:")
        for r in nda_results:
            print(f"    - {r.get('title')} (nda_redacted: {r.get('nda_redacted')})")
        if not nda_results:
            print("[FAIL] No nda_redacted results found!")
            all_passed = False
        else:
            print("[PASS] 'nda_redacted' filter works.")
    except Exception as err:
        print(f"[FAIL] Error in nda_redacted query: {err}")
        all_passed = False

    # 10. Verify Metadata Filter: has_external_logs = false
    try:
        print("\n[CHECK 10] Filter by 'has_external_logs = false'...")
        ext_query = "SELECT TOP 3 c.id, c.title, c.has_external_logs FROM c WHERE c.has_external_logs = false"
        ext_results = list(container.query_items(query=ext_query, enable_cross_partition_query=True))
        print(f"  Found {len(ext_results)} sample has_external_logs results:")
        for r in ext_results:
            print(f"    - {r.get('title')} (has_external_logs: {r.get('has_external_logs')})")
        if not ext_results:
            print("[FAIL] No has_external_logs results found!")
            all_passed = False
        else:
            print("[PASS] 'has_external_logs' filter works.")
    except Exception as err:
        print(f"[FAIL] Error in has_external_logs query: {err}")
        all_passed = False

    print("\n" + "=" * 60)
    if all_passed:
        print("All Cosmos DB Verification Checks Passed Successfully!")
    else:
        print("Cosmos DB Verification Checks Encountered Failures!")
    print("=" * 60)
    return all_passed


def main(cli_args: list[str] | None = None) -> int:
    """Entry point for standalone verification script."""
    opts = parse_cli_args(cli_args)
    success = verify_all(
        cosmos_endpoint=opts.cosmos_endpoint,
        database_name=opts.database_name,
        container_name=opts.container_name,
        foundry_endpoint=opts.foundry_endpoint,
        openai_base_url=opts.openai_base_url,
        embedding_model=opts.embedding_model,
    )
    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
