export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; text: string }
  | { type: "code"; label?: string; code: string };

export interface BlogPostEntry {
  id: number;
  slug: string;
  title: string;
  summary: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  tags: string[];
  content: BlogBlock[];
}

/**
 * Newest first. The slug is the public identifier: /blog/<slug>.
 * Keep a slug stable once published — it is the permalink.
 */
export const BlogPostData: BlogPostEntry[] = [
  {
    id: 3,
    slug: "a-blog-without-a-cms",
    title: "A blog without a CMS",
    summary:
      "Why this blog is a typed array in the repo instead of a headless CMS, and what that costs me.",
    date: "2026-07-28",
    tags: ["react router", "typescript", "design systems"],
    content: [
      {
        type: "paragraph",
        text: "A portfolio blog gets maybe one post a month. That is not a content problem, it is a **deployment** problem, and a headless CMS solves the wrong half of it: I would be adding an API, an auth boundary, a rate limit, and a second place where the site can break, all to avoid typing into a file I already have open.",
      },
      {
        type: "paragraph",
        text: "So the posts live in `src/components/Blog/BlogData.ts` as a typed array. Adding one is an object literal and a commit.",
      },
      { type: "heading", text: "What the type buys me" },
      {
        type: "paragraph",
        text: "Content is a discriminated union of blocks rather than a markdown string. That sounds like more work until you notice what it removes: no parser, no sanitiser, no `dangerouslySetInnerHTML`, and no way to author a block the design system has no style for.",
      },
      {
        type: "code",
        label: "BlogData.ts",
        code: 'type BlogBlock =\n  | { type: "paragraph"; text: string }\n  | { type: "heading"; text: string }\n  | { type: "list"; items: string[] }\n  | { type: "quote"; text: string }\n  | { type: "code"; code: string };',
      },
      {
        type: "paragraph",
        text: "If a post wants a callout box or a video embed, I have to add it to the union and style it once. The compiler makes the design review mandatory, which is exactly the friction I want at this scale.",
      },
      { type: "heading", text: "Routing" },
      {
        type: "paragraph",
        text: "The index sits at `/blog` and every post at `/blog/<slug>`, resolved from the same array by slug. Real URLs, not a query string and not a hash — a post has to survive being pasted into a message, and a missing one has to be an honest 404.",
      },
      {
        type: "list",
        items: [
          "The slug is the permalink. Once a post is out, the slug is frozen.",
          "The numeric id is internal — a stable key for ordering and for previous/next.",
          "An unknown slug renders a real not-found panel, not an empty page.",
        ],
      },
      { type: "heading", text: "What it costs" },
      {
        type: "paragraph",
        text: "Every post is a redeploy, and I cannot write one from a phone. Both are fine. The site rebuilds in under ten seconds, and I have never once wanted to write about distributed systems from a train.",
      },
      {
        type: "quote",
        text: "The right amount of infrastructure for a blog nobody has read yet is none.",
      },
    ],
  },
  {
    id: 2,
    slug: "nine-demos-one-domain",
    title: "Nine demos, one domain",
    summary:
      "Every project on this site opens a live build served from the same origin. Here is why I stopped linking to screenshots.",
    date: "2026-05-02",
    tags: ["vite", "hosting", "portfolio"],
    content: [
      {
        type: "paragraph",
        text: "A recruiter gives a portfolio well under a minute. In that minute a screenshot proves nothing — it proves I can take a screenshot. A link to a repository is worse: it asks someone who may not read code to evaluate code.",
      },
      {
        type: "paragraph",
        text: "So every project card on this site opens a **running build**, served from `public/` on this domain. No cold-start free tier, no third-party host that sleeps, no README as the primary artefact.",
      },
      { type: "heading", text: "How it works" },
      {
        type: "paragraph",
        text: "Each demo is a static build dropped into its own folder under `public/`. Vite copies that tree verbatim into `dist/`, so `aryxenv.dev/weather-web/` is a real directory of real files rather than a route this app has to know about.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Build the demo in its own repository.",
          "Copy the output into `public/<demo-name>/`.",
          "Reference it from the project card and the sitemap.",
        ],
      },
      {
        type: "paragraph",
        text: "The tradeoff is that the demos do not share this site's dependency tree, so an upgrade here can never break one of them. That isolation is the point.",
      },
      { type: "heading", text: "What I would change" },
      {
        type: "paragraph",
        text: "The copy step is manual, and manual steps rot. The next version pulls each demo in at build time from its own repository, so a fix upstream reaches the portfolio without me remembering to move a folder.",
      },
    ],
  },
  {
    id: 1,
    slug: "perf-mode-kill-switch",
    title: "A kill switch for the background",
    summary:
      "This site renders a WebGL shader behind everything. It also ships one button that removes it entirely — and that button is the design statement.",
    date: "2026-03-14",
    tags: ["performance", "react", "webgl"],
    content: [
      {
        type: "paragraph",
        text: "There is an animated shader plane behind every section of this site. It costs a GPU context, a permanent render loop, and about a megabyte of JavaScript. On a recruiter's four-year-old phone that is not atmosphere, it is a **tax**.",
      },
      {
        type: "paragraph",
        text: "The navbar has a bolt icon that turns the whole thing off. It is not buried in a settings page, because it is not a setting — it is the clearest statement on the site about how I think.",
      },
      { type: "heading", text: "What low-perf mode actually does" },
      {
        type: "list",
        items: [
          "Unmounts the shader, releasing the WebGL context instead of hiding it.",
          "Tears down the Lenis smooth-scroll loop, so nothing runs every frame.",
          "Sets Framer Motion's `reducedMotion` to `always`.",
          "Strips every marquee, pulse, and `backdrop-filter` through one attribute selector.",
        ],
      },
      {
        type: "paragraph",
        text: 'That last one matters more than it looks. The whole CSS side hangs off `html[data-perf="low"]`, so switching modes is a single attribute write — no re-render, no class juggling across a dozen components.',
      },
      { type: "heading", text: "Applying it before first paint" },
      {
        type: "paragraph",
        text: "Reading the preference in React is too late: the shader would mount, paint, and vanish. A four-line inline script in `index.html` reads `localStorage` and sets the attribute before the bundle is even requested.",
      },
      {
        type: "code",
        label: "index.html",
        code: 'var pref = localStorage.getItem("perfMode");\ndocument.documentElement.dataset.perf =\n  pref === "low" ? "low" : "high";',
      },
      {
        type: "paragraph",
        text: "It is the same trick every dark-mode implementation uses, applied to a heavier decision. Cheap, unglamorous, and the difference between a preference and a flash of the thing you asked not to see.",
      },
      {
        type: "quote",
        text: "Graceful degradation is not a fallback. It is the part of the work that says I thought about the person on the other end.",
      },
    ],
  },
];

/** Posts newest first, by date then id. */
export function getBlogPosts(): BlogPostEntry[] {
  return [...BlogPostData].sort((a, b) =>
    a.date === b.date ? b.id - a.id : b.date.localeCompare(a.date),
  );
}

export function getBlogPost(
  slug: string | undefined,
): BlogPostEntry | undefined {
  if (!slug) return undefined;
  return BlogPostData.find((post) => post.slug === slug);
}

/** The newer and older neighbours of a post, for post-to-post navigation. */
export function getAdjacentPosts(slug: string) {
  const posts = getBlogPosts();
  const index = posts.findIndex((post) => post.slug === slug);

  return {
    newer: index > 0 ? posts[index - 1] : undefined,
    older:
      index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

export function blogReadingMinutes(post: BlogPostEntry): number {
  const words = post.content.reduce((total, block) => {
    const text =
      block.type === "list"
        ? block.items.join(" ")
        : block.type === "code"
          ? block.code
          : block.text;

    return total + text.trim().split(/\s+/).length;
  }, 0);

  return Math.max(1, Math.round(words / 200));
}

export function formatBlogDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
