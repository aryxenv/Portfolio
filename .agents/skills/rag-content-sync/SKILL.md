---
name: rag-content-sync
description: >-
  Use when the user wants to audit, synchronize, or update content in rag/content/
  against the portfolio codebase (projects, blog posts, work experience, tech stack,
  or biography). Supports full audits and scoped section audits. Requires explicit
  user confirmation before writing or updating any files in rag/content/.
---

# RAG Content Synchronization Skill

This skill governs the process of keeping Aryan Shah's Portfolio RAG content store (`rag/content/`) aligned, complete, and synchronized with authoritative portfolio data (`src/data/`, `src/content/`, `src/components/`, and `cv/`).

> [!CRITICAL]
> **Strict User Confirmation Gate**: Never modify, create, or delete files in `rag/content/` without presenting the proposed changes, diffs, and chunk schema to the user and obtaining explicit approval.

---

## Quick Reference & Playbooks

- **[Schema & Metadata Guide](references/schema-guide.md)**: YAML frontmatter definitions, field standards per type, and header chunking rules.
- **[Source-to-Target Mapping](references/source-mapping.md)**: Authoritative sources in the portfolio mapped to corresponding RAG content documents.
- **[Audit Script](scripts/audit_gaps.py)**: Automated gap detection and schema validation script.

---

## Synchronization Workflow

```text
User Request
     │
     ▼
[ Step 1: Scope Resolution ] ── (All vs. Scoped Section: projects | blog | experience | about | target)
     │
     ▼
[ Step 2: Gap & Schema Audit ] ── (Run audit_gaps.py script)
     │
     ▼
[ Step 3: Source Truth Inspection ] ── (Inspect src/data, src/content, cv/ vs rag/content)
     │
     ▼
[ Step 4: Candidate Preparation ] ── (Draft YAML frontmatter + H1/H2/H3 body)
     │
     ▼
┌────────────────────────────────────────────────────────┐
│  STEP 5: EXPLICIT USER CONFIRMATION GATE (MANDATORY)   │
│  - Present findings table & diff proposal              │
│  - STOP and request explicit user confirmation         │
└────────────────────────────────────────────────────────┘
     │
     ▼ (Once user confirms)
[ Step 6: Write Updates to rag/content/ ]
     │
     ▼
[ Step 7: Dry-Run Indexer Verification ] ── (uv run ci_index.py --dry-run)
```

---

## Step-by-Step Procedure

### Step 1: Target Scope Resolution
Determine if the user's prompt targets a specific section or the entire portfolio:
- **`projects`**: Only audit `src/data/projects.ts` vs `rag/content/projects/*.md`.
- **`blog`**: Only audit `src/content/blog/` vs `rag/content/blog/*.md`.
- **`experience`**: Only audit `src/data/experience.ts` vs `rag/content/experience/<company>/`.
- **`about`**: Only audit `src/data/tech-stack.ts`, `cv/certs/`, and `About.astro` vs `rag/content/about/` (`bio.md`, `skills.md`, `contact.md`).
- **Specific File**: Focus strictly on the designated file (e.g. `rag/content/projects/chess-ai-nnue.md`).
- **Unspecified / All**: Perform a comprehensive audit across all sections.

---

### Step 2: Run Automated Gap & Schema Audit
Execute the audit script from the repository root, passing the target section if scoped:

```bash
# For full audit
python .agents/skills/rag-content-sync/scripts/audit_gaps.py

# For a scoped section
python .agents/skills/rag-content-sync/scripts/audit_gaps.py --section projects
python .agents/skills/rag-content-sync/scripts/audit_gaps.py --section blog
python .agents/skills/rag-content-sync/scripts/audit_gaps.py --section experience
python .agents/skills/rag-content-sync/scripts/audit_gaps.py --section about

# For a single file or target directory
python .agents/skills/rag-content-sync/scripts/audit_gaps.py --target rag/content/projects/aks-agent-governance.md
```

Analyze the output for:
- `MISSING`: Portfolio items that have no corresponding markdown file in `rag/content/`.
- `INCOMPLETE`: Documents missing architectural details, having brief bodies (< 50 words), or missing required frontmatter attributes.
- `OUTDATED / MISMATCH`: Discrepancies between source links, live demo routes (`websiteLink`), or status badges (`status`).

---

### Step 3: Inspect Authoritative Source Truth
Examine the relevant source files according to [references/source-mapping.md](references/source-mapping.md):
- **Projects**: Inspect `src/data/projects.ts` and any self-hosted demos under `public/`.
- **Blog**: Inspect `src/content/blog/<slug>/index.md`.
- **Experience**: Inspect `src/data/experience.ts` and relevant week logs.
- **Skills**: Inspect `src/data/tech-stack.ts` and `cv/certs/*.pdf`.
- **Bio & Identity**: Inspect `src/components/sections/About.astro`, `cv/aryan_shah.pdf`, and `PRODUCT.md`.

---

### Step 4: Prepare Proposed Changes
Format all proposed content strictly following [references/schema-guide.md](references/schema-guide.md):
1. **YAML Frontmatter**: Include all universal fields (`id`, `title`, `type`, `summary`, `source`) plus type-specific fields (`github_url`, `demo_url`, `tech_stack`, `tags`, `status`, `company`, `role`, `week_number`).
2. **Chunking Structure**:
   - Level 1 heading (`# Document Title`) matching `title` frontmatter.
   - Distinct Level 2 headings (`## ...`) defining meaningful semantic chunk boundaries (100–400 words per section).
   - Clean code fences (triple backticks) with info strings (`python`, `bash`, `typescript`).

---

### Step 5: User Confirmation Gate (MANDATORY)

> [!WARNING]
> You **MUST NOT** edit or write files in `rag/content/` during this step. Present the proposal and pause.

Present the proposal to the user in the following structured format:

1. **Audit Scope**: State the scope inspected (e.g. `Section: projects` or `Full Portfolio`).
2. **Summary of Findings**: List any missing files, missing fields, or discrepancies found.
3. **Proposed Action Plan**: Table of affected files:
   | Action | File Path | Reason / Changes |
   | :--- | :--- | :--- |
   | `NEW` | `rag/content/...` | Add missing entry for ... |
   | `MODIFY` | `rag/content/...` | Synchronize demo_url / update tech stack |
4. **Proposed Content / Diff**: Provide the exact YAML frontmatter and section outline for each file to be created or modified.
5. **Call to Action**: Ask the user:
   > *"Would you like me to proceed with applying these updates to `rag/content/`?"*

Stop calling modifying tools and await the user's explicit approval.

---

### Step 6: Apply Approved Updates
Upon receiving explicit confirmation:
- Use `write_to_file` to create new files or `replace_file_content` to update existing documents.
- Ensure file encoding is UTF-8 without stray characters or broken frontmatter fences.

---

### Step 7: Verify via Dry-Run Indexer
After applying updates, run the dry-run parser to verify that the chunks are generated correctly and that there are no schema violations:

```bash
# In the rag/ directory:
uv run ci_index.py --dry-run --files content/<path-to-updated-file>.md

# Or verify all modified documents:
uv run ci_index.py --dry-run
```

Check the command output:
- Confirm all updated files are successfully parsed into chunks.
- Confirm total chunk count increased or updated as expected.
- Ensure no warnings or errors were emitted.
- Report the final verification results to the user.
