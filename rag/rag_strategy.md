---
id: "architecture-rag-strategy"
title: "Portfolio RAG Architecture & Ingestion Strategy"
type: "architecture"
category: "System Design"
status: "production"
tech_stack:
  - "Azure AI Foundry"
  - "Azure AI Search"
  - "text-embedding-3-large"
  - "Python"
  - "Groq"
  - "FastAPI"
  - "Astro"
tags:
  - "rag"
  - "architecture"
  - "azure-ai-search"
  - "azure-ai-foundry"
  - "vector-search"
  - "embeddings"
  - "chunking"
  - "metadata"
summary: "Technical architecture and ingestion specification for Aryan Shah's portfolio RAG system, covering document parsing, header-based chunking, 3072-dimension embeddings via Azure AI Foundry, and hybrid retrieval in Azure AI Search."
source: "rag/rag_strategy.md"
---

# Portfolio RAG Architecture & Ingestion Strategy

## 1. Executive Summary & Architectural Overview

The Portfolio Retrieval-Augmented Generation (RAG) system provides interactive, context-grounded conversational search across Aryan Shah's professional career milestones, academic achievements, technical projects, and engineering telemetry.

The architecture is built on enterprise-grade cloud AI services:
- **Embedding Generation**: Azure AI Foundry (`ai-portfolio` project under `ai-portfolio-resource`) executing OpenAI's `text-embedding-3-large` (3072 dimensions) via `AIProjectClient`.
- **Vector & Keyword Indexing**: Azure AI Search (`ais-portfolio`) utilizing Hierarchical Navigable Small World (HNSW) vector search and full-text keyword indexing with rich OData metadata filtering.
- **LLM Inference**: Ultra-low latency generation powered by Groq (Llama 3 / Mixtral) with streaming Server-Sent Events (SSE).
- **Authentication**: Zero-secret credential flow powered by Microsoft Entra ID via `DefaultAzureCredential`.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                            Ingestion Pipeline                                │
│                                                                              │
│  Markdown Files ──> Header-Aware  ──> Context Enrichment ──> Azure AI        │
│  + YAML Metadata    Chunking          (Title + Path)         Foundry         │
│  (content/ & docs)  (H1, H2, H3)                             (3072 dims)     │
│                                                                   │          │
│                                                                   ▼          │
│                                                       Azure AI Search        │
│                                                       (ais-portfolio Index)  │
└───────────────────────────────────────────────────────────────────┬──────────┘
                                                                    │
┌───────────────────────────────────────────────────────────────────▼──────────┐
│                             Query Pipeline                                   │
│                                                                              │
│  User Query ──> Query Embedding ──> Hybrid Retrieval ──> Prompt Assembly ──> │
│  (Portfolio UI) (Azure AI Foundry)  (ais-portfolio)      + Groq Inference    │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 2. Content Organization & Metadata Schema

Content is organized hierarchically in `/content` and document roots to maintain clean topic isolation and avoid cross-domain hallucination:

```text
/rag
├── rag_strategy.md           # Architecture & ingestion specification
├── content/
│   ├── about/                # Biography, contact info, and skills inventory
│   ├── blog/                 # Technical articles and engineering writeups
│   ├── experience/
│   │   ├── microsoft/        # 26-week internship logs and executive overview
│   │   └── pickit-3d/        # Robotics frontend & AI development trackers
│   └── projects/             # Architecture overviews for featured software
```

### Metadata Standards
Every document includes YAML frontmatter providing structured facets for search filtering:
- `id`: Unique document identifier (e.g., `about-bio`, `project-aks-agent-governance`, `microsoft-overview`).
- `title`: Formal human-readable title.
- `type`: Content classification (`about`, `project`, `experience`, `blog`, `architecture`).
- `category`: Domain taxonomy (e.g., `Cloud & AI Infrastructure`, `Robotics & Frontend`).
- `company`: Associated organization (e.g., `Microsoft`, `Pickit 3D`).
- `role`: Professional position or title.
- `project_name`: Specific project title.
- `tech_stack`: Array of associated technologies and frameworks.
- `tags`: Search keywords for faceted navigation.
- `summary`: High-level abstract summarizing the document.
- `source`: Relative repository path of the original artifact.
- `week_number`: Internship or timeline week sequence number.
- `nda_redacted`: Boolean flag indicating if proprietary customer details have been sanitized.
- `has_external_logs`: Boolean flag indicating whether external telemetry or log files exist.

