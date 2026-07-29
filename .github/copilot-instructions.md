# Copilot Instructions — Aryan Shah Portfolio

## Project

A personal portfolio built with React 19, Vite 6, and TypeScript. Five sections (Home, About, Experience, Projects, Contact) render as a single scrolling page at `/`, with nine self-hosted static demo apps served from `public/`. A blog lives alongside it on real routes — `/blog` for the index and `/blog/<slug>` for a post — via `react-router-dom`.

Commands: `npm run dev` · `npm run build` (runs `tsc -b` then `vite build`) · `npm run lint` · `npm run preview`

## Writing a blog post

Create `src/components/Blog/posts/<folder>/post.md`. Nothing else is registered — `import.meta.glob` in `src/components/Blog/BlogData.ts` picks it up, and the `blog-sitemap` Vite plugin adds it to `dist/sitemap.xml`.

```md
---
title: "transcribing and translating in realtime with ai"
description: "One-line summary, used on the card and as the page meta description."
read_time_minutes: "10"
tags: ["foundry", "azure", "openai"]
date: { "year": "2026", "month": "7", "day": "29" }
---

# transcribing and translating in realtime with ai

body...
```

- **Frontmatter values are JSON**, one key per line. `title` is the only required field.
- **The slug is derived from `title`** — lowercased, non-alphanumeric runs collapsed to dashes. The example above is served at `/blog/transcribing-and-translating-in-realtime-with-ai`. Changing a published title changes its permalink.
- **A leading `# ` heading matching the title is dropped** on render, since the page prints the title from the frontmatter. Use `##` and `###` for sections.
- **Images** go in `<folder>/assets/` and are referenced relatively (`./assets/x.png`). An unresolved path is skipped with a dev-console warning rather than rendered broken.
- **A single newline is a line break.** `remark-breaks` is enabled, so the markdown behaves the way a GitHub comment does rather than the way CommonMark does — what you type on two lines renders on two lines. The practical consequence: **do not hard-wrap prose**, write each paragraph as one long line and separate paragraphs with a blank line.
- **Supported syntax** is GFM plus raw HTML: tables, task lists, autolinks, footnotes, `<details>`/`<summary>`, and GitHub alerts (`> [!NOTE]`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`). Rendering goes through `react-markdown` + `remark-gfm` + `remark-breaks` + `rehype-raw` in `BlogContent.tsx`; every element it can emit needs a style in `Blog.css`.

- **Code fences are syntax highlighted.** Registered grammars: `python`, `typescript`, `javascript`, `markdown`, `ini`, `csharp`, `powershell`, `bash`, `bicep`, `hcl`, `rust`, plus aliases (`py`, `ts`, `js`, `cs`, `md`, `env`, `sh`, `pwsh`, `tf`/`terraform`, `rs`, …). To add a language, import and register it in `src/components/Blog/highlightCode.ts` — an unregistered fence renders as plain text rather than failing.
- **Headings are linkable.** Each `##`/`###` gets an id derived from its text, so `/blog/<slug>#pros-and-cons` jumps to that section; duplicate headings get `-1`, `-2`, … suffixes. Renaming a heading changes its anchor, so treat a shared section link the same way as a permalink.

## Design Context

**Read `PRODUCT.md` and `DESIGN.md` at the repo root before making any visual or UX change.** They are the source of truth; the summary below is only a pointer.

- **`PRODUCT.md`** — strategic. Register, audience, purpose, brand personality, anti-references, design principles, accessibility bar.
- **`DESIGN.md`** — visual. Design tokens in YAML frontmatter, then the colour, typography, elevation, and component specification.
- **`.impeccable/design.json`** — machine-readable sidecar: tonal ramps, motion tokens, breakpoints, and renderable component snippets.

### The short version

**Register: brand.** Design *is* the product here. The site exists to convince a skimming recruiter that this person builds real things.

**Creative North Star: "The Instrument Panel."** A black cabin at night with one light source. Hairline-ruled panels floating on a void, lit from behind by a slow electric-blue WebGL reactor the interface itself never touches.

**Non-negotiables:**

- Substrate is exactly `#000000`. No near-black, no charcoal, no tinted neutral.
- One border weight: `1px` via `--border-px`. One radius: `5px` (circles only for dots).
- One typeface: Manrope variable. Hierarchy comes from weight and size alone — do not add a second family.
- **Every font-size is a multiple of the `0.95rem` base unit.** Pick a multiplier, not a pixel value.
- Two-state interaction: `opacity: 0.5` at rest → `1` on contact, over `0.3s ease-out`. That is the whole vocabulary.
- Reactor Blue stays behind glass — shader plane and `::selection` only. Never a fill, border, heading, or gradient.
- Zero `box-shadow`. Depth is opacity and backdrop-blur, never elevation.
- Containers are outlined, never filled. `background-color` on a card occludes the shader.
- Every new always-on animation needs a `html[data-perf="low"]` override **and** a `@media (prefers-reduced-motion: reduce)` alternative in the same change.

**Hard bans:** gradient text (`background-clip: text`), coloured side-stripe borders above 1px, glassmorphism beyond the two existing blurred surfaces, template/SaaS section grammar (hero metric blocks, gradient blobs, uppercase tracked eyebrows, `01 / 02 / 03` markers), badge grids and skill percentage bars.

### Accessibility

Target is **WCAG 2.1 AA**. Known open gaps, documented in `DESIGN.md` §6:

- **No `:focus-visible` styles** outside the navbar and the blog routes, while `outline: none` is set on roughly a dozen components.
- Several navigation affordances (the vertical rails) are `div`s with `onClick` handlers, unreachable by keyboard.
- No `@media (prefers-reduced-motion: reduce)` blocks — the perf-mode toggle is a user preference, not a substitute.
- Active nav state and project status are encoded by colour/opacity alone.
- Half-light text must be contrast-checked against the brightest frame of the moving shader, not against flat black.

Do not introduce new instances of these patterns.

## Conventions

- Conventional Commits for all commit messages.
- Prettier is configured (`.prettierrc`); formatting is not a matter of taste here.
- Component styles live in a sibling `.css` file next to the `.tsx`, imported directly by the component.
- Design tokens live on `:root` in `src/index.css`. Colours are also exposed as decomposed `--primary-r/g/b` channels so components can vary alpha without new tokens — use those rather than adding a colour.
