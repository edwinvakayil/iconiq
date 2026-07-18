"use client";

import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const COPY_RESET_MS = 2000;

/** Transform-only spring for the copy icon swap — stays off the layout thread. */
const ICON_SPRING = {
  type: "spring",
  stiffness: 600,
  damping: 30,
  mass: 0.6,
} as const;

type TokenKind =
  | "call"
  | "comment"
  | "keyword"
  | "number"
  | "operator"
  | "plain"
  | "property"
  | "punctuation"
  | "string"
  | "tag"
  | "type";

type Token = {
  kind: TokenKind;
  value: string;
};

const KEYWORDS = new Set([
  "abstract",
  "as",
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "def",
  "default",
  "delete",
  "do",
  "elif",
  "else",
  "enum",
  "export",
  "extends",
  "false",
  "finally",
  "fn",
  "for",
  "from",
  "function",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "interface",
  "let",
  "match",
  "new",
  "None",
  "not",
  "null",
  "of",
  "pass",
  "private",
  "protected",
  "public",
  "readonly",
  "return",
  "satisfies",
  "static",
  "struct",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "type",
  "typeof",
  "undefined",
  "var",
  "void",
  "while",
  "yield",
]);

const WHITESPACE_RE = /^\s+/;
const BLOCK_COMMENT_RE = /^\/\*[\s\S]*?(?:\*\/|$)/;
const LINE_COMMENT_RE = /^(?:\/\/|#)[^\n]*/;
const TEMPLATE_STRING_RE = /^`(?:\\.|[\s\S])*?`/;
const DOUBLE_QUOTED_STRING_RE = /^"(?:\\.|[^"\\])*"/;
const SINGLE_QUOTED_STRING_RE = /^'(?:\\.|[^'\\])*'/;
const TAG_RE = /^<\/?[A-Za-z][\w.-]*|^\/?>/;
const ATTRIBUTE_RE = /^[A-Za-z_$][\w$-]*(?==)/;
const PROPERTY_RE = /^[A-Za-z_$][\w$-]*(?=\s*:)/;
const IDENTIFIER_RE = /^[A-Za-z_$][\w$]*/;
const TYPE_IDENTIFIER_RE = /^[A-Z]/;
const NUMBER_RE = /^-?\d+(?:\.\d+)?/;
const OPERATOR_RE =
  /^(?:=>|===|!==|==|!=|<=|>=|\+\+|--|\|\||&&|\?\?|\.\.\.|[=<>+\-*/%!?&|])/;
const PUNCTUATION_RE = /^[{}()[\],.;:]/;

const STATIC_MATCHERS: { kind: TokenKind; regex: RegExp }[] = [
  { kind: "plain", regex: WHITESPACE_RE },
  { kind: "comment", regex: BLOCK_COMMENT_RE },
  { kind: "comment", regex: LINE_COMMENT_RE },
  { kind: "string", regex: TEMPLATE_STRING_RE },
  { kind: "string", regex: DOUBLE_QUOTED_STRING_RE },
  { kind: "string", regex: SINGLE_QUOTED_STRING_RE },
  { kind: "tag", regex: TAG_RE },
  { kind: "property", regex: ATTRIBUTE_RE },
  { kind: "property", regex: PROPERTY_RE },
  { kind: "number", regex: NUMBER_RE },
  { kind: "operator", regex: OPERATOR_RE },
  { kind: "punctuation", regex: PUNCTUATION_RE },
];

/** Theme-aware token palette — light colors on white, brighter ones in dark. */
const TOKEN_CLASS_NAMES: Record<TokenKind, string> = {
  plain: "text-zinc-800 dark:text-zinc-200",
  comment: "text-zinc-400 italic dark:text-zinc-500",
  keyword: "text-rose-600 dark:text-rose-400",
  string: "text-emerald-600 dark:text-emerald-400",
  number: "text-amber-600 dark:text-amber-400",
  property: "text-sky-600 dark:text-sky-400",
  call: "text-violet-600 dark:text-violet-400",
  type: "text-indigo-600 dark:text-indigo-400",
  tag: "text-teal-600 dark:text-teal-400",
  operator: "text-zinc-500 dark:text-zinc-400",
  punctuation: "text-zinc-400 dark:text-zinc-500",
};

function readStaticToken(source: string): Token | null {
  for (const matcher of STATIC_MATCHERS) {
    const value = matcher.regex.exec(source)?.[0];

    if (value) {
      return { kind: matcher.kind, value };
    }
  }

  return null;
}

