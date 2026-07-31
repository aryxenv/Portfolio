# Copilot Instructions — Aryan Shah Portfolio

## Project

A personal portfolio built with **Astro 7, React 19 (islands only), and TypeScript**. Five sections (Home, About, Experience, Projects, Contact) render as a single scrolling page at `/`, with nine self-hosted static demo apps served from `public/`. A blog lives alongside it on real routes — `/blog` for the index and `/blog/<slug>` for a post.

Every page is prerendered to static HTML. The only React that reaches the browser is `src/islands/ShaderBackground.tsx` (`client:only="react"`); everything else interactive is a small vanilla TypeScript module under `src/lib/` loaded by an inline `<script>`. **Do not reach for a React island** unless the thing genuinely needs component state — a `.astro` component plus a `lib/` script is the default, and it is what keeps the payload small.

Commands: `npm run dev` (`astro dev`) · `npm run build` (`astro check && astro build`) · `npm run preview` · `npm run lint` · `npm run format`

### Structure

```
src/
├─ components/
│  ├─ layout/     Navbar (.astro + .css)
│  ├─ sections/   Home, About, Experience, Projects, Contact (.astro + .css)
│  ├─ blog/       PostCard, PostNav
│  ├─ ui/         ProjectCard, TechChip, Marquee, VerticalRail, Reveal, Emphasis
│  └─ icons/      Icon.astro + paths.ts   ← one inline-SVG registry, no icon package
├─ content/blog/<folder>/index.md + assets/
├─ content.config.ts
├─ data/          projects, experience, socials, nav, tech-stack, demos
├─ islands/       ShaderBackground.tsx    ← the only React island
├─ layouts/       BaseLayout.astro        ← head, perf script, gtag, ClientRouter
├─ lib/           navbar, reveal, scroll, smooth-scroll, perf-mode, tech-switcher,
│                 copy-button, emphasis, slugify, posts, markdown/*
├─ pages/         index, blog/index, blog/[...slug], 404, sitemap.xml.ts
└─ styles/        tokens, reset, base, layout, motion, global, blog/*
```

## Writing a blog post

Create `src/content/blog/<folder>/index.md`. Nothing else is registered — the `glob()` loader in `src/content.config.ts` picks it up and `src/pages/sitemap.xml.ts` adds it to `dist/sitemap.xml`.

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

