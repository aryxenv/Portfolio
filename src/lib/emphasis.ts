const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"]/g, (character) => ESCAPES[character]!);

/**
 * Turns `**keyword**` markers inside a plain string into bold highlights, so
 * data files can emphasise keywords without carrying markup.
 *
 * Input is escaped first — the only HTML this can produce is the `<strong>`.
 */
export function emphasize(text: string): string {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part) =>
      part.startsWith("**") && part.endsWith("**")
        ? `<strong class="highlight">${escapeHtml(part.slice(2, -2))}</strong>`
        : escapeHtml(part),
    )
    .join("");
}
