"use client";

/**
 * Studio component definitions for catalog entries outside the 13 core
 * hand-crafted defs in registry.tsx.
 */

import {
  ActivityIcon,
  AlarmClockIcon,
  BarChart3Icon,
  BlocksIcon,
  BotIcon,
  BrainIcon,
  CalendarIcon,
  CircleDotIcon,
  ClipboardListIcon,
  CodeIcon,
  CommandIcon,
  FolderTreeIcon,
  FormInputIcon,
  GalleryHorizontalIcon,
  GitCommitHorizontalIcon,
  GripIcon,
  HashIcon,
  ImageIcon,
  LayersIcon,
  LayoutPanelTopIcon,
  ListTreeIcon,
  LoaderIcon,
  type LucideIcon,
  MessageSquareIcon,
  MousePointerClickIcon,
  PanelTopOpenIcon,
  PenLineIcon,
  QuoteIcon,
  RadarIcon,
  RowsIcon,
  ScrollTextIcon,
  SearchIcon,
  SparklesIcon,
  SquareStackIcon,
  StarIcon,
  TableIcon,
  TextCursorInputIcon,
  ToggleLeftIcon,
  TypeIcon,
  UploadIcon,
  WandSparklesIcon,
} from "lucide-react";

import {
  STUDIO_CATALOG,
  type StudioCatalogEntry,
  type StudioPaletteCategory,
} from "./catalog";
import { renderCatalogPreview } from "./catalog-preview";
import {
  expr,
  type ImportSpec,
  type JsxElement,
  serializeValue,
} from "./codegen";
import {
  DEFAULT_TESTIMONIAL_ITEMS,
  logoItems,
  slideItems,
  testimonialItems,
} from "./prop-items";
import type {
  PropControl,
  StudioCategory,
  StudioComponentDef,
} from "./registry";
import type { ComponentNode } from "./types";

/* ------------------------------------------------------------------ */
/* Shared helpers (mirrors registry.tsx)                               */
/* ------------------------------------------------------------------ */

export const str = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

export const bool = (value: unknown): boolean => value === true;

export const num = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

export const strList = (value: unknown): string[] =>
  Array.isArray(value) ? value.map((item) => String(item)) : [];

type TitledItem = { title: string; content: string };

export const itemList = (value: unknown): TitledItem[] =>
  Array.isArray(value)
    ? value.map((item) => ({
        title: str((item as TitledItem)?.title),
        content: str((item as TitledItem)?.content),
      }))
    : [];

export function omitDefault<T>(value: T, defaultValue: T): T | undefined {
  return value === defaultValue ? undefined : value;
}

const slug = (label: string) => label.toLowerCase().replace(/\s+/g, "-");

const optionsFromLabels = (labels: string[]) =>
  labels.map((label) => ({ label, value: slug(label) }));

function uiImport(cli: string, names: string[]): ImportSpec[] {
  if (names.length === 0) {
    return [];
  }
  return [{ names, path: `@/components/ui/${cli}` }];
}

/* ------------------------------------------------------------------ */
/* Core registry overlap                                               */
/* ------------------------------------------------------------------ */

const CORE_REGISTRY_TYPES = new Set([
  "button",
  "input",
  "checkbox",
  "switch",
  "tabs",
  "breadcrumbs",
  "accordion",
  "alert",
  "badge",
  "spinner",
  "card",
  "avatar",
  "divider",
]);

const PALETTE_TO_STUDIO_CATEGORY = (
  category: StudioPaletteCategory
): StudioCategory =>
  category === "Structure" ? "Structure" : (category as StudioCategory);

const CATEGORY_ICONS: Record<StudioPaletteCategory, LucideIcon> = {
  Structure: SquareStackIcon,
  Blocks: BlocksIcon,
  "Buttons & Actions": MousePointerClickIcon,
  "Display & Content": LayersIcon,
  "Feedback & Alerts": ActivityIcon,
  "Inputs & Forms": TextCursorInputIcon,
  "Layout & Toolbars": LayoutPanelTopIcon,
  Navigation: ListTreeIcon,
  "Overlay & Popups": PanelTopOpenIcon,
  "Special One": SparklesIcon,
  Texts: TypeIcon,
};

const TYPE_ICON_OVERRIDES: Partial<Record<string, LucideIcon>> = {
  "ai-input": BotIcon,
  "code-block": CodeIcon,
  "contribution-graph": GitCommitHorizontalIcon,
  "feedback-form": PenLineIcon,
  "logo-carousel": GalleryHorizontalIcon,
  message: MessageSquareIcon,
  "reasoning-steps": BrainIcon,
  "scroll-progress": ScrollTextIcon,
  "streaming-text": WandSparklesIcon,
  testimonials: QuoteIcon,
  "thinking-indicator": LoaderIcon,
  "flux-button": LoaderIcon,
  "icon-bar": GripIcon,
  toggle: ToggleLeftIcon,
  calendar: CalendarIcon,
  carousel: GalleryHorizontalIcon,
  charts: BarChart3Icon,
  "date-picker": CalendarIcon,
  "favicon-badge": ImageIcon,
  progress: ActivityIcon,
  "rolling-digits": HashIcon,
  skeleton: RowsIcon,
  "status-dot": CircleDotIcon,
  table: TableIcon,
  timezone: AlarmClockIcon,
  "verified-badge": StarIcon,
  autocomplete: SearchIcon,
  "color-picker": WandSparklesIcon,
  "file-upload": UploadIcon,
  "input-otp": HashIcon,
  "theme-toggle": ToggleLeftIcon,
  "wheel-picker": GripIcon,
  infiniteribbon: ScrollTextIcon,
  "selection-toolbar": PenLineIcon,
  "command-palette": CommandIcon,
  "faq-pro": ClipboardListIcon,
  "file-tree": FolderTreeIcon,
  "radial-button": RadarIcon,
  "dia-text": TypeIcon,
  "morph-texts": TypeIcon,
  "reveal-text": TypeIcon,
  "shimmer-text": SparklesIcon,
  "text-loop": TypeIcon,
};

type CatalogDefSpec = {
  imports: ImportSpec[];
  defaultProps: () => Record<string, unknown>;
  controls: PropControl[];
  emit: (
    node: ComponentNode,
    children: Array<JsxElement | string>
  ) => JsxElement;
  icon?: LucideIcon;
  keywords?: string[];
  interactivePreview?: boolean;
};

