---
id: "microsoft-week-04"
title: "Microsoft Internship - Week 4: AI for Research Live Demo, Document Extraction & Strategic Shadowing"
type: "experience"
company: "Microsoft"
role: "Solutions Engineer Intern (AI Apps / Data)"
week_number: 4
log_date: "2026-02-23 to 2026-02-27"
date_range: "Feb 2026"
location: "Zaventem, Belgium"
nda_redacted: true
tech_stack:
  - "Azure AI Foundry"
  - "Azure AI Search"
  - "Model Context Protocol (MCP)"
  - "Azure Document Intelligence"
  - "Python"
  - "FastAPI"
tags:
  - "microsoft"
  - "internship"
  - "public-speaking"
  - "live-demo"
  - "ai-for-research"
  - "document-intelligence"
  - "customer-shadowing"
summary: "Delivered a live technical demonstration of the AI for Research platform to 50+ academic researchers, contributed to an enterprise document intelligence pipeline, performed HPC/GPU sizing, and shadowed strategic customer AI transformations."
source: "C:/Users/aryan/OneDrive/microsoft_internship_log/Week 4 - AI for Research Event, Shadowing, Learning, an enterprise document intelligence and structured data extraction pipeline.pdf"
---

# Microsoft Internship - Week 4: AI for Research Live Demo, Document Extraction & Strategic Shadowing

## Executive Summary

Week 4 represented a major milestone in public presentation and customer-facing delivery. Aryan took the stage at the official **AI for Research** event, presenting a live, interactive demonstration of the Retrieval-Augmented Generation (RAG) and Model Context Protocol (MCP) solution to an audience of over 50 academic researchers and university stakeholders.

In addition to this public delivery, Aryan contributed to an enterprise document intelligence and structured data extraction pipeline, performed high-performance computing (HPC) and GPU cluster sizing for enterprise accounts, and shadowed strategic customer sessions with a global satellite telecommunications provider and a premier maritime container port authority.

---

## Key Technical Initiatives & Architecture

### 1. Live Public Showcase: AI for Research Event
- **Audience**: 50+ researchers, university professors, and data science leads from major Belgian academic institutions.
- **Demonstration Architecture**:
  - Live query processing showing how Azure AI Foundry orchestrates tool calls to an Azure AI Search MCP server.
  - Multi-hop reasoning across scientific literature, extracting verifiable citations and page references from ingested PDF corpora.
  - Real-time interaction answering audience questions regarding index scaling, custom embedding models, and data security boundaries.

### 2. Enterprise Document Intelligence & Extraction Pipeline
- **Objective**: Develop an automated extraction pipeline capable of parsing semi-structured and unstructured enterprise contracts, technical specification sheets, and financial forms into structured JSON schemas.
- **Technical Pipeline**:
  - Integrated Azure Document Intelligence (prebuilt-layout and custom neural models).
  - Designed automated post-processing validation scripts enforcing schema compliance and flagging ambiguous extraction confidence scores.

### 3. Customer Shadowing: Strategic AI Transformations
- **Global Satellite Telecommunications Provider**: Shadowed architectural workshops outlining the integration of generative AI agents with satellite fleet monitoring and orbital telemetry systems.
- **Premier Maritime Container Port Authority**: Observed technical demonstrations evaluating intelligent virtual assistants for maritime logistics coordination and vessel traffic scheduling.

---

## Detailed Weekly Engineering Log

### Monday, February 23, 2026
- **Event Dry Runs & Preparation**: Conducted final integration tests for the AI for Research demo; verified network connectivity, API rate limits, and fallback scenarios.
- **Slide Deck Refinement**: Polished presentation visuals, architectural schematics, and live terminal demo flows.

### Tuesday, February 24, 2026
- **AI for Research Event Delivery**: Delivered the live demonstration to 50+ external researchers at the Microsoft campus; successfully showcased multi-document summarization, citations, and MCP tool execution.
- **Audience Q&A & Technical Engagement**: Fielded inquiries on Azure OpenAI token costs, hybrid search tuning, and data privacy guarantees under European regulations.

### Wednesday, February 25, 2026
- **Document Intelligence Research**: Analyzed document extraction workflows; tested OCR accuracy on low-contrast scans and multi-column tabular documents.
- **HPC / GPU Workload Sizing**: Formulated compute sizing estimates (NVIDIA A100 clusters) for incoming enterprise customer AI model training requests.

### Thursday, February 26, 2026
- **Customer Shadowing (Satellite Telecom Provider)**: Attended high-level AI roadmap discussions exploring autonomous agent use cases for satellite operations.
- **Customer Shadowing (Maritime Port Authority)**: Shadowed technical evaluation of maritime virtual assistants; observed customer questions regarding multilingual dialect support and on-premises integration.

### Friday, February 27, 2026
- **Document Extraction Pipeline Iteration**: Refactored extraction parsing logic based on team review; added JSON schema validation guards.
- **Certification Learning**: Studied curriculum modules for Azure AI Engineer Associate (AI-102) and Azure Administrator (AZ-104).

---

## Challenges Overcome & Engineering Decisions

1. **Ensuring Flawless Live Demo Execution**:
   - *Challenge*: Live demos over public Wi-Fi frequently suffer from intermittent connectivity drops and unpredictable API latency.
   - *Decision*: Deployed a localized mock MCP fallback layer while maintaining live cloud connections, allowing seamless graceful degradation without audience disruption.
2. **Extracting Nested Tables from Dense PDFs**:
   - *Challenge*: Complex multi-page financial tables exhibited merged cell anomalies during standard OCR parsing.
   - *Decision*: Implemented Azure Document Intelligence layout analysis paired with post-extraction regex reconstruction scripts to maintain strict row-column integrity.

---

## Collaboration & Team Dynamics

- **High Trust from Leadership**: Senior managers entrusted an intern with direct stage ownership in front of external academic leaders, reflecting strong confidence in Aryan's technical communication skills.
- **Cross-Account Synergy**: Insights gathered during customer shadowing sessions were immediately synthesized into technical notes for the broader solutions engineering team.

---

## Technologies & Tools Utilized

- **Cloud & AI Services**: Azure AI Foundry, Azure AI Search, Azure Document Intelligence, Azure OpenAI Service.
- **Protocols & Standards**: Model Context Protocol (MCP), JSON-RPC.
- **Languages & Frameworks**: Python 3.11, Pydantic, FastAPI.
- **Presentation & Productivity**: Microsoft PowerPoint, Terminal Demos.
