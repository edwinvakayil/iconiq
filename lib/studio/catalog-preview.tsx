"use client";

/**
 * Live canvas previews for catalog components (everything outside the 13 core
 * registry defs). Each renderer mirrors the docs demos with sensible defaults.
 */

import { BoldIcon, HomeIcon, SearchIcon } from "lucide-react";
import { type ReactNode, useRef } from "react";
import { BarChart, CartesianGrid, XAxis } from "recharts";

import { StudioFluxButtonCanvas } from "@/components/studio/flux-button-canvas";
import {
  logoItems,
  slideItems,
  testimonialItems,
} from "@/lib/studio/prop-items";
import { AIInput } from "@/registry/ai-input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/b-alert-dialog";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/registry/b-autocomplete";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/b-collapsible";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/registry/b-combobox";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/registry/b-context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/b-dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/b-hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/b-popover";
import { Progress } from "@/registry/b-progress";
import RadioGroup from "@/registry/b-radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/b-select";
import { SelectionToolbar } from "@/registry/b-selection-toolbar";
import { Slider } from "@/registry/b-slider";
import { Toggle } from "@/registry/b-toggle";
import { ToggleGroup, ToggleGroupItem } from "@/registry/b-togglegroup";
import { Tooltip } from "@/registry/b-tooltip";
import { Banner } from "@/registry/banner";
import { SegmentedControl } from "@/registry/button-group";
import { Calendar } from "@/registry/calendar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/registry/carousel";
import {
  ChartBar,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/charts";
import { CheckboxGroup } from "@/registry/checkbox-group";
import { CodeBlock } from "@/registry/code-block";
import ColorPicker from "@/registry/color-picker";
import { CommandPalette } from "@/registry/command-palette";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/registry/contribution-graph";
import { DatePicker } from "@/registry/date-picker";
import { DiaText } from "@/registry/dia-text";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/drawer";
import { FaqPro } from "@/registry/faq-pro";
import FaviconBadge from "@/registry/favicon-badge";
import { FeedbackForm } from "@/registry/feedback";
import { FileTreeFromItems } from "@/registry/file-tree";
import { FileUpload } from "@/registry/file-upload";
import { IconBar, IconBarItem } from "@/registry/icon-bar";
import { InfiniteRibbon } from "@/registry/infiniteribbon";
import { OTP, OTPSlots } from "@/registry/input-otp";
import { LogosCarousel } from "@/registry/logo-carousal";
import {
  Message,
  MessageBubble,
  MessageContent,
  MessageGroup,
} from "@/registry/message";
import MorphText from "@/registry/morph-texts";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  DropdownValue,
} from "@/registry/r-dropdown";
import { RadialButton } from "@/registry/radial-button";
import ReasoningSteps, {
  ReasoningStep,
  ReasoningStepsContent,
  ReasoningStepsTrigger,
} from "@/registry/reasoning-steps";
import { RevealText } from "@/registry/reveal-text";
import { RollingDigits } from "@/registry/rolling-digits";
import { ScrollProgress } from "@/registry/scroll-progress";
import { TextShimmer } from "@/registry/shimmer-text";
import Skeleton from "@/registry/skeleton";
import StatusDot from "@/registry/status-dot";
import StreamingText from "@/registry/streaming-text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/table";
import { Testimonial, Testimonials } from "@/registry/testimonials";
import { TextLoop } from "@/registry/text-loop";
import { ThemeToggle } from "@/registry/theme-toggle";
import ThinkingIndicator from "@/registry/thinking-indicator";
import Timezone from "@/registry/timezone";
import VerifiedBadge from "@/registry/verified-badge";
import { WheelPicker, WheelPickerColumn } from "@/registry/wheel-picker";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const str = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const bool = (value: unknown): boolean => value === true;

const num = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const strList = (value: unknown): string[] =>
  Array.isArray(value) ? value.map((item) => String(item)) : [];

type TitledItem = { title: string; content: string };

const itemList = (value: unknown): TitledItem[] =>
  Array.isArray(value)
    ? value.map((item) => ({
        title: str((item as TitledItem)?.title),
        content: str((item as TitledItem)?.content),
      }))
    : [];

const optionsFromLabels = (labels: string[]) =>
  labels.map((label) => ({
    label,
    value: label.toLowerCase().replace(/\s+/g, "-"),
  }));

