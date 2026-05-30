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
  AvatarImage,
} from "@/components/ui/avatar";

export function AvatarPreview() {
  return (
    <Avatar size="lg" tooltip="online">
      <AvatarImage src="/assets/shadcn.jpg" alt="shadcn/ui" />
      <AvatarFallback>SU</AvatarFallback>
      <AvatarBadge />
    </Avatar>
  );
}`;

/** Badge docs preview uses custom tone objects (not in usageCode). */
export const badgePreviewCode = `import { Badge } from "@/components/ui/badge";

const launchBadgeTone = {
  className:
    "[--badge-bg:#ccfbf1] [--badge-fg:#115e59] dark:[--badge-bg:#99f6e4] dark:[--badge-fg:#134e4a]",
  style: {
    backgroundColor: "var(--badge-bg)",
    color: "var(--badge-fg)",
  },
};

const betaBadgeTone = {
  className:
    "[--badge-bg:#ffedd5] [--badge-fg:#9a3412] dark:[--badge-bg:#fed7aa] dark:[--badge-fg:#7c2d12]",
  style: {
    backgroundColor: "var(--badge-bg)",
    color: "var(--badge-fg)",
  },
};

const shippingBadgeTone = {
  className:
    "[--badge-bg:#fce7f3] [--badge-fg:#9d174d] dark:[--badge-bg:#fbcfe8] dark:[--badge-fg:#831843]",
  style: {
    backgroundColor: "var(--badge-bg)",
    color: "var(--badge-fg)",
  },
};

export function BadgePreview() {
  return (
    <div className="flex min-h-[260px] flex-1 items-center justify-center px-4 py-8">
      <p className="max-w-2xl text-center font-medium text-lg leading-relaxed text-neutral-800 dark:text-neutral-100 sm:text-xl">
        Mark the beat with a{" "}
        <Badge {...launchBadgeTone} color="teal">
          Fresh Launch
        </Badge>{" "}
        tag for releases,{" "}
        <Badge {...betaBadgeTone} color="orange">
          Private Beta
        </Badge>{" "}
        while you are still tuning,{" "}
        <Badge {...shippingBadgeTone} color="pink">
          Now Shipping
        </Badge>{" "}
        once it is out the door, and a quieter{" "}
        <Badge color="blue" variant="dot">
          Status Monitoring
        </Badge>{" "}
        pulse when the release just needs a status check.
      </p>
    </div>
  );
}`;

export const chartsPreviewCode = `"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import {
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartBar,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/charts";
import { cn } from "@/lib/utils";

const barChartData = [
  { month: "Jan", sessions: 1240, conversions: 420 },
  { month: "Feb", sessions: 1580, conversions: 510 },
  { month: "Mar", sessions: 1420, conversions: 480 },
  { month: "Apr", sessions: 1890, conversions: 620 },
  { month: "May", sessions: 1760, conversions: 590 },
  { month: "Jun", sessions: 2100, conversions: 710 },
];

const lineChartData = [
  { month: "Jan", sessions: 520, conversions: 480 },
  { month: "Feb", sessions: 470, conversions: 540 },
  { month: "Mar", sessions: 560, conversions: 505 },
  { month: "Apr", sessions: 495, conversions: 565 },
  { month: "May", sessions: 545, conversions: 490 },
  { month: "Jun", sessions: 485, conversions: 530 },
];

const lineChartDomain = [400, 600];

const chartConfig = {
  sessions: { label: "Sessions", color: "var(--chart-1)" },
  conversions: { label: "Conversions", color: "var(--chart-2)" },
} satisfies ChartConfig;

const chartSlides = [
  { id: "bar", label: "Bar chart" },
  { id: "line", label: "Line chart" },
] as const;

const chartPreviewClassName = "mx-auto w-full max-w-lg";

