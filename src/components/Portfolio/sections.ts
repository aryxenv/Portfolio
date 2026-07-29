/**
 * Chunk boundaries for the one-page portfolio. Kept out of Portfolio.tsx so the
 * component file only exports a component, and so the router can warm these
 * chunks before scrolling to a deep-linked section.
 */
export const importAbout = () => import("../About/About.tsx");
export const importExperience = () => import("../Experience/Experience.tsx");
export const importProjects = () => import("../Projects/Projects.tsx");
export const importContact = () => import("../Contact/Contact.tsx");

/**
 * A deep link such as /#experience can only scroll accurately once every
 * section above the target has mounted.
 */
export function preloadPortfolioSections() {
  return Promise.all([
    importAbout(),
    importExperience(),
    importProjects(),
    importContact(),
  ]);
}
