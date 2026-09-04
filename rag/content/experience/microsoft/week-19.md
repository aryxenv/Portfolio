---
id: "microsoft-week-19"
title: "Microsoft Internship - Week 19: Realtime Speech ACA Deployment & Webslides PPTX Engine"
type: "experience"
company: "Microsoft"
role: "Solutions Engineer Intern (AI Apps / Data)"
week_number: 19
log_date: "2026-06-08 to 2026-06-12"
date_range: "Jun 2026"
location: "Zaventem, Belgium"
nda_redacted: true
tech_stack:
  - "Azure Container Apps (ACA)"
  - "Realtime Audio API"
  - "FastAPI"
  - "python-pptx"
  - "WebSockets"
  - "Docker"
  - "React"
tags:
  - "microsoft"
  - "internship"
  - "azure-container-apps"
  - "speech-translation"
  - "webslides"
  - "pptx-export"
  - "virtual-office"
  - "railway-ai"
summary: "Architected and deployed an end-to-end Realtime Speech Translation service on Azure Container Apps, integrated streaming translation into Virtual Office demos, built a native PowerPoint (.pptx) export engine for Webslides, and optimized railway assistant latency."
source: "C:/Users/aryan/OneDrive/microsoft_internship_log/Week 19 - an enterprise rail passenger mobility assistant demo, gpt-realtime-whisper_translate, Webslides, VO, Nerdland.pdf"
---

# Microsoft Internship - Week 19: Realtime Speech ACA Deployment & Webslides PPTX Engine

## Executive Summary

Week 19 focused on cloud-native production deployment, real-time multimedia streaming, and advanced document generation. Following the resolution of the Realtime API platform hotfix, Aryan architected and deployed a production-grade **Realtime Speech Translation service on Azure Container Apps (ACA)**, implementing client/server streaming architectures capable of real-time multilingual transcription and translation.

Aryan integrated this streaming translation capability into **Virtual Office (VO)** executive showcases, engineered a native **PowerPoint (`.pptx`) export engine for Webslides**, resolved rate limiting and UI performance bottlenecks for the science festival assistant, and finalized low-latency routing for the national railway passenger assistant.

---

## Key Technical Initiatives & Architecture

### 1. Realtime Speech Translation Service on Azure Container Apps (ACA)
```text
[Client Microphone Stream (Browser WebRTC / AudioWorklet)]
                           │
                           ▼ (WebSocket Opus Audio Chunks)
[Azure Container Apps: Streaming Gateway (FastAPI / Python)]
                           │
                           ▼ (Bi-Directional WebSocket)
[Azure AI Foundry: gpt-realtime-whisper & translate]
                           │
                           ▼ (Sub-Second Translated Text Streams)
[Target Egress: Web Subtitles / Virtual Office Meeting Feed]
```

- **Cloud Infrastructure**: Deployed containerized FastAPI microservices on Azure Container Apps with automated horizontal scaling based on concurrent WebSocket connection counts.
- **Low-Latency Streaming**: Implemented browser `AudioWorklet` processing to capture 16kHz PCM audio buffers, streaming lightweight chunks over WebSockets to minimize network transmission delay.

### 2. Webslides: Native PowerPoint (`.pptx`) Export Engine
- **Customer Need**: While interactive web presentations excel during live executive meetings, enterprise customers consistently demand downloadable PowerPoint slide decks following the meeting for internal distribution.
- **Implementation**:
  - Developed a backend conversion pipeline utilizing `python-pptx` and AST (Abstract Syntax Tree) parsing.
  - Ingested Webslides Markdown and HTML layouts, mathematically mapping CSS flexbox and grid coordinates into native PowerPoint slide shapes, tables, and typography.
  - Preserved custom account branding, corporate color palettes, and embedded code formatting seamlessly in the generated `.pptx` file.

### 3. Virtual Office (VO) Live Streaming Integration
- Integrated the containerized speech translation service into executive Virtual Office customer demonstrations, showcasing simultaneous subtitle generation in English, French, Dutch, and German during live simulated cross-border meetings.

---

## Detailed Weekly Engineering Log

### Monday, June 8, 2026
- **Container Apps Architecture Design**: Designed the ACA deployment architecture for the Realtime Speech Translation service; configured virtual network integration and ingress rules.
- **Dockerfile Optimization**: Created optimized Docker container images with multi-stage builds, minimizing image size and reducing cold-start container spin-up times.

### Tuesday, June 9, 2026
- **ACA Deployment & Scaling Rules**: Deployed the streaming microservices to Azure Container Apps; configured KEDA scaling rules monitoring active WebSocket connections.
- **Virtual Office Integration**: Connected the live streaming audio endpoints into the Virtual Office customer demo environment.

### Wednesday, June 10, 2026
- **Webslides PPTX Exporter Coding**: Built the `python-pptx` transformation engine; mapped Markdown slide headers, bullet points, and code blocks to native PowerPoint shapes.
- **Layout Fidelity Testing**: Tested exported `.pptx` presentations across various aspect ratios (16:9 widescreen); verified that fonts and brand colors rendered accurately.

### Thursday, June 11, 2026
- **Railway Assistant Latency Routing**: Finalized latency-first audio routing for the national railway assistant; verified sub-second response times on standard regional station queries.
- **Science Festival Rate Limiting Review**: Analyzed API consumption quotas for the science festival assistant; implemented client-side debouncing and token caching.

### Friday, June 12, 2026
- **End-to-End Live Testing**: Conducted multi-lingual stress tests on the Realtime Speech ACA service; validated simultaneous 4-language translation streams with under 1.2s total delay.
- **Weekly Technical Debrief**: Presented the Webslides PowerPoint export engine to technical leadership, receiving enthusiastic praise for bridging interactive web demos with customer document needs.

---

## Challenges Overcome & Engineering Decisions

1. **Mapping CSS Grid to Static PowerPoint Coordinate Planes**:
   - *Challenge*: Web layouts rely on dynamic, fluid CSS grid calculations, whereas PowerPoint requires explicit mathematical coordinates (Inches/EMUs) for every visual shape.
   - *Decision*: Built a virtual DOM layout calculator in Python that measures relative component bounding boxes and calculates exact PowerPoint positioning coordinates during export.
2. **WebSocket Keep-Alive and Inactivity Timeouts on ACA**:
   - *Challenge*: Azure Container Apps ingress proxies abruptly terminated idle WebSocket connections after 30 seconds of conversational silence.
   - *Decision*: Implemented an automatic bi-directional heartbeat ping/pong protocol every 10 seconds, maintaining persistent connections throughout pauses in speech.

---

## Collaboration & Team Dynamics

- **High-Impact Integration**: Deploying the Realtime Speech service on ACA provided solutions architects with an instantly demonstrable enterprise asset for customer briefings.
- **Addressing Customer Reality**: Developing the PPTX exporter demonstrated profound commercial empathy, recognizing that enterprise stakeholders require tangible artifacts to share with procurement and C-level peers.

---

## Technologies & Tools Utilized

- **Cloud Compute & Containers**: Azure Container Apps (ACA), Docker, KEDA.
- **Speech & Audio**: Azure Realtime Audio API (`gpt-realtime-whisper`, `gpt-realtime-translate`), WebSockets, AudioWorklet.
- **Document Engineering**: `python-pptx`, AST Parsing, Markdown.
- **Languages & Frameworks**: Python 3.11, FastAPI, React, TypeScript.
