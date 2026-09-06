# Portfolio Source-to-Target Mapping

This reference maps source files across the portfolio repository to their corresponding markdown representations within `rag/content/`. Use this mapping to locate authoritative data when auditing or updating RAG documents.

---

## 1. Mapping Table

| Portfolio Source Path | Primary RAG Destination | Content Type | Key Information Captured |
| :--- | :--- | :--- | :--- |
| `src/data/projects.ts` | `rag/content/projects/<slug>.md` | `project` | Project title, description, GitHub link, demo link (`websiteLink`), status badge, tech stack, architectural details. |
| `src/data/experience.ts` | `rag/content/experience/<company>/overview.md` | `experience` | Company metadata, role titles, date ranges, locations, core achievement bullet points. |
| Weekly Tracker Logs (internal / internship) | `rag/content/experience/<company>/week-*.md` | `experience` | Granular sprint-by-sprint technical tasks, hurdles overcome, enterprise architectures built, customer engagements. |
| `src/content/blog/<slug>/index.md` | `rag/content/blog/<slug>.md` | `blog` | In-depth engineering write-ups, code snippets, architectural diagrams, benchmarking results. |
| `src/data/tech-stack.ts` | `rag/content/about/skills.md` | `skills` | 38+ technology items, categorized into 5 tiers (Frontend, Backend, AI/ML & Agents, Cloud & DevOps, Data & Systems). |
| `cv/certs/` | `rag/content/about/skills.md` | `skills` | Official Microsoft and GitHub certifications (AI-102, AI-900, DP-900, AZ-900, GH-600, GH-300, GH-900). |
| `src/components/sections/About.astro`, `PRODUCT.md`, `cv/aryan_shah.pdf` | `rag/content/about/bio.md` | `about` | Full legal identity, education history (Thomas More Magna Cum Laude, grades), languages, engineering philosophy, personal goals (Porsche 918 Spyder). |
| `src/components/sections/Contact.astro`, `src/data/socials.ts` | `rag/content/about/contact.md` | `about` | Email addresses, LinkedIn, GitHub, social channels, communication preferences, geographic availability. |

---

## 2. Section Audit Scoping Conventions

When the user specifies a section to focus on, use the mapping below to determine which files to inspect:

### Section: `projects`
- **Source**: `src/data/projects.ts`, `public/` (self-hosted demos), `src/pages/`
- **Destination**: `rag/content/projects/`
- **Audit criteria**:
  - Verify every active project in `projects.ts` (id 1 to 9, excluding the "See more..." placeholder) has a matching file in `rag/content/projects/`.
  - Verify `github_url`, `demo_url`, and `status` in frontmatter match the TypeScript data.
  - Verify markdown bodies describe architectural details, challenges, and implementation rather than single-sentence summaries.

### Section: `blog`
- **Source**: `src/content/blog/`
- **Destination**: `rag/content/blog/`
- **Audit criteria**:
  - Verify every directory in `src/content/blog/` that has an `index.md` is mirrored in `rag/content/blog/<slug>.md`.
  - Check frontmatter consistency (`id`, `title`, `tags`, `tech_stack`, `summary`).
  - Strip local Astro-specific component imports or JSX elements if any, keeping pure standard Markdown for vector parsing.

### Section: `experience`
- **Source**: `src/data/experience.ts`, `cv/`
- **Destination**: `rag/content/experience/<company>/`
- **Audit criteria**:
  - Verify both `microsoft` and `pickit-3d` have an `overview.md` capturing all role descriptions from `experience.ts`.
  - Check that date ranges, titles, and locations are up-to-date.
  - For weekly trackers, verify sequential completeness (weeks 1–26 for Microsoft, weeks 1–11 for Pickit 3D) and that `week_number` frontmatter is populated.

### Section: `about`
- **Source**: `src/data/tech-stack.ts`, `src/data/socials.ts`, `src/components/sections/About.astro`, `cv/certs/`
- **Destination**: `rag/content/about/` (`bio.md`, `skills.md`, `contact.md`)
- **Audit criteria**:
  - `skills.md`: Ensure all technologies in `src/data/tech-stack.ts` and all certifications in `cv/certs/` are represented.
  - `bio.md`: Ensure education, graduation honors, personal goals, and contact links reflect the latest portfolio status.
  - `contact.md`: Ensure handles match `src/data/socials.ts`.

---

## 3. Formatting Transformations

When transforming portfolio TypeScript/Astro data into RAG Markdown:
1. **Highlight Markers**: In `projects.ts` and `experience.ts`, markdown bold markers like `**FastAPI**` or `**Kubernetes**` can be retained as standard markdown emphasis.
2. **Demo Links**: Relative paths like `/nnue-chessbot/` or `/anime-waiting-room/` should be placed directly in `demo_url` frontmatter as `/path/` strings.
3. **NDA Redaction**: When documenting proprietary enterprise engagements in experience logs, set `nda_redacted: true` in frontmatter and replace sensitive client company names with generic industry descriptors (e.g., "a leading European rail operator", "a multinational manufacturing enterprise").
