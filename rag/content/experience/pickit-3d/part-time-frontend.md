---
id: "pickit-part-time-frontend"
title: "Pickit 3D - Part-time Frontend Developer & AI Troubleshooting Architecture"
type: "experience"
company: "Pickit 3D"
role: "Part-time Frontend Developer"
date_range: "Nov 2025 - Feb 2026"
has_external_logs: false
location: "Leuven, Belgium (Hybrid)"
nda_redacted: true
tech_stack:
  - "React"
  - "TypeScript"
  - "Three.js"
  - "Tailwind CSS"
  - "Material UI"
  - "Docker"
  - "LLM Diagnostic Architectures"
  - "REST APIs"
tags:
  - "pickit3d"
  - "frontend"
  - "robotics"
  - "3d-vision"
  - "ai-troubleshooting"
  - "diagnostic-automation"
  - "customer-support-workflows"
  - "react"
  - "typescript"
summary: "Part-time software engineering tenure at Pickit 3D continuing web tooling modernization, 3D camera selector pre-sales interfaces, and architecting an AI-assisted troubleshooting system for robot vision diagnostics and support escalation."
source: "src/data/experience.ts"
---

# Pickit 3D - Part-time Frontend Developer & AI Troubleshooting Architecture

## Role Overview

Following the successful completion of the Summer 2025 Internship, Aryan transitioned into a **Part-time Frontend Developer** role at Pickit 3D from November 2025 through February 2026. Working in a flexible hybrid model alongside his academic studies, he supported the core engineering and product teams in two key capacities:
1. **Sustained Web Tooling Modernization**: Continuing the enhancement, maintenance, and feature refinement of Pickit 3D's web-based simulation and pre-sales engineering tools.
2. **AI-Assisted Troubleshooting Architecture**: Researching, designing, and documenting an innovative architectural concept for an AI-powered diagnostic and troubleshooting assistant tailored to industrial 3D robot vision systems.

Unlike the summer internship, this part-time engineering engagement did not utilize daily Notion tracker logs; all achievements and technical specifications are synthesized directly from repository commits, project documentation, and corporate records in `src/data/experience.ts`.

---

## 1. Web Tooling & Customer-Facing UX Modernization

### Background & Business Need
Pickit 3D's Camera Selector and web utilities serve as the primary technical entry point for international sales representatives, distributor application engineers, and prospective industrial clients. Ensuring these tools remain responsive, accurate, and aligned with newly released 3D camera hardware is critical for pre-sales velocity.

### Technical Enhancements
- **Camera Configuration Library Maintenance**:
  Integrated updated optical specifications and calibration metrics for emerging industrial sensor models, ensuring accurate Field of View (FOV), standoff distance limits, and optical resolution calculations.
- **Responsive Layout & State Refinements**:
  Refactored panel layout interactions within the Camera Selector, eliminating minor rendering glitches across non-standard monitor resolutions and mobile tablets frequently used by sales engineers on factory floors.
- **Cross-Browser Compatibility & Performance**:
  Streamlined WebGL canvas destruction and garbage collection routines in Three.js when switching rapidly between camera models, preventing WebGL context loss errors on resource-constrained customer laptops.

---

## 2. Architecture & Design: AI-Assisted Troubleshooting Concept

### The Industrial Robot Vision Diagnostic Challenge
Industrial robot vision systems operate in demanding factory environments where complex physical and computational factors can cause pick failures:
- **Optical & Environmental Disturbances**: Ambient sunlight fluctuations, reflective metal surfaces, dark oily parts, or physical camera misalignment.
- **Calibration Drift**: Robot-camera hand-eye calibration degradation over thousands of operational cycles.
- **Configuration Incompatibilities**: Sub-optimal Region of Interest (ROI) boundaries, invalid standoff distances, or conflicting pick point strategies.

When a customer or system integrator experiences issues, resolving the problem traditionally requires:
1. Manually downloading gigabyte-sized diagnostic snapshot archives from the Pickit processor.
2. Transmitting files through customer support channels.
3. Multiple days of asynchronous back-and-forth communication with Tier-2 Application Engineers.

### Conceptual Architecture Overview

Aryan designed and documented a unified, AI-assisted diagnostic workflow designed to automate early-stage troubleshooting, provide instant guided resolution to field technicians, and streamline engineering escalation.

