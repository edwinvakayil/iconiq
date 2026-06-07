"use client";

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

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { chartsApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { chartsPreviewCode } from "@/lib/component-v0-pages";
import { cn } from "@/lib/utils";
import {
  ChartBar,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/charts";

const barChartData = [
  { month: "Jan", sessions: 1240, conversions: 420 },
  { month: "Feb", sessions: 1580, conversions: 510 },
  { month: "Mar", sessions: 1420, conversions: 480 },
  { month: "Apr", sessions: 1890, conversions: 620 },
  { month: "May", sessions: 1760, conversions: 590 },
  { month: "Jun", sessions: 2100, conversions: 710 },
];

/** Values cross on a flat band so the lines overlap without trending up or down. */
const lineChartData = [
  { month: "Jan", sessions: 520, conversions: 480 },
  { month: "Feb", sessions: 470, conversions: 540 },
  { month: "Mar", sessions: 560, conversions: 505 },
  { month: "Apr", sessions: 495, conversions: 565 },
  { month: "May", sessions: 545, conversions: 490 },
  { month: "Jun", sessions: 485, conversions: 530 },
];

const lineChartDomain: [number, number] = [400, 600];

const chartConfig = {
  sessions: {
    label: "Sessions",
    color: "var(--chart-1)",
  },
  conversions: {
    label: "Conversions",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const chartSlides = [
  { id: "bar", label: "Bar chart" },
  { id: "line", label: "Line chart" },
] as const;

const carouselFade = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1] as const,
};

const chartPreviewClassName = "mx-auto w-full max-w-lg";

const details = chartsApiDetails.map((item) => {
  if (item.id !== "registry") {
    return item;
  }

  return {
    ...item,
    notes: [
      "Dependencies: recharts, motion.",
      "This page lives in the Components section, but the install is the shared Iconiq charts shell rather than a Radix UI or Base UI wrapper.",
      "The provider switch is shown for section consistency, but both Radix UI and Base UI options are disabled because Charts does not ship primitive-specific variants.",
      "The generated registry file is /r/charts.json.",
    ],
    registryPath: "charts.json",
  };
});

function BarChartSlide() {
  return (
    <ChartContainer className={chartPreviewClassName} config={chartConfig}>
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
        <ChartBar
          dataKey="sessions"
          fill="var(--color-sessions)"
          radius={4}
          seriesIndex={0}
        />
        <ChartBar
          dataKey="conversions"
          fill="var(--color-conversions)"
          radius={4}
          seriesIndex={1}
        />
      </BarChart>
    </ChartContainer>
  );
}

function LineChartSlide() {
  return (
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
        <Line
          dataKey="sessions"
          dot={false}
          stroke="var(--color-sessions)"
          strokeWidth={2}
          type="monotone"
        />
        <Line
          dataKey="conversions"
          dot={false}
          stroke="var(--color-conversions)"
          strokeWidth={2}
          type="monotone"
        />
      </LineChart>
    </ChartContainer>
  );
}

function ChartsPreview() {
  const [slideIndex, setSlideIndex] = useState(0);
  const reduceMotion = useReducedMotion() ?? false;
  const activeSlide = chartSlides[slideIndex];

  const goToSlide = (nextIndex: number) => {
    setSlideIndex((nextIndex + chartSlides.length) % chartSlides.length);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 px-4 py-6 sm:py-8">
      <div className="relative w-full overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            animate={{ opacity: 1 }}
            aria-label={activeSlide.label}
            className="w-full"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key={activeSlide.id}
            role="group"
            transition={reduceMotion ? { duration: 0 } : carouselFade}
          >
            {activeSlide.id === "bar" ? <BarChartSlide /> : <LineChartSlide />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex w-full items-center justify-between gap-3">
        <button
          aria-label="Previous chart"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={() => goToSlide(slideIndex - 1)}
          type="button"
        >
          <ChevronLeft aria-hidden className="size-4" />
        </button>

        <div
          aria-label="Chart examples"
          className="flex items-center gap-2"
          role="tablist"
        >
          {chartSlides.map((slide, index) => {
            const isActive = index === slideIndex;

            return (
              <button
                aria-label={slide.label}
                aria-selected={isActive}
                className={cn(
                  "rounded-full transition-[width,background-color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive
                    ? "h-2 w-6 bg-foreground"
                    : "size-2 bg-muted-foreground/35 hover:bg-muted-foreground/55"
                )}
                key={slide.id}
                onClick={() => goToSlide(index)}
                role="tab"
                type="button"
              />
            );
          })}
        </div>

        <button
          aria-label="Next chart"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={() => goToSlide(slideIndex + 1)}
          type="button"
        >
          <ChevronRight aria-hidden className="size-4" />
        </button>
      </div>

      <p className="text-center text-muted-foreground text-xs">
        {activeSlide.label}
      </p>
    </div>
  );
}

export default function ChartsPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Display & Content" },
        { label: "Charts" },
      ]}
      componentName="charts"
      description="Theme-aware Recharts for bar, line, and more—with motion and soft tooltips."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/charts/page.tsx`}
      headerActions={<SharedPrimitiveProviderSwitch />}
      pageUrl="/display-and-content/charts"
      preview={<ChartsPreview />}
      previewClassName="min-h-0 !p-0"
      previewCode={chartsPreviewCode}
      previewDescription="Swipe through bar and line examples in a carousel with prev/next controls, dot indicators, and local chart tokens."
      title="Charts"
      usageCode={chartsPreviewCode}
      usageDescription="Compose ChartContainer with Recharts primitives. Use ChartBar for the default fluid bar timing, and map series colors through ChartConfig or the local --chart-1 through --chart-5 defaults."
    />
  );
}
