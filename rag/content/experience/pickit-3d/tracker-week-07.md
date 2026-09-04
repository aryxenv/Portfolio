---
id: "pickit-week-07"
title: "Pickit 3D Internship - Week 7: Design Pitch, Physical Robot Arm Training, Release 3.5 & CI/CD Test Automation"
type: "experience"
company: "Pickit 3D"
role: "Frontend & Cybersecurity Intern"
week_number: 7
log_date: "2025-07-11 to 2025-08-14"
date_range: "Aug 2025"
location: "Leuven, Belgium (Hybrid)"
nda_redacted: true
tech_stack:
  - "Jenkins"
  - "Git"
  - "React"
  - "TypeScript"
  - "Industrial Robotics"
  - "Jest"
  - "Figma"
tags:
  - "pickit3d"
  - "robotics-training"
  - "bin-picking"
  - "jenkins-ci-cd"
  - "release-engineering"
  - "git-merge"
summary: "Pitched Camera Selector 4.0 Figma designs to the development team, completed hands-on physical robot arm bin-picking training, deployed Release 3.5, and integrated automated test validation into the Jenkins CI/CD pipeline."
source: "C:/Users/aryan/OneDrive/pickit3d_internship_log/Tracker Week 7 27abcdace0e3803db06ff558635f379f.csv"
---

# Pickit 3D Internship - Week 7: Design Pitch, Physical Robot Arm Training, Release 3.5 & CI/CD Test Automation

## Executive Summary

Week 7 represented a major milestone across engineering presentation, industrial domain mastery, and release automation. Aryan pitched the complete Figma architectural redesign for Camera Selector 4.0 to the development team during the Sprint Review, receiving enthusiastic validation and formal approval to proceed into implementation.

To ground his software work in the physical reality of factory automation, Aryan completed comprehensive, hands-on training with Pickit 3D's physical industrial robot arms, calibrating a full bin-picking workcell from scratch. On the release engineering side, Aryan merged the deep-linking URL parameters feature into `release_3.5`, resolved complex branch conflicts when forward-porting to master, and hardened the Jenkins build pipeline by adding a mandatory test validation stage that enforces passing unit tests before allowing automated production deployment.

---

## Daily & Weekly Technical Log

### Monday, August 11, 2025
- **Sprint Review & Camera Selector 4.0 Pitch**:
  Presented the Figma component architecture, user workflows, and responsive visual layout for Camera Selector 4.0 to the core engineering team. Highlighted user research findings from Application Engineers and demonstrated how modular components would replace legacy monoliths.
- **Clipboard API Bug Resolution**:
  Investigated an issue raised during peer review where the "Copy URL" button failed on older browsers or non-secure HTTP local origins where `navigator.clipboard` is undefined. Implemented a fallback using a temporary `textarea` element and `document.execCommand('copy')`, ensuring universal clipboard support.
- **Hands-On Industrial Robotics Training**:
  Completed immersive, hands-on training with the product manager and robotics specialist. Configured a live industrial robot arm workcell from the ground up:
  - Mounted and aligned a Pickit 3D camera sensor over an industrial bin.
  - Performed robot-camera multi-pose calibration.
  - Defined picking Region of Interest (ROI) boundaries and surface detection parameters.
  - Executed automated physical bin-picking cycles, experiencing firsthand how optical accuracy tolerances directly impact grasp success.

### Tuesday, August 12, 2025
- **Sprint Planning**: Established implementation backlog tickets for the Camera Selector 4.0 implementation.
- **URL Parameter Code Review Follow-Up**: Incorporated final code review suggestions on parameter validation and URL encoding.

### Wednesday, August 13, 2025
- **Daily Standup**: Coordinated release schedule for version 3.5.
- **Merge into `release_3.5`**: Cleaned and squashed the URL parameter branch via interactive rebasing and merged the changes into the official `release_3.5` release branch.
- **Forward-Porting & Merge Conflict Resolution**:
  Forward-ported the `release_3.5` branch into `master` (the active 4.0 development branch). Encountered and resolved complex merge conflicts where divergent file paths and feature flags overlapped, cleanly ensuring that 3.5 release stability was maintained without introducing unfinished 4.0 development code.
- **Jenkins CI/CD Pipeline Hardening**:
  Updated Pickit's Jenkins pipeline script (`Jenkinsfile`) for the Camera Selector repository. Added an automated test execution stage (`test-validation`) that triggers Jest test suites across the codebase prior to the build and deploy stages, automatically terminating deployment if any test fails.

### Thursday, August 14, 2025
- **Daily Standup**: Aligned with engineering leadership on release verification.
- **Weekly Camera Selector Architecture Sync**: Discussed integration details for the 4.0 Three.js viewport and state store.
- **Release Communication**: Drafted the official internal release announcement for Camera Selector 3.5 for distribution across engineering and commercial communication channels.
- **Commercial Pitch Slide Deck Review**: Met with the engineering manager to review presentation slides tailored for the commercial sales team, refining value propositions and feature highlights.

---

## Key Technical Decisions & Innovations

### 1. Hands-On Robotics Calibration Experience
Interacting directly with a 6-axis industrial robot arm provided critical domain knowledge. Experiencing how small optical calibration offsets cause mechanical gripper collisions gave Aryan direct insight into why strict optical accuracy validation in the web tooling is essential for field safety.

### 2. Automated Jenkins CI/CD Quality Gates
Prior to this change, build pipelines proceeded directly to Docker container compilation and deployment regardless of local test status. Introducing an explicit `test-validation` stage in Jenkins established an automated quality barrier against regressions in production.

---

## Technologies Utilized

- **Industrial Robotics**: 6-axis robot arm controllers, Pickit 3D vision engine, bin-picking calibration.
- **CI/CD & DevOps**: Jenkins pipeline scripting (`Jenkinsfile`), automated test runners, Docker builds.
- **Git & Release Management**: Multi-branch release workflows, conflict resolution, forward-porting.
- **React & TypeScript**: Defensive clipboard fallback implementation, URL parameter parsing.
- **Figma**: Interactive prototyping, design system governance.
