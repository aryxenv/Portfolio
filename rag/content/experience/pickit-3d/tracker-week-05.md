---
id: "pickit-week-05"
title: "Pickit 3D Internship - Week 5: TLS/SSL LLDAP Staging Deployment, Camera Accuracy Fallbacks & Viewport Auto-Bound Wrapper"
type: "experience"
company: "Pickit 3D"
role: "Frontend & Cybersecurity Intern"
week_number: 5
log_date: "2025-07-28 to 2025-08-01"
date_range: "Jul 2025 - Aug 2025"
location: "Leuven, Belgium (Hybrid)"
nda_redacted: true
tech_stack:
  - "Three.js"
  - "React"
  - "TypeScript"
  - "Docker"
  - "LLDAP"
  - "TLS/SSL"
  - "SSSD"
  - "Linux"
tags:
  - "pickit3d"
  - "lldap"
  - "cybersecurity"
  - "tls-ssl"
  - "threejs"
  - "viewport-scaling"
  - "camera-models"
summary: "Resolved SSSD authentication bugs to deploy encrypted TLS/SSL LLDAP on internal Linux staging infrastructure, implemented optical accuracy fallback mechanisms, integrated new industrial cameras, and built an auto-bound 3D viewport wrapper."
source: "C:/Users/aryan/OneDrive/pickit3d_internship_log/Tracker Week 5 27abcdace0e380538e75c0195837c05c.csv"
---

# Pickit 3D Internship - Week 5: TLS/SSL LLDAP Staging Deployment, Camera Accuracy Fallbacks & Viewport Auto-Bound Wrapper

## Executive Summary

Week 5 marked a major milestone in the infrastructure cybersecurity track. Aryan diagnosed complex authentication handshake failures between the Linux `sssd` (System Security Services Daemon) client and the containerized LLDAP directory service. By isolating misconfigurations in `sssd.conf` and provisioning valid TLS/SSL certificates, he successfully deployed an encrypted LDAP directory onto Pickit's internal robot vision hardware test bench.

Simultaneously on the frontend track, Aryan enriched the Camera Selector with new industrial camera models (`S-HD2-C300` and `XS-HD2-C100`), engineered optical accuracy fallback logic (allowing location accuracy to inherit picking accuracy with warning badges when unstated in datasheets), and solved 3D perspective issues by building an automatic bounding wrapper in Three.js that dynamically adjusts viewport zoom to prevent cameras from clipping outside the canvas.

---

## Daily & Weekly Technical Log

### Monday, July 28, 2025
- **Daily Standup**: Coordinated sprint priorities across security and frontend features.
- **Camera Selector Weekly Sync**: Met with the product manager and senior vision researchers to review upcoming UI enhancements.
- **Knowledge Base Documentation Migration**: Updated camera datasheet links throughout the application, migrating from legacy Google Drive URLs to structured pages within the official Pickit 3D Knowledge Base.
- **Call-to-Action (CTA) Redesign**: Transformed the plain text call-to-action link into a prominent, high-converting navbar button.
- **LDAP Staging Server Troubleshooting**: Initiated deployment of the containerized LLDAP server on the internal robot vision hardware test bench; diagnosed why initial authentication attempts were failing.
- **Customer Use-Case Alignment**: Attended a technical customer discussion with senior vision engineers regarding optical detection poses and accuracy thresholds for specialized industrial bin-picking applications.
- **SSSD Configuration Breakthrough**: Isolated the authentication failure to missing client certificates and misconfigured TLS parameters in `/etc/sssd/sssd.conf`.
- **Optical Accuracy Fallback Logic**: Implemented graceful degradation for camera models that lack explicit location accuracy ratings in their datasheets. Rather than disabling the input, the engine automatically defaults location accuracy to the picking accuracy value and renders an informative warning icon informing the user of the fallback.

### Tuesday, July 29, 2025
- **Daily Standup**: Synchronized on authentication testing and frontend pull requests.
- **CTA Button Merge**: Optimized styling and merged the redesigned CTA navbar button into `main`.
- **Accuracy PR Enhancements**: Incorporated code review suggestions on the accuracy feature branch.
- **SSSD & TLS/SSL Deployment**: Configured encrypted client authentication via `sssd` on a Linux development workstation. Generated TLS/SSL certificates, bound them to the LLDAP container, and drafted detailed step-by-step documentation for the engineering team.

### Wednesday, July 30, 2025
- **Deploying LLDAP to Internal Staging Infrastructure**: Tested and verified end-to-end user authentication and group permissions with the LLDAP server deployed on the dedicated internal robot vision hardware test bench.
- **Adding New 3D Cameras**: Integrated two newly launched camera models (`S-HD2-C300` and `XS-HD2-C100`) into the Camera Selector catalog, inputting their optical characteristics, minimum standoffs, and resolution profiles.

### Thursday, July 31, 2025
- **Technical Sync**: Reviewed camera integration with senior vision researchers.
- **Daily Standup**: Outlined viewport scaling challenges with smaller optical hardware.
- **Camera Selector Engineering Review**: Aligned with product and engineering leads on dynamic scaling behaviors.
- **Three.js Viewport Auto-Bound Wrapper**:
  - Addressed a graphical issue where compact camera models appeared too small or clipped outside the field of view.
  - Dynamically scaled scene arrowheads, gizmo meshes, and dimension labels.
  - Engineered an automatic bounding sphere wrapper around the 3D scene that computes the bounding box of the camera frustum and automatically adjusts camera zoom distance to keep the entire setup centered in the viewport.
- **URL Parameter Feasibility**: Researched state synchronization techniques to encode complex 3D configurator parameters directly into browser URL search strings.
- **Branch Integration**: Merged the viewport auto-bound scaling fixes into the new cameras branch.

### Friday, August 1, 2025
- **Branch Merges**: Integrated the accuracy feature branch into the upcoming staging release.
- **Automated Test Suites**: Built automated unit tests validating coordinate transformations and configuration limits for the newly added camera models.
- **Pull Request Creation**: Opened PR for the new camera models, addressing automated review suggestions.

---

## Key Technical Decisions & Innovations

### 1. Robust Encrypted Directory Authentication
By enforcing TLS/SSL transport on the internal LLDAP instance, Aryan ensured that internal developer credentials and machine authentication tokens traversing the local engineering network are fully encrypted, replacing plaintext legacy setups.

### 2. Viewport Auto-Bound Frustum Wrapper
Industrial 3D cameras vary widely in size—from ultra-compact lightweight sensors to large long-range bin-picking cameras. Aryan's Three.js bounding algorithm calculates the union of the camera body mesh and the extended FOV frustum, dynamically updating the Three.js `PerspectiveCamera` position so every model is framed perfectly upon selection.

---

## Technologies Utilized

- **Cybersecurity & Infrastructure**: LLDAP, OpenSSL, SSSD, Linux PAM, Docker, TLS/SSL certificate authority configuration.
- **Three.js & Computer Graphics**: Bounding boxes (`Box3`), perspective camera projection, dynamic mesh scaling.
- **React 18 & TypeScript**: Context state, warning badges, Knowledge Base routing.
- **Jest**: Unit testing for camera optical profiles.
