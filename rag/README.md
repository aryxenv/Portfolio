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

Shared logic between vector database pipelines (like markdown parsing, header-aware chunking, and Azure AI Foundry embedding generation) are kept in the root of
ag/ (e.g. parser.py, embeddings.py, config.py).
