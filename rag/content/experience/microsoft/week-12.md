---
id: "microsoft-week-12"
title: "Microsoft Internship - Week 12: Port Diarization, Multilingual Streaming & PG Finder"
type: "experience"
company: "Microsoft"
role: "Solutions Engineer Intern (AI Apps / Data)"
week_number: 12
log_date: "2026-04-20 to 2026-04-24"
date_range: "Apr 2026"
location: "Zaventem, Belgium"
nda_redacted: true
tech_stack:
  - "Microsoft Agent Framework (MAF)"
  - "PydanticAI"
  - "Speech Diarization"
  - "Model Context Protocol (MCP)"
  - "GitHub Copilot Skills"
  - "Azure AI Foundry"
  - "FastAPI"
tags:
  - "microsoft"
  - "internship"
  - "speaker-diarization"
  - "port-authority"
  - "multilingual-translation"
  - "product-group-finder"
  - "mcp-server"
  - "techorama"
summary: "Benchmarked speaker diarization architectures (Azure vs GCP, MAF vs PydanticAI) for a premier maritime port authority, architected a 24-language speech translation pipeline for an IT consulting partner, and built the Product Group Contact Discovery MCP tool."
source: "C:/Users/aryan/OneDrive/microsoft_internship_log/Week 12 - Nerdland V2, Techorama, a premier European maritime container port authority, a prominent enterprise technology consulting partner, Healthcare, Event, an internal shadowing workflow tool, sales CRM agentic automation, PG Contact Finder.pdf"
---

# Microsoft Internship - Week 12: Port Diarization, Multilingual Streaming & PG Finder

## Executive Summary

Week 12 was defined by deep architectural benchmarking, high-throughput speech streaming, and internal developer innovation. Aryan evaluated speaker diarization and meeting intelligence platforms for a **premier European maritime container port authority**, comparing Azure Speech against Google Cloud Platform (GCP) and benchmarking the Microsoft Agent Framework (MAF) against PydanticAI.

Simultaneously, Aryan scoped and validated a 24-language real-time speech translation architecture for a **prominent enterprise IT consulting partner**, deployed Version 2 of the science festival AI assistant, and built the **Product Group Contact Discovery tool**—an automated Copilot skill and Model Context Protocol (MCP) server connecting field engineers to Microsoft Product Groups worldwide.

---

## Key Technical Initiatives & Architecture

### 1. Maritime Port Authority: Diarization & Framework Benchmark
- **Client**: A premier European maritime container port authority requiring automated multi-party meeting transcription, speaker identification, and operational action-item extraction.
- **Architectural Benchmark Conducted**:
  - *Speech Engine Bake-off*: Evaluated Azure LLM-powered Speech Services against Google Cloud Platform (GCP) speech models across noisy conference room recordings, testing word error rate (WER) and speaker attribution accuracy.
  - *Agent Framework Comparison*: Implemented identical action-item extraction workflows in both **Microsoft Agent Framework (MAF)** and **PydanticAI**, evaluating type safety, streaming support, and maintainability.
  - *Outcome*: Advised the client on leveraging Azure Speech with MAF for seamless enterprise Entra ID integration and deterministic structured output.

### 2. Consulting Partner Multilingual Real-Time Speech Streaming
```text
[Incoming Multi-Channel Audio Streams (20+ Concurrent Feeds)]
                              │
                              ▼
           [Dynamic Audio Queue & Buffer Manager]
                              │
                              ▼
    [Parallel Azure Speech & Translation Pipelines (24 Languages)]
    ├── Automatic Language Identification
    ├── Chunked Streaming Audio Transcription
    └── Real-Time Multilingual Text Translation
                              │
                              ▼
           [Low-Latency Subtitle & Text Egress Stream]
```

- **Objective**: Build a high-throughput speech processing architecture capable of ingesting 20+ simultaneous audio streams and delivering real-time transcription and translation across 24 languages.
- **Technical Design**: Engineered dynamic queuing and worker pooling in Python to prevent rate-limit throttling across concurrent cognitive service endpoints.

### 3. Product Group Contact Discovery Tool (Copilot Skill & MCP)
- **Problem**: Field solutions engineers waste extensive hours searching internal portals and distribution lists to identify the authoritative engineering Product Group (PG) owner for specific Azure features.
- **Solution**: Developed an automated directory querying tool packaged as a GitHub Copilot skill and Model Context Protocol (MCP) server. Engineers can query in natural language (e.g., *"Who an internal shadowing workflow tool the PG contact for Azure AI Search hybrid vector re-ranking?"*) and receive verified engineering contacts instantly.

---

## Detailed Weekly Engineering Log

### Monday, April 20, 2026
- **Diarization Benchmark Setup**: Gathered benchmark audio datasets representing multi-speaker maritime operations meetings; configured test harnesses for Azure Speech and GCP.
- **Festival Assistant V2 Deployment**: Deployed the modernized science festival AI assistant backend to Azure Container Apps; validated search index ingestion.

### Tuesday, April 21, 2026
- **Framework Bake-off (MAF vs PydanticAI)**: Built comparative agent pipelines in Python; evaluated schema validation, dependency injection, and prompt chaining performance.
- **Port Authority Technical Debrief**: Synthesized benchmark findings into an architectural decision record (ADR) for the maritime port authority account team.

### Wednesday, April 22, 2026
- **Consulting Partner Speech Architecture**: Designed the 24-language real-time speech translation architecture; tested concurrent WebSocket streaming under simulated loads.
- **Queue Optimization**: Implemented asynchronous buffer queues in Python to smooth out audio packet spikes across 20+ concurrent streams.

### Thursday, April 23, 2026
- **Product Group Finder Development**: Scaffolding the "Find PG Contact" MCP server; ingested internal organizational hierarchies and feature mapping directories.
- **Copilot Skill Packaging**: Registered the MCP tool as an enterprise Copilot agent skill; tested natural language query resolution.

### Friday, April 24, 2026
- **Techorama Agent Prompt Refinement**: Collaborated with solutions architects to refine system prompts for the upcoming Techorama AI security demo; eliminated API output mismatches.
- **Weekly Review**: Demonstrated the Product Group Finder tool to senior mentors; received strong praise for solving an acute organization-wide pain point.

---

## Challenges Overcome & Engineering Decisions

1. **Audio Packet Dropping across 20+ Concurrent Streams**:
   - *Challenge*: Simultaneous multi-language streams triggered sporadic 429 Too Many Requests errors and socket connection resets.
   - *Decision*: Implemented a token-bucket rate limiter combined with round-robin endpoint pooling across multiple Azure Cognitive Services regional instances.
2. **Entity Hallucination in Speaker Diarization**:
   - *Challenge*: Standard LLM post-processing occasionally misattributed action items to silent meeting attendees.
   - *Decision*: Enforced strict speaker attribution schemas requiring direct timestamps and verbatim quotes before binding an action item to a speaker ID.

---

## Collaboration & Team Dynamics

- **High Technical Rigor**: Delivering objective, vendor-agnostic benchmarking (Azure vs GCP) earned high trust from enterprise client architects.
- **Grassroots Innovation**: The Product Group Contact Finder addressed a universal operational frustration, demonstrating Aryan's instinct for creating high-leverage field utilities.

---

## Technologies & Tools Utilized

- **Speech & AI Frameworks**: Azure Speech Services, Microsoft Agent Framework (MAF), PydanticAI, Model Context Protocol (MCP).
- **Cloud Infrastructure**: Azure Container Apps, Azure AI Foundry, Azure AI Search.
- **Developer Tools**: GitHub Copilot, Python 3.11, asyncio, FastAPI.
