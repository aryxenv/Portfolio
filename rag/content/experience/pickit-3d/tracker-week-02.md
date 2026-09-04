---
id: "pickit-week-02"
title: "Pickit 3D Internship - Week 2: Production Release, Standoff UX & ThreeJS z_max ROI Autoscaler"
type: "experience"
company: "Pickit 3D"
role: "Frontend & Cybersecurity Intern"
week_number: 2
log_date: "2025-07-07 to 2025-07-13"
date_range: "Jul 2025"
location: "Leuven, Belgium (Hybrid)"
nda_redacted: true
tech_stack:
  - "Three.js"
  - "React"
  - "TypeScript"
  - "Jest"
  - "Git"
tags:
  - "pickit3d"
  - "threejs"
  - "webgl"
  - "standoff-optimization"
  - "z-max-autoscaler"
  - "git-rebase"
summary: "Shipped the unit selector feature to production, optimized camera standoff UX defaults, mastered Git interactive rebasing, and engineered the Three.js z_max-based ROI text autoscaling algorithm."
source: "C:/Users/aryan/OneDrive/pickit3d_internship_log/Tracker Week 2 27abcdace0e380e98319f9a88d6022c2.csv"
---

# Pickit 3D Internship - Week 2: Production Release, Standoff UX & ThreeJS z_max ROI Autoscaler

## Executive Summary

During Week 2, Aryan successfully merged his first major feature pull request—the Imperial Unit Selector—into the master branch and deployed it to production. The focus then shifted to resolving mechanical usability friction within the Camera Selector: specifically, researching optical camera standoff physics and optimizing UI defaults. 

Additionally, Aryan tackled a complex 3D graphical challenge: Region of Interest (ROI) dimension labels in the Three.js viewport became illegible or disproportionately large when users altered the Field of View (FOV) or zoomed into deep inspection volumes. By analyzing projection mathematics, Aryan identified `z_max` (the maximum depth coordinate of the frustum) as the optimal variable for dynamic font autoscaling, and implemented a robust calculation engine with a manual/automatic UI toggle and tests.

---

## Daily & Weekly Technical Log

### Monday, July 7, 2025
- **Daily Standup**: Synchronized on release readiness for the unit selector feature.
- **Production Merge**: Completed code review follow-ups, merged the unit selector pull request into the `master` branch, and verified deployment to production.
- **Camera Standoff Mechanics Research**: Investigated the physical and optical principles governing camera standoff—the minimum distance required between an industrial 3D camera and the target bin to achieve optical focus and avoid mechanical robot arm collisions.
- **Standoff UX Optimization**: Modified the input forms to automatically default the standoff distance to the minimum operational value supported by each respective camera model, saving users from entering out-of-range baseline numbers.
- **Testing Standoff Logic**: Validated standoff boundary checks across all supported 3D camera models.

### Tuesday, July 8, 2025
- **Daily Standup**: Aligned on feedback regarding the standoff pull request.
- **Code Review Resolution**: Addressed peer review comments on the standoff feature branch, refining validation constraints and input sanitization.

### Wednesday, July 9, 2025
- **Daily Standup**: Coordinated with senior engineers on repository branch hygiene.
- **PR Refinements**: Continued architectural discussion on standoff constraints.
- **Git Interactive Rebase Mastery**: Dedicated focused study to Git interactive rebasing (`git rebase -i`), experimenting with squash, reword, and fixup strategies in sandbox repositories to maintain clean, linear commit histories.

### Thursday, July 10, 2025
- **Daily Standup**: Synchronized on clean commit histories for team PRs.
- **Applying Rebase**: Rebased and squashed the standoff pull request, establishing an immaculate commit timeline prior to merge.
- **Three.js ROI Text Autoscaling Research**: Began investigating why ROI dimension labels in the Three.js scene lost readability at varying camera zoom levels and Field of View angles. Explored multiple mathematical candidates for dynamic font scaling (bounding box diagonals, focal distance, camera aspect ratios). Discovered that `z_max` (the farthest depth boundary of the frustum) serves as the mathematically optimal reference point to calculate normalized text scaling without jitter.
- **Autoscaler UI Controls**: Built a radio button control group allowing users to toggle between automatic text size scaling and user-defined custom font sizes.

### Friday, July 11, 2025
- **Daily Standup**: Presented findings on `z_max` scaling to the team.

### Saturday, July 12, 2025
- **Autoscaler Logic Implementation**: Programmed the core switching logic connecting the UI radio toggle with the Three.js render loop, updating sprite scale vectors dynamically upon scene graph updates.

### Sunday, July 13, 2025
- **Autoscaler Test Suite**: Created automated Jest unit tests verifying that font scaling calculations produce mathematically bounded values across extreme FOV angles and distance limits.

---

## Key Technical Decisions & Innovations

### 1. Discovery of `z_max` as the Optimal Autoscaling Variable
Earlier prototypes attempted to scale viewport labels using either the camera distance or the bounding box diagonal. However, when users zoomed in while adjusting camera tilt, the labels either collapsed or expanded exponentially. Aryan proved mathematically that scaling font sprites inversely relative to `z_max` maintains visual legibility across deep frustums, ensuring text remains crisp and readable regardless of viewing angle.

### 2. Streamlining Git Collaboration
Adopting interactive rebasing ensured that multi-commit feature explorations were condensed into meaningful, atomic commits before merging into protected branches.

---

## Technologies Utilized

- **Three.js & WebGL**: Frustum calculations, text sprite generation, vector transformations, dynamic render loop updates.
- **React 18 & TypeScript**: State management for user input toggles and typed mathematical utilities.
- **Jest**: Unit testing for 3D coordinate scaling and optical distance calculations.
- **Git**: Advanced interactive rebasing (`git rebase -i`), conflict resolution, branch cleanup.
