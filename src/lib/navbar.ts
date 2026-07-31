import { SECTION_IDS } from "../data/nav";
import { togglePerfMode } from "./perf-mode";
import { scrollToTop } from "./scroll";

/**
 * Navbar behaviour.
 *
 * The navbar is `transition:persist`ed, so its DOM survives navigation and
 * this module runs once. Everything that depends on the current route is
 * refreshed on `astro:page-load` instead of being rendered server-side twice.
 */

const ACTIVE = "active";

let spy: IntersectionObserver | null = null;

function navbar() {
  return document.querySelector<HTMLElement>(".navbar");
}

function setActive(predicate: (link: HTMLAnchorElement) => boolean) {
  const links = navbar()?.querySelectorAll<HTMLAnchorElement>("a[data-nav-id]");
  if (!links) return;

  for (const link of links) {
    const active = predicate(link);
    link.classList.toggle(ACTIVE, active);
    if (active) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  }
}

function initScrolledState() {
  const update = () => {
    const scrolled = window.scrollY > 0;
    navbar()?.classList.toggle("scrolled", scrolled);
    document
      .querySelector(".back-to-top")
      ?.classList.toggle("hidden", !scrolled);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

/**
 * Scroll-spy. The section crossing the viewport midline is the active one —
 * the `-50% 0px -50% 0px` margin reduces the viewport to that single line.
 */
function startScrollSpy() {
  spy?.disconnect();

  const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
    (element): element is HTMLElement => element !== null,
  );

  if (sections.length === 0) return;

  spy = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (!visible) return;
      setActive((link) => link.dataset.navId === visible.target.id);
    },
    { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
  );

  for (const section of sections) spy.observe(section);
}

/** Refreshes everything that depends on which page is showing. */
export function syncNavbarToRoute() {
  const { pathname } = window.location;
  const isHome = pathname === "/";

  if (isHome) {
    setActive(() => false);
    startScrollSpy();
  } else {
    spy?.disconnect();
    spy = null;
    setActive((link) => pathname.startsWith(`/${link.dataset.navId}`));
  }

  // off the one-pager, section links have to route home first
  for (const link of document.querySelectorAll<HTMLAnchorElement>(
    "a[data-nav-kind='section']",
  )) {
    link.href = isHome ? `#${link.dataset.navId}` : `/#${link.dataset.navId}`;
  }
}

function initPerfToggle() {
  const button = document.querySelector<HTMLButtonElement>(".perfModeToggle");
  const icon = button?.querySelector("i");
  if (!button || !icon) return;

  const render = (low: boolean) => {
    icon.className = `bx ${low ? "bx-bolt-circle" : "bxs-bolt-circle"}`;
    button.setAttribute("aria-pressed", String(!low));
    button.setAttribute(
      "aria-label",
      low
        ? "Performance mode: low. Click to turn the animated background on."
        : "Performance mode: high. Click to turn the animated background off.",
    );
    button.title = low
      ? "Low performance mode (animated background off)"
      : "High performance mode (animated background on)";
  };

  render(document.documentElement.dataset.perf === "low");
  button.addEventListener("click", () => render(togglePerfMode() === "low"));
}

export function initNavbar() {
  initScrolledState();
  initPerfToggle();

  document
    .querySelector(".back-to-top")
    ?.addEventListener("click", () => scrollToTop());

  document.querySelector(".navbar-logo")?.addEventListener("click", (event) => {
    if (window.location.pathname !== "/") return;
    // already home: drop any section hash and go back to the top
    event.preventDefault();
    history.replaceState(null, "", "/");
    scrollToTop();
  });

  syncNavbarToRoute();
}
