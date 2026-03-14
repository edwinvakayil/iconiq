import { ComponentDocsLayout } from "@/components/docs/component-docs-layout";
import { ChartPreview } from "./chart-preview";

const CHART_CODE = `"use client";

import { AnimatedChart } from "@/components/ui/chart";
import type { ChartDataItem } from "@/components/ui/chart";

const items: ChartDataItem[] = [
  { name: "Jan", value: 400, secondary: 240 },
  { name: "Feb", value: 300, secondary: 139 },
  { name: "Mar", value: 520, secondary: 380 },
  { name: "Apr", value: 278, secondary: 390 },
  { name: "May", value: 489, secondary: 280 },
  { name: "Jun", value: 639, secondary: 430 },
  { name: "Jul", value: 490, secondary: 350 },
];

export function Example() {
  return (
    <AnimatedChart
      items={items}
      title="Analytics Overview"
      description="Monthly performance metrics"
    />
  );
}`;

const CHART_PROPS = [
  {
    name: "items",
    type: "ChartDataItem[]",
    desc: "Chart data: array of { name, value, secondary }. Pass from the parent (e.g. items={items}).",
  },
  {
    name: "title",
    type: "string",
    desc: 'Optional. Chart heading (default "Analytics Overview").',
  },
  {
    name: "description",
    type: "string",
    desc: 'Optional. Subtitle (default "Monthly performance metrics").',
  },
  {
    name: "variant",
    type: "enum",
    desc: '"bar" | "line" | "area" (optional) — Controlled chart type.',
  },
  {
    name: "onVariantChange",
    type: "function",
    desc: "(variant: ChartType) => void (optional) — Called when the user changes the chart type via the dropdown.",
  },
  {
    name: "className",
    type: "string",
    desc: "Optional. Extra class names for the wrapper.",
  },
];

export default function ChartPage() {
  return (
    <ComponentDocsLayout
      codeSample={CHART_CODE}
      componentName="chart"
      description="An animated chart with Bar, Line, and Area variants. Switch types via a dropdown. Built with Recharts and Framer Motion. Primary and secondary colors are defined in the component."
      previewChildren={<ChartPreview />}
      propsRows={CHART_PROPS}
      propsTag="chart"
      title="Chart"
    />
  );
}
