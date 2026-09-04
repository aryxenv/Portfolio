---
id: "pickit-week-03"
title: "Pickit 3D Internship - Week 3: Three.js Autoscaler Merge, LDAP Security Research & Core Robot UI Bug Resolution"
type: "experience"
company: "Pickit 3D"
role: "Frontend & Cybersecurity Intern"
week_number: 3
log_date: "2025-07-14 to 2025-07-18"
date_range: "Jul 2025"
location: "Leuven, Belgium (Hybrid)"
nda_redacted: true
tech_stack:
  - "Three.js"
  - "React"
  - "TypeScript"
  - "LDAP"
  - "Linux"
  - "Node.js"
tags:
  - "pickit3d"
  - "threejs"
  - "cybersecurity"
  - "ldap"
  - "robot-ui"
  - "debugging"
summary: "Merged the Three.js z_max autoscaler into master, kicked off the cybersecurity track with foundational LDAP directory research, diagnosed a critical UI crash in the core Pickit robot application, and began planning Camera Selector 4.0."
source: "C:/Users/aryan/OneDrive/pickit3d_internship_log/Tracker Week 3 27abcdace0e38001ac88cc991ab8537d.csv"
---

# Pickit 3D Internship - Week 3: Three.js Autoscaler Merge, LDAP Security Research & Core Robot UI Bug Resolution

## Executive Summary

Week 3 bridged two major initiatives: finalizing the Three.js viewport graphics enhancements and initiating the infrastructure cybersecurity track. After incorporating peer feedback and merging the `z_max` autoscaling pull request into master, Aryan began comprehensive research into Lightweight Directory Access Protocol (LDAP) implementations for internal developer authentication.

Concurrently, Aryan expanded his scope to Pickit 3D's primary robot operating software. He assisted a peer software engineer in debugging a severe marker UI crash, isolating the root cause to dependency corruption and unhandled null states. The week concluded with strategic alignment with the product manager on the comprehensive architectural revamp planned for **Camera Selector 4.0**, accompanied by the initial UI implementation for optical picking and location accuracy inputs.

---

## Daily & Weekly Technical Log

### Monday, July 14, 2025
- **Autoscaler Pull Request**: Opened a formal PR to merge the Three.js ROI text autoscaler into `master`.
- **Daily Standup**: Coordinated with the frontend team on review priorities.
- **PR Follow-Up**: Addressed code review feedback regarding edge-case aspect ratios and font caching.
- **Cybersecurity Track Kickoff (LDAP Research)**: Began deep-dive research into LDAP architectures, directory tree structures (DIT), Object Classes, distinguished names (DN), and modern lightweight directory services suitable for containerized deployment on Linux. Documented comparative findings to inform the migration strategy.

### Tuesday, July 15, 2025
- **Daily Standup**: Synchronized on PR approval status.
- **Autoscaler Final Approval & Merge**: Applied final polishing tweaks suggested during PR review and successfully merged the ROI autoscaler into `master`.

### Wednesday, July 16, 2025
- **Daily Standup**: Reported completion of the autoscaler merge and transition to core UI support.
- **Core Pickit UI Debugging**: Investigated an elusive application crash in the main Pickit robot configuration UI affecting a peer engineer's local environment. Traced the execution flow through the marker rendering subsystem to determine where state synchronization failed.

### Thursday, July 17, 2025
- **Daily Standup**: Aligned on debugging milestones.
- **Camera Selector 4.0 Vision Review**: Analyzed the product manager's strategic vision presentation for Camera Selector 4.0, synthesizing feature concepts into actionable engineering requirements.
- **Main Pickit UI Environment Provisioning**: Configured the full local development environment for Pickit 3D's core robot configuration software, resolving container linking and port-binding hurdles.
- **Camera Selector Revamp Roadmap Meeting**: Participated in a high-level roadmap session with product management to define the summer milestones for the 4.0 rewrite.
- **Resolving Marker UI Bug**: Discovered that a combination of corrupted local `node_modules` caches and an unhandled null check during 3D marker coordinate initialization caused the runtime crash on the peer engineer's machine. Rebuilt the local environment and engineered a clean validation guard.
- **Pull Request for Marker UI**: Cleaned up temporary diagnostic logging and submitted a clean PR with the verified fix.

### Friday, July 18, 2025
- **Daily Standup**: Synchronized on the marker UI fix and day's roadmap.
- **Camera Accuracy UI Prototyping**: Developed the initial user interface controls for capturing 3D camera picking accuracy and location accuracy tolerances, establishing the input baseline for pre-sales calculations.
- **Internship Main Track Alignment**: Finalized the summer engineering objectives with the engineering lead, establishing Camera Selector 4.0 and containerized LDAP security infrastructure as the two core pillars.

---

## Technical Highlights & Impact

1. **Cross-Repository Impact**:
   Successfully ventured outside the Camera Selector repository into Pickit's core robot software codebase, diagnosing complex environmental and code-level issues to unblock colleagues.
2. **Foundational Security Architecture**:
   Established the technical foundation for migrating internal developer authentication to a modern LDAP directory, evaluating schema standards and security implications.
3. **Product Vision Translation**:
   Synthesized high-level product presentations into a structured engineering backlog for the upcoming Camera Selector 4.0 rewrite.

---

## Technologies Utilized

- **Three.js & WebGL**: 3D coordinate markers, sprite scaling, camera projection matrices.
- **React & TypeScript**: UI components, callback props, form input controls.
- **LDAP Protocols**: Schema definition, directory trees, authentication models.
- **Linux & Node.js**: Dependency resolution, build environment troubleshooting, npm/yarn cache management.
