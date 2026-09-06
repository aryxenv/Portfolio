import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", ".astro", "public", "server/**"] },

  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,

  {
    languageOptions: { ecmaVersion: "latest", globals: globals.browser },
  },
  {
    // build-time code runs in node, not the browser
    files: ["*.{js,mjs}", "src/data/**", "src/lib/markdown/**", "src/pages/**"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    // Astro generates this file and its triple-slash reference
    files: ["src/env.d.ts"],
    rules: { "@typescript-eslint/triple-slash-reference": "off" },
  },
);
