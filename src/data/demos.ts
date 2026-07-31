/**
 * Pages under `public/` that are served but deliberately not published in the
 * sitemap. `/start/` is a personal browser start page, not a portfolio piece.
 */
const UNLISTED = new Set(["start"]);

/**
 * The self-hosted demo apps: every folder under `public/` that serves its own
 * `index.html`. Discovered at build time so adding a demo is just adding a
 * folder — there is no list to keep in sync.
 *
 * Paths keep their trailing slash: those URLs are already indexed.
 */
export function getDemoPaths(): string[] {
  const found = import.meta.glob("/public/*/index.html", { eager: false });

  return Object.keys(found)
    .map((file) => file.split("/")[2]!)
    .filter((name) => !UNLISTED.has(name))
    .sort()
    .map((name) => `/${name}/`);
}
