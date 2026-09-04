---
id: "microsoft-week-16"
title: "Microsoft Internship - Week 16: Regional Agent Marketplace & HigherEd AI Hackathon"
type: "experience"
company: "Microsoft"
role: "Solutions Engineer Intern (AI Apps / Data)"
week_number: 16
log_date: "2026-05-18 to 2026-05-22"
date_range: "May 2026"
location: "Zaventem, Belgium"
nda_redacted: true
tech_stack:
  - "Model Context Protocol (MCP)"
  - "GitHub Copilot Agents"
  - "Azure AI Foundry"
  - "React"
  - "FastAPI"
  - "Python"
tags:
  - "microsoft"
  - "internship"
  - "agent-marketplace"
  - "mcp-catalog"
  - "hackathon-mentorship"
  - "higher-education"
  - "crm-enablement"
summary: "Built an internal regional Copilot agent marketplace and MCP extension catalog, mentored student teams at the Belgian Agentic AI for Higher Education Hackathon, refined Product Group contact discovery, and evaluated railway mobility requirements."
source: "C:/Users/aryan/OneDrive/microsoft_internship_log/Week 16 - sales CRM technical enablement exercise, HigherEd AI Hackathon, an internal field solution accelerator catalog, Azure Learning, the national passenger railway transport operator, an internal regional Copilot agent marketplace.pdf"
---

# Microsoft Internship - Week 16: Regional Agent Marketplace & HigherEd AI Hackathon

## Executive Summary

Week 16 bridged internal platform innovation with community educational outreach. Aryan built the **Regional Copilot Agent Marketplace**—a conversational web portal designed to allow solutions engineers and customers to easily discover, configure, and install reusable Model Context Protocol (MCP) servers and agent skills.

Aryan also represented Microsoft as a technical mentor at the **Agentic AI for Higher Education Hackathon** in Belgium, guiding university student teams in architecting agentic workflows on Azure AI Foundry. In addition, Aryan participated in sales CRM technical enablement exercises, enhanced the Product Group Contact Discovery tool, and analyzed mobility requirements for the national passenger railway operator.

---

## Key Technical Initiatives & Architecture

### 1. Regional Copilot Agent Marketplace Architecture
```text
[Solutions Engineer / Customer Architect]
                    │
                    ▼
[Marketplace Web Portal & Search Interface]
                    │
                    ▼
[Centralized MCP Server & Skill Catalog]
├── Verified Azure Tool Servers (Search, Cosmos, SQL)
├── Community & Partner MCP Connectors
└── Enterprise Safety & Compliance Badges
                    │
                    ▼
[One-Click Installation Manifest Generator]
├── VS Code Settings Configuration (settings.json)
└── GitHub Copilot Agent Environment Manifest
```

- **Objective**: Overcome fragmentation in the internal developer ecosystem by creating a unified discovery hub for Model Context Protocol (MCP) servers and Copilot agent extensions.
- **Features Implemented**:
  - Rich search and tag filtering (by domain: data, security, speech, CRM, productivity).
  - Automated manifest generation outputting pre-configured JSON configurations for immediate installation into Visual Studio Code and GitHub Copilot.

### 2. Higher Education Agentic AI Hackathon Mentorship
- **Role**: Technical mentor and roving architecture consultant for university teams across Belgium.
- **Guidance Provided**:
  - Guided student developers in decomposing complex academic challenges into modular multi-agent workflows.
  - Troubleshot Azure AI Foundry API keys, endpoint rate limits, and custom prompt formatting.
  - Judged hackathon presentations based on architectural soundness, groundedness, and practical feasibility.

---

## Detailed Weekly Engineering Log

### Monday, May 18, 2026
- **Sales CRM Exercise Sync**: Participated in technical enablement syncs on the enterprise sales CRM system; tested API access and workflow automations.
- **Marketplace Scaffolding**: Designed the data model and UI wireframes for the Regional Copilot Agent Marketplace.

### Tuesday, May 19, 2026
- **Marketplace Frontend & Backend**: Built the catalog frontend using React and Tailwind CSS; integrated a FastAPI backend storing verified MCP server configurations.
- **Manifest Export Engine**: Coded automated JSON configuration generators enabling one-click import into VS Code and GitHub Copilot agents.

### Wednesday, May 20, 2026
- **Higher Education AI Hackathon (Day 1)**: Mentored student teams on-site at the hackathon venue; conducted breakout sessions explaining Model Context Protocol mechanics.
- **Technical Troubleshooting**: Resolved deployment hurdles for student teams connecting Python agents to Azure OpenAI embeddings.

### Thursday, May 21, 2026
- **Higher Education AI Hackathon (Day 2)**: Continued team coaching; assisted student finalists with prompt tuning and live demonstration rehearsals.
- **Hackathon Judging**: Evaluated final student project demonstrations alongside university faculty and industry partners.

### Friday, May 22, 2026
- **Product Group Contact Discovery Polish**: Incorporated feature updates into the Product Group Finder tool based on feedback from Solutions Engineering peers.
- **Railway Mobility Architecture Review**: Reviewed architectural notes on passenger assistant voice routing with the technical lead; aligned on next steps for call-center integration.

---

## Challenges Overcome & Engineering Decisions

1. **Standardizing Disparate MCP Manifest Formats**:
   - *Challenge*: Different MCP servers utilized varying environment variable naming conventions and command-line execution arguments.
   - *Decision*: Defined a standardized JSON schema schema validator in the marketplace backend that normalizes server definitions into a unified format before export.
2. **Demystifying Agentic AI for Academic Students**:
   - *Challenge*: Hackathon students often attempted to solve complex problems with single monolithic prompts rather than modular agent tools.
   - *Decision*: Mentored teams to adopt single-responsibility tool design, showing that multiple small specialized agents deliver vastly higher accuracy than a single oversized prompt.

---

## Collaboration & Team Dynamics

- **Inspiring Future Talent**: Representing Microsoft at the university hackathon provided meaningful educational mentorship to the next generation of software engineers.
- **Organizational Alignment**: The regional agent marketplace aligned with technical leadership's strategy to scale AI enablement across the regional subsidiary.

---

## Technologies & Tools Utilized

- **Agentic Platforms**: Model Context Protocol (MCP), GitHub Copilot Agents, Azure AI Foundry.
- **Web Technologies**: React, TypeScript, Tailwind CSS, FastAPI, Python 3.11.
- **Collaboration**: GitHub Enterprise, Git, Visual Studio Code.