function identifierKind(identifier: string, source: string): TokenKind {
  if (KEYWORDS.has(identifier)) {
    return "keyword";
  }

  if (TYPE_IDENTIFIER_RE.test(identifier)) {
    return "type";
  }

  if (source.startsWith(`${identifier}(`)) {
    return "call";
  }

  return "plain";
}

function readDynamicToken(source: string): Token {
  const identifier = IDENTIFIER_RE.exec(source)?.[0];

  if (identifier) {
    return { kind: identifierKind(identifier, source), value: identifier };
  }

  return { kind: "plain", value: source[0] ?? "" };
}

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let cursor = 0;

  while (cursor < line.length) {
    const source = line.slice(cursor);
    const token = readStaticToken(source) ?? readDynamicToken(source);

    tokens.push(token);
    cursor += token.value.length;
  }

  return tokens;
}

function CopyButton({
  copied,
  onCopy,
  reducedMotion,
  floating = false,
}: {
  copied: boolean;
  onCopy: () => void;
  reducedMotion: boolean;
  /** Glass-chip styling for when the button floats over the code area. */
  floating?: boolean;
}) {
  const iconTransition = reducedMotion ? { duration: 0 } : ICON_SPRING;

  return (
    <motion.button
      aria-label={copied ? "Copied" : "Copy code"}
      className={cn(
        "flex h-7 items-center gap-1.5 rounded-md px-2 font-medium text-xs outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/60",
        floating &&
          "border border-border/70 bg-background/85 shadow-sm backdrop-blur-sm",
        copied
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
      )}
      data-slot="code-block-copy"
      onClick={onCopy}
      type="button"
      whileTap={reducedMotion ? undefined : { scale: 0.96 }}
    >
      <span className="relative size-3.5">
        <AnimatePresence initial={false}>
          {copied ? (
            <motion.span
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
              exit={{ opacity: 0, scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.95 }}
              key="check"
              transition={iconTransition}
            >
              <Check className="size-3.5" strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
              exit={{ opacity: 0, scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.95 }}
              key="copy"
              transition={iconTransition}
            >
              <Copy className="size-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {/* Both labels overlay a fixed-width slot, so the swap never shifts layout. */}
      <span className="relative">
        <span aria-hidden className="invisible">
          Copied
        </span>
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 text-left transition-opacity duration-200",
            copied ? "opacity-0" : "opacity-100"
          )}
        >
          Copy
        </span>
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 text-left transition-opacity duration-200",
            copied ? "opacity-100" : "opacity-0"
          )}
        >
          Copied
        </span>
      </span>
    </motion.button>
  );
}

export type CodeBlockProps = {
  /** Source code to render. Leading and trailing blank lines are trimmed. */
  code: string;
  /** Language shown in the bottom status bar and used for the tab accent dot. */
  language?: string;
  /** Filename shown inside the editor-style tab at the top. */
  filename?: string;
  /** Show the line-number gutter. */
  showLineNumbers?: boolean;
  /** 1-based line numbers to emphasize with a tinted row and accent bar. */
  highlightLines?: number[];
  /** Max body height before the code scrolls, e.g. 320 or "20rem". */
  maxHeight?: number | string;
  /** Called with the code after it is written to the clipboard. */
  onCopy?: (code: string) => void;
  /** Extra classes for the outer shell. */
  className?: string;
};

