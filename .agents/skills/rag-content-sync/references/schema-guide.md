# RAG Content Schema & Metadata Guide

This document defines the schema, frontmatter standards, and chunking conventions required for all markdown documents stored in `rag/content/`. It matches the parser implementation in `rag/parser.py` and the architecture defined in `rag/rag_strategy.md`.

---

## 1. Frontmatter Standards

Every markdown document in `rag/content/` must begin with a YAML frontmatter block enclosed in triple dashes (`---`).

### 1.1 Universal Fields (Required Across All Types)

| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `id` | string | Unique document identifier. Used as chunk ID prefix. | `"project-aks-agent-governance"` |
| `title` | string | Formal human-readable title. | `"AKS Agent Governance - Microsoft Agent Framework"` |
| `type` | string | Document type classification. Must match one of: `about`, `project`, `experience`, `blog`, `skills`, `architecture`. | `"project"` |
| `summary` | string | 1–3 sentence abstract summarizing document content. Essential for search snippet generation. | `"Reference architecture deploying Microsoft Agent Framework on AKS with Agent Governance Toolkit sidecars."` |
| `source` | string | Relative path of the original portfolio artifact or source of truth. | `"src/data/projects.ts"` |

---

### 1.2 Type-Specific Metadata Fields

#### Projects (`type: "project"`)
```yaml
---
id: "project-chess-ai-nnue"
title: "Chess AI / NNUE Chessbot"
type: "project"
project_name: "Chess AI / NNUE Chessbot"
status: "green"              # "green" | "orange" | "red" | "none"
category: "AI & Machine Learning"
github_url: "https://github.com/aryxenv/chess-ai"
demo_url: "/nnue-chessbot/"  # Path starting with '/' if self-hosted in public/, or external URL
tech_stack:
  - "Python"
  - "FastAPI"
  - "Astro"
  - "React"
  - "C#"
  - "NNUE"
tags:
  - "chess"
  - "nnue"
  - "neural-network"
  - "lichess"
summary: "Agentic Chess AI featuring a custom NNUE engine and C# PGN pipeline with an interactive web UI and Lichess engine integration."
source: "src/data/projects.ts"
---
```

#### Experience Overviews & Weekly Trackers (`type: "experience"`)
```yaml
---
id: "microsoft-week-26"
title: "Microsoft Solutions Engineer Internship - Week 26 Log"
type: "experience"
company: "Microsoft"
role: "Solutions Engineer Intern (AI Apps / Data)"
category: "Enterprise Cloud & AI"
week_number: 26              # Required for weekly tracker files
date_range: "Jul 2026"       # Or log_date: "2026-07-25"
location: "Zaventem, Belgium · On-site"
tech_stack:
  - "Azure AI Search"
  - "Microsoft Foundry"
  - "FastAPI"
tags:
  - "microsoft"
  - "internship"
  - "solutions-engineer"
nda_redacted: true           # true if proprietary customer names/metrics sanitized
has_external_logs: false
summary: "Week 26 log covering final solution accelerator delivery, customer handoffs, and intern presentation."
source: "src/data/experience.ts"
---
```

#### Blog Posts (`type: "blog"`)
```yaml
---
id: "blog-transcribing-and-translating-in-realtime-with-ai"
title: "Transcribing and Translating in Real-time with AI"
type: "blog"
category: "Realtime Speech & Multimodal AI"
tech_stack:
  - "OpenAI Whisper"
  - "Azure OpenAI Realtime"
  - "WebSockets"
  - "FastAPI"
  - "React"
tags:
  - "speech-to-text"
  - "realtime"
  - "whisper"
  - "translation"
  - "streaming"
summary: "Engineering walkthrough on architecting low-latency bidirectional speech transcription and translation pipelines using WebSockets and Azure AI infrastructure."
source: "src/content/blog/transcribing-and-translating-in-realtime-with-ai/index.md"
---
```

#### About & Biography (`type: "about"`)
```yaml
---
id: "about-bio"
title: "Aryan Shah - Biography, Background & Career Goals"
type: "about"
category: "biography"
location: "Antwerp, Belgium"
education: "Data Science graduate, Thomas More University of Applied Sciences (Magna Cum Laude, 81.98%)"
personal_interests:
  - "Automotive engineering (Life goal: Porsche 918 Spyder by September 2035)"
  - "Financial markets and investing"
  - "Autonomous agentic AI architectures"
tags:
  - "bio"
  - "biography"
  - "aryan-shah"
  - "data-science"
summary: "Comprehensive biography, academic credentials, engineering philosophy, and personal life aspirations of Aryan Shah."
source: "src/components/sections/About.astro"
---
```

---

## 2. Header-Aware Chunking Rules

The RAG parser (`rag/parser.py`) segments documents strictly along Markdown headers up to level 3 (`#`, `##`, `###`).

1. **Semantic H1 Root**:
   - Each file should have a single `# Document Title` at the top of the body (after frontmatter).
2. **H2 Section Boundaries**:
   - Every major conceptual block should start with `## Section Title`.
   - The parser flushes and creates a distinct chunk at each header boundary.
   - Example sections for a project:
     - `## Project Overview`
     - `## Problem Statement & Business Context`
     - `## Architecture & Technical Design`
     - `## Key Technical Features & Implementation Details`
     - `## Results, Metrics & Lessons Learned`
3. **Hierarchical Breadcrumbs**:
   - The parser generates a `header_path` (e.g. `Title > Section > Sub-section`) which is prepended to the chunk text before embedding. This guarantees chunks retain full semantic context even when split.
4. **Code Fence Safety**:
   - Fenced code blocks (```` ``` ```` or `~~~`) are tracked with delimiter length and info-string awareness.
   - Code lines starting with `#` (Python comments, bash comments, C# directives) inside code fences will **never** be misidentified as Markdown headings.
5. **No Heading Trailing Hashes**:
   - If using closing ATX hashes (e.g. `## Section ##`), ensure whitespace precedes them. Programming language headings like `## C# Engine ##` are properly preserved.
6. **Granularity & Chunk Size**:
   - Keep sections focused (typically 100–400 words per section). Avoid massive unbroken text blocks without sub-headers.
