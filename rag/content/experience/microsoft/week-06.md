---
id: "microsoft-week-06"
title: "Microsoft Internship - Week 6: Agentic AI Hackathon Repo Hardening & AI Tour Booth Planning"
type: "experience"
company: "Microsoft"
role: "Solutions Engineer Intern (AI Apps / Data)"
week_number: 6
log_date: "2026-03-09 to 2026-03-13"
date_range: "Mar 2026"
location: "Zaventem, Belgium"
nda_redacted: true
tech_stack:
  - "Azure AI Foundry"
  - "GitHub Actions"
  - "GitHub Copilot"
  - "Python"
  - "Evaluation Metrics (BLEU, ROUGE, Groundedness)"
  - "Docker"
tags:
  - "microsoft"
  - "internship"
  - "hackathon-maintenance"
  - "agentic-ai"
  - "ai-tour"
  - "model-evaluation"
  - "git-pr"
summary: "Debugged and authored critical architectural pull requests for the official Agentic AI Hackathon repository, planned developer booth experiences for the Microsoft AI Tour, conceptualized GitHub Copilot hardware extensions, and built custom model evaluation pipelines."
source: "C:/Users/aryan/OneDrive/microsoft_internship_log/Week 6 - Prep AI tour, Agentic AI Hack, Shadowing.pdf"
---

# Microsoft Internship - Week 6: Agentic AI Hackathon Repo Hardening & AI Tour Booth Planning

## Executive Summary

Week 6 was characterized by deep software debugging, community developer enablement, and flagship event preparations. Aryan conducted an exhaustive technical audit of the official **Agentic AI Hackathon repository**, resolving critical dependency bugs, correcting fragile orchestration logic, and submitting upstream pull requests that ensured smooth execution for hundreds of upcoming customer participants.

Additionally, Aryan drove technical preparations for the flagship **Microsoft AI Tour**, conceptualized novel hardware-assisted interactions for GitHub Copilot, and built automated evaluation and feedback scoring pipelines in Azure AI Foundry.

---

## Key Technical Initiatives & Architecture

### 1. Upstream Agentic AI Hackathon Repository Hardening
- **Context**: The official hackathon repository used across European customer events suffered from runtime exceptions, outdated package dependencies, and fragile environment initialization scripts.
- **Engineering Fixes Delivered**:
  - Audited challenge notebooks and Python source modules across all hackathon tiers.
  - Resolved asynchronous event loop deadlocks in multi-agent tool execution flows.
  - Pinned non-breaking dependency versions across `azure-ai-projects`, `pydantic`, and `semantic-kernel`.
  - Authored clean pull requests with detailed reproduction logs, merged into the master repository for production use during customer hackathons.

### 2. Automated Model Evaluation Pipelines in Azure AI Foundry
- **Objective**: Implement continuous, automated evaluation of agentic completions against defined benchmark datasets.
- **Architecture**:
  - Configured custom evaluation runs measuring Groundedness, Relevance, Fluency, and Coherence.
  - Implemented custom automated scoring scripts in Python leveraging LLM-as-a-judge evaluation frameworks.

### 3. Microsoft AI Tour Developer Experience Planning
- Formulated interactive attendee flows for the developer demo booths (Azure AI Foundry and GitHub Copilot).
- Conceptualized a live "vibecoding" competition showcase demonstrating real-time AI-assisted application generation.

---

## Detailed Weekly Engineering Log

### Monday, March 9, 2026
- **Security Presentation Review**: Reviewed technical formatting and architectural diagrams for upcoming security briefing slides; standardized visual typography.
- **Hackathon Repository Audit Kickoff**: Cloned the official Agentic AI Hackathon repository; began systematic reproduction of reported environment initialization failures.

### Tuesday, March 10, 2026
- **Deep Debugging & Code Patching**: Identified race conditions in asynchronous tool invocation handlers; patched threading bottlenecks and tested multi-turn agent conversations.
- **Upstream Pull Requests**: Submitted structured pull requests addressing Challenge 2 and Challenge 3 defects with full verification test coverage.

### Wednesday, March 11, 2026
- **Foundry Evaluation Pipelines**: Built automated evaluation workflows in Azure AI Foundry; configured test datasets assessing retrieval accuracy and hallucination rates.
- **AI Tour Booth Logistics**: Coordinated with developer marketing leads on hardware requirements, multi-monitor display configurations, and high-speed network provisioning for the AI Tour.

### Thursday, March 12, 2026
- **GitHub Copilot Hardware Concept**: Researched and documented technical specifications for dedicated hardware input devices (macro controllers/stream decks) mapped to GitHub Copilot commands.
- **Customer Shadowing Sync**: Shadowed senior solutions architects on customer account reviews, analyzing how enterprise clients structure agent governance policies.

### Friday, March 13, 2026
- **Hackathon Final Verification**: Completed end-to-end dry runs of the entire hackathon challenge suite in a clean Azure subscription to confirm zero remaining defects.
- **Weekly Technical Retrospective**: Synced with the solutions engineering mentor; established priorities for next week's speech optimization and GraphRAG deliverables.

---

## Challenges Overcome & Engineering Decisions

1. **Unstable Asynchronous Event Loops in Agent Frameworks**:
   - *Challenge*: Multi-agent coordination scripts threw `RuntimeError: This event loop an internal shadowing workflow tool already running` in Jupyter notebook environments.
   - *Decision*: Refactored agent execution calls using `nest_asyncio` and clean thread executor wrappers, ensuring cross-platform stability across Windows, macOS, and Linux runners.
2. **Objective Groundedness Scoring**:
   - *Challenge*: Standard string-matching metrics (BLEU/ROUGE) failed to capture semantic correctness in complex technical summaries.
   - *Decision*: Implemented synthetic evaluation benchmarks using an evaluator LLM prompted with strict rubrics and chain-of-thought verification.

---

## Collaboration & Team Dynamics

- **Upstream Open-Source Impact**: Fixing the hackathon repository directly unblocked dozens of technical specialists across Europe who rely on the codebase for client-facing hackathons.
- **Proactive Initiative**: Identified and resolved repo flaws autonomously without waiting for leadership escalation.

---

## Technologies & Tools Utilized

- **Cloud & AI Services**: Azure AI Foundry, Azure OpenAI Service, Azure Evaluation SDK.
- **Agent Frameworks**: Semantic Kernel, AutoGen / Agentic Workflows.
- **Languages & Frameworks**: Python 3.11, asyncio, Pydantic.
- **Developer Tools**: GitHub, Git, Jupyter Notebooks, Docker.
