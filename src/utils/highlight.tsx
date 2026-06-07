import { Fragment, type ReactNode } from "react";

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
