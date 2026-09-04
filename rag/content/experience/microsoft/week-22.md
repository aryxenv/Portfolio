---
id: "microsoft-week-22"
title: "Microsoft Internship - Week 22: Science Festival Hardening, Banking Strategy & a global steel wire and coating manufacturing enterprise Discovery"
type: "experience"
company: "Microsoft"
role: "Solutions Engineer Intern (AI Apps / Data)"
week_number: 22
log_date: "2026-06-29 to 2026-07-03"
date_range: "Jul 2026"
location: "Zaventem, Belgium"
nda_redacted: true
tech_stack:
  - "Azure Front Door"
  - "Web Application Firewall (WAF)"
  - "Azure Container Apps"
  - "Rate Limiting"
  - "Azure AI Foundry"
  - "FastAPI"
  - "Python"
tags:
  - "microsoft"
  - "internship"
  - "cloud-hardening"
  - "azure-front-door"
  - "waf-security"
  - "banking-ai"
  - "steel-wire-ai"
  - "faststart-fy27"
summary: "Hardened the public science festival web application with Azure Front Door rate limiting and WAF security, advanced conversational voice migration strategy for a commercial bank, and initiated technical discovery for a global steel wire enterprise."
source: "C:/Users/aryan/OneDrive/microsoft_internship_log/Week 22 - Nerdland, a prominent Belgian commercial and retail banking group, Feedback, an internal field agentic workflow accelerator and MCP catalog platform, Faststart FY27.pdf"
---

# Microsoft Internship - Week 22: Science Festival Hardening, Banking Strategy & a global steel wire and coating manufacturing enterprise Discovery

## Executive Summary

Week 22 was defined by enterprise cloud infrastructure hardening, strategic commercial banking advisory, and new enterprise customer discovery. Aryan focused on preparing the **Nerdland science festival AI assistant** for public festival deployment to thousands of concurrent users: deploying **Azure Front Door**, configuring **Web Application Firewall (WAF)** rate-limiting policies, patching application security vulnerabilities, and updating system operational documentation.

Concurrently, Aryan finalized the conversational voice migration roadmap for the **prominent Belgian commercial and retail banking group**, supported Faststart FY27 sales kickoff alignment, and initiated technical discovery on computer vision defect detection for a **global steel wire and coating manufacturing enterprise**.

---

## Key Technical Initiatives & Architecture

### 1. Science Festival Cloud Hardening (Azure Front Door & WAF)
```text
[Public Festival Visitors (Mobile / Web)]
                   │
                   ▼
┌────────────────────────────────────────────────────────┐
│ Azure Front Door (Global Anycast Edge Network)         │
│ ├── Web Application Firewall (WAF) Inspection          │
│ ├── Rate Limiting: 100 requests / IP / minute          │
│ ├── SSL/TLS Termination & HTTP/2 Acceleration          │
│ └── DDoS Protection & Bot Management                   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼ (Private VNet Ingress)
┌────────────────────────────────────────────────────────┐
│ Azure Container Apps Backend Microservices             │
│ ├── FastAPI Application Gateway                        │
│ └── In-Memory Token Caching & Debouncing               │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
          [Azure AI Search & OpenAI Endpoints]
```

- **Objective**: Protect public festival AI endpoints from denial-of-service surges, bot scraping, and runaway API consumption costs.
- **Security & Performance Controls Deployed**:
  - Implemented Azure Front Door as the global ingress gateway.
  - Configured custom WAF rate-limiting rules enforcing a threshold of 100 requests per IP per minute.
  - Implemented token-bucket debouncing in the backend API to cache repeated festival schedule queries.
  - Conducted vulnerability scanning on server endpoints, eliminating CORS misconfigurations.

### 2. Banking Conversational Roadmap Finalization
- Formulated the final architectural recommendations for the commercial bank, presenting a structured comparative evaluation of Voice Live versus hosted agent architectures.
- Emphasized strict compliance boundaries regarding non-GA preview capabilities, demonstrating adherence to senior leadership feedback on guarding credibility.

### 3. Industrial Steel Wire Enterprise Discovery
- Kicked off technical discovery for a global steel wire and coating technologies manufacturer exploring automated wire surface defect detection via Azure Content Understanding.

---

## Detailed Weekly Engineering Log

### Monday, June 29, 2026
- **Front Door Architecture Planning**: Analyzed projected festival traffic volumes; designed Azure Front Door routing rules and origin pool configurations.
- **WAF Policy Configuration**: Authored custom Web Application Firewall rules enforcing rate limits and blocking malicious SQL/XSS query strings.

### Tuesday, June 30, 2026
- **Science Festival Server Hardening**: Patched CORS origin headers and secure cookie attributes in the festival backend; tested SSL termination under load.
- **Load Testing**: Executed simulated multi-client request bursts against Front Door endpoints; verified that WAF rules correctly throttled abusive IP addresses with HTTP 429 status codes.

### Wednesday, July 1, 2026
- **Banking Advisory Finalization**: Synthesized voice agent migration recommendations for the commercial bank; presented the roadmap to solutions engineering mentors.
- **Faststart FY27 Strategy**: Attended regional sales strategy sessions reviewing target industry verticals for Cloud & AI.

### Thursday, July 2, 2026
- **Steel Wire Enterprise Discovery**: Met with account technology strategists to review the steel wire manufacturer's manufacturing workcell requirements; analyzed video inspection sample specs.
- **Regional AI Catalog Maintenance**: Updated catalog documentation and verified production telemetry metrics.

### Friday, July 3, 2026
- **Science Festival Documentation Handoff**: Authored operational runbooks detailing Front Door configuration, emergency failover procedures, and log monitoring queries.
- **Weekly Technical Retrospective**: Synced with mentors; aligned on the upcoming deep dive into the complex enterprise knowledge agent repository (`an enterprise knowledge agent prototype grounded in multi-source knowledge bases`).

---

## Challenges Overcome & Engineering Decisions

1. **Protecting Festival API Budgets Without Degraded User Experience**:
   - *Challenge*: Setting rate limits too aggressively risks blocking legitimate festival attendees sharing public Wi-Fi access points.
   - *Decision*: Configured client-side session fingerprinting combined with IP-based rate limiting, allowing legitimate concurrent festival attendees on shared subnets to query the assistant without false-positive blocks.
2. **Adhering to Ethical Communication Standards in Banking Advisory**:
   - *Challenge*: Pressure to pitch cutting-edge preview features to win competitive sales deals.
   - *Decision*: Maintained absolute technical integrity by explicitly noting preview API limitations, which earned long-term respect from client enterprise architects.

---

## Collaboration & Team Dynamics

- **Cross-Team Security Delivery**: Partnered with cloud infrastructure engineers to harden public-facing assets against real-world internet threats.
- **Trusted Advisor Posture**: Prioritizing honesty and technical reality in customer briefings solidified Aryan's reputation as a mature, trusted solutions engineer.

---

## Technologies & Tools Utilized

- **Cloud Security & Networking**: Azure Front Door, Web Application Firewall (WAF), Private Endpoints, Azure Container Apps.
- **AI & Data Platforms**: Azure AI Foundry, Azure AI Search, Azure OpenAI Service.
- **Performance & Testing**: Locust (Load Testing), Python 3.11, FastAPI, Docker.
