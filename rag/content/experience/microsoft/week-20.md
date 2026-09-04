---
id: "microsoft-week-20"
title: "Microsoft Internship - Week 20: Global Tire Corporation Custom Dashboard & Regional AI Refresh"
type: "experience"
company: "Microsoft"
role: "Solutions Engineer Intern (AI Apps / Data)"
week_number: 20
log_date: "2026-06-15 to 2026-06-19"
date_range: "Jun 2026"
location: "Zaventem, Belgium"
nda_redacted: true
tech_stack:
  - "ChartJS"
  - "FastAPI"
  - "Azure AI Foundry"
  - "Azure App Service"
  - "TypeScript"
  - "React"
  - "Python"
tags:
  - "microsoft"
  - "internship"
  - "strategic-pivot"
  - "automotive-ai"
  - "telemetry-visualization"
  - "chartjs"
  - "ai-catalog"
  - "utility-hackathon"
summary: "Pivoted from a failing solution accelerator to architect a bespoke ChartJS interactive telemetry dashboard for a global tire corporation, overhauled UI/UX and scoring algorithms for an internal regional AI catalog, and deployed hosted agents for a regional utility operator hackathon."
source: "C:/Users/aryan/OneDrive/microsoft_internship_log/Week 20 - a global tire and mobility corporation, an internal field agentic workflow accelerator and MCP catalog platform, a major regional electric and gas utility operator, Learning.pdf"
---

# Microsoft Internship - Week 20: Global Tire Corporation Custom Dashboard & Regional AI Refresh

## Executive Summary

Week 20 provided an exemplary demonstration of technical judgment, high ownership, and rapid software engineering. When an official Microsoft solution accelerator failed to deploy for a **global tire manufacturing and smart mobility corporation** due to legacy authentication bugs and incompatible migration scripts, Aryan made the decisive call to abandon the broken tool. In its place, he architected and built a custom, interactive telemetry visualization dashboard utilizing **ChartJS, FastAPI, and Azure AI**, rescuing a blocked sales engagement and earning enthusiastic customer praise.

Simultaneously, Aryan overhauled the user experience, evaluation schemas, and scoring algorithms for **an internal regional AI solution rating platform**, pushing the modernized platform to production. He also supported the Cloud Center of Excellence (CCoE) AI hackathon for a **major regional electric and gas utility operator**.

---

## Key Technical Initiatives & Architecture

### 1. Strategic Architectural Pivot: Global Tire Corporation Telemetry Platform
- **Client**: A global tire and mobility corporation seeking to visualize connected vehicle telemetry, tire tread wear degradation, and predictive maintenance schedules using Azure AI.
- **The Challenge**: An official solution accelerator championed by the account team was riddled with deprecated Python dependencies, broken OAuth authentication flows, and inflexible layouts that failed to run in customer subscriptions.
- **The Solution**:
  - Rather than wasting days patching unmaintainable legacy code, Aryan proposed building a clean, bespoke modern web architecture.
  - Engineered an interactive telemetry dashboard using React, Tailwind CSS, and ChartJS.
  - Connected the UI to a FastAPI backend powered by Azure AI Foundry, streaming simulated vehicle fleet metrics (pressure, temperature, tread depth, vibration frequency).
  - Integrated natural-language Q&A enabling fleet managers to query: *"Which commercial delivery vehicles in Sector 4 require immediate tire rotation?"*
  - Delivered live demonstrations to customer stakeholders, turning an imminent technical failure into an acclaimed customer success.

### 2. Regional AI Solution Rating Platform Overhaul
```text
[Internal AI Solution Repository / Codebase]
                     │
                     ▼
[Automated Solution Scoring & Evaluation Engine]
├── Architectural Modularity & Clean Separation
├── Model Context Protocol (MCP) Compliance
├── Enterprise Security & Data Boundary Validation
└── Bicep / azd IaC Provisioning Completeness
                     │
                     ▼
[Modernized Web UI / Regional Solution Catalog]
└── Production Dashboard with Tiered Badging (Gold/Silver/Bronze)
```

