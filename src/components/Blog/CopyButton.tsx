import { useEffect, useRef, useState } from "react";

const RESET_DELAY_MS = 1800;

/**
 * Fallback for when the async clipboard API rejects — it refuses outside a
 * secure context and whenever the document is not focused, and a copy button
 * that silently does nothing is worse than a deprecated API call.
 */
function copyViaSelection(text: string): boolean {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "0";
  area.style.opacity = "0";

  const selection = document.getSelection();
  const previous = selection?.rangeCount ? selection.getRangeAt(0) : null;

  document.body.appendChild(area);
  area.select();

  let copied = false;

  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  area.remove();

  if (previous && selection) {
    selection.removeAllRanges();
    selection.addRange(previous);
  }

  return copied;
}

/**
 * Copy control for a fenced code block. The icon swap is the whole feedback
 * mechanism, so it carries an aria-live status for screen readers too.
 */
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const copy = async () => {
    let ok = false;

    try {
      await navigator.clipboard.writeText(code);
      ok = true;
    } catch {
      ok = copyViaSelection(code);
    }

    // never report success we did not have
    if (!ok) return;

    setCopied(true);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), RESET_DELAY_MS);
  };

  return (
    <button
      type="button"
      className={`blog-copy${copied ? " is-copied" : ""}`}
      onClick={copy}
      aria-label={copied ? "Code copied" : "Copy code"}
    >
      <span className="blog-copy-icon" aria-hidden="true">
        <i className="bx bx-copy"></i>
        <i className="bx bx-check"></i>
      </span>
      <span className="visually-hidden" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}

export default CopyButton;
