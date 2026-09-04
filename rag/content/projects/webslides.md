---
id: "project-webslides"
title: "Webslides - Interactive Customer Presentation Deck Framework"
type: "project"
project_name: "Webslides"
status: "green"
category: "Full-Stack Web App"
github_url: "https://github.com/aryxenv/webslides"
demo_url: ""
tech_stack:
  - "React"
  - "TypeScript"
  - "Tailwind CSS"
  - "Vite"
  - "FastAPI"
  - "Playwright"
  - "GitHub Copilot"
  - "GitHub Pages"
tags:
  - "webslides"
  - "presentation"
  - "deck"
  - "react"
  - "fastapi"
  - "playwright"
  - "pdf-export"
  - "interactive-demo"
summary: "A web-application slide deck framework for technical customer presentations supporting embedded live demos, keyboard-driven navigation, reusable components, GitHub Pages publishing, and automated PDF/PowerPoint export via FastAPI and Playwright."
source: "src/data/projects.ts"
---

# Webslides - Interactive Customer Presentation Deck Framework

## Project Overview
Webslides is a modern, code-first presentation deck framework built to solve a pervasive pain point in enterprise technical pre-sales and customer engineering: the friction of switching between static PowerPoint presentations and live browser software demonstrations. Born out of an internal hackathon concept, Webslides enables engineers and solution architects to deliver cohesive technical narratives with fully functional, live-rendered components directly embedded inside slide layouts.

Presenters can embed interactive web apps, 3D graphics, live terminal interfaces, and dynamic data visualizers directly into the flow of their pitch, eliminating jarring context-switching while preserving the polish and structure of a traditional slide deck.

## Core Architecture & Technical Implementation

### 1. Presentation Runtime & UI Engine
- **Framework**: React 18/19 with TypeScript and Vite for ultra-fast Hot Module Replacement (HMR) during slide authoring.
- **Styling & Design System**: Tailwind CSS provides a modular utility token architecture supporting rapid brand theming, typography hierarchy, and dark/light color palette adjustments.
- **Navigation Engine**: High-responsiveness keyboard listener capturing standard presentation controls (Arrow keys, Spacebar, Page Up/Down) alongside swipe gestures for touch displays. Includes an interactive slide-overview drawer and URL hash-based slide deep linking (`#slide-12`).

### 2. Live In-Slide Component Embedding
Unlike static slides or video recordings, Webslides renders real interactive React islands or isolated `iframe` sandboxes within the slide container:
- Live REST/SSE API callers demonstrating backend endpoints.
- 3D CAD/Three.js viewers allowing customers to rotate models during a product walkthrough.
- Dynamic input forms that trigger live calculations in real time.

### 3. Automated PDF & PowerPoint Export Pipeline
Enterprise clients frequently request offline deck copies following a presentation. Webslides integrates a headless export microservice:
- **FastAPI Backend**: A lightweight Python FastAPI server receiving export triggers.
- **Playwright Automation**: Spawns a headless Chromium instance, traverses through every slide in sequence, waits for dynamic DOM rendering to settle, and captures full-bleed, high-resolution snapshots.
- **Document Assembly**: Compiles captured slide frames into standard vector-compatible PDF documents and structured PowerPoint (.pptx) presentations with preserved slide dimensions and aspect ratios.

### 4. Copilot-Assisted Authoring & Theming
- Integrates custom GitHub Copilot prompting skills that translate raw markdown notes or bulleted solution briefs into well-structured Webslide React components.
- Modular layout primitives (Split Screen, Terminal Callout, Architecture Diagram, Feature Comparison Matrix, Customer Quote) allow non-frontend engineers to assemble professional decks rapidly.

## Key Technical Specifications & Links
- **Project Name**: Webslides
- **Status**: Production / Active (`green`)
- **Primary Category**: Full-Stack Web Application / Developer Tooling
- **GitHub Repository**: [https://github.com/aryxenv/webslides](https://github.com/aryxenv/webslides)
- **Deployment**: Configured for continuous delivery to GitHub Pages via automated GitHub Actions workflows.
