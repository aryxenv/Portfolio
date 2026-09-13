---
id: "architecture-rag-strategy"
title: "Portfolio RAG Architecture & Ingestion Strategy"
type: "architecture"
category: "System Design"
status: "production"
tech_stack:
  - "Azure AI Foundry"
  - "Azure AI Search"
  - "Azure Cosmos DB"
  - "Azure Container Apps (ACA Express)"
  - "text-embedding-3-large"
  - "gpt-5.6-luna"
  - "Microsoft Agent Framework"
  - "Python"
  - "FastAPI"
  - "Docker"
  - "GitHub Container Registry (GHCR)"
  - "User-Assigned Managed Identity"
  - "Astro"
tags:
  - "rag"
  - "architecture"
  - "azure-container-apps"
  - "aca-express"
  - "azure-ai-search"
  - "azure-cosmos-db"
  - "azure-ai-foundry"
  - "docker"
  - "ghcr"
  - "managed-identity"
  - "openai"
  - "agent-framework"
  - "vector-search"
  - "embeddings"
  - "chunking"
  - "metadata"
summary: "Technical architecture and ingestion specification for Aryan Shah's portfolio RAG system, covering document parsing, header-based chunking, 3072-dimension embeddings via Azure AI Foundry, hybrid retrieval across Azure AI Search and Azure Cosmos DB NoSQL, Microsoft Agent Framework multi-turn orchestration, and zero-cost serverless hosting on Azure Container Apps (Express Mode) with User-Assigned Managed Identity."
source: "rag/rag_strategy.md"
---

# Portfolio RAG Architecture & Ingestion Strategy

## 1. Executive Summary & Architectural Overview

The Portfolio Retrieval-Augmented Generation (RAG) system provides interactive, context-grounded conversational search across Aryan Shah's professional career milestones, academic achievements, technical projects and engineering telemetry.

The architecture is built on enterprise-grade cloud AI services and a zero-cost serverless hosting tier:
- **Embedding Generation**: Azure AI Foundry (`ai-portfolio` project under `ai-portfolio-resource`) executing OpenAI's `text-embedding-3-large` (3072 dimensions) via `AIProjectClient`.
- **Vector & Keyword Indexing (AI Search)**: Azure AI Search (`ais-portfolio`) utilizing Hierarchical Navigable Small World (HNSW) vector search and full-text keyword indexing with rich OData metadata filtering.
- **Vector & Document Indexing (Cosmos DB)**: Azure Cosmos DB NoSQL (`cdb-portfolio`) providing document-oriented vector storage with DiskANN indexing, range/composite indexes for metadata filtering, and integrated cross-partition vector search.
- **LLM Inference & Agent Orchestration**: Microsoft Agent Framework orchestrating an Azure AI Foundry deployment running OpenAI's `gpt-5.6-luna` with native server-side conversation threads (`service_session_id`), autonomous tool calling and streaming response generation.
- **Backend Hosting & Server Runtime**: Containerized FastAPI backend running on **Azure Container Apps (Express Mode)** (`env-portfolio-express` in Sweden Central), scaling to zero (`minReplicas = 0`, `maxReplicas = 1`) with near-zero cold starts (<2s) and $0.00 idle compute/storage costs.
- **Identity & Security Architecture**: Keyless, zero-secret Entra ID authentication powered by `DefaultAzureCredential`. In production ACA, runtime requests utilize a User-Assigned Managed Identity (`id-portfolio-backend`, client ID: `e0d8e12d-be78-4b06-a259-58377ff0429a`) assigned granular RBAC roles for Azure AI Foundry, Cognitive Services OpenAI, Search Index Data Contributor, and Cosmos DB SQL Data-Plane RBAC.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                            Ingestion Pipeline                                │
│                                                                              │
│  Markdown Files ──> Header-Aware  ──> Context Enrichment ──> Azure AI        │
│  + YAML Metadata    Chunking          (Title + Path)         Foundry         │
│  (content/ & docs)  (H1, H2, H3)                             (3072 dims)     │
│                                                                   │          │
│                                                        ┌──────────┴────────┐ │
│                                                        │                   │ │
│                                                        ▼                   ▼ │
│                                              Azure AI Search     Cosmos DB   │
│                                              (ais-portfolio)   (cdb-portfolio)│
└───────────────────────────────────────────────────────────────────┬──────────┘
                                                                    │
