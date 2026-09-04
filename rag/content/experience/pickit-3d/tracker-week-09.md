---
id: "pickit-week-09"
title: "Pickit 3D Internship - Week 9: Core Robot UI Crash Guard, Centralized Configurator Store & TypeScript Upgrade"
type: "experience"
company: "Pickit 3D"
role: "Frontend & Cybersecurity Intern"
week_number: 9
log_date: "2025-08-25 to 2025-08-31"
date_range: "Aug 2025"
location: "Leuven, Belgium (Hybrid)"
nda_redacted: true
tech_stack:
  - "React"
  - "TypeScript"
  - "Material UI"
  - "Zustand"
  - "react-resize-detector"
  - "Git"
tags:
  - "pickit3d"
  - "robot-ui"
  - "state-management"
  - "bug-fix"
  - "typescript-upgrade"
  - "responsive-canvas"
summary: "Resolved a high-priority crash bug in the main Pickit robot interface by implementing dependency validation guards on pick point deletion, built a centralized configurator state store with URL parameter synchronization, and upgraded TypeScript."
source: "C:/Users/aryan/OneDrive/pickit3d_internship_log/Tracker Week 9 27abcdace0e38065a0a7d13522fd40a1.csv"
---

# Pickit 3D Internship - Week 9: Core Robot UI Crash Guard, Centralized Configurator Store & TypeScript Upgrade

## Executive Summary

Week 9 brought critical contributions spanning both Pickit 3D's flagship robot operating software and the internal architecture of Camera Selector 4.0. In the primary robot application, Aryan investigated and resolved a severe runtime crash: when an operator deleted a robot pick point that was actively referenced by other motion instructions or pick strategies, the UI crashed due to dangling pointer exceptions. Aryan implemented a dependency-aware validation guard that gracefully disables the delete button and displays an explanatory tooltip.

Meanwhile, in Camera Selector 4.0, Aryan completely overhauled state management. He retired fragmented React component hooks in favor of a unified, centralized configurator store. This centralized store synchronizes camera models, unit preferences, and dimensional inputs with browser URL query strings in real time. To ensure rock-solid responsiveness, he integrated `react-resize-detector`, modernized the notification architecture using Material UI alert banners, and upgraded TypeScript across the project.

---

## Daily & Weekly Technical Log

### Monday, August 25, 2025
- **Main Pickit UI Pick Point Crash Fix**:
  - Investigated an issue where users deleting a pick point referenced elsewhere in the robot motion program caused the entire Pickit web interface to crash.
  - Traced the dependency graph of pick points in the application state.
  - Implemented a defensive check: if any active references point to the target pick point, the delete button is rendered in a disabled state.
  - Added an intuitive Material UI tooltip explaining exactly why the button is disabled (e.g., *"Cannot delete: Pick point is referenced in active motion sequence"*).
- **Pull Request Creation & Git Troubleshooting**:
  - Encountered an issue where the initial PR was accidentally branched against the wrong base branch. Deleted the erroneous branch, recreated a clean branch tracking the correct upstream base, and safely ported the changes.

### Tuesday, August 26, 2025 – Wednesday, August 27, 2025
- **Daily Standups**: Coordinated on code review for the pick point crash fix and reported transition to the 4.0 configurator store.
- **Camera Selector 4.0 Data Architecture & Store**:
  - Migrated hardcoded camera profiles into structured, typed data objects inside a dedicated `/data` directory.
  - Engineered a centralized configurator store (utilizing Zustand-style state patterns) that cleanly manages all application parameters: active camera, mounting orientation, standoff, and 3D dimensions.
  - Connected the store directly to the URL parameter serialization engine, ensuring that every state change in the store is mirrored into the URL search string.

### Thursday, August 28, 2025
- **Daily Standup**: Synchronized on sprint goals.
- **Sprint Retrospective**: Participated in Sprint Retrospective, reviewing velocity, team collaboration, and release pipeline improvements.
- **Camera Tabs & Unit Selector Integration**:
  - Built camera selection tabs directly driven by the centralized configurator store, eliminating intermediate prop drilling.
  - Removed outdated custom hooks and unified unit selection state across all subcomponents, ensuring unit toggles update the entire application instantaneously.

### Friday, August 29, 2025 – Sunday, August 31, 2025
- **Daily Standup**: Aligned on responsive rendering challenges.
- **`react-resize-detector` Integration**:
  - Integrated `react-resize-detector` on the 3D viewport container to capture subtle layout shifts during panel resizing or window adjustments, triggering smooth WebGL camera aspect-ratio recalculations.
- **Modular Notes Component with MUI Alerts**:
  - Built a dynamic Notes component leveraging Material UI Alert variants (`info`, `warning`, `error`) to display camera-specific engineering notices and links to official documentation.
- **TypeScript Upgrade & Build Documentation**:
  - Upgraded the project's TypeScript version to leverage latest compiler features and stricter type checking.
  - Updated developer documentation and prepared for full Three.js scene graph integration.

---

## Key Technical Decisions & Innovations

### 1. Dependency-Aware Pick Point Validation Guard
Rather than allowing an invalid deletion to trigger an exception or attempting risky cascade-deletion of dependent robot trajectory steps, Aryan's validation guard proactively blocked unsafe actions at the UI level. This design safeguarded physical robot workcell configurations from accidental corruption.

### 2. Centralized Configurator Store Pattern
Moving from scattered React state hooks to a single, centralized configurator store established a clear unidirectional data flow:
```text
User Action / URL Load ──> Centralized Store ──> Three.js Viewport
                                    │
                                    └──> Form Controls & Accordions
                                    │
                                    └──> URL Query Parameters & LocalStorage
```
This architecture eliminated state synchronization drift and rendered the application significantly easier to test and extend.

---

## Technologies Utilized

- **React 18 & TypeScript**: Centralized state store architecture, typed models, compiler upgrade.
- **Material UI (MUI)**: Alert components, tooltips, buttons, styling themes.
- **`react-resize-detector`**: Element-level resize observation for WebGL canvas refits.
- **Git**: Branch re-targeting, commit cherry-picking, pull request lifecycle.
