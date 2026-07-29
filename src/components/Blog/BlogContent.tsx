import type { Element, Nodes } from "hast";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, type ReactNode } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { Link, useNavigate } from "react-router-dom";
import type { BlogPostEntry } from "./BlogData.ts";
import CopyButton from "./CopyButton.tsx";
import { highlightCode } from "./highlightCode.ts";
import { scrollToElement } from "../../utils/scroll.ts";

interface MdNode {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: {
    hName?: string;
    hProperties?: Record<string, string | string[]>;
  };
}

const ALERT_LABELS: Record<string, string> = {
  NOTE: "Note",
  TIP: "Tip",
  IMPORTANT: "Important",
  WARNING: "Warning",
  CAUTION: "Caution",
};

const ALERT_MARKER = /^\[!([A-Za-z]+)\]\s*/;

function visit(node: MdNode, handle: (node: MdNode) => void) {
  handle(node);
  node.children?.forEach((child) => visit(child, handle));
}

/**
 * Turns GitHub alert blockquotes (`> [!NOTE]`) into a labelled panel while
 * leaving the body as ordinary markdown. remark-gfm does not cover these.
 */
function remarkGithubAlerts() {
  return (tree: MdNode) => {
    visit(tree, (node) => {
      if (node.type !== "blockquote") return;

      const paragraph = node.children?.[0];
      if (paragraph?.type !== "paragraph") return;

      const lead = paragraph.children?.[0];
      if (lead?.type !== "text" || lead.value === undefined) return;

      const marker = ALERT_MARKER.exec(lead.value);
      if (!marker) return;

      const kind = marker[1].toUpperCase();
      if (!(kind in ALERT_LABELS)) return;

      lead.value = lead.value.slice(marker[0].length);

      if (!lead.value) paragraph.children?.shift();
      if (paragraph.children?.[0]?.type === "break") paragraph.children.shift();

      node.data = {
        ...node.data,
        hName: "div",
        hProperties: {
          className: ["blog-alert", `blog-alert-${kind.toLowerCase()}`],
        },
      };

      node.children?.unshift({
        type: "paragraph",
        data: { hProperties: { className: "blog-alert-label" } },
        children: [{ type: "text", value: ALERT_LABELS[kind] }],
      });
    });
  };
}

function textContent(node: Nodes): string {
  if (node.type === "text") return node.value;
  if ("children" in node) return node.children.map(textContent).join("");
  return "";
}

const HEADINGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

/**
 * Gives every heading a stable id derived from its text, so a section can be
 * linked directly. Runs on the hast tree rather than during React rendering,
 * so the numbering of repeated headings is deterministic and document-ordered.
 */
function rehypeHeadingIds() {
  return (tree: Nodes) => {
    const used = new Map<string, number>();

    const walk = (node: Nodes) => {
      if (node.type === "element" && HEADINGS.has(node.tagName)) {
        const base =
          textContent(node)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || "section";

        // repeated headings ("usage" appears twice) get -1, -2, … like GitHub
        const seen = used.get(base) ?? 0;
        used.set(base, seen + 1);

        node.properties = {
          ...node.properties,
          id: seen === 0 ? base : `${base}-${seen}`,
        };
      }

      if ("children" in node) node.children.forEach((child) => walk(child));
    };

    walk(tree);
  };
}

function codeLanguage(node: Element | undefined): string {
  const className = node?.properties?.className;
  const names = Array.isArray(className) ? className.map(String) : [];
  const language = names.find((name) => name.startsWith("language-"));

  return language ? language.slice("language-".length) : "";
}

/**
 * Heading with a permalink affordance; ids come from rehypeHeadingIds.
 * Defined at module scope — building these inside the parent's render would
 * give React a new component type each time and remount every heading.
 */
function makeHeading(Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  return function Heading({
    node,
    children,
  }: {
    node?: Element;
    children?: ReactNode;
  }) {
    const navigate = useNavigate();
    const id =
      typeof node?.properties?.id === "string" ? node.properties.id : "";

    if (!id) return <Tag>{children}</Tag>;

    return (
      <Tag id={id} className="blog-heading">
        {children}
        <a
          className="blog-heading-anchor"
          href={`#${id}`}
          aria-label="Link to this section"
          onClick={(event) => {
            // let modified clicks open a new tab as usual
            if (
              event.defaultPrevented ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey ||
              event.button !== 0
            ) {
              return;
            }

            const target = document.getElementById(id);
            if (!target) return;

            // route the scroll through the Lenis-aware helper rather than
            // letting the browser jump, so both perf modes land identically
            event.preventDefault();
            navigate({ hash: `#${id}` });
            scrollToElement(target);
          }}
        >
          <span aria-hidden="true">#</span>
        </a>
      </Tag>
    );
  };
}

const HEADING_COMPONENTS = {
  h1: makeHeading("h1"),
  h2: makeHeading("h2"),
  h3: makeHeading("h3"),
  h4: makeHeading("h4"),
  h5: makeHeading("h5"),
  h6: makeHeading("h6"),
};

function BlogContent({ post }: { post: BlogPostEntry }) {
  const components: Components = {
    ...HEADING_COMPONENTS,

    // fenced code, rendered from the source text so the inline `code`
    // component below only ever sees inline spans
    pre({ node }) {
      const code = node?.children?.find(
        (child): child is Element =>
          child.type === "element" && child.tagName === "code",
      );

      const language = codeLanguage(code);
      const text = code ? textContent(code) : "";
      const highlighted = highlightCode(text, language);

      return (
        <figure className="blog-code">
          <figcaption className="blog-code-label">
            <span className="blog-code-language">{language}</span>
            <CopyButton code={text} />
          </figcaption>
          <pre>
            <code>
              {highlighted
                ? toJsxRuntime(highlighted, { Fragment, jsx, jsxs })
                : text}
            </code>
          </pre>
        </figure>
      );
    },

    code({ children }) {
      return <code className="inline-code">{children}</code>;
    },

    a({ href, children }) {
      if (href?.startsWith("/")) {
        return <Link to={href}>{children}</Link>;
      }

      return (
        <a href={href} target="_blank" rel="noreferrer noopener">
          {children}
        </a>
      );
    },

    img({ src, alt }) {
      const path = typeof src === "string" ? src : "";
      const isAbsolute = /^(https?:)?\/\//.test(path) || path.startsWith("/");
      const resolved = isAbsolute ? path : post.assets[path];

      // an unresolved relative path means the file is missing from the post's
      // assets/ folder; render nothing rather than a broken image
      if (!resolved) {
        if (import.meta.env.DEV) {
          console.warn(
            `[blog] ${post.slug}: no asset for "${path}"; the image was skipped.`,
          );
        }

        return null;
      }

      return (
        <img
          className="blog-image"
          src={resolved}
          alt={alt ?? ""}
          loading="lazy"
        />
      );
    },

    table({ children }) {
      return (
        <div className="blog-table">
          <table>{children}</table>
        </div>
      );
    },
  };

  return (
    <div className="blog-post-body">
      <ReactMarkdown
        // remarkBreaks runs before the alert plugin so the tree shape it
        // inspects is already settled. A single newline is a line break here,
        // matching how the posts are written — so do not hard-wrap prose.
        remarkPlugins={[remarkGfm, remarkBreaks, remarkGithubAlerts]}
        rehypePlugins={[rehypeRaw, rehypeHeadingIds]}
        components={components}
      >
        {post.body}
      </ReactMarkdown>
    </div>
  );
}

export default BlogContent;