┌───────────────────────────────────────────────────────────────────▼──────────┐
│                             Query Pipeline                                   │
│                                                                              │
│  User Query ──> ACA Express (Port 8000) ──> Agent Orchestrator ──> Foundry    │
│  (Portfolio UI) (min=0, max=1, UAMI)        (Server Session)    (gpt-5.6-luna)│
│                                                                        │     │
│                                                        ┌───────────────┴───┐ │
│                                                        │ Tool Calling      │ │
│                                                        ▼                   ▼ │
│                                                   Cosmos DB          AI Search│
│                                                   (DiskANN RRF)    (HNSW BM25)│
│                                                        │                   │ │
│  Client Stream <── StreamingResponse <── Grounded Generation <─────────────┘ │
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
- **Identity & Security**: Authenticated exclusively via Azure Entra ID bearer tokens using `DefaultAzureCredential`. During ingestion and verification, Entra CLI/environment credentials provide the token; during production ACA Express runtime, the container's User-Assigned Managed Identity (`id-portfolio-backend`) is automatically discovered via `AZURE_CLIENT_ID`.
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

## 6. Azure Cosmos DB NoSQL Indexing & Retrieval Schema

Document chunks and dense vectors are also indexed into Azure Cosmos DB NoSQL account `cdb-portfolio`, database `portfolio`, container `chunks`.

### Document Schema
Each chunk is stored as a JSON document with:
- `id`: Unique chunk identifier (`{doc_id}_{chunk_index}`).
- `chunk_id`: Same as `id`, used as the partition key.
- All metadata fields from YAML frontmatter (`title`, `type`, `category`, `company`, `role`, `project_name`, `tech_stack`, `tags`, `summary`, `source`, `week_number`, `nda_redacted`, `has_external_logs`, etc.).
- `content`: Enriched Markdown text chunk.
- `content_vector`: 3072-dimension dense vector embedding.

### Indexing Policy
- **Range Indexes**: Applied to all string, number, and boolean properties for efficient equality and range filtering.
- **Composite Indexes**: Configured for common multi-field query patterns (e.g., `type` + `company`, `company` + `week_number`).
- **Vector Index**: DiskANN index on `content_vector` with cosine distance metric and 3072 dimensions, enabling approximate nearest neighbor vector search.

### Vector Search Configuration
- **Algorithm**: DiskANN (disk-based approximate nearest neighbor).
- **Metric**: Cosine distance.
- **Search Mode**: Supports vector similarity queries via the `VectorDistance` SQL function, combined with standard SQL WHERE clauses for metadata filtering.
- **Access Control**: Keyless data-plane RBAC enforced using the Azure Cosmos DB Built-in Data Contributor SQL role (`00000000-0000-0000-0000-000000000002`) assigned to `id-portfolio-backend`.

## 7. Runtime Query & Generation Pipeline

When an end-user poses an inquiry on Aryan's portfolio:
1. **Query Ingestion**: The client island in the Astro frontend dispatches an HTTP request to the backend at `https://portfolio-backend.ashyglacier-b0d70426.swedencentral.azurecontainerapps.io/agent`. If the container is idle, Azure Container Apps Express mode initiates an immediate cold start (<2 seconds) to service the request.
2. **Session Persistence**: An in-memory session cache maintains the Azure OpenAI server-side conversation thread (`service_session_id`), enabling multi-turn dialog without client-side message replay.
3. **Autonomous Tool Selection**: The Microsoft Agent Framework agent (powered by `gpt-5.6-luna` via `FoundryChatClient`) interprets the prompt, reformulates search terms and autonomously invokes tools:
   - `vector_search`: Dispatches hybrid vector and keyword search to Azure Cosmos DB (`cdb-portfolio`, currently active) or Azure AI Search (`ais-portfolio`) with optional metadata filtering.
   - `inspect_metadata_options`: Explores available filter facets (companies, doc types, technologies) when queries require taxonomy verification.
