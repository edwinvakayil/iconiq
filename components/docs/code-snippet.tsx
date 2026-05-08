"use client";

import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HighlightTokenKind =
  | "call"
  | "comment"
  | "keyword"
  | "number"
  | "operator"
  | "plain"
  | "property"
  | "string"
  | "tag"
  | "type";

type HighlightToken = {
  kind: HighlightTokenKind;
  value: string;
};

type StaticTokenMatcher = {
  kind: Exclude<HighlightTokenKind, "call" | "plain" | "type"> | "plain";
  regex: RegExp;
};

const KEYWORDS = new Set([
  "as",
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "default",
  "else",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "from",
  "function",
  "if",
  "import",
  "in",
  "interface",
  "let",
  "new",
  "null",
  "of",
  "return",
  "throw",
  "true",
  "try",
  "type",
  "undefined",
  "var",
  "while",
]);

const WHITESPACE_RE = /^\s+/;
const BLOCK_COMMENT_RE = /^\/\*[\s\S]*?(?:\*\/|$)/;
const LINE_COMMENT_RE = /^\/\/[^\n]*/;
const TEMPLATE_STRING_RE = /^`(?:\\.|[\s\S])*?`/;
const DOUBLE_QUOTED_STRING_RE = /^"(?:\\.|[^"\\])*"/;
const SINGLE_QUOTED_STRING_RE = /^'(?:\\.|[^'\\])*'/;
const TAG_RE = /^<\/?[A-Za-z][\w.-]*/;
const ATTRIBUTE_RE = /^[A-Za-z_$][\w$-]*(?==)/;
const PROPERTY_RE = /^[A-Za-z_$][\w$-]*(?=\s*:)/;
const IDENTIFIER_RE = /^[A-Za-z_$][\w$]*/;
const TYPE_IDENTIFIER_RE = /^[A-Z]/;
const CALL_IDENTIFIER_RE = /^\w+$/;
const NUMBER_RE = /^-?\d+(?:\.\d+)?/;
const OPERATOR_RE =
  /^(?:=>|===|!==|==|!=|<=|>=|\+\+|--|\|\||&&|[=<>+\-*/%!?&|])/;

const STATIC_TOKEN_MATCHERS: StaticTokenMatcher[] = [
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
];

const tokenClassNames: Record<HighlightTokenKind, string> = {
  plain: "text-[#24292f] dark:text-[#e6edf3]",
  comment: "text-[#6e7781] dark:text-[#8b949e]",
  keyword: "text-[#cf222e] dark:text-[#ff7b72]",
  string: "text-[#0a3069] dark:text-[#a5d6ff]",
  number: "text-[#0550ae] dark:text-[#79c0ff]",
  property: "text-[#0550ae] dark:text-[#79c0ff]",
  call: "text-[#8250df] dark:text-[#d2a8ff]",
  type: "text-[#953800] dark:text-[#ffa657]",
  tag: "text-[#116329] dark:text-[#7ee787]",
  operator: "text-[#24292f] dark:text-[#e6edf3]",
};

function match(source: string, expression: RegExp) {
  return expression.exec(source)?.[0] ?? null;
}

function readStaticToken(source: string): HighlightToken | null {
  for (const matcher of STATIC_TOKEN_MATCHERS) {
    const value = match(source, matcher.regex);

    if (value) {
      return { kind: matcher.kind, value };
    }
  }

  return null;
}

function getIdentifierKind(
  identifier: string,
  source: string
): HighlightTokenKind {
  if (KEYWORDS.has(identifier)) {
    return "keyword";
  }

  if (TYPE_IDENTIFIER_RE.test(identifier)) {
    return "type";
  }

  if (
    CALL_IDENTIFIER_RE.test(identifier) &&
    source.startsWith(`${identifier}(`)
  ) {
    return "call";
  }

  return "plain";
}

function readDynamicToken(source: string): HighlightToken {
  const identifier = match(source, IDENTIFIER_RE);

  if (identifier) {
    return {
      kind: getIdentifierKind(identifier, source),
      value: identifier,
    };
  }

  return {
    kind: "plain",
    value: source[0] ?? "",
  };
}

function tokenizeCode(code: string): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  let cursor = 0;

  while (cursor < code.length) {
    const source = code.slice(cursor);
    const token = readStaticToken(source) ?? readDynamicToken(source);

    tokens.push(token);
    cursor += token.value.length;
  }

  return tokens;
}

export function DocsCodeSnippet({
  code,
  className,
  maxHeightClassName = "max-h-80",
}: {
  code: string;
  className?: string;
  maxHeightClassName?: string;
}) {
  const [copied, setCopied] = useState(false);
  const tokens = useMemo(() => tokenizeCode(code), [code]);
  const prefersReducedMotion = useReducedMotion();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={cn("relative", className)} data-code-container="true">
      <pre
        className={cn(
          "overflow-x-auto rounded-sm border border-border/80 bg-background font-mono text-sm leading-6",
          maxHeightClassName
        )}
      >
        <code className="block min-w-full whitespace-pre px-5 py-4">
          {tokens.map((token, index) => (
            <span
              className={tokenClassNames[token.kind]}
              key={`${token.kind}-${index}`}
            >
              {token.value}
            </span>
          ))}
        </code>
      </pre>
      <motion.div
        animate={
          prefersReducedMotion || !copied
            ? undefined
            : { scale: [1, 0.94, 1.06, 1], y: [0, -1, 0] }
        }
        className="absolute top-2.5 right-2.5"
        transition={{
          duration: 0.36,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <Button
          className="size-7 border-0 bg-transparent shadow-none hover:bg-muted/70 dark:bg-[#191919] dark:hover:bg-[#212121]"
          onClick={handleCopy}
          size="icon"
          variant="ghost"
        >
          <span className="sr-only">Copy code</span>
          <span className="relative inline-flex size-4 items-center justify-center">
            <AnimatePresence initial={false} mode="wait">
              {copied ? (
                <motion.span
                  animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                  exit={{ opacity: 0, rotate: 8, scale: 0.72, y: -2 }}
                  initial={{ opacity: 0, rotate: -8, scale: 0.72, y: 2 }}
                  key="copied"
                  transition={{
                    duration: 0.22,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Check className="size-3.5 text-emerald-500" />
                </motion.span>
              ) : (
                <motion.span
                  animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                  exit={{ opacity: 0, rotate: -8, scale: 0.72, y: -2 }}
                  initial={{ opacity: 0, rotate: 8, scale: 0.72, y: 2 }}
                  key="copy"
                  transition={{
                    duration: 0.22,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Copy className="size-3.5" />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </Button>
      </motion.div>
    </div>
  );
}
