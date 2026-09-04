---
id: "microsoft-week-03"
title: "Microsoft Internship - Week 3: SE Shadowing, Sovereign Cloud GPU Report & ARM Workarounds"
type: "experience"
company: "Microsoft"
role: "Solutions Engineer Intern (AI Apps / Data)"
week_number: 3
log_date: "2026-02-16 to 2026-02-20"
date_range: "Feb 2026"
location: "Zaventem, Belgium"
nda_redacted: true
tech_stack:
  - "Azure Infrastructure"
  - "GPU / HPC Compute (NDv4, NCas)"
  - "Python"
  - "GitHub Codespaces"
  - "Power BI"
  - "Excel Analytics"
tags:
  - "microsoft"
  - "internship"
  - "shadowing"
  - "gpu-capacity"
  - "sovereign-cloud"
  - "arm-architecture"
  - "capacity-planning"
summary: "Shadowed enterprise customer architecture engagements, authored a comprehensive regional GPU capacity demand report for senior leadership regarding the local sovereign cloud region, and engineered x64 emulation workarounds for corporate ARM laptops."
source: "C:/Users/aryan/OneDrive/microsoft_internship_log/Week 3 - Shadowing, Plan AI for Research, GPU on the local sovereign cloud region.pdf"
---

# Microsoft Internship - Week 3: SE Shadowing, Sovereign Cloud GPU Report & ARM Workarounds

## Executive Summary

In Week 3, Aryan expanded his operational scope by actively shadowing senior solutions architects across major customer engagements, observing architectural discovery sessions, commercial scoping dialogues, and cloud consumption roadmaps.

A significant deliverable was authoring an analytical **GPU Demand & Capacity Planning Report** for senior executive leadership, modeling enterprise AI infrastructure requirements for the newly launched local sovereign cloud region (Belgium Central). Furthermore, Aryan diagnosed and overcame severe ARM-based processor package incompatibilities on corporate workstations by implementing standardized x64 emulation and GitHub Codespaces workflows.

---

## Key Technical Initiatives & Architecture

### 1. Sovereign Cloud Regional GPU Demand Analysis
- **Context**: The deployment of the new Belgium Central sovereign cloud region required accurate forecasting of GPU compute allocations (NVIDIA A100/H100, NC-series, and ND-series virtual machines) across regional enterprise customers.
- **Analytical Model**:
  - Ingested historical cloud consumption telemetry, pipeline opportunity forecasts, and incoming high-performance computing (HPC) customer inquiries.
  - Built an interactive capacity model estimating projected GPU core utilization across three adoption scenarios (conservative, moderate, aggressive).
  - Authored an executive briefing document and presentation deck delivered directly to senior executive leadership director the senior executive leadership director for regional capacity planning.

### 2. ARM Laptop Python Compatibility Architecture
- **Problem**: Standard-issue corporate laptops equipped with ARM architecture frequently re-installed native ARM Python runtimes that lacked pre-compiled wheels for essential scientific and data science libraries, causing build failures and runtime crashes.
- **Resolution Strategy**:
  - Engineered a documented developer workaround utilizing x64 emulation layers under Windows Subsystem for Linux (WSL2).
  - Standardized the intern cohort on containerized cloud development environments via **GitHub Codespaces**, decoupling local machine hardware architecture from Python machine learning dependency stacks.

---

## Detailed Weekly Engineering Log

### Monday, February 16, 2026
- **Customer Shadowing (Enterprise AI Architecture)**: Shadowed senior solutions engineering mentors in customer technical discovery sessions evaluating cloud migration feasibility.
- **GPU Allocation Analysis Kickoff**: Initiated data collection on sovereign cloud data center capacity; reviewed regional quotas for compute-optimized VM SKUs.

### Tuesday, February 17, 2026
- **Data Modeling & Analytics**: Built predictive models analyzing anticipated GPU consumption across public sector, manufacturing, and financial services accounts.
- **ARM Troubleshooting**: Investigated recurring pip build errors on corporate laptops; identified missing binary wheels for ARM64 architectures.

### Wednesday, February 18, 2026
- **Executive Report Drafting**: Authored the narrative synthesis of the regional GPU capacity analysis, highlighting potential allocation bottlenecks for large model fine-tuning workloads.
- **Codespaces Configuration**: Created reusable `.devcontainer` configuration files enabling reproducible, containerized x64 Linux development environments for data science workflows.

### Thursday, February 19, 2026
- **AI for Research Demo Rehearsal**: Conducted end-to-end dry runs of the AI for Research showcase; refined UI response streaming and tool-calling validation guards.
- **Executive Review Preparation**: Finalized the sovereign cloud capacity slide deck for leadership review.

### Friday, February 20, 2026
- **Leadership Presentation**: Presented the GPU demand report to senior leadership, receiving commendation for analytical rigor and practical field relevance.
- **Weekly Sync & Technical Debrief**: Reviewed lessons learned from customer shadowing sessions with the senior mentor, discussing techniques for navigating customer objections around cloud data residency.

---

## Challenges Overcome & Engineering Decisions

1. **Forecasting Unpredictable Generative AI Demand**:
   - *Challenge*: Customer demand for generative AI models (GPT-4o fine-tuning, open-source SLM hosting) fluctuates drastically compared to traditional VM workloads.
   - *Decision*: Modeled GPU capacity using tiered utilization bands (baseline inference vs. burst fine-tuning) to provide leadership with dynamic buffer margins.
2. **Local Machine Hardware Constraints**:
   - *Challenge*: Repeated local debugging of ARM Python compilation issues wasted valuable development hours.
   - *Decision*: Enforced cloud-first development practices using GitHub Codespaces, ensuring identical dependencies across all team members regardless of local client OS or CPU.

---

## Collaboration & Team Dynamics

- **Executive Impact**: The GPU demand analysis directly influenced high-level regional infrastructure allocation discussions led by senior leadership.
- **Mentorship Guidance**: Mentors provided valuable perspective on the balance between technical viability and commercial business justification in enterprise sales engineering.

---

## Technologies & Tools Utilized

- **Cloud Compute**: Azure Virtual Machines (ND-series, NC-series), Azure Quotas & Capacity APIs.
- **Developer Environments**: GitHub Codespaces, Docker, WSL2 (Windows Subsystem for Linux).
- **Data Analysis**: Python (pandas, numpy), Microsoft Excel, Power BI.
- **Operating Systems**: Windows 11 ARM64, Ubuntu Linux x64.