4. **Hybrid Search Execution**: During tool execution, queries are converted into 3072-dimension vectors via `text-embedding-3-large` and retrieved using DiskANN (Cosmos DB) or HNSW (AI Search).
5. **Context Synthesis & Grounding**: The agent evaluates returned chunks, executes multi-hop retrieval if needed (up to 3 retrieval steps) and synthesizes a factual answer strictly grounded in retrieved documentation.
6. **Streaming Generation**: The server streams Server-Sent Events (SSE) back to the portfolio frontend in real time, delivering progressive token deltas, tool invocation notifications and final completion status.

## 8. Backend Hosting & Infrastructure Architecture (VM to ACA Express Migration)

The portfolio assistant backend was originally hosted on an Ubuntu Linux Azure Virtual Machine (`B1s`) with Nginx and a systemd daemon. To achieve a 100% zero-cost steady state with zero maintenance overhead, the backend was migrated to **Azure Container Apps (Express Mode)**.

### A. Architectural Rationale & Zero-Cost Guardrails
- **Eliminating Fixed Costs**: Running a 24/7 B1s VM incurred ongoing monthly charges for the Standard SSD OS disk (~$1.50/month) and reserved public IPv4 address (~$3.65/month). Decommissioning the VM, OS disk, public IP, NIC, and NSG reduced ongoing infrastructure spend to **$0.00**.
- **Serverless Scale-to-Zero**: ACA Express mode allows `minReplicas = 0`. The container completely shuts down when idle, consuming 0 vCPU and 0 GiB of memory. When a visitor opens the chat widget, Express mode spins up the container in under 2 seconds.
- **Usage Capping**: `maxReplicas = 1` guarantees that traffic surges remain strictly bounded well within the Azure Container Apps free monthly grant (180,000 vCPU-seconds, 360,000 GiB-seconds, and 2 million requests).
- **Log Analytics Zero-Cost**: The environment (`env-portfolio-express`) was provisioned with `--logs-destination none`, preventing the automatic creation of a billable Azure Log Analytics workspace.
- **Zero-Egress Sweden Central Co-location**: Co-locating the Container App, Cosmos DB (`cdb-portfolio`), AI Search (`ais-portfolio`), and AI Foundry (`ai-portfolio-resource`) within `swedencentral` eliminates intra-region network data egress charges.

### B. User-Assigned Managed Identity Architecture
Because Azure Container Apps Express mode does not support system-assigned managed identities, a dedicated User-Assigned Managed Identity (`id-portfolio-backend`) was established:
- **Identity Name**: `id-portfolio-backend`
- **Location**: `swedencentral`
- **Client ID**: `e0d8e12d-be78-4b06-a259-58377ff0429a`
- **Principal ID**: `b0943c5c-2961-4a60-8519-6119178e1516`

#### RBAC Permissions Matrix:
| Target Scope | Role Definition | Purpose |
| :--- | :--- | :--- |
| Resource Group (`portfolio`) | `Foundry User` | AI Foundry workspace project access |
| Resource Group (`portfolio`) | `Azure AI Developer` | AI Project client API operations |
| Resource Group (`portfolio`) | `Cognitive Services OpenAI User` | Chat inference (`gpt-5.6-luna`) & embeddings (`text-embedding-3-large`) |
| Resource Group (`portfolio`) | `Search Index Data Contributor` | Azure AI Search vector & document index queries |
| Resource Group (`portfolio`) | `DocumentDB Account Contributor` | Cosmos DB control-plane metadata resolution |
| Cosmos DB (`cdb-portfolio`) | Built-in Data Contributor (`00000000-...-0002`) | SQL data-plane reads, writes, and vector queries |

