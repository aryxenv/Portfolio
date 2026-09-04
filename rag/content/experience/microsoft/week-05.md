---
id: "microsoft-week-05"
title: "Microsoft Internship - Week 5: Satellite Operator AI Roadmap, an automated internal onboarding and shadowing approval workflow engine & Securities Event"
type: "experience"
company: "Microsoft"
role: "Solutions Engineer Intern (AI Apps / Data)"
week_number: 5
log_date: "2026-03-02 to 2026-03-06"
date_range: "Mar 2026"
location: "Zaventem, Belgium"
nda_redacted: true
tech_stack:
  - "Azure App Service"
  - "Azure Entra ID"
  - "FastAPI"
  - "Power Automate"
  - "Python"
  - "Security & Compliance"
tags:
  - "microsoft"
  - "internship"
  - "internal-tooling"
  - "intern-support"
  - "satellite-telecom"
  - "securities-depository"
  - "cloud-security"
summary: "Led generative AI roadmap planning for a global satellite telecommunications provider, architected an automated internal onboarding and shadowing workflow engine with strict multi-tenant security safeguards, and attended a premier financial infrastructure event."
source: "C:/Users/aryan/OneDrive/microsoft_internship_log/Week 5 - an enterprise document intelligence and structured data extraction pipeline, Shadowing, an automated internal onboarding and shadowing approval workflow engine.pdf"
---

# Microsoft Internship - Week 5: Satellite Operator AI Roadmap, an automated internal onboarding and shadowing approval workflow engine & Securities Event

## Executive Summary

Week 5 combined enterprise customer strategy, internal developer tooling, and executive leadership engagement. Aryan co-led architectural roadmap sessions for a **global satellite telecommunications provider**, mapping telemetry monitoring workflows to multi-agent generative AI systems.

Simultaneously, Aryan conceptualized and engineered the **an automated internal onboarding and shadowing approval workflow engine**—an automated internal workflow engine designed to streamline customer shadowing approvals for interns while enforcing strict corporate tenant separation and data security boundaries. The week concluded with an executive demonstration to the Cloud & AI Executive Committee and participation in a strategic partnership event with a **global financial market infrastructure and securities depository**.

---

## Key Technical Initiatives & Architecture

### 1. Satellite Telecom Enterprise AI Transformation
- **Client**: A global satellite telecommunications provider operating international satellite constellations.
- **Scope**: Evaluate generative AI architectures for ground station log analysis, predictive transponder fault detection, and automated customer ticket resolution.
- **Architecture**:
  - Mapped high-throughput telemetry streams into Azure Event Hubs.
  - Designed an agentic triage system leveraging Azure AI Foundry to evaluate telemetry anomalies against engineering flight operational manuals.

### 2. an automated internal onboarding and shadowing approval workflow engine: Architecture & Compliance
```text
[Intern Dashboard (Web UI)]
            │
            ▼
[FastAPI Backend / Azure App Service]
            │
            ▼
[Entra ID Service Principal & Graph API]
    ├── Validates Intern Clearance Level
    ├── Checks Host FTE Approval
    └── Enforces Multi-Tenant Isolation
            │
            ▼
[Automated Approval Notification & Calendar Sync]
```

- **Objective**: Replace cumbersome manual email approvals for customer meeting shadowing with an automated, compliant self-service platform.
- **Corporate Security Safeguards**:
  - Addressed strict internal compliance standards regarding multi-tenant Azure clouds.
  - Implemented role-based access control (RBAC) ensuring interns cannot access customer-confidential tenant environments without explicit host FTE authorization.

### 3. Financial Market Infrastructure Strategic Event
- Attended a joint technical and strategic summit with a global financial market infrastructure and securities depository, analyzing regulatory compliance frameworks (DORA, NIS2) and sovereign data governance in the financial sector.

---

## Detailed Weekly Engineering Log

### Monday, March 2, 2026
- **Satellite Operator Strategy Sync**: Participated in high-level architectural planning for the satellite telecommunications account; identified initial proof-of-concept candidates.
- **an automated internal onboarding and shadowing approval workflow engine Inception**: Gathered requirements from the intern cohort and solutions architects regarding meeting shadowing bottlenecks; drafted technical architecture.

### Tuesday, March 3, 2026
- **Backend Engineering (an automated internal onboarding and shadowing approval workflow engine)**: Built core API endpoints using FastAPI; implemented Entra ID authentication and Microsoft Graph API integration for user profile and schedule verification.
- **Document Intelligence Follow-up**: Conducted quality assurance testing on enterprise document extraction outputs, refining confidence scoring thresholds.

### Wednesday, March 4, 2026
- **Corporate Security & Tenancy Review**: Met with corporate IT security leads to review the an automated internal onboarding and shadowing approval workflow engine architecture; identified necessary safeguards regarding tenant separation and data retention policies.
- **Tech Connect Knowledge Sessions**: Participated in internal Microsoft IQ Tech Connect sessions exploring emergent Copilot extensibility patterns.

### Thursday, March 5, 2026
- **Executive Committee Presentation**: Demonstrated the working an automated internal onboarding and shadowing approval workflow engine prototype to the Cloud & AI Executive Committee (EC) leadership; received praise for taking initiative on organizational efficiency.
- **Satellite Architecture Alignment**: Synthesized customer technical requirements into an architectural blueprint utilizing Azure AI Foundry and containerized agents.

### Friday, March 6, 2026
- **Global Securities Depository Summit**: Attended the strategic partnership event with the financial market infrastructure enterprise; participated in technical discussions on financial sovereign cloud architectures.
- **Code Hardening & Weekly Retrospective**: Hardened input validation guards across the an automated internal onboarding and shadowing approval workflow engine repository and documented deployment instructions.

---

## Challenges Overcome & Engineering Decisions

1. **Navigating Corporate Security Boundaries for Internal Tools**:
   - *Challenge*: Internal tools connecting to employee calendars and meeting metadata must clear stringent corporate data protection and privacy reviews.
   - *Decision*: Restriced Graph API permissions to minimal necessary scopes (`Calendars.Read.Shared` and `User.Read`), avoiding high-privilege application-level permissions that require global admin consent.
2. **Aligning Satellite Telemetry with LLM Context Windows**:
   - *Challenge*: Raw satellite ground station logs produce gigabytes of time-series data unsuitable for direct LLM ingestion.
   - *Decision*: Architected an anomaly detection pre-filtering layer that extracts statistical deviations before passing enriched textual summaries to the generative model.

---

## Collaboration & Team Dynamics

- **Executive Visibility**: Delivering the internal tool demo to Executive Committee leaders demonstrated high ownership and the ability to identify and address organizational friction points.
- **Cross-Enterprise Perspective**: Engaging with both satellite aerospace and banking infrastructure clients broadened understanding of contrasting industry risk tolerances.

---

## Technologies & Tools Utilized

- **Cloud Infrastructure**: Azure App Service, Azure Event Hubs, Azure Entra ID.
- **APIs & Protocols**: Microsoft Graph API, OAuth 2.0, REST, JSON.
- **Languages & Frameworks**: Python 3.11, FastAPI, Pydantic.
- **Enterprise Platforms**: Azure AI Foundry, Power Automate.
