---
id: "pickit-week-08"
title: "Pickit 3D Internship - Week 8: Resizable Split Panels, LocalStorage Lifecycle & Sales Feedback"
type: "experience"
company: "Pickit 3D"
role: "Frontend & Cybersecurity Intern"
week_number: 8
log_date: "2025-08-18 to 2025-08-22"
date_range: "Aug 2025"
location: "Leuven, Belgium (Hybrid)"
nda_redacted: true
tech_stack:
  - "React"
  - "TypeScript"
  - "Figma"
  - "Material UI"
  - "localStorage"
  - "CSS Flexbox/Grid"
tags:
  - "pickit3d"
  - "resizable-panels"
  - "local-storage"
  - "sales-enablement"
  - "ui-refactoring"
  - "dark-mode"
summary: "Engineered resizable split panels for Camera Selector 4.0, integrated localStorage persistence for user preferences, tailored technical demonstrations for the sales team, and resolved layout flickering."
source: "C:/Users/aryan/OneDrive/pickit3d_internship_log/Tracker Week 8 27abcdace0e3807a9d9dc6dab2d8b77d.csv"
---

# Pickit 3D Internship - Week 8: Resizable Split Panels, LocalStorage Lifecycle & Sales Feedback

## Executive Summary

Week 8 accelerated the core implementation phase of **Camera Selector 4.0**. Aryan transformed the static single-column layout into a modern, flexible workspace featuring resizable split panels. This allows automation engineers and sales representatives to expand either the 3D WebGL visualizer or the parameter configuration panels depending on their immediate task.

Aryan also designed and implemented a comprehensive Settings and Share drawer. To ensure seamless user continuity across browser sessions without requiring backend user accounts, he created a custom `localStorage` state lifecycle that preserves user preferences (such as preferred measurement units, default standoff distances, and camera display modes). Furthermore, Aryan engaged directly with the commercial sales team to gather user feedback, refining the interface with collapsible accordions, enhanced dark mode contrast, and zero-flicker panel resizing.

---

## Daily & Weekly Technical Log

### Monday, August 18, 2025
- **Daily Standup**: Outlined component refactoring goals for the 4.0 branch.
- **Codebase Polishing**: Cleaned legacy utility files, standardized naming conventions, and pruned unused CSS styles across the Camera Selector codebase.
- **1-on-1 Engineering Mentorship Sync**: Met with the engineering manager to review progress against summer goals and align on frontend architectural patterns.
- **Main Layout Modernization & Resizable Panels**:
  - Implemented a resizable split-panel container separating the Three.js 3D viewport from the right-hand configuration panel.
  - Resolved tricky CSS flexbox and WebGL aspect-ratio recalculation bugs that previously caused canvas distortion when dragging panel borders.
  - Debugged theme switching and established reusable UI wrapper components.

### Tuesday, August 19, 2025
- **Daily Standup**: Coordinated on cross-functional alignment meetings.
- **Sales Presentation Slide Deck Revamp**: Substantially revised and refined the Camera Selector 4.0 presentation slide deck specifically for the commercial sales team, pivoting from low-level software architecture to customer-facing business value, speed of quotation, and pre-sales qualification efficiency.

### Wednesday, August 20, 2025
- **Daily Standup**: Synchronized on input/output structure refactoring.
- **Application Summary & Modular IO**:
  - Engineered the Application Summary Dashboard—a set of responsive cards summarizing critical workcell metrics (calculated minimum camera standoff, effective 3D scanning volume, and recommended camera model).
  - Built reusable, typed input components for numerical dimensions, tolerances, and drop-down selectors.
  - Cleaned redundant state logic to ensure rapid UI responsiveness.

### Thursday, August 21, 2025
- **Daily Standup**: Reviewed drawer interactions and persistence goals.
- **Figma Settings & Share Drawer Design**: Designed an elegant slide-over settings drawer in Figma, incorporating user controls for measurement units, theme selection, camera filtering presets, and deep-link generation.
- **Settings Implementation**: Developed the settings drawer in React using Material UI components, modularizing sub-sections into maintainable components.

### Friday, August 22, 2025
- **Frontend UI Handover**: Conducted a technical walkthrough and frontend UI architecture review with a peer frontend engineer.
- **Sales Team Feedback Session**: Demonstrated the interactive Camera Selector 4.0 prototype to the commercial sales team. Gathered valuable feedback regarding sales rep pain points on customer video calls (desiring faster ways to hide non-essential technical parameters).
- **Improvements, Accordions & LocalStorage Lifecycle**:
  - Replaced sprawling flat form fields with collapsible accordion panels for Region of Interest (ROI) and application requirements, enabling users to focus exclusively on active parameters.
  - Programmed a custom `localStorage` lifecycle manager that automatically hydrates and persists user settings while safely handling quota errors and incognito browser restrictions.
  - Overhauled dark mode contrast, enhancing readability for colored status badges and numerical input labels.
  - Fixed an annoying visual flickering issue during split-panel resizing by throttling resize callbacks.

---

## Key Technical Decisions & Innovations

### 1. Persistent Client-Side Lifecycle (`localStorage`)
By engineering a resilient `localStorage` lifecycle hook with fallback to in-memory state, Aryan enabled users' preferred unit systems (inches vs. mm) and UI layout preferences to persist across sessions without introducing external database dependencies or authentication walls.

### 2. Collapsible Accordions for Cognitive Load Reduction
Sales meetings require rapid, clean demonstrations. Transitioning the complex matrix of robotic workcell parameters into organized accordions reduced cognitive load and visual clutter, allowing users to drill into optical tolerances only when needed.

---

## Technologies Utilized

- **React 18 & TypeScript**: Custom lifecycle hooks, memoized components, split-panel resizing.
- **Material UI (MUI)**: Slide-over drawer, accordions, responsive typography, icon buttons.
- **Browser APIs**: `localStorage`, `ResizeObserver`, CSS Grid and Flexbox.
- **Figma**: Component variant design, dark mode color grading, layout grids.
