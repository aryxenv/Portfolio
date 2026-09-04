---
id: "microsoft-week-09"
title: "Microsoft Internship - Week 9: Metallurgy Enterprise Demo & Fabric-AzureML Integration"
type: "experience"
company: "Microsoft"
role: "Solutions Engineer Intern (AI Apps / Data)"
week_number: 9
log_date: "2026-03-30 to 2026-04-03"
date_range: "Apr 2026"
location: "Zaventem, Belgium"
nda_redacted: true
tech_stack:
  - "Microsoft Fabric"
  - "OneLake"
  - "Azure Machine Learning (AzureML)"
  - "Azure Cosmos DB"
  - "Bicep / azd"
  - "Python"
  - "Entra ID"
tags:
  - "microsoft"
  - "internship"
  - "manufacturing-ai"
  - "fabric"
  - "onelake"
  - "azureml"
  - "cross-platform-auth"
  - "bicep"
summary: "Engineered automated demo infrastructure with Bicep/azd for a multinational stainless steel manufacturer, resolved cross-platform authentication linking AzureML with Microsoft Fabric OneLake, and assisted air cargo analytics teams."
source: "C:/Users/aryan/OneDrive/microsoft_internship_log/Week 9 - Learning, a multinational stainless steel manufacturer Demo Prep, Bridge AzureML_Fabric.pdf"
---

# Microsoft Internship - Week 9: Metallurgy Enterprise Demo & Fabric-AzureML Integration

## Executive Summary

Week 9 centered on heavy industrial enterprise architecture and cross-platform cloud data integration. Aryan spearheaded the technical preparation and automated infrastructure provisioning for a **multinational stainless steel and metallurgy manufacturer**, configuring AI auto-fill data extraction workflows and building reproducible Infrastructure-as-Code (IaC) pipelines via Bicep and `azd`.

Simultaneously, Aryan solved a complex cross-platform integration hurdle connecting **Azure Machine Learning (AzureML)** with **Microsoft Fabric OneLake**, resolving Entra ID service principal authentication and private endpoint networking. He also provided technical endpoint support to an **international air cargo carrier** and contributed to sales pipeline telemetry flows.

---

## Key Technical Initiatives & Architecture

### 1. Metallurgy Enterprise AI Infrastructure (Bicep & azd)
- **Client Profile**: A multinational stainless steel and metallurgy enterprise requiring automated knowledge extraction from complex metallurgical quality inspection sheets and alloy datasheets.
- **Technical Architecture**:
  - Ingested unstructured metallurgical lab reports into Azure Blob Storage and Azure Cosmos DB.
  - Built an AI auto-fill engine using Azure AI Foundry that automatically extracts alloy chemical percentages (Chromium, Nickel, Molybdenum) and tensile strength values into structured relational schemas.
  - Parameterized the entire cloud environment using Bicep and `azure.yaml`, enabling one-click deployment via the Azure Developer CLI (`azd up`).

### 2. Microsoft Fabric OneLake to AzureML Authentication Bridge
```text
[Microsoft Fabric OneLake Delta Parquet Tables]
                       │
                       ▼ (Entra ID Service Principal Auth)
[Cross-Platform Private Network Bridge]
                       │
                       ▼
[Azure Machine Learning Workspace & Compute Cluster]
├── Data Asset Registration (OneLake Shortcut URIs)
├── Model Training & Validation (Python SDK v2)
└── Managed Online Endpoint Deployment
```

- **Problem Statement**: Enterprise data teams utilizing Microsoft Fabric for unified data warehousing needed to train custom predictive models in Azure Machine Learning without copying petabytes of raw data outside Fabric OneLake boundaries.
- **Solution Delivered**:
  - Configured Entra ID cross-tenant application registrations with scoped `Storage Blob Data Contributor` roles.
  - Established OneLake shortcut endpoints within AzureML data assets using `abfss://` protocol URIs.
  - Successfully verified model training jobs reading directly from Fabric Delta Parquet tables with zero data duplication.

---

## Detailed Weekly Engineering Log

### Monday, March 30, 2026
- **Metallurgy Demo Requirements**: Analyzed sample quality test sheets and metallurgical specifications from the customer account team; mapped extraction field schemas.
- **Infrastructure as Code Scaffolding**: Authored modular Bicep templates configuring Azure AI Foundry, Cognitive Services accounts, and Cosmos DB private endpoints.

### Tuesday, March 31, 2026
- **AI Auto-Fill Engineering**: Built FastAPI backend handlers connecting Azure Document Intelligence with GPT-4o; implemented prompt-driven field extraction and confidence scoring.
- **Ticket Resolution**: Resolved open deployment blockers in the demo repository, ensuring seamless provisioning under clean customer tenant subscriptions.

### Wednesday, April 1, 2026
- **Fabric to AzureML Bridge Investigation**: Diagnosed authentication failures occurring when AzureML compute jobs attempted to access Fabric OneLake storage endpoints.
- **Entra ID Permission Modeling**: Configured OAuth token acquisition routines using the Azure Identity SDK; mapped required API permissions for Fabric data access.

### Thursday, April 2, 2026
- **Cross-Platform Verification**: Successfully ran an end-to-end Python model training script on AzureML compute reading directly from a Fabric OneLake Lakehouse table.
- **Air Cargo Partner Support**: Assisted the solutions team supporting an international air cargo carrier with machine learning model endpoint troubleshooting.

### Friday, April 3, 2026
- **Sales Telemetry Flow Contributions**: Contributed data flow scripts to an automated enterprise sales pipeline intelligence project.
- **Weekly Retrospective & Demo Dry Run**: Demonstrated the complete metallurgy AI auto-fill platform to the lead solutions architect; validated that all automated tests passed.

---

## Challenges Overcome & Engineering Decisions

1. **Private Endpoint DNS Resolution Between Fabric and AzureML**:
   - *Challenge*: AzureML managed virtual networks failed to resolve internal private IP addresses for Fabric Lakehouse storage accounts.
   - *Decision*: Configured private DNS zones linked to the AzureML workspace VNet, establishing seamless private link name resolution without routing traffic over public endpoints.
2. **Handling Non-Standard Metallurgical Symbols in OCR**:
   - *Challenge*: Special characters representing microscopic grain sizes and chemical phase notations caused character corruption in standard OCR.
   - *Decision*: Implemented custom post-processing normalization dictionaries that map corrupted unicode glyphs to standardized metallurgical notations.

---

## Collaboration & Team Dynamics

- **Cross-Platform Expertise**: Bridged the gap between the Cloud & AI STU and the Data & Analytics STU, proving that Fabric and AzureML complement each other seamlessly.
- **Customer Readiness**: Equipped the manufacturing account team with turn-key demonstration assets ready for executive presentation.

---

## Technologies & Tools Utilized

- **Data & Analytics**: Microsoft Fabric, OneLake, Delta Lake, Parquet.
- **Machine Learning & AI**: Azure Machine Learning (v2 SDK), Azure AI Foundry, Azure Document Intelligence.
- **Cloud Infrastructure**: Azure Cosmos DB, Bicep, Azure Developer CLI (`azd`), Entra ID.
- **Languages**: Python 3.11, PowerShell, Bash.