const CATALOG_DEF_SPECS: Record<string, CatalogDefSpec> = {
  "ai-input": {
    imports: uiImport("ai-input", ["AIInput"]),
    defaultProps: () => ({
      placeholder: "Ask for follow-up changes",
      showMessages: true,
    }),
    controls: [
      { kind: "text", key: "placeholder", label: "Placeholder" },
      { kind: "boolean", key: "showMessages", label: "Show messages" },
    ],
    emit: (node) => ({
      tag: "AIInput",
      props: {
        placeholder: str(node.props.placeholder, "Ask for follow-up changes"),
        showMessages: bool(node.props.showMessages) || undefined,
      },
    }),
    icon: BotIcon,
  },

  banner: {
    imports: uiImport("banner", ["Banner"]),
    defaultProps: () => ({
      text: "We just shipped a new feature.",
      variant: "default",
      actionLabel: "Learn more",
      dismissible: true,
    }),
    controls: [
      { kind: "text", key: "text", label: "Message" },
      {
        kind: "select",
        key: "variant",
        label: "Variant",
        options: [
          { label: "Default", value: "default" },
          { label: "Info", value: "info" },
          { label: "Success", value: "success" },
          { label: "Error", value: "error" },
        ],
      },
      { kind: "text", key: "actionLabel", label: "Action label" },
      { kind: "boolean", key: "dismissible", label: "Dismissible" },
    ],
    emit: (node) => ({
      tag: "Banner",
      props: {
        variant: omitDefault(str(node.props.variant, "default"), "default"),
        actionLabel: str(node.props.actionLabel, "Learn more") || undefined,
        dismissible: bool(node.props.dismissible) || undefined,
      },
      children: [str(node.props.text, "We just shipped a new feature.")],
    }),
  },

  "code-block": {
    imports: uiImport("code-block", ["CodeBlock"]),
    defaultProps: () => ({
      code: 'const hello = "world";',
      language: "typescript",
      filename: "example.ts",
      showLineNumbers: true,
    }),
    controls: [
      { kind: "textarea", key: "code", label: "Code" },
      { kind: "text", key: "language", label: "Language" },
      { kind: "text", key: "filename", label: "Filename" },
      { kind: "boolean", key: "showLineNumbers", label: "Line numbers" },
    ],
    emit: (node) => ({
      tag: "CodeBlock",
      props: {
        code: str(node.props.code, 'const hello = "world";'),
        language: str(node.props.language, "typescript") || undefined,
        filename: str(node.props.filename, "example.ts") || undefined,
        showLineNumbers: bool(node.props.showLineNumbers) || undefined,
      },
    }),
  },

  "contribution-graph": {
    imports: uiImport("contribution-graph", [
      "ContributionGraph",
      "ContributionGraphCalendar",
      "ContributionGraphFooter",
      "ContributionGraphLegend",
      "ContributionGraphTotalCount",
    ]),
    defaultProps: () => ({ username: "octocat", animated: true }),
    controls: [
      { kind: "text", key: "username", label: "GitHub username" },
      { kind: "boolean", key: "animated", label: "Animated" },
    ],
    emit: (node) => ({
      tag: "ContributionGraph",
      props: {
        username: str(node.props.username, "octocat") || undefined,
        animated: bool(node.props.animated) || undefined,
      },
      children: [
        {
          tag: "ContributionGraphCalendar",
          children: [
            {
              tag: "ContributionGraphFooter",
              children: [
                { tag: "ContributionGraphLegend" },
                { tag: "ContributionGraphTotalCount" },
              ],
            },
          ],
        },
      ],
    }),
  },

  "feedback-form": {
    imports: uiImport("feedback", ["FeedbackForm"]),
    defaultProps: () => ({
      label: "Iconiq UI",
      placeholder: "Share your feedback…",
    }),
    controls: [
      { kind: "text", key: "label", label: "Label" },
      { kind: "text", key: "placeholder", label: "Placeholder" },
    ],
    emit: (node) => ({
      tag: "FeedbackForm",
      props: {
        label: str(node.props.label, "Iconiq UI"),
        placeholder: str(node.props.placeholder, "Share your feedback…"),
      },
    }),
  },

  "logo-carousel": {
    imports: uiImport("logo-carousal", ["LogosCarousel"]),
    defaultProps: () => ({
      columnCount: 4,
      direction: "ltr",
      logos: [
        { src: "", alt: "Acme" },
        { src: "", alt: "Globex" },
        { src: "", alt: "Initech" },
        { src: "", alt: "Umbrella" },
      ],
    }),
    controls: [
      {
        kind: "fieldList",
        key: "logos",
        label: "Logos",
        itemNoun: "Logo",
        fields: [
          { key: "src", label: "Image", input: "image" },
          { key: "alt", label: "Name", input: "text", placeholder: "Company" },
        ],
        newItem: () => ({ src: "", alt: "Company" }),
      },
      { kind: "text", key: "columnCount", label: "Columns" },
      {
        kind: "select",
        key: "direction",
        label: "Direction",
        options: [
          { label: "Left to right", value: "ltr" },
          { label: "Right to left", value: "rtl" },
        ],
      },
    ],
    emit: (node) => ({
      tag: "LogosCarousel",
      props: {
        columnCount: num(node.props.columnCount, 4),
        direction: omitDefault(str(node.props.direction, "ltr"), "ltr"),
      },
      children: logoItems(node.props).map((logo) =>
        logo.src
          ? {
              tag: "img",
              props: {
                alt: logo.alt || "",
                className: "h-8 w-auto object-contain",
                src: logo.src,
              },
            }
          : {
              tag: "div",
              props: {
                className:
                  "flex h-10 items-center justify-center rounded-md border border-border/70 px-4 font-medium text-sm",
              },
              children: [logo.alt || "Logo"],
            }
      ),
    }),
    keywords: ["logos", "brands", "images", "marquee"],
  },

  message: {
    imports: uiImport("message", [
      "MessageGroup",
      "Message",
      "MessageBubble",
      "MessageContent",
    ]),
    defaultProps: () => ({
      align: "start",
      text: "Hello there!",
      variant: "default",
      animated: true,
    }),
    controls: [
      {
        kind: "select",
        key: "align",
        label: "Align",
        options: [
          { label: "Start", value: "start" },
          { label: "End", value: "end" },
        ],
      },
      { kind: "text", key: "text", label: "Message" },
      {
        kind: "select",
        key: "variant",
        label: "Variant",
        options: [
          { label: "Default", value: "default" },
          { label: "Primary", value: "primary" },
          { label: "Ghost", value: "ghost" },
        ],
      },
      { kind: "boolean", key: "animated", label: "Animated" },
    ],
    emit: (node) => ({
      tag: "MessageGroup",
      children: [
        {
          tag: "Message",
          props: {
            align: omitDefault(str(node.props.align, "start"), "start"),
            animated: bool(node.props.animated) || undefined,
          },
          children: [
            {
              tag: "MessageBubble",
              props: {
                variant: omitDefault(
                  str(node.props.variant, "default"),
                  "default"
                ),
              },
              children: [
                {
                  tag: "MessageContent",
                  children: [str(node.props.text, "Hello there!")],
                },
              ],
            },
          ],
        },
      ],
    }),
  },

  "reasoning-steps": {
    imports: uiImport("reasoning-steps", [
      "ReasoningSteps",
      "ReasoningStepsTrigger",
      "ReasoningStepsContent",
      "ReasoningStep",
    ]),
    defaultProps: () => ({
      defaultOpen: false,
      stepLabel: "Analyzing request",
      stepStatus: "done",
    }),
    controls: [
      { kind: "boolean", key: "defaultOpen", label: "Open by default" },
      { kind: "text", key: "stepLabel", label: "Step label" },
      {
        kind: "select",
        key: "stepStatus",
        label: "Step status",
        options: [
          { label: "Pending", value: "pending" },
          { label: "Active", value: "active" },
          { label: "Done", value: "done" },
        ],
      },
    ],
    emit: (node) => ({
      tag: "ReasoningSteps",
      props: {
        defaultOpen: bool(node.props.defaultOpen) || undefined,
      },
      children: [
        { tag: "ReasoningStepsTrigger" },
        {
          tag: "ReasoningStepsContent",
          children: [
            {
              tag: "ReasoningStep",
              props: {
                label: str(node.props.stepLabel, "Analyzing request"),
                status: str(node.props.stepStatus, "done"),
              },
            },
          ],
        },
      ],
    }),
  },

  "scroll-progress": {
    imports: uiImport("scroll-progress", ["ScrollProgress"]),
    defaultProps: () => ({
      position: "right",
      showLabel: true,
      height: 160,
    }),
    controls: [
      {
        kind: "select",
        key: "position",
        label: "Position",
        options: [
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
          { label: "Bottom left", value: "bottom-left" },
          { label: "Bottom right", value: "bottom-right" },
        ],
      },
      { kind: "boolean", key: "showLabel", label: "Show label" },
      { kind: "text", key: "height", label: "Height (px)" },
    ],
    emit: (node) => ({
      tag: "ScrollProgress",
      props: {
        position: omitDefault(str(node.props.position, "right"), "right"),
        showLabel: bool(node.props.showLabel) || undefined,
        height: num(node.props.height, 160),
      },
    }),
  },

  "streaming-text": {
    imports: uiImport("streaming-text", ["StreamingText"]),
    defaultProps: () => ({
      text: "Streaming word by word.",
      speed: 120,
      showCursor: true,
    }),
    controls: [
      { kind: "textarea", key: "text", label: "Text" },
      { kind: "text", key: "speed", label: "Speed (ms)" },
      { kind: "boolean", key: "showCursor", label: "Show cursor" },
    ],
    emit: (node) => ({
      tag: "StreamingText",
      props: {
        text: str(node.props.text, "Streaming word by word."),
        speed: num(node.props.speed, 120),
        showCursor: bool(node.props.showCursor) || undefined,
      },
    }),
  },

  testimonials: {
    imports: uiImport("testimonials", ["Testimonials", "Testimonial"]),
    defaultProps: () => ({
      blur: 4,
      dimOpacity: 0.2,
      items: DEFAULT_TESTIMONIAL_ITEMS.map((item) => ({ ...item })),
    }),
    controls: [
      {
        kind: "fieldList",
        key: "items",
        label: "Testimonials",
        itemNoun: "Testimonial",
        fields: [
          { key: "quote", label: "Quote", input: "textarea" },
          { key: "name", label: "Name", input: "text" },
          { key: "title", label: "Role / company", input: "text" },
          { key: "avatar", label: "Avatar", input: "image" },
        ],
        newItem: () => ({
          quote: "Another happy voice.",
          name: "New Name",
          title: "Role",
          avatar: "",
        }),
      },
      { kind: "text", key: "blur", label: "Blur (px)" },
      { kind: "text", key: "dimOpacity", label: "Dim opacity" },
    ],
    emit: (node) => ({
      tag: "Testimonials",
      props: {
        blur: num(node.props.blur, 4),
        dimOpacity: num(node.props.dimOpacity, 0.2),
      },
      children: testimonialItems(node.props).map((item) => ({
        tag: "Testimonial",
        props: {
          name: item.name || "Anonymous",
          title: item.title || undefined,
          avatar: item.avatar || undefined,
        },
        children: [item.quote || ""],
      })),
    }),
    keywords: ["quotes", "community", "voices", "reviews"],
  },

  "thinking-indicator": {
    imports: uiImport("thinking-indicator", ["ThinkingIndicator"]),
    defaultProps: () => ({
      words: ["Thinking", "Reasoning", "Planning"],
      interval: 3200,
      showIcon: true,
    }),
    controls: [
      {
        kind: "stringList",
        key: "words",
        label: "Words",
        itemLabel: "Word",
      },
      { kind: "text", key: "interval", label: "Interval (ms)" },
      { kind: "boolean", key: "showIcon", label: "Show icon" },
    ],
    emit: (node) => ({
      tag: "ThinkingIndicator",
      props: {
        words: expr(serializeValue(strList(node.props.words), 1)),
        interval: num(node.props.interval, 3200),
        showIcon: bool(node.props.showIcon) || undefined,
      },
    }),
  },

  "button-group": {
    imports: uiImport("button-group", ["SegmentedControl"]),
    defaultProps: () => ({
      options: ["Day", "Week", "Month"],
      size: "md",
    }),
    controls: [
      {
        kind: "stringList",
        key: "options",
        label: "Options",
        itemLabel: "Option",
      },
      {
        kind: "select",
        key: "size",
        label: "Size",
        options: [
          { label: "Small", value: "sm" },
          { label: "Medium", value: "md" },
          { label: "Large", value: "lg" },
        ],
      },
    ],
    emit: (node) => ({
      tag: "SegmentedControl",
      props: {
        ariaLabel: "Range",
        options: expr(serializeValue(strList(node.props.options), 1)),
        size: omitDefault(str(node.props.size, "md"), "md"),
      },
    }),
  },

  "flux-button": {
    interactivePreview: true,
    imports: uiImport("flux-button", ["FluxButton"]),
    defaultProps: () => ({
      idleLabel: "Save changes",
      loadingLabel: "Saving…",
      successLabel: "Saved",
      variant: "default",
      size: "default",
    }),
    controls: [
      { kind: "text", key: "idleLabel", label: "Idle label" },
      { kind: "text", key: "loadingLabel", label: "Loading label" },
      { kind: "text", key: "successLabel", label: "Success label" },
      {
        kind: "select",
        key: "variant",
        label: "Variant",
        options: [
          { label: "Default", value: "default" },
          { label: "Secondary", value: "secondary" },
          { label: "Outline", value: "outline" },
          { label: "Ghost", value: "ghost" },
          { label: "Destructive", value: "destructive" },
          { label: "Link", value: "link" },
        ],
      },
      {
        kind: "select",
        key: "size",
        label: "Size",
        options: [
          { label: "Small", value: "sm" },
          { label: "Default", value: "default" },
          { label: "Large", value: "lg" },
        ],
      },
    ],
    emit: (node) => ({
      tag: "FluxButton",
      props: {
        idleLabel: str(node.props.idleLabel, "Save changes"),
        loadingLabel: str(node.props.loadingLabel, "Saving…"),
        successLabel: str(node.props.successLabel, "Saved"),
        variant: omitDefault(str(node.props.variant, "default"), "default"),
        size: omitDefault(str(node.props.size, "default"), "default"),
        onAction: expr("async () => {}"),
      },
    }),
  },

  "icon-bar": {
    imports: uiImport("icon-bar", ["IconBar", "IconBarItem"]),
    defaultProps: () => ({ defaultValue: "home" }),
    controls: [{ kind: "text", key: "defaultValue", label: "Default value" }],
    emit: (node) => ({
      tag: "IconBar",
      props: {
        defaultValue: str(node.props.defaultValue, "home") || undefined,
      },
      children: [
        {
          tag: "IconBarItem",
          props: { icon: expr("HomeIcon"), label: "Home", value: "home" },
        },
      ],
    }),
  },

  toggle: {
    imports: uiImport("b-toggle", ["Toggle"]),
    defaultProps: () => ({
      text: "Bold",
      variant: "default",
      size: "default",
      defaultPressed: false,
    }),
    controls: [
      { kind: "text", key: "text", label: "Label" },
      {
        kind: "select",
        key: "variant",
        label: "Variant",
        options: [
          { label: "Default", value: "default" },
          { label: "Outline", value: "outline" },
        ],
      },
      {
        kind: "select",
        key: "size",
        label: "Size",
        options: [
          { label: "Small", value: "sm" },
          { label: "Default", value: "default" },
          { label: "Large", value: "lg" },
        ],
      },
      { kind: "boolean", key: "defaultPressed", label: "Pressed" },
    ],
    emit: (node) => ({
      tag: "Toggle",
      props: {
        variant: omitDefault(str(node.props.variant, "default"), "default"),
        size: omitDefault(str(node.props.size, "default"), "default"),
        defaultPressed: bool(node.props.defaultPressed) || undefined,
      },
      children: [str(node.props.text, "Bold")],
    }),
  },

  "toggle-group": {
    imports: uiImport("b-togglegroup", ["ToggleGroup", "ToggleGroupItem"]),
    defaultProps: () => ({
      items: ["List", "Grid", "Board"],
      multiple: true,
      orientation: "horizontal",
      variant: "default",
    }),
    controls: [
      {
        kind: "stringList",
        key: "items",
        label: "Items",
        itemLabel: "Item",
      },
      { kind: "boolean", key: "multiple", label: "Multiple selection" },
      {
        kind: "select",
        key: "orientation",
        label: "Orientation",
        options: [
          { label: "Horizontal", value: "horizontal" },
          { label: "Vertical", value: "vertical" },
        ],
      },
      {
        kind: "select",
        key: "variant",
        label: "Variant",
        options: [
          { label: "Default", value: "default" },
          { label: "Outline", value: "outline" },
        ],
      },
    ],
    emit: (node) => {
      const items = strList(node.props.items);
      return {
        tag: "ToggleGroup",
        props: {
          multiple: bool(node.props.multiple) || undefined,
          orientation: omitDefault(
            str(node.props.orientation, "horizontal"),
            "horizontal"
          ),
          variant: omitDefault(str(node.props.variant, "default"), "default"),
        },
        children: items.map((item) => ({
          tag: "ToggleGroupItem",
          props: { value: slug(item) },
          children: [item],
        })),
      };
    },
  },

  calendar: {
    imports: uiImport("calendar", ["Calendar"]),
    defaultProps: () => ({
      mode: "single",
      size: "md",
      showOutsideDays: true,
    }),
    controls: [
      {
        kind: "select",
        key: "mode",
        label: "Mode",
        options: [
          { label: "Single", value: "single" },
          { label: "Range", value: "range" },
        ],
      },
      {
        kind: "select",
        key: "size",
        label: "Size",
        options: [
          { label: "Small", value: "sm" },
          { label: "Medium", value: "md" },
          { label: "Large", value: "lg" },
        ],
      },
      { kind: "boolean", key: "showOutsideDays", label: "Outside days" },
    ],
    emit: (node) => ({
      tag: "Calendar",
      props: {
        mode: omitDefault(str(node.props.mode, "single"), "single"),
        size: omitDefault(str(node.props.size, "md"), "md"),
        showOutsideDays: bool(node.props.showOutsideDays) || undefined,
      },
    }),
  },

  carousel: {
    imports: uiImport("carousel", [
      "Carousel",
      "CarouselContent",
      "CarouselItem",
      "CarouselPrevious",
      "CarouselNext",
    ]),
    defaultProps: () => ({
      aspectRatio: "video",
      orientation: "horizontal",
      slides: [
        { src: "/assets/gradient.png", caption: "Slide 1" },
        { src: "", caption: "Slide 2" },
        { src: "", caption: "Slide 3" },
      ],
    }),
    controls: [
      {
        kind: "fieldList",
        key: "slides",
        label: "Slides",
        itemNoun: "Slide",
        fields: [
          { key: "src", label: "Image", input: "image" },
          { key: "caption", label: "Caption", input: "text" },
        ],
        newItem: () => ({ src: "", caption: "New slide" }),
      },
      {
        kind: "select",
        key: "aspectRatio",
        label: "Aspect ratio",
        options: [
          { label: "Video", value: "video" },
          { label: "Square", value: "square" },
          { label: "Portrait", value: "portrait" },
          { label: "4:3", value: "4/3" },
        ],
      },
      {
        kind: "select",
        key: "orientation",
        label: "Orientation",
        options: [
          { label: "Horizontal", value: "horizontal" },
          { label: "Vertical", value: "vertical" },
        ],
      },
    ],
    emit: (node) => ({
      tag: "Carousel",
      props: {
        aspectRatio: omitDefault(str(node.props.aspectRatio, "video"), "video"),
        orientation: omitDefault(
          str(node.props.orientation, "horizontal"),
          "horizontal"
        ),
      },
      children: [
        {
          tag: "CarouselContent",
          children: slideItems(node.props).map((slide) => ({
            tag: "CarouselItem",
            children: [
              slide.src
                ? {
                    tag: "img",
                    props: {
                      alt: slide.caption || "",
                      className: "size-full rounded-lg object-cover",
                      src: slide.src,
                    },
                  }
                : {
                    tag: "div",
                    props: {
                      className:
                        "flex size-full items-center justify-center rounded-lg border border-border/70 bg-muted/40 font-medium text-sm",
                    },
                    children: [slide.caption || "Slide"],
                  },
            ],
          })),
        },
        { tag: "CarouselPrevious" },
        { tag: "CarouselNext" },
      ],
    }),
    keywords: ["slides", "gallery", "images"],
  },

  charts: {
    imports: [
      ...uiImport("charts", [
        "ChartContainer",
        "ChartBar",
        "ChartTooltip",
        "ChartTooltipContent",
      ]),
      { names: ["BarChart", "CartesianGrid", "XAxis"], path: "recharts" },
    ],
    defaultProps: () => ({ chartType: "bar" }),
    controls: [
      {
        kind: "select",
        key: "chartType",
        label: "Chart type",
        options: [
          { label: "Bar", value: "bar" },
          { label: "Area", value: "area" },
        ],
      },
    ],
    emit: () => ({
      tag: "ChartContainer",
      props: {
        className: "w-full max-w-md",
        config: expr(
          serializeValue(
            { revenue: { label: "Revenue", color: "var(--chart-1)" } },
            1
          )
        ),
      },
      children: [
        {
          tag: "BarChart",
          props: {
            accessibilityLayer: true,
            data: expr(
              serializeValue(
                [
                  { month: "Jan", revenue: 120 },
                  { month: "Feb", revenue: 180 },
                ],
                1
              )
            ),
          },
          children: [
            { tag: "CartesianGrid", props: { vertical: false } },
            {
              tag: "XAxis",
              props: { axisLine: false, dataKey: "month", tickLine: false },
            },
            {
              tag: "ChartTooltip",
              props: {
                content: expr("<ChartTooltipContent hideLabel />"),
                cursor: false,
              },
            },
            {
              tag: "ChartBar",
              props: {
                dataKey: "revenue",
                fill: "var(--color-revenue)",
                radius: 4,
              },
            },
          ],
        },
      ],
    }),
  },

  "date-picker": {
    imports: uiImport("date-picker", ["DatePicker"]),
    defaultProps: () => ({
      placeholder: "Select a date",
      clearable: true,
      disabled: false,
      side: "bottom",
    }),
    controls: [
      { kind: "text", key: "placeholder", label: "Placeholder" },
      { kind: "boolean", key: "clearable", label: "Clearable" },
      { kind: "boolean", key: "disabled", label: "Disabled" },
      {
        kind: "select",
        key: "side",
        label: "Side",
        options: [
          { label: "Bottom", value: "bottom" },
          { label: "Top", value: "top" },
        ],
      },
    ],
    emit: (node) => ({
      tag: "DatePicker",
      props: {
        placeholder: str(node.props.placeholder, "Select a date"),
        clearable: bool(node.props.clearable) || undefined,
        disabled: bool(node.props.disabled) || undefined,
        side: omitDefault(str(node.props.side, "bottom"), "bottom"),
      },
    }),
  },

  "favicon-badge": {
    imports: uiImport("favicon-badge", ["FaviconBadge"]),
    defaultProps: () => ({
      website: "github.com",
      label: "GitHub",
      size: "md",
    }),
    controls: [
      { kind: "text", key: "website", label: "Website" },
      { kind: "text", key: "label", label: "Label" },
      {
        kind: "select",
        key: "size",
        label: "Size",
        options: [
          { label: "Small", value: "sm" },
          { label: "Medium", value: "md" },
          { label: "Large", value: "lg" },
        ],
      },
    ],
    emit: (node) => ({
      tag: "FaviconBadge",
      props: {
        website: str(node.props.website, "github.com"),
        label: str(node.props.label, "GitHub") || undefined,
        size: omitDefault(str(node.props.size, "md"), "md"),
      },
    }),
  },

  progress: {
    imports: uiImport("b-progress", ["Progress"]),
    defaultProps: () => ({
      value: 45,
      label: "Uploading",
      variant: "default",
      size: "md",
      tone: "default",
      showValue: true,
    }),
    controls: [
      { kind: "text", key: "value", label: "Value" },
      { kind: "text", key: "label", label: "Label" },
      {
        kind: "select",
        key: "variant",
        label: "Variant",
        options: [
          { label: "Default", value: "default" },
          { label: "Circular", value: "circular" },
        ],
      },
      {
        kind: "select",
        key: "size",
        label: "Size",
        options: [
          { label: "Small", value: "sm" },
          { label: "Medium", value: "md" },
          { label: "Large", value: "lg" },
        ],
      },
      {
        kind: "select",
        key: "tone",
        label: "Tone",
        options: [
          { label: "Default", value: "default" },
          { label: "Brand", value: "brand" },
          { label: "Destructive", value: "destructive" },
          { label: "Success", value: "success" },
        ],
      },
      { kind: "boolean", key: "showValue", label: "Show value" },
    ],
    emit: (node) => ({
      tag: "Progress",
      props: {
        value: num(node.props.value, 45),
        label: str(node.props.label, "Uploading") || undefined,
        variant: omitDefault(str(node.props.variant, "default"), "default"),
        size: omitDefault(str(node.props.size, "md"), "md"),
        tone: omitDefault(str(node.props.tone, "default"), "default"),
        showValue: bool(node.props.showValue) || undefined,
      },
    }),
  },

  "rolling-digits": {
    imports: uiImport("rolling-digits", ["RollingDigits"]),
    defaultProps: () => ({ value: 1284, startOnView: true }),
    controls: [
      { kind: "text", key: "value", label: "Value" },
      { kind: "boolean", key: "startOnView", label: "Start on view" },
    ],
    emit: (node) => ({
      tag: "RollingDigits",
      props: {
        value: num(node.props.value, 1284),
        startOnView: bool(node.props.startOnView) || undefined,
      },
    }),
  },

  skeleton: {
    imports: uiImport("skeleton", ["Skeleton"]),
    defaultProps: () => ({
      variant: "shimmer",
      rounded: "md",
      animate: true,
      className: "h-4 w-48",
    }),
    controls: [
      {
        kind: "select",
        key: "variant",
        label: "Variant",
        options: [
          { label: "Shimmer", value: "shimmer" },
          { label: "Fade", value: "fade" },
        ],
      },
      {
        kind: "select",
        key: "rounded",
        label: "Rounded",
        options: [
          { label: "None", value: "none" },
          { label: "Small", value: "sm" },
          { label: "Medium", value: "md" },
          { label: "Large", value: "lg" },
          { label: "Full", value: "full" },
        ],
      },
      { kind: "boolean", key: "animate", label: "Animate" },
      { kind: "text", key: "className", label: "Classes" },
    ],
    emit: (node) => ({
      tag: "Skeleton",
      props: {
        variant: omitDefault(str(node.props.variant, "shimmer"), "shimmer"),
        rounded: omitDefault(str(node.props.rounded, "md"), "md"),
        animate: bool(node.props.animate) || undefined,
        className: str(node.props.className, "h-4 w-48"),
      },
    }),
  },

  "status-dot": {
    imports: uiImport("status-dot", ["StatusDot"]),
    defaultProps: () => ({
      state: "BUILDING",
      size: "md",
      showLabel: true,
      inline: false,
    }),
    controls: [
      {
        kind: "select",
        key: "state",
        label: "State",
        options: [
          { label: "Queued", value: "QUEUED" },
          { label: "Building", value: "BUILDING" },
          { label: "Error", value: "ERROR" },
          { label: "Ready", value: "READY" },
          { label: "Canceled", value: "CANCELED" },
        ],
      },
      {
        kind: "select",
        key: "size",
        label: "Size",
        options: [
          { label: "Small", value: "sm" },
          { label: "Medium", value: "md" },
          { label: "Large", value: "lg" },
        ],
      },
      { kind: "boolean", key: "showLabel", label: "Show label" },
      { kind: "boolean", key: "inline", label: "Inline" },
    ],
    emit: (node) => ({
      tag: "StatusDot",
      props: {
        state: str(node.props.state, "BUILDING"),
        size: omitDefault(str(node.props.size, "md"), "md"),
        showLabel: bool(node.props.showLabel) || undefined,
        inline: bool(node.props.inline) || undefined,
      },
    }),
  },

  table: {
    imports: uiImport("table", [
      "Table",
      "TableHeader",
      "TableBody",
      "TableRow",
      "TableHead",
      "TableCell",
    ]),
    defaultProps: () => ({
      size: "default",
      columns: ["Name", "Role", "Status"],
    }),
    controls: [
      {
        kind: "select",
        key: "size",
        label: "Size",
        options: [
          { label: "Default", value: "default" },
          { label: "Compact", value: "compact" },
        ],
      },
      {
        kind: "stringList",
        key: "columns",
        label: "Columns",
        itemLabel: "Column",
      },
    ],
    emit: (node) => {
      const columns = strList(node.props.columns);
      return {
        tag: "Table",
        props: {
          size: omitDefault(str(node.props.size, "default"), "default"),
        },
        children: [
          {
            tag: "TableHeader",
            children: [
              {
                tag: "TableRow",
                props: { variant: "header" },
                children: columns.map((col) => ({
                  tag: "TableHead",
                  children: [col],
                })),
              },
            ],
          },
          {
            tag: "TableBody",
            children: [
              {
                tag: "TableRow",
                children: columns.map((_col, index) => ({
                  tag: "TableCell",
                  children: [
                    index === 0
                      ? "Ada Lovelace"
                      : index === 1
                        ? "Engineer"
                        : "Active",
                  ],
                })),
              },
            ],
          },
        ],
      };
    },
  },

  timezone: {
    imports: uiImport("timezone", ["Timezone"]),
    defaultProps: () => ({
      zone: "America/New_York",
      format: "12h",
      showZoneLabel: true,
      live: false,
    }),
    controls: [
      { kind: "text", key: "zone", label: "Timezone" },
      {
        kind: "select",
        key: "format",
        label: "Format",
        options: [
          { label: "12 hour", value: "12h" },
          { label: "24 hour", value: "24h" },
        ],
      },
      { kind: "boolean", key: "showZoneLabel", label: "Show zone label" },
      { kind: "boolean", key: "live", label: "Live updates" },
    ],
    emit: (node) => ({
      tag: "Timezone",
      props: {
        zone: str(node.props.zone, "America/New_York"),
        format: omitDefault(str(node.props.format, "12h"), "12h"),
        showZoneLabel: bool(node.props.showZoneLabel) || undefined,
        live: bool(node.props.live) || undefined,
      },
    }),
  },

  "verified-badge": {
    imports: uiImport("verified-badge", ["VerifiedBadge"]),
    defaultProps: () => ({
      variant: "shimmer",
      size: "md",
      tone: "brand",
      decorative: false,
    }),
    controls: [
      {
        kind: "select",
        key: "variant",
        label: "Variant",
        options: [
          { label: "Shimmer", value: "shimmer" },
          { label: "Static", value: "static" },
        ],
      },
      {
        kind: "select",
        key: "size",
        label: "Size",
        options: [
          { label: "Small", value: "sm" },
          { label: "Medium", value: "md" },
          { label: "Large", value: "lg" },
        ],
      },
      {
        kind: "select",
        key: "tone",
        label: "Tone",
        options: [
          { label: "Brand", value: "brand" },
          { label: "Gold", value: "gold" },
          { label: "Neutral", value: "neutral" },
        ],
      },
      { kind: "boolean", key: "decorative", label: "Decorative" },
    ],
    emit: (node) => ({
      tag: "VerifiedBadge",
      props: {
        variant: omitDefault(str(node.props.variant, "shimmer"), "shimmer"),
        size: omitDefault(str(node.props.size, "md"), "md"),
        tone: omitDefault(str(node.props.tone, "brand"), "brand"),
        decorative: bool(node.props.decorative) || undefined,
      },
    }),
  },

  autocomplete: {
    imports: uiImport("b-autocomplete", [
      "Autocomplete",
      "AutocompleteInput",
      "AutocompleteContent",
      "AutocompleteList",
      "AutocompleteItem",
      "AutocompleteEmpty",
    ]),
    defaultProps: () => ({
      placeholder: "Search frameworks…",
      items: ["Next.js", "Remix", "Astro"],
    }),
    controls: [
      { kind: "text", key: "placeholder", label: "Placeholder" },
      {
        kind: "stringList",
        key: "items",
        label: "Items",
        itemLabel: "Item",
      },
    ],
    emit: (node) => {
      const items = strList(node.props.items);
      return {
        tag: "Autocomplete",
        props: {
          items: expr(serializeValue(items, 1)),
        },
        children: [
          {
            tag: "AutocompleteInput",
            props: {
              placeholder: str(node.props.placeholder, "Search frameworks…"),
            },
          },
          {
            tag: "AutocompleteContent",
            children: [
              {
                tag: "AutocompleteList",
                children: items.map((item) => ({
                  tag: "AutocompleteItem",
                  props: { value: item },
                  children: [item],
                })),
              },
              { tag: "AutocompleteEmpty", children: ["No results"] },
            ],
          },
        ],
      };
    },
  },

  "checkbox-group": {
    imports: uiImport("checkbox-group", ["CheckboxGroup"]),
    defaultProps: () => ({ options: ["Email", "SMS"] }),
    controls: [
      {
        kind: "stringList",
        key: "options",
        label: "Options",
        itemLabel: "Option",
      },
    ],
    emit: (node) => ({
      tag: "CheckboxGroup",
      props: {
        options: expr(
          serializeValue(optionsFromLabels(strList(node.props.options)), 1)
        ),
      },
    }),
  },

  "color-picker": {
    imports: uiImport("color-picker", ["ColorPicker"]),
    defaultProps: () => ({
      defaultValue: "#3B82F6",
      variant: "inline",
      showAlpha: true,
      showCopy: false,
    }),
    controls: [
      { kind: "text", key: "defaultValue", label: "Default color" },
      {
        kind: "select",
        key: "variant",
        label: "Variant",
        options: [
          { label: "Inline", value: "inline" },
          { label: "Popover", value: "popover" },
          { label: "Swatch", value: "swatch" },
        ],
      },
      { kind: "boolean", key: "showAlpha", label: "Show alpha" },
      { kind: "boolean", key: "showCopy", label: "Show copy" },
    ],
    emit: (node) => ({
      tag: "ColorPicker",
      props: {
        defaultValue: str(node.props.defaultValue, "#3B82F6"),
        variant: omitDefault(str(node.props.variant, "inline"), "inline"),
        showAlpha: bool(node.props.showAlpha) || undefined,
        showCopy: bool(node.props.showCopy) || undefined,
      },
    }),
  },

  combobox: {
    imports: uiImport("b-combobox", [
      "Combobox",
      "ComboboxInput",
      "ComboboxContent",
      "ComboboxList",
      "ComboboxItem",
      "ComboboxEmpty",
    ]),
    defaultProps: () => ({
      placeholder: "Select framework…",
      items: ["Next.js", "Remix", "Astro"],
    }),
    controls: [
      { kind: "text", key: "placeholder", label: "Placeholder" },
      {
        kind: "stringList",
        key: "items",
        label: "Items",
        itemLabel: "Item",
      },
    ],
    emit: (node) => {
      const items = strList(node.props.items);
      return {
        tag: "Combobox",
        children: [
          {
            tag: "ComboboxInput",
            props: {
              placeholder: str(node.props.placeholder, "Select framework…"),
            },
          },
          {
            tag: "ComboboxContent",
            children: [
              {
                tag: "ComboboxList",
                children: items.map((item) => ({
                  tag: "ComboboxItem",
                  props: { value: slug(item) },
                  children: [item],
                })),
              },
              { tag: "ComboboxEmpty", children: ["No results"] },
            ],
          },
        ],
      };
    },
  },

  "file-upload": {
    imports: uiImport("file-upload", ["FileUpload"]),
    defaultProps: () => ({
      dropzoneTitle: "Drop files here",
      multiple: true,
      disabled: false,
    }),
    controls: [
      { kind: "text", key: "dropzoneTitle", label: "Dropzone title" },
      { kind: "boolean", key: "multiple", label: "Multiple files" },
      { kind: "boolean", key: "disabled", label: "Disabled" },
    ],
    emit: (node) => ({
      tag: "FileUpload",
      props: {
        dropzoneTitle: str(node.props.dropzoneTitle, "Drop files here"),
        multiple: bool(node.props.multiple) || undefined,
        disabled: bool(node.props.disabled) || undefined,
      },
    }),
  },

  "input-otp": {
    imports: uiImport("input-otp", ["OTP", "OTPSlots"]),
    defaultProps: () => ({
      length: 6,
      label: "Verification code",
      size: "default",
      mask: false,
    }),
    controls: [
      { kind: "text", key: "length", label: "Length" },
      { kind: "text", key: "label", label: "Label" },
      {
        kind: "select",
        key: "size",
        label: "Size",
        options: [
          { label: "Small", value: "sm" },
          { label: "Default", value: "default" },
        ],
      },
      { kind: "boolean", key: "mask", label: "Mask input" },
    ],
    emit: (node) => ({
      tag: "OTP",
      props: {
        length: num(node.props.length, 6),
        label: str(node.props.label, "Verification code") || undefined,
        size: omitDefault(str(node.props.size, "default"), "default"),
        mask: bool(node.props.mask) || undefined,
      },
      children: [{ tag: "OTPSlots" }],
    }),
  },

  "radio-group": {
    imports: uiImport("b-radio-group", ["RadioGroup"]),
    defaultProps: () => ({
      label: "Plan",
      options: ["Starter", "Pro"],
      orientation: "vertical",
      defaultValue: "starter",
    }),
    controls: [
      { kind: "text", key: "label", label: "Label" },
      {
        kind: "stringList",
        key: "options",
        label: "Options",
        itemLabel: "Option",
      },
      {
        kind: "select",
        key: "orientation",
        label: "Orientation",
        options: [
          { label: "Vertical", value: "vertical" },
          { label: "Horizontal", value: "horizontal" },
        ],
      },
      { kind: "text", key: "defaultValue", label: "Default value" },
    ],
    emit: (node) => ({
      tag: "RadioGroup",
      props: {
        label: str(node.props.label, "Plan") || undefined,
        options: expr(
          serializeValue(optionsFromLabels(strList(node.props.options)), 1)
        ),
        orientation: omitDefault(
          str(node.props.orientation, "vertical"),
          "vertical"
        ),
        defaultValue: str(node.props.defaultValue, "starter"),
      },
    }),
  },

  select: {
    imports: uiImport("b-select", [
      "Select",
      "SelectTrigger",
      "SelectValue",
      "SelectContent",
      "SelectItem",
    ]),
    defaultProps: () => ({
      placeholder: "Select an option",
      items: ["Apple", "Banana", "Cherry"],
      defaultValue: "apple",
    }),
    controls: [
      { kind: "text", key: "placeholder", label: "Placeholder" },
      {
        kind: "stringList",
        key: "items",
        label: "Items",
        itemLabel: "Item",
      },
      { kind: "text", key: "defaultValue", label: "Default value" },
    ],
    emit: (node) => {
      const items = strList(node.props.items);
      return {
        tag: "Select",
        props: {
          defaultValue: str(node.props.defaultValue, slug(items[0] ?? "apple")),
        },
        children: [
          {
            tag: "SelectTrigger",
            children: [
              {
                tag: "SelectValue",
                props: {
                  placeholder: str(node.props.placeholder, "Select an option"),
                },
              },
            ],
          },
          {
            tag: "SelectContent",
            children: items.map((item) => ({
              tag: "SelectItem",
              props: { value: slug(item) },
              children: [item],
            })),
          },
        ],
      };
    },
  },

  slider: {
    imports: uiImport("b-slider", ["Slider"]),
    defaultProps: () => ({
      defaultValue: 50,
      min: 0,
      max: 100,
      size: "md",
      showValue: true,
    }),
    controls: [
      { kind: "text", key: "defaultValue", label: "Default value" },
      { kind: "text", key: "min", label: "Min" },
      { kind: "text", key: "max", label: "Max" },
      {
        kind: "select",
        key: "size",
        label: "Size",
        options: [
          { label: "Small", value: "sm" },
          { label: "Medium", value: "md" },
          { label: "Large", value: "lg" },
        ],
      },
      { kind: "boolean", key: "showValue", label: "Show value" },
    ],
    emit: (node) => ({
      tag: "Slider",
      props: {
        defaultValue: num(node.props.defaultValue, 50),
        min: num(node.props.min, 0),
        max: num(node.props.max, 100),
        size: omitDefault(str(node.props.size, "md"), "md"),
        showValue: bool(node.props.showValue) || undefined,
      },
    }),
  },

  "theme-toggle": {
    imports: uiImport("theme-toggle", ["ThemeToggle"]),
    defaultProps: () => ({
      size: "md",
      defaultPressed: false,
      persist: true,
      applyToDocument: true,
    }),
    controls: [
      {
        kind: "select",
        key: "size",
        label: "Size",
        options: [
          { label: "Small", value: "sm" },
          { label: "Medium", value: "md" },
          { label: "Large", value: "lg" },
        ],
      },
      { kind: "boolean", key: "defaultPressed", label: "Dark by default" },
      { kind: "boolean", key: "persist", label: "Persist preference" },
      { kind: "boolean", key: "applyToDocument", label: "Apply to document" },
    ],
    emit: (node) => ({
      tag: "ThemeToggle",
      props: {
        size: omitDefault(str(node.props.size, "md"), "md"),
        defaultPressed: bool(node.props.defaultPressed) || undefined,
        persist: bool(node.props.persist) || undefined,
        applyToDocument: bool(node.props.applyToDocument) || undefined,
      },
    }),
  },

  "wheel-picker": {
    imports: uiImport("wheel-picker", ["WheelPicker", "WheelPickerColumn"]),
    defaultProps: () => ({
      visibleCount: 5,
      lens: true,
      options: ["AM", "PM"],
    }),
    controls: [
      {
        kind: "select",
        key: "visibleCount",
        label: "Visible count",
        options: [
          { label: "3", value: "3" },
          { label: "5", value: "5" },
          { label: "7", value: "7" },
        ],
      },
      { kind: "boolean", key: "lens", label: "Lens effect" },
      {
        kind: "stringList",
        key: "options",
        label: "Options",
        itemLabel: "Option",
      },
    ],
    emit: (node) => {
      const options = strList(node.props.options);
      return {
        tag: "WheelPicker",
        props: {
          visibleCount: num(node.props.visibleCount, 5),
          lens: bool(node.props.lens) || undefined,
        },
        children: [
          {
            tag: "WheelPickerColumn",
            props: {
              options: expr(serializeValue(options, 1)),
              defaultValue: options[0] ?? "AM",
            },
          },
        ],
      };
    },
  },

  collapsible: {
    imports: uiImport("b-collapsible", [
      "Collapsible",
      "CollapsibleTrigger",
      "CollapsibleContent",
    ]),
    defaultProps: () => ({
      defaultOpen: false,
      triggerText: "Details",
      contentText: "Hidden content goes here.",
    }),
    controls: [
      { kind: "boolean", key: "defaultOpen", label: "Open by default" },
      { kind: "text", key: "triggerText", label: "Trigger" },
      { kind: "textarea", key: "contentText", label: "Content" },
    ],
    emit: (node) => ({
      tag: "Collapsible",
      props: {
        defaultOpen: bool(node.props.defaultOpen) || undefined,
      },
      children: [
        {
          tag: "CollapsibleTrigger",
          children: [str(node.props.triggerText, "Details")],
        },
        {
          tag: "CollapsibleContent",
          children: [str(node.props.contentText, "Hidden content goes here.")],
        },
      ],
    }),
  },

  infiniteribbon: {
    imports: uiImport("infiniteribbon", ["InfiniteRibbon"]),
    defaultProps: () => ({
      items: ["New release", "Free shipping", "Limited offer"],
      variant: "default",
      pauseOnHover: true,
      reverse: false,
    }),
    controls: [
      {
        kind: "stringList",
        key: "items",
        label: "Items",
        itemLabel: "Item",
      },
      {
        kind: "select",
        key: "variant",
        label: "Variant",
        options: [
          { label: "Default", value: "default" },
          { label: "Brand", value: "brand" },
          { label: "Warning", value: "warning" },
        ],
      },
      { kind: "boolean", key: "pauseOnHover", label: "Pause on hover" },
      { kind: "boolean", key: "reverse", label: "Reverse" },
    ],
    emit: (node) => ({
      tag: "InfiniteRibbon",
      props: {
        items: expr(serializeValue(strList(node.props.items), 1)),
        variant: omitDefault(str(node.props.variant, "default"), "default"),
        pauseOnHover: bool(node.props.pauseOnHover) || undefined,
        reverse: bool(node.props.reverse) || undefined,
      },
    }),
  },

  "selection-toolbar": {
    imports: uiImport("b-selection-toolbar", ["SelectionToolbar"]),
    defaultProps: () => ({}),
    controls: [],
    emit: () => ({
      tag: "div",
      props: { className: "min-h-16 rounded-lg border p-3" },
      children: [
        "Select text to format.",
        {
          tag: "SelectionToolbar",
          props: { containerRef: expr("containerRef") },
        },
      ],
    }),
  },

  "command-palette": {
    imports: uiImport("command-palette", ["CommandPalette"]),
    defaultProps: () => ({
      triggerLabel: "Search commands…",
      emptyMessage: "No results found.",
      enableGlobalShortcut: false,
    }),
    controls: [
      { kind: "text", key: "triggerLabel", label: "Placeholder" },
      { kind: "text", key: "emptyMessage", label: "Empty message" },
      {
        kind: "boolean",
        key: "enableGlobalShortcut",
        label: "Global shortcut",
      },
    ],
    emit: (node) => ({
      tag: "CommandPalette",
      props: {
        placeholder: str(node.props.triggerLabel, "Search commands…"),
        emptyMessage: str(node.props.emptyMessage, "No results found."),
        enableGlobalShortcut:
          bool(node.props.enableGlobalShortcut) || undefined,
        groups: expr(
          serializeValue(
            [
              {
                heading: "General",
                items: [{ id: "home", label: "Home", href: "/" }],
              },
            ],
            1
          )
        ),
      },
    }),
  },

  "faq-pro": {
    imports: uiImport("faq-pro", ["FaqPro"]),
    defaultProps: () => ({
      searchPlaceholder: "Search FAQs...",
      defaultOpenFirst: false,
      hideSearch: false,
      items: [
        {
          title: "What is Iconiq?",
          content: "A motion-first UI kit for React.",
        },
      ],
    }),
    controls: [
      {
        kind: "fieldList",
        key: "items",
        label: "FAQ items",
        itemNoun: "Question",
        // Keys stay title/content for compatibility with saved projects.
        fields: [
          { key: "title", label: "Question", input: "text" },
          { key: "content", label: "Answer", input: "textarea" },
        ],
        newItem: () => ({ title: "New question?", content: "The answer." }),
      },
      { kind: "text", key: "searchPlaceholder", label: "Search placeholder" },
      { kind: "boolean", key: "defaultOpenFirst", label: "Open first item" },
      { kind: "boolean", key: "hideSearch", label: "Hide search" },
    ],
    emit: (node) => {
      const items = itemList(node.props.items).map((item, index) => ({
        id: String(index + 1),
        question: item.title,
        answer: item.content,
      }));
      return {
        tag: "FaqPro",
        props: {
          searchPlaceholder: str(
            node.props.searchPlaceholder,
            "Search FAQs..."
          ),
          defaultOpenFirst: bool(node.props.defaultOpenFirst) || undefined,
          hideSearch: bool(node.props.hideSearch) || undefined,
          items: expr(serializeValue(items, 1)),
        },
      };
    },
  },

  "file-tree": {
    imports: uiImport("file-tree", ["FileTreeFromItems"]),
    defaultProps: () => ({}),
    controls: [],
    emit: () => ({
      tag: "FileTreeFromItems",
      props: {
        items: expr(
          serializeValue(
            [
              {
                id: "src",
                label: "src",
                children: [{ id: "app.tsx", label: "app.tsx" }],
              },
            ],
            1
          )
        ),
      },
    }),
  },

  "alert-dialog": {
    imports: uiImport("b-alert-dialog", [
      "AlertDialog",
      "AlertDialogTrigger",
      "AlertDialogContent",
      "AlertDialogHeader",
      "AlertDialogTitle",
      "AlertDialogDescription",
      "AlertDialogFooter",
      "AlertDialogCancel",
      "AlertDialogAction",
    ]),
    defaultProps: () => ({
      triggerText: "Open",
      title: "Are you sure?",
      description: "This action cannot be undone.",
      cancelLabel: "Cancel",
      actionLabel: "Continue",
    }),
    controls: [
      { kind: "text", key: "triggerText", label: "Trigger" },
      { kind: "text", key: "title", label: "Title" },
      { kind: "textarea", key: "description", label: "Description" },
      { kind: "text", key: "cancelLabel", label: "Cancel label" },
      { kind: "text", key: "actionLabel", label: "Action label" },
    ],
    emit: (node) => ({
      tag: "AlertDialog",
      children: [
        {
          tag: "AlertDialogTrigger",
          children: [str(node.props.triggerText, "Open")],
        },
        {
          tag: "AlertDialogContent",
          children: [
            {
              tag: "AlertDialogHeader",
              children: [
                {
                  tag: "AlertDialogTitle",
                  children: [str(node.props.title, "Are you sure?")],
                },
                {
                  tag: "AlertDialogDescription",
                  children: [
                    str(
                      node.props.description,
                      "This action cannot be undone."
                    ),
                  ],
                },
              ],
            },
            {
              tag: "AlertDialogFooter",
              children: [
                {
                  tag: "AlertDialogCancel",
                  children: [str(node.props.cancelLabel, "Cancel")],
                },
                {
                  tag: "AlertDialogAction",
                  children: [str(node.props.actionLabel, "Continue")],
                },
              ],
            },
          ],
        },
      ],
    }),
  },

  "context-menu": {
    imports: uiImport("b-context-menu", [
      "ContextMenu",
      "ContextMenuTrigger",
      "ContextMenuContent",
      "ContextMenuItem",
    ]),
    defaultProps: () => ({
      triggerText: "Right click me",
      items: ["Copy", "Paste", "Delete"],
    }),
    controls: [
      { kind: "text", key: "triggerText", label: "Trigger" },
      {
        kind: "stringList",
        key: "items",
        label: "Items",
        itemLabel: "Item",
      },
    ],
    emit: (node) => {
      const items = strList(node.props.items);
      return {
        tag: "ContextMenu",
        children: [
          {
            tag: "ContextMenuTrigger",
            children: [str(node.props.triggerText, "Right click me")],
          },
          {
            tag: "ContextMenuContent",
            children: items.map((item) => ({
              tag: "ContextMenuItem",
              children: [item],
            })),
          },
        ],
      };
    },
  },

  dialog: {
    imports: uiImport("b-dialog", [
      "Dialog",
      "DialogTrigger",
      "DialogContent",
      "DialogHeader",
      "DialogTitle",
      "DialogDescription",
    ]),
    defaultProps: () => ({
      triggerText: "Open dialog",
      title: "Edit profile",
      description: "Make changes here.",
    }),
    controls: [
      { kind: "text", key: "triggerText", label: "Trigger" },
      { kind: "text", key: "title", label: "Title" },
      { kind: "textarea", key: "description", label: "Description" },
    ],
    emit: (node) => ({
      tag: "Dialog",
      children: [
        {
          tag: "DialogTrigger",
          children: [str(node.props.triggerText, "Open dialog")],
        },
        {
          tag: "DialogContent",
          children: [
            {
              tag: "DialogHeader",
              children: [
                {
                  tag: "DialogTitle",
                  children: [str(node.props.title, "Edit profile")],
                },
                {
                  tag: "DialogDescription",
                  children: [str(node.props.description, "Make changes here.")],
                },
              ],
            },
          ],
        },
      ],
    }),
  },

  drawer: {
    imports: uiImport("drawer", [
      "Drawer",
      "DrawerTrigger",
      "DrawerContent",
      "DrawerHeader",
      "DrawerTitle",
      "DrawerDescription",
    ]),
    defaultProps: () => ({
      title: "Drawer title",
      description: "Drawer description",
      size: "default",
      showCloseButton: true,
    }),
    controls: [
      { kind: "text", key: "title", label: "Title" },
      { kind: "textarea", key: "description", label: "Description" },
      {
        kind: "select",
        key: "size",
        label: "Size",
        options: [
          { label: "Small", value: "sm" },
          { label: "Default", value: "default" },
          { label: "Large", value: "lg" },
          { label: "Full", value: "full" },
        ],
      },
      { kind: "boolean", key: "showCloseButton", label: "Close button" },
    ],
    emit: (node) => ({
      tag: "Drawer",
      children: [
        { tag: "DrawerTrigger", children: ["Open drawer"] },
        {
          tag: "DrawerContent",
          props: {
            size: omitDefault(str(node.props.size, "default"), "default"),
            showCloseButton: bool(node.props.showCloseButton) || undefined,
          },
          children: [
            {
              tag: "DrawerHeader",
              children: [
                {
                  tag: "DrawerTitle",
                  children: [str(node.props.title, "Drawer title")],
                },
                {
                  tag: "DrawerDescription",
                  children: [str(node.props.description, "Drawer description")],
                },
              ],
            },
          ],
        },
      ],
    }),
  },

  dropdown: {
    imports: uiImport("r-dropdown", [
      "Dropdown",
      "DropdownTrigger",
      "DropdownValue",
      "DropdownContent",
      "DropdownItem",
    ]),
    defaultProps: () => ({
      variant: "select",
      placeholder: "Select an option",
      items: ["Profile", "Settings", "Logout"],
      defaultValue: "profile",
    }),
    controls: [
      {
        kind: "select",
        key: "variant",
        label: "Variant",
        options: [
          { label: "Select", value: "select" },
          { label: "Action", value: "action" },
        ],
      },
      { kind: "text", key: "placeholder", label: "Placeholder" },
      {
        kind: "stringList",
        key: "items",
        label: "Items",
        itemLabel: "Item",
      },
      { kind: "text", key: "defaultValue", label: "Default value" },
    ],
    emit: (node) => {
      const items = strList(node.props.items);
      return {
        tag: "Dropdown",
        props: {
          variant: omitDefault(str(node.props.variant, "select"), "select"),
          defaultValue: str(
            node.props.defaultValue,
            slug(items[0] ?? "profile")
          ),
        },
        children: [
          {
            tag: "DropdownTrigger",
            children: [
              {
                tag: "DropdownValue",
                props: {
                  placeholder: str(node.props.placeholder, "Select an option"),
                },
              },
            ],
          },
          {
            tag: "DropdownContent",
            children: items.map((item) => ({
              tag: "DropdownItem",
              props: { value: slug(item) },
              children: [item],
            })),
          },
        ],
      };
    },
  },

  "hover-card": {
    imports: uiImport("b-hover-card", [
      "HoverCard",
      "HoverCardTrigger",
      "HoverCardContent",
    ]),
    defaultProps: () => ({
      triggerText: "Hover me",
      contentText: "Preview details",
      side: "bottom",
    }),
    controls: [
      { kind: "text", key: "triggerText", label: "Trigger" },
      { kind: "text", key: "contentText", label: "Content" },
      {
        kind: "select",
        key: "side",
        label: "Side",
        options: [
          { label: "Top", value: "top" },
          { label: "Right", value: "right" },
          { label: "Bottom", value: "bottom" },
          { label: "Left", value: "left" },
        ],
      },
    ],
    emit: (node) => ({
      tag: "HoverCard",
      children: [
        {
          tag: "HoverCardTrigger",
          children: [str(node.props.triggerText, "Hover me")],
        },
        {
          tag: "HoverCardContent",
          props: { side: str(node.props.side, "bottom") },
          children: [str(node.props.contentText, "Preview details")],
        },
      ],
    }),
  },

  popover: {
    imports: uiImport("b-popover", [
      "Popover",
      "PopoverTrigger",
      "PopoverContent",
    ]),
    defaultProps: () => ({
      triggerText: "Open popover",
      contentText: "Popover content",
      side: "bottom",
      defaultOpen: false,
    }),
    controls: [
      { kind: "text", key: "triggerText", label: "Trigger" },
      { kind: "text", key: "contentText", label: "Content" },
      {
        kind: "select",
        key: "side",
        label: "Side",
        options: [
          { label: "Top", value: "top" },
          { label: "Right", value: "right" },
          { label: "Bottom", value: "bottom" },
          { label: "Left", value: "left" },
        ],
      },
      { kind: "boolean", key: "defaultOpen", label: "Open by default" },
    ],
    emit: (node) => ({
      tag: "Popover",
      props: {
        defaultOpen: bool(node.props.defaultOpen) || undefined,
      },
      children: [
        {
          tag: "PopoverTrigger",
          children: [str(node.props.triggerText, "Open popover")],
        },
        {
          tag: "PopoverContent",
          props: { side: str(node.props.side, "bottom") },
          children: [str(node.props.contentText, "Popover content")],
        },
      ],
    }),
  },

  tooltip: {
    imports: uiImport("b-tooltip", ["Tooltip"]),
    defaultProps: () => ({
      content: "Helpful tip",
      side: "top",
      delay: 0.15,
      triggerText: "Hover me",
    }),
    controls: [
      { kind: "text", key: "content", label: "Content" },
      {
        kind: "select",
        key: "side",
        label: "Side",
        options: [
          { label: "Top", value: "top" },
          { label: "Right", value: "right" },
          { label: "Bottom", value: "bottom" },
          { label: "Left", value: "left" },
        ],
      },
      { kind: "text", key: "delay", label: "Delay (s)" },
      { kind: "text", key: "triggerText", label: "Trigger" },
    ],
    emit: (node) => ({
      tag: "Tooltip",
      props: {
        content: str(node.props.content, "Helpful tip"),
        side: omitDefault(str(node.props.side, "top"), "top"),
        delay: num(node.props.delay, 0.15),
      },
      children: [
        {
          tag: "button",
          props: { type: "button" },
          children: [str(node.props.triggerText, "Hover me")],
        },
      ],
    }),
  },

  "radial-button": {
    imports: uiImport("radial-button", ["RadialButton"]),
    defaultProps: () => ({
      text: "Continue",
      loading: false,
      disabled: false,
    }),
    controls: [
      { kind: "text", key: "text", label: "Label" },
      { kind: "boolean", key: "loading", label: "Loading" },
      { kind: "boolean", key: "disabled", label: "Disabled" },
    ],
    emit: (node) => ({
      tag: "RadialButton",
      props: {
        loading: bool(node.props.loading) || undefined,
        disabled: bool(node.props.disabled) || undefined,
      },
      children: [str(node.props.text, "Continue")],
    }),
  },

  "dia-text": {
    imports: uiImport("dia-text", ["DiaText"]),
    defaultProps: () => ({
      text: "Design in motion",
      duration: 1.2,
      triggerOnView: true,
      repeat: false,
    }),
    controls: [
      { kind: "text", key: "text", label: "Text" },
      { kind: "text", key: "duration", label: "Duration (s)" },
      { kind: "boolean", key: "triggerOnView", label: "Trigger on view" },
      { kind: "boolean", key: "repeat", label: "Repeat" },
    ],
    emit: (node) => ({
      tag: "DiaText",
      props: {
        text: str(node.props.text, "Design in motion"),
        duration: num(node.props.duration, 1.2),
        triggerOnView: bool(node.props.triggerOnView) || undefined,
        repeat: bool(node.props.repeat) || undefined,
      },
    }),
  },

  "morph-texts": {
    imports: uiImport("morph-texts", ["MorphText"]),
    defaultProps: () => ({
      words: ["Design", "Build", "Ship"],
      interval: 3000,
      subtext: "",
    }),
    controls: [
      {
        kind: "stringList",
        key: "words",
        label: "Words",
        itemLabel: "Word",
      },
      { kind: "text", key: "interval", label: "Interval (ms)" },
      { kind: "text", key: "subtext", label: "Subtext" },
    ],
    emit: (node) => ({
      tag: "MorphText",
      props: {
        words: expr(serializeValue(strList(node.props.words), 1)),
        interval: num(node.props.interval, 3000),
        subtext: str(node.props.subtext) || undefined,
      },
    }),
  },

  "reveal-text": {
    imports: uiImport("reveal-text", ["RevealText"]),
    defaultProps: () => ({
      text: "Words reveal with blur",
      split: "word",
      stagger: 0.09,
      whileInView: false,
    }),
    controls: [
      { kind: "text", key: "text", label: "Text" },
      {
        kind: "select",
        key: "split",
        label: "Split",
        options: [
          { label: "Word", value: "word" },
          { label: "Character", value: "char" },
        ],
      },
      { kind: "text", key: "stagger", label: "Stagger (s)" },
      { kind: "boolean", key: "whileInView", label: "While in view" },
    ],
    emit: (node) => ({
      tag: "RevealText",
      props: {
        text: str(node.props.text, "Words reveal with blur"),
        split: omitDefault(str(node.props.split, "word"), "word"),
        stagger: num(node.props.stagger, 0.09),
        whileInView: bool(node.props.whileInView) || undefined,
      },
    }),
  },

  "shimmer-text": {
    imports: uiImport("shimmer-text", ["TextShimmer"]),
    defaultProps: () => ({
      text: "Shimmer highlight",
      duration: 2,
      spread: 2,
    }),
    controls: [
      { kind: "text", key: "text", label: "Text" },
      { kind: "text", key: "duration", label: "Duration (s)" },
      { kind: "text", key: "spread", label: "Spread" },
    ],
    emit: (node) => ({
      tag: "TextShimmer",
      props: {
        duration: num(node.props.duration, 2),
        spread: num(node.props.spread, 2),
      },
      children: [str(node.props.text, "Shimmer highlight")],
    }),
  },

  "text-loop": {
    imports: uiImport("text-loop", ["TextLoop"]),
    defaultProps: () => ({
      items: ["Fast", "Fluid", "Beautiful"],
      interval: 1,
    }),
    controls: [
      {
        kind: "stringList",
        key: "items",
        label: "Items",
        itemLabel: "Item",
      },
      { kind: "text", key: "interval", label: "Interval (s)" },
    ],
    emit: (node) => ({
      tag: "TextLoop",
      props: {
        interval: num(node.props.interval, 1),
      },
      children: strList(node.props.items),
    }),
  },
};

