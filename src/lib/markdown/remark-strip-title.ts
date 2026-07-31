import type { Heading, Root as MdRoot } from "mdast";
import type { VFile } from "vfile";
import { slugify } from "../slugify";

interface AstroVFileData {
  astro?: { frontmatter?: Record<string, unknown> };
}

/**
 * Posts repeat their title as a top-level heading; the page already prints it
 * from the frontmatter, so drop it rather than showing it twice.
 */
export function remarkStripTitle() {
  return (tree: MdRoot, file: VFile) => {
    const title = (file.data as AstroVFileData).astro?.frontmatter?.title;
    if (typeof title !== "string") return;

    const first = tree.children[0];
    if (first?.type !== "heading" || (first as Heading).depth !== 1) return;

    const text = first.children
      .map((child) => ("value" in child ? child.value : ""))
      .join("");

    if (slugify(text) === slugify(title)) tree.children.shift();
  };
}