- Refreshed the complete UI/UX of the internal regional AI solution rating platform, implementing responsive navigation and dark mode styling.
- Upgraded the automated scoring algorithms to evaluate incoming field solutions for Model Context Protocol (MCP) compliance and enterprise security guardrails.

### 3. Regional Utility Operator CCoE AI Hackathon
- Deployed and configured hosted agent runtimes on Azure for the Cloud Center of Excellence (CCoE) hackathon of a major regional electric and gas utility operator, supporting utility engineering teams exploring grid maintenance automation.

---

## Detailed Weekly Engineering Log

### Monday, June 15, 2026
- **Tire Corporation Accelerator Diagnostics**: Attempted deployment of the official solution accelerator; identified unresolvable authentication handshake bugs and broken database migration scripts.
- **Strategic Decision**: Met with the lead solutions architect; gained approval to abandon the legacy accelerator and build a bespoke solution from scratch.

### Tuesday, June 16, 2026
- **Bespoke Telemetry Dashboard Scaffolding**: Built the React and Tailwind CSS application shell; integrated ChartJS visualization components displaying real-time tire sensor telemetry.
- **FastAPI Telemetry Ingestion**: Created mock sensor telemetry generators in Python streaming realistic vehicle speed, tire pressure, and heat degradation metrics.

### Wednesday, June 17, 2026
- **Azure AI Foundry Grounding**: Connected the telemetry dashboard to Azure AI Foundry models; implemented function calling that allows the assistant to highlight specific anomalous tires on visual 3D vehicle schematics.
- **Tire Corporation Dry Run**: Conducted an internal dry run with the account team; received glowing feedback on the interface responsiveness and visual polish.

### Thursday, June 18, 2026
- **Regional AI Catalog Refactoring**: Overhauled the frontend styling and scoring algorithms of the internal AI solution rating catalog; added automated MCP compliance evaluation checks.
- **Utility Operator Hackathon Support**: Provisioned Azure subscriptions and containerized hosted agent templates for the regional utility operator's CCoE hackathon.

### Friday, June 19, 2026
- **Production Push (AI Catalog)**: Deployed the updated regional AI solution catalog to production Azure App Services; verified responsive layouts across desktop and mobile devices.
- **Weekly Technical Retrospective**: Synced with mentors; reflected on the critical importance of technical pragmatism over blind adherence to official accelerators.

---

## Challenges Overcome & Engineering Decisions

1. **Walking Away from a Sunk-Cost Solution Accelerator**:
   - *Challenge*: Account teams often feel committed to official Microsoft accelerators even when the code an internal shadowing workflow tool fundamentally broken, fearing that starting from scratch will take too long.
   - *Decision*: Demonstrated that a modern, clean architecture built from scratch via modern tooling (FastAPI, React, ChartJS) can be delivered in 48 hours—yielding vastly superior stability, visual quality, and customer satisfaction.
2. **Rendering High-Frequency Sensor Telemetry in ChartJS**:
   - *Challenge*: Streaming hundreds of data points per second caused browser UI stuttering and canvas re-rendering lag.
   - *Decision*: Implemented dynamic data downsampling (using the Largest-Triangle-Three-Buckets algorithm) and batched chart animation updates, ensuring butter-smooth 60fps rendering.

---

## Collaboration & Team Dynamics

- **Decisive Technical Leadership**: Making the call to pivot away from a broken tool rescued a high-value customer engagement and preserved Microsoft's technical credibility.
- **High Customer Impact**: The tire corporation account team enthusiastically commended Aryan's initiative, noting that the custom solution exceeded all initial customer expectations.

---

## Technologies & Tools Utilized

- **Visualization & Frontend**: ChartJS, React, TypeScript, Tailwind CSS, Vite.
- **Backend & APIs**: FastAPI, Python 3.11, Pydantic, WebSockets.
- **Cloud Infrastructure**: Azure App Service, Azure AI Foundry, Azure Container Apps.
- **Developer Tools**: Git, GitHub Enterprise, Visual Studio Code.