export function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = true,
  highlightLines,
  maxHeight = 384,
  onCopy,
  className,
}: CodeBlockProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | null>(null);

  const lines = useMemo(() => {
    const trimmed = code.replace(/^\n+|\s+$/g, "");
    return trimmed.split("\n").map((line) => tokenizeLine(line));
  }, [code]);

  const highlighted = useMemo(
    () => new Set(highlightLines ?? []),
    [highlightLines]
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Clipboard API can be unavailable in iframes or without permission —
      // fall back to a hidden textarea and the legacy copy command.
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const succeeded = document.execCommand("copy");
      textarea.remove();

      if (!succeeded) {
        return;
      }
    }

    setCopied(true);
    onCopy?.(code);

    if (resetTimer.current !== null) {
      window.clearTimeout(resetTimer.current);
    }
    resetTimer.current = window.setTimeout(() => {
      setCopied(false);
      resetTimer.current = null;
    }, COPY_RESET_MS);
  }, [code, onCopy]);

  const hasTab = Boolean(filename);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/80 bg-background shadow-[0_1px_2px_rgba(15,23,42,0.05),0_16px_40px_-20px_rgba(15,23,42,0.22)] dark:bg-zinc-950 dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_16px_40px_-20px_rgba(0,0,0,0.55)]",
        className
      )}
      data-copied={copied || undefined}
      data-slot="code-block"
    >
      {hasTab ? (
        // Editor-style tab strip: the active tab joins the code area below it,
        // with the copy button pinned to the strip's right edge.
        <div className="flex items-end justify-between gap-3 border-border/70 border-b bg-gradient-to-b from-muted/70 to-muted/40 pt-2 pr-1.5 pl-2.5 dark:from-white/[0.05] dark:to-white/[0.02]">
          <div className="relative -mb-px flex min-w-0 items-center gap-2 rounded-t-lg border border-border/70 border-b-0 bg-background px-3.5 py-1.5 dark:bg-zinc-950">
            <span className="truncate font-mono text-[12.5px] text-foreground/80">
              {filename}
            </span>
          </div>

          <div className="mb-1 shrink-0">
            <CopyButton
              copied={copied}
              onCopy={handleCopy}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>
      ) : null}

      <div className="relative">
        {hasTab ? null : (
          // No tab strip — the copy button floats over the code, top right.
          <div className="absolute top-2 right-2 z-10">
            <CopyButton
              copied={copied}
              floating
              onCopy={handleCopy}
              reducedMotion={reducedMotion}
            />
          </div>
        )}

        <div
          className="overflow-auto [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/80 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2"
          style={{ maxHeight }}
        >
          <pre className="min-w-max py-3.5 font-mono text-[13px] leading-6 selection:bg-indigo-500/25">
            <code className="block">
              {lines.map((tokens, index) => {
                const lineNumber = index + 1;
                const isHighlighted = highlighted.has(lineNumber);

                return (
                  <span
                    className={cn(
                      "relative block pr-5 transition-colors duration-100",
                      showLineNumbers ? "pl-0" : "pl-4",
                      isHighlighted
                        ? "bg-gradient-to-r from-indigo-500/[0.12] via-indigo-500/[0.04] to-transparent dark:from-indigo-400/[0.16] dark:via-indigo-400/[0.05]"
                        : "hover:bg-muted/60 dark:hover:bg-white/[0.04]",
                      isHighlighted &&
                        !showLineNumbers &&
                        "shadow-[inset_2px_0_0_0_#6366f1]"
                    )}
                    key={lineNumber}
                  >
                    {showLineNumbers ? (
                      // Opaque gutter cell: long lines slide underneath it on
                      // horizontal scroll instead of showing through the digits.
                      <span
                        aria-hidden
                        className={cn(
                          "sticky left-0 z-10 mr-4 inline-block w-11 select-none border-border/60 border-r pr-3 text-right text-xs tabular-nums leading-6",
                          isHighlighted
                            ? "bg-[color-mix(in_srgb,#6366f1_10%,var(--color-background))] text-indigo-600 shadow-[inset_2px_0_0_0_#6366f1] dark:bg-[color-mix(in_srgb,#818cf8_14%,#09090b)] dark:text-indigo-400"
                            : "bg-background text-muted-foreground/50 dark:bg-zinc-950"
                        )}
                      >
                        {lineNumber}
                      </span>
                    ) : null}
                    {tokens.length === 0 ? (
                      "\n"
                    ) : (
                      <>
                        {tokens.map((token, tokenIndex) => (
                          <span
                            className={TOKEN_CLASS_NAMES[token.kind]}
                            key={`${lineNumber}-${token.kind}-${tokenIndex}`}
                          >
                            {token.value}
                          </span>
                        ))}
                        {"\n"}
                      </>
                    )}
                  </span>
                );
              })}
            </code>
          </pre>
        </div>
      </div>

      {/* Status bar: language and line count, plus a copy confirmation. */}
      <div className="flex items-center justify-between gap-3 border-border/70 border-t bg-muted/60 px-4 py-1.5 text-[11px] text-muted-foreground dark:bg-white/[0.04]">
        <div className="flex min-w-0 items-center gap-2">
          {language ? (
            <>
              <span className="truncate font-mono uppercase tracking-wider">
                {language}
              </span>
              <span aria-hidden className="text-muted-foreground/50">
                ·
              </span>
            </>
          ) : null}
          <span className="shrink-0 tabular-nums">
            {lines.length} {lines.length === 1 ? "line" : "lines"}
          </span>
        </div>
      </div>
    </div>
  );
}
