import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;

/** Every post, newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("blog");

  return posts.sort((a, b) =>
    a.data.date === b.data.date
      ? a.id.localeCompare(b.id)
      : b.data.date.localeCompare(a.data.date),
  );
}

/** The newer and older neighbours of a post, for post-to-post navigation. */
export function getAdjacentPosts(posts: Post[], id: string) {
  const index = posts.findIndex((post) => post.id === id);

  return {
    newer: index > 0 ? posts[index - 1] : undefined,
    older:
      index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

export function formatPostDate(date: string): string {
  if (!date) return "";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** The `12 March 2026 · 10 min read · azure · openai` line under a title. */
export function postMeta(post: Post, includeTags = false): string {
  const { date, read_time_minutes: readTime, tags } = post.data;

  return [
    formatPostDate(date),
    readTime > 0 ? `${readTime} min read` : "",
    includeTags && tags.length > 0 ? tags.join(" · ") : "",
  ]
    .filter(Boolean)
    .join(" · ");
}
