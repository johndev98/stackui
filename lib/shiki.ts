import { createHighlighter, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["dark-plus"],
      langs: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "html",
        "css",
        "scss",
        "less",
        "vue",
        "svelte",
        "py",
        "rb",
        "php",
        "sh",
        "bash",
        "bat",
        "cmd",
        "ps1",
        "json",
        "yaml",
        "yml",
        "xml",
        "md",
        "c",
        "cpp",
        "rs",
        "go",
        "java",
        "kt",
        "kts",
        "cs",
        "dart",
        "swift",
        "scala",
        "lua",
        "sql",
        "graphql",
        "prisma",
        "dockerfile",
        "toml",
        "ini",
      ],
    });
  }
  return highlighterPromise;
}
