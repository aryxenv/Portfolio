---
id: "pickit-3d-overview"
title: "Pickit 3D - Robotics & 3D Vision Engineering Overview"
type: "experience"
company: "Pickit 3D"
role: "Frontend Developer & Cybersecurity Engineer"
date_range: "Jul 2025 - Feb 2026"
location: "Leuven, Belgium (Hybrid)"
nda_redacted: true
tech_stack:
  - "Three.js"
  - "React"
  - "TypeScript"
  - "Docker"
  - "LLDAP"
  - "TLS/SSL"
  - "Zustand"
  - "Material UI"
  - "Tailwind CSS"
  - "Python"
  - "Jenkins"
  - "Jest"
tags:
  - "pickit3d"
  - "robotics"
  - "3d-vision"
  - "threejs"
  - "frontend"
  - "cybersecurity"
  - "lldap"
  - "camera-selector"
  - "industrial-automation"
summary: "Comprehensive overview of Aryan's engineering tenure at Pickit 3D in Leuven, Belgium, spanning the Summer 2025 Internship and Part-time Frontend Developer role across 3D web tooling, UI performance, cybersecurity, and AI troubleshooting."
source: "src/data/experience.ts and C:/Users/aryan/OneDrive/pickit3d_internship_log"
---

# Pickit 3D - Robotics & 3D Vision Engineering Overview

## Executive Summary

Pickit 3D is a pioneering robotics and machine vision company headquartered in Leuven, Belgium. The company provides plug-and-play 3D vision solutions that empower industrial robots to accurately locate, pick, and place complex parts in dynamic manufacturing and logistics environments—including bin picking, depalletizing, machine tending, and precision assembly.

Aryan Shah's tenure at Pickit 3D extended across two distinct phases from July 2025 to February 2026:
1. **Frontend & Cybersecurity Intern** (July 2025 – September 2025): Spearheaded the architectural revamp of the 3D Camera Selector web application (v3.5 and v4.0), engineered non-linear camera accuracy estimation algorithms, resolved critical dependency-related UI crashes in the core robot configuration interface, and deployed a secure, containerized LDAP directory infrastructure with TLS/SSL encryption.
2. **Part-time Frontend Developer** (November 2025 – February 2026): Continued web tooling modernization and customer-facing UX enhancements, while designing a comprehensive architecture for an AI-assisted diagnostic and troubleshooting assistant to automate customer support escalation and robot vision telemetry analysis.

---

## Organizational Roles & Timeline

| Period | Role Title | Primary Focus Areas | Key Deliverables |
|---|---|---|---|
| **Jul 2025 – Sep 2025** | Frontend & Cybersecurity Intern | 3D Web Graphics, Pre-Sales Tooling, Linux Security | Camera Selector 3.5 & 4.0, Three.js ROI autoscaler, dynamic camera accuracy engine, LLDAP Docker deployment |
| **Nov 2025 – Feb 2026** | Part-time Frontend Developer | Web Tooling Modernization, AI Troubleshooting | Camera Selector refinements, diagnostic log ingestion schema, AI support workflow architecture |

---

## Core Technical Contributions

### 1. ThreeJS Camera Selector Modernization (v3.5 & v4.0)

The **Pickit 3D Camera Selector** is a mission-critical web application utilized by sales engineers, application engineers (AEs), and industrial automation customers worldwide to simulate, evaluate, and select the optimal 3D optical sensor for specific robotic workcells.

- **Perspective-Adaptive Text Scaling (`z_max` Autoscaler)**:
  In earlier versions of the Three.js viewport, text overlays representing Region of Interest (ROI) dimensions became illegible when zooming or changing camera Field of View (FOV). Aryan researched 3D projection mechanics and identified the maximum depth boundary coordinate (`z_max`) as the mathematically optimal scaling variable. He built a dynamic scaling algorithm coupled with UI toggle controls that dynamically scales labels and measurement gizmos according to depth perspective.
- **Dynamic Camera Accuracy Engine**:
  3D optical sensors exhibit non-linear measurement errors across their operational volume (standoff distance vs. depth). Aryan extracted raw optical specifications from vendor documentation and engineered mathematical estimation functions within `Calc.tsx`. The system dynamically computes expected picking and location accuracy based on the user's defined ROI dimensions and camera standoff, displaying real-time warning indicators when accuracy degrades rather than abruptly clipping user input.
