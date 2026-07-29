import { useEffect } from "react";

/**
 * Keeps the document title and meta description in step with the current
 * route, and restores the previous values when the route unmounts.
 */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]');
    const previousTitle = document.title;
    const previousDescription = meta?.getAttribute("content") ?? null;

    document.title = title;

    if (meta && description) {
      meta.setAttribute("content", description);
    }

    return () => {
      document.title = previousTitle;

      if (meta && description && previousDescription !== null) {
        meta.setAttribute("content", previousDescription);
      }
    };
  }, [title, description]);
}
