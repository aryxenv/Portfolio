"""Azure Cosmos DB NoSQL Client, Schema, Upload, and Verification Utilities."""
from __future__ import annotations

import json
import logging
import time
import urllib.error
import urllib.request
from typing import Any

from azure.core.exceptions import AzureError, HttpResponseError
from azure.cosmos import CosmosClient, PartitionKey
from azure.cosmos.exceptions import (
    CosmosHttpResponseError,
    CosmosResourceExistsError,
    CosmosResourceNotFoundError,
)
from azure.identity import DefaultAzureCredential

from config import (
    DEFAULT_AZURE_SUBSCRIPTION_ID,
    DEFAULT_COSMOS_ACCOUNT_NAME,
    DEFAULT_COSMOS_CONTAINER_NAME,
    DEFAULT_COSMOS_DATABASE_NAME,
    DEFAULT_COSMOS_ENDPOINT,
    DEFAULT_COSMOS_RESOURCE_GROUP,
    DEFAULT_EMBEDDING_MODEL,
    EMBEDDING_DIMENSIONS,
    UPLOAD_BATCH_SIZE,
)

logger = logging.getLogger("rag.cosmosdb")

# ---------------------------------------------------------------------------
# Schema and Policy Definition
# ---------------------------------------------------------------------------

def build_container_definition(
    container_name: str = DEFAULT_COSMOS_CONTAINER_NAME,
    partition_key_path: str = "/doc_id",
    vector_dimensions: int = EMBEDDING_DIMENSIONS,
    vector_index_type: str = "diskANN",
) -> dict[str, Any]:
    """Build the Cosmos DB SQL container definition with vector and composite indexes."""
    return {
        "id": container_name,
        "partitionKey": {
            "paths": [partition_key_path],
            "kind": "Hash",
        },
        "indexingPolicy": {
            "indexingMode": "consistent",
            "automatic": True,
            "includedPaths": [
                {"path": "/*"}
            ],
            "excludedPaths": [
                {"path": '/"_etag"/?'},
                {"path": "/content_vector/*"},
            ],
            "compositeIndexes": [
                [
                    {"path": "/company", "order": "ascending"},
                    {"path": "/week_number", "order": "ascending"},
                ],
                [
                    {"path": "/type", "order": "ascending"},
                    {"path": "/category", "order": "ascending"},
                ],
                [
                    {"path": "/status", "order": "ascending"},
                    {"path": "/date_range", "order": "ascending"},
                ],
                [
                    {"path": "/company", "order": "ascending"},
                    {"path": "/status", "order": "ascending"},
                ],
            ],
            "vectorIndexes": [
                {
                    "path": "/content_vector",
                    "type": vector_index_type,
                }
            ],
        },
        "vectorEmbeddingPolicy": {
            "vectorEmbeddings": [
                {
                    "path": "/content_vector",
                    "dataType": "float32",
                    "distanceFunction": "cosine",
                    "dimensions": vector_dimensions,
                }
            ]
        },
    }


# ---------------------------------------------------------------------------
# ARM & Cosmos DB Resource Management via DefaultAzureCredential
# ---------------------------------------------------------------------------

