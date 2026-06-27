const REACT_HOOK_USAGE = /\buse(State|Effect|Reducer|Ref|Memo|Callback)\b/;
const EXPORT_NAMED_FUNCTION = /export function \w+\s*\(/g;
const EXPORT_DEFAULT_NOT_PAGE = /export default function (?!Page)\w+\s*\(/g;
const USE_CLIENT_DIRECTIVE = /^["']use client["'];\s*/;
const IMPORT_BLOCK =
  /^((?:["']use client["'];\s*)?(?:import\s[\s\S]*?;[\r\n]*)*)/;
const PAGE_FUNCTION_START = /export default function Page\s*\(/;
const PAGE_FUNCTION_BODY =
  /export default function Page\(\)\s*\{([\s\S]*)\}\s*$/;
const TOP_LEVEL_DECLARATION = /^(?:const|let)\s/;
const USES_REACT_HOOKS = /\buse(?:Effect|Memo|Callback|LayoutEffect)\s*\(/;
const JSX_RETURN_PATTERN = /return\s*\(\s*(?:\n\s*)?</g;
const TRAILING_SEMICOLON = /;\s*$/;

function splitModulePreamble(body: string): {
  preamble: string;
  pageFunction: string;
} {
  const pageStart = body.search(PAGE_FUNCTION_START);

  if (pageStart === -1) {
    return { preamble: "", pageFunction: body };
  }

  return {
    preamble: body.slice(0, pageStart).trim(),
    pageFunction: body.slice(pageStart).trim(),
  };
}

function indentForFunctionBody(block: string): string {
  if (!block.trim()) {
    return "";
  }

  return block
    .split("\n")
    .map((line) => (line.length > 0 ? `  ${line}` : line))
    .join("\n");
}

function extractTopLevelDeclarations(fnBody: string): {
  declarations: string;
  remainder: string;
} {
  const lines = fnBody.split("\n");
  const declarationLines: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      if (declarationLines.length > 0) {
        break;
      }
      index += 1;
      continue;
    }

    if (!TOP_LEVEL_DECLARATION.test(trimmed)) {
      break;
    }

    let statement = line;
    index += 1;

    while (index < lines.length && !statement.includes(";")) {
      statement += `\n${lines[index]}`;
      index += 1;
    }

    declarationLines.push(statement);
  }

  return {
    declarations: declarationLines.join("\n").trim(),
    remainder: lines.slice(index).join("\n").trim(),
  };
}

function skipQuotedLiteral(
  source: string,
  start: number,
  quote: string
): number {
  let index = start + 1;

  while (index < source.length) {
    const char = source[index];

    if (char === "\\") {
      index += 2;
      continue;
    }

    if (char === quote) {
      return index + 1;
    }

    index += 1;
  }

  return source.length;
}

function skipLineComment(source: string, start: number): number {
  let index = start + 2;

  while (index < source.length && source[index] !== "\n") {
    index += 1;
  }

  return index;
}

function skipBlockComment(source: string, start: number): number {
  let index = start + 2;

  while (index < source.length - 1) {
    if (source[index] === "*" && source[index + 1] === "/") {
      return index + 2;
    }

    index += 1;
  }

  return source.length;
}

function balanceParentheses(source: string, openIndex: number): number {
  let depth = 0;

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (char === "'" || char === '"' || char === "`") {
      index = skipQuotedLiteral(source, index, char) - 1;
      continue;
    }

    if (char === "/" && next === "/") {
      index = skipLineComment(source, index) - 1;
      continue;
    }

    if (char === "/" && next === "*") {
      index = skipBlockComment(source, index) - 1;
      continue;
    }

    if (char === "(") {
      depth += 1;
    } else if (char === ")") {
      depth -= 1;

      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

function findLastJsxReturnOpenParen(fnBody: string): number {
  let lastOpenParen = -1;

  for (const match of fnBody.matchAll(JSX_RETURN_PATTERN)) {
    lastOpenParen = match.index + match[0].lastIndexOf("(");
  }

  return lastOpenParen;
}

function wrapJsxReturnInCanvas(fnBody: string, skipCanvas: boolean): string {
  if (skipCanvas) {
    return fnBody;
  }

  const openParen = findLastJsxReturnOpenParen(fnBody);

  if (openParen === -1) {
    const { hookBody, returnInner } = extractBareJsxReturn(fnBody);

    if (!returnInner) {
      return fnBody;
    }

    const wrappedInner = `${V0_CANVAS_SHELL}        ${returnInner}\n${V0_CANVAS_SHELL_CLOSE}`;
    const returnBlock = `  return (\n${wrappedInner}\n  );`;

    return hookBody ? `${hookBody}\n\n${returnBlock}` : returnBlock;
  }

  const closeIndex = balanceParentheses(fnBody, openParen);

  if (closeIndex === -1) {
    return fnBody;
  }

  const inner = fnBody.slice(openParen + 1, closeIndex).trim();

  return `${fnBody.slice(0, openParen + 1)}
${V0_CANVAS_SHELL}        ${inner}
${V0_CANVAS_SHELL_CLOSE}${fnBody.slice(closeIndex)}`;
}

function extractBareJsxReturn(fnBody: string): {
  hookBody: string;
  returnInner: string | null;
} {
  const trimmed = fnBody.trim();
  const returnIndex = trimmed.lastIndexOf("return");

  if (returnIndex === -1) {
    return { hookBody: trimmed, returnInner: null };
  }

  const afterReturn = trimmed.slice(returnIndex + "return".length).trimStart();

  if (!afterReturn.startsWith("<")) {
    return { hookBody: trimmed, returnInner: null };
  }

  return {
    hookBody: trimmed.slice(0, returnIndex).trim(),
    returnInner: afterReturn.replace(TRAILING_SEMICOLON, "").trim(),
  };
}

function extractMainReturn(fnBody: string): {
  hookBody: string;
  returnInner: string | null;
} {
  const openParen = findLastJsxReturnOpenParen(fnBody);

  if (openParen === -1) {
    return extractBareJsxReturn(fnBody);
  }

  const returnStart = fnBody.lastIndexOf("return", openParen);
  const closeIndex = balanceParentheses(fnBody, openParen);

  if (returnStart === -1 || closeIndex === -1) {
    return { hookBody: fnBody.trim(), returnInner: null };
  }

  return {
    hookBody: fnBody.slice(0, returnStart).trim(),
    returnInner: fnBody.slice(openParen + 1, closeIndex).trim(),
  };
}

function unwrapJsxReturnParens(inner: string): string {
  const trimmed = inner.trim();

  if (!(trimmed.startsWith("(") && trimmed.endsWith(")"))) {
    return trimmed;
  }

  const unwrapped = trimmed.slice(1, -1).trim();

  if (unwrapped.startsWith("<") || unwrapped.startsWith("<>")) {
    return unwrapped;
  }

  return trimmed;
}

function mergePageDeclarations(
  modulePreamble: string,
  functionDeclarations: string
): string {
  return [modulePreamble, functionDeclarations].filter(Boolean).join("\n\n");
}

const V0_CANVAS_SHELL = `    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-4xl flex-col items-center justify-center">
`;

const V0_CANVAS_SHELL_CLOSE = `      </div>
    </div>`;

/**
 * Converts a docs preview/usage snippet into a self-contained v0 `app/page.tsx`.
 */
export function buildV0Page(source: string): string {
  let code = source.trim();

  if (!USE_CLIENT_DIRECTIVE.test(code) && REACT_HOOK_USAGE.test(code)) {
    code = `"use client";\n\n${code}`;
  }

  const importMatch = code.match(IMPORT_BLOCK);
  const imports = importMatch?.[1]?.trim() ?? "";
  let body = importMatch ? code.slice(importMatch[1].length).trim() : code;

  body = body
    .replace(EXPORT_NAMED_FUNCTION, "export default function Page(")
    .replace(EXPORT_DEFAULT_NOT_PAGE, "export default function Page(");

  const { preamble, pageFunction } = splitModulePreamble(body);
  const fnBodyMatch = pageFunction.match(PAGE_FUNCTION_BODY);

  if (!fnBodyMatch) {
    const sections = [imports, preamble, pageFunction].filter(Boolean);
    return `${sections.join("\n\n")}\n`;
  }

  const fnBody = fnBodyMatch[1].trim();
  const skipCanvas = code.includes("min-h-svh");

  if (USES_REACT_HOOKS.test(fnBody)) {
    const wrappedBody = wrapJsxReturnInCanvas(fnBody, skipCanvas);
    const sections = [
      imports,
      preamble,
      `export default function Page() {
${indentForFunctionBody(wrappedBody)}
}`,
    ].filter(Boolean);

    return `${sections.join("\n\n")}\n`;
  }

  const { declarations: inFunctionDeclarations, remainder } =
    extractTopLevelDeclarations(fnBody);
  const { hookBody, returnInner } = extractMainReturn(remainder);

  if (!returnInner) {
    const sections = [imports, preamble, pageFunction].filter(Boolean);
    return `${sections.join("\n\n")}\n`;
  }

  const inner = unwrapJsxReturnParens(returnInner);

  const wrappedInner = skipCanvas
    ? inner
    : `${V0_CANVAS_SHELL}        ${inner}\n${V0_CANVAS_SHELL_CLOSE}`;

  const pageDeclarations = mergePageDeclarations(
    preamble,
    inFunctionDeclarations
  );
  const inlinedDeclarations = indentForFunctionBody(pageDeclarations);
  const inlinedHookBody = indentForFunctionBody(hookBody);
  const pageBodyPrefix = [inlinedDeclarations, inlinedHookBody]
    .filter(Boolean)
    .join("\n\n");

  const sections = [
    imports,
    `export default function Page() {
${pageBodyPrefix}${pageBodyPrefix ? "\n\n" : ""}  return (
${wrappedInner}
  );
}`,
  ].filter(Boolean);

  return `${sections.join("\n\n")}\n`;
}

export function ensureV0Page(source: string): string {
  const code = source.trim();

  if (!code) {
    return code;
  }

  if (PAGE_FUNCTION_START.test(code)) {
    return code.endsWith("\n") ? code : `${code}\n`;
  }

  return buildV0Page(code);
}

/** Avatar docs preview — matches the compound Avatar usageCode. */
export const avatarPreviewCode = `import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";

export function AvatarPreview() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <Avatar aria-label="shadcn/ui, online" tooltip="Online now">
        <AvatarImage src="/assets/shadcn.jpg" alt="shadcn/ui" />
        <AvatarFallback>SU</AvatarFallback>
        <AvatarBadge variant="online" />
      </Avatar>

      <AvatarGroup>
        <Avatar size="default">
          <AvatarImage src="/assets/av1.png" alt="Avatar 1" />
          <AvatarFallback>A1</AvatarFallback>
        </Avatar>
        <Avatar size="default">
          <AvatarImage src="/assets/av3.png" alt="Avatar 3" />
          <AvatarFallback>A3</AvatarFallback>
        </Avatar>
        <Avatar size="default">
          <AvatarImage src="/assets/av2.png" alt="Avatar 2" />
          <AvatarFallback>A2</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>
    </div>
  );
}`;

/** Badge docs preview for v0 export. */
export const badgePreviewCode = `import { Badge } from "@/components/ui/badge";

export function BadgePreview() {
  return (
    <div className="flex min-h-[260px] items-center justify-center px-4 py-8">
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance text-center font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100">
        <span>This update is</span>
        <span className="inline-flex translate-y-px align-middle">
          <Badge color="teal">Early Access</Badge>
        </span>
        <span>and</span>
        <span className="inline-flex translate-y-px align-middle">
          <Badge color="blue" variant="dot">
            On Track
          </Badge>
        </span>
        <span>.</span>
      </p>
    </div>
  );
}`;

export const chartsUsageCode = `"use client";

import { BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartBar,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/charts";

const chartData = [
  { month: "Jan", sessions: 1240, conversions: 420 },
  { month: "Feb", sessions: 1580, conversions: 510 },
  { month: "Mar", sessions: 1420, conversions: 480 },
  { month: "Apr", sessions: 1890, conversions: 620 },
  { month: "May", sessions: 1760, conversions: 590 },
  { month: "Jun", sessions: 2100, conversions: 710 },
];

const chartConfig = {
  sessions: { label: "Sessions", color: "var(--chart-1)" },
  conversions: { label: "Conversions", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function ChartsUsage() {
  return (
    <ChartContainer className="w-full max-w-lg" config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="month"
          tickFormatter={(value) => value.slice(0, 3)}
          tickLine={false}
          tickMargin={10}
        />
        <ChartTooltip cursor={false} />
        <ChartLegend />
        <ChartBar dataKey="sessions" fill="var(--color-sessions)" radius={4} seriesIndex={0} />
        <ChartBar dataKey="conversions" fill="var(--color-conversions)" radius={4} seriesIndex={1} />
      </BarChart>
    </ChartContainer>
  );
}`;

export const chartsPreviewCode = chartsUsageCode;

export const cardPreviewCode = `"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardImage,
  CardTitle,
} from "@/components/ui/card";

const artworkSrc = "/assets/gradient.png";
const currentDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const tagClassName =
  "inline-flex items-center rounded-md bg-muted px-2 py-0.5 font-medium text-[11px] text-foreground";

function formatCurrentDate() {
  return currentDateFormatter.format(new Date());
}

export function CardPreview() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(formatCurrentDate());
    };

    updateDate();
    const intervalId = window.setInterval(updateDate, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className="flex w-full flex-col items-center gap-4 text-center">
        <Card
          className="mx-auto w-full max-w-[16rem] border border-border/80 bg-background pt-0 text-left shadow-[0_18px_48px_-36px_rgba(15,23,42,0.22)] sm:max-w-[17.5rem]"
          interactive
        >
          <CardImage
            alt="Red and purple gradient artwork"
            className="aspect-[4/2.25] w-full object-cover"
            height={4000}
            sizes="(max-width: 640px) 100vw, 17.5rem"
            src={artworkSrc}
            width={6000}
          />

          <CardContent className="space-y-3 px-3.5 pt-3 pb-0 text-left">
            <div className="flex items-center justify-between gap-2">
              <Avatar className="size-7 shrink-0 ring-1 ring-black/5">
                <AvatarImage alt="" loading="lazy" src={artworkSrc} />
                <AvatarFallback className="text-[10px]">DS</AvatarFallback>
              </Avatar>
              <p className="text-right text-[11px] text-muted-foreground">
                {currentDate}
              </p>
            </div>

            <div className="space-y-2 text-left">
              <CardTitle className="text-left text-balance text-[0.95rem] font-normal leading-[1.15] tracking-[-0.04em]">
                Design Systems That Last
              </CardTitle>
              <CardDescription className="w-full text-left text-pretty text-[12px] leading-[1.35] text-muted-foreground">
                Steady patterns keep interfaces coherent as products grow.
              </CardDescription>
            </div>

            <button
              className="inline-flex h-8 w-fit items-center justify-center self-start rounded-md border border-border px-3 font-medium text-[12px] text-foreground transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              type="button"
            >
              Read more
            </button>
          </CardContent>

          <CardFooter className="items-center justify-between gap-2 border-t-0 bg-transparent px-3.5 pt-3.5 pb-3.5">
            <span className="text-[11px] text-muted-foreground">Categories</span>
            <div className="flex flex-wrap justify-end gap-1">
              <span className={tagClassName}>Marketing</span>
              <span className={tagClassName}>UI Design</span>
            </div>
          </CardFooter>
        </Card>

        <p className="max-w-xs text-balance text-center text-[15px] text-muted-foreground leading-relaxed sm:max-w-sm sm:text-base">
          Headline, excerpt, and next step—kept in one compact card.
        </p>
      </div>
    </div>
  );
}`;

/** Skeleton docs preview uses ShimmerSkeleton (registry export name). */
export const skeletonPreviewCode = `"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonPreview() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading profile"
      className="w-full max-w-sm rounded-lg bg-card p-4"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11" rounded="full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" rounded="sm" />
        </div>
      </div>
      <div className="mt-5 space-y-2.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[92%]" />
        <Skeleton className="h-3 w-[78%]" />
      </div>
    </div>
  );
}`;

export const spinnerPreviewCode = `"use client";

import Spinner from "@/components/ui/spinner";

export function SpinnerPreview() {
  return (
    <p className="flex max-w-xl flex-wrap items-center justify-center gap-x-1.5 gap-y-2.5 text-center text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-300">
      <span className="text-neutral-500 dark:text-neutral-400">
        Every stall deserves a kinder signal —
      </span>
      <Spinner className="shrink-0" decorative size="sm" />
      <span className="font-medium text-sky-600 dark:text-sky-400">
        calm motion that still reads.
      </span>
    </p>
  );
}`;

export const carouselPreviewSlides = [
  "Ship interfaces that feel polished from the first slide.",
  "Motion, spacing, and type that stay in sync.",
  "Drop in components—skip the layout guesswork.",
  "Scroll stories without losing your rhythm.",
  "Build faster. Keep the craft.",
] as const;

const carouselPreviewImports = `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";`;

const carouselPreviewSlidesCode = `const slides = [
  ${carouselPreviewSlides.map((slide) => JSON.stringify(slide)).join(",\n  ")},
] as const;`;

function buildCarouselDemoMarkup(aspectRatio: string) {
  return `    <Carousel aspectRatio="${aspectRatio}" className="w-full max-w-md sm:max-w-lg sm:px-12">
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide}>
            <div className="flex h-full items-center justify-center p-1">
              <p className="px-6 text-center font-light text-lg leading-snug text-balance text-muted-foreground">
                {slide}
              </p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>`;
}

export function buildCarouselPreviewCode(
  aspectRatio = "video",
  variant: "usage" | "v0" = "usage"
) {
  const demo = buildCarouselDemoMarkup(aspectRatio);

  if (variant === "v0") {
    return `"use client";

${carouselPreviewImports}

export default function Page() {
${carouselPreviewSlidesCode}
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-8">
${demo}
    </div>
  );
}`;
  }

  return `"use client";

${carouselPreviewImports}

export function CarouselPreview() {
${carouselPreviewSlidesCode}
  return (
${demo}
  );
}`;
}

export const carouselPreviewCode = buildCarouselPreviewCode("video", "v0");

export const rollingDigitsPreviewCode = `"use client";

import { useEffect, useState } from "react";
import { RollingDigits } from "@/components/ui/rolling-digits";

export default function Page() {
  const [days, setDays] = useState(12);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setDays((current) => (current <= 0 ? 12 : current - 1));
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-8">
      <div className="flex max-w-xl flex-wrap items-center justify-center gap-x-1.5 gap-y-2 text-balance text-center font-medium text-lg leading-snug dark:text-neutral-100">
        <span>Early access opens in</span>
        <span className="inline-flex translate-y-px items-center align-middle">
          <RollingDigits value={days} pad={2} startOnView={false} />
        </span>
        <span>days.</span>
      </div>
    </div>
  );
}`;

export const faviconBadgePreviewCode = `"use client";

import { motion } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

import { FaviconBadge } from "@/components/ui/favicon-badge";
import { cn } from "@/lib/utils";

const previewSentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

const inlineWebsiteTextClassName =
  "font-medium text-lg leading-snug tracking-tight sm:text-xl";

const inlineWebsiteInputClassName =
  "relative z-10 border-0 bg-transparent p-0 text-neutral-800 caret-transparent outline-none placeholder:text-muted-foreground focus-visible:outline-none dark:text-neutral-100";

function BlinkingCaret({ left }: { left: number }) {
  return (
    <motion.span
      animate={{ opacity: [1, 1, 0, 0] }}
      aria-hidden
      className="pointer-events-none absolute top-1/2 h-[0.92em] w-px -translate-y-1/2 bg-neutral-800 dark:bg-neutral-100"
      style={{ left }}
      transition={{
        duration: 1,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
        times: [0, 0.49, 0.5, 1],
      }}
    />
  );
}

function InlineWebsiteField({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const valueMeasureRef = useRef<HTMLSpanElement>(null);
  const fieldMeasureRef = useRef<HTMLSpanElement>(null);
  const [valueWidth, setValueWidth] = useState(0);
  const [fieldWidth, setFieldWidth] = useState(0);

  const placeholder = "your site";
  const fieldMeasureText = value || placeholder;

  useLayoutEffect(() => {
    const measure = () => {
      setValueWidth(valueMeasureRef.current?.offsetWidth ?? 0);
      setFieldWidth(fieldMeasureRef.current?.offsetWidth ?? 0);
    };

    measure();
    window.addEventListener("resize", measure);

    return () => window.removeEventListener("resize", measure);
  });

  const caretLeft = value ? valueWidth : 0;
  const inputWidth = Math.max(fieldWidth, 12);

  return (
    <span
      className="group relative inline-block translate-y-px cursor-text align-baseline"
      onClick={() => inputRef.current?.focus()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          inputRef.current?.focus();
        }
      }}
      role="presentation"
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none invisible absolute whitespace-pre",
          inlineWebsiteTextClassName,
        )}
        ref={valueMeasureRef}
      >
        {value}
      </span>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none invisible absolute whitespace-pre",
          inlineWebsiteTextClassName,
        )}
        ref={fieldMeasureRef}
      >
        {fieldMeasureText}
      </span>
      <input
        aria-label="Website"
        className={cn(inlineWebsiteInputClassName, inlineWebsiteTextClassName)}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        ref={inputRef}
        spellCheck={false}
        style={{ width: inputWidth }}
        type="text"
        value={value}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-px origin-left scale-x-0 bg-neutral-800 transition-transform duration-200 group-focus-within:scale-x-100 dark:bg-neutral-100"
        style={{ width: inputWidth }}
      />
      <BlinkingCaret left={caretLeft} />
    </span>
  );
}

export default function Page() {
  const [website, setWebsite] = useState("iconiqui.com");

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-8">
      <div className={cn(previewSentenceClassName, "max-w-2xl text-center")}>
        <span>Attributed to</span>
        <span className="inline-flex translate-y-px align-middle">
          <FaviconBadge size="md" website={website} />
        </span>
        <span>for</span>
        <InlineWebsiteField onChange={setWebsite} value={website} />
        <span>.</span>
      </div>
    </div>
  );
}`;

export const verifiedBadgePreviewCode = `"use client";

import { VerifiedBadge } from "@/components/ui/verified-badge";

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-8">
      <span className="inline-flex items-center gap-1.5">
        <span className="font-semibold text-foreground text-xl tracking-tight">
          Iconiq UI
        </span>
        <VerifiedBadge className="translate-y-px" />
      </span>
    </div>
  );
}`;

export const themeTogglePreviewCode = `"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-8">
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-balance text-[13px] text-muted-foreground leading-snug tracking-tight sm:text-sm">
        <span>Switch between light</span>
        <span className="inline-flex translate-y-px items-center align-middle">
          <ThemeToggle size="md" />
        </span>
        <span>and dark.</span>
      </p>
    </div>
  );
}`;

export const timezonePreviewCode = `"use client";

import { Timezone } from "@/components/ui/timezone";

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-8">
      <div className="flex max-w-2xl flex-wrap items-baseline justify-center gap-x-2 gap-y-2 text-balance text-center font-medium text-sm text-neutral-800 leading-snug tracking-tight sm:text-base dark:text-neutral-100">
        <span>Right now in</span>
        <span>San Francisco</span>
        <span>it is</span>
        <Timezone live showZoneLabel zone="San Francisco" zoneName="abbreviation" />
        <span>for the west coast team.</span>
      </div>
    </div>
  );
}`;

export const statusDotPreviewCode = `"use client";

import { StatusDot } from "@/components/ui/status-dot";

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-8">
      <p className="flex max-w-2xl flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance text-center font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100">
        <span>Right now, production is</span>
        <StatusDot className="translate-y-px" state="READY" />
        <span>live for every region.</span>
      </p>
    </div>
  );
}`;

export const infiniteRibbonPreviewCode = `"use client";

import { InfiniteRibbon } from "@/components/ui/infiniteribbon";

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background px-6 py-20">
      <InfiniteRibbon className="absolute" duration={42} rotation={5}>
        Craft crisp dashboards, lively landing pages, and polished product flows
        with components that feel ready from the first click.
      </InfiniteRibbon>
      <InfiniteRibbon duration={42} reverse={true} rotation={-5}>
        Craft crisp dashboards, lively landing pages, and polished product flows
        with components that feel ready from the first click.
      </InfiniteRibbon>
    </div>
  );
}`;

export const alertPreviewCode = `"use client";

import {
  CheckCircle2Icon,
  CircleAlert,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const appearanceOptions = [
  { value: "default", label: "Default" },
  { value: "warning", label: "Warning" },
  { value: "destructive", label: "Destructive" },
] as const;

const appearanceContent = {
  default: {
    Icon: CheckCircle2Icon,
    title: "Changes saved",
    description: "The latest version is live for your team.",
  },
  warning: {
    Icon: TriangleAlert,
    title: "Unsaved changes detected",
    description: "Save now or recent edits may be lost.",
  },
  destructive: {
    Icon: CircleAlert,
    title: "Upload failed",
    description: "Try again in a moment.",
  },
} as const;

export function AlertPreview() {
  const [appearance, setAppearance] = useState<
    "default" | "warning" | "destructive"
  >("default");

  const { description, Icon, title } = appearanceContent[appearance];

  return (
    <div className="flex w-full flex-col items-center gap-6 px-4 py-6 sm:px-8 sm:py-8">
      <fieldset
        aria-label="Alert appearance"
        className="m-0 flex flex-wrap items-center justify-center gap-4 border-0 p-0"
      >
        {appearanceOptions.map((option) => {
          const isSelected = appearance === option.value;

          return (
            <button
              aria-pressed={isSelected}
              className={cn(
                "text-[13px] transition-colors",
                isSelected
                  ? "font-medium text-foreground"
                  : "font-light text-muted-foreground hover:text-foreground"
              )}
              key={option.value}
              onClick={() => setAppearance(option.value)}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </fieldset>

      <Alert appearance={appearance} className="w-full">
        <Icon />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </div>
  );
}`;

const COMPONENT_PREVIEW_OVERRIDES: Record<string, string> = {
  alert: alertPreviewCode,
  avatar: avatarPreviewCode,
  badge: badgePreviewCode,
  charts: chartsPreviewCode,
  card: cardPreviewCode,
  infiniteribbon: infiniteRibbonPreviewCode,
  "theme-toggle": themeTogglePreviewCode,
  "favicon-badge": faviconBadgePreviewCode,
  "verified-badge": verifiedBadgePreviewCode,
  "rolling-digits": rollingDigitsPreviewCode,
  carousel: carouselPreviewCode,
  skeleton: skeletonPreviewCode,
  spinner: spinnerPreviewCode,
  "status-dot": statusDotPreviewCode,
  timezone: timezonePreviewCode,
};

export function getComponentV0Page(
  componentName: string,
  previewSource?: string
): string {
  const source =
    previewSource ?? COMPONENT_PREVIEW_OVERRIDES[componentName] ?? "";

  if (!source) {
    return "";
  }

  return buildV0Page(source);
}
