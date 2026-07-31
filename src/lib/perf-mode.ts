/**
 * Performance mode.
 *
 * "high" renders the WebGL reactor, smooth scrolling and every always-on
 * animation. "low" drops all of it for a plain black background.
 *
 * The preference is read from localStorage before first paint by an inline
 * script in BaseLayout, so `document.documentElement.dataset.perf` is always
 * authoritative by the time anything else runs.
 */

export type PerfMode = "high" | "low";

const STORAGE_KEY = "perfMode";

export function getPerfMode(): PerfMode {
  return document.documentElement.dataset.perf === "low" ? "low" : "high";
}

export function isLowPerf(): boolean {
  return getPerfMode() === "low";
}

export function setPerfMode(mode: PerfMode) {
  document.documentElement.dataset.perf = mode;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // private browsing / storage disabled — the in-memory value still applies
  }
  window.dispatchEvent(
    new CustomEvent<PerfMode>("perfmodechange", { detail: mode }),
  );
}

export function togglePerfMode(): PerfMode {
  const next: PerfMode = isLowPerf() ? "high" : "low";
  setPerfMode(next);
  return next;
}

export function onPerfModeChange(handler: (mode: PerfMode) => void) {
  const listener = (event: Event) => {
    handler((event as CustomEvent<PerfMode>).detail);
  };
  window.addEventListener("perfmodechange", listener);
  return () => window.removeEventListener("perfmodechange", listener);
}
