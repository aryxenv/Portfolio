---
id: "pickit-week-01"
title: "Pickit 3D Internship - Week 1: Onboarding, Codebase Exploration & Imperial Unit Selector"
type: "experience"
company: "Pickit 3D"
role: "Frontend & Cybersecurity Intern"
week_number: 1
log_date: "2025-07-02 to 2025-07-04"
date_range: "Jul 2025"
location: "Leuven, Belgium (Hybrid)"
nda_redacted: true
tech_stack:
  - "React"
  - "TypeScript"
  - "Three.js"
  - "Jest"
  - "Git"
tags:
  - "pickit3d"
  - "internship"
  - "threejs"
  - "react"
  - "unit-conversion"
  - "jest"
summary: "Completed engineering onboarding at Pickit 3D in Leuven, conducted a comprehensive codebase review of the ThreeJS Camera Selector, and built an imperial/metric unit conversion toggle with complete unit tests."
source: "C:/Users/aryan/OneDrive/pickit3d_internship_log/Tracker Week 1 27abcdace0e3800a8e6edadb4b317928.csv"
---

# Pickit 3D Internship - Week 1: Onboarding, Codebase Exploration & Imperial Unit Selector

## Executive Summary

Week 1 marked the initiation of the Frontend & Cybersecurity Internship at Pickit 3D's headquarters in Leuven, Belgium. The primary objective for the week was rapid orientation within the engineering organization, local development environment provisioning, and a deep-dive architectural exploration of the **Pickit 3D Camera Selector** web application. 

The initial engineering deliverable centered on expanding the accessibility of the 3D Camera Selector for North American and international customers by introducing an imperial unit selector (inch/mm toggle). This feature enables users to view and manipulate 3D Region of Interest (ROI) bounding box measurements seamlessly in imperial units without losing floating-point precision during internal coordinate conversions.

---

## Daily & Weekly Technical Log

### Wednesday, July 2, 2025
- **Engineering Onboarding**: Initial setup of corporate workstations, access provisioning across internal Git repositories, issue tracking systems, and team communication channels. Met with the engineering supervisor and mentors to define the summer roadmap spanning 3D web tooling and Linux infrastructure security.
- **Team Standup**: Participated in the morning engineering standup, introducing current capabilities and aligning on Sprint deliverables.

### Thursday, July 3, 2025
- **Daily Standup**: Synchronized on daily goals and development environment readiness.
- **Camera Selector Codebase Review**: Conducted a thorough architectural audit of the Pickit 3D Camera Selector repository. Examined how Three.js renders 3D camera Field of View (FOV) frustums, the synchronization between UI inputs and WebGL scene objects, and the mathematical representation of the Region of Interest (ROI) volume.
- **Imperial Unit Selector Implementation**: Designed and implemented a unit selection toggle (millimeters vs. inches). Configured bidirectional conversion handlers so that when a user toggles to inches, the 3D coordinate bounding box dimensions update dynamically while maintaining exact underlying metric values required by the Three.js viewport.

### Friday, July 4, 2025
- **Daily Standup**: Reported progress on the unit selector implementation and prepared for testing.
- **Automated Unit Testing**: Authored comprehensive Jest test suites validating the unit conversion utilities. Tested boundary values, precision rounding, edge cases (e.g., zero and negative inputs), and component re-rendering behavior when toggling units under active 3D camera selections.

---

## Key Technical Achievements

1. **Precision-Safe Unit Conversion Utilities**:
   Engineered mathematical conversion functions ensuring that displaying measurements in inches (`1 in = 25.4 mm`) maintains numerical precision without accumulating rounding errors across UI state cycles.
2. **Three.js Scene State Coherence**:
   Ensured the Three.js 3D viewport coordinates remain strictly standardized in metric units while the user-facing UI cleanly reflects the user's preferred measurement system.
3. **Comprehensive Test Coverage**:
   Delivered full unit test coverage for newly introduced utilities, verifying that switching units retains active ROI dimensions accurately.

---

## Technologies & Frameworks Utilized

- **React 18 & TypeScript**: Component hierarchy, state hooks, and typed utility interfaces.
- **Three.js**: WebGL rendering pipeline, coordinate spaces, and scene graph inspection.
- **Jest**: Unit testing and assertion libraries for mathematical conversion functions.
- **Git & GitHub**: Branching workflow, commit hygiene, and pull request staging.
