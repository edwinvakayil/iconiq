"use client";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { ChartsPlaygroundProvider } from "@/app/(site)/display-and-content/charts/_components/charts-playground";
import { chartsApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { chartsUsageCode } from "@/lib/component-v0-pages";
import * as ChartsModule from "@/registry/charts";

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

const chartExamples: VariantItem[] = [
  {
    title: "Line chart with legend",
    code: `"use client";

import { CartesianGrid, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLine,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/charts";

const chartData = [
  { month: "Jan", sessions: 520, conversions: 480 },
  { month: "Feb", sessions: 470, conversions: 540 },
  { month: "Mar", sessions: 560, conversions: 505 },
];

const chartConfig = {
  sessions: { label: "Sessions", color: "var(--chart-1)" },
  conversions: { label: "Conversions", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function ChartsLineExample() {
  return (
    <ChartContainer className="w-full max-w-lg" config={chartConfig}>
      <LineChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis axisLine={false} dataKey="month" tickLine={false} />
        <YAxis domain={[400, 600]} hide />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} cursor={false} />
        <ChartLegend />
        <ChartLine dataKey="sessions" dot={false} seriesIndex={0} stroke="var(--color-sessions)" strokeWidth={2} type="monotone" />
        <ChartLine dataKey="conversions" dot={false} seriesIndex={1} stroke="var(--color-conversions)" strokeWidth={2} type="monotone" />
      </LineChart>
    </ChartContainer>
  );
}`,
  },
  {
    title: "Area chart",
    code: `"use client";

import { AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartArea,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/charts";

const chartData = [
  { month: "Jan", sessions: 1240, conversions: 420 },
  { month: "Feb", sessions: 1580, conversions: 510 },
  { month: "Mar", sessions: 1420, conversions: 480 },
];

const chartConfig = {
  sessions: { label: "Sessions", color: "var(--chart-1)" },
  conversions: { label: "Conversions", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function ChartsAreaExample() {
  return (
    <ChartContainer className="w-full max-w-lg" config={chartConfig}>
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis axisLine={false} dataKey="month" tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <ChartTooltip cursor={false} />
        <ChartLegend />
        <ChartArea dataKey="sessions" fill="var(--color-sessions)" fillOpacity={0.24} seriesIndex={0} stroke="var(--color-sessions)" type="monotone" />
        <ChartArea dataKey="conversions" fill="var(--color-conversions)" fillOpacity={0.2} seriesIndex={1} stroke="var(--color-conversions)" type="monotone" />
      </AreaChart>
    </ChartContainer>
  );
}`,
  },
  {
    title: "Stacked bars",
    code: `"use client";

import { BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartBar,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/charts";

const chartData = [
  { month: "Jan", direct: 320, referral: 180 },
  { month: "Feb", direct: 410, referral: 210 },
  { month: "Mar", direct: 360, referral: 240 },
];

const chartConfig = {
  direct: { label: "Direct", color: "var(--chart-1)" },
  referral: { label: "Referral", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function ChartsStackedExample() {
  return (
    <ChartContainer className="w-full max-w-lg" config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis axisLine={false} dataKey="month" tickLine={false} />
        <ChartTooltip cursor={false} />
        <ChartLegend />
        <ChartBar dataKey="direct" fill="var(--color-direct)" radius={4} seriesIndex={0} stackId="traffic" />
        <ChartBar dataKey="referral" fill="var(--color-referral)" radius={4} seriesIndex={1} stackId="traffic" />
      </BarChart>
    </ChartContainer>
  );
}`,
  },
  {
    title: "Radar chart",
    code: `"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/charts";

const radarData = [
  { metric: "Speed", product: 82, competitor: 68 },
  { metric: "Support", product: 74, competitor: 81 },
  { metric: "Price", product: 63, competitor: 72 },
  { metric: "Features", product: 88, competitor: 70 },
  { metric: "Reliability", product: 79, competitor: 76 },
];

const chartConfig = {
  product: { label: "Product", color: "var(--chart-1)" },
  competitor: { label: "Competitor", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function ChartsRadarExample() {
  return (
    <ChartContainer className="w-full max-w-lg" config={chartConfig}>
      <RadarChart data={radarData}>
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} cursor={false} />
        <ChartLegend />
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" tickLine={false} />
        <Radar dataKey="product" fill="var(--color-product)" fillOpacity={0.2} stroke="var(--color-product)" strokeWidth={2} />
        <Radar dataKey="competitor" fill="var(--color-competitor)" fillOpacity={0.16} stroke="var(--color-competitor)" strokeWidth={2} />
      </RadarChart>
    </ChartContainer>
  );
}`,
  },
  {
    title: "Radial bar chart",
    code: `"use client";

import { RadialBar, RadialBarChart } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/charts";

const radialData = [
  { channel: "organic", value: 84, fill: "var(--color-organic)" },
  { channel: "paid", value: 68, fill: "var(--color-paid)" },
  { channel: "email", value: 52, fill: "var(--color-email)" },
  { channel: "social", value: 41, fill: "var(--color-social)" },
];

const chartConfig = {
  organic: { label: "Organic", color: "var(--chart-1)" },
  paid: { label: "Paid", color: "var(--chart-2)" },
  email: { label: "Email", color: "var(--chart-3)" },
  social: { label: "Social", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function ChartsRadialExample() {
  return (
    <ChartContainer className="w-full max-w-lg" config={chartConfig} seriesCount={4}>
      <RadialBarChart data={radialData} innerRadius={36} outerRadius={112}>
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <ChartLegend nameKey="channel" />
        <RadialBar background cornerRadius={4} dataKey="value" />
      </RadialBarChart>
    </ChartContainer>
  );
}`,
  },
  {
    title: "Pie chart",
    code: `"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/charts";

const pieData = [
  { channel: "organic", value: 42 },
  { channel: "paid", value: 28 },
  { channel: "email", value: 18 },
  { channel: "social", value: 12 },
];

const chartConfig = {
  organic: { label: "Organic", color: "var(--chart-1)" },
  paid: { label: "Paid", color: "var(--chart-2)" },
  email: { label: "Email", color: "var(--chart-3)" },
  social: { label: "Social", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function ChartsPieExample() {
  return (
    <ChartContainer className="w-full max-w-sm" config={chartConfig} seriesCount={4}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <ChartLegend nameKey="channel" />
        <Pie data={pieData} dataKey="value" innerRadius={52} nameKey="channel" outerRadius={84}>
          {pieData.map((entry) => (
            <Cell fill={\`var(--color-\${entry.channel})\`} key={entry.channel} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}`,
  },
  {
    title: "Theme overrides",
    code: `"use client";

import { BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartBar,
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/charts";

const chartData = [
  { month: "Jan", revenue: 1240 },
  { month: "Feb", revenue: 1580 },
  { month: "Mar", revenue: 1420 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    theme: {
      light: "oklch(0.45 0.16 250)",
      dark: "oklch(0.72 0.14 250)",
    },
  },
} satisfies ChartConfig;

export function ChartsThemeExample() {
  return (
    <ChartContainer className="w-full max-w-md" config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis axisLine={false} dataKey="month" tickLine={false} />
        <ChartTooltip cursor={false} />
        <ChartBar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}`,
  },
  {
    title: "Empty state",
    code: `"use client";

import { ChartContainer, ChartEmptyState, type ChartConfig } from "@/components/ui/charts";

const chartConfig = {
  sessions: { label: "Sessions", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function ChartsEmptyExample() {
  return (
    <ChartContainer className="w-full max-w-lg" config={chartConfig}>
      <ChartEmptyState description="Connect a data source or upload a CSV to populate this chart." />
    </ChartContainer>
  );
}`,
  },
];

export default function ChartsPage() {
  return (
    <ChartsPlaygroundProvider
      ChartsModule={ChartsModule}
      importPath="@/components/ui/charts"
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Display & Content" },
            { label: "Charts" },
          ]}
          componentName="charts"
          description="Theme-aware Recharts for bar, line, area, pie, radar, radial bar, and more—with motion and soft tooltips."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/charts/page.tsx`}
          examples={chartExamples}
          headerActions={<SharedPrimitiveProviderSwitch />}
          itemSlug="charts"
          pageUrl="/display-and-content/charts"
          preview={preview}
          previewClassName="min-h-0 !p-0"
          previewDescription="Use the playground to switch bar, line, area, pie, radar, and radial bar charts, plus tooltip indicator, legend, and animation."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Charts"
          railNotes={[
            'Map series colors with fill or stroke="var(--color-{key})" where {key} matches ChartConfig.',
            "ChartTooltip and ChartLegend default to the styled Iconiq content shells when content is omitted.",
            "Use ChartBar, ChartLine, and ChartArea for the shared ease-out series timing and stagger.",
            "Wrap ChartEmptyState inside ChartContainer when a dataset is empty or still loading.",
            'For pie and radial bar charts, pass nameKey="channel" (or your category key) to ChartLegend so labels and swatches resolve from ChartConfig.',
          ]}
          title="Charts"
          usageCode={chartsUsageCode}
          usageDescription="Compose ChartContainer with Recharts primitives. ChartTooltip and ChartLegend use the styled shells by default, and series wrappers share calm ease-out timing."
        />
      )}
    </ChartsPlaygroundProvider>
  );
}
