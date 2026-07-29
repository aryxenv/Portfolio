# Product

## Register

brand

## Users

**Primary: recruiters and hiring managers.** They arrive from a CV link, a LinkedIn profile, or a search, usually with a shortlist of other candidates open in adjacent tabs. They are skimming, often on a phone, and they give the page well under a minute before deciding whether Aryan is worth a conversation. They are not all technical — some are, most are screening for signal.

**Secondary: Microsoft colleagues and internal partners** (credibility inside the org), **fellow engineers** (who read the code and the demos, not the copy), and **prospective clients or freelance leads**.

The job to be done is the same for all of them: *decide, quickly and confidently, whether this person can build real things.* Everything on the page exists to make that decision easy and to make the answer yes.

## Product Purpose

A personal portfolio for **Aryan Shah** — Data Science graduate (Thomas More University of Applied Sciences), Solutions Engineer Intern (Applications + AI/ML) at Microsoft, based in Antwerp, Belgium.

It exists to land the next role. It does that by carrying four outcomes at once, none of which can be traded away for the others:

1. **Conversion** — the CV is downloadable and the contact route is obvious.
2. **Proof** — nine self-hosted, clickable demos live under `public/`; the work is playable, not described.
3. **Memorability** — a visitor should be able to describe this site to someone else a day later.
4. **Positioning** — the Azure AI, agentic, and full-stack specialism reads clearly, not as a generic "full-stack dev" blur.

Success looks like an inbound email or a CV download from someone who was undecided when they arrived.

## Brand Personality

**Precise, technical, understated.**

The voice is first-person, plain, and specific. It states what was built and where it runs; it does not sell. Adjectives are earned by a link. There is no hype vocabulary, no "passionate about," no exclamation-driven enthusiasm standing in for evidence.

Emotionally, the target is *quiet confidence*. A visitor should feel that the person behind this is careful — that the same attention visible in a 1px border and a smooth scroll is what they would bring to a codebase. The site should never feel like it is trying hard, but it must obviously *be* hard to make.

## Anti-references

- **The generic template portfolio.** The Framer / Notion / Astro-theme look: a purchased or forked layout where the structure, the section order, and the component vocabulary all came with the theme. This is the single anti-reference that matters most — if a visitor could plausibly guess "he bought this," the site has failed at its primary job of proving he can build.
- **SaaS landing-page grammar.** Hero metric blocks, gradient blobs, three identical feature cards with rounded icons, tiny uppercase tracked eyebrows above every section, numbered `01 / 02 / 03` section markers.
- **The scroll-jacked showreel.** Over-animated one-pagers where motion is applied uniformly to every section as a reflex rather than because a specific reveal earned it.
- **The dev-resume wall.** Dense badge grids, skill percentage bars, and undifferentiated lists of every technology ever touched.

## Design Principles

1. **Proof over claims.** Every assertion is backed by something clickable. The nine live demos are the argument; copy exists to frame them, never to replace them. If a section can be replaced by a link to a working thing, replace it.

2. **Restraint is the flex, but undesigned is not understated.** "Precise, technical, understated" only reads as confidence when the execution is flawless. Sparse and careless looks identical to sparse and deliberate from the outside — the difference is in the details, so the details are not optional.

3. **Legible in thirty seconds.** A recruiter skims. Name, role, specialism, and the strongest piece of work must land before the first scroll completes. Depth is available below; nothing important hides there.

4. **The machine is part of the message.** Performance, smoothness, and graceful degradation are evidence of engineering judgment, not decoration. The perf-mode toggle that drops the WebGL shader is a design statement about respecting the visitor's device — treat that class of decision as a feature, not a fallback.

5. **Nothing off the shelf.** If a component looks like it shipped with the framework or the theme, it is wrong. Default styling anywhere is a bug, because the entire premise of the page is that this person builds things deliberately.

## Accessibility & Inclusion

**Target: WCAG 2.1 Level AA.**

- **Contrast.** Body text ≥ 4.5:1, large text ≥ 3:1 — measured against the *animated shader background*, not against flat black. The moving blue gradient is the real backdrop and it changes luminance over time, so muted and half-opacity white text must be verified in the worst-case frame, not the best one.
- **Keyboard.** Every interactive element must be reachable and operable by keyboard. Clickable `div`s and `img`s driving navigation need to become real buttons or links. A visible `:focus-visible` style is required everywhere; there is currently none in the codebase.
- **Motion.** `prefers-reduced-motion: reduce` must be honoured independently of the perf-mode toggle — the toggle is a user preference, the media query is an accessibility requirement, and a visitor who never touches the toggle still deserves the reduced experience. Applies to the marquees, the gradient shimmer, Lenis smooth scroll, and every Framer Motion reveal.
- **Content visibility.** Reveal animations must enhance an already-visible default. Nothing may be gated behind a scroll-triggered transition, so the page stays complete for screen readers, headless renderers, and background tabs.
- **Colour independence.** Active navigation state and project status must never be signalled by colour or opacity alone.
- **Semantics.** Meaningful images carry real alt text; decorative ones (the shader canvas, the logo mark) stay `aria-hidden`.
