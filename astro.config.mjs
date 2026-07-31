// @ts-check
import react from "@astrojs/react";
import { unified } from "@astrojs/markdown-remark";
import { defineConfig } from "astro/config";
import remarkBreaks from "remark-breaks";
import { remarkGithubAlerts } from "./src/lib/markdown/remark-github-alerts";
import { remarkStripTitle } from "./src/lib/markdown/remark-strip-title";
import { rehypeBlogElements } from "./src/lib/markdown/rehype-blog-elements";
import { rehypeCodePanels } from "./src/lib/markdown/rehype-code-panels";
import { rehypeHeadingAnchors } from "./src/lib/markdown/rehype-heading-anchors";

export default defineConfig({
  site: "https://aryxenv.dev",
  integrations: [react()],
  markdown: {
    // code fences are highlighted by our own refractor plugin so the Prism
    // `.token.*` classes the blog theme is built on survive
    syntaxHighlight: false,
    processor: unified({
      // remark-gfm and raw-HTML support are already part of this processor.
      // remarkBreaks runs before the alert plugin so the tree shape it
      // inspects is already settled: a single newline is a line break here,
      // matching how the posts are written — so do not hard-wrap prose.
      remarkPlugins: [remarkStripTitle, remarkBreaks, remarkGithubAlerts],
      rehypePlugins: [
        rehypeHeadingAnchors,
        rehypeCodePanels,
        rehypeBlogElements,
      ],
      // posts are written with deliberate punctuation; do not rewrite quotes
      smartypants: false,
    }),
  },
});
