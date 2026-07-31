import type { Element, Root } from "hast";
import { textContent, walk } from "./hast";

const HEADINGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

function anchor(id: string): Element {
  return {
    type: "element",
    tagName: "a",
    properties: {
      className: ["blog-heading-anchor"],
      href: `#${id}`,
      "aria-label": "Link to this section",
    },
    children: [
      {
        type: "element",
        tagName: "span",
        properties: { "aria-hidden": "true" },
        children: [{ type: "text", value: "#" }],
      },
    ],
  };
}

/**
 * Gives every heading a stable id derived from its text plus a permalink
 * affordance, so a section can be linked directly. These ids are public URLs —
 * renaming a heading changes its anchor.
 *
 * Astro's own heading-id plugin runs after this one and leaves existing ids
 * alone, so these win.
 */
export function rehypeHeadingAnchors() {
  return (tree: Root) => {
    const used = new Map<string, number>();
    const headings: Element[] = [];

    walk(tree, (node) => {
      if (node.type === "element" && HEADINGS.has(node.tagName)) {
        headings.push(node);
      }
    });

    for (const heading of headings) {
      const base =
        textContent(heading)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || "section";

      // repeated headings ("usage" appears twice) get -1, -2, … like GitHub
      const seen = used.get(base) ?? 0;
      used.set(base, seen + 1);

      const id = seen === 0 ? base : `${base}-${seen}`;

      heading.properties = {
        ...heading.properties,
        id,
        className: ["blog-heading"],
      };
      heading.children.push(anchor(id));
    }
  };
}