```text
┌─────────────────────────────────────────────────────────────┐
│                 Customer Robot Workcell                     │
│  [Pickit Processor] ──> [Diagnostic Snapshot Bundle (.tar)] │
└──────────────────────────────┬──────────────────────────────┘
                               │ Upload
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Diagnostic Ingestion Engine                 │
│  ├── Log Sanitization & Tokenization                        │
│  ├── Hardware Telemetry & Error Code Parser                 │
│  └── 3D Point Cloud Quality Metrics Extractor               │
└──────────────────────────────┬──────────────────────────────┘
                               │ Normalized Telemetry
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               AI Troubleshooting Reasoning Agent            │
│  ├── Grounding: Pickit Knowledge Base & Hardware Docs       │
│  ├── Symptom Classification & Failure Mode Mapping          │
│  └── Confidence-Scored Root Cause Hypothesis Engine         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│   Field Technician Web UI    │ │  Tier-2 Support Escalation │
│  - Step-by-step remediation  │ │  - Structured triage ticket│
│  - Interactive visual checks │ │  - Pre-computed root cause │
│  - Parameter adjustment tips │ │  - Annotated log excerpts  │
└──────────────────────────────┘ └────────────────────────────┘
```

### Architectural Subsystems

#### A. Telemetry & Log Ingestion Pipeline
- **Log Parsing**: Ingests system logs (`dmesg`, vision engine runtime logs, communication socket traces between Pickit and the industrial robot controller).
- **Metadata Extraction**: Isolates key environmental variables including camera temperature, exposure duration, point cloud density, average detection latency, and bounding box compliance.
- **Data Privacy & Sanitization**: Filters out internal IP addresses, local network hostnames, and proprietary part CAD geometries before passing diagnostic data to language models.

#### B. Grounded Knowledge Retrieval & Reasoning
- **Domain-Specific Knowledge Base**: Leveraged embeddings of official Pickit user manuals, application engineer troubleshooting runbooks, camera hardware datasheets, and historical support tickets.
- **Symptom Mapping**: Translates raw error codes (e.g., camera timeout, empty point cloud, pose estimation divergence) into plain-language failure mode hypotheses:
  - *Example*: An empty point cloud accompanied by high ambient sensor gain suggests surface glare or overexposure, prompting recommendations to adjust lighting or polarizers.
  - *Example*: Consistent offset in pick pose suggests hand-eye calibration drift, prompting an automated recommendation to re-run the 5-point calibration routine.

#### C. Technician Guidance UI & Automated Escalation
- **Interactive Remediation Checklist**: Displays a prioritized, step-by-step checklist in the web interface, guiding shop-floor technicians through non-invasive physical and software checks.
- **Pre-Triaged Escalation Bundles**: If local steps fail to resolve the issue, the system compiles a comprehensive, structured escalation package for Pickit support engineers. This bundle includes:
  - Executive summary of the symptom.
  - Likely root-cause hypotheses with confidence ratings.
  - Pinpointed log lines and parameter mismatches.
  - Robot model, camera serial number, and software version metadata.

---

## 3. Technology Stack & Design Tools

- **Frontend & Web Interfaces**: React 18, TypeScript, Material UI, Tailwind CSS.
- **3D Graphics & Simulation**: Three.js WebGL rendering, perspective projection math.
- **System Architecture & Design**: Mermaid diagrams, Figma wireframing, Markdown technical specifications.
- **Backend & Diagnostics Integration**: RESTful API schemas, JSON diagnostic definitions, Docker containerized services.
- **AI/LLM Architecture**: Retrieval-Augmented Generation (RAG) concepts, prompt orchestration, structured JSON output validation.

---

## 4. Business Impact & Strategic Value

1. **Reduced Support Escalation Costs**:
   By enabling field operators to self-resolve common optical and environmental issues (e.g., dirty lenses, lighting shifts, minor calibration offsets), the concept targets a dramatic reduction in Tier-1 support tickets.
2. **Accelerated Time-to-Resolution**:
   For complex issues requiring senior engineering intervention, having an automated diagnostic summary eliminates hours of manual log parsing, allowing application engineers to immediately address root causes.
3. **Continuous Tooling Evolution**:
   Ensured Pickit 3D's commercial web tools maintained high reliability and seamless compatibility with customer hardware throughout the late 2025 release cycle.
