"""Portfolio RAG Ingestion Pipeline for Azure Cosmos DB NoSQL."""
from __future__ import annotations

import argparse
import logging
import os
import sys
from pathlib import Path

# Ensure local directories take precedence in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from azure.identity import DefaultAzureCredential

from config import (
    DEFAULT_AZURE_OPENAI_BASE_URL,
    DEFAULT_AZURE_SUBSCRIPTION_ID,
    DEFAULT_COSMOS_ACCOUNT_NAME,
    DEFAULT_COSMOS_CONTAINER_NAME,
    DEFAULT_COSMOS_DATABASE_NAME,
    DEFAULT_COSMOS_ENDPOINT,
    DEFAULT_COSMOS_RESOURCE_GROUP,
    DEFAULT_EMBEDDING_MODEL,
    DEFAULT_FOUNDRY_PROJECT_ENDPOINT,
    EMBEDDING_BATCH_SIZE,
    UPLOAD_BATCH_SIZE,
)
from parser import collect_markdown_documents, collect_single_file
from embeddings import initialize_openai_client, generate_embeddings
from cosmos import (
    create_or_update_cosmos_resources,
    upload_documents_to_cosmos,
    verify_uploaded_container,
)

# ---------------------------------------------------------------------------
# CLI Argument Parsing
# ---------------------------------------------------------------------------

def parse_cli_args(args: list[str] | None = None) -> argparse.Namespace:
    """Parse command-line arguments for the Cosmos DB ingestion pipeline."""
    parser = argparse.ArgumentParser(
        description="Portfolio RAG Ingestion Pipeline (Azure Cosmos DB NoSQL + Azure AI Foundry)",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--content-dir",
        type=str,
        default=None,
        help="Path to markdown content directory (defaults to 'content' next to script)",
    )
    parser.add_argument(
        "--account-name",
        type=str,
        default=DEFAULT_COSMOS_ACCOUNT_NAME,
        help="Cosmos DB account name",
    )
    parser.add_argument(
        "--database-name",
        type=str,
        default=DEFAULT_COSMOS_DATABASE_NAME,
        help="Cosmos DB database name",
    )
    parser.add_argument(
        "--container-name",
        type=str,
        default=DEFAULT_COSMOS_CONTAINER_NAME,
        help="Cosmos DB container name",
    )
    parser.add_argument(
        "--cosmos-endpoint",
        type=str,
        default=DEFAULT_COSMOS_ENDPOINT,
        help="Cosmos DB endpoint URL",
    )
    parser.add_argument(
        "--resource-group",
        type=str,
        default=DEFAULT_COSMOS_RESOURCE_GROUP,
        help="Azure Resource Group for Cosmos DB account",
    )
    parser.add_argument(
        "--subscription-id",
        type=str,
        default=DEFAULT_AZURE_SUBSCRIPTION_ID,
        help="Azure Subscription ID",
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
        help="Batch size for Cosmos DB upload",
    )
    parser.add_argument(
        "--file",
        type=str,
        default=None,
        help="Re-index a single markdown file incrementally (skips full corpus scan)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Parse and chunk files locally without calling Azure cloud APIs",
    )
    parser.add_argument(
        "--verify-only",
        action="store_true",
        help="Skip chunking and ingestion; only run verification checks on existing container",
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
    """Execute the full Cosmos DB RAG ingestion pipeline."""
    opts = parse_cli_args(cli_args)

    print("=" * 60)
    print("Starting Portfolio RAG Ingestion Pipeline (Azure Cosmos DB)")
    print("=" * 60)

    base_dir = Path(__file__).resolve().parent.parent
    custom_content = Path(opts.content_dir).resolve() if opts.content_dir else None

    # Handle verify-only flag
    if opts.verify_only:
        print("[INFO] --verify-only mode requested. Skipping document parsing and embedding.")
        credential = DefaultAzureCredential()
        _, container_client = create_or_update_cosmos_resources(
            credential=credential,
            account_name=opts.account_name,
            database_name=opts.database_name,
            container_name=opts.container_name,
            cosmos_endpoint=opts.cosmos_endpoint,
            resource_group=opts.resource_group,
            subscription_id=opts.subscription_id,
        )
        openai_client = initialize_openai_client(
            credential=credential,
            foundry_endpoint=opts.foundry_endpoint,
            openai_base_url=opts.openai_base_url,
        )
        success = verify_uploaded_container(
            container_client=container_client,
            openai_client=openai_client,
            credential=credential,
            embedding_model=opts.embedding_model,
        )
        if not success:
            sys.exit(1)
        return

    # 1. Parse and chunk Markdown files
    if opts.file:
        chunks = collect_single_file(Path(opts.file))
    else:
        chunks = collect_markdown_documents(base_dir, custom_content_dir=custom_content)
    if not chunks:
        print("[ERROR] No chunks found to ingest. Exiting.")
        return

    # Handle dry-run flag
    if opts.dry_run:
        print(f"\n[DRY-RUN] Successfully parsed and generated {len(chunks)} chunks.")
        print("[DRY-RUN] Schema and chunk validation complete. Exiting without cloud operations.")
        return

    # 2. Azure Authentication via DefaultAzureCredential
    print("[INFO] Authenticating via DefaultAzureCredential...")
    credential = DefaultAzureCredential()

    # 3. Create or verify Cosmos DB Database and Container with vector/composite index
    _, container_client = create_or_update_cosmos_resources(
        credential=credential,
        account_name=opts.account_name,
        database_name=opts.database_name,
        container_name=opts.container_name,
        cosmos_endpoint=opts.cosmos_endpoint,
        resource_group=opts.resource_group,
        subscription_id=opts.subscription_id,
    )

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

    # 5. Upload Chunks to Azure Cosmos DB
    upload_documents_to_cosmos(
        container_client=container_client,
        chunks=chunks,
        batch_size=opts.upload_batch_size,
    )

    # 6. Verify Container and Vector/Metadata Queryability
    if not opts.skip_verify:
        success = verify_uploaded_container(
            container_client=container_client,
            openai_client=openai_client,
            credential=credential,
            embedding_model=opts.embedding_model,
        )
        if not success:
            print("[ERROR] Verification checks failed after upload.")
            sys.exit(1)
    else:
        print("[INFO] Post-upload verification skipped via --skip-verify.")

    print("\n" + "=" * 60)
    print("Portfolio Cosmos DB RAG Ingestion Pipeline Completed Successfully")
    print("=" * 60)


if __name__ == "__main__":
    main()
