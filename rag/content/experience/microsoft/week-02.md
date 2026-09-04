---
id: "microsoft-week-02"
title: "Microsoft Internship - Week 2: AI for Research RAG Pipeline, Azure AI Search MCP & DP-900"
type: "experience"
company: "Microsoft"
role: "Solutions Engineer Intern (AI Apps / Data)"
week_number: 2
log_date: "2026-02-09 to 2026-02-13"
date_range: "Feb 2026"
location: "Zaventem, Belgium"
nda_redacted: true
tech_stack:
  - "Azure AI Search"
  - "Azure AI Foundry"
  - "Model Context Protocol (MCP)"
  - "Python"
  - "FastAPI"
  - "Vector Embeddings"
tags:
  - "microsoft"
  - "internship"
  - "rag"
  - "azure-ai-search"
  - "mcp"
  - "certifications"
  - "dp-900"
summary: "Engineered an end-to-end RAG pipeline connecting Azure AI Search with Azure AI Foundry, authored an MCP server exposing search index query tools, assisted fellow interns with cloud setup, and achieved Microsoft Certified: Azure Data Fundamentals (DP-900) certification."
source: "C:/Users/aryan/OneDrive/microsoft_internship_log/Week 2 - Build AI for Research, Learning.pdf"
---

# Microsoft Internship - Week 2: AI for Research RAG Pipeline, Azure AI Search MCP & DP-900

## Executive Summary

During Week 2, Aryan advanced from project scaffolding to active software development on the **AI for Research** platform. He engineered an end-to-end Retrieval-Augmented Generation (RAG) pipeline connecting Azure AI Search with Azure AI Foundry and authored a specialized Model Context Protocol (MCP) server that exposes vector and hybrid search capabilities as callable agent tools.

In parallel, Aryan provided technical onboarding assistance to peer interns experiencing Azure tenant subscription hurdles and dedicated structured learning hours toward professional certification, successfully passing the **Microsoft Certified: Azure Data Fundamentals (DP-900)** examination.

---

## Key Technical Initiatives & Architecture

### 1. AI for Research RAG Pipeline Architecture
```text
[Research Papers / PDF Datasets]
              │
              ▼
   [Azure AI Search Ingestion]
   ├── Document Cracking & Chunking
   ├── Azure OpenAI text-embedding-3-large
   └── Hybrid Search Index (Vector + BM25)
              │
              ▼
   [Custom Python MCP Server]
   ├── Tool: query_research_index(query, filters)
   └── Tool: get_document_by_id(doc_id)
              │
              ▼ (JSON-RPC Protocol)
   [Azure AI Foundry Agent Orchestrator]
   └── Grounded Responses with Citations
```

- **Index Design**: Configured Azure AI Search with semantic ranking, hybrid search algorithms (BM25 keyword matching combined with dense vector embeddings), and metadata field filtering (author, publication year, research domain).
- **MCP Server Implementation**:
  - Developed a standalone Python server implementing the MCP specification over standard I/O (`stdio`).
  - Exposed granular tool definitions allowing autonomous agents to execute parameterized index queries, retrieve relevant chunk passages, and inspect full document source texts.

### 2. Professional Certification: DP-900 Pass
- Completed structured study modules covering core data concepts, relational data processing on Azure SQL, non-relational storage patterns with Azure Cosmos DB, and enterprise analytics architectures with Microsoft Fabric and Azure Synapse.
- Successfully sat and passed the official exam, validating core foundational competencies across enterprise data systems.

---

## Detailed Weekly Engineering Log

### Monday, February 9, 2026
- **Architecture Refinement**: Defined the data flow and tool schema for the AI for Research MCP server; aligned requirements with fellow engineering interns.
- **RAG Data Preparation**: Ingested sample scientific literature and research papers into Azure Blob Storage; established automated indexer pipelines in Azure AI Search.

### Tuesday, February 10, 2026
- **MCP Server Coding**: Implemented the Python MCP server using FastAPI and official protocol bindings; established error handling and connection timeout guards.
- **Azure AI Search Client Integration**: Integrated the `@azure/search-documents` SDK, implementing hybrid search query execution and semantic re-ranking.

### Wednesday, February 11, 2026
- **Agent Orchestrator Integration**: Connected the MCP server to Azure AI Foundry; validated that GPT-4o models correctly invoked the `query_research_index` tool when responding to domain-specific scientific inquiries.
- **Peer Intern Technical Support**: Assisted peer interns in debugging Azure subscription provisioning errors and configuring local development environments.

### Thursday, February 12, 2026
- **End-to-End Testing & Latency Profiling**: Conducted stress-testing across multi-hop research queries; optimized embedding cache layers and verified citation precision.
- **Certification Preparation**: Dedicated evening study hours to review Microsoft Azure Data Fundamentals (DP-900) exam objectives.

### Friday, February 13, 2026
- **DP-900 Examination**: Sat for the official Microsoft Certified: Azure Data Fundamentals exam and achieved a passing score.
- **Sprint Retrospective & Demo Planning**: Presented the working RAG + MCP demonstration to the solutions engineering mentor; established requirements for an upcoming live showcase for academic researchers.

---

## Challenges Overcome & Engineering Decisions

1. **Handling Varied Chunk Lengths in Scientific Papers**:
   - *Challenge*: Standard fixed-token slicing fragmented equations and bibliographic references across boundaries.
   - *Decision*: Configured header-aware markdown and section-based chunking with 150-token overlap, preserving semantic coherence across dense technical passages.
2. **MCP Tool Parameter Typing**:
   - *Challenge*: Early agent invocations occasionally passed unstructured strings instead of typed JSON filters.
   - *Decision*: Implemented strict Pydantic schema validation on the MCP server, returning descriptive error messages that guide the LLM to self-correct invalid inputs.

---

## Collaboration & Team Dynamics

- **Cohort Knowledge Sharing**: Shared configuration templates and Azure CLI provisioning scripts with fellow interns, reducing onboarding friction.
- **Mentorship Feedback**: Received positive recognition from senior mentors for rapid turnaround from conceptual discussion to working code.

---

## Technologies & Tools Utilized

- **Cloud & AI Platforms**: Azure AI Foundry, Azure AI Search, Azure OpenAI Service.
- **Protocols & Standards**: Model Context Protocol (MCP), JSON-RPC.
- **Languages & Frameworks**: Python 3.11, Pydantic, FastAPI.
- **Certifications**: Microsoft Certified: Azure Data Fundamentals (DP-900).
