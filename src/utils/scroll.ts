import type Lenis from "lenis";

/** Matches `scroll-padding-top: 6rem` in index.css. */
const HEADER_OFFSET = 96;

let lenisInstance: Lenis | null = null;

/**
 * Lenis owns the scroll position while it is running, so programmatic scrolls
 * have to go through it — a native `scrollTo` gets undone on the next frame.
 * App registers the instance here and tears it down in low-perf mode.
 */
export function registerLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function scrollToTop(immediate = false) {
  if (lenisInstance) {
    // the page may have just changed height; Lenis clamps to a stale limit
    // unless its dimensions are recomputed first
    lenisInstance.resize();
    lenisInstance.scrollTo(0, { immediate });
    return;
  }

  window.scrollTo({ top: 0, left: 0, behavior: immediate ? "auto" : "smooth" });
}

export function scrollToElement(target: HTMLElement) {
  if (lenisInstance) {
    lenisInstance.resize();
    lenisInstance.scrollTo(target, { offset: -HEADER_OFFSET });
    return;
  }

  target.scrollIntoView({ behavior: "smooth" });
}
