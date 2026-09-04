---
id: "microsoft-week-14"
title: "Microsoft Internship - Week 14: SE Productivity Suite & AKS Multi-Agent Governance"
type: "experience"
company: "Microsoft"
role: "Solutions Engineer Intern (AI Apps / Data)"
week_number: 14
log_date: "2026-05-04 to 2026-05-08"
date_range: "May 2026"
location: "Zaventem, Belgium"
nda_redacted: true
tech_stack:
  - "Azure Kubernetes Service (AKS)"
  - "Microsoft Agent Framework (MAF)"
  - "Agent Governance Toolkit (AGT)"
  - "Docker"
  - "FastAPI"
  - "Realtime Speech Translation"
  - "Python"
tags:
  - "microsoft"
  - "internship"
  - "aks"
  - "agent-governance"
  - "maf"
  - "sidecar-pattern"
  - "productivity-tooling"
  - "speech-translation"
summary: "Engineered internal sales engineering productivity utilities, deployed containerized AI agents to Azure Kubernetes Service using Microsoft Agent Framework with an Agent Governance Toolkit policy sidecar, and advanced speech translation."
source: "C:/Users/aryan/OneDrive/microsoft_internship_log/Week 14 - Nerdland, a prominent enterprise technology consulting partner, STU Efficiency (an internal field solution accelerator catalog), Agentic AI & DevOps, Learning.pdf"
---

# Microsoft Internship - Week 14: SE Productivity Suite & AKS Multi-Agent Governance

## Executive Summary

Week 14 marked a significant leap forward in enterprise containerization, agent governance, and internal developer tooling. Aryan drove the development of the **Sales Engineering Productivity Suite**, building high-leverage field utilities including the real-time voice knowledge assistant, sales pipeline telemetry automation, and cloud licensing SKU mapping tools for the upcoming GitHub Copilot Build Day.

On the infrastructure front, Aryan tackled enterprise agent governance by deploying autonomous agents to **Azure Kubernetes Service (AKS)** orchestrated via the **Microsoft Agent Framework (MAF)**, pairing them with the **Agent Governance Toolkit (AGT)** running as a policy-enforcing sidecar container. Additionally, Aryan advanced real-time speech translation pipelines for the consulting partner and continued hardening the science festival assistant.

---

## Key Technical Initiatives & Architecture

### 1. AKS Multi-Agent Deployment with Policy-Enforcing Sidecars
```text
┌────────────────────────────────────────────────────────┐
│ Azure Kubernetes Service (AKS) Pod                     │
│                                                        │
│  ┌───────────────────────┐   Internal Pod Network     │
│  │ Primary Agent Container│ (localhost:5000)           │
│  │ ├── MAF Orchestrator  │ ────────────────────────┐   │
│  │ └── Autonomous Logic  │                         │   │
│  └───────────────────────┘                         ▼   │
│                                    ┌──────────────────┐│
│                                    │ AGT Policy       ││
│                                    │ Sidecar Container││
│                                    │ ├── Policy Check ││
│                                    │ ├── Data Masking ││
│                                    │ └── Audit Log    ││
│                                    └─────────┬────────┘│
└──────────────────────────────────────────────┼─────────┘
                                               ▼
                              [External Enterprise APIs / Cloud]
```

- **Architecture Rationale**: Enterprise IT security mandates that autonomous agent workloads executing within corporate clusters must have strict boundary controls preventing unauthorized egress, command execution, or data exfiltration.
- **Implementation**:
  - Containerized autonomous agents orchestrated with the Microsoft Agent Framework (MAF).
  - Deployed the Agent Governance Toolkit (AGT) as a sidecar container in Kubernetes.
  - The sidecar intercepts outbound agent tool calls, evaluates parameters against Open Policy Agent (OPA) rules, masks sensitive telemetry, and creates immutable audit trails before egress.

### 2. Sales Engineering Productivity Suite
- **Real-Time Voice Knowledge Assistant**: Low-latency voice Q&A agent grounded in internal sales technical documentation.
- **Sales Telemetry Intelligence Utility**: Automated telemetry extraction aggregating CRM opportunities, customer milestone velocity, and cloud consumption spikes.
- **Cloud Licensing SKU Mapping Utility**: Intelligent product SKU translator mapping complex enterprise licensing agreements to modern cloud and AI SKUs, prepared for GitHub Copilot Build Day.

---

## Detailed Weekly Engineering Log

### Monday, May 4, 2026
- **Productivity Suite Kickoff**: Outlined architecture and user stories for the sales engineering productivity suite; aligned deliverables with technical specialists.
- **Licensing SKU Mapper Development**: Wrote Python parsing scripts mapping legacy on-premises license codes to modern Azure AI and Copilot licensing SKUs.

### Tuesday, May 5, 2026
- **AKS Cluster Configuration**: Provisioned an Azure Kubernetes Service cluster configured with Azure CNI networking, Workload Identity, and pod security standards.
- **Containerization**: Authored multi-stage Dockerfiles packaging the Microsoft Agent Framework orchestrator and dependencies.

### Wednesday, May 6, 2026
- **AGT Sidecar Integration**: Configured Kubernetes pod specifications deploying the Agent Governance Toolkit as a sidecar container; wrote custom policy validation rules in Rego.
- **Policy Testing**: Simulated prohibited tool invocations (e.g., unauthorized external network requests); confirmed that the AGT sidecar intercepted and rejected the requests.

### Thursday, May 7, 2026
- **Speech Translation Pipeline Advances**: Tuned buffer parameters and chunk sizing for the consulting partner's multilingual speech translation service.
- **Science Festival Client/Server Sync**: Deployed updated client/server builds for the science festival assistant; verified latency metrics across simulated user loads.

### Friday, May 8, 2026
- **Build Day Dry Runs**: Conducted dry runs of the licensing SKU mapper and sales telemetry utilities with team colleagues.
- **Weekly Technical Retrospective**: Synced with mentors on upcoming speaking engagements; aligned presentation slides for next week's solo conference keynote.

---

## Challenges Overcome & Engineering Decisions

1. **Inter-Container Latency in Kubernetes Pods**:
   - *Challenge*: Routing all agent tool invocations through the AGT sidecar introduced unexpected latency overhead.
   - *Decision*: Configured local loopback Unix domain sockets for inter-container IPC within the pod rather than HTTP over TCP, eliminating socket handshake overhead and bringing governance evaluation latency under 5 milliseconds.
2. **Dynamic Policy Updates Without Pod Restarts**:
   - *Challenge*: Modifying governance policies previously required terminating and redeploying the entire Kubernetes pod.
   - *Decision*: Configured Kubernetes ConfigMaps with dynamic file-watcher reload triggers in the AGT sidecar container, allowing security teams to update compliance policies instantly without downtime.

---

## Collaboration & Team Dynamics

- **Pioneering Cloud Native AI**: Demonstrated that enterprise agent governance can be achieved cleanly at the container orchestration layer using cloud-native standards.
- **Team Enablement**: The productivity utilities saved colleagues significant manual time calculating licensing migration permutations during customer workshops.

---

## Technologies & Tools Utilized

- **Cloud Orchestration**: Azure Kubernetes Service (AKS), Docker, Kubernetes Pod Specs, Helm.
- **Agent Governance & Security**: Microsoft Agent Framework (MAF), Agent Governance Toolkit (AGT), Open Policy Agent (OPA).
- **Speech & Audio**: Azure Speech Services, Streaming WebSockets.
- **Languages**: Python 3.11, YAML, Bash, Rego.