## 3. Header-Aware Chunking Strategy

Standard token-window splitting risks fragmenting cohesive technical discussions across arbitrary sentence boundaries. This architecture employs **Markdown Header-Aware Chunking**:

1. **Semantic Boundaries**: Text is segmented along structural Markdown headers (H1 `#`, H2 `##`, H3 `###`), supporting standard ATX indentation (up to 3 spaces).
2. **Code Fence Awareness**: Fenced code blocks (```` ``` ```` and `~~~`) are tracked explicitly with delimiter length and info-string awareness. Closing code fences must have no trailing info strings, preventing premature block closure from embedded code, while inline backticks or info strings containing fence characters cannot initiate spurious code blocks. Comments starting with `#` are preserved as code rather than falsely treated as section headers.
3. **ATX Heading Sanitization**: Trailing ATX hash sequences are stripped with whitespace lookbehind (e.g., `## Title ##` becomes `Title`), while accurately preserving trailing `#` symbols in programming language names (such as `C#` or `F#`).
4. **Hierarchical Breadcrumbs**: A dynamic header stack maintains the full navigation path (e.g., `Aryan Shah - Biography > Academic Credentials > Key Coursework Performance`), ensuring hierarchical context is inherited by subordinate chunks.
5. **Context Enrichment**: To prevent orphaned bullet points or code snippets from losing their origin, each chunk is enriched with its parent document title, category, company, week number, and section breadcrumbs prior to embedding.
6. **Universal Encoding & BOM Support**: Files are decoded with UTF-8 BOM resilience (`utf-8-sig`) and tolerant frontmatter extraction supporting optional leading blank lines.

## 4. Vector Embedding Generation via Azure AI Foundry

Embeddings are generated using OpenAI's high-capacity `text-embedding-3-large` model:
- **Dimensionality**: 3072 floating-point dimensions.
- **Client Architecture**: Instantiated using the modern `AIProjectClient` from the `azure-ai-projects` package, avoiding deprecated legacy clients.
- **Foundry Endpoint**: Points directly to the project workspace `ai-portfolio` under resource `ai-portfolio-resource` in resource group `portfolio`.
- **Identity & Security**: Authenticated exclusively via Azure Entra ID bearer tokens using `DefaultAzureCredential`.
- **Batch Processing**: Requests are batched with exponential backoff to maximize throughput and tolerate rate limits.

## 5. Azure AI Search Indexing & Retrieval Schema

Document chunks and dense vectors are indexed into Azure AI Search service `ais-portfolio` within index `ais-portfolio`.

### Index Schema Definition
- `chunk_id` (`Edm.String`, Key, Filterable, Sortable): Unique sanitized key for each chunk (`{doc_id}_{chunk_index}`).
- `id` (`Edm.String`, Filterable, Facetable, Searchable, Sortable): Original document identifier.
- `doc_id` (`Edm.String`, Filterable, Facetable, Searchable): Document identifier reference.
- `chunk_index` (`Edm.Int32`, Filterable, Sortable): Zero-based sequential chunk index.
- `total_chunks` (`Edm.Int32`, Filterable): Total chunk count for the parent document.
- `title` (`Edm.String`, Searchable, Filterable, Sortable): Document title.
- `header` (`Edm.String`, Searchable, Filterable): Specific header title for the chunk.
- `header_path` (`Edm.String`, Searchable, Filterable): Breadcrumb path of headers.
- `type` (`Edm.String`, Searchable, Filterable, Facetable): Document classification.
- `category` (`Edm.String`, Searchable, Filterable, Facetable): Topic category.
- `company` (`Edm.String`, Searchable, Filterable, Facetable): Associated enterprise.
- `role` (`Edm.String`, Searchable, Filterable): Job role or position.
- `project_name` (`Edm.String`, Searchable, Filterable): Associated project.
- `tech_stack` (`Collection(Edm.String)`, Searchable, Filterable, Facetable): Technology stack items.
- `tags` (`Collection(Edm.String)`, Searchable, Filterable, Facetable): Search tags.
- `summary` (`Edm.String`, Searchable): Executive abstract.
- `source` (`Edm.String`, Filterable): Relative file path or origin reference.
- `location` (`Edm.String`, Searchable, Filterable): Geographic location if applicable.
- `date_range` (`Edm.String`, Filterable): Duration or timeline string.
- `log_date` (`Edm.String`, Filterable): Individual log or journal entry date.
- `status` (`Edm.String`, Filterable): Project or milestone status.
- `education` (`Edm.String`, Searchable): Educational institution or credential.
- `github_url` (`Edm.String`, Filterable): Source repository link.
- `demo_url` (`Edm.String`, Filterable): Live deployment or artifact link.
- `personal_interests` (`Collection(Edm.String)`, Searchable, Filterable, Facetable): Personal hobbies or interests.
- `week_number` (`Edm.Int32`, Filterable, Sortable, Facetable): Internship or timeline week sequence number.
- `nda_redacted` (`Edm.Boolean`, Filterable, Facetable): Flag indicating whether confidential proprietary details are redacted.
- `has_external_logs` (`Edm.Boolean`, Filterable, Facetable): Flag indicating whether external telemetry or log files are associated.
- `content` (`Edm.String`, Searchable): Enriched Markdown text chunk.
- `content_vector` (`Collection(Edm.Single)`, Searchable): 3072-dimension dense vector representation.

### Vector Search Configuration
- **Algorithm**: Hierarchical Navigable Small World (`HNSW`).
- **Metric**: Cosine Similarity (`VectorSearchAlgorithmMetric.COSINE`).
- **Search Mode**: Supports pure vector search, hybrid vector + keyword BM25 search, and filtered semantic queries.

## 6. Runtime Query & Generation Pipeline

When an end-user poses an inquiry on Aryan's portfolio:
1. **Query Processing**: The user's prompt is converted into a 3072-dimension query vector using `text-embedding-3-large`.
2. **Hybrid Search Execution**: Azure AI Search evaluates cosine similarity against `content_vector` while executing BM25 term matching on `content`, `title`, and `tech_stack`.
3. **Faceted Filtering**: Optional metadata filters (e.g., `$filter=company eq 'Microsoft' and week_number eq 5` or `$filter=tech_stack/any(t: t eq 'FastAPI')`) restrict search space deterministically.
4. **Context Injection**: Top candidate chunks (typically 3 to 5) are extracted and injected into the Groq LLM system prompt.
5. **Streaming Generation**: Groq streams the grounded answer back to the frontend with citation breadcrumbs.

## 7. Ingestion Script Execution & Synchronization

The RAG pipeline is executed via a functional Python script in `main.py`:
- Executed cleanly using `uv run main.py`.
- Authenticates without API keys or connection strings using Azure CLI login credentials (`DefaultAzureCredential`).
- Recreates or updates the index idempotently with full 30-field schema and HNSW vector configuration.
- Parses all repository content files and uploads enriched chunks with vectors.
- Supports flexible CLI flags and environment variables:
  - `--dry-run`: Locally parses and chunks documents, validating frontmatter schemas and chunk structures without making Azure cloud API calls.
  - `--verify-only`: Runs the 10 comprehensive index verification tests against Azure AI Search and Azure AI Foundry without re-ingesting documents.
  - `--content-dir`: Overrides default content directory path.
  - `--index-name`, `--search-endpoint`, `--foundry-endpoint`, `--openai-base-url`, `--embedding-model`: Customizes cloud resource endpoints.
  - `--embedding-batch-size` and `--upload-batch-size`: Customizes throughput.
- Enforces resilient upload with positional result matching (preventing document loss when result keys are null) and automatic binary batch splitting on HTTP 413 (payload too large) or request timeouts.
- Normalizes all relative and explicit paths to POSIX forward-slash format for seamless cross-platform execution on Windows, Linux, and macOS.
- Sanitizes embedding inputs against empty strings and token length limits (8192 tokens) to guarantee zero `BadRequestError` exceptions during embedding generation.
- Accompanied by `verify.py` for standalone verification and non-zero exit code reporting on failure.
