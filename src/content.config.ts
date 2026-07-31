import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { slugify } from "./lib/slugify";

/**
 * Posts are markdown files: src/content/blog/<folder>/index.md, with their
 * images in a sibling assets/ folder referenced relatively (`./assets/x.png`).
 * Adding a post means adding a folder — there is no registry to update.
 *
 * Frontmatter, one key per line:
 *
 *   title: "transcribing and translating in realtime with ai"
 *   description: "..."
 *   read_time_minutes: "10"
 *   tags: ["foundry", "azure", "openai"]
 *   date: { "year": "2026", "month": "7", "day": "29" }
 *
 * The slug is the title lowercased with dashes between words, so the post
 * above is served at /blog/transcribing-and-translating-in-realtime-with-ai.
 * Renaming a published title changes its permalink.
 */
const parts = z.union([z.string(), z.number()]);

const pad = (value: string | number, length: number) =>
  String(value).padStart(length, "0");

const blog = defineCollection({
  loader: glob({
    pattern: "**/index.md",
    base: "./src/content/blog",
    generateId: ({ data }) => slugify(String(data.title)),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(""),
    read_time_minutes: z.coerce.number().nonnegative().default(0),
    tags: z.array(z.string()).default([]),
    /** Collapsed to an ISO `YYYY-MM-DD` string; empty when unset. */
    date: z
      .object({ year: parts, month: parts, day: parts })
      .optional()
      .transform((value) =>
        value
          ? [pad(value.year, 4), pad(value.month, 2), pad(value.day, 2)].join(
              "-",
            )
          : "",
      ),
  }),
});

export const collections = { blog };
