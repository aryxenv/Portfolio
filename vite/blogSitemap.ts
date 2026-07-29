import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";

const POSTS_DIR = "src/components/Blog/posts";
const MARKER = "<!-- BLOG_POSTS -->";
const SITE = "https://aryxenv.dev";

function slugify(title: string) {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readField(frontmatter: string, key: string) {
  const match = new RegExp(`^${key}:\\s*(.+)$`, "m").exec(frontmatter);
  if (!match) return undefined;

  try {
    return JSON.parse(match[1].trim()) as unknown;
  } catch {
    return match[1].trim().replace(/^["']|["']$/g, "");
  }
}

function readPosts() {
  let folders: string[];

  try {
    folders = readdirSync(POSTS_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch {
    return [];
  }

  return folders.flatMap((folder) => {
    let source: string;

    try {
      source = readFileSync(join(POSTS_DIR, folder, "post.md"), "utf8");
    } catch {
      return [];
    }

    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)?.[1];
    if (!frontmatter) return [];

    const title = readField(frontmatter, "title");
    if (typeof title !== "string" || !title) return [];

    const date = readField(frontmatter, "date") as
      | { year?: string; month?: string; day?: string }
      | string
      | undefined;

    const lastmod =
      typeof date === "string"
        ? date
        : date?.year && date?.month && date?.day
          ? [
              String(date.year).padStart(4, "0"),
              String(date.month).padStart(2, "0"),
              String(date.day).padStart(2, "0"),
            ].join("-")
          : "";

    return [{ slug: slugify(title), lastmod }];
  });
}

/**
 * Rewrites the BLOG_POSTS marker in the copied sitemap with one entry per post
 * folder, so publishing a post never means editing the sitemap by hand.
 */
export function blogSitemap(): Plugin {
  return {
    name: "blog-sitemap",
    apply: "build",
    closeBundle() {
      const sitemapPath = join("dist", "sitemap.xml");

      let sitemap: string;

      try {
        sitemap = readFileSync(sitemapPath, "utf8");
      } catch {
        return;
      }

      if (!sitemap.includes(MARKER)) return;

      const posts = readPosts().sort((a, b) =>
        b.lastmod.localeCompare(a.lastmod),
      );

      const entries = posts
        .map(({ slug, lastmod }) =>
          [
            "    <url>",
            `        <loc>${SITE}/blog/${slug}</loc>`,
            lastmod ? `        <lastmod>${lastmod}</lastmod>` : "",
            "        <priority>0.7</priority>",
            "    </url>",
          ]
            .filter(Boolean)
            .join("\n"),
        )
        .join("\n\n");

      writeFileSync(sitemapPath, sitemap.replace(MARKER, entries.trimStart()));
      this.info(`sitemap: added ${posts.length} blog post(s)`);
    },
  };
}
