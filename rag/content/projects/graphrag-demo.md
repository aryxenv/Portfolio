---
id: "project-graphrag-demo"
title: "GraphRAG Demo - Microsoft AI Tour Knowledge Graph vs Vector Search"
type: "project"
project_name: "GraphRAG Demo"
status: "green"
category: "AI & Knowledge Systems"
github_url: "https://github.com/aryxenv/graphrag-demo"
demo_url: ""
tech_stack:
  - "React"
  - "TypeScript"
  - "Fluent UI"
  - "FastAPI"
  - "Server-Sent Events (SSE)"
  - "Three.js / 3D Graph"
  - "Azure AI Search"
  - "Microsoft Foundry"
  - "GPT-4.1"
  - "Bicep"
  - "Azure Developer CLI (azd)"
tags:
  - "graphrag"
  - "rag"
  - "knowledge-graph"
  - "azure-ai-search"
  - "foundry"
  - "fluent-ui"
  - "fastapi"
  - "3d-graph"
  - "bicep"
summary: "A customer-facing demonstration developed for the Microsoft AI Tour comparing vanilla vector RAG against Microsoft GraphRAG through an interactive React/Fluent UI client, FastAPI SSE streaming backend, 3D knowledge graph visualizer, and automated Bicep/azd deployment."
source: "src/data/projects.ts"
---

# GraphRAG Demo - Microsoft AI Tour Knowledge Graph vs Vector Search

## Project Overview
While standard Retrieval-Augmented Generation (Vanilla RAG) has become the default architecture for question answering over unstructured enterprise documents, it struggles with **global summarization questions** (such as *"What are the primary recurring themes across this entire archive?"* or *"How are these organizations structurally linked through intermediaries?"*). Standard vector search retrieves isolated chunks based on localized semantic similarity, failing to synthesize broad thematic connections.

Developed as a flagship technical demonstration for the **Microsoft AI Tour** and enterprise architectural briefings, the **GraphRAG Demo** provides a side-by-side comparison between traditional vector RAG and Microsoft's **GraphRAG** framework. Through a clean React/Fluent UI interface and a 3D interactive knowledge graph explorer, enterprise stakeholders can visually witness how entity extraction, relationship mapping, and hierarchical community clustering revolutionize complex document intelligence.

## Technical Architecture & Pipeline

```text
[ Unstructured Documents ]
           |
           v
[ GraphRAG Indexing Pipeline (Foundry / GPT-4.1) ]
  - Entity & Relationship Extraction
  - Claim & Covariate Extraction
  - Hierarchical Leiden Community Clustering
           |
           +--------------------------------+
           |                                |
           v                                v
[ Graph Database / Vector Index ]   [ Community Summaries ]
(Azure AI Search / Neo4j)          (Level 0, 1, 2 Reports)
           |                                |
           +--------------------------------+
                           |
                           v
              [ FastAPI Backend Service ]
             (SSE Streaming Orchestrator)
                           |
        +------------------+------------------+
        |                                     |
        v                                     v
[ 3D Graph Explorer (Three.js) ]    [ Dual RAG Query Interface ]
- Interactive node clustering       - Vanilla Vector RAG vs
- Relationship inspection           - GraphRAG Global/Local Search
```

### 1. The GraphRAG Indexing Engine
The pipeline leverages large language models hosted on **Microsoft Foundry** to parse unstructured document corpora into structured knowledge graphs:
- **Entity & Relationship Extraction**: Identifies domain entities (organizations, individuals, locations, concepts) and extracts semantic relationships with descriptive relationship statements.
- **Hierarchical Community Detection**: Applies the **Leiden algorithm** to detect community clusters at multiple hierarchical granularities (Root, Level 1, Level 2).
- **Pre-computed Community Summaries**: Synthesizes structured summaries for every community cluster in advance, enabling instant answer generation for macroscopic queries without scanning millions of individual tokens at query time.

### 2. Side-by-Side Dual Comparison Interface
The web client features a synchronized dual-pane inspection interface:
- **Pane 1: Vanilla Vector RAG**: Queries Azure AI Search using hybrid vector search (dense embeddings + sparse BM25 keyword matching) and semantic reranking. Highlights limitations when queries require aggregating facts spread across hundreds of disparate documents.
- **Pane 2: GraphRAG Search**: Leverages both Global Search (querying pre-computed community summaries) and Local Search (navigating immediate neighbor entity graphs). Demonstrates comprehensive coverage, higher factual accuracy, and reduced hallucination rates.

### 3. Interactive 3D Knowledge Graph Visualization
- Built with React, TypeScript, and **Three.js / 3D Force-Directed Graph**.
- Users can manipulate, zoom, and rotate the 3D entity space.
- Clicking any entity node highlights connected sub-graphs, reveals source text snippets, and displays extracted relationship properties and community affiliations.

### 4. Enterprise-Grade Delivery & IaC Scaffolding
- **FastAPI SSE Streaming Backend**: Emits Server-Sent Events delivering token deltas, source citations, community level tags, and reasoning metadata in real time.
- **Bicep & Azure Developer CLI (`azd`)**: Complete Infrastructure-as-Code scripts provision Azure OpenAI deployments, Azure AI Search instances, container compute, and Managed Identities with a single `azd up` command.

## Key Technical Specifications & Links
- **Project Name**: GraphRAG Demo
- **Status**: Production / Active (`green`)
- **Primary Category**: AI & Knowledge Systems
- **GitHub Repository**: [https://github.com/aryxenv/graphrag-demo](https://github.com/aryxenv/graphrag-demo)
- **Primary Event Showcase**: Microsoft AI Tour, Customer Innovation Hub Demos
- **Tech Stack**: React, TypeScript, Fluent UI, FastAPI, Three.js, Azure AI Search, Microsoft Foundry, Bicep, azd
