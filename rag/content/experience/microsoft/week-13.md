---
id: "microsoft-week-13"
title: "Microsoft Internship - Week 13: Metallurgy Redeployment, Techorama Prompts & Financial Forecasting"
type: "experience"
company: "Microsoft"
role: "Solutions Engineer Intern (AI Apps / Data)"
week_number: 13
log_date: "2026-04-27 to 2026-05-01"
date_range: "May 2026"
location: "Zaventem, Belgium"
nda_redacted: true
tech_stack:
  - "Azure Cosmos DB"
  - "Azure AI Foundry"
  - "Prompt Engineering"
  - "R Programming Language"
  - "Time-Series Forecasting"
  - "Private Endpoints"
  - "Python"
tags:
  - "microsoft"
  - "internship"
  - "manufacturing-demo"
  - "cosmosdb-networking"
  - "techorama"
  - "time-series"
  - "financial-forecasting"
  - "satellite-telecom"
summary: "Redeployed the stainless steel manufacturer demo environment resolving Cosmos DB private networking, optimized prompt engineering for Techorama security agents, aligned satellite operator roadmaps with multi-agent accelerators, and researched financial time-series forecasting in R."
source: "C:/Users/aryan/OneDrive/microsoft_internship_log/Week 13 - a multinational stainless steel manufacturer Data & AI, a global satellite telecommunications provider, a prominent enterprise technology consulting partner, Find PG Contact, Techorama, Nerdland, an international building materials and drywall manufacturer.pdf"
---

# Microsoft Internship - Week 13: Metallurgy Redeployment, Techorama Prompts & Financial Forecasting

## Executive Summary

Week 13 demonstrated versatile engineering execution across cloud infrastructure networking, conference presentation hardening, and specialized data science research. Aryan re-architected and redeployed the demonstration environment for the **multinational stainless steel manufacturer**, successfully troubleshooting and resolving complex private endpoint DNS and virtual network isolation issues with Azure Cosmos DB.

In parallel, Aryan finalized the prompt engineering and output schemas for the **Techorama AI security showcase**, aligned generative AI roadmaps for the **global satellite telecommunications provider** with enterprise multi-agent deployment accelerators, and initiated specialized research into R-based financial time-series forecasting models for an **international building materials and drywall manufacturer**.

---

## Key Technical Initiatives & Architecture

### 1. Metallurgy Demo Environment Redeployment (Cosmos DB Private Networking)
- **Challenge**: The stainless steel manufacturer demo experienced intermittent connectivity drops between Azure App Service and Azure Cosmos DB due to private endpoint routing misconfigurations and frontend layout bugs.
- **Architectural Resolution**:
  - Reconfigured Virtual Network integration, establishing dedicated private endpoints and private DNS zones (`privatelink.documents.azure.com`) for Azure Cosmos DB.
  - Redesigned the frontend interface with improved tabular responsiveness, visual confidence badges for AI autofill fields, and clear error telemetry.
  - Validated zero public endpoint exposure, complying with strict manufacturing data governance.

### 2. Techorama Security Agent Prompt Engineering & Hardening
- **Objective**: Ensure the AI security demonstration agent at Techorama consistently demonstrated vulnerabilities when unshielded while remaining completely predictable and non-flaky during live stage delivery.
- **Refinement**:
  - Engineered precise system prompts and deterministic temperature settings (`temperature=0.0`) to eliminate stochastic API output variations.
  - Authored clear visual logging indicating when prompt injection attacks were intercepted versus when malicious payloads executed within the sandbox.

### 3. Financial Time-Series Forecasting Research (R & Azure)
- **Client Profile**: An international building materials and drywall manufacturer.
- **Research Scope**: Investigated R-based financial time-series forecasting packages and neural network models to evaluate how complex manufacturing sales forecasts can be containerized and trained on Azure compute clusters.

---

## Detailed Weekly Engineering Log

### Monday, April 27, 2026
- **Cosmos DB Networking Diagnostics**: Investigated private endpoint communication timeouts between compute runtimes and Azure Cosmos DB; captured virtual network flow logs.
- **DNS Zone Correction**: Re-linked private DNS zones to the target virtual network; verified database connection handshake times.

### Tuesday, April 28, 2026
- **Metallurgy Frontend Overhaul**: Overhauled the customer demo web UI; integrated dynamic status badges displaying extraction confidence scores for metallurgical alloy metrics.
- **Cosmos DB Stress-Testing**: Executed load tests validating that concurrent read/write operations performed reliably over the private endpoint link.

### Wednesday, April 29, 2026
- **Techorama Prompt Refinement**: Conducted automated regression testing on Techorama security agent prompts; eliminated response formatting mismatches between OpenAI model versions.
- **Consulting Partner Speech Logic Review**: Reviewed streaming speech transcription logic for the IT consulting partner, verifying queuing performance under load.

### Thursday, April 30, 2026
- **Satellite Provider Multi-Agent Alignment**: Participated in strategic alignment sessions mapping the satellite provider's operational needs to enterprise multi-agent deployment accelerators; secured executive attendance for technical workshops.
- **Product Group Finder Enhancements**: Updated feature mapping schemas in the Product Group Finder tool based on user feedback from field a global satellite telecommunications provider.

### Friday, May 1, 2026
- **Financial Forecasting Research Kickoff**: Began technical review of R-based financial time-series forecasting methodologies for the building materials enterprise; evaluated Azure Machine Learning R environment support.
- **Science Festival MVP Validation**: Conducted milestone validation testing on the science festival AI assistant, verifying search indexing and latency benchmarks.

---

## Challenges Overcome & Engineering Decisions

1. **Private Endpoint DNS Failures Across Subscriptions**:
   - *Challenge*: App Service failed to resolve the private IP of Cosmos DB when resources resided in peered virtual networks.
   - *Decision*: Configured Azure DNS Private Resolver rules and explicitly set `WEBSITE_VNET_ROUTE_ALL=1`, forcing all outbound application traffic through the virtual network to ensure private DNS resolution.
2. **Deterministic Behavior in Live AI Demonstrations**:
   - *Challenge*: Generative models exhibit slight behavioral variances that can disrupt tightly scripted conference presentations.
   - *Decision*: Bound the demo agent to pinned seed values and zero-temperature configurations while using structured JSON schema response formatting to ensure 100% predictable stage execution.

---

## Collaboration & Team Dynamics

- **Infrastructure Reliability**: Fixing the Cosmos DB private networking unblocked the sales account team, restoring customer confidence in Microsoft's enterprise security capabilities.
- **Broad Domain Versatility**: Transitioned effortlessly between low-level cloud networking, conference prompt engineering, and specialized R statistical modeling within a single week.

---

## Technologies & Tools Utilized

- **Cloud Infrastructure & Databases**: Azure Cosmos DB, Azure Virtual Networks, Private Endpoints, Azure App Service.
- **AI & Security**: Azure AI Foundry, Prompt Engineering, Azure Content Safety.
- **Data Science & Languages**: R Programming Language, Python 3.11, FastAPI, React, TypeScript.
