---
id: "project-aks-agent-governance"
title: "AKS Agent Governance - Microsoft Agent Framework & Governance Toolkit on Kubernetes"
type: "project"
project_name: "AKS Agent Governance"
status: "green"
category: "Cloud & AI Infrastructure"
github_url: "https://github.com/aryxenv/aks-agent-with-governance-toolkit"
demo_url: ""
tech_stack:
  - "Python"
  - "FastAPI"
  - "Azure Kubernetes Service (AKS)"
  - "Microsoft Agent Framework (MAF)"
  - "Agent Governance Toolkit (AGT)"
  - "Kubernetes"
  - "Docker"
  - "Fluent UI"
tags:
  - "aks"
  - "agent"
  - "governance"
  - "agt"
  - "kubernetes"
  - "microsoft-agent-framework"
  - "fastapi"
  - "fluent-ui"
summary: "A production-grade architecture running an autonomous Microsoft Agent Framework weather agent on Azure Kubernetes Service (AKS) with a FastAPI Server-Sent Events wrapper, Fluent UI client, and Agent Governance Toolkit policy sidecars enforcing deterministic runtime tool controls."
source: "src/data/projects.ts"
---

# AKS Agent Governance - Microsoft Agent Framework & Governance Toolkit on Kubernetes

## Project Overview
As enterprise adoption of autonomous agentic systems accelerates, the primary hurdle to enterprise production readiness is **runtime safety and governance**. Autonomous agents relying on Large Language Models (LLMs) to select and invoke external tools present unpredictable execution paths, potential prompt injection vectors, and data exfiltration risks.

**AKS Agent Governance** is a reference architecture that demonstrates how to containerize and deploy an autonomous AI agent built on the **Microsoft Agent Framework (MAF)** onto **Azure Kubernetes Service (AKS)** while enforcing deterministic, policy-driven runtime controls via the **Agent Governance Toolkit (AGT)**.

The reference workload implements an autonomous weather research agent capable of orchestrating multi-step geocoding and meteorological inquiries using external APIs (Nominatim for location lookup and Open-Meteo for forecast retrieval), all governed by sidecar inspection layers.

## System Architecture & Technical Design

### 1. Kubernetes Sidecar Governance Pattern
The system leverages the Kubernetes sidecar container pattern to decouple business and reasoning logic from compliance enforcement:
- **Agent Container (Primary)**: Runs the Python/FastAPI service hosting the Microsoft Agent Framework agent loop. When the LLM decides to trigger a tool call (e.g., querying geographical coordinates or meteorological forecast data), the request is dispatched through local loopback networking (`http://127.0.0.1:8080/governance`).
- **AGT Sidecar Container (Policy Enforcement)**: Intercepts all outbound tool invocations. The sidecar evaluates the proposed function call against declarative YAML policy manifests before allowing the external network request to proceed.

```text
[ Fluent UI Web Client ]
          |  (Server-Sent Events / HTTP)
          v
[ AKS Pod: FastAPI + MAF Agent Runtime ]
          |  (Outbound Tool Call Request)
          v
[ Sidecar: Agent Governance Toolkit (AGT) ] ---> [ Policy Engine / Audit Log ]
          |  (Validated / Sanitized)
          v
[ External APIs: Nominatim / Open-Meteo ]
```

### 2. Runtime Policy Enforcement Features
The Agent Governance Toolkit sidecar enforces four layers of deterministic controls:
1. **Domain & Tool Whitelisting**: The agent cannot invoke unapproved endpoints. Attempts to reach unauthorized external domains trigger an immediate policy exception.
2. **Schema & Argument Validation**: Validates coordinate ranges (latitude [-90, 90], longitude [-180, 180]) and parameter data types before requests leave the cluster boundary.
3. **Prompt Injection & Parameter Tampering Detection**: Scans proposed query strings for escape sequences or attempts to override system prompt instructions.
4. **Comprehensive Audit Trail**: Emits structured JSON audit logs capturing the timestamp, originating session ID, LLM reasoning trace, tool invocation parameters, policy verdict (`ALLOW` / `DENY`), and response latency.

### 3. Asynchronous Streaming & Client Interface
- **FastAPI SSE Wrapper**: Replaces standard request-response REST polling with Server-Sent Events (SSE), streaming the agent's internal thought process, reasoning deltas, tool invocation lifecycle events, and final responses in real time.
- **Fluent UI Frontend**: A lightweight, enterprise-styled React client using Microsoft's Fluent UI design system. Visualizes active agent execution states, displays the policy governance audit trail, and renders interactive weather visualization cards.

### 4. Kubernetes Manifests & Production Readiness
The repository includes complete, production-ready Kubernetes configuration:
- **Deployment Manifests**: Multi-container pod specifications with shared network namespaces, CPU/memory resource requests and limits, readiness/liveness probes (`/healthz`), and non-root security contexts.
- **ConfigMaps & Secrets**: Externalized configuration for Azure OpenAI endpoints, model deployment names, and governance rule definitions.
- **Ingress & TLS**: Ingress controller routing external user traffic securely with TLS termination.

## Key Technical Specifications & Links
- **Project Name**: AKS Agent Governance
- **Status**: Production / Active (`green`)
- **Primary Category**: Cloud & AI Infrastructure / Agentic Security
- **GitHub Repository**: [https://github.com/aryxenv/aks-agent-with-governance-toolkit](https://github.com/aryxenv/aks-agent-with-governance-toolkit)
- **Deployment Platform**: Azure Kubernetes Service (AKS), Docker, Kubernetes
