---
id: "project-anime-waiting-room"
title: "Anime Waiting Room - Real-Time Airing Episode Countdown Tracker"
type: "project"
project_name: "Anime Waiting Room"
status: "green"
category: "Frontend Web Application"
github_url: "https://github.com/aryxenv/Anime-Waiting-Room"
demo_url: "/anime-waiting-room/"
tech_stack:
  - "Astro"
  - "TypeScript"
  - "Vanilla JavaScript"
  - "Tenrai API"
  - "MyAnimeList (MAL)"
  - "Local Storage"
  - "CSS3 Animations"
tags:
  - "anime"
  - "countdown"
  - "tracker"
  - "astro"
  - "typescript"
  - "tenrai-api"
  - "myanimelist"
  - "real-time"
summary: "A responsive web application enabling anime enthusiasts to search and track real-time countdowns for airing anime episodes using the Tenrai API, Tokyo timezone parsing, client-side persistence, and smooth UI transitions."
source: "src/data/projects.ts"
---

# Anime Waiting Room - Real-Time Airing Episode Countdown Tracker

## Project Overview
Keeping track of broadcast release schedules across different seasonal anime shows is notoriously difficult due to timezone conversions, network delays, and inconsistent regional streaming windows. Broadcast times in Japan (JST) often do not map cleanly to Western local timezones.

**Anime Waiting Room** is a fast, responsive, and lightweight web application created by Aryan Shah to give anime fans an effortless way to track live countdowns for their favorite currently airing shows in real time. Deployed natively within Aryan's personal website, users can search for any television anime, save it to their personal dashboard, and watch live synchronized countdown timers ticking down to the exact second of the next broadcast.

## Architecture & Technical Implementation

### 1. Data Ingestion & API Integration
- **Tenrai API Integration**: Connects dynamically to `https://api.tenrai.org/v1/anime` using asynchronous `fetch` calls with URI query encoding, sorting by end date and TV format filtering.
- **MyAnimeList (MAL) Deep Linking**: Queries retrieve official MAL identifiers (`mal_id`), canonical English and Japanese titles, airing status (`Currently Airing` vs `Not yet aired`), and official broadcast metadata. Each card provides direct hyperlinks to MyAnimeList profile pages.

### 2. Timezone Normalization & Live Broadcast Calculations
Calculating broadcast times across global users requires careful handling of Japanese Standard Time (JST / UTC+9):
- **JST Conversion Engine**: Parses broadcast weekday strings (`Sundays`, `Thursdays`, etc.) and 24-hour time strings (`23:00`) against a Tokyo baseline date object (`new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" })`).
- **Next Airing Date Resolution**: Computes the upcoming target broadcast timestamp by rolling the current date forward to the matching day-of-week index.
- **Local Time Display**: Converts the Tokyo broadcast timestamp into the user's local device timezone using `Intl.DateTimeFormat`, displaying user-friendly formatted strings (e.g., `07/15/2026 - 16:30 GMT+2`).
- **Synchronized Countdown Loop**: Runs a lightweight 1-second `setInterval` loop that iterates over active timers in memory, calculating the exact remaining duration down to `0d 0h 0m 0s`.

### 3. User Experience & Dynamic UI Architecture
- **Framework & View Transitions**: Built as an Astro page (`/anime-waiting-room/`) with client-side script modules listening to `astro:page-load` lifecycle hooks, ensuring zero-latency navigation without hard page reloads.
- **Client-Side Persistence**: Stores user selections in browser `localStorage` (`selectedAnimes`), eliminating the need for database authentication or account registration. The dashboard instantly restores tracked shows on return visits.
- **Skeleton Shimmer Loading**: Displays animated pulse skeletons during asynchronous API lookups to prevent layout shifts.
- **Card Lifecycle Animations**: Smooth CSS fade-out transitions upon show removal, with dynamic expansion states when empty.

## Key Technical Specifications & Links
- **Project Name**: Anime Waiting Room
- **Status**: Production / Active (`green`)
- **Primary Category**: Frontend Web Application
- **GitHub Repository**: [https://github.com/aryxenv/Anime-Waiting-Room](https://github.com/aryxenv/Anime-Waiting-Room)
- **Live Demo Path**: `/anime-waiting-room/` (deployed natively within `src/pages/anime-waiting-room.astro`)
