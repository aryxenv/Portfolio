import type { Element, Nodes, Parent, RootContent } from "hast";

export function textContent(node: Nodes): string {
  if (node.type === "text") return node.value;
  if ("children" in node) return node.children.map(textContent).join("");
  return "";
}

export function walk(node: Nodes, handle: (node: Nodes) => void): void {
  handle(node);
  if ("children" in node) node.children.forEach((child) => walk(child, handle));
}

/**
 * Swaps out every element the predicate matches.
 *
 * Matches are collected before anything is replaced: a `replace` that wraps its
 * input would otherwise be re-matched inside its own output, forever.
 */
export function replaceElements(
  tree: Nodes,
  matches: (element: Element) => boolean,
  replace: (element: Element) => RootContent,
): void {
  const found: Array<{ children: RootContent[]; index: number }> = [];

  walk(tree, (node) => {
    if (!("children" in node)) return;

    const children = (node as Parent).children;

    children.forEach((child, index) => {
      if (child.type === "element" && matches(child)) {
        found.push({ children, index });
      }
    });
  });

  for (const { children, index } of found) {
    children[index] = replace(children[index] as Element);
  }
}
