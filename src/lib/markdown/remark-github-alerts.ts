import type { Root as MdRoot, Parent, Text } from "mdast";

const ALERT_LABELS: Record<string, string> = {
  NOTE: "Note",
  TIP: "Tip",
  IMPORTANT: "Important",
  WARNING: "Warning",
  CAUTION: "Caution",
};

const ALERT_MARKER = /^\[!([A-Za-z]+)\]\s*/;

function visit(node: Parent, handle: (node: Parent) => void): void {
  handle(node);

  for (const child of node.children) {
    if ("children" in child) visit(child as Parent, handle);
  }
}

/**
 * Turns GitHub alert blockquotes (`> [!NOTE]`) into a labelled panel while
 * leaving the body as ordinary markdown. remark-gfm does not cover these.
 */
export function remarkGithubAlerts() {
  return (tree: MdRoot) => {
    visit(tree, (node) => {
      if (node.type !== "blockquote") return;

      const paragraph = node.children[0];
      if (paragraph?.type !== "paragraph") return;

      const lead = paragraph.children[0];
      if (lead?.type !== "text") return;

      const marker = ALERT_MARKER.exec(lead.value);
      if (!marker) return;

      const kind = marker[1]!.toUpperCase();
      const label = ALERT_LABELS[kind];
      if (!label) return;

      lead.value = lead.value.slice(marker[0].length);

      if (!lead.value) paragraph.children.shift();
      if (paragraph.children[0]?.type === "break") paragraph.children.shift();

      node.data = {
        ...node.data,
        hName: "div",
        hProperties: {
          className: ["blog-alert", `blog-alert-${kind.toLowerCase()}`],
        },
      };

      node.children.unshift({
        type: "paragraph",
        data: { hProperties: { className: "blog-alert-label" } },
        children: [{ type: "text", value: label } satisfies Text],
      });
    });
  };
}
