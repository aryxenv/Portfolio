"""Portfolio RAG Ingestion Pipeline."""
from __future__ import annotations

import sys
import os
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent.parent))
import argparse
import logging
import sys
from pathlib import Path

# Silence non-critical failsafe deserializer warning from azure-search-documents
logging.getLogger("azure.search.documents._utils.model_base").setLevel(logging.ERROR)

from azure.identity import DefaultAzureCredential
from azure.search.documents import SearchClient
from azure.search.documents.indexes import SearchIndexClient

from config import (
    DEFAULT_SEARCH_ENDPOINT, DEFAULT_INDEX_NAME, 
    DEFAULT_FOUNDRY_PROJECT_ENDPOINT, DEFAULT_AZURE_OPENAI_BASE_URL,
    DEFAULT_EMBEDDING_MODEL, EMBEDDING_BATCH_SIZE, UPLOAD_BATCH_SIZE
)
from parser import collect_markdown_documents
from embeddings import initialize_openai_client, generate_embeddings
from search import create_or_update_index, upload_documents_to_search, verify_uploaded_index

# ---------------------------------------------------------------------------
# CLI Argument Parsing
# ---------------------------------------------------------------------------

def parse_cli_args(args: list[str] | None = None) -> argparse.Namespace:
    """Parse command-line arguments for the ingestion pipeline."""
    parser = argparse.ArgumentParser(
        description="Portfolio RAG Ingestion Pipeline (Azure AI Search + Azure AI Foundry)",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--content-dir",
        type=str,
        default=None,
        help="Path to markdown content directory (defaults to 'content' next to script)",
    )
    parser.add_argument(
        "--index-name",
        type=str,
        default=DEFAULT_INDEX_NAME,
        help="Azure AI Search index name",
    )
    parser.add_argument(
        "--search-endpoint",
        type=str,
        default=DEFAULT_SEARCH_ENDPOINT,
        help="Azure AI Search endpoint URL",
    )
    parser.add_argument(
        "--foundry-endpoint",
        type=str,
        default=DEFAULT_FOUNDRY_PROJECT_ENDPOINT,
        help="Azure AI Foundry project endpoint URL",
    )
    parser.add_argument(
        "--openai-base-url",
        type=str,
        default=DEFAULT_AZURE_OPENAI_BASE_URL,
        help="Azure OpenAI base URL for embeddings",
    )
    parser.add_argument(
        "--embedding-model",
        type=str,
        default=DEFAULT_EMBEDDING_MODEL,
        help="Embedding model deployment name",
    )
    parser.add_argument(
        "--embedding-batch-size",
        type=int,
        default=EMBEDDING_BATCH_SIZE,
        help="Batch size for embedding generation",
    )
    parser.add_argument(
        "--upload-batch-size",
        type=int,
        default=UPLOAD_BATCH_SIZE,
        help="Batch size for Azure AI Search upload",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Parse and chunk files locally without calling Azure cloud APIs",
    )
    parser.add_argument(
        "--verify-only",
        action="store_true",
        help="Skip chunking and ingestion; only run verification checks on existing index",
    )
    parser.add_argument(
        "--skip-verify",
        action="store_true",
        help="Skip post-upload verification checks",
    )
    return parser.parse_args(args)


# ---------------------------------------------------------------------------
# Main Entry Point
# ---------------------------------------------------------------------------

def main(cli_args: list[str] | None = None) -> None:
    """Execute the full RAG ingestion pipeline."""
    opts = parse_cli_args(cli_args)

    print("=" * 60)
    print("Starting Portfolio RAG Ingestion Pipeline")
    print("=" * 60)
    
    base_dir = Path(__file__).resolve().parent
    custom_content = Path(opts.content_dir).resolve() if opts.content_dir else None

    # Handle verify-only flag
    if opts.verify_only:
        print("[INFO] --verify-only mode requested. Skipping document parsing and embedding.")
        credential = DefaultAzureCredential()
        search_client = SearchClient(
            endpoint=opts.search_endpoint,
            index_name=opts.index_name,
            credential=credential,
        )
        openai_client = initialize_openai_client(
            credential=credential,
            foundry_endpoint=opts.foundry_endpoint,
            openai_base_url=opts.openai_base_url,
        )
        success = verify_uploaded_index(
            search_client, opts.index_name, openai_client=openai_client
        )
        if not success:
            sys.exit(1)
        return

    # 1. Parse and chunk Markdown files
    chunks = collect_markdown_documents(base_dir, custom_content_dir=custom_content)
    if not chunks:
        print("[ERROR] No chunks found to ingest. Exiting.")
        return

    # Handle dry-run flag
    if opts.dry_run:
        print(f"\n[DRY-RUN] Successfully parsed and generated {len(chunks)} chunks.")
        print(f"[DRY-RUN] Schema and chunk validation complete. Exiting without cloud operations.")
        return

    # 2. Azure Authentication
    print("[INFO] Authenticating via DefaultAzureCredential...")
    credential = DefaultAzureCredential()

    # 3. Create or Update Azure AI Search Index
    index_client = SearchIndexClient(
        endpoint=opts.search_endpoint,
        credential=credential,
    )
    create_or_update_index(index_client, opts.index_name)

    # 4. Generate Embeddings via AIProjectClient
    openai_client = initialize_openai_client(
        credential=credential,
        foundry_endpoint=opts.foundry_endpoint,
        openai_base_url=opts.openai_base_url,
    )
    generate_embeddings(
        openai_client=openai_client,
        chunks=chunks,
        model_name=opts.embedding_model,
        batch_size=opts.embedding_batch_size,
    )

    # 5. Upload Chunks to Azure AI Search
    search_client = SearchClient(
        endpoint=opts.search_endpoint,
        index_name=opts.index_name,
        credential=credential,
    )
    upload_documents_to_search(
        search_client=search_client,
        chunks=chunks,
        batch_size=opts.upload_batch_size,
    )

    # 6. Verify Index and Metadata Queryability
    if not opts.skip_verify:
        success = verify_uploaded_index(
            search_client, opts.index_name, openai_client=openai_client
        )
        if not success:
            print("[ERROR] Verification checks failed after upload.")
            sys.exit(1)
    else:
        print("[INFO] Post-upload verification skipped via --skip-verify.")
    
    print("\n" + "=" * 60)
    print("Portfolio RAG Ingestion Pipeline Completed Successfully")
    print("=" * 60)


if __name__ == "__main__":
    main()


