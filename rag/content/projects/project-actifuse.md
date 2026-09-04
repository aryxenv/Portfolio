---
id: "project-project-actifuse"
title: "Project Actifuse - Random Activity Generator Powered by BoredAPI"
type: "project"
project_name: "Project Actifuse"
status: "green"
category: "Frontend Web Application"
github_url: "https://github.com/aryxenv/ProjectActifuse"
demo_url: "/project-actifuse/"
tech_stack:
  - "HTML5"
  - "CSS3"
  - "JavaScript"
  - "BoredAPI"
  - "Boxicons"
tags:
  - "project-actifuse"
  - "bored-api"
  - "activity-generator"
  - "javascript"
  - "html5"
  - "css3"
  - "web-app"
summary: "A clean and responsive random activity suggestion web application powered by the BoredAPI, featuring categorical filtering, accessibility scoring, participation parameters, and personal activity tracking."
source: "src/data/projects.ts"
---

# Project Actifuse - Random Activity Generator Powered by BoredAPI

## Project Overview
When individuals experience boredom or decision paralysis, discovering engaging, productive, or creative activities can be surprisingly challenging. **Project Actifuse** is a clean, accessible, and responsive web application engineered by Aryan Shah to generate curated activity recommendations on demand.

Originally conceived as an exploration of asynchronous REST API consumption, DOM manipulation, and dynamic state filtering in vanilla JavaScript, the application connects to the public **BoredAPI** to suggest random or filtered activities based on budget, physical accessibility, and participant count.

## Core Features & Architecture

### 1. Asynchronous API Integration & Normalization
- **BoredAPI Endpoint**: Asynchronously queries the BoredAPI REST endpoint (`https://bored.api.lewagon.com/api/activity/`).
- **Data Payload Extraction**: Unpacks structured JSON payloads containing:
  - `activity`: Descriptive activity prompt (e.g., *"Learn how to fold a paper crane"*, *"Host a movie marathon with friends"*).
  - `type`: Categorical classification (Recreational, Educational, Social, DIY, Charity, Cooking, Relaxation, Music, Busywork).
  - `participants`: Required group size.
  - `price`: Normalized into a user-friendly binary indicator (`Free: Yes` vs `Free: No`).
  - `accessibility`: Numerical scale (0.0 to 1.0) dynamically transformed into human-readable ratings (from *"Most accessible"* to *"Least accessible"* across 10 granular thresholds).
  - `link`: Direct external tutorial or resource hyperlinks if applicable.

### 2. User Experience & Keyboard Navigation
- **Keyboard Shortcut Listener**: Supports pressing the `Enter` key from anywhere within the interface to trigger a new random suggestion instantly, equipped with a 2-second debounce lock to prevent rate-limit flooding.
- **Micro-Interactions**: Animated Boxicons icons reacting to hover states (`bx-tada` wobble animations).
- **Tabbed Interface Navigation**: Multi-view single-page application structure seamlessly switching between Home, Demo, About, Contact, and Download sections without page reloads.

### 3. Distribution & Releases
- **Standalone Web Demo**: Hosted statically and accessible directly through the portfolio at `/project-actifuse/`.
- **Pre-Release Builds**: Features packaged standalone releases distributed via GitHub Releases (`/releases/tag/Pre-release`).
- **Early Open-Source Heritage**: Maintained under Aryan's early GitHub developer handle `legelff` (`https://github.com/legelff/ProjectActifuse`) and later mirrored under `aryxenv`.

## Key Technical Specifications & Links
- **Project Name**: Project Actifuse
- **Status**: Production / Active (`green`)
- **Primary Category**: Frontend Web Application / Productivity Tool
- **GitHub Repository**: [https://github.com/aryxenv/ProjectActifuse](https://github.com/aryxenv/ProjectActifuse)
- **Live Demo Path**: `/project-actifuse/` (self-hosted client under `public/project-actifuse/`)