def create_or_update_cosmos_resources(
    credential: DefaultAzureCredential,
    account_name: str = DEFAULT_COSMOS_ACCOUNT_NAME,
    database_name: str = DEFAULT_COSMOS_DATABASE_NAME,
    container_name: str = DEFAULT_COSMOS_CONTAINER_NAME,
    cosmos_endpoint: str = DEFAULT_COSMOS_ENDPOINT,
    resource_group: str = DEFAULT_COSMOS_RESOURCE_GROUP,
    subscription_id: str = DEFAULT_AZURE_SUBSCRIPTION_ID,
    vector_index_type: str = "diskANN",
    max_propagation_retries: int = 60,
    propagation_wait_sec: int = 15,
) -> tuple[CosmosClient, Any]:
    """Create or verify the Cosmos DB database and container with vector indexing.
    
    Uses DefaultAzureCredential to acquire an ARM bearer token for management plane
    resource provisioning, then initializes a CosmosClient for data plane operations.
    """
    # 0. Check if container already exists and is healthy
    cosmos_client = CosmosClient(cosmos_endpoint, credential=credential)
    try:
        db_client = cosmos_client.get_database_client(database_name)
        container_client = db_client.get_container_client(container_name)
        container_props = container_client.read()
        v_policy = container_props.get("vectorEmbeddingPolicy")
        if v_policy and v_policy.get("vectorEmbeddings"):
            embeddings = v_policy.get("vectorEmbeddings", [])
            has_matching_vector = any(
                e.get("path") == "/content_vector" and e.get("dimensions") == EMBEDDING_DIMENSIONS
                for e in embeddings
            )
            if has_matching_vector:
                print(
                    f"[INFO] Cosmos DB container '{container_name}' already exists with valid vector policy ({EMBEDDING_DIMENSIONS} dims) and is ready.",
                    flush=True,
                )
                return cosmos_client, container_client
            else:
                print(
                    f"[WARN] Existing container '{container_name}' vector policy does not match /content_vector ({EMBEDDING_DIMENSIONS} dims): {embeddings}. Proceeding to ensure configuration...",
                    flush=True,
                )
        else:
            print(
                f"[WARN] Existing container '{container_name}' lacks vectorEmbeddingPolicy. Proceeding to ensure configuration...",
                flush=True,
            )
    except Exception:
        pass

    print(f"[INFO] Ensuring Cosmos DB database '{database_name}' and container '{container_name}' on '{account_name}'...", flush=True)

    # Acquire ARM Management Token via DefaultAzureCredential
    arm_token = credential.get_token("https://management.azure.com/.default").token
    headers = {
        "Authorization": f"Bearer {arm_token}",
        "Content-Type": "application/json",
    }
    arm_base = (
        f"https://management.azure.com/subscriptions/{subscription_id}"
        f"/resourceGroups/{resource_group}/providers/Microsoft.DocumentDB"
        f"/databaseAccounts/{account_name}"
    )

    # 1. Ensure SQL Database exists via ARM
    db_url = f"{arm_base}/sqlDatabases/{database_name}?api-version=2024-05-15"
    db_body = json.dumps({"properties": {"resource": {"id": database_name}}}).encode("utf-8")
    db_req = urllib.request.Request(db_url, data=db_body, headers=headers, method="PUT")
    
    try:
        with urllib.request.urlopen(db_req) as resp:
            print(f"[INFO] Database '{database_name}' provisioned (HTTP {resp.status}).")
    except urllib.error.HTTPError as err:
        if err.code == 409:
            print(f"[INFO] Database '{database_name}' already exists.")
        else:
            err_body = err.read().decode("utf-8", errors="replace")
            print(f"[WARN] Database creation response (HTTP {err.code}): {err_body}")

    # 2. Ensure SQL Container exists with vector embedding policy and indexing policy
    container_def = build_container_definition(
        container_name=container_name,
        vector_index_type=vector_index_type,
    )
    container_body = {
        "properties": {
            "resource": container_def,
        }
    }
    container_url = f"{arm_base}/sqlDatabases/{database_name}/containers/{container_name}?api-version=2024-05-15"

    for attempt in range(1, max_propagation_retries + 1):
        # Refresh token if needed
        fresh_token = credential.get_token("https://management.azure.com/.default").token
        arm_headers = {
            "Authorization": f"Bearer {fresh_token}",
            "Content-Type": "application/json",
        }
        req = urllib.request.Request(
            container_url,
            data=json.dumps(container_body).encode("utf-8"),
            headers=arm_headers,
            method="PUT",
        )
        try:
            with urllib.request.urlopen(req) as resp:
                async_url = resp.headers.get("Azure-AsyncOperation") or resp.headers.get("Location")
                if not async_url:
                    print(f"[INFO] Container '{container_name}' created immediately (HTTP {resp.status}).")
                    break

                # Poll async operation status
                operation_succeeded = False
                for _ in range(30):
                    time.sleep(2)
                    op_req = urllib.request.Request(async_url, headers={"Authorization": f"Bearer {fresh_token}"})
                    with urllib.request.urlopen(op_req) as op_resp:
                        op_data = json.loads(op_resp.read().decode("utf-8"))
                        status = op_data.get("status")
                        if status == "Succeeded":
                            print(f"[INFO] Container '{container_name}' provisioning Succeeded.")
                            operation_succeeded = True
                            break
                        elif status in ("Failed", "Canceled"):
                            err_msg = json.dumps(op_data.get("error") or op_data)
                            raise RuntimeError(f"Async container creation failed: {err_msg}")

                if operation_succeeded:
                    break

        except urllib.error.HTTPError as err:
            err_text = err.read().decode("utf-8", errors="replace")
            if err.code == 409:
                print(f"[INFO] Container '{container_name}' already exists.")
                break
            elif "capability has not been enabled" in err_text:
                if attempt < max_propagation_retries:
                    print(
                        f"[WARN] Vector Search capability is propagating in Azure backend (attempt {attempt}/{max_propagation_retries}). "
                        f"Waiting {propagation_wait_sec}s..."
                    )
                    time.sleep(propagation_wait_sec)
                    continue
                else:
                    raise RuntimeError(f"Vector Search capability not ready after {max_propagation_retries} attempts: {err_text}")
            else:
                raise RuntimeError(f"Failed to create container (HTTP {err.code}): {err_text}")
        except RuntimeError as err:
            if "capability has not been enabled" in str(err):
                if attempt < max_propagation_retries:
                    print(
                        f"[WARN] Vector Search capability is propagating in Azure backend (attempt {attempt}/{max_propagation_retries}). "
                        f"Waiting {propagation_wait_sec}s..."
                    )
                    time.sleep(propagation_wait_sec)
                    continue
            raise

    # 3. Initialize CosmosClient for data plane operations
    print(f"[INFO] Connecting to Cosmos DB endpoint '{cosmos_endpoint}' via DefaultAzureCredential...")
    cosmos_client = CosmosClient(cosmos_endpoint, credential=credential)
    db_client = cosmos_client.get_database_client(database_name)
    container_client = db_client.get_container_client(container_name)

    print(f"[INFO] Cosmos DB container '{container_name}' is ready for data operations.")
    return cosmos_client, container_client


