---
id: "pickit-week-10"
title: "Pickit 3D Internship - Week 10: Three.js Gizmo Integration, Brand Camera Tabs & Accuracy Guidance"
type: "experience"
company: "Pickit 3D"
role: "Frontend & Cybersecurity Intern"
week_number: 10
log_date: "2025-09-01 to 2025-09-06"
date_range: "Sep 2025"
location: "Leuven, Belgium (Hybrid)"
nda_redacted: true
tech_stack:
  - "Three.js"
  - "React"
  - "TypeScript"
  - "Material UI"
  - "GitHub Copilot"
  - "CSS Grid"
tags:
  - "pickit3d"
  - "threejs"
  - "3d-gizmo"
  - "brand-tabs"
  - "accuracy-guidance"
  - "canvas-rendering"
summary: "Integrated the Three.js 3D viewport and coordinate gizmo into the Camera Selector 4.0 interface, built multi-row brand tabs sorted by camera count, refactored conversion utilities, and fixed canvas overflow bugs."
source: "C:/Users/aryan/OneDrive/pickit3d_internship_log/Tracker Week 10 27abcdace0e3803da59ce30917ebdf5f.csv"
---

# Pickit 3D Internship - Week 10: Three.js Gizmo Integration, Brand Camera Tabs & Accuracy Guidance

## Executive Summary

Week 10 united the interactive 3D graphics engine with the modernized Camera Selector 4.0 user interface. Aryan successfully embedded the Three.js viewport into the resizable panel architecture, integrating an interactive 3D orientation gizmo that enables users to orbit, pan, and snap viewpoints along primary coordinate axes (X, Y, Z). 

In addition, Aryan developed a sophisticated multi-row camera selection tab bar grouped by hardware brand and automatically sorted in descending order based on the number of supported models per brand. He refactored unit math into modular `conversionUtils.ts`, introduced dedicated reset buttons for instantaneous parameter reversion, engineered the optical accuracy guidance UI, and resolved an elusive WebGL canvas overflow bug that occurred during rapid window resizing.

---

## Daily & Weekly Technical Log

### Monday, September 1, 2025
- **Sprint Review & Standup**: Participated in Sprint Review, presenting the centralized configurator store and the validated pick point crash fix PR for the main Pickit UI.
- **Main Pickit UI PR Follow-Up**: Monitored continuous integration tests and finalized the pick point delete guard merge into the core robot codebase.
- **Full Three.js Viewport & Gizmo Integration**:
  - Embedded the Three.js WebGL canvas into the newly designed Camera Selector 4.0 workspace.
  - Integrated an interactive 3D coordinate orientation gizmo in the corner of the viewport, enabling users to click axes for standard top, side, and isometric perspectives.
  - Added custom Material UI icon buttons allowing users to reset viewpoint camera angles and restore baseline dimensions.
  - Refactored state naming conventions in the store (`selectedCamera` nomenclature) and restructured math helpers into `conversionUtils.ts`.

### Tuesday, September 2, 2025
- **Sprint Planning**: Established goals for final feature completion and testing.
- **Daily Standup**: Coordinated with frontend engineers on component finalization.
- **Interface Finalization & Placeholder Pruning**: Removed temporary mockup placeholders throughout Camera Selector 4.0, replacing them with live components wired to the central store.

### Wednesday, September 3, 2025
- **Daily Standup**: Aligned on vision calculation integration.
- **Technical Sync**: Met with a senior vision researcher to verify optical tolerance algorithms and camera parameter structures.
- **Documentation & Copilot Review**: Updated developer onboarding documentation and reviewed GitHub Copilot code suggestions on open pull requests.
- **Accuracy Guidance UI**: Built the optical accuracy pick/guidance component, implementing conditional visibility rules based on whether the selected 3D camera model supports location accuracy metrics.

### Thursday, September 4, 2025
- **Daily Standup**: Synchronized on team workflow tools.
- **GitHub Copilot Team Workflow Review**: Participated in an engineering team roundtable evaluating GitHub Copilot's efficacy, reviewing prompt patterns, boilerplate generation, and best practices for TypeScript codebase maintenance.
- **Accuracy Feature Finalization**: Completed edge-case handling in the accuracy guidance component.
- **Camera Catalog Architecture**: Mapped out hierarchical data structures representing industrial 3D camera brands, series, and individual optical specifications.

### Friday, September 5, 2025 – Saturday, September 6, 2025
- **Daily Standup**: Prepared for camera catalog implementation.
- **Brand-Grouped Multi-Row Camera Tabs**:
  - Engineered a responsive multi-row tab selector that organizes cameras by manufacturer brand.
  - Programmed dynamic sorting logic that evaluates the camera catalog at runtime and sorts brands in descending order based on the count of active camera models, placing the most versatile brands first.
  - Diagnosed and resolved a subtle WebGL canvas overflow bug where dragging the browser window edge triggered horizontal scrollbars and broke the canvas aspect ratio.

---

## Key Technical Decisions & Innovations

### 1. Interactive 3D Orientation Gizmo
Navigating 3D space in a browser can be disorienting for non-CAD users. Embedding a clickable orientation gizmo in the Three.js canvas gave sales engineers and customers an intuitive, tactile way to snap to standard orthogonal projections (Top, Front, Side) during workcell reviews.

### 2. Dynamically Sorted Brand Tabs
Rather than hardcoding static brand tabs, Aryan implemented runtime aggregation:
```typescript
const sortedBrands = Object.entries(brandCounts)
  .sort(([, countA], [, countB]) => countB - countA)
  .map(([brand]) => brand);
```
This ensured that as new camera models are added to the catalog, the UI automatically reorganizes itself without manual template edits.

---

## Technologies Utilized

- **Three.js & WebGL**: Orientation gizmos, raycasting, viewport canvas resizing, aspect ratio recalculation.
- **React 18 & TypeScript**: Centralized store integration, modular conversion utilities (`conversionUtils.ts`).
- **Material UI (MUI)**: Custom icon buttons, responsive tab strips, tooltips.
- **GitHub Copilot**: Code completion analysis, refactoring recommendations.
- **CSS Grid & Flexbox**: Multi-row wrapping tab layouts, overflow containment.
