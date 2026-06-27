"use client";

import {
  type ComponentType,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AreaChart,
  BarChart,
  CartesianGrid,
  Cell,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import type { ChartConfig } from "@/registry/charts";

type ChartType = "bar" | "line" | "area" | "pie" | "radar" | "radial";

type ChartIndicator = "dot" | "line" | "dashed";

type ChartsModule = {
  ChartArea: ComponentType<
    React.ComponentProps<typeof import("recharts").Area> & {
      seriesIndex?: number;
    }
  >;
  ChartBar: ComponentType<
    React.ComponentProps<typeof import("recharts").Bar> & {
      seriesIndex?: number;
    }
  >;
  ChartContainer: ComponentType<{
    children: ReactNode;
    className?: string;
    config: ChartConfig;
    seriesCount?: number;
  }>;
  ChartLegend: ComponentType<Record<string, unknown>>;
  ChartLine: ComponentType<
    React.ComponentProps<typeof import("recharts").Line> & {
      seriesIndex?: number;
    }
  >;
  ChartTooltip: ComponentType<Record<string, unknown>>;
  ChartTooltipContent: ComponentType<{
    hideLabel?: boolean;
    indicator?: ChartIndicator;
  }>;
};

type ChartsPlaygroundState = {
  animate: boolean;
  chartType: ChartType;
  indicator: ChartIndicator;
  showLegend: boolean;
};

const DEFAULT_STATE: ChartsPlaygroundState = {
  animate: true,
  chartType: "bar",
  indicator: "dashed",
  showLegend: true,
};

const CHART_TYPE_OPTIONS: Array<{ label: string; value: ChartType }> = [
  { label: "Bar", value: "bar" },
  { label: "Line", value: "line" },
  { label: "Area", value: "area" },
  { label: "Pie", value: "pie" },
  { label: "Radar", value: "radar" },
  { label: "Radial bar", value: "radial" },
];

const INDICATOR_OPTIONS: Array<{ label: string; value: ChartIndicator }> = [
  { label: "Dot", value: "dot" },
  { label: "Line", value: "line" },
  { label: "Dashed", value: "dashed" },
];

const trendData = [
  { month: "Jan", sessions: 1240, conversions: 420 },
  { month: "Feb", sessions: 1580, conversions: 510 },
  { month: "Mar", sessions: 1420, conversions: 480 },
  { month: "Apr", sessions: 1890, conversions: 620 },
  { month: "May", sessions: 1760, conversions: 590 },
  { month: "Jun", sessions: 2100, conversions: 710 },
];

const lineDomain: [number, number] = [300, 2300];

const pieData = [
  { channel: "organic", value: 42 },
  { channel: "paid", value: 28 },
  { channel: "email", value: 18 },
  { channel: "social", value: 12 },
];

const radarData = [
  { metric: "Speed", product: 82, competitor: 68 },
  { metric: "Support", product: 74, competitor: 81 },
  { metric: "Price", product: 63, competitor: 72 },
  { metric: "Features", product: 88, competitor: 70 },
  { metric: "Reliability", product: 79, competitor: 76 },
];

const radialData = [
  { channel: "organic", value: 84 },
  { channel: "paid", value: 68 },
  { channel: "email", value: 52 },
  { channel: "social", value: 41 },
];

const radialChartData = radialData.map((entry) => ({
  ...entry,
  fill: `var(--color-${entry.channel})`,
}));

const chartConfig = {
  sessions: {
    label: "Sessions",
    color: "var(--chart-1)",
  },
  conversions: {
    label: "Conversions",
    color: "var(--chart-2)",
  },
  organic: {
    label: "Organic",
    color: "var(--chart-1)",
  },
  paid: {
    label: "Paid",
    color: "var(--chart-2)",
  },
  email: {
    label: "Email",
    color: "var(--chart-3)",
  },
  social: {
    label: "Social",
    color: "var(--chart-4)",
  },
  product: {
    label: "Product",
    color: "var(--chart-1)",
  },
  competitor: {
    label: "Competitor",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const previewClassName = "mx-auto w-full max-w-lg";

const ChartsPlaygroundContext = createContext<{
  ChartsModule: ChartsModule;
  state: ChartsPlaygroundState;
} | null>(null);

function useChartsPlayground() {
  const context = useContext(ChartsPlaygroundContext);

  if (!context) {
    throw new Error(
      "ChartsPlayground components must be used within ChartsPlaygroundProvider."
    );
  }

  return context;
}

function getChartsSeriesCount(chartType: ChartType) {
  switch (chartType) {
    case "pie":
    case "radial":
      return 4;
    case "radar":
      return 2;
    default:
      return 2;
  }
}

function getChartsCodegenImports(state: ChartsPlaygroundState) {
  const imports = [
    "ChartContainer",
    "ChartTooltip",
    ...(state.chartType === "bar" ? ["ChartBar", "ChartLegend"] : []),
    ...(state.chartType === "line"
      ? ["ChartLine", "ChartLegend", "ChartTooltipContent"]
      : []),
    ...(state.chartType === "area"
      ? ["ChartArea", "ChartLegend", "ChartTooltipContent"]
      : []),
    ...(state.chartType === "pie" ||
    state.chartType === "radar" ||
    state.chartType === "radial"
      ? ["ChartLegend", "ChartTooltipContent"]
      : []),
    ...(state.chartType === "bar" && state.indicator !== "dot"
      ? ["ChartTooltipContent"]
      : []),
  ];

  return [...new Set(imports)];
}

function getChartsRechartsImports(chartType: ChartType) {
  switch (chartType) {
    case "pie":
      return "Pie, PieChart, Cell";
    case "radar":
      return "PolarAngleAxis, PolarGrid, Radar, RadarChart";
    case "radial":
      return "RadialBar, RadialBarChart";
    case "area":
      return "AreaChart, CartesianGrid, XAxis, YAxis";
    case "line":
      return "CartesianGrid, LineChart, XAxis, YAxis";
    default:
      return "BarChart, CartesianGrid, XAxis";
  }
}

function getChartsContainerProps(state: ChartsPlaygroundState) {
  const seriesCount = getChartsSeriesCount(state.chartType);

  return [
    'className="w-full max-w-lg"',
    "config={chartConfig}",
    ...(seriesCount !== 2 ? [`seriesCount={${seriesCount}}`] : []),
  ].join(" ");
}

function getChartsTooltipBlock(state: ChartsPlaygroundState) {
  if (state.chartType === "bar" && state.indicator === "dot") {
    return "        <ChartTooltip cursor={false} />";
  }

  return `        <ChartTooltip\n          content={<ChartTooltipContent indicator="${state.indicator}" />}\n          cursor={false}\n        />`;
}

function getChartsChartBody(state: ChartsPlaygroundState) {
  const tooltipBlock = getChartsTooltipBlock(state);
  const legendBlock = state.showLegend
    ? state.chartType === "pie" || state.chartType === "radial"
      ? '        <ChartLegend nameKey="channel" />'
      : "        <ChartLegend />"
    : "";
  const animationProps = state.animate ? "" : " isAnimationActive={false}";

  switch (state.chartType) {
    case "line":
      return `${tooltipBlock}
${legendBlock}
        <ChartLine${animationProps} dataKey="sessions" dot={false} seriesIndex={0} stroke="var(--color-sessions)" strokeWidth={2} type="monotone" />
        <ChartLine${animationProps} dataKey="conversions" dot={false} seriesIndex={1} stroke="var(--color-conversions)" strokeWidth={2} type="monotone" />`;
    case "area":
      return `${tooltipBlock}
${legendBlock}
        <ChartArea${animationProps} dataKey="sessions" fill="var(--color-sessions)" fillOpacity={0.24} seriesIndex={0} stroke="var(--color-sessions)" type="monotone" />
        <ChartArea${animationProps} dataKey="conversions" fill="var(--color-conversions)" fillOpacity={0.2} seriesIndex={1} stroke="var(--color-conversions)" type="monotone" />`;
    case "pie":
      return `${tooltipBlock}
${legendBlock}
        <Pie data={pieData} dataKey="value" innerRadius={52} nameKey="channel" outerRadius={84}>
          {pieData.map((entry) => (
            <Cell fill={\`var(--color-\${entry.channel})\`} key={entry.channel} />
          ))}
        </Pie>`;
    case "radar":
      return `${tooltipBlock}
${legendBlock}
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" tickLine={false} />
        <Radar${animationProps} dataKey="product" fill="var(--color-product)" fillOpacity={0.2} stroke="var(--color-product)" strokeWidth={2} />
        <Radar${animationProps} dataKey="competitor" fill="var(--color-competitor)" fillOpacity={0.16} stroke="var(--color-competitor)" strokeWidth={2} />`;
    case "radial":
      return `${tooltipBlock}
${legendBlock}
        <RadialBar${animationProps} background cornerRadius={4} dataKey="value" />`;
    default:
      return `${tooltipBlock}
${legendBlock}
        <ChartBar${animationProps} dataKey="sessions" fill="var(--color-sessions)" radius={4} seriesIndex={0} />
        <ChartBar${animationProps} dataKey="conversions" fill="var(--color-conversions)" radius={4} seriesIndex={1} />`;
  }
}

function getChartsDataBlock(chartType: ChartType) {
  if (chartType === "pie") {
    return `const pieData = [
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
} satisfies ChartConfig;`;
  }

  if (chartType === "radar") {
    return `const radarData = [
  { metric: "Speed", product: 82, competitor: 68 },
  { metric: "Support", product: 74, competitor: 81 },
  { metric: "Price", product: 63, competitor: 72 },
  { metric: "Features", product: 88, competitor: 70 },
  { metric: "Reliability", product: 79, competitor: 76 },
];

const chartConfig = {
  product: { label: "Product", color: "var(--chart-1)" },
  competitor: { label: "Competitor", color: "var(--chart-2)" },
} satisfies ChartConfig;`;
  }

  if (chartType === "radial") {
    return `const radialData = [
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
} satisfies ChartConfig;`;
  }

  return `const chartData = [
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
} satisfies ChartConfig;`;
}

function getChartsChartTag(chartType: ChartType) {
  switch (chartType) {
    case "pie":
      return "PieChart";
    case "radar":
      return "RadarChart";
    case "radial":
      return "RadialBarChart";
    case "area":
      return "AreaChart";
    case "line":
      return "LineChart";
    default:
      return "BarChart";
  }
}

function getChartsAxisBlock(chartType: ChartType) {
  if (chartType === "pie" || chartType === "radar" || chartType === "radial") {
    return "";
  }

  if (chartType === "line" || chartType === "area") {
    return `        <CartesianGrid vertical={false} />
        <XAxis axisLine={false} dataKey="month" tickFormatter={(value) => value.slice(0, 3)} tickLine={false} tickMargin={10} />
        <YAxis ${chartType === "line" ? "domain={[300, 2300]} hide" : "tickLine={false} axisLine={false}"} />`;
  }

  return `        <CartesianGrid vertical={false} />
        <XAxis axisLine={false} dataKey="month" tickFormatter={(value) => value.slice(0, 3)} tickLine={false} tickMargin={10} />`;
}

function generateChartsCode(state: ChartsPlaygroundState, importPath: string) {
  const uniqueImports = getChartsCodegenImports(state);
  const rechartsImports = getChartsRechartsImports(state.chartType);
  const containerProps = getChartsContainerProps(state);
  const chartBody = getChartsChartBody(state);
  const dataBlock = getChartsDataBlock(state.chartType);
  const chartTag = getChartsChartTag(state.chartType);
  const axisBlock = getChartsAxisBlock(state.chartType);
  const dataProp =
    state.chartType === "pie" || state.chartType === "radar"
      ? ` data={${state.chartType === "radar" ? "radarData" : "pieData"}}`
      : state.chartType === "radial"
        ? " data={radialData} innerRadius={36} outerRadius={112}"
        : " data={chartData}";
  const accessibilityProp =
    state.chartType === "pie" ||
    state.chartType === "radar" ||
    state.chartType === "radial"
      ? ""
      : " accessibilityLayer";

  return `"use client";

import { ${rechartsImports} } from "recharts";
import {
  ${uniqueImports.join(",\n  ")},
  type ChartConfig,
} from "${importPath}";

${dataBlock}

export function ChartsDemo() {
  return (
    <ChartContainer ${containerProps}>
      <${chartTag}${accessibilityProp}${dataProp}>
${axisBlock}
${chartBody}
      </${chartTag}>
    </ChartContainer>
  );
}`;
}

function ChartsPlaygroundPreview() {
  const { ChartsModule, state } = useChartsPlayground();
  const {
    ChartArea,
    ChartBar,
    ChartContainer,
    ChartLegend,
    ChartLine,
    ChartTooltip,
    ChartTooltipContent,
  } = ChartsModule;
  const animationProps = state.animate ? {} : { isAnimationActive: false };

  const tooltip = (
    <ChartTooltip
      content={<ChartTooltipContent indicator={state.indicator} />}
      cursor={false}
    />
  );

  const legend = state.showLegend ? (
    <ChartLegend
      {...(state.chartType === "pie" || state.chartType === "radial"
        ? { nameKey: "channel" }
        : {})}
    />
  ) : null;

  return (
    <div className="flex min-h-[20rem] w-full items-center justify-center px-4 py-6">
      <ChartContainer
        className={previewClassName}
        config={chartConfig}
        seriesCount={getChartsSeriesCount(state.chartType)}
      >
        {state.chartType === "bar" ? (
          <BarChart accessibilityLayer data={trendData}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              tickFormatter={(value) => value.slice(0, 3)}
              tickLine={false}
              tickMargin={10}
            />
            {tooltip}
            {legend}
            <ChartBar
              {...animationProps}
              dataKey="sessions"
              fill="var(--color-sessions)"
              radius={4}
              seriesIndex={0}
            />
            <ChartBar
              {...animationProps}
              dataKey="conversions"
              fill="var(--color-conversions)"
              radius={4}
              seriesIndex={1}
            />
          </BarChart>
        ) : null}

        {state.chartType === "line" ? (
          <LineChart accessibilityLayer data={trendData}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              tickFormatter={(value) => value.slice(0, 3)}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis domain={lineDomain} hide />
            {tooltip}
            {legend}
            <ChartLine
              {...animationProps}
              dataKey="sessions"
              dot={false}
              seriesIndex={0}
              stroke="var(--color-sessions)"
              strokeWidth={2}
              type="monotone"
            />
            <ChartLine
              {...animationProps}
              dataKey="conversions"
              dot={false}
              seriesIndex={1}
              stroke="var(--color-conversions)"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        ) : null}

        {state.chartType === "area" ? (
          <AreaChart accessibilityLayer data={trendData}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              tickFormatter={(value) => value.slice(0, 3)}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis axisLine={false} tickLine={false} />
            {tooltip}
            {legend}
            <ChartArea
              {...animationProps}
              dataKey="sessions"
              fill="var(--color-sessions)"
              fillOpacity={0.24}
              seriesIndex={0}
              stroke="var(--color-sessions)"
              type="monotone"
            />
            <ChartArea
              {...animationProps}
              dataKey="conversions"
              fill="var(--color-conversions)"
              fillOpacity={0.2}
              seriesIndex={1}
              stroke="var(--color-conversions)"
              type="monotone"
            />
          </AreaChart>
        ) : null}

        {state.chartType === "pie" ? (
          <PieChart>
            {tooltip}
            {legend}
            <Pie
              data={pieData}
              dataKey="value"
              innerRadius={52}
              nameKey="channel"
              outerRadius={84}
            >
              {pieData.map((entry) => (
                <Cell
                  fill={`var(--color-${entry.channel})`}
                  key={entry.channel}
                />
              ))}
            </Pie>
          </PieChart>
        ) : null}

        {state.chartType === "radar" ? (
          <RadarChart data={radarData}>
            {tooltip}
            {legend}
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tickLine={false} />
            <Radar
              {...animationProps}
              dataKey="product"
              fill="var(--color-product)"
              fillOpacity={0.2}
              stroke="var(--color-product)"
              strokeWidth={2}
            />
            <Radar
              {...animationProps}
              dataKey="competitor"
              fill="var(--color-competitor)"
              fillOpacity={0.16}
              stroke="var(--color-competitor)"
              strokeWidth={2}
            />
          </RadarChart>
        ) : null}

        {state.chartType === "radial" ? (
          <RadialBarChart
            data={radialChartData}
            innerRadius={36}
            outerRadius={112}
          >
            {tooltip}
            {legend}
            <RadialBar
              {...animationProps}
              background
              cornerRadius={4}
              dataKey="value"
            />
          </RadialBarChart>
        ) : null}
      </ChartContainer>
    </div>
  );
}

function ChartsPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<ChartsPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: ChartsPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Charts"
    >
      <DocsPlaygroundSelectField
        label="Chart type"
        onChange={(chartType) => onChange({ chartType })}
        options={CHART_TYPE_OPTIONS}
        value={state.chartType}
      />
      <DocsPlaygroundSelectField
        label="Tooltip indicator"
        onChange={(indicator) => onChange({ indicator })}
        options={INDICATOR_OPTIONS}
        value={state.indicator}
      />
      <DocsPlaygroundToggleField
        checked={state.showLegend}
        label="Legend"
        onChange={(showLegend) => onChange({ showLegend })}
      />
      {state.chartType !== "pie" && state.chartType !== "radial" ? (
        <DocsPlaygroundToggleField
          checked={state.animate}
          label="Animate"
          onChange={(animate) => onChange({ animate })}
        />
      ) : null}
    </DocsPlaygroundPanel>
  );
}

type ChartsPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function ChartsPlaygroundProvider({
  ChartsModule,
  children,
  importPath,
}: {
  ChartsModule: ChartsModule;
  children: (props: ChartsPlaygroundRenderProps) => ReactNode;
  importPath: string;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<ChartsPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<ChartsPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateChartsCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <ChartsPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <ChartsPlaygroundContext.Provider value={{ ChartsModule, state }}>
      {children({
        preview: <ChartsPlaygroundPreview />,
        renderSettings,
      })}
    </ChartsPlaygroundContext.Provider>
  );
}
