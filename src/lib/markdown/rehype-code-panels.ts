import type { Element, ElementContent, Root } from "hast";
import { replaceElements, textContent } from "./hast";
import { highlightCode } from "./highlight-code";

function language(code: Element | undefined): string {
  const className = code?.properties?.className;
  const names = Array.isArray(className) ? className.map(String) : [];
  const match = names.find((name) => name.startsWith("language-"));

  return match ? match.slice("language-".length) : "";
}

function copyButton(): Element {
  return {
    type: "element",
    tagName: "button",
    properties: {
      type: "button",
      className: ["blog-copy"],
      "aria-label": "Copy code",
      "data-copy": "",
    },
    children: [
      {
        type: "element",
        tagName: "span",
        properties: { className: ["blog-copy-icon"], "aria-hidden": "true" },
        children: [
          {
            type: "element",
            tagName: "i",
            properties: { className: ["bx", "bx-copy"] },
            children: [],
          },
          {
            type: "element",
            tagName: "i",
            properties: { className: ["bx", "bx-check"] },
            children: [],
          },
        ],
      },
      {
        type: "element",
        tagName: "span",
        properties: { className: ["visually-hidden"], "aria-live": "polite" },
        children: [],
      },
    ],
  };
}

/** Rewrites one `<pre>` into the labelled, highlighted panel. */
function panel(pre: Element): Element {
  const code = pre.children.find(
    (child): child is Element =>
      child.type === "element" && child.tagName === "code",
  );

  const lang = language(code);
  const text = code ? textContent(code) : "";

  // refractor only ever emits elements and text nodes
  const highlighted = highlightCode(text, lang)?.children as
    | ElementContent[]
    | undefined;

  return {
    type: "element",
    tagName: "figure",
    properties: { className: ["blog-code"] },
    children: [
      {
        type: "element",
        tagName: "figcaption",
        properties: { className: ["blog-code-label"] },
        children: [
          {
            type: "element",
            tagName: "span",
            properties: { className: ["blog-code-language"] },
            children: [{ type: "text", value: lang }],
          },
          copyButton(),
        ],
      },
      {
        type: "element",
        tagName: "pre",
        properties: {},
        children: [
          {
            type: "element",
            tagName: "code",
            properties: {},
            children: highlighted ?? [{ type: "text", value: text }],
          },
        ],
      },
    ],
  };
}

/**
 * Wraps every fenced block in a labelled panel with a copy control and
 * highlights it with refractor — at build time, so no Prism grammar is
 * shipped to the browser.
 */
export function rehypeCodePanels() {
  return (tree: Root) => {
    replaceElements(tree, (element) => element.tagName === "pre", panel);
  };
}
