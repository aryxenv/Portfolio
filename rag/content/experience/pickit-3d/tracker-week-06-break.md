---
id: "pickit-week-06-break"
title: "Pickit 3D Internship - Week 6 (Break): URL Parameters, Deep Linking & Figma Camera Selector 4.0 Architecture"
type: "experience"
company: "Pickit 3D"
role: "Frontend & Cybersecurity Intern"
week_number: 6
log_date: "2025-08-06 to 2025-08-11"
date_range: "Aug 2025"
location: "Leuven, Belgium (Hybrid)"
nda_redacted: true
tech_stack:
  - "React"
  - "TypeScript"
  - "Figma"
  - "URLSearchParams"
  - "Jest"
  - "Three.js"
tags:
  - "pickit3d"
  - "deep-linking"
  - "url-parameters"
  - "figma"
  - "ui-ux-design"
  - "camera-selector-4"
summary: "Engineered deep-linking state synchronization via URL search parameters with a one-click Copy URL button, and architected the complete UI/UX overhaul of Camera Selector 4.0 in Figma."
source: "C:/Users/aryan/OneDrive/pickit3d_internship_log/Tracker Week 6 (Break) 27abcdace0e38076ba93ed959da169d7.csv"
---

# Pickit 3D Internship - Week 6 (Break): URL Parameters, Deep Linking & Figma Camera Selector 4.0 Architecture

## Executive Summary

Although scheduled as an official mid-internship break period, Aryan dedicated focused engineering hours between August 6 and August 11, 2025, to deliver two transformative capabilities. First, he engineered a state serialization system using browser URL query parameters, accompanied by an instant "Copy URL" sharing button. This allowed Application Engineers and sales teams to capture exact 3D workcell configurations—including camera model, standoff, bounding dimensions, and accuracy requirements—and share them via permanent web links.

Second, Aryan initiated and completed the comprehensive UI/UX architectural redesign for **Camera Selector 4.0** in Figma. Moving far beyond iterative tweaks, he established a modular design system featuring responsive application summary cards, organized parameter accordions, split-panel layouts, and dark mode compliance. To prepare for engineering adoption, he authored an executive technical pitch deck to present the design vision to the engineering team.

---

## Daily & Weekly Technical Log

### Wednesday, August 6, 2025
- **URL Parameter State Serialization**:
  - Engineered bidirectional state synchronization between React application state and the browser's `window.location.search` API via `URLSearchParams`.
  - Serialized active camera model identifiers, imperial/metric unit preferences, standoff distance, and 3D Region of Interest (ROI) width, length, and height coordinates into concise URL queries.
  - Implemented the "Copy URL" button in the navigation header, enabling one-click copying of the fully configured scene to the user's system clipboard.

### Thursday, August 7, 2025
- **Automated Testing & Pull Request**:
  - Authored automated Jest test suites verifying URL query string generation, deserialization of query parameters upon initial page load, and fallback handling when URL parameters contain malformed or out-of-range numerical values.
  - Opened a formal pull request to introduce URL parameter synchronization into the release candidate branch.

### Saturday, August 9, 2025
- **Camera Selector 4.0 Figma Architecture**:
  - Initiated a complete redesign of the Camera Selector application within Figma.
  - Deconstructed the monolithic interface into a clean, modern component hierarchy:
    1. Interactive 3D WebGL Canvas with integrated orientation gizmos.
    2. Application Summary Dashboard summarizing effective picking volume and detection coverage.
    3. Categorized Input Controls separated into logical sections (Robot Mounting, ROI Boundaries, Camera Model, Accuracy Tolerances).
  - Drafted comprehensive wireframes for both desktop wide screens and compact laptop displays.

### Sunday, August 10, 2025 – Monday, August 11, 2025
- **Design Finalization & Dark Mode Styling**:
  - Refined Figma visual styling, typography, spacing tokens, and contrast ratios to ensure full legibility in both light and dark display modes.
  - Designed responsive state behaviors for interactive drawers, modals, and collapsible accordion groups.
- **Executive Pitch Presentation**:
  - Created a compelling slide presentation detailing the technical and commercial advantages of the Camera Selector 4.0 redesign to present to the core engineering team during the upcoming Sprint Review.

---

## Key Technical Decisions & Innovations

### 1. Zero-Backend Deep Linking Architecture
Rather than requiring database persistence to store and share user configurations, Aryan serialized all configuration parameters directly into base64 or URI-encoded query strings. This client-side approach eliminated backend storage overhead, provided instantaneous sharing, and ensured backward compatibility with existing static hosting infrastructure.

### 2. Design-to-Code Modular Hierarchy
By creating complete Figma design tokens and component specifications prior to writing code for version 4.0, Aryan ensured that subsequent React implementations followed structured component boundaries, preventing layout thrashing and UI technical debt.

---

## Technologies Utilized

- **React & TypeScript**: State serialization, query string parsing, clipboard interactions.
- **Figma**: UI/UX design, component tokenization, responsive wireframing, dark mode color grading.
- **Web APIs**: `URLSearchParams`, Clipboard API (`navigator.clipboard`).
- **Jest**: Unit testing for URL parsing, state hydration, and error boundary fallbacks.