export function ChartsPreview() {
  const [slideIndex, setSlideIndex] = useState(0);
  const reduceMotion = useReducedMotion() ?? false;
  const activeSlide = chartSlides[slideIndex];

  const goToSlide = (nextIndex: number) => {
    setSlideIndex((nextIndex + chartSlides.length) % chartSlides.length);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5">
      <div className="relative w-full overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {activeSlide.id === "bar" ? (
              <ChartContainer className="w-full" config={chartConfig}>
                <BarChart accessibilityLayer data={barChartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey="month"
                    tickFormatter={(value) => value.slice(0, 3)}
                    tickLine={false}
                    tickMargin={10}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="dashed" />}
                    cursor={false}
                  />
                  <ChartBar dataKey="sessions" fill="var(--color-sessions)" radius={4} seriesIndex={0} />
                  <ChartBar dataKey="conversions" fill="var(--color-conversions)" radius={4} seriesIndex={1} />
                </BarChart>
              </ChartContainer>
            ) : (
              <ChartContainer className={chartPreviewClassName} config={chartConfig}>
                <LineChart accessibilityLayer data={lineChartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    axisLine={false}
                    dataKey="month"
                    tickFormatter={(value) => value.slice(0, 3)}
                    tickLine={false}
                    tickMargin={10}
                  />
                  <YAxis domain={lineChartDomain} hide />
                  <ChartTooltip
                    content={<ChartTooltipContent indicator="dot" />}
                    cursor={false}
                  />
                  <Line dataKey="sessions" type="monotone" stroke="var(--color-sessions)" strokeWidth={2} dot={false} />
                  <Line dataKey="conversions" type="monotone" stroke="var(--color-conversions)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex w-full items-center justify-between gap-3">
        <button
          type="button"
          aria-label="Previous chart"
          className="inline-flex size-8 items-center justify-center rounded-md border border-border"
          onClick={() => goToSlide(slideIndex - 1)}
        >
          <ChevronLeft className="size-4" />
        </button>
        <div className="flex items-center gap-2" role="tablist" aria-label="Chart examples">
          {chartSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-label={slide.label}
              aria-selected={index === slideIndex}
              className={cn(
                "rounded-full transition-[width,background-color] duration-300",
                index === slideIndex ? "h-2 w-6 bg-foreground" : "size-2 bg-muted-foreground/35"
              )}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next chart"
          className="inline-flex size-8 items-center justify-center rounded-md border border-border"
          onClick={() => goToSlide(slideIndex + 1)}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <p className="text-center text-xs text-muted-foreground">{activeSlide.label}</p>
    </div>
  );
}`;

export const cardPreviewCode = `"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

const artworkSrc = "/assets/gradient.png";
const currentDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const tagClassName =
  "inline-flex items-center rounded-md bg-muted px-2.5 py-1 font-medium text-[12px] text-foreground";

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
    <Card
      className="mx-auto w-full max-w-[21rem] overflow-hidden rounded-[1.1rem] border border-border/80 bg-background pt-0 shadow-[0_24px_70px_-46px_rgba(15,23,42,0.24)] sm:max-w-[23rem]"
      interactive
    >
      <div className="px-[1.5px] pt-[1.5px]">
        <Image
          alt="Red and purple gradient artwork"
          className="aspect-[4/2.2] w-full rounded-[0.85rem] object-cover"
          height={4000}
          sizes="(max-width: 640px) 100vw, 23rem"
          src={artworkSrc}
          width={6000}
        />
      </div>

      <CardContent className="space-y-3 px-3.5 pt-3 pb-0 sm:px-4 sm:pt-3.5">
        <div className="flex items-center justify-between gap-3">
          <Avatar className="size-8 shrink-0 ring-1 ring-black/5">
            <AvatarImage alt="" loading="lazy" src={artworkSrc} />
            <AvatarFallback>DS</AvatarFallback>
          </Avatar>
          <p className="text-right text-[12px] text-muted-foreground sm:text-[13px]">
            {currentDate}
          </p>
        </div>

        <div className="space-y-2.5">
          <CardTitle className="whitespace-nowrap text-[1rem] font-normal leading-[1.08] tracking-[-0.05em] sm:text-[1.08rem]">
            Design Systems That Age Gracefully
          </CardTitle>
          <CardDescription className="w-full text-pretty text-[12px] leading-5 text-muted-foreground sm:text-[13px] sm:leading-6">
            Lasting interfaces come from steady patterns, resilient
            foundations, and decisions that remain coherent as products grow.
          </CardDescription>
        </div>

        <button
          className="inline-flex h-8 w-fit items-center justify-center rounded-md border border-border px-3.5 font-medium text-[12px] text-foreground transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          type="button"
        >
          Read more
        </button>
      </CardContent>

      <CardFooter className="items-center justify-between gap-2.5 border-t-0 bg-transparent px-3.5 pt-4 pb-3.5 sm:px-4 sm:pb-4">
        <span className="text-[12px] text-muted-foreground sm:text-[13px]">
          Categories
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          <span className={tagClassName}>Marketing</span>
          <span className={tagClassName}>UI Design</span>
        </div>
      </CardFooter>
    </Card>
  );
}`;

/** Skeleton docs preview uses ShimmerSkeleton (registry export name). */
export const skeletonPreviewCode = `"use client";

import { ShimmerSkeleton } from "@/components/ui/skeleton";

export function SkeletonPreview() {
  return (
    <div className="flex min-h-[300px] w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-lg bg-card p-4">
        <div className="flex items-center gap-3">
          <ShimmerSkeleton className="h-11 w-11" rounded="full" />
          <div className="flex-1 space-y-2">
            <ShimmerSkeleton className="h-4 w-32" />
            <ShimmerSkeleton className="h-3 w-24" rounded="sm" />
          </div>
        </div>
        <div className="mt-5 space-y-2.5">
          <ShimmerSkeleton className="h-3 w-full" />
          <ShimmerSkeleton className="h-3 w-[92%]" />
          <ShimmerSkeleton className="h-3 w-[78%]" />
        </div>
      </div>
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

const COMPONENT_PREVIEW_OVERRIDES: Record<string, string> = {
  avatar: avatarPreviewCode,
  badge: badgePreviewCode,
  charts: chartsPreviewCode,
  card: cardPreviewCode,
  infiniteribbon: infiniteRibbonPreviewCode,
  skeleton: skeletonPreviewCode,
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
