---
id: "microsoft-week-01"
title: "Microsoft Internship - Week 1: Onboarding, Model Context Protocol & STU Hackathon"
type: "experience"
company: "Microsoft"
role: "Solutions Engineer Intern (AI Apps / Data)"
week_number: 1
log_date: "2026-02-02 to 2026-02-06"
date_range: "Feb 2026"
location: "Zaventem, Belgium"
nda_redacted: true
tech_stack:
  - "Azure AI Foundry"
  - "Model Context Protocol (MCP)"
  - "Speech-to-Text (STT)"
  - "FastAPI"
  - "Python"
  - "Git"
tags:
  - "microsoft"
  - "internship"
  - "onboarding"
  - "mcp"
  - "hackathon"
  - "ai-foundry"
  - "speech-to-text"
summary: "Completed corporate engineering onboarding at Microsoft Belux in Zaventem, initiated project scaffolding for the Model Context Protocol (MCP) for Research initiative, and developed a real-time speech-to-text assistant integrated with Azure AI Foundry during the STU Hackathon."
source: "C:/Users/aryan/OneDrive/microsoft_internship_log/Week 1 - Onboarding, Hackathon.pdf"
---

# Microsoft Internship - Week 1: Onboarding, Model Context Protocol & STU Hackathon

## Executive Summary

Week 1 marked the formal commencement of Aryan Shah's internship as a Solutions Engineer Intern (AI Apps / Data) within the Solution Technical Unit (STU) at Microsoft Belux headquarters in Zaventem, Belgium. The week focused on corporate workstation provisioning, security compliance onboarding, and initial alignment with technical leadership regarding the commercial Solutions Engineering lifecycle.

Beyond administrative onboarding, Aryan immediately engaged in technical delivery: kicking off the architecture and scaffolding for the **Model Context Protocol (MCP) for Research** project, and participating in the regional **STU Hackathon**, where he built a functional real-time speech-to-text prototype integrated with Azure AI Foundry.

---

## Key Technical Initiatives & Architecture

### 1. Model Context Protocol (MCP) for Research
- **Objective**: Standardize how generative AI models and autonomous agents interact with academic research tools, scientific knowledge repositories, and search indices.
- **Architectural Scaffolding**:
  - Researched Anthropic's open Model Context Protocol (MCP) standard and evaluated integration points with Microsoft Azure AI services.
  - Defined server and client boundaries: separating the agent orchestrator from specialized MCP tool servers.
  - Formulated a multi-stage project roadmap dividing responsibilities across the intern cohort (data connectors, prompt templates, and evaluation harnesses).

### 2. STU Hackathon: Real-Time Voice Knowledge Assistant Prototype
- **Concept**: Develop an automated real-time voice and technical knowledge assistant capable of transcribing spoken queries in real time and grounding responses in sales technical documentation.
- **Implementation**:
  - Engineered a lightweight audio streaming client connected to Azure Speech-to-Text (STT).
  - Integrated the transcribed output stream into an Azure AI Foundry chat completion pipeline with prompt-engineered system instructions.
  - Co-authored presentation slides and prepared a live interactive demonstration for technical unit peers.

---

## Detailed Weekly Engineering Log

### Monday, February 2, 2026
- **Corporate Welcome & Workstation Provisioning**: Attended Microsoft Welcome Day at the Zaventem campus; configured developer hardware, corporate security credentials, multi-factor authentication (MFA), and developer environment access.
- **Organizational Alignment**: Met with cloud & AI technical leadership and peer interns to review quarterly objectives.

### Tuesday, February 3, 2026
- **Office Integration**: Met team members across the Cloud & AI Solution Technical Unit; completed corporate compliance courses, environmental health and safety certifications, and data handling agreements.

### Wednesday, February 4, 2026
- **Solutions Engineering Orientation**: Participated in an introductory deep-dive with a senior solutions engineering mentor on the technical sales lifecycle, opportunity qualification, architectural design sessions (ADS), and customer proof-of-concept (PoC) delivery.
- **MCP for Research Scaffolding**: Formulated the initial project charter for MCP for Research; conducted technical literature reviews on MCP protocol specifications (JSON-RPC over stdio and Server-Sent Events).

### Thursday, February 5, 2026
- **MCP for Research Brainstorming & Planning**: Convened with the solutions engineering mentor and peer interns to define functional roles, system architecture, and delivery milestones.
- **Azure Tenant Provisioning Support**: Assisted a peer intern with navigating corporate cloud subscription requests and resolving tenant permission blocks.
- **Executive Committee Sync**: Attended the Cloud & AI Executive Committee (EC) team meeting, gaining visibility into regional revenue targets, consumption metrics, and high-priority customer pipeline accounts.

### Friday, February 6, 2026
- **STU Hackathon Development**: Collaborated with a cross-functional hackathon team to design, code, and deploy the "an automated real-time voice and technical knowledge assistant" real-time speech-to-text prototype.
- **Azure AI Foundry Integration**: Connected Azure Speech Services audio streams to Azure AI Foundry models; fine-tuned latency parameters and prepared the pitch presentation for leadership review.

---

## Challenges Overcome & Engineering Decisions

1. **Protocol Selection for Tool Grounding**:
   - *Challenge*: Evaluating whether to build proprietary tool-calling connectors or adopt the emergent Model Context Protocol (MCP) standard.
   - *Decision*: Standardized on MCP to ensure long-term interoperability with external agent ecosystems, Visual Studio Code extensions, and GitHub Copilot plugins.
2. **Audio Streaming Latency in Hackathon Prototype**:
   - *Challenge*: Real-time transcription showed noticeable lag when sending raw audio buffers sequentially.
   - *Decision*: Configured chunked streaming over WebSockets, decoupling audio capture from LLM completion calls to achieve near-instantaneous visual feedback.

---

## Collaboration & Team Dynamics

- **Mentorship Alignment**: Structured weekly deliverables with the senior solutions engineering mentor and internship supervisor, establishing open feedback channels.
- **Peer Enablement**: Unblocked fellow interns during cloud tenant access provisioning, ensuring the entire cohort was equipped with functional Azure subscriptions.

---

## Technologies & Tools Utilized

- **Cloud & AI Services**: Azure AI Foundry, Azure Speech Services (Speech-to-Text).
- **Protocols & Standards**: Model Context Protocol (MCP), JSON-RPC, WebSockets.
- **Languages & Frameworks**: Python 3.11, FastAPI.
- **Development Tools**: Visual Studio Code, Git, GitHub Enterprise.
