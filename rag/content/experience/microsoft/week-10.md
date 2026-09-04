---
id: "microsoft-week-10"
title: "Microsoft Internship - Week 10: Fabric-AzureML Guide, Metallurgy Delivery & Rail Optimization"
type: "experience"
company: "Microsoft"
role: "Solutions Engineer Intern (AI Apps / Data)"
week_number: 10
log_date: "2026-04-06 to 2026-04-10"
date_range: "Apr 2026"
location: "Zaventem, Belgium"
nda_redacted: true
tech_stack:
  - "Microsoft Fabric"
  - "Azure Machine Learning"
  - "Office Scripts / TypeScript"
  - "Excel Automation"
  - "Realtime Audio API"
  - "Entra ID"
  - "FastAPI"
tags:
  - "microsoft"
  - "internship"
  - "fabric"
  - "azureml"
  - "documentation"
  - "railway-ai"
  - "excel-automation"
  - "speech-latency"
summary: "Published authoritative architectural documentation on Fabric to AzureML private authentication, delivered technical demos to a stainless steel enterprise, automated finance workflows via Office Scripts, and optimized speech latency for a national railway passenger assistant."
source: "C:/Users/aryan/OneDrive/microsoft_internship_log/Week 10 - Bridge AzureML_Fabric_OneLake, Excel Automation, sales CRM agentic automation, an enterprise rail passenger mobility assistant demo Improvements, Learning.pdf"
---

# Microsoft Internship - Week 10: Fabric-AzureML Guide, Metallurgy Delivery & Rail Optimization

## Executive Summary

Week 10 combined high-value technical documentation, enterprise customer delivery, and low-level speech performance optimization. Aryan authored and published comprehensive, step-by-step architectural guidance on **Entra ID authentication linking Microsoft Fabric OneLake with Azure Machine Learning**, which was distributed across the wider Cloud & AI Solution Technical Unit as a reusable standard.

Aryan also co-delivered technical demonstrations to executive stakeholders from the **multinational stainless steel manufacturer**, engineered automated financial workflows using **Office Scripts and Excel automation**, and initiated speech recognition and latency optimizations for a **national passenger railway operator's voice assistant**.

---

## Key Technical Initiatives & Architecture

### 1. Authoritative Field Guide: Fabric OneLake to AzureML Bridge
- **Context**: Solutions architects across Belux frequently struggled to configure secure cross-platform authentication between Fabric and AzureML for enterprise customers.
- **Documentation Deliverables**:
  - Step-by-step visual configuration guide detailing Entra ID app registrations, managed identities, and OAuth token exchanges.
  - Automated deployment scripts in Azure CLI configuring service principal RBAC roles (`Storage Blob Data Contributor`) on Fabric workspaces.
  - Sample Python notebooks demonstrating model training jobs ingesting Fabric OneLake shortcuts with zero local disk caching.
  - Published internally to the Solutions Engineering knowledge base and shared with technical teams across Western Europe.

### 2. National Passenger Railway Voice Assistant Optimization
```text
[Passenger Spoken Query]
           │
           ▼
[Realtime Audio Streaming Gateway]
           │
           ▼
[Phonetic Station Tokenizer & Normalizer]
├── Matches Regional Accents (French/Dutch Dialects)
└── Resolves Ambiguous Station Names (e.g., Bruxelles-Midi vs Brussel-Zuid)
           │
           ▼
[Low-Latency Realtime Completion Engine]
           │
           ▼
[Sub-Second Spoken Audio Return Stream]
```

- **Objective**: Optimize the interactive voice agent demo for the national passenger railway operator, enabling passengers to inquire about train schedules, platform changes, and delays.
- **Engineering Optimizations**:
  - Addressed phonetic recognition bottlenecks where regional station names (e.g., *Bruxelles-Midi*, *Gent-Sint-Pieters*, *Antwerpen-Centraal*) were misinterpreted by base English/multilingual models.
  - Configured custom phrase lists in Azure Speech Services to elevate station name phonetic weighting.
  - Streamlined audio pipeline buffers to minimize end-to-end turnaround latency.

### 3. Financial Workflow Automation (Office Scripts & Excel)
- Developed robust Office Scripts (TypeScript) and Power Automate flows for enterprise finance personas, automating complex data reconciliation, currency normalization, and anomaly detection across enterprise spreadsheets.

---

## Detailed Weekly Engineering Log

### Monday, April 6, 2026
- **Documentation Authoring (Fabric–AzureML)**: Drafted comprehensive architectural guide detailing Entra ID service principal authentication and Lakehouse URI configuration.
- **Diagram Generation**: Created visual network topology schematics illustrating private link routing and credential delegation flows.

### Tuesday, April 7, 2026
- **Metallurgy Demo Delivery**: Co-presented the automated data extraction and AI auto-fill solution to technical decision-makers from the stainless steel enterprise; received enthusiastic customer validation.
- **Customer Q&A**: Addressed customer inquiries regarding on-premises database connectivity and enterprise data retention policies.

### Wednesday, April 8, 2026
- **Office Scripts Development**: Wrote automated TypeScript Office Scripts in Excel for finance workflows; implemented data validation rules and formatted executive reporting summaries.
- **Sales CRM Agentic Exploration**: Evaluated initial agentic connector prototypes for sales pipeline tracking and account intelligence.

### Thursday, April 9, 2026
- **Railway Voice Assistant Profiling**: Analyzed audio latency traces in the national railway voice assistant prototype; identified delays in station-name entity extraction.
- **Phrase List Implementation**: Configured Azure Speech custom phrase lists containing all national railway station names; tested accuracy improvements across accented speech samples.

### Friday, April 10, 2026
- **Documentation Distribution**: Published the finalized Fabric–AzureML guide to the internal technical community; received commendations from senior architects for clarity.
- **Weekly Engineering Sync**: Reviewed weekly achievements with the senior mentor; aligned on upcoming conference demo architectures for Techorama and the science festival.

---

## Challenges Overcome & Engineering Decisions

1. **Token Expiration in Long-Running ML Training Jobs**:
   - *Challenge*: AzureML training runs spanning multiple hours failed when initial OAuth bearer tokens expired mid-job while streaming from OneLake.
   - *Decision*: Implemented AzureML Managed Identity with automatic token refresh routines, replacing static service principal client secrets with continuous dynamic credential renewal.
2. **Bilingual Phonetic Collisions in Railway Station Names**:
   - *Challenge*: Belgian railway stations have distinct French and Dutch names that confused standard speech models.
   - *Decision*: Implemented a bilingual normalization layer mapping both French and Dutch station names to a unified internal station ID before querying timetable APIs.

---

## Collaboration & Team Dynamics

- **Knowledge Multiplier**: Writing and sharing the Fabric–AzureML guide elevated the entire technical unit, turning an isolated problem-solving effort into a reusable corporate asset.
- **Customer Delivery Acumen**: Gained valuable live presentation experience co-pitching complex enterprise software architectures to corporate stakeholders.

---

## Technologies & Tools Utilized

- **Cloud Data & AI**: Microsoft Fabric, OneLake, Azure Machine Learning, Azure AI Foundry, Azure Speech Services.
- **Productivity & Automation**: Office Scripts (TypeScript), Microsoft Excel, Power Automate.
- **Security & Identity**: Azure Entra ID, Managed Identities, OAuth 2.0.
- **Languages**: Python 3.11, TypeScript, Bash.
