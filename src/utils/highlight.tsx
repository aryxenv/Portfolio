import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";

/**
 * Converts **keyword** markers inside a plain string into bold highlights,
 * so data-driven text can emphasise relevant keywords without inline JSX.
 */
export function highlightText(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="highlight">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
}

const RICH_TEXT_PATTERN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
const LINK_PATTERN = /^\[([^\]]+)\]\(([^)]+)\)$/;

/**
 * Prose-level formatting for data-driven copy: **bold**, `inline code`, and
 * [label](href) links. Internal hrefs stay inside the router, external ones
 * open in a new tab. Nothing is ever parsed as HTML, so content stays inert.
 */
export function richText(text: string): ReactNode[] {
  return text.split(RICH_TEXT_PATTERN).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="highlight">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.length > 1 && part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="inline-code">
          {part.slice(1, -1)}
        </code>
      );
    }

    const link = LINK_PATTERN.exec(part);

    if (link) {
      const [, label, href] = link;

      return href.startsWith("/") ? (
        <Link key={index} to={href}>
          {label}
        </Link>
      ) : (
        <a key={index} href={href} target="_blank" rel="noreferrer noopener">
          {label}
        </a>
      );
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
}
