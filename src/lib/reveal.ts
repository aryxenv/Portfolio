/**
 * Entrance reveals.
 *
 * One IntersectionObserver for the whole document, replacing ~15 hand-written
 * animation prop objects. Markup opts in with `data-reveal`; the observer adds
 * `data-revealed` once the element crosses into view, and the transition lives
 * in `styles/motion.css`.
 *
 * The hiding rule is gated behind `html[data-reveal-ready]`, which this module
 * sets. If the script never runs — or performance mode is low — content is
 * simply visible.
 */

const REVEALED = "data-revealed";

let observer: IntersectionObserver | null = null;

function reveal(element: Element) {
  element.setAttribute(REVEALED, "");
  observer?.unobserve(element);
}

export function initReveal() {
  const root = document.documentElement;

  if (root.dataset.perf === "low") {
    root.removeAttribute("data-reveal-ready");
    return;
  }

  if (!("IntersectionObserver" in window)) return;

  root.setAttribute("data-reveal-ready", "");

  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0 },
  );

  for (const element of document.querySelectorAll(`[data-reveal]`)) {
    if (!element.hasAttribute(REVEALED)) observer.observe(element);
  }
}
