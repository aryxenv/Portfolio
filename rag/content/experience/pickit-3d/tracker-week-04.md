---
id: "pickit-week-04"
title: "Pickit 3D Internship - Week 4: Dynamic Accuracy Engine in Calc.tsx, AE User Research & Containerized LLDAP"
type: "experience"
company: "Pickit 3D"
role: "Frontend & Cybersecurity Intern"
week_number: 4
log_date: "2025-07-22 to 2025-07-25"
date_range: "Jul 2025"
location: "Leuven, Belgium (Hybrid)"
nda_redacted: true
tech_stack:
  - "React"
  - "TypeScript"
  - "Docker"
  - "LLDAP"
  - "Jest"
  - "Linux"
tags:
  - "pickit3d"
  - "camera-accuracy"
  - "optical-tolerance"
  - "docker"
  - "lldap"
  - "user-research"
summary: "Engineered optical accuracy validation in Calc.tsx using manufacturer datasheets, conducted user interviews with Application Engineers for Camera Selector 4.0, and deployed a secure LLDAP directory in Docker."
source: "C:/Users/aryan/OneDrive/pickit3d_internship_log/Tracker Week 4 27abcdace0e380cdbb97d3b6bd7feb6d.csv"
---

# Pickit 3D Internship - Week 4: Dynamic Accuracy Engine in Calc.tsx, AE User Research & Containerized LLDAP

## Executive Summary

Week 4 achieved major breakthroughs across both frontend simulation algorithms and infrastructure cybersecurity. Aryan implemented the initial version of the **Dynamic Camera Accuracy Engine**, moving beyond static numbers by embedding real optical tolerance ranges extracted from official 3D camera manufacturer datasheets into the calculation pipeline (`Calc.tsx`). Instead of abruptly rejecting user inputs, the UI gracefully warns users with descriptive alert notes when an operational volume degrades optical accuracy.

In parallel, Aryan conducted qualitative user research with Pickit 3D's Application Engineers (AEs)—the primary internal users who configure robotic workcells for global clients. He authored a formal feature prioritization and effort estimation specification for Camera Selector 4.0. On the cybersecurity front, Aryan successfully built and documented a local containerized deployment of **LLDAP** (Lightweight LDAP) using Docker, establishing the blueprint for secure developer authentication.

---

## Daily & Weekly Technical Log

### Tuesday, July 22, 2025
- **Sprint Review & Planning**: Participated in the Sprint #116 review and mapped task priorities for Sprint #117.
- **Drafting Optical Accuracy Logic**: Extracted empirical accuracy specifications from official engineering datasheets for each supported industrial 3D camera model. Embedded datasheet URLs into camera metadata objects.
- **Accuracy Engine Implementation in `Calc.tsx`**:
  - Engineered a mathematical evaluation function in `Calc.tsx` to determine whether a requested Region of Interest (ROI) and standoff distance yield acceptable picking and location accuracy.
  - Lifted accuracy state from local subcomponents up to `App.tsx` via callback props to maintain a single source of truth.
  - Programmed step-size scaling ensuring that imperial inch increments map accurately to metric millimeter increments.
  - Implemented non-destructive UI feedback: rather than forcing the ROI bounding box to clamp down when tolerances are exceeded, the UI renders an informative warning banner citing the camera's optical thresholds.
- **Automated Testing**: Created Jest unit and integration tests verifying accuracy boundary calculations and ensuring unit conversions function properly with standoff thresholds.
- **Pull Request**: Opened feature PR `feature/camera-accuracy` targeted for `master`.

### Wednesday, July 23, 2025
- **Sprint #117 Planning**: Finalized sprint backlog tickets and milestone commitments.
- **Application Engineer Interviews**: Conducted in-depth interviews with senior Application Engineers (AEs) to understand their daily workflow challenges when scoping bin-picking systems for customers. Gathered critical feedback on pain points with the existing Camera Selector (e.g., rigid inputs, lack of shareable configurations, slow rendering on site visits).
- **Feature Prioritization & Synthesis**: Synthesized interview findings into a structured feature hierarchy, ranking proposed capabilities by business impact and implementation complexity.

### Thursday, July 24, 2025
- **Daily Standup**: Synchronized on user research outcomes and day's deliverables.
- **Specification & Effort Estimation**: Authored a detailed engineering document outlining feature requirements, component architecture, and estimated story points for the Camera Selector 4.0 revamp.
- **Containerized LLDAP Setup**: Provisioned a local instance of **LLDAP** (a modern, lightweight Rust-based LDAP implementation) inside a Docker container. Configured persistent volumes, admin credentials, and documented the container configuration steps for reproducibility.
- **Standoff UI Refactoring**: Redesigned the minimum standoff input field, moving verbose tooltip text into an intuitive Material UI help icon adjacent to the input label.

### Friday, July 25, 2025
- **Daily Standup**: Reviewed LLDAP containerization progress and outlined next steps: investigating the `sssd` (System Security Services Daemon) authentication pipeline on the internal robot vision hardware test bench in the office to validate client authentication against the LDAP directory.

---

## Key Technical Decisions & Innovations

### 1. Non-Destructive Tolerance Warnings vs. Hard Clamping
Earlier proposals suggested hard-clamping the 3D bounding box whenever user dimensions exceeded the camera's optimal accuracy envelope. Aryan advocated for a non-destructive user experience: allowing automation engineers to inspect marginally out-of-spec workcells while displaying clear visual warnings. This decision prevented user frustration during preliminary feasibility studies.

### 2. Lightweight Identity Architecture (LLDAP in Docker)
Selecting LLDAP over full OpenLDAP significantly reduced operational footprint and administrative complexity while providing standard RFC-compliant directory services for internal team staging machines.

---

## Technologies Utilized

- **React 18 & TypeScript**: State lifting, callback handlers, typed optical parameter interfaces.
- **Algorithmic Modeling (`Calc.tsx`)**: Non-linear tolerance checks, dimensional step calculations.
- **Docker & Containerization**: Dockerfile, volume persistence, container network binding.
- **LLDAP & Identity Management**: Directory trees, administrative credentialing, user schemas.
- **Jest**: Unit testing for mathematical threshold evaluation.