- **Frontmatter values are JSON**, one key per line — which is also valid YAML, so Astro parses it natively. `title` is the only required field.
- **The slug is derived from `title`** — lowercased, non-alphanumeric runs collapsed to dashes (`src/lib/slugify.ts`, wired in via `generateId`). The example above is served at `/blog/transcribing-and-translating-in-realtime-with-ai`. Changing a published title changes its permalink.
- **A leading `# ` heading matching the title is dropped** on render, since the page prints the title from the frontmatter. Use `##` and `###` for sections.
- **Images** go in `<folder>/assets/` and are referenced relatively (`./assets/x.png`). Astro's image pipeline optimizes them to `.webp` and stamps intrinsic `width`/`height`; a path that does not resolve fails the build rather than shipping a broken image.
- **A single newline is a line break.** `remark-breaks` is enabled, so the markdown behaves the way a GitHub comment does rather than the way CommonMark does — what you type on two lines renders on two lines. The practical consequence: **do not hard-wrap prose**, write each paragraph as one long line and separate paragraphs with a blank line.
- **Supported syntax** is GFM plus raw HTML: tables, task lists, autolinks, footnotes, `<details>`/`<summary>`, and GitHub alerts (`> [!NOTE]`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`). The pipeline is configured in `astro.config.mjs` and its plugins live in `src/lib/markdown/`; every element it can emit needs a style under `src/styles/blog/`.
- **Code fences are syntax highlighted at build time** — no grammar ships to the browser. Registered: `python`, `typescript`, `javascript`, `markdown`, `ini`, `csharp`, `powershell`, `bash`, `bicep`, `hcl`, `rust`, plus aliases (`py`, `ts`, `js`, `cs`, `md`, `env`, `sh`, `pwsh`, `tf`/`terraform`, `rs`, …). To add a language, import and register it in `src/lib/markdown/highlight-code.ts` — an unregistered fence renders as plain text rather than failing.
- **Headings are linkable.** Each `##`/`###` gets an id derived from its text, so `/blog/<slug>#pros-and-cons` jumps to that section; duplicate headings get `-1`, `-2`, … suffixes. Renaming a heading changes its anchor, so treat a shared section link the same way as a permalink.

> [!IMPORTANT]
> Astro caches rendered collection entries. If a markdown or plugin change appears to have no effect, clear `node_modules/.astro` (or touch `astro.config.mjs`) before concluding the code is wrong.

### Writing a rehype plugin

Any plugin that **wraps** a node — replacing `x` with `<figure><x/></figure>` — must use `replaceElements()` from `src/lib/markdown/hast.ts`. It collects every match before mutating; a naive `walk` + in-place replace re-visits its own output and recurses forever, which surfaces as a silently empty page rather than an error.

## Design Context

**Read `PRODUCT.md` and `DESIGN.md` at the repo root before making any visual or UX change.** They are the source of truth; the summary below is only a pointer.

- **`PRODUCT.md`** — strategic. Register, audience, purpose, brand personality, anti-references, design principles, accessibility bar.
- **`DESIGN.md`** — visual. Design tokens in YAML frontmatter, then the colour, typography, elevation, and component specification.
- **`.impeccable/design.json`** — machine-readable sidecar: tonal ramps, motion tokens, breakpoints, and renderable component snippets.

### The short version

**Register: brand.** Design _is_ the product here. The site exists to convince a skimming recruiter that this person builds real things.

**Creative North Star: "The Instrument Panel."** A black cabin at night with one light source. Hairline-ruled panels floating on a void, lit from behind by a slow electric-blue WebGL reactor the interface itself never touches.

**Non-negotiables:**

- Substrate is exactly `#000000`. No near-black, no charcoal, no tinted neutral.
- One border weight: `1px` via `--border-px`. One radius: `5px` (circles only for dots).
- One typeface: Manrope variable. Hierarchy comes from weight and size alone — do not add a second family.
- **Every font-size is a multiple of the `0.95rem` base unit.** Pick a multiplier, not a pixel value.
- Two-state interaction: `opacity: 0.5` at rest → `1` on contact, over `0.3s ease-out`. That is the whole vocabulary.
- Entrance reveals use the shared token — `8px` over `0.4s ease-out`, stepped by `40ms`. Wrap content in `<Reveal>`; do not hand-write an entrance animation.
- Reactor Blue stays behind glass — shader plane and `::selection` only. Never a fill, border, heading, or gradient.
- Zero `box-shadow`. Depth is opacity and backdrop-blur, never elevation.
- Containers are outlined, never filled. `background-color` on a card occludes the shader.
- Every new always-on animation needs a `html[data-perf="low"]` override **and** a `@media (prefers-reduced-motion: reduce)` alternative in the same change.

**Hard bans:** gradient text (`background-clip: text`), coloured side-stripe borders above 1px, glassmorphism beyond the two existing blurred surfaces, template/SaaS section grammar (hero metric blocks, gradient blobs, uppercase tracked eyebrows, `01 / 02 / 03` markers), badge grids and skill percentage bars.

### Accessibility

Target is **WCAG 2.1 AA**. Standards to hold, documented in `DESIGN.md` §6:

- **One global `:focus-visible` treatment** lives in `src/styles/base.css`. Never reset `outline` in a component — a blanket `outline: none` leaves a control focusable with nothing to show for it.
- **Interactive means `<a>` or `<button>`.** There is no `div` with a click handler left in the codebase; do not add one.
- `src/styles/motion.css` holds the `html[data-perf="low"]` overrides and the `prefers-reduced-motion` block side by side. A new always-on animation needs an entry in both.
- Active nav state and project status are still encoded by colour/opacity alone — give any new instance a non-colour companion.
- Half-light text must be contrast-checked against the brightest frame of the moving shader, not against flat black.

## Conventions

- Conventional Commits for all commit messages.
- Prettier is configured (`.prettierrc`, with `prettier-plugin-astro`); formatting is not a matter of taste here. Run `npm run format`.
- Component styles live in a sibling `.css` file next to the `.astro`, imported by the component. They are **global stylesheets**, so always scope element selectors (`nav`, `ul`, `li`) to the component's own class.
- Design tokens live on `:root` in `src/styles/tokens.css`. Colours are also exposed as decomposed `--primary-r/g/b` channels so components can vary alpha without new tokens — use those rather than adding a colour.
- Icons are inline SVG via `<Icon name="…" />`; add a path to `src/components/icons/paths.ts` rather than installing an icon package.
- Programmatic scrolling goes through `src/lib/scroll.ts` (Lenis-aware) — a raw `window.scrollTo` gets clamped to a stale Lenis limit.
