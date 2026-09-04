---
id: "pickit-week-11"
title: "Pickit 3D Internship - Week 11: Dynamic Optical Sensor Modeling, Python Analysis & Final Evaluation"
type: "experience"
company: "Pickit 3D"
role: "Frontend & Cybersecurity Intern"
week_number: 11
log_date: "2025-09-08 to 2025-09-12"
date_range: "Sep 2025"
location: "Leuven, Belgium (Hybrid)"
nda_redacted: true
tech_stack:
  - "Python"
  - "Jupyter"
  - "React"
  - "TypeScript"
  - "Three.js"
  - "Mathematical Modeling"
  - "Git"
tags:
  - "pickit3d"
  - "dynamic-accuracy"
  - "curve-fitting"
  - "python-notebooks"
  - "automation-scenarios"
  - "frontend-handover"
summary: "Modeled non-linear optical accuracy curves across leading industrial 3D vision sensors using Python Jupyter notebooks, refactored accuracy logic to automation scenarios, completed frontend handovers, and conducted the final internship evaluation."
source: "C:/Users/aryan/OneDrive/pickit3d_internship_log/Tracker Week 11 27abcdace0e38092af50e6efca9f77ef.csv"
---

# Pickit 3D Internship - Week 11: Dynamic Optical Sensor Modeling, Python Analysis & Final Evaluation

## Executive Summary

The final week of the Summer 2025 Internship brought together mathematical rigor, algorithmic simulation, and comprehensive technical handovers. Aryan tackled the challenging problem of optical accuracy variance across diverse third-party industrial 3D sensors (including high-resolution structured light and active stereo vision hardware). Recognizing that optical error does not scale linearly with distance, Aryan developed a Python Jupyter Notebook to analyze empirical data points, fitting non-linear regression curves to accurately model accuracy degradation across operational standoff depths.

Aryan then translated these mathematical models into TypeScript, refactoring the accuracy engine to evaluate workcells using standardized "Automation Scenarios" (such as precision assembly, standard bin picking, and bulk depalletizing) rather than arbitrary numeric inputs. The week concluded with thorough frontend code handovers for both Camera Selector 4.0 and the core Pickit robot UI, followed by an exemplary final evaluation meeting with the engineering manager.

---

## Daily & Weekly Technical Log

### Monday, September 8, 2025
- **Daily Standup**: Outlined final week priorities: optical accuracy algorithms and documentation.
- **Camera Tabs Categorization Review**: Met with senior vision researchers to finalize brand taxonomy and hardware grouping conventions within the Camera Selector tab bar.
- **Dynamic Accuracy Architecture for Industrial Sensors**:
  - Began architecting dynamic mathematical models for diverse optical camera families:
    1. High-speed structured light sensors with compact baselines.
    2. High-precision industrial stereo vision cameras optimized for reflective surfaces.
    3. Ultra-wide Field of View (FOV) depalletizing sensors.
  - Isolated the physical optical factors that influence point cloud point-to-point repeatability at varying standoff distances.

### Tuesday, September 9, 2025
- **Daily Standup**: Synchronized on mathematical curve fitting progress.
- **Sensor Tolerance Modeling**: Extended dynamic calculation structures across additional industrial sensor lines, compiling vendor calibration constants.
- **Python Notebook Simulation & Curve Fitting**:
  - Authored a Python Jupyter Notebook to ingest discrete empirical accuracy test points from manufacturer engineering reports.
  - Performed non-linear regression analysis (polynomial and exponential curve fitting) to derive closed-form mathematical equations modeling accuracy as a continuous function of Z-depth:
    $$\text{Accuracy}_{\text{expected}}(z) = \alpha \cdot z^2 + \beta \cdot z + \gamma$$
  - Documented algorithmic constants, tolerance envelopes, and verification steps for engineering review.

### Wednesday, September 10, 2025
- **Daily Standup**: Reported completion of the Python mathematical analysis.
- **Pull Request Follow-Up**: Addressed open pull request comments across the Camera Selector 4.0 branch, refining component interfaces, test assertions, and type signatures.

### Thursday, September 11, 2025
- **Daily Standup**: Aligned on the automation scenario refactoring.
- **Refactoring Accuracy to Automation Scenarios**:
  - Substantially refactored the accuracy calculation architecture: transitioned away from requiring users to manually input raw micrometer tolerances.
  - Introduced intuitive, high-level **Automation Scenarios** (e.g., *Micro-Assembly / Precision Placement*, *Standard Industrial Bin Picking*, *Large-Object Depalletizing*).
  - The engine automatically cross-references the selected scenario's required tolerance envelope against the fitted optical curve for the chosen camera at the specified standoff distance, delivering immediate binary validation (*Feasible*, *Marginal*, or *Unfeasible*).
- **Code Review Resolution**: Resolved final pull request feedback from senior software engineers, preparing branches for production merge.

### Friday, September 12, 2025
- **Frontend Codebase Handover**:
  - Conducted a comprehensive technical handover session with peer frontend engineers.
  - Walked through the Camera Selector 4.0 architectural structure, centralized configurator store, Three.js orientation gizmo integration, and the pick point dependency guard in the primary Pickit robot UI.
- **Final Internship Evaluation**:
  - Held the end-of-internship evaluation with the engineering manager.
  - Reviewed the summer's deliverables: Camera Selector 3.5 production release, the complete Camera Selector 4.0 architectural overhaul, containerized TLS/SSL LLDAP deployment, and core robot UI crash guards.
  - Received outstanding feedback for technical initiative, rapid problem-solving, and cross-disciplinary ownership, establishing the foundation for Aryan's transition into the Part-time Frontend Developer role.

---

## Key Technical Decisions & Innovations

### 1. Empirical Curve Fitting vs. Static Bounding
Many pre-sales simulation tools assume static accuracy ratings throughout a camera's field of view. By leveraging Python to model non-linear optical error progression across depth, Aryan gave Pickit's sales and application engineers an exceptionally accurate forecasting tool, preventing costly on-site installation surprises.

### 2. Scenario-Driven UI Abstraction
Translating complex optical formulas into user-friendly "Automation Scenarios" bridged the gap between deep vision research and commercial application engineering. Users can assess workcell feasibility based on industrial tasks rather than parsing optical physics formulas.

---

## Technologies Utilized

- **Python & Jupyter Notebooks**: Scientific computing, data parsing, non-linear regression, curve fitting.
- **TypeScript & React 18**: Algorithmic implementation, scenario mapping, reactive UI components.
- **Three.js**: Visualizing sensor frustums with overlaid accuracy confidence zones.
- **Git & GitHub**: Multi-PR coordination, code review follow-ups, repository cleanups.