# ---------------------------------------------------------------------------
# Document Ingestion with Rate Limiting (429) & Retry Logic
# ---------------------------------------------------------------------------

def upload_documents_to_cosmos(
    container_client: Any,
    chunks: list[dict[str, Any]],
    batch_size: int = UPLOAD_BATCH_SIZE,
    max_retries: int = 5,
) -> None:
    """Upload vectorized chunk documents to Azure Cosmos DB with robust retries.
    
    Handles Cosmos DB rate limiting (HTTP 429 / RequestRateTooLarge) using exponential
    backoff and header-guided retry-after windows, and ensures each document has a unique
    'id' (matching 'chunk_id') and partition key ('doc_id').
    """
    if not chunks:
        print("[INFO] No chunks provided for upload.")
        return

    print(f"[INFO] Uploading {len(chunks)} documents to Cosmos DB container '{container_client.id}'...")

    # Format documents for Cosmos DB:
    # 1. id must be unique per partition -> use chunk_id
    # 2. Strip internal keys (prefixed with _)
    docs_to_upload: list[dict[str, Any]] = []
    for c in chunks:
        doc = {k: v for k, v in c.items() if not k.startswith("_")}
        doc["id"] = c.get("chunk_id") or f"{c.get('doc_id')}_{c.get('chunk_index', 0)}"
        docs_to_upload.append(doc)

    total = len(docs_to_upload)
    uploaded_count = 0

    def upload_single_document(doc: dict[str, Any]) -> None:
        doc_id = doc["id"]
        for attempt in range(1, max_retries + 1):
            try:
                container_client.upsert_item(body=doc)
                return
            except CosmosHttpResponseError as err:
                # Check for rate limiting HTTP 429
                if err.status_code == 429:
                    retry_header = (
                        err.headers.get("x-ms-retry-after-ms")
                        if hasattr(err, "headers") and err.headers
                        else None
                    )
                    try:
                        retry_after_ms = int(retry_header) if retry_header is not None else 1000
                    except (ValueError, TypeError):
                        retry_after_ms = 1000
                    wait_sec = max(retry_after_ms / 1000.0, attempt * 1.5)
                    if attempt < max_retries:
                        print(f"[WARN] HTTP 429 on chunk '{doc_id}' (attempt {attempt}). Backing off for {wait_sec:.2f}s...")
                        time.sleep(wait_sec)
                        continue
                    raise
                elif attempt < max_retries and err.status_code in (408, 500, 503):
                    wait_sec = attempt * 2.0
                    print(f"[WARN] Transient HTTP {err.status_code} on chunk '{doc_id}'. Retrying in {wait_sec}s...")
                    time.sleep(wait_sec)
                    continue
                else:
                    print(f"[ERROR] Failed to upsert document '{doc_id}': {err}")
                    raise
            except Exception as err:
                if attempt < max_retries:
                    wait_sec = attempt * 2.0
                    print(f"[WARN] Unexpected error uploading chunk '{doc_id}': {err}. Retrying in {wait_sec}s...")
                    time.sleep(wait_sec)
                    continue
                raise

    for start_idx in range(0, total, batch_size):
        end_idx = min(start_idx + batch_size, total)
        current_batch = docs_to_upload[start_idx:end_idx]
        for item in current_batch:
            upload_single_document(item)
            uploaded_count += 1
        print(f"[INFO] Uploaded chunks {start_idx + 1}-{end_idx} of {total} ({uploaded_count}/{total} processed)")
        time.sleep(0.1)

    print(f"[INFO] Successfully uploaded all {total} chunks to Cosmos DB.")


