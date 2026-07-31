import type { APIRoute } from "astro";
import { getDemoPaths } from "../data/demos";
import { getPosts } from "../lib/posts";

/**
 * The sitemap is generated rather than hand-maintained: blog posts come from
 * the content collection and the self-hosted demos from `public/`.
 *
 * `@astrojs/sitemap` is deliberately not used — it emits `sitemap-index.xml`,
 * and `/sitemap.xml` is the path already indexed.
 */
const SITE = "https://aryxenv.dev";
const SITE_LASTMOD = "2026-02-07";

interface Entry {
  path: string;
  lastmod: string;
  priority: string;
}

function url({ path, lastmod, priority }: Entry): string {
  return [
    "  <url>",
    `    <loc>${SITE}${path}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : "",
    `    <priority>${priority}</priority>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

export const GET: APIRoute = async () => {
  const posts = await getPosts();

  const entries: Entry[] = [
    { path: "/", lastmod: SITE_LASTMOD, priority: "1.0" },
    {
      path: "/blog",
      lastmod: posts[0]?.data.date ?? SITE_LASTMOD,
      priority: "0.9",
    },

    ...posts.map((post) => ({
      path: `/blog/${post.id}`,
      lastmod: post.data.date,
      priority: "0.7",
    })),

    // the demo apps served straight out of public/
    ...getDemoPaths().map((path) => ({
      path,
      lastmod: SITE_LASTMOD,
      priority: "0.8",
    })),
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(url),
    "</urlset>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
