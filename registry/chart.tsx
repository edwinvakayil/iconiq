"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import type { TooltipProps } from "recharts";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";

/** Chart colors defined in component; no CSS variables in global.css required. */
const CHART_PRIMARY = "hsl(221, 83%, 53%)";
const CHART_SECONDARY = "hsl(262, 83%, 58%)";

export type ChartType = "bar" | "line" | "area";

/** Data item for the chart. Requires `name` (x-axis), `value` (primary series), and `secondary` (secondary series). */
export interface ChartDataItem {
  name: string;
  value: number;
  secondary: number;
}

export interface AnimatedChartProps {
  /** Chart data: array of { name, value, secondary }. */
  items: ChartDataItem[];
  title?: string;
  description?: string;
  className?: string;
  /** Controlled variant; omit to use internal state. */
  variant?: ChartType;
  /** Called when user changes variant (e.g. via select). */
  onVariantChange?: (variant: ChartType) => void;
}

const CHART_TYPE_OPTIONS: { type: ChartType; label: string }[] = [
  { type: "bar", label: "Bar" },
  { type: "line", label: "Line" },
  { type: "area", label: "Area" },
];

function ChartTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!(active && payload?.length)) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-popover-foreground text-xs shadow-md">
      <p className="mb-1 font-medium">{label}</p>
      {payload.map((entry: { color?: string; value?: number }, i: number) => (
        <p className="text-muted-foreground" key={i}>
          <span
            className="mr-1.5 inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          {Number(entry.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export function AnimatedChart({
  items,
  title = "Analytics Overview",
  description = "Monthly performance metrics",
  className,
  variant: controlledVariant,
  onVariantChange,
}: AnimatedChartProps) {
  const [internalVariant, setInternalVariant] = useState<ChartType>("bar");
  const [isDark, setIsDark] = useState(false);
  const activeChart = controlledVariant ?? internalVariant;
  const setActiveChart = (v: ChartType) => {
    if (controlledVariant === undefined) setInternalVariant(v);
    onVariantChange?.(v);
  };

  useEffect(() => {
    const el = document.documentElement;
    const check = () => setIsDark(el.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const primaryColor = CHART_PRIMARY;
  const secondaryColor = CHART_SECONDARY;
  const gridColor = "hsl(var(--border))";
  const textColor = isDark ? "white" : "hsl(var(--foreground))";

  const commonProps = {
    data: items,
    margin: { top: 8, right: 8, left: -16, bottom: 0 },
  };
  const axisProps = {
    stroke: "none",
    tick: { fill: textColor, fontSize: 11 },
    tickLine: false,
  };

  const renderChart = () => {
    switch (activeChart) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid
              stroke={gridColor}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              animationDuration={800}
              dataKey="value"
              fill={primaryColor}
              radius={[6, 6, 0, 0]}
            />
            <Bar
              animationBegin={200}
              animationDuration={800}
              dataKey="secondary"
              fill={secondaryColor}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        );
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid
              stroke={gridColor}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<ChartTooltip />} />
            <Line
              activeDot={{ r: 6 }}
              animationDuration={1200}
              dataKey="value"
              dot={{ fill: primaryColor, r: 4 }}
              stroke={primaryColor}
              strokeWidth={2.5}
              type="monotone"
            />
            <Line
              activeDot={{ r: 6 }}
              animationBegin={300}
              animationDuration={1200}
              dataKey="secondary"
              dot={{ fill: secondaryColor, r: 4 }}
              stroke={secondaryColor}
              strokeWidth={2.5}
              type="monotone"
            />
          </LineChart>
        );
      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="chartGradPrimary" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={primaryColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
              </linearGradient>
              <linearGradient
                id="chartGradSecondary"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={secondaryColor}
                  stopOpacity={0.3}
                />
                <stop offset="95%" stopColor={secondaryColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke={gridColor}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<ChartTooltip />} />
            <Area
              animationDuration={1200}
              dataKey="value"
              fill="url(#chartGradPrimary)"
              stroke={primaryColor}
              strokeWidth={2}
              type="monotone"
            />
            <Area
              animationBegin={300}
              animationDuration={1200}
              dataKey="secondary"
              fill="url(#chartGradSecondary)"
              stroke={secondaryColor}
              strokeWidth={2}
              type="monotone"
            />
          </AreaChart>
        );
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid
              stroke={gridColor}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis dataKey="name" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              animationDuration={800}
              dataKey="value"
              fill={primaryColor}
              radius={[6, 6, 0, 0]}
            />
            <Bar
              animationBegin={200}
              animationDuration={800}
              dataKey="secondary"
              fill={secondaryColor}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        );
    }
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-sm",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-card-foreground text-lg">
            {title}
          </h3>
          <p className="mt-0.5 text-muted-foreground text-sm">{description}</p>
        </div>
        <div className="relative flex h-8 items-center">
          <select
            aria-label="Chart type"
            className={cn(
              "h-full min-w-22 appearance-none rounded-md border border-input bg-background pr-8 pl-3 font-medium text-foreground text-xs shadow-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            onChange={(e) => setActiveChart(e.target.value as ChartType)}
            value={activeChart}
          >
            {CHART_TYPE_OPTIONS.map((opt) => (
              <option key={opt.type} value={opt.type}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 shrink-0 -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </div>
      <motion.div
        animate={{ opacity: 1 }}
        className="h-[280px] w-full"
        initial={{ opacity: 0 }}
        key={activeChart}
        transition={{ duration: 0.3 }}
      >
        <ResponsiveContainer height="100%" width="100%">
          {renderChart()}
        </ResponsiveContainer>
      </motion.div>
      <div className="mt-4 flex items-center gap-6 border-border border-t pt-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: primaryColor }}
          />
          Primary
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: secondaryColor }}
          />
          Secondary
        </div>
      </div>
    </motion.div>
  );
}
