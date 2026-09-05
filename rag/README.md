for all things rag related to the project.

## Ingestion Pipeline Options

The RAG ingestion pipeline allows processing markdown content into chunks, vectorizing them, and pushing them to a vector database.

### AI Search Pipeline

The ingestion pipeline for Azure AI Search is located in ai_search/main.py.

`bash

# Run the full ingestion and verification pipeline

uv run ai_search/main.py

# Skip calling Azure APIs and just chunk the files locally (useful for debugging chunk outputs)

uv run ai_search/main.py --dry-run

# Run the upload, but skip the post-upload search queries/verification checks

uv run ai_search/main.py --skip-verify

# Skip uploading completely and only run verification checks on the existing index

uv run ai_search/main.py --verify-only

# Ingest from a custom directory instead of the default 'content/'

uv run ai_search/main.py --content-dir path/to/other/content
`

### Shared Logic

Shared logic between vector database pipelines (like markdown parsing, header-aware chunking, and Azure AI Foundry embedding generation) are kept in the root of `rag/` (e.g. `parser.py`, `embeddings.py`, `config.py`).

### Cosmos DB Pipeline

The ingestion pipeline for Cosmos DB NoSQL is located in `cosmosdb/main.py`.

```bash
# Run the full ingestion and verification pipeline
uv run cosmosdb/main.py

# Dry-run: parse and chunk locally without hitting Cosmos DB
uv run cosmosdb/main.py --dry-run

# Run the upload, but skip post-upload verification checks
uv run cosmosdb/main.py --skip-verify

# Only run verification checks on the existing container
uv run cosmosdb/main.py --verify-only

# Ingest from a custom directory instead of the default 'content/'
uv run cosmosdb/main.py --content-dir path/to/other/content
```

### Automated CI/CD Pipeline (GitHub Actions)

The repository includes an automated incremental indexing pipeline in `.github/workflows/rag-index.yml`.

- **Trigger:** Triggers only when a PR is merged into `main` or direct push to `main` occurs **AND** files in `rag/content/**` have changed.
- **Authentication:** Uses Azure OIDC Workload Identity / Federated Credentials (`azure/login@v2`). No static credentials or client secrets stored.
- **Package Manager:** Powered by `uv` (`astral-sh/setup-uv@v6`) with lockfile dependency caching (`rag/uv.lock`).
- **Upsert & Change Detection:**
  - `ci_index.py` detects added, modified, or deleted markdown files via `git diff`.
  - Computes SHA-256 content hashes cached in `.content_hashes.json` (restored via GitHub Actions cache) to avoid re-embedding unchanged documents.
  - Automatically cleans up stale chunks for deleted documents from both Azure AI Search and Cosmos DB.
  - Clears existing chunks for modified documents prior to re-upload to ensure chunk count reductions don't leave orphaned chunks behind.
- **Manual Trigger:** Available via GitHub Actions `workflow_dispatch` with an optional `full_reindex` flag.

```bash
# Run incremental change detection locally
uv run ci_index.py

# Run dry-run parse on specific changed files
uv run ci_index.py --dry-run --files content/about/bio.md

# Force full re-index of all content files
uv run ci_index.py --all
```