At container startup, passing `AZURE_CLIENT_ID=e0d8e12d-be78-4b06-a259-58377ff0429a` informs `DefaultAzureCredential` to select this user-assigned identity, enabling seamless authentication without storing secrets, API keys, or connection strings.

### C. Containerization & CI/CD Pipeline
- **Docker Packaging**: Configured via a consolidated [`server/Dockerfile`](file:///c:/Users/aryan/OneDrive/Portfolio/nodeDev/PortfolioDev/server/Dockerfile) using `ghcr.io/astral-sh/uv:python3.13-bookworm-slim`. Dependencies are installed from `uv.lock` with bytecode compilation (`UV_COMPILE_BYTECODE=1`) and `--frozen --no-dev` flags for minimum image size and fastest startup.
- **Registry**: Publicly distributed on **GitHub Container Registry** (`ghcr.io/aryxenv/portfolio-backend:latest`), completely eliminating the need to provision an Azure Container Registry (ACR).
- **Continuous Deployment**: [`.github/workflows/deploy-server.yml`](file:///c:/Users/aryan/OneDrive/Portfolio/nodeDev/PortfolioDev/.github/workflows/deploy-server.yml) triggers on pushes modifying `server/**` or the workflow itself:
  1. Builds and pushes multi-tag container images to GHCR using Buildx and GitHub Actions cache.
  2. Authenticates to Azure using OpenID Connect (OIDC / Federated Credentials) with zero long-lived secrets.
  3. Deploys or updates `portfolio-backend` in `env-portfolio-express`.
  4. Automatically polls and verifies the HTTPS `/health` endpoint before concluding the run.

## 9. Ingestion Script Execution & Synchronization

The RAG pipeline is organized into two backend-specific pipelines sharing common logic:

### Shared Components (`rag/`)
- `parser.py`: Markdown parsing, YAML frontmatter extraction, and header-aware chunking.
- `embeddings.py`: Azure AI Foundry embedding generation via `AIProjectClient`.
- `config.py`: Shared constants (embedding dimensions, batch sizes, endpoints).

### AI Search Pipeline (`rag/ai_search/`)
- Executed via `uv run ai_search/main.py`.
- Recreates or updates the index idempotently with full 30-field schema and HNSW vector configuration.

### Cosmos DB Pipeline (`rag/cosmosdb/`)
- Executed via `uv run cosmosdb/main.py`.
- Creates the database and container with vector, range, and composite indexing policies.
- Uploads chunks using upsert semantics with 429 rate-limit retry logic.

### Common CLI Flags
Both pipelines support:
- `--dry-run`: Locally parses and chunks documents without making Azure cloud API calls.
- `--verify-only`: Runs verification tests against the live index/container without re-ingesting.
- `--skip-verify`: Runs ingestion but skips post-upload verification.
- `--content-dir`: Overrides the default content directory path.
- `--file`: Re-indexes a single file incrementally without reprocessing the entire corpus.
- `--embedding-batch-size` and `--upload-batch-size`: Customizes throughput.

### Resilience
- Enforces resilient upload with positional result matching (preventing document loss when result keys are null) and automatic binary batch splitting on HTTP 413 (payload too large) or request timeouts.
- Normalizes all relative and explicit paths to POSIX forward-slash format for seamless cross-platform execution on Windows, Linux, and macOS.
- Sanitizes embedding inputs against empty strings and token length limits (8192 tokens) to guarantee zero `BadRequestError` exceptions during embedding generation.
- Accompanied by `verify.py` scripts for standalone verification and non-zero exit code reporting on failure.
