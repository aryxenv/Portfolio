import type { Element, Nodes, Root } from "hast";
import { replaceElements } from "./hast";

function decorate(node: Nodes, insidePre: boolean): void {
  if (node.type === "element") {
    const element = node as Element;

    if (element.tagName === "img") {
      element.properties = {
        ...element.properties,
        className: ["blog-image"],
        loading: "lazy",
        decoding: "async",
      };
    }

    // fenced blocks keep their highlighting markup; only a `code` outside a
    // `pre` is an inline span
    if (element.tagName === "code" && !insidePre) {
      element.properties = {
        ...element.properties,
        className: ["inline-code"],
      };
    }

    if (element.tagName === "a") {
      const href = element.properties?.href;

      if (typeof href === "string" && !/^(\/|#)/.test(href)) {
        element.properties = {
          ...element.properties,
          target: "_blank",
          rel: ["noreferrer", "noopener"],
        };
      }
    }

    if (element.tagName === "pre") insidePre = true;
  }

  if ("children" in node) {
    node.children.forEach((child) => decorate(child, insidePre));
  }
}

/**
 * The small presentational adjustments the prose needs: images and inline code
 * get their class, external links open in a new tab, and tables get a scroll
 * container so a wide one cannot widen the page.
 */
export function rehypeBlogElements() {
  return (tree: Root) => {
    decorate(tree, false);

    replaceElements(
      tree,
      (element) => element.tagName === "table",
      (table) => ({
        type: "element",
        tagName: "div",
        properties: { className: ["blog-table"] },
        children: [table],
      }),
    );
  };
}
