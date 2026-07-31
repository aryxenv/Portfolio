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

async function copy(button: HTMLButtonElement): Promise<void> {
  const text =
    button.closest(".blog-code")?.querySelector("pre code")?.textContent ?? "";

  let ok = false;

  try {
    await navigator.clipboard.writeText(text);
    ok = true;
  } catch {
    ok = copyViaSelection(text);
  }

  // never report success we did not have
  if (!ok) return;

  button.classList.add("is-copied");
  button.setAttribute("aria-label", "Code copied");

  const status = button.querySelector(".visually-hidden");
  if (status) status.textContent = "Copied";

  setTimeout(() => {
    button.classList.remove("is-copied");
    button.setAttribute("aria-label", "Copy code");
    if (status) status.textContent = "";
  }, RESET_DELAY_MS);
}

/**
 * Copy controls for fenced code blocks. The buttons are server-rendered by
 * `rehypeCodePanels`; this only gives them behaviour, so a JS failure leaves
 * the code itself perfectly readable.
 */
export function initCopyButtons(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>(
    ".blog-copy[data-copy]",
  );

  buttons.forEach((button) => {
    if (button.dataset.copyBound) return;

    button.dataset.copyBound = "true";
    button.addEventListener("click", () => void copy(button));
  });
}
