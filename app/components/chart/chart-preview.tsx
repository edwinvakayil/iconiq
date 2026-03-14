"use client";

import type { ChartDataItem } from "@/registry/chart";
import { AnimatedChart } from "@/registry/chart";

const SAMPLE_ITEMS: ChartDataItem[] = [
  { name: "Jan", value: 400, secondary: 240 },
  { name: "Feb", value: 300, secondary: 139 },
  { name: "Mar", value: 520, secondary: 380 },
  { name: "Apr", value: 278, secondary: 390 },
  { name: "May", value: 489, secondary: 280 },
  { name: "Jun", value: 639, secondary: 430 },
  { name: "Jul", value: 490, secondary: 350 },
];

export function ChartPreview() {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-sans text-neutral-600 text-sm dark:text-neutral-400">
        Use the dropdown to switch between Bar, Line, and Area chart types.
      </p>
      <AnimatedChart items={SAMPLE_ITEMS} />
    </div>
  );
}
