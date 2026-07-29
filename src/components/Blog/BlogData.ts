/**
 * Posts are markdown files: src/components/Blog/posts/<folder>/post.md, with
 * their images in a sibling assets/ folder. Vite inlines both at build time,
 * so adding a post means adding a folder — no registry to update.
 *
 * Frontmatter (delimited by ---), one key per line, JSON values:
 *
 *   title: "transcribing and translating in realtime with ai"
 *   description: "..."
 *   read_time_minutes: "10"
 *   tags: ["foundry", "azure", "openai"]
 *   date: { "year": "2026", "month": "7", "day": "29" }
 *
 * The slug is the title lowercased with dashes between words, so the post
 * above lives at /blog/transcribing-and-translating-in-realtime-with-ai.
 */

export interface BlogPostEntry {
  slug: string;
  title: string;
  description: string;
  readTimeMinutes: number;
  tags: string[];
  /** ISO date, YYYY-MM-DD */
  date: string;
  /** Markdown body, frontmatter stripped. */
  body: string;
  /** Relative image path as written in the markdown → resolved build URL. */
  assets: Record<string, string>;
}

interface FrontmatterDate {
  year?: string | number;
  month?: string | number;
  day?: string | number;
}

const postFiles = import.meta.glob("./posts/*/post.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const assetFiles = import.meta.glob("./posts/*/assets/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** Title → url slug: lowercase words joined by dashes. */
export function slugify(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseValue(raw: string): unknown {
  const trimmed = raw.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    // unquoted scalar, e.g. `read_time_minutes: 10`
    return trimmed.replace(/^["']|["']$/g, "");
  }
}

function parseFrontmatter(source: string) {
  const match = FRONTMATTER.exec(source);

  if (!match) return { fields: {} as Record<string, unknown>, body: source };

  const fields: Record<string, unknown> = {};

  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator === -1 || !line.trim() || line.trimStart().startsWith("#")) {
      continue;
    }

    fields[line.slice(0, separator).trim()] = parseValue(
      line.slice(separator + 1),
    );
  }

  return { fields, body: source.slice(match[0].length) };
}

function toIsoDate(value: unknown): string {
  if (typeof value === "string" && value.trim()) return value.trim();

  const { year, month, day } = (value ?? {}) as FrontmatterDate;

  if (year === undefined || month === undefined || day === undefined) return "";

  return [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((tag) => tag.trim());
  }
  return [];
}

/**
 * The markdown repeats the title as a top-level heading. The post page already
 * renders it from the frontmatter, so drop it rather than showing it twice.
 */
function stripLeadingTitle(body: string, title: string): string {
  const heading = /^\s*#\s+(.+?)\s*(?:\r?\n|$)/.exec(body);

  if (!heading || slugify(heading[1]) !== slugify(title)) return body;

  return body.slice(heading[0].length).replace(/^\s*\r?\n/, "");
}

/** Maps `./assets/x.png` as written in the markdown to its built URL. */
function collectAssets(postDir: string): Record<string, string> {
  const assets: Record<string, string> = {};

  for (const [path, url] of Object.entries(assetFiles)) {
    if (!path.startsWith(`${postDir}/assets/`)) continue;

    const relative = path.slice(postDir.length + 1);
    assets[relative] = url;
    assets[`./${relative}`] = url;
  }

  return assets;
}

function readPost(path: string, source: string): BlogPostEntry | null {
  const { fields, body } = parseFrontmatter(source);
  const title = typeof fields.title === "string" ? fields.title.trim() : "";

  if (!title) {
    console.warn(`[blog] ${path} has no title in its frontmatter; skipping.`);
    return null;
  }

  const readTime = Number(fields.read_time_minutes);

  return {
    slug: slugify(title),
    title,
    description:
      typeof fields.description === "string" ? fields.description : "",
    readTimeMinutes: Number.isFinite(readTime) && readTime > 0 ? readTime : 0,
    tags: toStringArray(fields.tags),
    date: toIsoDate(fields.date),
    body: stripLeadingTitle(body, title),
    assets: collectAssets(path.slice(0, path.lastIndexOf("/"))),
  };
}

const posts: BlogPostEntry[] = Object.entries(postFiles)
  .map(([path, source]) => readPost(path, source))
  .filter((post): post is BlogPostEntry => post !== null)
  .sort((a, b) =>
    a.date === b.date
      ? a.slug.localeCompare(b.slug)
      : b.date.localeCompare(a.date),
  );

/** Posts newest first. */
export function getBlogPosts(): BlogPostEntry[] {
  return posts;
}

export function getBlogPost(slug: string | undefined) {
  if (!slug) return undefined;
  return posts.find((post) => post.slug === slug);
}

/** The newer and older neighbours of a post, for post-to-post navigation. */
export function getAdjacentPosts(slug: string) {
  const index = posts.findIndex((post) => post.slug === slug);

  return {
    newer: index > 0 ? posts[index - 1] : undefined,
    older:
      index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

export function formatBlogDate(date: string): string {
  if (!date) return "";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
