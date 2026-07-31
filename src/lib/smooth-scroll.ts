import Lenis from "lenis";
import { isLowPerf, onPerfModeChange } from "./perf-mode";
import { registerLenis } from "./scroll";

/**
 * Smooth scrolling. Torn down entirely in low-performance mode so the constant
 * requestAnimationFrame loop stops rather than idling.
 */

let lenis: Lenis | null = null;
let frameId = 0;

function start() {
  if (lenis) return;

  lenis = new Lenis();
  registerLenis(lenis);

  const raf = (time: number) => {
    lenis?.raf(time);
    frameId = requestAnimationFrame(raf);
  };

  frameId = requestAnimationFrame(raf);
}

function stop() {
  if (!lenis) return;

  cancelAnimationFrame(frameId);
  registerLenis(null);
  lenis.destroy();
  lenis = null;
}

export function initSmoothScroll() {
  if (!isLowPerf()) start();

  onPerfModeChange((mode) => (mode === "low" ? stop() : start()));

  // view transitions replace the document body; Lenis needs to remeasure
  document.addEventListener("astro:after-swap", () => lenis?.resize());
}
