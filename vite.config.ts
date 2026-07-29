import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { blogSitemap } from "./vite/blogSitemap.ts";

// https://vite.dev/config/

export default defineConfig({
  plugins: [react(), blogSitemap()],
});