- **Complete Architecture Revamp (v4.0)**:
  Aryan led the end-to-end design and engineering of Camera Selector 4.0:
  - Designed modern component hierarchies, responsive layouts, and dark-mode themes in Figma.
  - Implemented resizable split panels (`react-resize-detector`) separating 3D visualization from parameter controls.
  - Built a centralized configurator store syncing state bidirectionally with URL query parameters and browser `localStorage`.
  - Added multi-brand camera tabs categorized and sorted descending by camera count.
  - Designed and pitched the new architecture to both core engineering and commercial sales teams.

### 2. Core Robot Configuration Interface Stability

Pickit 3D's primary web interface allows automation engineers to calibrate cameras, configure vision engines, and set up robotic pick points.

- **Dependency-Aware Pick Point Validation**:
  Investigated and fixed a severe application crash in the main Pickit robot UI where deleting a pick point referenced by other motion instructions or pick strategies triggered null pointer exceptions. Aryan engineered a dependency validation guard that dynamically disables deletion for referenced pick points, complete with explanatory tooltips.
- **CI/CD Pipeline Hardening**:
  Updated the Jenkins build automation scripts to introduce a mandatory unit test validation stage prior to production deployments, preventing regression leaks.

### 3. Cybersecurity & Identity Infrastructure

Prior to the internship, internal staging environments and development tools relied on shared server configurations.

- **LLDAP Deployment via Docker**:
  Researched lightweight LDAP implementations and architected a secure containerized deployment using LLDAP on Linux.
- **TLS/SSL Encryption & SSSD Integration**:
  Diagnosed authentication handshake failures by identifying misconfigurations in `sssd.conf`. Configured local and server TLS/SSL certificates, achieving encrypted directory authentication on internal staging test benches.
- **Comprehensive Operational Documentation**:
  Authored step-by-step setup and troubleshooting guides enabling engineering peers to replicate and maintain the directory service.

### 4. AI-Assisted Troubleshooting System Architecture

During the part-time tenure (November 2025 – February 2026), Aryan formulated an architectural concept for integrating Large Language Model (LLM) diagnostics into Pickit's customer support workflows:

- **Diagnostic Telemetry Extraction**: Automated parsing of robot vision logs, calibration matrices, point cloud capture metadata, and camera communication errors.
- **Context-Enriched Root Cause Analysis**: Correlating user-reported symptoms with internal knowledge base documentation, hardware error codes, and ambient illumination anomalies.
- **Support Escalation Workflows**: Structuring pre-triaged diagnostic summaries for application engineers, reducing customer resolution times from days to hours.

---

## Technology Stack & Engineering Methodologies

```text
Frontend & Graphics:
  - Three.js (WebGL rendering, 3D coordinate spaces, raycasting, frustum projections)
  - React 18 & TypeScript (Strongly typed components, hooks, custom state stores)
  - Zustand / Custom Stores (Centralized state management with URL parameter sync)
  - Material UI (MUI) & Tailwind CSS (Custom themes, responsive drawer layouts, alerts)
  - React Resize Detector (Canvas dimension responsiveness and WebGL renderer resizing)

Robotics & Vision:
  - Industrial 3D Cameras (Structured light, active stereo vision, time-of-flight)
  - Optical Tolerance Modeling (Standoff distance, FOV, picking vs. location accuracy)
  - Physical Robot Arm Integration (Pickit 3D bin-picking workcell calibration)

Backend, DevOps & Infrastructure:
  - Docker & Docker Compose (Containerized directory services)
  - LLDAP & OpenLDAP Protocols (Lightweight directory access, SSSD authentication)
  - TLS/SSL Cryptography (Public key certificates, encrypted transport)
  - Jenkins CI/CD (Pipeline build scripts, automated test validation stages)
  - Python / Jupyter Notebooks (Data fitting, optical error modeling)
  - Jest / React Testing Library (Comprehensive unit and integration testing)
```

---

## Business & Engineering Impact

1. **Pre-Sales Conversion Velocity**:
   The modernized Camera Selector provided prospective customers and system integrators with instant, self-service optical simulations, eliminating back-and-forth email consultations for standard bin-picking feasibility evaluations.
2. **Production Reliability**:
   Eliminated critical UI crashes in the primary robot control interface and instituted CI/CD test gates that safeguarded the web tooling release cycle.
3. **Internal Security Baseline**:
   Replaced ad-hoc credential management with centralized, encrypted LDAP identity authentication across internal development test benches.
4. **Strategic Support Automation**:
   Laid the architectural groundwork for LLM-assisted diagnostic triage, bridging frontend engineering with high-leverage customer support workflows.
