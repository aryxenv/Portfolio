import type { IconName } from "../components/icons/paths";

/**
 * The navigation, rendered left to right.
 *
 * A `section` item scrolls the one-pager; a `route` item is its own page.
 * Reordering the nav means reordering this array — there is nowhere else.
 */
export interface NavItem {
  kind: "section" | "route";
  id: string;
  label: string;
  icon: IconName;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { kind: "section", id: "about", label: "About", icon: "user" },
  { kind: "section", id: "experience", label: "Experience", icon: "suitcase" },
  { kind: "section", id: "projects", label: "Projects", icon: "package" },
  { kind: "route", id: "blog", label: "Blog", icon: "notebook" },
  { kind: "section", id: "contact", label: "Contact", icon: "addressBook" },
];

/** The one-pager sections the navbar scroll-spy watches, in document order. */
export const SECTION_IDS = NAV_ITEMS.filter(
  (item) => item.kind === "section",
).map((item) => item.id);