const slug = (label: string) => label.toLowerCase().replace(/\s+/g, "-");

const CHART_DATA = [
  { month: "Jan", revenue: 120 },
  { month: "Feb", revenue: 180 },
  { month: "Mar", revenue: 150 },
];

const CHART_CONFIG = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
};

const DEFAULT_FAQ_ITEMS = [
  {
    id: "1",
    question: "What is Iconiq?",
    answer: "A motion-first UI kit for React.",
  },
];

const DEFAULT_FILE_TREE = [
  {
    id: "src",
    label: "src",
    children: [{ id: "app.tsx", label: "app.tsx" }],
  },
];

const DEFAULT_COMMAND_GROUPS = [
  {
    heading: "General",
    items: [{ id: "home", label: "Home", href: "/" }],
  },
];

function SelectionToolbarPreview() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="min-h-16 rounded-lg border border-border/70 bg-background p-3 text-sm"
      contentEditable
      ref={containerRef}
      suppressContentEditableWarning
    >
      Select text to format.
      <SelectionToolbar containerRef={containerRef} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Preview renderers                                                   */
/* ------------------------------------------------------------------ */

type PreviewRenderer = (props: Record<string, unknown>) => ReactNode;

const PREVIEW_RENDERERS: Record<string, PreviewRenderer> = {
  "ai-input": (props) => (
    <AIInput
      placeholder={str(props.placeholder, "Ask for follow-up changes")}
      showMessages={
        bool(props.showMessages) || props.showMessages === undefined
      }
    />
  ),

  banner: (props) => (
    <Banner
      actionLabel={str(props.actionLabel, "Learn more")}
      dismissible={bool(props.dismissible) || props.dismissible === undefined}
      variant={
        str(props.variant, "default") as
          | "default"
          | "info"
          | "success"
          | "error"
      }
    >
      {str(props.text, "We just shipped a new feature.")}
    </Banner>
  ),

  "code-block": (props) => (
    <CodeBlock
      code={str(props.code, 'const hello = "world";')}
      filename={str(props.filename, "example.ts") || undefined}
      language={str(props.language, "typescript") || undefined}
      showLineNumbers={
        bool(props.showLineNumbers) || props.showLineNumbers === undefined
      }
    />
  ),

  "contribution-graph": (props) => (
    <ContributionGraph
      animated={bool(props.animated) || props.animated === undefined}
      username={str(props.username, "octocat") || undefined}
    >
      <ContributionGraphCalendar>
        {({ activity, dayIndex, weekIndex }) => (
          <ContributionGraphBlock
            activity={activity}
            dayIndex={dayIndex}
            weekIndex={weekIndex}
          />
        )}
      </ContributionGraphCalendar>
      <ContributionGraphFooter>
        <ContributionGraphLegend />
        <ContributionGraphTotalCount />
      </ContributionGraphFooter>
    </ContributionGraph>
  ),

  "feedback-form": (props) => (
    <FeedbackForm
      label={str(props.label, "Iconiq UI")}
      placeholder={str(props.placeholder, "Share your feedback…")}
    />
  ),

  "logo-carousel": (props) => (
    <LogosCarousel
      columnCount={num(props.columnCount, 4)}
      direction={str(props.direction, "ltr") as "ltr" | "rtl"}
    >
      {logoItems(props).map((logo, index) =>
        logo.src ? (
          // biome-ignore lint/performance/noImgElement: canvas renders arbitrary user URLs; next/image needs domain config
          // biome-ignore lint/correctness/useImageSize: intrinsic size of user-supplied logos is unknown; CSS constrains it
          <img
            alt={logo.alt || ""}
            className="h-8 w-auto object-contain"
            key={`${logo.alt}-${index}`}
            src={logo.src}
          />
        ) : (
          <div
            className="flex h-10 items-center justify-center rounded-md border border-border/70 px-4 font-medium text-sm"
            key={`${logo.alt}-${index}`}
          >
            {logo.alt || "Logo"}
          </div>
        )
      )}
    </LogosCarousel>
  ),

  message: (props) => {
    const text = str(props.text, "Hello there!");
    const align = str(props.align, "start") as "start" | "end";
    const variant = str(props.variant, "default") as
      | "default"
      | "primary"
      | "ghost";

    return (
      <MessageGroup>
        <Message
          align={align}
          animated={bool(props.animated) || props.animated === undefined}
        >
          <MessageBubble variant={variant}>
            <MessageContent>{text}</MessageContent>
          </MessageBubble>
        </Message>
      </MessageGroup>
    );
  },

  "reasoning-steps": (props) => (
    <ReasoningSteps defaultOpen={bool(props.defaultOpen)}>
      <ReasoningStepsTrigger />
      <ReasoningStepsContent>
        <ReasoningStep
          label={str(props.stepLabel, "Analyzing request")}
          status={
            str(props.stepStatus, "done") as "pending" | "active" | "done"
          }
        />
      </ReasoningStepsContent>
    </ReasoningSteps>
  ),

  "scroll-progress": (props) => (
    <ScrollProgress
      height={num(props.height, 160)}
      position={
        str(props.position, "right") as
          | "left"
          | "right"
          | "bottom-left"
          | "bottom-right"
      }
      showLabel={bool(props.showLabel) || props.showLabel === undefined}
    />
  ),

  "streaming-text": (props) => (
    <StreamingText
      showCursor={bool(props.showCursor) || props.showCursor === undefined}
      speed={num(props.speed, 120)}
      text={str(props.text, "Streaming word by word.")}
    />
  ),

  testimonials: (props) => {
    const items = testimonialItems(props);
    if (items.length === 0) {
      return (
        <p className="text-muted-foreground text-sm">
          Add a testimonial in the inspector.
        </p>
      );
    }
    return (
      <Testimonials
        blur={num(props.blur, 4)}
        dimOpacity={num(props.dimOpacity, 0.2)}
      >
        {items.map((item, index) => (
          <Testimonial
            avatar={item.avatar || undefined}
            key={`${item.name}-${index}`}
            name={item.name || "Anonymous"}
            title={item.title || undefined}
          >
            {item.quote || ""}
          </Testimonial>
        ))}
      </Testimonials>
    );
  },

  "thinking-indicator": (props) => {
    const words = strList(props.words);
    return (
      <ThinkingIndicator
        interval={num(props.interval, 3200)}
        showIcon={bool(props.showIcon) || props.showIcon === undefined}
        words={words.length > 0 ? words : ["Thinking", "Reasoning", "Planning"]}
      />
    );
  },

  "button-group": (props) => {
    const options = strList(props.options);
    return (
      <SegmentedControl
        ariaLabel="Range"
        options={options.length > 0 ? options : ["Day", "Week", "Month"]}
        size={str(props.size, "md") as "sm" | "md" | "lg"}
      />
    );
  },

  "flux-button": (props) => (
    <StudioFluxButtonCanvas
      idleLabel={str(props.idleLabel, "Save changes")}
      loadingLabel={str(props.loadingLabel, "Saving…")}
      size={str(props.size, "default") as "sm" | "default" | "lg"}
      successLabel={str(props.successLabel, "Saved")}
      variant={
        str(props.variant, "default") as
          | "default"
          | "secondary"
          | "outline"
          | "ghost"
          | "destructive"
          | "link"
      }
    />
  ),

  "icon-bar": (props) => (
    <IconBar defaultValue={str(props.defaultValue, "home") || undefined}>
      <IconBarItem icon={HomeIcon} label="Home" value="home" />
      <IconBarItem icon={SearchIcon} label="Search" value="search" />
      <IconBarItem icon={BoldIcon} label="Bold" value="bold" />
    </IconBar>
  ),

  toggle: (props) => (
    <Toggle
      defaultPressed={bool(props.defaultPressed)}
      size={str(props.size, "default") as "sm" | "default" | "lg"}
      variant={str(props.variant, "default") as "default" | "outline"}
    >
      {str(props.text, "Bold")}
    </Toggle>
  ),

  "toggle-group": (props) => {
    const items = strList(props.items);
    const values = items.length > 0 ? items : ["List", "Grid", "Board"];

    return (
      <ToggleGroup
        multiple={bool(props.multiple) || props.multiple === undefined}
        orientation={
          str(props.orientation, "horizontal") as "horizontal" | "vertical"
        }
        variant={str(props.variant, "default") as "default" | "outline"}
      >
        {values.map((item) => (
          <ToggleGroupItem key={item} value={slug(item)}>
            {item}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    );
  },

  calendar: (props) => (
    <Calendar
      mode={str(props.mode, "single") as "single" | "range"}
      showOutsideDays={
        bool(props.showOutsideDays) || props.showOutsideDays === undefined
      }
      size={str(props.size, "md") as "sm" | "md" | "lg"}
    />
  ),

  carousel: (props) => (
    <Carousel
      aspectRatio={
        str(props.aspectRatio, "video") as
          | "video"
          | "square"
          | "portrait"
          | "4/3"
          | "3/2"
      }
      orientation={
        str(props.orientation, "horizontal") as "horizontal" | "vertical"
      }
    >
      <CarouselContent>
        {slideItems(props).map((slide, index) => (
          <CarouselItem key={`${slide.caption}-${index}`}>
            {slide.src ? (
              // biome-ignore lint/performance/noImgElement: canvas renders arbitrary user URLs; next/image needs domain config
              // biome-ignore lint/correctness/useImageSize: slide fills its aspect-ratio box; intrinsic size unknown
              <img
                alt={slide.caption || ""}
                className="size-full rounded-lg object-cover"
                src={slide.src}
              />
            ) : (
              <div className="flex size-full min-h-24 items-center justify-center rounded-lg border border-border/70 bg-muted/40 font-medium text-sm">
                {slide.caption || "Slide"}
              </div>
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),

  charts: (props) => {
    const chartType = str(props.chartType, "bar");

    return (
      <ChartContainer className="w-full max-w-md" config={CHART_CONFIG}>
        {chartType === "bar" ? (
          <BarChart accessibilityLayer data={CHART_DATA}>
            <CartesianGrid vertical={false} />
            <XAxis axisLine={false} dataKey="month" tickLine={false} />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              cursor={false}
            />
            <ChartBar
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={4}
            />
          </BarChart>
        ) : (
          <BarChart accessibilityLayer data={CHART_DATA}>
            <CartesianGrid vertical={false} />
            <XAxis axisLine={false} dataKey="month" tickLine={false} />
            <ChartBar
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={4}
            />
          </BarChart>
        )}
      </ChartContainer>
    );
  },

  "date-picker": (props) => (
    <DatePicker
      clearable={bool(props.clearable) || props.clearable === undefined}
      disabled={bool(props.disabled)}
      placeholder={str(props.placeholder, "Select a date")}
      side={str(props.side, "bottom") as "bottom" | "top"}
    />
  ),

  "favicon-badge": (props) => (
    <FaviconBadge
      label={str(props.label, "GitHub") || undefined}
      size={str(props.size, "md") as "sm" | "md" | "lg"}
      website={str(props.website, "github.com")}
    />
  ),

  progress: (props) => (
    <Progress
      label={str(props.label, "Uploading") || undefined}
      showValue={bool(props.showValue) || props.showValue === undefined}
      size={str(props.size, "md") as "sm" | "md" | "lg"}
      tone={
        str(props.tone, "default") as
          | "default"
          | "brand"
          | "destructive"
          | "success"
      }
      value={num(props.value, 45)}
      variant={str(props.variant, "default") as "default" | "circular"}
    />
  ),

  "rolling-digits": (props) => (
    <RollingDigits
      startOnView={bool(props.startOnView) || props.startOnView === undefined}
      value={num(props.value, 1284)}
    />
  ),

  skeleton: (props) => (
    <Skeleton
      animate={bool(props.animate) || props.animate === undefined}
      className={str(props.className, "h-4 w-48")}
      rounded={str(props.rounded, "md") as "none" | "sm" | "md" | "lg" | "full"}
      variant={str(props.variant, "shimmer") as "shimmer" | "fade"}
    />
  ),

  "status-dot": (props) => (
    <StatusDot
      inline={bool(props.inline)}
      showLabel={bool(props.showLabel) || props.showLabel === undefined}
      size={str(props.size, "md") as "sm" | "md" | "lg"}
      state={
        str(props.state, "BUILDING") as
          | "QUEUED"
          | "BUILDING"
          | "ERROR"
          | "READY"
          | "CANCELED"
      }
    />
  ),

  table: (props) => {
    const columns = strList(props.columns);
    const cols = columns.length > 0 ? columns : ["Name", "Role", "Status"];

    return (
      <Table size={str(props.size, "default") as "default" | "compact"}>
        <TableHeader>
          <TableRow variant="header">
            {cols.map((col) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {cols.map((col, index) => (
              <TableCell key={col}>
                {index === 0
                  ? "Ada Lovelace"
                  : index === 1
                    ? "Engineer"
                    : "Active"}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    );
  },

  timezone: (props) => (
    <Timezone
      format={str(props.format, "12h") as "12h" | "24h"}
      live={bool(props.live)}
      showZoneLabel={
        bool(props.showZoneLabel) || props.showZoneLabel === undefined
      }
      zone={str(props.zone, "America/New_York")}
    />
  ),

  "verified-badge": (props) => (
    <VerifiedBadge
      decorative={bool(props.decorative)}
      size={str(props.size, "md") as "sm" | "md" | "lg"}
      tone={str(props.tone, "brand") as "brand" | "gold" | "neutral"}
      variant={str(props.variant, "shimmer") as "shimmer" | "static"}
    />
  ),

  autocomplete: (props) => {
    const items = strList(props.items);
    const options = items.length > 0 ? items : ["Next.js", "Remix", "Astro"];

    return (
      <Autocomplete items={options}>
        <AutocompleteInput
          placeholder={str(props.placeholder, "Search frameworks…")}
        />
        <AutocompleteContent>
          <AutocompleteList>
            {options.map((item) => (
              <AutocompleteItem key={item} value={item}>
                {item}
              </AutocompleteItem>
            ))}
          </AutocompleteList>
          <AutocompleteEmpty>No results</AutocompleteEmpty>
        </AutocompleteContent>
      </Autocomplete>
    );
  },

  "checkbox-group": (props) => {
    const labels = strList(props.options);
    const options =
      labels.length > 0
        ? optionsFromLabels(labels)
        : [
            { label: "Email", value: "email" },
            { label: "SMS", value: "sms" },
          ];

    return <CheckboxGroup options={options} />;
  },

  "color-picker": (props) => (
    <ColorPicker
      defaultValue={str(props.defaultValue, "#3B82F6")}
      showAlpha={bool(props.showAlpha) || props.showAlpha === undefined}
      showCopy={bool(props.showCopy)}
      variant={str(props.variant, "inline") as "inline" | "popover" | "swatch"}
    />
  ),

  combobox: (props) => {
    const items = strList(props.items);
    const options = items.length > 0 ? items : ["Next.js", "Remix", "Astro"];

    return (
      <Combobox>
        <ComboboxInput
          placeholder={str(props.placeholder, "Select framework…")}
        />
        <ComboboxContent>
          <ComboboxList>
            {options.map((item) => (
              <ComboboxItem key={item} value={slug(item)}>
                {item}
              </ComboboxItem>
            ))}
          </ComboboxList>
          <ComboboxEmpty>No results</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    );
  },

  "file-upload": (props) => (
    <FileUpload
      disabled={bool(props.disabled)}
      dropzoneTitle={str(props.dropzoneTitle, "Drop files here")}
      multiple={bool(props.multiple) || props.multiple === undefined}
    />
  ),

  "input-otp": (props) => (
    <OTP
      label={str(props.label, "Verification code") || undefined}
      length={num(props.length, 6)}
      mask={bool(props.mask)}
      size={str(props.size, "default") as "sm" | "default"}
    >
      <OTPSlots />
    </OTP>
  ),

  "radio-group": (props) => {
    const labels = strList(props.options);
    const options =
      labels.length > 0
        ? optionsFromLabels(labels)
        : [
            { label: "Starter", value: "starter" },
            { label: "Pro", value: "pro" },
          ];

    return (
      <RadioGroup
        defaultValue={str(props.defaultValue, options[0]?.value ?? "starter")}
        label={str(props.label, "Plan") || undefined}
        options={options}
        orientation={
          str(props.orientation, "vertical") as "vertical" | "horizontal"
        }
      />
    );
  },

  select: (props) => {
    const items = strList(props.items);
    const options = items.length > 0 ? items : ["Apple", "Banana", "Cherry"];
    const defaultValue = str(props.defaultValue, slug(options[0] ?? "apple"));

    return (
      <Select defaultValue={defaultValue}>
        <SelectTrigger>
          <SelectValue
            placeholder={str(props.placeholder, "Select an option")}
          />
        </SelectTrigger>
        <SelectContent>
          {options.map((item) => (
            <SelectItem key={item} value={slug(item)}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },

  slider: (props) => (
    <Slider
      defaultValue={num(props.defaultValue, 50)}
      max={num(props.max, 100)}
      min={num(props.min, 0)}
      showValue={bool(props.showValue) || props.showValue === undefined}
      size={str(props.size, "md") as "sm" | "md" | "lg"}
    />
  ),

  "theme-toggle": (props) => (
    <ThemeToggle
      applyToDocument={
        bool(props.applyToDocument) || props.applyToDocument === undefined
      }
      defaultPressed={bool(props.defaultPressed)}
      persist={bool(props.persist) || props.persist === undefined}
      size={str(props.size, "md") as "sm" | "md" | "lg"}
    />
  ),

  "wheel-picker": (props) => {
    const options = strList(props.options);
    const values = options.length > 0 ? options : ["AM", "PM"];

    return (
      <WheelPicker
        lens={bool(props.lens) || props.lens === undefined}
        visibleCount={num(props.visibleCount, 5) as 3 | 5 | 7}
      >
        <WheelPickerColumn defaultValue={values[0]} options={values} />
      </WheelPicker>
    );
  },

  collapsible: (props) => (
    <Collapsible defaultOpen={bool(props.defaultOpen)}>
      <CollapsibleTrigger>
        {str(props.triggerText, "Details")}
      </CollapsibleTrigger>
      <CollapsibleContent>
        {str(props.contentText, "Hidden content goes here.")}
      </CollapsibleContent>
    </Collapsible>
  ),

  infiniteribbon: (props) => {
    const items = strList(props.items);
    return (
      <InfiniteRibbon
        items={
          items.length > 0
            ? items
            : ["New release", "Free shipping", "Limited offer"]
        }
        pauseOnHover={
          bool(props.pauseOnHover) || props.pauseOnHover === undefined
        }
        reverse={bool(props.reverse)}
        variant={
          str(props.variant, "default") as "default" | "brand" | "warning"
        }
      />
    );
  },

  "selection-toolbar": () => <SelectionToolbarPreview />,

  "command-palette": (props) => (
    <CommandPalette
      emptyMessage={str(props.emptyMessage, "No results found.")}
      enableGlobalShortcut={false}
      groups={DEFAULT_COMMAND_GROUPS}
      placeholder={str(props.triggerLabel, "Search commands…")}
    />
  ),

  "faq-pro": (props) => {
    const items = itemList(props.items);
    const faqItems =
      items.length > 0
        ? items.map((item, index) => ({
            id: String(index + 1),
            question: item.title,
            answer: item.content,
          }))
        : DEFAULT_FAQ_ITEMS;

    return (
      <FaqPro
        defaultOpenFirst={bool(props.defaultOpenFirst)}
        hideSearch={bool(props.hideSearch)}
        items={faqItems}
        searchPlaceholder={str(props.searchPlaceholder, "Search FAQs...")}
      />
    );
  },

  "file-tree": () => <FileTreeFromItems items={DEFAULT_FILE_TREE} />,

  "alert-dialog": (props) => (
    <AlertDialog>
      <AlertDialogTrigger>{str(props.triggerText, "Open")}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {str(props.title, "Are you sure?")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {str(props.description, "This action cannot be undone.")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {str(props.cancelLabel, "Cancel")}
          </AlertDialogCancel>
          <AlertDialogAction>
            {str(props.actionLabel, "Continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),

  "context-menu": (props) => {
    const items = strList(props.items);
    const menuItems = items.length > 0 ? items : ["Copy", "Paste", "Delete"];

    return (
      <ContextMenu>
        <ContextMenuTrigger className="rounded-md border border-border border-dashed px-4 py-8 text-center text-muted-foreground text-sm">
          {str(props.triggerText, "Right click me")}
        </ContextMenuTrigger>
        <ContextMenuContent>
          {menuItems.map((item) => (
            <ContextMenuItem key={item}>{item}</ContextMenuItem>
          ))}
        </ContextMenuContent>
      </ContextMenu>
    );
  },

  dialog: (props) => (
    <Dialog>
      <DialogTrigger>{str(props.triggerText, "Open dialog")}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{str(props.title, "Edit profile")}</DialogTitle>
          <DialogDescription>
            {str(props.description, "Make changes here.")}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),

  drawer: (props) => (
    <Drawer>
      <DrawerTrigger>Open drawer</DrawerTrigger>
      <DrawerContent
        showCloseButton={
          bool(props.showCloseButton) || props.showCloseButton === undefined
        }
        size={str(props.size, "default") as "sm" | "default" | "lg" | "full"}
      >
        <DrawerHeader>
          <DrawerTitle>{str(props.title, "Drawer title")}</DrawerTitle>
          <DrawerDescription>
            {str(props.description, "Drawer description")}
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ),

  dropdown: (props) => {
    const items = strList(props.items);
    const menuItems =
      items.length > 0 ? items : ["Profile", "Settings", "Logout"];

    return (
      <Dropdown
        defaultValue={str(props.defaultValue, slug(menuItems[0] ?? "profile"))}
        variant={str(props.variant, "select") as "select" | "action"}
      >
        <DropdownTrigger>
          <DropdownValue
            placeholder={str(props.placeholder, "Select an option")}
          />
        </DropdownTrigger>
        <DropdownContent>
          {menuItems.map((item) => (
            <DropdownItem key={item} value={slug(item)}>
              {item}
            </DropdownItem>
          ))}
        </DropdownContent>
      </Dropdown>
    );
  },

  "hover-card": (props) => (
    <HoverCard>
      <HoverCardTrigger className="text-sm underline-offset-4 hover:underline">
        {str(props.triggerText, "Hover me")}
      </HoverCardTrigger>
      <HoverCardContent
        side={str(props.side, "bottom") as "top" | "right" | "bottom" | "left"}
      >
        {str(props.contentText, "Preview details")}
      </HoverCardContent>
    </HoverCard>
  ),

  popover: (props) => (
    <Popover defaultOpen={bool(props.defaultOpen)}>
      <PopoverTrigger>{str(props.triggerText, "Open popover")}</PopoverTrigger>
      <PopoverContent
        side={str(props.side, "bottom") as "top" | "right" | "bottom" | "left"}
      >
        {str(props.contentText, "Popover content")}
      </PopoverContent>
    </Popover>
  ),

  tooltip: (props) => (
    <Tooltip
      content={str(props.content, "Helpful tip")}
      delay={num(props.delay, 0.15)}
      side={str(props.side, "top") as "top" | "right" | "bottom" | "left"}
    >
      <button
        className="rounded-md border border-border px-3 py-1.5 text-sm"
        type="button"
      >
        {str(props.triggerText, "Hover me")}
      </button>
    </Tooltip>
  ),

  "radial-button": (props) => (
    <RadialButton disabled={bool(props.disabled)} loading={bool(props.loading)}>
      {str(props.text, "Continue")}
    </RadialButton>
  ),

  "dia-text": (props) => (
    <DiaText
      duration={num(props.duration, 1.2)}
      repeat={bool(props.repeat)}
      text={str(props.text, "Design in motion")}
      triggerOnView={
        bool(props.triggerOnView) || props.triggerOnView === undefined
      }
    />
  ),

  "morph-texts": (props) => {
    const words = strList(props.words);
    return (
      <MorphText
        interval={num(props.interval, 3000)}
        subtext={str(props.subtext) || undefined}
        words={words.length > 0 ? words : ["Design", "Build", "Ship"]}
      />
    );
  },

  "reveal-text": (props) => (
    <RevealText
      split={str(props.split, "word") as "word" | "char"}
      stagger={num(props.stagger, 0.09)}
      text={str(props.text, "Words reveal with blur")}
      whileInView={bool(props.whileInView)}
    />
  ),

  "shimmer-text": (props) => (
    <TextShimmer
      duration={num(props.duration, 2)}
      spread={num(props.spread, 2)}
    >
      {str(props.text, "Shimmer highlight")}
    </TextShimmer>
  ),

  "text-loop": (props) => {
    const items = strList(props.items);
    const values = items.length > 0 ? items : ["Fast", "Fluid", "Beautiful"];

    return <TextLoop interval={num(props.interval, 1)}>{values}</TextLoop>;
  },
};

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export function renderCatalogPreview(
  type: string,
  props: Record<string, unknown>
): ReactNode {
  const render = PREVIEW_RENDERERS[type];
  if (!render) {
    return (
      <p className="text-muted-foreground text-sm">
        Preview unavailable for “{type}”.
      </p>
    );
  }
  return render(props);
}