function resolveIcon(entry: StudioCatalogEntry): LucideIcon {
  return (
    TYPE_ICON_OVERRIDES[entry.type] ??
    CATEGORY_ICONS[entry.category as StudioPaletteCategory] ??
    FormInputIcon
  );
}

function buildDefFromEntry(entry: StudioCatalogEntry): StudioComponentDef {
  const spec = CATALOG_DEF_SPECS[entry.type];
  if (!spec) {
    throw new Error(`Missing catalog def spec for type "${entry.type}"`);
  }

  return {
    type: entry.type,
    label: entry.label,
    category: PALETTE_TO_STUDIO_CATEGORY(
      entry.category as StudioPaletteCategory
    ),
    description: entry.description,
    icon: spec.icon ?? resolveIcon(entry),
    keywords: [entry.category, entry.slug, ...(spec.keywords ?? [])],
    cli: entry.cli,
    imports: spec.imports,
    defaultProps: spec.defaultProps,
    controls: spec.controls,
    render: (props) => renderCatalogPreview(entry.type, props),
    emit: spec.emit,
    interactivePreview: spec.interactivePreview,
  };
}

export function buildCatalogDefs(): StudioComponentDef[] {
  return STUDIO_CATALOG.filter(
    (entry) => !CORE_REGISTRY_TYPES.has(entry.type)
  ).map(buildDefFromEntry);
}

export const CATALOG_STUDIO_DEFS: StudioComponentDef[] = buildCatalogDefs();
