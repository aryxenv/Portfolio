import { refractor } from "refractor/core";
import bash from "refractor/bash";
import bicep from "refractor/bicep";
import csharp from "refractor/csharp";
import hcl from "refractor/hcl";
import ini from "refractor/ini";
import javascript from "refractor/javascript";
import markdown from "refractor/markdown";
import powershell from "refractor/powershell";
import python from "refractor/python";
import rust from "refractor/rust";
import typescript from "refractor/typescript";
import type { Root } from "hast";

// only the languages actually written about, so the blog chunk stays small
for (const language of [
  bash,
  bicep,
  csharp,
  hcl,
  ini,
  javascript,
  markdown,
  powershell,
  python,
  rust,
  typescript,
]) {
  refractor.register(language);
}

/** Fence labels mapped onto the registered grammar that handles them. */
const ALIASES: Record<string, string> = {
  cs: "csharp",
  dotenv: "ini",
  env: "ini",
  js: "javascript",
  jsx: "javascript",
  md: "markdown",
  node: "javascript",
  ps: "powershell",
  ps1: "powershell",
  pwsh: "powershell",
  py: "python",
  rs: "rust",
  sh: "bash",
  shell: "bash",
  terraform: "hcl",
  tf: "hcl",
  ts: "typescript",
  tsx: "typescript",
  zsh: "bash",
};

/**
 * Highlights a fenced block, or returns null when the fence has no language or
 * names one we do not carry a grammar for — the caller then renders plain text.
 */
export function highlightCode(code: string, language: string): Root | null {
  if (!language) return null;

  const grammar = ALIASES[language.toLowerCase()] ?? language.toLowerCase();

  if (!refractor.registered(grammar)) return null;

  try {
    return refractor.highlight(code, grammar);
  } catch {
    return null;
  }
}
