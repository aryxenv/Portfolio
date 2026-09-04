---
id: "microsoft-week-08"
title: "Microsoft Internship - Week 8: Microsoft AI Tour Delivery & Banking Contact Center AI"
type: "experience"
company: "Microsoft"
role: "Solutions Engineer Intern (AI Apps / Data)"
week_number: 8
log_date: "2026-03-23 to 2026-03-27"
date_range: "Mar 2026"
location: "Zaventem, Belgium"
nda_redacted: true
tech_stack:
  - "Azure AI Foundry"
  - "GitHub Copilot"
  - "Contact Center as a Service (CCaaS)"
  - "FastAPI"
  - "Python"
  - "Azure Communication Services"
tags:
  - "microsoft"
  - "internship"
  - "ai-tour"
  - "public-demo"
  - "ccaas"
  - "banking-ai"
  - "peer-coaching"
summary: "Staffed live developer demonstration booths at the flagship Microsoft AI Tour delivering Azure AI Foundry and GitHub Copilot showcases, architected contact center AI transformation demos for a major cooperative banking institution, and coached interview candidates."
source: "C:/Users/aryan/OneDrive/microsoft_internship_log/Week 8 - AI Tour, contact center AI transformation for a major banking institution.pdf"
---

# Microsoft Internship - Week 8: Microsoft AI Tour Delivery & Banking Contact Center AI

## Executive Summary

Week 8 was anchored by the delivery of the flagship **Microsoft AI Tour**—a premiere regional conference bringing together thousands of enterprise executives, cloud architects, and software engineers. Aryan was deployed on the exhibition floor, staffing technical demonstration booths for **Azure AI Foundry** and **GitHub Copilot**, fielding advanced questions, showcasing live code-generation workflows, and capturing prospective enterprise leads.

Concurrently, Aryan contributed to the solution architecture for a major **cooperative banking and insurance institution**, designing a Contact Center as a Service (CCaaS) generative AI showcase demonstrating intelligent call summarization, sentiment analysis, and agent assistance. The week also featured peer mentoring, as Aryan coached an internal job applicant through technical mock interviews, helping him successfully land his target role.

---

## Key Technical Initiatives & Architecture

### 1. Microsoft AI Tour: Live Exhibition Floor Operations
- **Booth Roles**: Dual deployment across the Azure AI Foundry developer booth and the GitHub Copilot booth.
- **Demonstrations Delivered**:
  - Live agent creation in Azure AI Foundry: configuring system prompts, temperature thresholds, tool call grounding via Azure AI Search, and safety content filters.
  - GitHub Copilot "vibecoding" and agentic extensions: demonstrating multi-file context editing, automated unit test generation, and CLI terminal completions.
  - Handled technical Q&A with enterprise CTOs and architects on data privacy boundaries, EU compliance, and latency benchmarks.

### 2. Banking Contact Center AI Transformation Architecture
```text
[Inbound Voice Stream / CCaaS Platform]
                 │
                 ▼
[Azure Communication Services & Realtime Audio]
                 │
                 ▼
[Azure AI Foundry Agent Pipeline]
├── Real-Time Transcription & Semantic Diarization
├── Sentiment Tracking & Compliance Entity Masking
└── Real-Time Knowledge Retrieval (Customer Policy Docs)
                 │
                 ▼
[Agent Desktop Assistant UI]
├── Live Contextual Suggestions
└── Automated Post-Call Wrap-up Summaries
```

- **Client Context**: A prominent Belgian cooperative banking and insurance institution seeking to modernize legacy call center operations with generative voice agents.
- **Architecture**:
  - Designed an end-to-end integration topology connecting Azure Communication Services with Azure AI Foundry.
  - Implemented automated post-call summarization extracting customer intent, policy numbers, and next-action commitments directly into CRM record schemas.

---

## Detailed Weekly Engineering Log

### Monday, March 23, 2026
- **AI Tour Final Logistics**: Coordinated with developer marketing leads on booth staging, display monitors, and demo hardware at the conference venue.
- **Demo Sandbox Provisioning**: Configured isolated Azure subscriptions and pre-warmed AI models to prevent cold-start latency during live attendee demos.

### Tuesday, March 24, 2026
- **Microsoft AI Tour Delivery (Day 1)**: Manned the Azure AI Foundry and GitHub Copilot booths; delivered dozens of live 1-on-1 technical demos to enterprise attendees.
- **Enterprise Lead Qualification**: Discussed enterprise migration architectures with visiting engineering directors; documented prospective lead technical requirements.

### Wednesday, March 25, 2026
- **AI Tour Wrap-up & Lead Routing**: Cataloged attendee technical feedback and routed high-priority customer leads to appropriate account executive teams.
- **Banking Contact Center AI Kickoff**: Analyzed requirements for the cooperative banking group's contact center modernization; drafted architectural flow diagrams.

### Thursday, March 26, 2026
- **CCaaS Demo Implementation**: Built sample integration scripts in Python demonstrating live call transcription and automated ticket creation via Azure AI Foundry.
- **Mock Interview Coaching**: Conducted a 2-hour technical coaching and mock interview session with an internal candidate preparing for a solutions engineering role.

### Friday, March 27, 2026
- **Banking Demo Refinement**: Polished the contact center demo presentation with senior solutions architects; verified simulated call audio streaming latency.
- **Candidate Success Celebration & Weekly Sync**: Celebrated news that the coached candidate successfully secured his desired position; debriefed AI Tour outcomes with the internship supervisor.

---

## Challenges Overcome & Engineering Decisions

1. **High-Density Network Interference at AI Tour**:
   - *Challenge*: Thousands of attendees caused severe congestion on conference Wi-Fi, intermittently slowing cloud IDE response times.
   - *Decision*: Transitioned demo rigs to dedicated hardwired Ethernet connections and local VS Code caches, ensuring seamless sub-second response times during live attendee pitches.
2. **Strict Financial Data Masking in Call Summaries**:
   - *Challenge*: Financial contact center transcripts frequently contain sensitive payment details and personal identifiers.
   - *Decision*: Configured Azure AI Foundry safety filters and pre-processing regex masks to scrub credit card numbers and IBAN strings before passing context to LLM summarizers.

---

## Collaboration & Team Dynamics

- **High-Stakes Representation**: Represented Microsoft directly on the front line of the company's largest regional event, building strong credibility with marketing and sales leadership.
- **Culture of Mentorship**: Extended support beyond immediate tasks to mentor an aspiring team member through rigorous interview rounds.

---

## Technologies & Tools Utilized

- **Cloud & AI Services**: Azure AI Foundry, Azure OpenAI Service, Azure Communication Services, Azure AI Search.
- **Developer Platforms**: GitHub Copilot, GitHub Enterprise, Visual Studio Code.
- **Languages & Frameworks**: Python 3.11, FastAPI, WebSockets.
