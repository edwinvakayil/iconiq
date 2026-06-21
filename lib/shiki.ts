import {
  type BundledLanguage,
  type BundledTheme,
  createHighlighter,
  type Highlighter,
} from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

const LANGS: BundledLanguage[] = ["tsx", "typescript", "bash", "json"];
const THEMES: BundledTheme[] = ["github-light", "github-dark"];

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: THEMES,
      langs: LANGS,
    });
  }
  return highlighterPromise;
}

const htmlCache = new Map<string, string>();

export async function highlightCode(
  code: string,
  lang: BundledLanguage = "tsx"
): Promise<string> {
  const cacheKey = `${lang}:${code}`;

  const cached = htmlCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const highlighter = await getHighlighter();

  const html = highlighter.codeToHtml(code.trim(), {
    lang,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    transformers: [
      {
        name: "line-numbers",
        code(node) {
          if (!node.properties.class) {
            node.properties.class = "";
          }
          node.properties.class += " grid counter-reset-line";
        },
        line(node, line) {
          node.properties["data-line"] = line;
        },
      },
    ],
  });

  if (htmlCache.size > 500) {
    const firstKey = htmlCache.keys().next().value;
    if (firstKey) {
      htmlCache.delete(firstKey);
    }
  }
  htmlCache.set(cacheKey, html);

  return html;
}