# ---------------------------------------------------------------------------
# Ingestion Verification & Query Verification
# ---------------------------------------------------------------------------

def verify_uploaded_container(
    container_client: Any,
    openai_client: Any | None = None,
    credential: Any | None = None,
    embedding_model: str = DEFAULT_EMBEDDING_MODEL,
) -> bool:
    """Run verification checks on the live Cosmos DB container."""
    print("\n" + "=" * 60)
    print(f"[VERIFICATION] Verifying Cosmos DB Container: {container_client.id}")
    print("=" * 60)

    all_passed = True

    # 1. Total Document Count
    try:
        count_query = "SELECT VALUE COUNT(1) FROM c"
        counts = list(container_client.query_items(query=count_query, enable_cross_partition_query=True))
        doc_count = counts[0] if counts else 0
        print(f"\n[CHECK 1] Total indexed chunks: {doc_count}")
        if doc_count == 0:
            print("[FAIL] Container is empty!")
            all_passed = False
        else:
            print("[PASS] Container contains documents.")
    except Exception as err:
        print(f"[FAIL] Error checking document count: {err}")
        all_passed = False

    # 2. Metadata Filter: type = 'project'
    try:
        print("\n[CHECK 2] Filter by metadata field 'type = \"project\"'...")
        proj_query = "SELECT TOP 3 c.id, c.doc_id, c.title, c.project_name, c.tech_stack FROM c WHERE c.type = 'project'"
        proj_results = list(container_client.query_items(query=proj_query, enable_cross_partition_query=True))
        print(f"  Found {len(proj_results)} sample project results:")
        for r in proj_results:
            print(f"    - [{r.get('doc_id')}] {r.get('title')} | Tech: {(r.get('tech_stack') or [])[:3]}")
        if not proj_results:
            print("[FAIL] No project results found!")
            all_passed = False
        else:
            print("[PASS] 'type' filter works.")
    except Exception as err:
        print(f"[FAIL] Error filtering by type: {err}")
        all_passed = False

    # 3. Metadata Filter: company = 'Microsoft'
    try:
        print("\n[CHECK 3] Filter by metadata field 'company = \"Microsoft\"'...")
        ms_query = "SELECT TOP 3 c.id, c.doc_id, c.title, c.header, c.company FROM c WHERE c.company = 'Microsoft'"
        ms_results = list(container_client.query_items(query=ms_query, enable_cross_partition_query=True))
        print(f"  Found {len(ms_results)} sample Microsoft results:")
        for r in ms_results:
            print(f"    - [{r.get('company')}] {r.get('title')} -> {r.get('header')}")
        if not ms_results:
            print("[FAIL] No Microsoft company results found!")
            all_passed = False
        else:
            print("[PASS] 'company' filter works.")
    except Exception as err:
        print(f"[FAIL] Error filtering by company: {err}")
        all_passed = False

    # 4. Collection Filter: ARRAY_CONTAINS(c.tech_stack, 'Python')
    try:
        print("\n[CHECK 4] Filter by collection field ARRAY_CONTAINS(c.tech_stack, 'Python')...")
        py_query = "SELECT TOP 3 c.id, c.title, c.tech_stack FROM c WHERE ARRAY_CONTAINS(c.tech_stack, 'Python')"
        py_results = list(container_client.query_items(query=py_query, enable_cross_partition_query=True))
        print(f"  Found {len(py_results)} sample Python tech_stack results:")
        for r in py_results:
            print(f"    - {r.get('title')} | Stack: {r.get('tech_stack')}")
        if not py_results:
            print("[FAIL] No Python tech_stack results found!")
            all_passed = False
        else:
            print("[PASS] 'tech_stack' collection filter works.")
    except Exception as err:
        print(f"[FAIL] Error filtering by tech_stack: {err}")
        all_passed = False

    # 5. Filter by doc_id = 'about-bio'
    try:
        print("\n[CHECK 5] Filter by document doc_id 'about-bio'...")
        bio_query = "SELECT TOP 5 c.id, c.doc_id, c.title, c.header, c.chunk_index, c.total_chunks FROM c WHERE c.doc_id = 'about-bio'"
        bio_results = list(container_client.query_items(query=bio_query, enable_cross_partition_query=True))
        print(f"  Found {len(bio_results)} chunks for doc 'about-bio':")
        for r in bio_results:
            print(f"    - Chunk {(r.get('chunk_index') or 0) + 1}/{r.get('total_chunks')}: {r.get('header')}")
        if not bio_results:
            print("[FAIL] No chunks found for 'about-bio'!")
            all_passed = False
        else:
            print("[PASS] 'doc_id' filter works.")
    except Exception as err:
        print(f"[FAIL] Error filtering by doc_id: {err}")
        all_passed = False

    # 6. Vector Similarity Search
    query_text = "What experience does Aryan have with Azure Kubernetes Service and multi-agent systems?"
    print(f"\n[CHECK 6] Vector Search for: '{query_text}'...")
    if openai_client:
        try:
            print("  Generating 3072-dimension query vector via OpenAI client...")
            res = openai_client.embeddings.create(
                model=embedding_model,
                input=query_text,
            )
            query_vector = res.data[0].embedding
            print(f"  Generated vector dimension: {len(query_vector)}")

            vector_query = (
                "SELECT TOP 3 c.id, c.doc_id, c.title, c.header, c.header_path, "
                "VectorDistance(c.content_vector, @query_vector) AS SimilarityScore "
                "FROM c "
                "ORDER BY VectorDistance(c.content_vector, @query_vector)"
            )
            params: list[dict[str, object]] = [{"name": "@query_vector", "value": query_vector}]
            vector_results = list(
                container_client.query_items(
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
            print(f"[FAIL] Error executing vector search: {err}")
            all_passed = False
    else:
        print("  [SKIP] OpenAI client not provided; skipping vector search check.")

    # 7. Filtered Vector Search (Hybrid: Metadata filter + VectorDistance)
    if openai_client:
        try:
            print("\n[CHECK 7] Filtered Vector Search (WHERE c.company = 'Microsoft')...")
            filtered_vec_query = (
                "SELECT TOP 3 c.id, c.doc_id, c.title, c.header, "
                "VectorDistance(c.content_vector, @query_vector) AS SimilarityScore "
                "FROM c "
                "WHERE c.company = 'Microsoft' "
                "ORDER BY VectorDistance(c.content_vector, @query_vector)"
            )
            filtered_params: list[dict[str, object]] = [{"name": "@query_vector", "value": query_vector}]
            hybrid_results = list(
                container_client.query_items(
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
        except Exception as err:
            print(f"[FAIL] Error executing filtered vector search: {err}")
            all_passed = False

    # 8. Composite Filter: company = 'Microsoft' AND week_number = 1
    try:
        print("\n[CHECK 8] Filter by 'company = \"Microsoft\" AND week_number = 1'...")
        comp_query = (
            "SELECT TOP 3 c.id, c.doc_id, c.title, c.week_number, c.header "
            "FROM c "
            "WHERE c.company = 'Microsoft' AND c.week_number = 1 "
            "ORDER BY c.company ASC, c.week_number ASC"
        )
        week_results = list(container_client.query_items(query=comp_query, enable_cross_partition_query=True))
        print(f"  Found {len(week_results)} chunks for Microsoft Week 1:")
        for r in week_results:
            print(f"    - [{r.get('doc_id')}] Week {r.get('week_number')}: {r.get('header')}")
        if not week_results:
            print("[FAIL] No chunks found for Microsoft Week 1!")
            all_passed = False
        else:
            print("[PASS] Composite 'company' and 'week_number' filter works.")
    except Exception as err:
        print(f"[FAIL] Error in composite filter query: {err}")
        all_passed = False

    # 9. Boolean Filter: nda_redacted = true
    try:
        print("\n[CHECK 9] Filter by 'nda_redacted = true'...")
        nda_query = "SELECT TOP 3 c.id, c.title, c.nda_redacted FROM c WHERE c.nda_redacted = true"
        nda_results = list(container_client.query_items(query=nda_query, enable_cross_partition_query=True))
        print(f"  Found {len(nda_results)} sample NDA redacted results:")
        for r in nda_results:
            print(f"    - {r.get('title')} (nda_redacted: {r.get('nda_redacted')})")
        if not nda_results:
            print("[FAIL] No nda_redacted results found!")
            all_passed = False
        else:
            print("[PASS] 'nda_redacted' boolean filter works.")
    except Exception as err:
        print(f"[FAIL] Error in nda_redacted query: {err}")
        all_passed = False

    # 10. Boolean Filter: has_external_logs = false
    try:
        print("\n[CHECK 10] Filter by 'has_external_logs = false'...")
        ext_query = "SELECT TOP 3 c.id, c.title, c.has_external_logs FROM c WHERE c.has_external_logs = false"
        ext_results = list(container_client.query_items(query=ext_query, enable_cross_partition_query=True))
        print(f"  Found {len(ext_results)} sample has_external_logs results:")
        for r in ext_results:
            print(f"    - {r.get('title')} (has_external_logs: {r.get('has_external_logs')})")
        if not ext_results:
            print("[FAIL] No has_external_logs results found!")
            all_passed = False
        else:
            print("[PASS] 'has_external_logs' boolean filter works.")
    except Exception as err:
        print(f"[FAIL] Error in has_external_logs query: {err}")
        all_passed = False

    print("\n" + "=" * 60)
    if all_passed:
        print("All Cosmos DB Verification Checks Passed Successfully!")
    else:
        print("Cosmos DB Verification Checks Failed!")
    print("=" * 60)
    return all_passed
