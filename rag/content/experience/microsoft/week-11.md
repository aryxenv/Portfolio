---
id: "microsoft-week-11"
title: "Microsoft Internship - Week 11: Rail Assistant Voice, Techorama Security & Threat Modeling"
type: "experience"
company: "Microsoft"
role: "Solutions Engineer Intern (AI Apps / Data)"
week_number: 11
log_date: "2026-04-13 to 2026-04-17"
date_range: "Apr 2026"
location: "Zaventem, Belgium"
nda_redacted: true
tech_stack:
  - "Azure AI Foundry"
  - "Realtime Audio API"
  - "Threat Modeling (STRIDE)"
  - "WebSockets"
  - "React"
  - "FastAPI"
  - "Python"
tags:
  - "microsoft"
  - "internship"
  - "ai-security"
  - "techorama"
  - "threat-modeling"
  - "railway-voice"
  - "science-festival"
  - "compliance"
summary: "Advanced real-time voice features for the national railway passenger assistant, co-architected an AI security prompt injection demonstration for Techorama, modernized the science festival AI assistant, and open-sourced an automated threat modeling visualizer."
source: "C:/Users/aryan/OneDrive/microsoft_internship_log/Week 11 - an enterprise rail passenger mobility assistant demo (the national passenger railway transport operator), Techorama, Nerdland, Healthcare, an internal shadowing workflow tool, Learning.pdf"
---

# Microsoft Internship - Week 11: Rail Assistant Voice, Techorama Security & Threat Modeling

## Executive Summary

Week 11 spanned real-time conversational engineering, cybersecurity demonstration architecture, and public event enablement. Aryan made significant advances on the **national passenger railway operator's** voice assistant demo, resolving station phonetic pronunciation and latency routing.

In collaboration with security specialists and solutions architects, Aryan co-architected an **AI Security demonstration for Techorama** (Belgium's largest developer conference), simulating prompt injection and code execution vulnerabilities against Azure AI Foundry agents to demonstrate defensive guardrails. Furthermore, Aryan modernized the architecture of the **Nerdland science festival AI assistant**, built and open-sourced an **Automated Threat Modeling Visualizer**, and navigated European Union Data Boundary (EUDB) compliance constraints.

---

## Key Technical Initiatives & Architecture

### 1. Techorama AI Security Demo: Code Injection on AI Foundry Agents
```text
[Untrusted User Prompt / Malicious Injection Payload]
                         │
                         ▼
           [Azure AI Foundry Agent]
   ├── Attack Vector: Indirect Prompt Injection
   ├── Vulnerability: Dynamic Code Evaluation Tool
   └── Target: Unauthorized File System Access
                         │
                         ▼ (Security Boundary)
        [Defensive Mitigation Layer]
   ├── Azure Content Safety Prompt Shields
   ├── Strict Parameter Schema Validation
   └── Container Sandboxing & Policy Enforcement
```

- **Objective**: Educate enterprise developers at Techorama on emergent security vulnerabilities unique to LLM-powered autonomous agents.
- **Demonstration Scenarios**:
  - *Vulnerability Showcase*: Crafted realistic prompt injection payloads demonstrating how an unshielded agent tool could be manipulated into executing arbitrary system commands.
  - *Defense Implementation*: Configured Azure AI Foundry content safety filters, system prompt guardrails, and deterministic tool schema validation to block the attack vectors in real time.

### 2. Science Festival AI Assistant Architecture Modernization
- **Context**: A public science festival AI assistant required complete architectural refactoring to handle thousands of concurrent festival visitors inquiring about schedules, stage locations, and science workshops.
- **Engineering Deliverables**:
  - Refactored frontend and backend separation; decoupled static web hosting from dynamic RAG query APIs.
  - Integrated Azure AI Search with optimized chunking of festival program guides and speaker biographies.

### 3. Open-Source Automated Threat Modeling Visualizer
- Built an interactive, browser-based threat modeling tool mapping multi-agent architecture graphs to the STRIDE threat matrix (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege).
- Published the utility to internal developer channels, enabling solutions engineers to visualize agent security boundaries for customer presentations.

---

## Detailed Weekly Engineering Log

### Monday, April 13, 2026
- **Railway Voice Assistant Sprint**: Refined GPT-Realtime Audio integration for the national railway assistant; tuned voice activity detection (VAD) thresholds for noisy station environments.
- **Phonetic Evaluation**: Tested speech recognition accuracy across multilingual Belgian station names; documented edge-case phonetic misinterpretations.

### Tuesday, April 14, 2026
- **Science Festival Codebase Audit**: Reviewed existing festival assistant repository; identified architectural bottlenecks and unpinned dependencies.
- **Refactoring Plan**: Formulated a modernization plan to migrate the application to containerized Azure Container Apps and Azure AI Search.

### Wednesday, April 15, 2026
- **Techorama AI Security Planning**: Met with cybersecurity specialists to define attack scenarios for the Techorama conference; authored proof-of-concept injection prompts.
- **Guardrail Implementation**: Tested Azure Content Safety Prompt Shields and evaluated false-positive rates on complex technical prompts.

### Thursday, April 16, 2026
- **Threat Modeling Tool Development**: Engineered the interactive Automated Threat Modeling Visualizer using React and Tailwind CSS; implemented interactive risk-matrix mapping.
- **Compliance & EUDB Investigation**: Learned that certain internal sales CRM connectors conflicted with European Union Data Boundary (EUDB) compliance guidelines when paired with Copilot; flagged findings to leadership to realign development.

### Friday, April 17, 2026
- **Threat Modeling Tool Release**: Open-sourced the visualizer on internal Microsoft repositories; created user documentation and video walkthroughs.
- **Weekly Technical Debrief**: Synced with mentors on Techorama progress; reviewed upcoming speaker diarization evaluations for maritime port clients.

---

## Challenges Overcome & Engineering Decisions

1. **Navigating EUDB Compliance on Developer Tools**:
   - *Challenge*: An experimental CRM automation tool relied on external telemetry routing that breached European Union Data Boundary regulations.
   - *Decision*: Immediately halted development on the non-compliant branch, initiated review with the compliance lead, and restricted subsequent tooling strictly to sovereign EU-hosted endpoints.
2. **Balancing Realism and Safety in Conference Security Demos**:
   - *Challenge*: Live conference demonstrations simulating code execution risk triggering enterprise security alarms or conveying irresponsible security practices.
   - *Decision*: Executed the demonstration within an isolated, ephemeral Docker container sandbox with mock credentials and non-destructive payloads, emphasizing the defensive mitigation layer.

---

## Collaboration & Team Dynamics

- **Cross-Domain Partnership**: Partnered with dedicated security architects to build an impactful conference demonstration combining generative AI with enterprise cybersecurity.
- **Ethical & Compliance Leadership**: Demonstrated high maturity by prioritizing data privacy and EUDB regulatory compliance above convenient shortcut solutions.

---

## Technologies & Tools Utilized

- **Cloud & AI Platforms**: Azure AI Foundry, Azure OpenAI Service, Azure Content Safety (Prompt Shields).
- **Speech & Audio**: Azure Realtime Audio API, WebSockets.
- **Security & Modeling**: STRIDE Threat Modeling, Docker Sandbox, OWASP Top 10 for LLMs.
- **Languages & Frameworks**: Python 3.11, React, TypeScript, FastAPI, Tailwind CSS.
