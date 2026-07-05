import { createElement, type ReactNode } from "react";

import type { DetailField, DetailItem } from "@/components/docs/page-shell";

function field(config: DetailField): DetailField {
  return config;
}

function registryItem(
  registryPath: string,
  dependencies: string[],
  notes: ReactNode[] = []
): DetailItem {
  const dependencySummary =
    dependencies.length > 0 ? dependencies.join(", ") : "none";

  return {
    id: "registry",
    title: "Registry bundle",
    summary:
      "Install the exact registry entry shown on the right when you want the component file and its declared runtime dependencies together.",
    notes: [`Dependencies: ${dependencySummary}.`, ...notes],
    registryPath,
  };
}

const alertApiDetails: DetailItem[] = [
  {
    id: "alert",
    title: "Alert",
    summary:
      "Root container for a single notice. Uses a compact grid layout with optional leading icon, compound title and description slots, legacy prop support, and inline or toast behavior.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        description:
          "Preferred compound API. Pass an optional leading icon followed by AlertTitle and AlertDescription.",
      }),
      field({
        name: "icon",
        type: "ReactNode",
        description:
          "Legacy leading visual prop. Compound children can also provide the leading icon as the first child.",
      }),
      field({
        name: "title",
        type: "ReactNode",
        description:
          "Legacy title prop rendered with the same AlertTitle styling. Prefer AlertTitle for new code.",
      }),
      field({
        name: "message",
        type: "ReactNode",
        description:
          "Legacy description prop rendered with the same AlertDescription styling. Prefer AlertDescription for new code.",
      }),
      field({
        name: "action",
        type: "ReactNode",
        description:
          "Optional action row rendered beneath the message, useful for a single follow-up button or link such as Undo or View details.",
      }),
      field({
        name: "appearance",
        type: '"default" | "success" | "info" | "destructive" | "warning"',
        defaultValue: '"default"',
        description:
          "Visual tone for the alert surface. Success and info use semantic green and blue surfaces; destructive shifts toward error colors; warning uses a warm amber surface with muted description text.",
      }),
      field({
        name: "size",
        type: '"sm" | "md" | "lg" | "xl"',
        defaultValue: '"md"',
        description:
          "Preset max width for inline and toast alerts. sm is 320px, md is 400px, lg is 480px, and xl is 560px.",
      }),
      field({
        name: "width",
        type: "string | number",
        description:
          "Custom max width. Pass a CSS length such as 28rem or a pixel number. Overrides size when set.",
      }),
      field({
        name: "dismissible",
        type: "boolean",
        defaultValue: "legacy: true; compound inline: false",
        description:
          "Controls whether the close button is rendered. Compound inline alerts are static by default; toast and legacy prop alerts remain dismissible unless you opt out.",
      }),
      field({
        name: "variant",
        type: '"inline" | "toast"',
        defaultValue: '"inline"',
        description:
          "Explicitly chooses layout behavior. Toasts portal to document.body and use fixed viewport positioning, while inline alerts stay in normal document flow.",
      }),
      field({
        name: "position",
        type: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"',
        description:
          "Optional toast placement. Providing a position also upgrades the component to toast behavior, and omitted toast positions default to top-right.",
      }),
      field({
        name: "timeout",
        type: "number",
        defaultValue: "legacy/toast: 5000; compound inline: 0",
        description:
          "Auto-dismiss delay in milliseconds. Passing 0 disables the timer; compound inline alerts default to no timer so static notices stay visible.",
      }),
      field({
        name: "open",
        type: "boolean",
        description:
          "Controlled visibility. Pair with onOpenChange when parent state should own whether the alert is shown.",
      }),
      field({
        name: "defaultOpen",
        type: "boolean",
        defaultValue: "true",
        description:
          "Initial visibility for uncontrolled usage. Ignored when open is provided.",
      }),
      field({
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description:
          "Called when visibility changes from dismissal, timeout, Escape, or the close button.",
      }),
      field({
        name: "titleLines",
        type: '1 | 2 | 3 | "none"',
        defaultValue: "1",
        description:
          "Maximum title lines before truncation. Pass none to allow the title to wrap freely.",
      }),
      field({
        name: "onDismiss",
        type: "() => void",
        description:
          "Called after the component finishes its exit transition, regardless of whether dismissal came from the close button or the timeout effect.",
      }),
    ],
    notes: [
      "Use size for preset widths or pass width for a custom max width. md defaults to 400px.",
      "Every positioned alert snaps to a full-width top placement on small screens, then switches to the requested corner at the sm breakpoint.",
      'Inline alerts use role="alert"; toast alerts use role="status" with aria-live="polite" and keep title and message linked with aria-labelledby and aria-describedby.',
      "The alert keeps its own visible state internally when dismissal is enabled, so toast usage is designed for fire-and-forget notifications unless you pass open and onOpenChange.",
      "Hovering or focusing the alert pauses auto-dismiss, which gives people more time to read and makes the close target less stressful to hit.",
      "Dismissible alerts also close on Escape. Toast alerts stack vertically per corner with a soft shadow for contrast over page content.",
      "Motion falls back to opacity-only transitions when prefers-reduced-motion is enabled.",
    ],
  },
  {
    id: "alert-title",
    title: "AlertTitle",
    summary:
      "Primary line for the compound alert API. Renders in the second grid column beside the optional icon.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Short title or inline formatted heading content.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged with the title typography classes for one-off styling.",
      }),
    ],
  },
  {
    id: "alert-description",
    title: "AlertDescription",
    summary:
      "Secondary line for the compound alert API. Renders beneath the title in the second grid column and links to the root with aria-describedby.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Supporting message content. Keep it concise for compact inline notices and toast updates.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged with the description typography classes for one-off styling.",
      }),
    ],
  },
  {
    id: "alert-action",
    title: "AlertAction",
    summary:
      "Optional action row for the compound alert API. Renders beneath the description in the content column.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Follow-up controls such as a single button or text link. Keep actions concise.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the action row layout classes.",
      }),
    ],
  },
  {
    id: "alert-lifecycle",
    title: "Motion and lifecycle",
    summary:
      "Alert uses AnimatePresence for mount and exit, with separate variants for the container, icon, and text stack.",
    notes: [
      "Entry uses long fluid easing on opacity, vertical drift, scale, and blur so the alert settles in rather than snapping.",
      "Exit keeps the same direction with a softer, slightly slower fade so dismissal still feels continuous.",
      "Child text and the icon only fade on exit, which keeps the container motion cohesive.",
      "prefers-reduced-motion swaps blur, scale, and drift for short opacity fades on the container, text, and icon.",
      "The timeout effect is cleared on cleanup, so unmounting or rerendering the alert does not leak timers.",
      "When position is set, the component waits until after mount before calling createPortal to avoid touching document during server render.",
      "Dismissal callbacks wait until the exit transition completes, so parent cleanup does not cut off the visual exit early.",
    ],
  },
  registryItem("alert.json", ["motion", "class-variance-authority"]),
];

const alertDialogApiDetails: DetailItem[] = [
  {
    id: "alert-dialog",
    title: "AlertDialog",
    summary:
      "Provider-switchable confirmation dialog with the same compound API on Base UI and Radix UI, including controlled state, custom triggers, and reduced-motion aware card transitions.",
    fields: [
      field({
        name: "open",
        type: "boolean",
        description:
          "Controlled open state for the root. Pair with onOpenChange when async actions or parent state should own dismissal.",
      }),
      field({
        name: "defaultOpen",
        type: "boolean",
        defaultValue: "false",
        description:
          "Initial uncontrolled open state. Ignored when open is provided.",
      }),
      field({
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description:
          "Called when the alert dialog opens or closes through the trigger, cancel action, confirm action, Escape, or controlled state updates.",
      }),
    ],
    notes: [
      "The Base UI entry keeps the popup mounted until the Motion exit finishes, then unmounts through the primitive action ref.",
      "The Radix entry places the primitive Content semantics and forwarded ref on the animated card surface while the viewport wrapper only handles centering.",
      "Motion falls back to short opacity transitions when prefers-reduced-motion is enabled.",
    ],
  },
  {
    id: "alert-dialog-parts",
    title: "Parts and composition",
    summary:
      "Both registry entries export the same parts so the installed code can swap headless libraries without changing app-level composition.",
    fields: [
      field({
        name: "AlertDialogTrigger",
        type: "ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }",
        description:
          "Opens the dialog. Use asChild to wrap an existing button, link-styled button, or inline control while preserving trigger behavior.",
      }),
      field({
        name: "AlertDialogContent",
        type: "Primitive content props & { open?: boolean }",
        description:
          "Animated card surface. Pass open in controlled usage to keep exit animations synchronized with the root state.",
      }),
      field({
        name: "AlertDialogMedia",
        type: "HTMLAttributes<HTMLDivElement>",
        description:
          "Optional leading icon or media container for warning, publish, or verification visuals.",
      }),
      field({
        name: "AlertDialogHeader / AlertDialogFooter",
        type: "HTMLAttributes<HTMLDivElement>",
        description:
          "Layout slots for title/description copy and the cancel/action row. Mobile order keeps Cancel before the confirming action.",
      }),
      field({
        name: "AlertDialogTitle / AlertDialogDescription",
        type: "Primitive title and description props",
        description:
          "Accessible heading and supporting copy linked by the underlying alert-dialog primitive.",
      }),
    ],
  },
  {
    id: "alert-dialog-actions",
    title: "Actions and async flows",
    summary:
      "Cancel and action buttons include the default styling needed for common confirmation flows, with escape hatches for neutral confirms and async work.",
    fields: [
      field({
        name: "AlertDialogAction.variant",
        type: '"destructive" | "default"',
        defaultValue: '"destructive"',
        description:
          "Controls whether the confirming action uses the destructive color treatment or the neutral primary action treatment.",
      }),
      field({
        name: "AlertDialogAction.closeOnClick",
        type: "boolean",
        defaultValue: "true",
        description:
          "Set to false for async requests, keep the root controlled, and close the dialog after the request succeeds.",
      }),
      field({
        name: "AlertDialogCancel.closeOnClick",
        type: "boolean",
        defaultValue: "true",
        description:
          "Set to false only when a cancel button needs to run custom validation before closing.",
      }),
      field({
        name: "AlertDialogAction / AlertDialogCancel asChild",
        type: "boolean",
        description:
          "Base UI and Radix UI installs both support slotted action controls for custom button components.",
      }),
    ],
    notes: [
      "Disable the action while a request is pending to avoid duplicate destructive operations.",
      'Use variant="default" for confirmations such as Publish, Continue, Leave page, or Discard draft when a red destructive button would overstate the risk.',
    ],
  },
  {
    id: "alert-dialog-exports",
    title: "Style exports",
    summary:
      "The component exports class-name recipes for custom triggers and advanced local composition without requiring users to copy private constants.",
    fields: [
      field({
        name: "alertDialogTriggerClassName",
        type: "string",
        description:
          "Default trigger recipe for full-size confirmation buttons.",
      }),
      field({
        name: "alertDialogTriggerSmClassName",
        type: "string",
        description:
          "Compact trigger recipe for inline sentence controls and toolbar-sized buttons.",
      }),
      field({
        name: "alertDialogActionClassName / alertDialogDefaultActionClassName / alertDialogCancelClassName",
        type: "string",
        description: "Action recipes exported for custom footer compositions.",
      }),
      field({
        name: "alertDialogThemeClassName",
        type: "string",
        description:
          "Theme variable wrapper used by triggers and content, useful when composing custom alert-dialog surfaces.",
      }),
      field({
        name: "AlertDialogPortal",
        type: "Primitive Portal",
        description:
          "Portal primitive export for advanced consumers that need direct portal composition.",
      }),
    ],
  },
  registryItem("b-alert-dialog.json", [
    "@base-ui/react",
    "@radix-ui/react-slot",
    "motion",
  ]),
  registryItem("r-alert-dialog.json", [
    "@radix-ui/react-alert-dialog",
    "motion",
  ]),
];

const avatarApiDetails: DetailItem[] = [
  {
    id: "avatar",
    title: "Avatar",
    summary:
      "Base UI avatar root with shared sizing and an optional tooltip for hover or focus status hints.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        description:
          "Compose AvatarImage, AvatarFallback, and an optional AvatarBadge inside the root.",
      }),
      field({
        name: "size",
        type: '"default" | "sm" | "lg"',
        defaultValue: '"default"',
        description:
          "Controls the root size and drives badge/fallback sizing through data-size selectors.",
      }),
      field({
        name: "tooltip",
        type: "string",
        description:
          "Optional short label shown in the Iconiq tooltip surface when the entire avatar is hovered or focused.",
      }),
      field({
        name: "tooltipSide",
        type: '"top" | "bottom" | "left" | "right"',
        defaultValue: '"right"',
        description:
          "Preferred side for the avatar tooltip bubble. The default collision order is right, left, top, then bottom.",
      }),
      field({
        name: "tooltipDelay",
        type: "number",
        defaultValue: "0.15",
        description: "Delay in seconds before the avatar tooltip opens.",
      }),
      field({
        name: "tooltipClassName",
        type: "string",
        description:
          "Merged onto the tooltip bubble when the avatar tooltip is enabled.",
      }),
      field({
        name: "name",
        type: "string",
        description:
          "Optional display name used by AvatarFallback to auto-generate initials when children are omitted.",
      }),
      field({
        name: "asChild",
        type: "boolean",
        defaultValue: "false",
        description:
          "Merge avatar props onto the child element via Radix Slot, useful for link or button triggers.",
      }),
      field({
        name: "aria-label",
        type: "string",
        description:
          "Accessible name for the avatar. Defaults to the tooltip string when tooltip is set.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the Base UI avatar root. Use it for local radius, ring, or size overrides.",
      }),
    ],
    notes: [
      'The root renders data-slot="avatar" and data-size so grouped stacks and badges can respond to the selected size.',
      "The root keeps a circular border overlay with dark/light blend handling and accepts the full Base UI Root props surface.",
      "Put tooltip on Avatar when the whole avatar should expose the status hint. Put tooltip on AvatarBadge when only the badge should be interactive.",
    ],
  },
  {
    id: "avatar-image",
    title: "AvatarImage",
    summary:
      "Image slot for the compound avatar, backed by Base UI's image loading behavior.",
    fields: [
      field({
        name: "src",
        type: "string",
        required: true,
        description:
          "Image URL passed to the underlying Base UI image primitive.",
      }),
      field({
        name: "alt",
        type: "string",
        required: true,
        description:
          "Accessible text for the image. Pass an empty string only when the avatar is decorative.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the full-size rounded image classes.",
      }),
    ],
  },
  {
    id: "avatar-fallback",
    title: "AvatarFallback",
    summary:
      "Fallback slot shown by Base UI while the image is loading, missing, or failed.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Initials, icon, or other compact fallback content centered inside the avatar.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the muted circular fallback classes.",
      }),
    ],
  },
  {
    id: "avatar-badge",
    title: "AvatarBadge",
    summary:
      "Absolute status badge that scales with the root Avatar size. Use variant for preset presence colors or tooltip for badge-only status hints.",
    fields: [
      field({
        name: "variant",
        type: '"online" | "offline" | "busy" | "away"',
        defaultValue: '"online"',
        description:
          "Preset status color mapped to theme-friendly green, muted, destructive, and amber tokens.",
      }),
      field({
        name: "aria-label",
        type: "string",
        description:
          "Accessible status label. Defaults to the tooltip string or the variant label such as Online or Busy.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        description:
          "Optional icon or status mark. Icons scale down on small avatars instead of disappearing.",
      }),
      field({
        name: "tooltip",
        type: "string",
        description:
          "Optional short label shown in the Iconiq tooltip surface when only the badge should be the trigger.",
      }),
      field({
        name: "tooltipSide",
        type: '"top" | "bottom" | "left" | "right"',
        defaultValue: '"right"',
        description:
          "Preferred side for the tooltip bubble. The default collision order is right, left, top, then bottom.",
      }),
      field({
        name: "tooltipDelay",
        type: "number",
        defaultValue: "0.15",
        description: "Delay in seconds before the tooltip opens.",
      }),
      field({
        name: "tooltipClassName",
        type: "string",
        description:
          "Merged onto the tooltip bubble when the badge tooltip is enabled.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged with the green status badge background, foreground, and ring classes.",
      }),
    ],
  },
  {
    id: "avatar-group",
    title: "AvatarGroup",
    summary:
      "Stack wrapper for overlapping avatars and matching overflow count chips.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Avatar and AvatarGroupCount children rendered in an overlapping row.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged with the negative-space group classes and child avatar rings.",
      }),
    ],
  },
  {
    id: "avatar-group-count",
    title: "AvatarGroupCount",
    summary:
      "Overflow count part that follows the largest avatar size used in the group.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Count label or icon shown after the visible avatars.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the muted circular count chip classes.",
      }),
    ],
  },
  registryItem("avatar.json", [
    "@base-ui/react",
    "@radix-ui/react-slot",
    "motion",
  ]),
];

const badgeApiDetails: DetailItem[] = [
  {
    id: "badge",
    title: "Badge",
    summary:
      "Compact label pill with tinted fills, a shimmer-enabled default variant, a quieter dot variant, semantic color aliases, and optional icon or dismiss controls.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Badge content rendered above the optional shimmer layer so labels stay readable while the default variant animates.",
      }),
      field({
        name: "className",
        type: "string",
        defaultValue: '""',
        description:
          "Appended directly to the root badge element. Useful for radius, spacing, or local border overrides.",
      }),
      field({
        name: "variant",
        type: '"default" | "dot"',
        defaultValue: '"default"',
        description:
          "Chooses between the animated filled badge and the quieter outlined badge with a leading status dot.",
      }),
      field({
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description:
          "Controls height, horizontal padding, gap, and label size for denser or roomier badge treatments.",
      }),
      field({
        name: "color",
        type: "BadgeColorProp",
        defaultValue: '"gray"',
        description:
          "Picks a preset palette token or semantic alias (`success`, `warning`, `error`, `info`). Each token sets matched background and foreground tones for light and dark mode.",
      }),
      field({
        name: "icon",
        type: "ReactNode",
        description:
          'Optional leading icon rendered before the label on the default variant only. Ignored when `variant="dot"` or when `onDismiss` is provided.',
      }),
      field({
        name: "onDismiss",
        type: "() => void",
        description:
          'When provided on the default variant, renders a dismiss button after the label for removable filter chips. Ignored when `variant="dot"` or when `icon` is provided.',
      }),
      field({
        name: "dismissLabel",
        type: "string",
        defaultValue: '"Remove"',
        description:
          "Accessible label for the dismiss button when `onDismiss` is enabled.",
      }),
      field({
        name: "animate",
        type: "boolean",
        defaultValue: "true",
        description:
          "Controls the default variant mount fade/scale entrance and the dot variant status pulse. Use with `shimmer={false}` on the default variant when you want a one-time entrance without the looping sweep. Automatically disabled when `prefers-reduced-motion` is set.",
      }),
      field({
        name: "shimmer",
        type: "boolean",
        defaultValue: "true",
        description:
          "Controls the default variant shimmer sweep independently of the mount entrance. Automatically disabled when `prefers-reduced-motion` is set.",
      }),
      field({
        name: "asChild",
        type: "boolean",
        defaultValue: "false",
        description:
          "Merges badge styles onto the child element, such as an anchor, via Radix Slot.",
      }),
      field({
        name: "waveColor",
        type: "string",
        description:
          "Optional shimmer midpoint override for the default variant. When omitted, the sweep derives a subtle tone from the current text color.",
      }),
    ],
    notes: [
      'The root renders `data-slot="badge"` and spreads remaining span props, so ids, data attributes, and click handlers can be attached directly.',
      'Interactive badges with `onClick` receive `role="button"`, `tabIndex={0}`, and Enter/Space keyboard activation. The dismiss button is a separate focusable control.',
      "When `asChild` is true, badge styles merge onto the single child element without shimmer, dot, icon, or dismiss layers.",
      "`icon` and `onDismiss` are mutually exclusive on the default variant.",
      "Use Badge for inline labels and chips. Use Status Dot for deployment-style ripple states. Use AvatarBadge for avatar presence dots.",
      "Install path is `components/ui/badge.tsx` with named and default `Badge` exports. Requires `@/lib/utils` (`cn`).",
    ],
  },
  {
    id: "badge-variants",
    title: "badgeVariants",
    summary:
      "CVA recipe exported alongside Badge for reusing badge layout, color tokens, and interactive focus styles on custom elements.",
    fields: [
      field({
        name: "variant",
        type: '"default" | "dot"',
        defaultValue: '"default"',
        description: "Chooses between the filled badge and dot badge recipes.",
      }),
      field({
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Controls height, padding, gap, and label size.",
      }),
      field({
        name: "color",
        type: "BadgeColor",
        description:
          "Resolved palette token passed to `getBadgeColorVariables()` when reusing badge color tokens outside the component.",
      }),
      field({
        name: "interactive",
        type: "boolean",
        defaultValue: "false",
        description:
          "Adds pointer cursor and focus ring styles for clickable badge roots.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Optional classes merged after the generated recipe classes.",
      }),
    ],
  },
  {
    id: "badge-colors",
    title: "badgeColors",
    summary:
      "Preset color hex map used by Badge tone generation for palette-consistent fills and dot treatments.",
    fields: [
      field({
        name: "keys",
        type: "BadgeColor",
        description:
          "Named palette tokens such as gray, blue, green, amber, red, and purple.",
      }),
    ],
    notes: [
      "Use the exported `BadgeColor`, `BadgeSemanticColor`, and `BadgeColorProp` types for compile-time checks.",
      "`badgeSemanticColors` maps `success`, `warning`, `error`, and `info` to palette tokens. Prefer the semantic names in UI pickers instead of their duplicate palette entries (`green`, `amber`, `red`, `blue`).",
      "`getBadgePlaygroundColorOptions()` filters palette colors that already have a semantic alias.",
      "`resolveBadgeColor()` normalizes semantic aliases before styling.",
      "`getBadgeColorVariables()` sets `--badge-bg`, `--badge-fg`, `--badge-dot`, and `--badge-border` inline so palette tones apply reliably in light and dark mode.",
    ],
  },
  {
    id: "badge-visuals",
    title: "Visual behavior",
    summary:
      "The default variant keeps the spring-in shimmer treatment, while the dot variant adds a subtle status pulse. Motion respects reduced-motion preferences.",
    notes: [
      "The default badge fades and scales from 0.95 to 1 on mount over 0.3 seconds when `animate` is true.",
      "Its shimmer travels from left to right over 2 seconds, waits 1.5 seconds, then repeats indefinitely when `shimmer` is true.",
      "The dot variant omits the shimmer layer, sizes its leading status dot to match the chosen badge size, and gives it a gentle repeating blink.",
      "All entrance, shimmer, and dot pulse animations are skipped when `prefers-reduced-motion` is enabled.",
    ],
  },
  registryItem(
    "badge.json",
    ["motion", "class-variance-authority", "@radix-ui/react-slot"],
    [
      "Requires the local `cn` helper from `@/lib/utils`, which is included in a standard shadcn setup.",
    ]
  ),
];

const calendarApiDetails: DetailItem[] = [
  {
    id: "calendar",
    title: "Calendar",
    summary:
      "Animated monthly calendar with single-day or range selection, bounds, modifiers, locale-aware labels, and direct month/year picking.",
    fields: [
      field({
        name: "mode",
        type: '"single" | "range"',
        defaultValue: '"single"',
        description:
          "Selection model. Use single for one date or range for start/end selection.",
      }),
      field({
        name: "selected",
        type: "Date | null",
        description:
          "Controlled selected day for single mode. Pass null to clear the highlight.",
      }),
      field({
        name: "defaultSelected",
        type: "Date | null",
        description:
          "Initial selected day for uncontrolled single mode when selected is not provided.",
      }),
      field({
        name: "onSelect",
        type: "(date: Date | null) => void",
        description:
          "Called when the user picks a day in single mode, including visible outside-month days.",
      }),
      field({
        name: "range",
        type: "CalendarRange",
        description:
          "Controlled range for range mode. Shape is `{ from?: Date; to?: Date }`.",
      }),
      field({
        name: "defaultRange",
        type: "CalendarRange",
        description: "Initial range for uncontrolled range mode.",
      }),
      field({
        name: "onRangeSelect",
        type: "(range: CalendarRange) => void",
        description: "Called when the user updates the range in range mode.",
      }),
      field({
        name: "month",
        type: "Date",
        description:
          "Controlled visible month. Prev/next, outside-day, and month/year picker navigation requests flow through onMonthChange.",
      }),
      field({
        name: "defaultMonth",
        type: "Date",
        description:
          "Initial visible month for uncontrolled usage when month is not provided.",
      }),
      field({
        name: "onMonthChange",
        type: "(month: Date) => void",
        description:
          "Called whenever the user navigates with prev/next, an outside day, or the month/year picker.",
      }),
      field({
        name: "disabled",
        type: "(date: Date) => boolean",
        description:
          "Marks dates as non-interactive in addition to minDate/maxDate bounds.",
      }),
      field({
        name: "minDate",
        type: "Date",
        description:
          "Earliest selectable day. Also disables month navigation into fully out-of-range months.",
      }),
      field({
        name: "maxDate",
        type: "Date",
        description:
          "Latest selectable day. Also disables month navigation into fully out-of-range months.",
      }),
      field({
        name: "locale",
        type: "Locale",
        description:
          "Optional date-fns locale used for month labels, weekday headers, and spoken date labels.",
      }),
      field({
        name: "labels",
        type: "Partial<CalendarLabels>",
        description:
          "Override built-in English UI and accessibility strings such as Today, Clear, and picker labels.",
      }),
      field({
        name: "size",
        type: '"sm" | "md" | "lg"',
        description:
          "Controls the overall calendar scale, including the card width, spacing, nav controls, weekday row, and day cell sizing. Defaults to sm.",
      }),
      field({
        name: "weekStartsOn",
        type: "0 | 1 | 2 | 3 | 4 | 5 | 6",
        description:
          "Overrides the first day of the week for both the weekday header and rendered month grid.",
      }),
      field({
        name: "minYear",
        type: "number",
        description:
          "Optional lower bound for selectable years in the year picker.",
      }),
      field({
        name: "maxYear",
        type: "number",
        description:
          "Optional upper bound for selectable years in the year picker.",
      }),
      field({
        name: "showOutsideDays",
        type: "boolean",
        defaultValue: "true",
        description:
          "Whether leading and trailing days from adjacent months are rendered in the grid.",
      }),
      field({
        name: "fixedWeeks",
        type: "boolean",
        defaultValue: "false",
        description:
          "Pads the month grid to six weeks for consistent height. Only applies when showOutsideDays is true.",
      }),
      field({
        name: "modifiers",
        type: "Record<string, (date: Date) => boolean>",
        description:
          "Named matchers that render marker dots under matching days.",
      }),
      field({
        name: "modifierLabels",
        type: "Record<string, string>",
        description:
          "Human-readable names for modifier keys, appended to spoken day labels.",
      }),
      field({
        name: "id",
        type: "string",
        description:
          "Optional root id used for heading and live-region relationships.",
      }),
      field({
        name: "name",
        type: "string",
        description:
          "Optional native form field name. Renders a hidden input in single mode.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Optional class names applied to the root surface.",
      }),
    ],
    notes: [
      "Controlled mode: pass selected/month or range/month and respond to the matching change handlers.",
      "Uncontrolled mode: omit the controlled value props and optionally seed with defaultSelected, defaultRange, or defaultMonth.",
      "Pair with the date-picker registry entry when you need a collapsible trigger instead of an always-visible grid.",
      "Pass stable disabled and modifiers callbacks in production to avoid unnecessary focus resets.",
    ],
  },
  {
    id: "calendar-grid",
    title: "Date math and layout behavior",
    summary:
      "The grid is rebuilt with date-fns whenever the visible month changes.",
    notes: [
      "The rendered range runs from startOfWeek(startOfMonth(currentMonth)) through endOfWeek(endOfMonth(currentMonth)). fixedWeeks pads the grid to six rows only when showOutsideDays is enabled.",
      "Days outside the active month remain visible by default and can still be selected. Choosing one switches the visible month and selects that day, unless the date is unavailable.",
      "Weekday headers and the grid start day follow the provided locale and weekStartsOn settings.",
      "Selected days are highlighted even when they appear as outside-month cells in the current grid.",
    ],
  },
  {
    id: "calendar-motion-a11y",
    title: "Motion and accessibility",
    summary:
      "Motion, keyboard support, and screen-reader semantics are built into the grid and picker overlays.",
    notes: [
      "The root uses role=application with a role=grid date table, aria-selected day buttons, and a polite live selection summary.",
      "Keyboard users can move through days with arrow keys, Home/End, PageUp/PageDown, and select with Enter or Space.",
      "Month and year overlays trap focus, support arrow-key grid navigation, and return focus to the trigger on Escape.",
      "Theme colors come from CSS variables, so the surface follows light/dark mode without client-side palette hydration.",
      "Animations respect prefers-reduced-motion through useReducedMotion().",
    ],
  },
  registryItem("calendar.json", ["motion", "lucide-react", "date-fns"]),
];

const datePickerApiDetails: DetailItem[] = [
  {
    id: "date-picker",
    title: "DatePicker",
    summary:
      "Collapsible date field with a read-only Base UI input trigger and a portaled Iconiq Calendar panel.",
    fields: [
      field({
        name: "value",
        type: "Date | null",
        description:
          "Controlled selected date. When provided, the trigger and embedded Calendar both reflect this value.",
      }),
      field({
        name: "defaultValue",
        type: "Date | null",
        defaultValue: "null",
        description:
          "Initial selected date for uncontrolled usage when `value` is omitted.",
      }),
      field({
        name: "placeholder",
        type: "string",
        defaultValue: "Select a date",
        description: "Copy shown in the trigger when no date is selected.",
      }),
      field({
        name: "onChange",
        type: "(date: Date | null) => void",
        description:
          "Called when the user picks or clears a date from the embedded Calendar or clear control.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Optional class names applied to the outer wrapper.",
      }),
      field({
        name: "defaultOpen",
        type: "boolean",
        defaultValue: "false",
        description:
          "Whether the Calendar panel starts expanded on first render.",
      }),
      field({
        name: "open",
        type: "boolean",
        description:
          "Controlled open state for the Calendar panel. Pair with `onOpenChange`.",
      }),
      field({
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description:
          "Called when the panel opens or closes from the trigger, selection, Escape, or outside click.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description:
          "Disables the trigger and prevents the panel from opening.",
      }),
      field({
        name: "clearable",
        type: "boolean",
        defaultValue: "false",
        description:
          "Shows a clear button when a date is selected so users can reset to `null`.",
      }),
      field({
        name: "closeOnSelect",
        type: "boolean",
        defaultValue: "true",
        description: "Whether picking a date closes the panel automatically.",
      }),
      field({
        name: "dateFormat",
        type: "string",
        defaultValue: "EEE, MMM d, yyyy",
        description:
          "date-fns format string for the trigger label. Uses `calendarProps.locale` when provided.",
      }),
      field({
        name: "name",
        type: "string",
        description:
          "Optional form field name. Renders a hidden input with the selected ISO date.",
      }),
      field({
        name: "id",
        type: "string",
        description: "Optional id applied to the trigger button.",
      }),
      field({
        name: "aria-invalid",
        type: "boolean",
        description:
          "Marks the trigger as invalid for assistive tech and applies error styling.",
      }),
      field({
        name: "side",
        type: '"top" | "bottom"',
        defaultValue: "bottom",
        description:
          "Preferred panel side relative to the trigger. Flips when there is not enough space.",
      }),
      field({
        name: "align",
        type: '"start" | "end"',
        defaultValue: "start",
        description:
          "Horizontal alignment of the portaled panel to the trigger.",
      }),
      field({
        name: "calendarProps",
        type: "Omit<CalendarProps, 'selected' | 'defaultSelected' | 'onSelect' | 'month' | 'onMonthChange' | 'mode' | 'range' | 'defaultRange' | 'onRangeSelect'>",
        description:
          "Props forwarded to the embedded Calendar, such as size, locale, disabled, bounds, modifiers, weekStartsOn, minYear, and maxYear. Range mode is not supported on DatePicker.",
      }),
    ],
    notes: [
      "Also exported as `AnimatedDatePicker` for backwards compatibility.",
      "The trigger formats the selected date with `dateFormat` and toggles the portaled panel open and closed.",
      "Choosing a date closes the panel by default while keeping the visible month aligned with the selected value.",
      "Click outside or press Escape to close the panel. Focus returns to the trigger and the embedded Calendar stays mounted after the first open to avoid repeat entrance motion.",
      "Install the `calendar` registry entry alongside `date-picker` so `@/components/ui/calendar` resolves in consumer apps.",
    ],
  },
  registryItem(
    "date-picker.json",
    ["@base-ui/react/input", "motion", "lucide-react", "date-fns"],
    ["Registry dependency: calendar."]
  ),
];

const chartsApiDetails: DetailItem[] = [
  {
    id: "chart-container",
    title: "ChartContainer",
    summary:
      "Theme-aware Recharts shell that maps ChartConfig tokens to CSS variables, applies registry chart colors, and fades the surface in on mount.",
    fields: [
      field({
        name: "config",
        type: "ChartConfig",
        required: true,
        description:
          "Series labels, optional icons, and colors. Use var(--chart-1) style tokens or per-key theme overrides; scoped --color-{key} variables are generated for this chart instance.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Recharts chart markup, usually a BarChart, LineChart, AreaChart, PieChart, RadarChart, or RadialBarChart rendered inside ResponsiveContainer.",
      }),
      field({
        name: "id",
        type: "string",
        description:
          "Optional stable id for the generated data-chart attribute and scoped CSS variables.",
      }),
      field({
        name: "seriesCount",
        type: "number",
        description:
          "Overrides inferred series count for animation timing when ChartConfig keys do not match plotted series.",
      }),
      field({
        name: "initialDimension",
        type: "{ width: number; height: number }",
        description:
          "Optional fallback size for ResponsiveContainer before the first measure. By default the chart fills its parent with a debounced resize handler.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the chart shell alongside the chart component's local theme tokens.",
      }),
    ],
    notes: [
      "ChartContainer ships its own local --chart-1 through --chart-5 defaults, so chart installs do not need a shared theme helper.",
      "Pair ChartContainer with Recharts primitives and ChartTooltip / ChartLegend helpers rather than Radix UI or Base UI wrappers.",
      "Set accessibilityLayer on Recharts cartesian charts to improve keyboard and screen-reader support.",
    ],
  },
  {
    id: "chart-bar",
    title: "ChartBar",
    summary:
      "Thin Recharts Bar wrapper with restrained ease-out growth timing tuned for the Iconiq motion profile.",
    fields: [
      field({
        name: "seriesIndex",
        type: "number",
        defaultValue: "0",
        description:
          "Offsets bar growth start time for multi-series charts so each series eases in with a short stagger.",
      }),
      field({
        name: "...props",
        type: "Recharts Bar props",
        description:
          "Forwards the full Bar API. animationDuration (~480ms), ease-out easing, and isAnimationActive inherit calm defaults unless you override them.",
      }),
    ],
    notes: [
      'Use fill="var(--color-desktop)" (or your config key) so bars pick up ChartConfig colors.',
      "Series growth runs once on first paint; resize uses a debounced container and skips repeat animations so narrowing the viewport stays stable.",
    ],
  },
  {
    id: "chart-line",
    title: "ChartLine",
    summary:
      "Recharts Line wrapper that shares the same ease-out timing and stagger defaults as ChartBar.",
    fields: [
      field({
        name: "seriesIndex",
        type: "number",
        defaultValue: "0",
        description:
          "Offsets line draw start time for multi-series charts so each stroke eases in with a short stagger.",
      }),
      field({
        name: "...props",
        type: "Recharts Line props",
        description:
          "Forwards the full Line API. animationDuration, easing, and isAnimationActive inherit calm defaults unless you override them.",
      }),
    ],
  },
  {
    id: "chart-area",
    title: "ChartArea",
    summary:
      "Recharts Area wrapper that shares the same ease-out timing and stagger defaults as ChartBar.",
    fields: [
      field({
        name: "seriesIndex",
        type: "number",
        defaultValue: "0",
        description:
          "Offsets area reveal start time for multi-series charts so each fill eases in with a short stagger.",
      }),
      field({
        name: "...props",
        type: "Recharts Area props",
        description:
          "Forwards the full Area API. animationDuration, easing, and isAnimationActive inherit calm defaults unless you override them.",
      }),
    ],
  },
  {
    id: "chart-tooltip",
    title: "ChartTooltip",
    summary:
      "Recharts tooltip primitive that defaults to ChartTooltipContent when content is omitted.",
    fields: [
      field({
        name: "content",
        type: "ReactNode | ComponentType",
        description:
          "Tooltip renderer. Defaults to ChartTooltipContent when omitted.",
      }),
      field({
        name: "cursor",
        type: "boolean | object",
        description: "Recharts cursor configuration for hover feedback.",
      }),
    ],
  },
  {
    id: "chart-tooltip-content",
    title: "ChartTooltipContent",
    summary:
      "Styled tooltip content shell with a calm fade entrance and dashed, dot, or line indicators.",
    fields: [
      field({
        name: "indicator",
        type: '"dot" | "line" | "dashed"',
        defaultValue: '"dot"',
        description: "Marker style rendered beside each tooltip row.",
      }),
      field({
        name: "hideLabel",
        type: "boolean",
        defaultValue: "false",
        description:
          "Suppresses the formatted label block above the value rows.",
      }),
      field({
        name: "hideIndicator",
        type: "boolean",
        defaultValue: "false",
        description: "Hides the color marker when you only want text values.",
      }),
      field({
        name: "nameKey",
        type: "string",
        description:
          "Payload key used to resolve ChartConfig labels and colors for each tooltip row.",
      }),
      field({
        name: "labelKey",
        type: "string",
        description:
          "Payload key used to resolve the tooltip label row from ChartConfig.",
      }),
      field({
        name: "label",
        type: "string",
        description:
          "Optional label key override when you want the tooltip header to read from ChartConfig directly.",
      }),
      field({
        name: "labelClassName",
        type: "string",
        description: "Classes merged onto the tooltip label row.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Classes merged onto the tooltip shell.",
      }),
      field({
        name: "color",
        type: "string",
        description:
          "Optional shared indicator color override for every tooltip row.",
      }),
      field({
        name: "labelFormatter",
        type: "(value, payload) => ReactNode",
        description: "Custom formatter for the tooltip label row.",
      }),
      field({
        name: "formatter",
        type: "Recharts formatter",
        description:
          "Optional per-row formatter; when omitted, the default label and value layout is used.",
      }),
    ],
  },
  {
    id: "chart-legend",
    title: "ChartLegend",
    summary:
      "Recharts legend primitive that defaults to ChartLegendContent when content is omitted.",
    fields: [
      field({
        name: "content",
        type: "ReactNode | ComponentType",
        description:
          "Legend renderer. Defaults to ChartLegendContent when omitted.",
      }),
      field({
        name: "verticalAlign",
        type: '"top" | "bottom"',
        defaultValue: '"bottom"',
        description: "Adjusts legend spacing relative to the chart.",
      }),
    ],
  },
  {
    id: "chart-legend-content",
    title: "ChartLegendContent",
    summary:
      "Legend content shell with a quiet fade-and-rise entrance that matches the chart surface motion.",
    fields: [
      field({
        name: "hideIcon",
        type: "boolean",
        defaultValue: "false",
        description:
          "Hides config icons and falls back to the color swatch derived from the series color.",
      }),
      field({
        name: "nameKey",
        type: "string",
        description:
          "Payload key used to resolve ChartConfig labels and swatch colors for each legend row.",
      }),
      field({
        name: "verticalAlign",
        type: '"top" | "bottom"',
        defaultValue: '"bottom"',
        description: "Adjusts legend spacing relative to the chart.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Classes merged onto the legend shell.",
      }),
    ],
  },
  {
    id: "chart-empty-state",
    title: "ChartEmptyState",
    summary:
      "Centered empty placeholder for charts with no data yet or while a dataset is loading.",
    fields: [
      field({
        name: "label",
        type: "ReactNode",
        defaultValue: '"No data available"',
        description: "Primary empty-state message.",
      }),
      field({
        name: "description",
        type: "ReactNode",
        description: "Optional supporting copy beneath the label.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Classes merged onto the empty-state shell.",
      }),
    ],
    notes: [
      "Render ChartEmptyState inside ChartContainer when your query returns zero rows or while async data is still loading.",
    ],
  },
  {
    id: "use-chart",
    title: "useChart",
    summary:
      "Reads ChartContainer context, including ChartConfig and whether the initial series animation is still active.",
    fields: [
      field({
        name: "config",
        type: "ChartConfig",
        description: "The ChartConfig passed to ChartContainer.",
      }),
      field({
        name: "chartAnimationActive",
        type: "boolean",
        description:
          "True during the first ease-out series animation window, then false after resize-safe timing completes.",
      }),
    ],
    notes: [
      "Use this hook inside custom tooltip, legend, or annotation content rendered within ChartContainer.",
    ],
  },
  registryItem(
    "charts.json",
    ["recharts", "motion"],
    [
      "This install is a Recharts + Motion shell only. It does not ship Radix UI or Base UI variants.",
      "Chart colors come from local --chart-1 through --chart-5 defaults and per-series --color-{key} variables generated from ChartConfig.",
    ]
  ),
];

const cardApiDetails: DetailItem[] = [
  {
    id: "card",
    title: "Card",
    summary:
      "Compound card surface with slot-based sections, optional interactive lift, and layout-aware motion between content states.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Compose CardHeader, CardContent, CardFooter, media, or custom blocks inside the shared card shell.",
      }),
      field({
        name: "interactive",
        type: "boolean",
        defaultValue: "false",
        description:
          "Enables the restrained hover lift and stronger surface response intended for clickable or focusable cards.",
      }),
      field({
        name: "asChild",
        type: "boolean",
        defaultValue: "false",
        description:
          "Merges the card surface classes and interaction handlers onto the single child element, which is useful for link or button cards.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root card surface for local spacing, border, or layout adjustments without replacing the slot API.",
      }),
      field({
        name: "onHoverStart",
        type: "() => void",
        description:
          "Called when interactive hover feedback begins from pointer, focus, or keyboard focus within the card.",
      }),
      field({
        name: "onHoverEnd",
        type: "() => void",
        description:
          "Called when interactive hover feedback ends after pointer leave and focus exits the card.",
      }),
    ],
    notes: [
      "The root forwards standard div props, so you can attach ids, aria attributes, data attributes, and event handlers directly.",
      "Cards with a direct leading image automatically remove top padding and inherit the root radius on the first and last image edges.",
      "Footer-aware padding is handled by the card itself, so adding CardFooter trims the bottom padding without extra wrapper logic.",
      "For whole-card navigation, prefer asChild with a single anchor or button child instead of nesting interactive controls inside a second clickable wrapper.",
      "Keep nested buttons or links inside a non-wrapped card shell to avoid invalid interactive nesting.",
    ],
  },
  {
    id: "card-header",
    title: "CardHeader",
    summary:
      "Top header grid for title, description, and an optional trailing CardAction.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Compose CardTitle, CardDescription, and optional CardAction inside the header grid.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the header grid wrapper.",
      }),
    ],
    notes: [
      "The header uses a compact grid so status pills and actions align naturally without extra wrappers.",
    ],
  },
  {
    id: "card-title",
    title: "CardTitle",
    summary: "Primary heading slot with default title typography.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Heading content for the card. Works with links, badges, metrics, or richer inline content.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the default title typography classes.",
      }),
      field({
        name: "as",
        type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span"',
        defaultValue: '"h3"',
        description:
          "Semantic heading element used for the title. Defaults to h3 for accessible card headings.",
      }),
    ],
  },
  {
    id: "card-description",
    title: "CardDescription",
    summary: "Secondary supporting copy beneath the title.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Supporting description or excerpt text rendered with muted body styling.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the muted description typography classes.",
      }),
      field({
        name: "as",
        type: '"p" | "div" | "span"',
        defaultValue: '"p"',
        description:
          "Semantic text element used for the description. Defaults to p for accessible supporting copy.",
      }),
    ],
  },
  {
    id: "card-action",
    title: "CardAction",
    summary:
      "Optional trailing action slot aligned to the top-right of CardHeader.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Action content such as a menu trigger, status pill, or compact control.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the default action placement classes.",
      }),
    ],
  },
  {
    id: "card-content",
    title: "CardContent",
    summary:
      "Flexible middle section for body copy, media, stats, and custom layouts.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Main card body content rendered inside the padded content slot.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the default horizontal padding classes.",
      }),
    ],
  },
  {
    id: "card-footer",
    title: "CardFooter",
    summary:
      "Bottom section for supporting actions, metadata, or contextual labels.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Footer content rendered on a quieter separated surface beneath the body.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged with the default footer surface and spacing classes.",
      }),
    ],
    notes: [
      "Adding CardFooter trims the root card bottom padding automatically.",
    ],
  },
  {
    id: "card-image",
    title: "CardImage",
    summary:
      "Next.js Image slot with the shared inset media frame, default fill sizing, and card-aware radius handling. Always renders next/image.",
    fields: [
      field({
        name: "alt",
        type: "string",
        required: true,
        description: "Accessible alternative text for the image.",
      }),
      field({
        name: "src",
        type: "string",
        required: true,
        description: "Image source passed through to next/image.",
      }),
      field({
        name: "inset",
        type: "boolean",
        defaultValue: "true",
        description:
          "When true, wraps the image in the padded card media frame. Set false for edge-to-edge media.",
      }),
      field({
        name: "fill",
        type: "boolean",
        description:
          "Uses fill layout when true. Defaults to fill when width and height are both omitted.",
      }),
      field({
        name: "sizes",
        type: "string",
        defaultValue: '"(max-width: 768px) 100vw, 400px"',
        description:
          "Responsive sizes hint forwarded to next/image for better loading performance.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the rendered image element.",
      }),
    ],
    notes: [
      "CardImage always renders next/image and requires a Next.js app.",
      "Use CardMedia instead for video, charts, embeds, or other non-image leading media.",
      "Fill images default to a 16:10 aspect ratio unless you override it with className.",
    ],
  },
  {
    id: "card-media",
    title: "CardMedia",
    summary:
      "Media slot for video, charts, embeds, or other custom leading media blocks.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Non-image media content such as video, a chart container, or an embed.",
      }),
      field({
        name: "inset",
        type: "boolean",
        defaultValue: "true",
        description:
          "When true, wraps children in the padded card media frame. Set false for edge-to-edge media.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the outer media wrapper.",
      }),
    ],
    notes: [
      "Use CardImage for static card artwork and photos.",
      "Both CardImage and CardMedia use the card-image slot so the root card can trim top padding automatically.",
    ],
  },
  {
    id: "card-clickable",
    title: "Clickable card recipes",
    summary:
      "Patterns for whole-card navigation and cards that contain separate interactive controls.",
    notes: [
      'Whole-card link: <Card asChild interactive><a href="/post">...</a></Card>.',
      'Whole-card button: <Card asChild interactive><button type="button">...</button></Card>.',
      "Card with its own CTA: keep Card unwrapped and place buttons or links inside CardContent or CardFooter.",
      "Do not wrap a card that already contains buttons or links in another anchor or button via asChild.",
    ],
  },
  {
    id: "card-motion",
    title: "Motion and interaction model",
    summary:
      "Layout changes are animated through Motion so expanding or swapping card content feels fluid rather than abrupt.",
    notes: [
      "When interactive is enabled, hover drives a spring-smoothed motion value so lift, scale, and shadow ease in and out as one fluid surface; compound slots only animate layout when content changes.",
      "interactive only changes the visible surface response: border, shadow, and a very small hover lift. The component does not add button semantics on its own.",
      "prefers-reduced-motion disables spring hover and layout transitions. Interactive cards still get border and surface feedback through CSS.",
      "asChild cards use CSS-based hover lift instead of spring transforms so the merged anchor or button remains the interactive root. Lift is also skipped when prefers-reduced-motion is enabled.",
    ],
  },
  registryItem(
    "card.json",
    ["motion", "@radix-ui/react-slot"],
    [
      "CardImage requires a Next.js project because it always renders next/image.",
      "Use CardMedia for non-image leading media such as video, charts, or embeds.",
    ]
  ),
];

const breadcrumbsApiDetails: DetailItem[] = [
  {
    id: "breadcrumb",
    title: "Breadcrumb",
    summary: "Root semantic navigation wrapper for a breadcrumb trail.",
    fields: [
      field({
        name: "ariaLabel",
        type: "string",
        defaultValue: '"Breadcrumb"',
        description:
          "Accessible label for the root nav landmark. Override for localization.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the nav element for placement inside headers, toolbars, and page shells.",
      }),
    ],
    notes: [
      "Compose BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, and BreadcrumbSeparator inside the root.",
    ],
  },
  {
    id: "breadcrumbs",
    title: "Breadcrumbs",
    summary:
      "Convenience wrapper that renders a trail from an items array with optional collapse and JSON-LD.",
    fields: [
      field({
        name: "items",
        type: "BreadcrumbItemData[]",
        required: true,
        description:
          "Ordered trail segments with label, optional href, icon, and title fields.",
      }),
      field({
        name: "maxItems",
        type: "number",
        description:
          "When the trail exceeds this count, middle segments collapse into BreadcrumbEllipsisMenu.",
      }),
      field({
        name: "truncate",
        type: "boolean",
        defaultValue: "false",
        description:
          "Applies max-width truncation to linked and current-page labels.",
      }),
      field({
        name: "separator",
        type: "ReactNode",
        description:
          "Custom separator content passed to each BreadcrumbSeparator in the generated trail.",
      }),
      field({
        name: "renderLink",
        type: "(props) => ReactNode",
        description:
          "Optional custom link renderer for framework routers such as Next.js Link.",
      }),
      field({
        name: "siteUrl",
        type: "string",
        description:
          "Absolute site origin used when BreadcrumbJsonLd is emitted alongside the trail.",
      }),
      field({
        name: "currentPath",
        type: "string",
        description:
          "Fallback path for the final breadcrumb item in JSON-LD when it has no href.",
      }),
      field({
        name: "listClassName",
        type: "string",
        description: "Merged onto the internal BreadcrumbList element.",
      }),
    ],
    notes: [
      "The final item without an href is treated as the current page.",
      "Pass renderLink when you need router-aware links instead of plain anchors.",
    ],
  },
  {
    id: "breadcrumb-list",
    title: "BreadcrumbList",
    summary:
      "Ordered list that lays out breadcrumb segments and separators with optional Motion.",
    fields: [
      field({
        name: "className",
        type: "string",
        description:
          "Merged with the default flex wrapping, spacing, and muted text styles.",
      }),
    ],
    notes: [
      "Uses AnimatePresence with popLayout for trail insertions and removals.",
    ],
  },
  {
    id: "breadcrumb-item",
    title: "BreadcrumbItem",
    summary: "List item wrapper for each breadcrumb segment.",
    fields: [
      field({
        name: "className",
        type: "string",
        description:
          "Merged with the inline-flex item layout. Dynamic items should receive stable React keys when rendered from arrays.",
      }),
    ],
  },
  {
    id: "breadcrumb-link",
    title: "BreadcrumbLink",
    summary:
      "Base UI render-compatible link for navigable breadcrumb segments.",
    fields: [
      field({
        name: "href",
        type: "string",
        description:
          "Destination for the linked segment. You can also compose a router link with the render prop.",
      }),
      field({
        name: "render",
        type: "ReactElement | render function",
        description:
          "Optional Base UI render override for composing with framework-specific links while preserving merged props.",
      }),
      field({
        name: "truncate",
        type: "boolean",
        defaultValue: "false",
        description:
          "Applies responsive max-width truncation with an optional title tooltip.",
      }),
      field({
        name: "title",
        type: "string",
        description:
          "Native title attribute for truncated or abbreviated link labels.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged with the default focus ring, color transition, and hover foreground treatment.",
      }),
    ],
  },
  {
    id: "breadcrumb-page",
    title: "BreadcrumbPage",
    summary: "Current page segment rendered with aria-current='page'.",
    fields: [
      field({
        name: "truncate",
        type: "boolean",
        defaultValue: "false",
        description: "Applies responsive max-width truncation to the label.",
      }),
      field({
        name: "title",
        type: "string",
        description: "Native title attribute for truncated labels.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged with the default foreground current-page text style.",
      }),
    ],
  },
  {
    id: "breadcrumb-separator",
    title: "BreadcrumbSeparator",
    summary:
      "Visual separator between breadcrumb items, defaulting to a chevron icon.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        description:
          "Optional custom separator content. When omitted, ChevronRightIcon is rendered.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged with the default icon sizing class for separator icons.",
      }),
    ],
    notes: ["Separators render with role='presentation' and aria-hidden."],
  },
  {
    id: "breadcrumb-ellipsis",
    title: "BreadcrumbEllipsis",
    summary:
      "Decorative overflow marker for manually composed collapsed trails.",
    fields: [
      field({
        name: "className",
        type: "string",
        description:
          "Merged with the default 20px square centered icon layout.",
      }),
    ],
    notes: [
      "Wrap inside BreadcrumbItem for valid list semantics.",
      "Use BreadcrumbEllipsisMenu when the overflow segment should be interactive.",
    ],
  },
  {
    id: "breadcrumb-ellipsis-menu",
    title: "BreadcrumbEllipsisMenu",
    summary:
      "Accessible button-triggered menu for collapsed breadcrumb segments.",
    fields: [
      field({
        name: "items",
        type: "BreadcrumbEllipsisMenuItem[]",
        required: true,
        description:
          "Collapsed segments rendered inside the overflow menu. Each item accepts an optional icon.",
      }),
      field({
        name: "menuLabel",
        type: "string",
        defaultValue: '"Show collapsed breadcrumb items"',
        description: "Accessible label for the overflow trigger button.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the relative menu wrapper.",
      }),
    ],
  },
  {
    id: "breadcrumb-json-ld",
    title: "BreadcrumbJsonLd",
    summary:
      "Emits schema.org BreadcrumbList JSON-LD for SEO when paired with a siteUrl.",
    fields: [
      field({
        name: "items",
        type: "BreadcrumbJsonLdItem[]",
        required: true,
        description: "Trail labels and optional href values.",
      }),
      field({
        name: "siteUrl",
        type: "string",
        required: true,
        description:
          "Absolute site origin used to resolve relative breadcrumb URLs.",
      }),
      field({
        name: "currentPath",
        type: "string",
        defaultValue: '"/"',
        description:
          "Fallback path for the final breadcrumb when it has no href.",
      }),
    ],
  },
  {
    id: "breadcrumbs-a11y",
    title: "Accessibility and motion",
    summary:
      "The compound API keeps semantic breadcrumb structure while layering Motion on top.",
    notes: [
      "BreadcrumbList wraps the trail in an ordered list.",
      "BreadcrumbLink exposes a visible focus ring for keyboard users.",
      "BreadcrumbPage marks the final segment with aria-current='page'.",
      "BreadcrumbEllipsisMenu uses aria-expanded, aria-haspopup, and Escape to dismiss.",
    ],
  },
  registryItem("breadcrumbs.json", [
    "@base-ui/react",
    "motion",
    "lucide-react",
  ]),
];

const buttonApiDetails: DetailItem[] = [
  {
    id: "button",
    title: "Button",
    summary:
      "Base UI button with embedded Iconiq theme tokens, shadcn-style variants, spring press feedback, optional loading state, link rendering, and Motion ripple layer.",
    fields: [
      field({
        name: "variant",
        type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
        defaultValue: "default",
        description:
          "Chooses the visual recipe from the exported buttonVariants map.",
      }),
      field({
        name: "linkUnderline",
        type: '"motion" | "static"',
        defaultValue: '"motion" (when variant is link)',
        description:
          "Link variant only. motion keeps foreground text with a grey baseline underline that fills darker on hover. static uses the same text size as other variants with hover:underline.",
      }),
      field({
        name: "size",
        type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
        defaultValue: "default",
        description:
          "Controls the shadcn-style height, padding, gap, radius, and icon sizing for text and icon-only buttons.",
      }),
      field({
        name: "animateSize",
        type: "boolean",
        defaultValue: "false",
        description:
          "Animates the button width with a spring as its intrinsic content changes, which is useful for labels like Continue, Saving..., and Saved on the same control.",
      }),
      field({
        name: "loading",
        type: "boolean",
        defaultValue: "false",
        description:
          "Locks the control, sets aria-busy, crossfades the label and icon into a spring-animated spinner, and suppresses ripples until loading finishes.",
      }),
      field({
        name: "loadingIcon",
        type: "ReactNode",
        description:
          "Optional spinner or status icon shown while loading is true. Defaults to a Lucide Loader2 icon with animate-spin.",
      }),
      field({
        name: "href",
        type: "string",
        description:
          "When set, renders an animated anchor instead of a button. Disabled and loading states use aria-disabled, tabIndex -1, and click prevention.",
      }),
      field({
        name: "target",
        type: "string",
        description:
          'Anchor target such as "_blank". When the target opens a new tab, rel automatically gains noopener and noreferrer unless you already supplied them.',
      }),
      field({
        name: "rel",
        type: "string",
        description:
          "Optional anchor rel attribute. Merged with noopener noreferrer when target includes _blank.",
      }),
      field({
        name: "disableRipple",
        type: "boolean",
        defaultValue: "false",
        description:
          "Skips the pointer ripple when you want only the press-state feedback. Link buttons also skip the ripple by default to avoid a contained splash on text-only actions.",
      }),
      field({
        name: "type",
        type: '"button" | "submit" | "reset"',
        defaultValue: "button",
        description:
          "Passed to the underlying button element so the component does not submit forms accidentally by default. Ignored for href links.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        description:
          "Label content rendered above the ripple layer inside a z-10 span.",
      }),
      field({
        name: "icon",
        type: "ReactNode",
        description:
          "Optional icon rendered inline with the label. Nested SVGs inherit the built-in size utility and variant-aware icon color.",
      }),
      field({
        name: "iconLabel",
        type: "string",
        description:
          "Convenience prop that sets aria-label, which is required for icon-only sizes when no visible text children are present.",
      }),
      field({
        name: "iconPosition",
        type: '"start" | "end"',
        defaultValue: '"start"',
        description:
          "Chooses whether the optional icon renders before or after the button text inside the same inline content row. Loading always renders at the start.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged after the generated CVA classes, making it the main escape hatch for one-off layout changes.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description:
          "Native disabled state. Combines with loading to lock interaction and prevent ripple creation.",
      }),
    ],
    notes: [
      "The component ships embedded Iconiq theme tokens so primary, border, accent, and destructive colors resolve correctly without a separate theme install.",
      "Standard button attributes such as onClick, aria-*, name, form, and data-* are forwarded to the rendered button or anchor.",
      "href mode renders a motion-enhanced anchor; button mode renders Base UI Button with a motion.button surface via the render prop.",
      "The local pointer-down handler calls your onPointerDown first, then respects e.defaultPrevented before deciding whether to enter the pressed state or spawn a ripple.",
      "Pointer, keyboard, and blur handlers keep the pressed state in sync so Space and Enter get the same immediate feedback as pointer input.",
      "animateSize works best on intrinsically sized buttons rather than width-constrained layouts such as w-full.",
      "Icon-only sizes log a development warning when neither iconLabel nor aria-label is provided.",
    ],
  },
  {
    id: "button-variants",
    title: "buttonVariants",
    summary:
      "The CVA recipe exported alongside the component so matching button classes can be reused on links or custom wrappers.",
    fields: [
      field({
        name: "variant",
        type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
        defaultValue: '"default"',
        description:
          "Visual recipe passed to the CVA helper when composing classes outside the Button component.",
      }),
      field({
        name: "linkUnderline",
        type: '"motion" | "static"',
        defaultValue: '"motion" (when variant is link)',
        description:
          "Link variant only. Pass through the same underline mode used by the Button component.",
      }),
      field({
        name: "size",
        type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
        defaultValue: '"default"',
        description:
          "Size token passed to the CVA helper for text and icon-only button recipes.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Optional classes merged after the generated variant and size classes.",
      }),
    ],
    notes: [
      "Variants ship with six visual states and eight size tokens, including icon-only sizes.",
      "Because buttonVariants is a plain CVA export, you can compose it independently from the Button component when you do not want a motion.button element.",
      "The recipe includes the same embedded Iconiq theme tokens as the Button root.",
    ],
  },
  registryItem(
    "b-button.json",
    ["@base-ui/react", "motion", "class-variance-authority", "lucide-react"],
    [
      "Theme tokens are embedded in the component, so colors resolve out of the box without installing iconiq-theme separately.",
    ]
  ),
];

const buttonGroupApiDetails: DetailItem[] = [
  {
    id: "button-group-button",
    title: "Button",
    summary:
      "Compact bordered action button with muted idle text, darker hover text, optional ripple feedback, variants, and shadcn-style size controls.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Button content rendered inside an inline span so icon-and-label pairs keep consistent spacing across sizes.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root button. Use it for local width, spacing, or surface overrides.",
      }),
      field({
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description:
          "Compacts or expands the control. Inherits the ButtonGroup size when the button is rendered inside a group.",
      }),
      field({
        name: "variant",
        type: '"default" | "destructive" | "ghost" | "outline"',
        defaultValue: '"default"',
        description:
          "Visual treatment for the action. Destructive is useful for delete or irreversible actions inside a toolbar.",
      }),
      field({
        name: "disableRipple",
        type: "boolean",
        defaultValue: "false",
        description:
          "Turns off the click ripple while preserving the rest of the hover and focus styling.",
      }),
      field({
        name: "showBorder",
        type: "boolean",
        defaultValue: "true",
        description:
          "Adds a standalone border when the button is used outside ButtonGroup. Inside ButtonGroup, the wrapper supplies the outer border and dividers instead.",
      }),
    ],
    notes: [
      "Most standard button props such as type, disabled, onClick, name, value, aria-*, and data-* are forwarded to the underlying motion button.",
      "Inside ButtonGroup, individual borders are omitted so default and ghost variants sit flush in one connected surface.",
      "The public prop surface intentionally leaves out the native drag and CSS animation callback props because they conflict with Motion's own handler names.",
    ],
  },
  {
    id: "button-group-icon-button",
    title: "IconButton",
    summary:
      "Icon-only toolbar action that shares the same compact border, muted idle tone, variants, and optional ripple behavior as Button.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Icon content rendered inside the inline content span. SVG children inherit the built-in size utilities for the active size variant.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the icon button root for size or surface overrides.",
      }),
      field({
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description:
          "Controls the square footprint of the icon button. Inherits the ButtonGroup size when rendered inside a group.",
      }),
      field({
        name: "variant",
        type: '"default" | "destructive" | "ghost" | "outline"',
        defaultValue: '"default"',
        description:
          "Matches the Button variant surface for icon-only actions.",
      }),
      field({
        name: "disableRipple",
        type: "boolean",
        defaultValue: "false",
        description: "Disables the click ripple for quieter toolbar actions.",
      }),
      field({
        name: "showBorder",
        type: "boolean",
        defaultValue: "true",
        description:
          "Removes the outer border when set to false so the icon action can sit more quietly beside a borderless group.",
      }),
    ],
  },
  {
    id: "button-group-layout",
    title: "ButtonGroup",
    summary:
      "Slot-aware flex wrapper for arranging adjacent controls with horizontal or vertical rounding rules and shared size context.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Buttons, icon buttons, ButtonGroupText, ButtonGroupSeparator, ButtonGroupItems, or any other data-slot controls you want to keep together.",
      }),
      field({
        name: "orientation",
        type: '"horizontal" | "vertical"',
        defaultValue: '"horizontal"',
        description:
          "Chooses the grouped rounding and shared-border direction used by buttonGroupVariants.",
      }),
      field({
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description:
          "Shared density for Button, IconButton, and ButtonGroupText children unless a child overrides size locally.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the outer group. Use it for wrapping, alignment, or local spacing overrides.",
      }),
    ],
  },
  {
    id: "button-group-text",
    title: "ButtonGroupText",
    summary:
      "Non-interactive text segment for labeling a group without leaving the shared button-group surface.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Short label or inline content rendered inside the grouped text segment.",
      }),
      field({
        name: "render",
        type: "useRender render prop",
        description:
          "Optional Base UI render override when you need a different element while keeping the same merged props.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged with the default muted bordered text segment classes.",
      }),
    ],
  },
  {
    id: "button-group-separator",
    title: "ButtonGroupSeparator",
    summary:
      "Separator segment for splitting labels, buttons, inputs, and grouped actions inside ButtonGroup.",
    fields: [
      field({
        name: "orientation",
        type: '"horizontal" | "vertical"',
        defaultValue: '"vertical"',
        description:
          "Controls the separator axis. Vertical separators are the default for horizontal button groups.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged with the self-stretching separator classes for custom color or spacing.",
      }),
    ],
  },
  {
    id: "button-group-items",
    title: "ButtonGroupItems",
    summary:
      "Segmented button shell that converts valid child elements into compact internal buttons with muted idle text and darker hover states.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Pass plain button-like elements as children. Their props and children are hoisted into the internal motion buttons rendered by the group.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the outer segmented wrapper for width or surface overrides.",
      }),
      field({
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description:
          "Sets the shared height, padding, and typography of the grouped buttons.",
      }),
      field({
        name: "showDividers",
        type: "boolean",
        defaultValue: "true",
        description:
          "Removes the internal separator lines and the outer wrapper border when set to false, then switches the group to a smoother shared hover surface.",
      }),
      field({
        name: "disableRipple",
        type: "boolean",
        defaultValue: "false",
        description:
          "Turns off the ripple for every internal button rendered by the group.",
      }),
    ],
    notes: [
      "Only valid React elements are rendered. Non-element children are ignored and warned about in development.",
      "The child node itself is not preserved; ButtonGroupItems reads each child's props and children, then renders a fresh motion button for that slot.",
      "When showDividers is false, hover feedback moves as a shared spring layer between items and re-measures on resize.",
      'Uses data-slot="button-group-items" so it can sit inside ButtonGroup without breaking connected layout rules.',
    ],
  },
  {
    id: "segmented-control",
    title: "SegmentedControl",
    summary:
      "Segmented selector with string or rich option objects, compact sizing, keyboard support, RTL-aware navigation, form name support, and a spring-driven selected indicator.",
    fields: [
      field({
        name: "options",
        type: "Array<string | { value: string; label?: ReactNode; disabled?: boolean; icon?: ReactNode }>",
        required: true,
        description:
          "Ordered list of segments. Each entry can be a plain string or an object with a stable value, optional label, icon, and disabled flag.",
      }),
      field({
        name: "value",
        type: "string",
        description:
          "Controlled selected value. When provided, the internal state syncs to this prop through an effect.",
      }),
      field({
        name: "onChange",
        type: "(value: string) => void",
        description:
          "Called with the selected value whenever a segment is pressed or moved to with the keyboard.",
      }),
      field({
        name: "ariaLabel",
        type: "string",
        description:
          "Accessible name for the radiogroup. Provide this or ariaLabelledBy so screen readers can identify the control.",
      }),
      field({
        name: "ariaLabelledBy",
        type: "string",
        description:
          "ID of an external label element that names the radiogroup. Use when a visible label already exists in the page.",
      }),
      field({
        name: "name",
        type: "string",
        description:
          "When provided, renders a hidden input so the selected value can participate in native form submission.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Disables the entire control and every segment inside it.",
      }),
      field({
        name: "orientation",
        type: '"horizontal" | "vertical"',
        defaultValue: '"horizontal"',
        description:
          "Layout direction for the segmented shell and the primary arrow-key axis.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the segmented wrapper for width, alignment, or spacing overrides.",
      }),
      field({
        name: "layoutId",
        type: "string",
        description:
          "Optional Motion layout id for the selected indicator. When omitted, a unique id is generated per instance so multiple controls on one page do not share indicator motion.",
      }),
      field({
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description:
          "Controls the overall density of the segmented control shell and each segment inside it.",
      }),
    ],
    notes: [
      "The control uses radiogroup semantics with arrow-key, Home, and End navigation.",
      "Arrow-left and arrow-right reverse automatically in RTL layouts.",
      "Disabled options are skipped while moving selection with the keyboard.",
    ],
  },
  {
    id: "button-group-motion",
    title: "Motion and interaction",
    summary:
      "Each export keeps the same tactile feel, but the default presentation is now much more compact and toolbar-like.",
    notes: [
      "Button, IconButton, and ButtonGroupItems all default to muted text that darkens on hover, which better matches compact shadcn-style controls.",
      "ButtonGroup applies embedded theme tokens once at the group root so nested buttons do not repeat the full token block.",
      "The ButtonGroup wrapper uses the exported buttonGroupVariants CVA recipe, while existing motion-powered controls keep their ripple and shared-hover behavior.",
      "Ripple feedback can now be turned off per surface, which is useful when you want a quieter desktop toolbar feel.",
      "SegmentedControl keeps motion focused on selection changes rather than entrance effects, so the control feels faster and less oversized.",
    ],
  },
  registryItem("button-group.json", [
    "@base-ui/react",
    "motion",
    "class-variance-authority",
  ]),
];

const checkboxGroupApiDetails: DetailItem[] = [
  {
    id: "checkbox-group-item",
    title: "CheckboxGroupItem",
    summary:
      "A single checkbox row composed as a child of CheckboxGroup or CheckboxGroupSection.",
    fields: [
      field({
        name: "label",
        type: "React.ReactNode",
        required: true,
        description: "Primary copy shown for the row.",
      }),
      field({
        name: "value",
        type: "string",
        required: true,
        description:
          "Stable identifier used when checking whether the row is selected and when producing the next selection array.",
      }),
      field({
        name: "id",
        type: "string",
        description:
          "Optional stable id used for label and description associations. Falls back to a generated id when omitted.",
      }),
      field({
        name: "description",
        type: "React.ReactNode",
        description:
          "Optional secondary text rendered below the label and linked through aria-describedby.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description:
          "Disables this row only. Use CheckboxGroupSection disabled to disable an entire section.",
      }),
      field({
        name: "disabledReason",
        type: "string",
        description:
          "Optional explainer rendered below disabled rows and linked through aria-describedby.",
      }),
      field({
        name: "readOnly",
        type: "boolean",
        description:
          "Shows this row without allowing toggles and keeps it checked. Pair with CheckboxGroup value for mixed read-only and interactive rows.",
      }),
    ],
  },
  {
    id: "checkbox-group-section",
    title: "CheckboxGroupSection",
    summary:
      "Named fieldset wrapper for a cluster of CheckboxGroupItem children. Mirrors how ButtonGroup composes child buttons.",
    fields: [
      field({
        name: "label",
        type: "string",
        description:
          "Optional section heading rendered as a fieldset legend. Required for maxVisible section collapse.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description:
          "Disables every checkbox row inside this section and applies native fieldset disabled semantics.",
      }),
      field({
        name: "children",
        type: "React.ReactNode",
        required: true,
        description: "CheckboxGroupItem elements to render inside the section.",
      }),
    ],
  },
  {
    id: "checkbox-option",
    title: "CheckboxGroupOption",
    summary:
      "Legacy options-array shape. Prefer CheckboxGroupItem children for new installs.",
    fields: [
      field({
        name: "label",
        type: "React.ReactNode",
        required: true,
        description: "Primary copy shown for the row.",
      }),
      field({
        name: "value",
        type: "string",
        required: true,
        description:
          "Stable identifier used when checking whether the row is selected and when producing the next selection array.",
      }),
      field({
        name: "id",
        type: "string",
        description:
          "Optional stable id used for label and description associations. Falls back to a generated id when omitted.",
      }),
      field({
        name: "description",
        type: "React.ReactNode",
        description:
          "Optional secondary text rendered below the label and linked through aria-describedby.",
      }),
      field({
        name: "group",
        type: "string",
        description:
          "Optional section label used to chunk long lists into named fieldset groups when adjacent options share the same value.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description:
          "Disables the row button and blocks hover, active, and toggle behavior for that option. Works inside grouped sections as well as flat lists.",
      }),
      field({
        name: "disabledReason",
        type: "string",
        description:
          "Optional explainer rendered below disabled rows and linked through aria-describedby.",
      }),
      field({
        name: "readOnly",
        type: "boolean",
        description:
          "Shows the row state without allowing toggles. Useful for locked consent or audit views.",
      }),
    ],
  },
  {
    id: "checkbox-group",
    title: "CheckboxGroup",
    summary:
      "Animated multi-select list composed with CheckboxGroupSection and CheckboxGroupItem children, with optional legacy options prop support.",
    fields: [
      field({
        name: "children",
        type: "React.ReactNode",
        description:
          "Preferred composition API. Pass CheckboxGroupItem rows directly or nest them inside CheckboxGroupSection wrappers.",
      }),
      field({
        name: "options",
        type: "CheckboxGroupOption[]",
        description:
          "Legacy array-based configuration. Ignored when children are provided.",
      }),
      field({
        name: "value",
        type: "string[]",
        description:
          "Controlled selected values. When provided, the parent remains the source of truth while the component renders an immediate optimistic preview after each click.",
      }),
      field({
        name: "defaultValue",
        type: "string[]",
        defaultValue: "[]",
        description:
          "Initial selected values for uncontrolled usage. Ignored when value is provided.",
      }),
      field({
        name: "onChange",
        type: "(value: string[]) => void",
        description:
          "Receives the next selected values array after a row is toggled, normalized back into the original display order.",
      }),
      field({
        name: "name",
        type: "string",
        description:
          "Forwarded to each hidden checkbox input for native form submission.",
      }),
      field({
        name: "form",
        type: "string",
        description:
          "Associates the hidden checkbox inputs with a distant form element by id.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description:
          "Disables every row in the group. Prefer CheckboxGroupSection disabled or CheckboxGroupItem disabled for partial disable.",
      }),
      field({
        name: "invalid",
        type: "boolean",
        defaultValue: "false",
        description:
          "Applies destructive border styling and aria-invalid for form validation feedback.",
      }),
      field({
        name: "size",
        type: '"sm" | "default" | "lg"',
        defaultValue: '"default"',
        description:
          "Controls row padding, checkbox box size, and label typography.",
      }),
      field({
        name: "maxVisible",
        type: "number",
        description:
          "When labeled CheckboxGroupSection children are used, limits how many sections stay visible before a show more control appears.",
      }),
      field({
        name: "showMoreLabel",
        type: "string",
        defaultValue: '"Show more"',
        description:
          "Button label when grouped sections are collapsed. Appends the hidden section count in parentheses.",
      }),
      field({
        name: "showLessLabel",
        type: "string",
        defaultValue: '"Show less"',
        description: "Button label when grouped sections are expanded.",
      }),
      field({
        name: "aria-label",
        type: "string",
        description:
          "Accessible name for the checkbox group when no visible label is present.",
      }),
      field({
        name: "aria-labelledby",
        type: "string",
        description:
          "Id of an external element that labels the checkbox group.",
      }),
      field({
        name: "aria-describedby",
        type: "string",
        description:
          "Id of an external element that describes the checkbox group.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the root flex column wrapper.",
      }),
    ],
    notes: [
      "The component previews the next state immediately after a click, then re-syncs with whatever value the parent sends back.",
      "Compose rows with CheckboxGroupSection and CheckboxGroupItem, similar to ButtonGroup child buttons.",
      "Named sections render as fieldset and legend pairs. Unlabeled sections render as plain fieldsets.",
      "maxVisible only applies when at least one CheckboxGroupSection includes a label.",
      "Collapsed grouped sections stay mounted but hidden so Base UI selection state is preserved. Sections with selected values auto-expand.",
      "Returns null when no items are provided.",
    ],
  },
  {
    id: "checkbox-motion",
    title: "Motion and accessibility",
    summary:
      "Base UI supplies role='group', checkbox semantics, and hidden native inputs underneath the animated row shell.",
    notes: [
      "Selection is represented by an SVG checkmark draw instead of a filled checkbox background.",
      "Row hover, active, tap spring, and label fade match the core Iconiq checkbox-group.",
      "Motion honors prefers-reduced-motion for checkmark draw and label fade transitions.",
    ],
  },
  registryItem("b-checkbox-group.json", ["@base-ui/react/checkbox", "motion"]),
];

const checkboxApiDetails: DetailItem[] = [
  {
    id: "checkbox",
    title: "Checkbox",
    summary:
      "Provider-switchable single checkbox layered over Base UI or Radix primitives with optional label, description, and form-field props.",
    fields: [
      field({
        name: "checked",
        type: 'boolean | "indeterminate"',
        description:
          'Controlled checked state. Pass true, false, or "indeterminate" for partial selection rows such as select-all headers.',
      }),
      field({
        name: "defaultChecked",
        type: 'boolean | "indeterminate"',
        defaultValue: "false",
        description:
          "Initial state for uncontrolled usage. It is only read on the first render.",
      }),
      field({
        name: "onCheckedChange",
        type: "(checked: boolean) => void",
        description:
          "Called with the next boolean value whenever the user toggles the checkbox. Indeterminate clicks resolve to true.",
      }),
      field({
        name: "label",
        type: "React.ReactNode",
        description:
          "Optional label rendered beside the control. When provided with description, both sit inside a native label element linked by htmlFor.",
      }),
      field({
        name: "description",
        type: "React.ReactNode",
        description:
          "Optional helper copy rendered under the label and linked through aria-describedby.",
      }),
      field({
        name: "labelClassName",
        type: "string",
        description: "Merged onto the label text wrapper.",
      }),
      field({
        name: "descriptionClassName",
        type: "string",
        description: "Merged onto the description text wrapper.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description:
          "Disables interaction and applies reduced opacity to the full row.",
      }),
      field({
        name: "readOnly",
        type: "boolean",
        defaultValue: "false",
        description:
          "Shows the current state without allowing toggles. Useful for locked consent rows.",
      }),
      field({
        name: "required",
        type: "boolean",
        defaultValue: "false",
        description:
          "Forwards native required validation to the hidden checkbox input and appends a visual asterisk to the label.",
      }),
      field({
        name: "invalid",
        type: "boolean",
        defaultValue: "false",
        description:
          "Applies destructive border styling and aria-invalid for form validation feedback.",
      }),
      field({
        name: "name",
        type: "string",
        description: "Input name submitted with native forms.",
      }),
      field({
        name: "value",
        type: "string",
        description: "Value submitted when the checkbox is checked.",
      }),
      field({
        name: "form",
        type: "string",
        description:
          "Associates the hidden input with a form element by id when the checkbox renders outside the form.",
      }),
      field({
        name: "size",
        type: '"sm" | "default" | "lg"',
        defaultValue: '"default"',
        description: "Adjusts box, icon, label, and row spacing together.",
      }),
      field({
        name: "id",
        type: "string",
        description:
          "Stable id for the control. When omitted, the component generates one and uses it for label association.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the outer row wrapper so you can position the checkbox in your layout.",
      }),
    ],
    notes: [
      "Install b-checkbox.json for Base UI or r-checkbox.json for Radix UI. Both expose the same Iconiq API.",
      "When label or description is present, the row uses a native label element with htmlFor instead of manual click forwarding.",
      "Base UI renders a hidden native input beside the animated button, so name, value, required, and form work out of the box.",
      "Radix readOnly is enforced in the component so the visual state cannot be toggled while still looking active.",
    ],
  },
  {
    id: "checkbox-motion",
    title: "Motion and accessibility",
    summary:
      "Visual feedback comes from Motion while checkbox semantics travel through the underlying primitive and hidden input.",
    notes: [
      "The box animates its border and fill between theme tokens, then the checkmark or minus icon draws based on the next state.",
      "Tap feedback briefly compresses the control unless disabled, readOnly, or prefers-reduced-motion is active.",
      "The label subtly dims when the row is fully checked. Indeterminate rows keep full label opacity.",
      "Checkbox groups for multi-select lists are available via b-checkbox-group. There is no r-checkbox-group registry entry yet.",
    ],
  },
  registryItem("b-checkbox.json", ["@base-ui/react/checkbox", "motion"]),
];

const comboboxApiDetails: DetailItem[] = [
  {
    id: "combobox",
    title: "Combobox",
    summary:
      "Root combobox controller. Compose ComboboxInput, ComboboxContent, ComboboxList, and ComboboxItem inside it.",
    fields: [
      field({
        name: "items",
        type: "readonly Item[]",
        description:
          "Optional item collection used by Base UI for filtering and render-function lists.",
      }),
      field({
        name: "value",
        type: "Item | Item[] | null",
        description:
          "Controlled selected value. Use an array when multiple is true.",
      }),
      field({
        name: "defaultValue",
        type: "Item | Item[] | null",
        description: "Initial selected value for uncontrolled usage.",
      }),
      field({
        name: "onValueChange",
        type: "(value, eventDetails) => void",
        description:
          "Called when an item is selected, a chip is removed, or the clear action resets the selection.",
      }),
      field({
        name: "multiple",
        type: "boolean",
        defaultValue: "false",
        description:
          "Allows selecting multiple items. Pair with ComboboxChips, ComboboxChip, and ComboboxChipsInput.",
      }),
      field({
        name: "itemToStringLabel",
        type: "(item: Item) => string",
        description:
          "Maps object values to the label shown in the input and used for text filtering.",
      }),
      field({
        name: "itemToStringValue",
        type: "(item: Item) => string",
        description: "Maps object values to the hidden form value.",
      }),
      field({
        name: "isItemEqualToValue",
        type: "(item, value) => boolean",
        description:
          "Custom equality check for object values. Defaults to Object.is.",
      }),
      field({
        name: "inputValue",
        type: "string",
        description:
          "Controlled search text. Leave uncontrolled for Base UI to manage query state.",
      }),
      field({
        name: "onInputValueChange",
        type: "(inputValue, eventDetails) => void",
        description: "Called when the typed query changes.",
      }),
      field({
        name: "autoHighlight",
        type: "boolean",
        defaultValue: "false",
        description:
          "Automatically highlights the first matching item while filtering.",
      }),
      field({
        name: "open",
        type: "boolean",
        description: "Controlled popup state. Pair with onOpenChange.",
      }),
      field({
        name: "onOpenChange",
        type: "(open, eventDetails) => void",
        description: "Called when the popup opens or closes.",
      }),
      field({
        name: "openOnInputClick",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, clicking the input shell opens the popup. Otherwise only focus is moved.",
      }),
      field({
        name: "onItemHighlighted",
        type: "(value, eventDetails) => void",
        description:
          "Called when the highlighted item changes from keyboard or pointer navigation.",
      }),
    ],
    notes: [
      "The root wraps Base UI's combobox primitive with the same Iconiq motion layer used by the previous wrapper.",
      "Filtering, selection, typeahead, keyboard navigation, and clear behavior are delegated to Base UI while the visual treatment stays Iconiq.",
      "Popup, item, and highlight motion honor prefers-reduced-motion automatically.",
    ],
  },
  {
    id: "combobox-input",
    title: "ComboboxInput",
    summary:
      "Styled input shell with border, focus ring, optional label, clear button, and rotating trigger icon.",
    fields: [
      field({
        name: "label",
        type: "ReactNode",
        description:
          "Optional label rendered above the input shell with an associated htmlFor.",
      }),
      field({
        name: "placeholder",
        type: "string",
        description: "Shown when no item is selected and the input is empty.",
      }),
      field({
        name: "showClear",
        type: "boolean",
        defaultValue: "true",
        description: "Controls whether ComboboxClear is rendered in the input.",
      }),
      field({
        name: "showTrigger",
        type: "boolean",
        defaultValue: "true",
        description:
          "Controls whether the rotating trigger icon is rendered in the input.",
      }),
      field({
        name: "size",
        type: '"sm" | "default"',
        defaultValue: '"default"',
        description: "Controls the input shell height.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the wrapper when label is set, otherwise onto the input shell.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description:
          "Disables the input, clear button, and trigger while applying reduced-opacity presentation.",
      }),
      field({
        name: "aria-invalid",
        type: "boolean",
        description:
          "When true, applies destructive border and ring styling to the input shell.",
      }),
    ],
  },
  {
    id: "combobox-clear",
    title: "ComboboxClear",
    summary:
      "Clears the current selection. Rendered automatically inside ComboboxInput when showClear is true.",
    fields: [
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Prevents clearing while disabled.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the clear button.",
      }),
    ],
    notes: [
      "Visibility is managed by Base UI and only appears when a value can be cleared.",
    ],
  },
  {
    id: "combobox-trigger",
    title: "ComboboxTrigger",
    summary:
      "Opens or closes the popup. Rendered automatically inside ComboboxInput when showTrigger is true.",
    fields: [
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Prevents toggling while disabled.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the trigger button.",
      }),
    ],
  },
  {
    id: "combobox-status",
    title: "ComboboxStatus",
    summary:
      "Announces async loading or empty-state copy politely to screen readers.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        description:
          "Status message content. Keep the root mounted and update children instead of conditionally rendering the component.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the status container.",
      }),
    ],
  },
  {
    id: "combobox-content",
    title: "ComboboxContent",
    summary:
      "Portaled dropdown surface with the previous white/dark panel, border, shadow, and fade-slide motion.",
    fields: [
      field({
        name: "side",
        type: '"top" | "right" | "bottom" | "left" | "inline-start" | "inline-end"',
        defaultValue: '"bottom"',
        description: "Preferred side for the popup.",
      }),
      field({
        name: "align",
        type: '"start" | "center" | "end"',
        defaultValue: '"start"',
        description: "Popup alignment relative to the input anchor.",
      }),
      field({
        name: "sideOffset",
        type: "number",
        defaultValue: "4",
        description: "Gap between the input shell and dropdown.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the animated popup panel.",
      }),
    ],
    notes: [
      "The popup remains mounted while closing so the motion exit can complete before Base UI unmounts it.",
      "The panel width matches the input anchor and the list scrolls at the same max height as before.",
    ],
  },
  {
    id: "combobox-list",
    title: "ComboboxList",
    summary:
      "Scrollable item list rendered inside ComboboxContent with the previous max-height and motion treatment.",
    fields: [
      field({
        name: "children",
        type: "ReactNode | ((item, index) => ReactNode)",
        required: true,
        description:
          "Render explicit children or a render function when using the root items prop.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the default list spacing and scroll classes.",
      }),
    ],
  },
  {
    id: "combobox-item",
    title: "ComboboxItem",
    summary:
      "Animated row with active highlight, optional description layout, and selected checkmark spring.",
    fields: [
      field({
        name: "value",
        type: "Item",
        required: true,
        description: "Stable value used by Base UI for selection.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Primary item label content.",
      }),
      field({
        name: "description",
        type: "ReactNode",
        description:
          "Optional secondary line rendered below the item label, matching the prior option description UI.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the default row layout and motion classes.",
      }),
    ],
    notes: [
      "Keyboard highlight follows itemState.highlighted; pointer hover uses the same spring motion layer.",
      "Disabled items render with reduced opacity and ignore pointer interaction.",
      "ComboboxEmpty, ComboboxGroup, ComboboxLabel, ComboboxSeparator, ComboboxCollection, ComboboxChips, ComboboxChip, ComboboxChipsInput, ComboboxValue, and useComboboxAnchor are exported for larger compositions.",
    ],
  },
  registryItem("b-combobox.json", ["@base-ui/react", "motion", "lucide-react"]),
];

const autocompleteApiDetails: DetailItem[] = [
  {
    id: "autocomplete",
    title: "Autocomplete",
    summary:
      "Root autocomplete controller. Compose AutocompleteInput, AutocompleteContent, AutocompleteList, and AutocompleteItem inside it.",
    fields: [
      field({
        name: "items",
        type: "readonly Item[]",
        description:
          "Item collection used for list filtering. Pass a flat array or grouped items for sectioned results.",
      }),
      field({
        name: "value",
        type: "string",
        description: "Controlled input text shown in the field.",
      }),
      field({
        name: "defaultValue",
        type: "string",
        description: "Initial input text for uncontrolled usage.",
      }),
      field({
        name: "onValueChange",
        type: "(value: string, eventDetails) => void",
        description:
          "Called when the input text changes from typing or when a suggestion is accepted.",
      }),
      field({
        name: "itemToStringValue",
        type: "(item: Item) => string",
        description:
          "Maps each item to the string used for filtering and the committed input value.",
      }),
      field({
        name: "autoHighlight",
        type: 'boolean | "always"',
        defaultValue: "true",
        description:
          "Automatically highlights the first matching item while typing.",
      }),
      field({
        name: "keepHighlight",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, keeps the highlighted item when the pointer leaves the list.",
      }),
      field({
        name: "open",
        type: "boolean",
        description: "Controlled popup state. Pair with onOpenChange.",
      }),
      field({
        name: "onOpenChange",
        type: "(open: boolean, eventDetails) => void",
        description:
          "Called when the suggestion panel opens or closes. Use with open for controlled popup state.",
      }),
      field({
        name: "onItemHighlighted",
        type: "(item: Item | undefined, eventDetails) => void",
        description:
          "Called when the highlighted suggestion changes from keyboard, pointer, or programmatic updates.",
      }),
      field({
        name: "openOnInputClick",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, clicking the input opens the suggestion panel even before typing.",
      }),
      field({
        name: "submitOnItemClick",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, selecting an item submits the owning form. Useful for search inputs.",
      }),
      field({
        name: "modal",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, traps focus inside the popup. Pair with AutocompleteBackdrop for a dimmed overlay.",
      }),
      field({
        name: "isItemEqualToValue",
        type: "(item: Item, value: Item) => boolean",
        description:
          "Custom equality for object items. Use when items are recreated on each render.",
      }),
    ],
    notes: [
      "Built on Base UI Autocomplete with list filtering, keyboard navigation, empty-state support, and a sliding highlight treatment.",
      "Radix UI does not ship a dedicated autocomplete primitive, so this install is Base UI only.",
      "Pass value and onValueChange for controlled input text. The popup opens while typing by default, not on focus.",
      "Object items require itemToStringValue. Use isItemEqualToValue if selection highlight behaves incorrectly.",
      "Use useAutocompleteFilter and useFilteredAutocompleteItems when you need custom locale or filter behavior.",
      "Popup and highlight motion honor prefers-reduced-motion automatically.",
    ],
  },
  {
    id: "autocomplete-input",
    title: "AutocompleteInput",
    summary:
      "Styled input shell with border, focus ring, optional clear control, and invalid-state styling via aria-invalid. The field control uses Base UI Input.",
    fields: [
      field({
        name: "label",
        type: "React.ReactNode",
        description:
          "Optional field label rendered above the input and linked with htmlFor.",
      }),
      field({
        name: "labelClassName",
        type: "string",
        description: "Optional class names merged onto the field label.",
      }),
      field({
        name: "placeholder",
        type: "string",
        description: "Shown when the input is empty.",
      }),
      field({
        name: "showClear",
        type: "boolean",
        defaultValue: "true",
        description: "Controls whether AutocompleteClear is rendered.",
      }),
      field({
        name: "showTrigger",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, renders a chevron trigger that toggles the suggestion panel.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Disables the input, clear button, and trigger.",
      }),
      field({
        name: "aria-invalid",
        type: "boolean | 'true' | 'false'",
        description:
          "When true, applies destructive border and ring styling to the input shell.",
      }),
    ],
  },
  {
    id: "autocomplete-clear",
    title: "AutocompleteClear",
    summary:
      "Clears the current input text. Rendered automatically when AutocompleteInput showClear is true.",
    fields: [
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Disables the clear button.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the clear button.",
      }),
    ],
  },
  {
    id: "autocomplete-trigger",
    title: "AutocompleteTrigger",
    summary:
      "Chevron button that toggles the suggestion panel. Includes aria-expanded and aria-label for screen readers.",
    fields: [
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Disables the trigger button.",
      }),
    ],
  },
  {
    id: "autocomplete-content",
    title: "AutocompleteContent",
    summary:
      "Portaled suggestion panel with a subtle fade-slide entrance and anchored width.",
    fields: [
      field({
        name: "side",
        type: '"top" | "right" | "bottom" | "left"',
        defaultValue: '"bottom"',
        description: "Preferred side for the popup.",
      }),
      field({
        name: "align",
        type: '"start" | "center" | "end"',
        defaultValue: '"start"',
        description: "Popup alignment relative to the input anchor.",
      }),
      field({
        name: "sideOffset",
        type: "number",
        defaultValue: "6",
        description: "Distance between the input and the popup.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the animated popup panel.",
      }),
    ],
    notes: [
      "The popup stays open when filtering returns no matches so AutocompleteEmpty can render.",
      "The panel width matches the input anchor and the list scrolls at the same max height as the combobox install.",
    ],
  },
  {
    id: "autocomplete-list",
    title: "AutocompleteList",
    summary: "Scrollable suggestion list rendered inside AutocompleteContent.",
    fields: [
      field({
        name: "children",
        type: "ReactNode | ((item, index) => ReactNode)",
        required: true,
        description:
          "Render explicit AutocompleteItem children or a render function when using the root items prop.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the default list spacing and scroll classes.",
      }),
    ],
  },
  {
    id: "autocomplete-item",
    title: "AutocompleteItem",
    summary:
      "Suggestion row with optional description and a spring-driven highlight fill.",
    fields: [
      field({
        name: "value",
        type: "Item",
        required: true,
        description: "Item value passed to Base UI for selection handling.",
      }),
      field({
        name: "description",
        type: "ReactNode",
        description: "Optional secondary line below the primary label.",
      }),
    ],
  },
  {
    id: "autocomplete-empty",
    title: "AutocompleteEmpty",
    summary:
      "Empty-state message shown when filtering returns no matches. Place inside AutocompleteContent after AutocompleteList.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        defaultValue: '"No results found."',
        description: "Message shown when the filtered list is empty.",
      }),
    ],
  },
  {
    id: "autocomplete-status",
    title: "AutocompleteStatus",
    summary:
      "Live status region for async loading or result counts. Keep mounted and update children instead of conditionally removing the component.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        description:
          "Status text announced politely to screen readers, such as Loading or No matches.",
      }),
    ],
  },
  {
    id: "autocomplete-group",
    title: "AutocompleteGroup",
    summary: "Groups related suggestions inside AutocompleteList.",
    fields: [
      field({
        name: "items",
        type: "readonly Item[]",
        description:
          "Items rendered inside this group when using grouped root items.",
      }),
    ],
  },
  {
    id: "autocomplete-label",
    title: "AutocompleteLabel",
    summary: "Section label rendered above a group of suggestions.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Group heading text.",
      }),
    ],
  },
  {
    id: "autocomplete-separator",
    title: "AutocompleteSeparator",
    summary: "Horizontal divider between suggestion groups or rows.",
    fields: [],
  },
  {
    id: "autocomplete-collection",
    title: "AutocompleteCollection",
    summary:
      "Renders the current filtered collection when not using AutocompleteList render props.",
    fields: [],
  },
  {
    id: "autocomplete-value",
    title: "AutocompleteValue",
    summary:
      "Reads the current input value from context for custom display layouts.",
    fields: [],
  },
  {
    id: "autocomplete-icon",
    title: "AutocompleteIcon",
    summary: "Leading icon slot rendered inside AutocompleteInput.",
    fields: [],
  },
  {
    id: "autocomplete-backdrop",
    title: "AutocompleteBackdrop",
    summary:
      "Dimmed overlay for modal autocomplete usage. Render as a sibling of AutocompleteContent when modal is true.",
    fields: [],
  },
  {
    id: "autocomplete-row",
    title: "AutocompleteRow",
    summary: "Row wrapper for multi-column or complex suggestion layouts.",
    fields: [],
  },
  registryItem("b-autocomplete.json", [
    "@base-ui/react",
    "motion",
    "lucide-react",
  ]),
];

const contextMenuApiDetails: DetailItem[] = [
  {
    id: "context-menu",
    title: "ContextMenu",
    summary:
      "Root provider that coordinates open state and the shared motion shell used by the trigger, content, and item primitives.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Compose ContextMenuTrigger, ContextMenuContent, and item primitives such as ContextMenuItem or ContextMenuSub inside the root.",
      }),
      field({
        name: "open",
        type: "boolean",
        description: "Controlled open state for the menu surface.",
      }),
      field({
        name: "defaultOpen",
        type: "boolean",
        defaultValue: "false",
        description: "Initial open state for uncontrolled usage.",
      }),
      field({
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description:
          "Called whenever the trigger, outside interaction, or Escape key changes the open state.",
      }),
    ],
    notes: [
      "Compose ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSub, and the other exported parts inside the root.",
      "The menu opens from right click or long press on the trigger surface. Shift+F10 and the Context Menu key also open it from keyboard focus.",
      "Pass open and onOpenChange on the root for controlled usage.",
      "Content is portaled and collision-aware. The Iconiq shell keeps the original panel spring, row entrance, and active highlight motion.",
    ],
  },
  {
    id: "context-menu-trigger",
    title: "ContextMenuTrigger",
    summary:
      "Interactive surface that opens the menu on right click, long press, or keyboard context-menu shortcuts.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Trigger content rendered inside the context-click target.",
      }),
      field({
        name: "asChild",
        type: "boolean",
        description:
          "Merges trigger behavior onto the single child element instead of rendering a wrapper element.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the trigger surface, including the focus ring and theme token scope.",
      }),
    ],
  },
  {
    id: "context-menu-content",
    title: "ContextMenuContent",
    summary:
      "Portaled menu panel that renders the composed item tree with the Iconiq border, shadow, and motion treatment.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Menu body content such as groups, items, separators, checkbox rows, and nested submenus.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the animated panel shell. Use width utilities such as w-48 when you want a fixed menu width.",
      }),
      field({
        name: "collisionPadding",
        type: "number",
        defaultValue: "8",
        description:
          "Viewport padding used while the underlying primitive resolves collision-aware placement.",
      }),
    ],
  },
  {
    id: "context-menu-item",
    title: "ContextMenuItem",
    summary:
      "Interactive menu row with the Iconiq active highlight, row entrance motion, and optional destructive styling.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Row content. Pair with ContextMenuShortcut when you want trailing keyboard hints.",
      }),
      field({
        name: "variant",
        type: '"default" | "destructive"',
        defaultValue: "default",
        description:
          "Switches the row into the destructive color treatment used for irreversible actions.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description: "Dims the row and blocks pointer and keyboard selection.",
      }),
      field({
        name: "inset",
        type: "boolean",
        description:
          "Adds extra start padding so the row aligns with checkbox and radio items.",
      }),
      field({
        name: "onSelect",
        type: "(event: Event) => void",
        description: "Called when the row is activated.",
      }),
    ],
  },
  {
    id: "context-menu-shortcut",
    title: "ContextMenuShortcut",
    summary:
      "Trailing helper text for keyboard hints. It stays muted until the parent row is focused.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Shortcut copy such as ⌘R or Del.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the trailing shortcut span.",
      }),
    ],
  },
  {
    id: "context-menu-sub",
    title: "ContextMenuSub",
    summary:
      "Nested submenu root. Pair ContextMenuSubTrigger with ContextMenuSubContent to build secondary menus such as More Tools.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Submenu trigger and content parts rendered inside the parent menu.",
      }),
    ],
  },
  {
    id: "context-menu-checkbox-item",
    title: "ContextMenuCheckboxItem",
    summary:
      "Toggle row with a trailing check indicator and the same Iconiq row motion treatment as ContextMenuItem.",
    fields: [
      field({
        name: "checked",
        type: "boolean",
        description: "Controls whether the row renders in the checked state.",
      }),
      field({
        name: "onCheckedChange",
        type: "(checked: boolean) => void",
        description:
          "Called when the row toggles between checked and unchecked.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description: "Dims the row and blocks pointer and keyboard selection.",
      }),
      field({
        name: "inset",
        type: "boolean",
        description: "Adds extra start padding to align with sibling rows.",
      }),
    ],
  },
  {
    id: "context-menu-radio-group",
    title: "ContextMenuRadioGroup",
    summary:
      "Single-select group for ContextMenuRadioItem rows. Use ContextMenuLabel above the options when you need a section heading.",
    fields: [
      field({
        name: "value",
        type: "string",
        description: "Controlled selected value for the radio group.",
      }),
      field({
        name: "onValueChange",
        type: "(value: string) => void",
        description: "Called when a radio row is selected.",
      }),
    ],
  },
  registryItem("b-context-menu.json", [
    "motion",
    "lucide-react",
    "@base-ui/react",
  ]),
];

const drawerApiDetails: DetailItem[] = [
  {
    id: "drawer",
    title: "Drawer",
    summary:
      "Vaul-backed drawer root that coordinates open state, drag gestures, overlay dismissal, focus management, and side-based placement for the compound parts.",
    fields: [
      field({
        name: "open",
        type: "boolean",
        description:
          "Optional controlled open state. Pair it with onOpenChange when parent state should own the drawer lifecycle.",
      }),
      field({
        name: "defaultOpen",
        type: "boolean",
        description:
          "Initial open state for uncontrolled usage. Vaul skips the first enter animation when the drawer is mounted open.",
      }),
      field({
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description:
          "Called whenever the drawer opens or closes from the trigger, overlay, Escape key, close part, or drag release.",
      }),
      field({
        name: "direction",
        type: '"left" | "right" | "top" | "bottom"',
        defaultValue: '"bottom"',
        description:
          "Chooses the drawer edge and matching Vaul slide direction. The content classes style each direction with the appropriate inset and rounded leading edge.",
      }),
      field({
        name: "modal",
        type: "boolean",
        defaultValue: "true",
        description:
          "Keeps focus and outside interaction modal while the drawer is open. Set false for non-modal command surfaces.",
      }),
      field({
        name: "dismissible",
        type: "boolean",
        defaultValue: "true",
        description:
          "Allows overlay click, Escape, and drag gestures to close the drawer. Controlled drawers can disable this when a flow must be completed explicitly.",
      }),
      field({
        name: "handleOnly",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, drag-to-close is limited to a Vaul Handle part instead of the full panel surface.",
      }),
      field({
        name: "snapPoints",
        type: "(number | string)[]",
        description:
          "Optional Vaul snap points for stepped drawer heights or widths. Values may be percentages or px strings.",
      }),
    ],
    notes: [
      "The root accepts the full Vaul Root prop surface, including drag callbacks, activeSnapPoint, closeThreshold, shouldScaleBackground, nested, and container.",
      "Direction defaults to bottom at the Vaul layer. Use the docs playground to preview top, left, and right placements.",
    ],
  },
  {
    id: "drawer-trigger",
    title: "DrawerTrigger",
    summary:
      "Opens the drawer from a button, link, or custom interactive target.",
    fields: [
      field({
        name: "asChild",
        type: "boolean",
        description:
          "Use when a local button or link should remain the visible trigger element.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Interactive content rendered by the trigger primitive.",
      }),
    ],
  },
  {
    id: "drawer-portal",
    title: "DrawerPortal",
    summary:
      "Portal wrapper for drawer overlay and panel content. DrawerContent composes it automatically in the common path.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Overlay and panel content rendered outside the page flow.",
      }),
    ],
    notes: [
      "DrawerPortal is kept as an exported part for API symmetry, while DrawerContent composes it automatically for the common overlay-plus-panel path.",
    ],
  },
  {
    id: "drawer-overlay",
    title: "DrawerOverlay",
    summary: "Full-screen overlay rendered behind the drawer panel.",
    fields: [
      field({
        name: "className",
        type: "string",
        description: "Merged with the default overlay tint and blur classes.",
      }),
    ],
  },
  {
    id: "drawer-content",
    title: "DrawerContent",
    summary:
      "Portals the overlay and animated panel, applies direction-aware layout classes, and supports an optional close button.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Drawer body content rendered inside the animated panel.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged with the direction-aware panel geometry and surface classes.",
      }),
      field({
        name: "size",
        type: '"sm" | "default" | "lg" | "full"',
        defaultValue: '"default"',
        description:
          "Controls panel width for left and right drawers and max height for top and bottom drawers.",
      }),
      field({
        name: "showCloseButton",
        type: "boolean",
        defaultValue: "false",
        description:
          "Renders an absolute close button in the panel corner. Useful for side drawers and quick dismissal.",
      }),
      field({
        name: "showOverlay",
        type: "boolean",
        defaultValue: "true",
        description:
          "Toggles the default overlay. Set false for non-modal surfaces or custom overlay composition.",
      }),
      field({
        name: "overlayClassName",
        type: "string",
        description: "Merged onto DrawerOverlay when showOverlay is true.",
      }),
    ],
    notes: [
      "DrawerBody marks only the scrollable middle section as non-draggable so text selection does not trigger drag-to-close.",
      "DrawerContent applies safe-area padding and max-height caps for mobile notches and home indicators.",
    ],
  },
  {
    id: "drawer-body",
    title: "DrawerBody",
    summary:
      "Scrollable middle section between header and footer with drag disabled for text selection.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Scrollable drawer content.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the default body scroll classes.",
      }),
    ],
  },
  {
    id: "drawer-actions",
    title: "DrawerAction / DrawerCancel",
    summary:
      "Styled footer buttons with squircle corners and optional closeOnClick control for async flows.",
    fields: [
      field({
        name: "variant",
        type: '"default" | "destructive"',
        description:
          "DrawerAction tone. DrawerCancel uses the muted secondary style.",
      }),
      field({
        name: "closeOnClick",
        type: "boolean",
        defaultValue: "true",
        description:
          "When false, the click handler runs without closing the drawer. Useful for async submit flows.",
      }),
      field({
        name: "asChild",
        type: "boolean",
        description: "Compose onto an existing button element.",
      }),
    ],
  },
  {
    id: "drawer-media",
    title: "DrawerMedia",
    summary:
      "Optional icon slot for headers, matching the dialog media treatment.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Icon or media rendered inside the circular slot.",
      }),
    ],
  },
  {
    id: "drawer-nested",
    title: "DrawerNested",
    summary:
      "Nested Vaul root for stacking a second drawer above an open drawer.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Nested drawer composition rendered above the parent drawer.",
      }),
    ],
  },
  {
    id: "drawer-close",
    title: "DrawerClose",
    summary: "Closes the drawer from a button or custom interactive target.",
    fields: [
      field({
        name: "asChild",
        type: "boolean",
        description:
          "Use asChild to turn an existing footer action into the close control.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Interactive content rendered by the close primitive.",
      }),
    ],
  },
  {
    id: "drawer-header",
    title: "DrawerHeader",
    summary: "Layout helper for the title area at the top of the drawer panel.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Header content such as DrawerTitle and DrawerDescription.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the default header spacing classes.",
      }),
    ],
  },
  {
    id: "drawer-footer",
    title: "DrawerFooter",
    summary:
      "Layout helper for actions or supporting context at the bottom of the drawer.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Footer actions or supporting context.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the default footer spacing classes.",
      }),
    ],
  },
  {
    id: "drawer-title",
    title: "DrawerTitle",
    summary:
      "Accessible heading part forwarded to Vaul's dialog title primitive.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Drawer heading content.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the default title typography classes.",
      }),
    ],
  },
  {
    id: "drawer-description",
    title: "DrawerDescription",
    summary:
      "Accessible helper text part forwarded to Vaul's dialog description primitive.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Supporting description copy beneath the drawer title.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the default description typography classes.",
      }),
    ],
    notes: [
      "DrawerTitle and DrawerDescription should be included inside DrawerHeader when the panel needs accessible labeling.",
    ],
  },
  {
    id: "drawer-motion-layout",
    title: "Motion and layout",
    summary:
      "The component leans on Vaul's drag-aware transform animation, then adds softer overlay timing, tuned animation duration, and direction-specific panel geometry.",
    fields: [
      field({
        name: "overlay",
        type: "built-in",
        description:
          "A fixed full-screen overlay fades in behind the drawer with a stronger black tint and backdrop blur support.",
      }),
      field({
        name: "content",
        type: "built-in",
        description:
          "The panel gets a fluid cubic-bezier open curve, a shorter close duration, GPU-friendly transform hints, and a slightly extended initial transform for a softer arrival.",
      }),
    ],
    notes: [
      "DrawerBody marks only the scrollable middle section as non-draggable so text selection does not trigger drag-to-close.",
      "Size variants control width for side drawers and safe-area-aware max height for top and bottom drawers.",
    ],
  },
  registryItem("drawer.json", ["vaul", "lucide-react"]),
];

const dropdownApiDetails: DetailItem[] = [
  {
    id: "dropdown",
    title: "Dropdown",
    summary:
      "Root provider that coordinates open state, selected value state, and the shared behavior used by the trigger, content, and item primitives.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Compose DropdownTrigger, DropdownContent, DropdownItem, and optional helpers like DropdownValue, DropdownSeparator, or DropdownSub inside the root.",
      }),
      field({
        name: "value",
        type: "string",
        description:
          "Controlled selected value for the select variant. Action mode usually leaves this unset.",
      }),
      field({
        name: "defaultValue",
        type: "string",
        description: "Initial selected value for uncontrolled select usage.",
      }),
      field({
        name: "onValueChange",
        type: "(value: string | undefined) => void",
        description: "Called when a select item updates the current value.",
      }),
      field({
        name: "open",
        type: "boolean",
        description: "Controlled open state for the menu surface.",
      }),
      field({
        name: "defaultOpen",
        type: "boolean",
        defaultValue: "false",
        description: "Initial open state for uncontrolled usage.",
      }),
      field({
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description:
          "Called whenever the trigger, outside click handling, or Escape key changes the open state.",
      }),
      field({
        name: "variant",
        type: '"select" | "action"',
        defaultValue: "select",
        description:
          "Use select when items should commit a persistent value with a checkmark, or action when items should behave like immediate commands. For form fields, prefer the dedicated r-select install.",
      }),
      field({
        name: "modal",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, Radix traps focus and blocks outside interaction while the menu is open.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description:
          "Disables the trigger and prevents opening the menu from the root.",
      }),
      field({
        name: "name",
        type: "string",
        description:
          "Optional form field name. In select mode, renders a hidden input that submits the current value.",
      }),
      field({
        name: "required",
        type: "boolean",
        description:
          "Marks the hidden select input as required when name is provided.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the outer relative wrapper around the trigger and content.",
      }),
    ],
    notes: [
      "Radix DropdownMenu.Root handles open state, focus restoration, outside interactions, and keyboard typeahead.",
      "The menu content is portaled and collision-aware. Escape and outside clicks close the menu.",
      "Shadcn-style aliases such as DropdownMenu and DropdownMenuItem are exported from the same file.",
    ],
  },
  {
    id: "dropdown-trigger",
    title: "DropdownTrigger",
    summary:
      "Interactive trigger button that opens and closes the menu. It works with plain children, DropdownValue, or custom trigger content like an avatar.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        description:
          "Trigger content. In select mode this usually includes DropdownValue, while action menus can pass custom content such as an avatar or label row.",
      }),
      field({
        name: "showChevron",
        type: "boolean",
        defaultValue: "true",
        description:
          "Hides the default chevron when you want a cleaner custom trigger, such as an avatar-only action menu.",
      }),
      field({
        name: "triggerShape",
        type: '"default" | "avatar"',
        defaultValue: "default",
        description:
          "Use avatar to skip squircle corner styling on circular image triggers.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the trigger button shell.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description:
          "Prevents opening and dims the trigger styling. Root disabled also applies when this prop is omitted.",
      }),
    ],
    notes: [
      "The trigger is always rendered as a motion button with a subtle press scale. Custom trigger visuals should be passed as children and styled with className.",
      "ArrowDown and ArrowUp on the trigger open the menu and move focus to the first or last enabled item.",
    ],
  },
  {
    id: "dropdown-value",
    title: "DropdownValue",
    summary:
      "Small helper for select mode that reads the current value from context and prints the matching item label or a placeholder.",
    fields: [
      field({
        name: "placeholder",
        type: "string",
        defaultValue: '"Select an option"',
        description:
          "Text shown when no matching selected value is currently registered.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the rendered span inside the trigger.",
      }),
    ],
    notes: [
      "DropdownValue is only useful in select mode. Action menus usually provide their own trigger content instead.",
    ],
  },
  {
    id: "dropdown-content",
    title: "DropdownContent",
    summary:
      "Animated menu surface that positions itself under the trigger and renders the item list for either variant.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Usually DropdownItem children, with optional DropdownSeparator nodes between groups.",
      }),
      field({
        name: "align",
        type: '"start" | "center" | "end"',
        defaultValue: "start",
        description: "Alignment relative to the trigger along the cross axis.",
      }),
      field({
        name: "side",
        type: '"top" | "right" | "bottom" | "left"',
        defaultValue: "bottom",
        description: "Preferred placement relative to the trigger.",
      }),
      field({
        name: "avoidCollisions",
        type: "boolean",
        defaultValue: "true",
        description:
          "When true, Radix flips or shifts the menu to stay inside the viewport.",
      }),
      field({
        name: "sideOffset",
        type: "number",
        defaultValue: "8",
        description: "Gap between the trigger and the dropdown surface.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the dropdown surface, which is useful for setting a custom width or changing shadows in docs/examples.",
      }),
    ],
    notes: [
      "The content is portaled, animates open/close with Iconiq motion, and constrains long menus with a Radix Scroll Area hover scrollbar.",
      'When you pass className="w-full", the surface maps to the trigger-width CSS variable so select triggers keep matching widths.',
      "The panel exposes id for aria-controls and uses listbox or menu role based on the root variant.",
    ],
  },
  {
    id: "dropdown-item",
    title: "DropdownItem",
    summary:
      "Single interactive row used by both variants. In select mode it can register a value, and in action mode it acts like a plain command item.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Row content. You can place icons inline before the label for action menus or richer item layouts.",
      }),
      field({
        name: "value",
        type: "string",
        description:
          "Selection key for select mode. When it matches the root value, the item renders the checkmark state.",
      }),
      field({
        name: "textValue",
        type: "string",
        description:
          "Optional explicit label used by DropdownValue and typeahead when your item children are not plain text.",
      }),
      field({
        name: "onClick",
        type: "(event: MouseEvent<HTMLDivElement>) => void",
        description:
          "Runs before the item closes the menu. Action menus typically use this for immediate commands like profile or logout.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description: "Prevents interaction and dims the row.",
      }),
    ],
    notes: [
      "Select items show a trailing checkmark and aria-selected when the item value matches the root value.",
      "Keyboard and pointer focus share the same animated row highlight.",
      "If you omit value in select mode, the item behaves like a plain closing action and will not update the current value.",
    ],
  },
  {
    id: "dropdown-checkbox-item",
    title: "DropdownCheckboxItem",
    summary:
      "Toggle row for multi-select action menus. Checked state is controlled with checked and onCheckedChange.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Row label and optional leading icon.",
      }),
      field({
        name: "checked",
        type: "boolean | 'indeterminate'",
        description: "Controlled checked state for the row.",
      }),
      field({
        name: "onCheckedChange",
        type: "(checked: boolean) => void",
        description: "Called when the row toggles checked state.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description: "Prevents interaction and dims the row.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the checkbox row shell.",
      }),
    ],
    notes: [
      "DropdownMenuCheckboxItem is exported as a shadcn-compatible alias.",
    ],
  },
  {
    id: "dropdown-radio-group",
    title: "DropdownRadioGroup",
    summary:
      "Groups radio rows that commit a single value inside action or select menus.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Usually DropdownRadioItem children.",
      }),
      field({
        name: "value",
        type: "string",
        description: "Controlled selected value for the radio group.",
      }),
      field({
        name: "onValueChange",
        type: "(value: string) => void",
        description: "Called when a radio item is chosen.",
      }),
    ],
    notes: [
      "DropdownRadioItem values also register with DropdownValue when variant is select.",
    ],
  },
  {
    id: "dropdown-radio-item",
    title: "DropdownRadioItem",
    summary: "Single radio row with a trailing dot indicator.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Row label and optional leading icon.",
      }),
      field({
        name: "value",
        type: "string",
        required: true,
        description: "Radio value committed when the row is chosen.",
      }),
      field({
        name: "textValue",
        type: "string",
        description:
          "Optional explicit label used by DropdownValue and typeahead.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description: "Prevents interaction and dims the row.",
      }),
    ],
    notes: [],
  },
  {
    id: "dropdown-sub",
    title: "DropdownSub",
    summary:
      "Nested submenu root. Compose DropdownSubTrigger and DropdownSubContent inside it.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "DropdownSubTrigger followed by DropdownSubContent.",
      }),
    ],
    notes: [
      "DropdownMenuSub, DropdownMenuSubTrigger, and DropdownMenuSubContent are exported as aliases.",
    ],
  },
  {
    id: "dropdown-shortcut",
    title: "DropdownShortcut",
    summary: "Muted trailing shortcut label helper for action menu rows.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Shortcut text such as ⌘K or Ctrl+S.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the shortcut span.",
      }),
    ],
    notes: [],
  },
  {
    id: "dropdown-group",
    title: "DropdownGroup",
    summary:
      "Optional wrapper for chunking larger menus into sections, with or without a visible label.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Usually one or more DropdownItem nodes. Add label when you want a visible heading, or omit it when you just want grouped spacing.",
      }),
      field({
        name: "label",
        type: "ReactNode",
        description:
          "Optional convenience heading rendered with DropdownLabel styling and linked to the group for assistive technologies.",
      }),
      field({
        name: "labelClassName",
        type: "string",
        description:
          "Merged onto the generated section heading when you want to tweak its spacing or tone.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the group wrapper. The base version adds light vertical spacing between grouped rows.",
      }),
    ],
    notes: [
      "Label is optional. Without it, the wrapper only provides spacing unless you also pass aria-label or aria-labelledby.",
      "If you provide label, the wrapper upgrades to role=group and wires aria-labelledby automatically.",
    ],
  },
  {
    id: "dropdown-label",
    title: "DropdownLabel",
    summary:
      "Standalone non-interactive heading helper for advanced content layouts or custom grouping patterns.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Short section text such as Product, Billing, or Workspace settings.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the rendered div when you want to adjust spacing, weight, or casing locally.",
      }),
    ],
    notes: [
      "Use this directly when you want a heading style without the convenience wrapper supplied by DropdownGroup.",
    ],
  },
  {
    id: "dropdown-separator",
    title: "DropdownSeparator",
    summary:
      "Simple divider for grouping related items inside the content surface.",
    fields: [
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the divider element when you want to adjust spacing or tone locally.",
      }),
    ],
    notes: [
      "The separator renders a one-pixel rule using the dropdown border token.",
    ],
  },
  registryItem("r-dropdown.json", [
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-scroll-area",
    "motion",
    "lucide-react",
  ]),
];

const fileUploadApiDetails: DetailItem[] = [
  {
    id: "file-upload",
    title: "FileUpload",
    summary:
      "Drag-and-drop uploader with paste support, validation, optional real upload hooks, controlled queue state, and accessible progress feedback.",
    fields: [
      field({
        name: "accept",
        type: "string",
        description:
          "Optional accept string passed to the hidden file input and enforced for dropped or pasted files, including MIME types like image/* and extensions like .pdf.",
      }),
      field({
        name: "multiple",
        type: "boolean",
        defaultValue: "true",
        description:
          "Allows selecting or dropping multiple files. When set to false, the next selection replaces the existing queue.",
      }),
      field({
        name: "maxFiles",
        type: "number",
        description:
          "Caps the queue length. New files are prepended, and anything beyond the limit is rejected with inline feedback.",
      }),
      field({
        name: "maxSize",
        type: "number",
        description:
          "Maximum file size in bytes. Files above the limit are rejected with inline feedback.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description:
          "Disables click, drag, paste, keyboard activation, remove, clear-all, and the hidden file input.",
      }),
      field({
        name: "required",
        type: "boolean",
        defaultValue: "false",
        description:
          "Forwards required validation to the hidden file input when the queue is empty.",
      }),
      field({
        name: "invalid",
        type: "boolean",
        defaultValue: "false",
        description:
          "Marks the drop zone with invalid styling for external validation states.",
      }),
      field({
        name: "preventDuplicates",
        type: "boolean",
        defaultValue: "false",
        description:
          "Rejects files that match an existing queue item by name, size, and lastModified.",
      }),
      field({
        name: "simulateUpload",
        type: "boolean",
        description:
          "Controls built-in progress simulation. Defaults to true when onUpload is not provided, and false when onUpload is set.",
      }),
      field({
        name: "showClearAll",
        type: "boolean",
        defaultValue: "true",
        description: "Shows a clear-all action when the queue has files.",
      }),
      field({
        name: "name",
        type: "string",
        description:
          "Passes a form field name through to the hidden file input. The queue stays synced to the input for native form submission.",
      }),
      field({
        name: "id",
        type: "string",
        description:
          "Root id used for the hidden file input and internal aria-describedby wiring.",
      }),
      field({
        name: "ariaLabel",
        type: "string",
        defaultValue: "Upload files",
        description: "Accessible label for the keyboard-focusable drop zone.",
      }),
      field({
        name: "ariaDescribedBy",
        type: "string",
        description:
          "Additional ids merged into the drop zone aria-describedby list.",
      }),
      field({
        name: "description",
        type: "string",
        description: "Optional helper text rendered above the drop zone.",
      }),
      field({
        name: "dropzoneTitle",
        type: "string",
        description: "Custom primary drop zone label.",
      }),
      field({
        name: "dropzoneDescription",
        type: "string",
        description:
          "Custom secondary drop zone hint. When omitted, a hint is generated from accept, maxFiles, and maxSize.",
      }),
      field({
        name: "libraryLabel",
        type: "string",
        defaultValue: "Library",
        description: "Heading label for the queued file list.",
      }),
      field({
        name: "browseLabel",
        type: "string",
        defaultValue: "Browse",
        description: "Label for the browse affordance in the drop zone.",
      }),
      field({
        name: "clearAllLabel",
        type: "string",
        defaultValue: "Clear all",
        description: "Label for the clear-all action.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Adds classes to the outer wrapper without changing the component internals.",
      }),
      field({
        name: "defaultValue",
        type: "File[]",
        description: "Initial queue files for uncontrolled usage.",
      }),
      field({
        name: "value",
        type: "FileUploadItem[]",
        description:
          "Controlled queue state including per-file progress and status.",
      }),
      field({
        name: "validateFile",
        type: "(file: File) => boolean | string",
        description:
          "Custom per-file validator. Return true to accept, false to reject, or a string error message.",
      }),
      field({
        name: "onFilesChange",
        type: "(files: File[]) => void",
        description:
          "Called when files are added or removed from the queue. It does not fire on every progress tick.",
      }),
      field({
        name: "onValueChange",
        type: "(items: FileUploadItem[]) => void",
        description:
          "Called when the queue changes, including status and progress updates in controlled mode.",
      }),
      field({
        name: "onFileRemove",
        type: "(file: File, nextFiles: File[]) => void",
        description:
          "Called after a queued file is removed. The second argument contains the remaining files in queue order.",
      }),
      field({
        name: "onReject",
        type: "(files: File[], reason: FileUploadRejectReason, message: string) => void",
        description:
          "Called when one or more files fail accept, size, duplicate, max-files, validation, or disabled checks.",
      }),
      field({
        name: "onUpload",
        type: "(file: File, context: { setProgress: (progress: number) => void }) => Promise<void>",
        description:
          "Optional real upload handler. When provided, built-in progress simulation is disabled unless simulateUpload is explicitly set to true.",
      }),
      field({
        name: "onUploadComplete",
        type: "(files: File[]) => void",
        description:
          "Called once every item in the current queue reaches done status.",
      }),
    ],
    notes: [
      "The drop zone is keyboard accessible and opens the hidden file input on Enter or Space.",
      "Both drag-and-drop, click-to-browse, and paste flow through the same queue logic, so accept filtering and limits stay consistent.",
      "The hidden file input stays synced to the current queue through the DataTransfer API for native form submission.",
      "Motion for drop, list, and progress visuals honors prefers-reduced-motion automatically.",
    ],
  },
  {
    id: "file-upload-behavior",
    title: "Built-in behavior",
    summary:
      "The component owns preview lifecycle, progress visuals, retry, and inline rejection messaging unless you take over with onUpload or controlled value.",
    fields: [
      field({
        name: "progress state",
        type: "built-in",
        description:
          "Each added file starts in uploading state. Without onUpload, a simulated progress loop runs until done. With onUpload, progress follows setProgress from your handler.",
      }),
      field({
        name: "error + retry",
        type: "built-in",
        description:
          "Failed onUpload calls move a file to error status and expose a retry action that reruns the upload handler or restarts simulation.",
      }),
      field({
        name: "image and video previews",
        type: "built-in",
        description:
          "Image and video files receive object URL previews. Upload progress renders as an overlay on thumbnails and as a ring for other file types.",
      }),
      field({
        name: "remove + clear all",
        type: "built-in",
        description:
          "Each queued file can be removed individually. Clear all empties the queue and revokes preview URLs immediately.",
      }),
    ],
    notes: [
      "Preview object URLs are cleaned up on remove, clear-all, trim, and unmount.",
      "Each queue item id is built from the file name, size, lastModified, and a random suffix to reduce collisions between repeated uploads.",
      "FileUploadRejectReason values: accept, max-size, max-files, duplicate, validation, disabled.",
    ],
  },
  registryItem("file-upload.json", ["motion", "lucide-react"]),
];

const inputApiDetails: DetailItem[] = [
  {
    id: "input",
    title: "Input",
    summary: "Input with a spring-animated caret.",
    fields: [
      field({
        name: "value",
        type: "string",
        description:
          "Controlled input value. Pair with `onValueChange` or `onChange` when the parent owns the text.",
      }),
      field({
        name: "defaultValue",
        type: "string",
        description: "Initial value for uncontrolled usage.",
      }),
      field({
        name: "onValueChange",
        type: "(value: string, eventDetails: InputChangeEventDetails) => void",
        description:
          "Base UI change handler with the next string value and event metadata. Preferred for controlled forms.",
      }),
      field({
        name: "onChange",
        type: "React.ChangeEventHandler<HTMLInputElement>",
        description:
          "Native change handler fired after typing, paste, cut, or autofill.",
      }),
      field({
        name: "type",
        type: "React.HTMLInputTypeAttribute",
        defaultValue: "text",
        description:
          "Native input type. Smooth caret is enabled for text-like types only (`text`, `search`, `url`, `email`, `password`, `tel`).",
      }),
      field({
        name: "label",
        type: "React.ReactNode",
        description:
          "Optional field label rendered above the control with an associated `htmlFor` id.",
      }),
      field({
        name: "labelClassName",
        type: "string",
        description: "Classes merged onto the optional label element.",
      }),
      field({
        name: "description",
        type: "React.ReactNode",
        description:
          "Optional helper text rendered below the input shell and linked with `aria-describedby`.",
      }),
      field({
        name: "descriptionClassName",
        type: "string",
        description: "Classes merged onto the description element.",
      }),
      field({
        name: "errorMessage",
        type: "React.ReactNode",
        description:
          "Validation message rendered below the field. Also sets `aria-invalid` and links through `aria-describedby`.",
      }),
      field({
        name: "errorMessageClassName",
        type: "string",
        description: "Classes merged onto the error message element.",
      }),
      field({
        name: "invalid",
        type: "boolean",
        defaultValue: "false",
        description:
          "Applies destructive shell styling and forwards `aria-invalid` to the native input.",
      }),
      field({
        name: "required",
        type: "boolean",
        defaultValue: "false",
        description:
          "Forwards native required validation and appends a visual asterisk to the label.",
      }),
      field({
        name: "size",
        type: '"sm" | "default"',
        defaultValue: "default",
        description: "Controls the input shell height.",
      }),
      field({
        name: "shellClassName",
        type: "string",
        description: "Classes merged onto the bordered input shell.",
      }),
      field({
        name: "wrapperClassName",
        type: "string",
        description:
          "Classes merged onto the outer field wrapper when `label`, `description`, or `errorMessage` is set. Otherwise merged onto the shell.",
      }),
      field({
        name: "startAdornment",
        type: "React.ReactNode",
        description: "Optional leading slot rendered inside the input shell.",
      }),
      field({
        name: "endAdornment",
        type: "React.ReactNode",
        description:
          "Optional trailing slot rendered inside the input shell after built-in actions.",
      }),
      field({
        name: "children",
        type: "React.ReactNode",
        description:
          "Additional trailing content rendered inside the input shell after adornments and actions.",
      }),
      field({
        name: "showClear",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, renders a clear button while the field has a value and is not disabled or read-only.",
      }),
      field({
        name: "showPasswordToggle",
        type: "boolean",
        description:
          'When `type="password"`, shows a visibility toggle by default. Pass `false` to hide it.',
      }),
      field({
        name: "placeholder",
        type: "string",
        description: "Placeholder shown when the field is empty.",
      }),
      field({
        name: "fontSize",
        type: "number",
        description:
          "Optional pixel font size override for the inner field. Defaults to the standard `text-sm` input sizing.",
      }),
      field({
        name: "spring",
        type: "{ stiffness?: number; damping?: number; mass?: number }",
        description:
          "Spring config for caret movement. Defaults to stiffness 500, damping 30, mass 0.5.",
      }),
      field({
        name: "id",
        type: "string",
        description:
          "Optional id forwarded to the input. A generated id is used when omitted so labels stay associated.",
      }),
      field({
        name: "className",
        type: "string | ((state: InputState) => string)",
        description:
          "Classes merged onto the native input element. Base UI also supports a state callback.",
      }),
      field({
        name: "style",
        type: "React.CSSProperties | ((state: InputState) => React.CSSProperties)",
        description:
          "Inline styles merged onto the native input element. Base UI also supports a state callback.",
      }),
      field({
        name: "render",
        type: "React.ReactElement | ((props: React.ComponentProps<'input'>) => React.ReactElement)",
        description:
          "Base UI render override for the native input element. Custom renders disable the smooth caret.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Disables interaction on the native input.",
      }),
      field({
        name: "readOnly",
        type: "boolean",
        defaultValue: "false",
        description:
          "Keeps the field focusable while applying muted shell styling and blocking edits.",
      }),
    ],
    notes: [
      "Built on `@base-ui/react/input` and works with Base UI `Field` for labels, descriptions, and validation state.",
      "Uses a hidden measurement span to position the caret across fonts, password bullets, RTL layout, and horizontal scroll.",
      "Respects `prefers-reduced-motion` by snapping the caret spring when motion is reduced.",
      "Clicking the input shell focuses the native control unless the click lands on a trailing action.",
      "Standard input attributes such as `autoComplete`, `name`, `required`, `aria-*`, and `data-*` are forwarded to the native element.",
    ],
  },
  registryItem("input.json", ["@base-ui/react/input", "motion"]),
];

const inputOtpApiDetails: DetailItem[] = [
  {
    id: "otp",
    title: "OTP",
    summary:
      "Root wrapper around Base UI OTP Field with optional label, description, error message, size, and invalid styling for complete form-field semantics.",
    fields: [
      field({
        name: "length",
        type: "number",
        required: true,
        description:
          "Number of OTP characters. Required so Base UI can clamp values, detect completion, and manage focus order.",
      }),
      field({
        name: "value",
        type: "string",
        description:
          "Controlled OTP string. Pair with `onValueChange` when the parent owns the code.",
      }),
      field({
        name: "defaultValue",
        type: "string",
        description: "Initial value for uncontrolled usage.",
      }),
      field({
        name: "onValueChange",
        type: "(value: string, eventDetails) => void",
        description:
          "Called whenever the OTP value changes from typing, paste, backspace, or keyboard navigation.",
      }),
      field({
        name: "onValueComplete",
        type: "(value: string, eventDetails) => void",
        description:
          "Called when all slots are filled, including when a complete code is pasted.",
      }),
      field({
        name: "onValueInvalid",
        type: "(value: string, eventDetails) => void",
        description:
          "Called when entered text contains characters rejected by validation or normalization.",
      }),
      field({
        name: "validationType",
        type: '"numeric" | "alpha" | "alphanumeric" | "none"',
        defaultValue: '"numeric"',
        description:
          "Built-in validation applied before values are stored. Use `alphanumeric` for backup or recovery codes.",
      }),
      field({
        name: "normalizeValue",
        type: "(value: string) => string",
        description:
          "Normalizes accepted values before state updates, such as uppercasing recovery codes.",
      }),
      field({
        name: "mask",
        type: "boolean",
        defaultValue: "false",
        description:
          "Obscures entered characters in the animated slot display and native inputs.",
      }),
      field({
        name: "autoSubmit",
        type: "boolean",
        defaultValue: "false",
        description:
          "Submits the owning form automatically when the OTP becomes complete.",
      }),
      field({
        name: "autoComplete",
        type: "string",
        defaultValue: '"one-time-code"',
        description:
          "Autocomplete hint applied to the first slot and hidden validation input for SMS autofill.",
      }),
      field({
        name: "inputMode",
        type: "string",
        description:
          "Virtual keyboard hint applied to slot inputs. Override when `validationType` defaults are not ideal.",
      }),
      field({
        name: "name",
        type: "string",
        description: "Identifies the field when a form is submitted.",
      }),
      field({
        name: "form",
        type: "string",
        description:
          "Associates the hidden validation input with a form elsewhere in the document.",
      }),
      field({
        name: "id",
        type: "string",
        description:
          "Applied to the first input. Subsequent inputs derive ids from it. Used by `label` and `htmlFor`.",
      }),
      field({
        name: "label",
        type: "ReactNode",
        description:
          "Visible field label rendered above the OTP group with `htmlFor` wired to the first slot.",
      }),
      field({
        name: "description",
        type: "ReactNode",
        description:
          "Supporting text below the field, linked through `aria-describedby`.",
      }),
      field({
        name: "errorMessage",
        type: "ReactNode",
        description:
          "Error text below the field. Also sets invalid styling when present.",
      }),
      field({
        name: "invalid",
        type: "boolean",
        defaultValue: "false",
        description:
          "Marks the field invalid for `aria-invalid` and destructive slot borders.",
      }),
      field({
        name: "required",
        type: "boolean",
        defaultValue: "false",
        description:
          "Whether the user must enter a value before submitting a form.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Disables interaction across every slot.",
      }),
      field({
        name: "readOnly",
        type: "boolean",
        defaultValue: "false",
        description: "Prevents editing while keeping the value visible.",
      }),
      field({
        name: "size",
        type: '"default" | "sm"',
        defaultValue: '"default"',
        description: "Slot dimensions and typography scale.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Classes merged onto the root flex container.",
      }),
      field({
        name: "wrapperClassName",
        type: "string",
        description:
          "Classes merged onto the outer field wrapper when label or help text is present.",
      }),
      field({
        name: "containerClassName",
        type: "string",
        description:
          "Legacy alias merged onto the root container alongside `className`.",
      }),
    ],
    notes: [
      "Built on `OTPFieldPreview` from `@base-ui/react/otp-field`.",
      "Prefer `OTPSlots` so slot count always matches `length`, or render one `OTPSlot` per character manually.",
      "Scoped theme tokens ship with the component so registry installs look correct without extra theme setup.",
      "Motion respects `prefers-reduced-motion` by snapping borders, characters, and caret animations.",
      "Pair `label`, `description`, and `errorMessage` for the same form-field pattern used by `Input`.",
    ],
  },
  {
    id: "otp-slots",
    title: "OTPSlots",
    summary:
      "Convenience layout that renders the correct number of slots from the parent `OTP` length, with optional separators and placeholder hints.",
    fields: [
      field({
        name: "separatorAfter",
        type: "number | number[]",
        description:
          "Inserts `OTPSeparator` before each listed zero-based index, such as `3` for 3-3 or `[3, 6]` for 3-3-3 codes.",
      }),
      field({
        name: "placeholder",
        type: "string",
        description:
          "Hint shown in empty slots until the active slot receives focus.",
      }),
      field({
        name: "slotClassName",
        type: "string",
        description: "Classes forwarded to every rendered `OTPSlot`.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Classes merged onto the internal `OTPGroup` wrapper.",
      }),
    ],
    notes: [
      "Must be rendered inside `OTP` so it can read the configured `length`.",
      "Adds `aria-label` to every slot after the first one for screen reader context.",
    ],
  },
  {
    id: "otp-slot",
    title: "OTPSlot",
    summary:
      "Animated character cell with spring focus ring, pop-in digit motion, masked bullets, and a pulsing caret on the active empty slot.",
    fields: [
      field({
        name: "className",
        type: "string",
        description: "Classes merged onto the animated slot surface.",
      }),
      field({
        name: "placeholder",
        type: "string",
        description: "Per-slot placeholder hint when composing slots manually.",
      }),
      field({
        name: "aria-label",
        type: "string",
        description:
          "Accessible label for slots after the first one. The first slot inherits the field label from `OTP` or a surrounding `<label>`.",
      }),
    ],
    notes: [
      "The real input is visually hidden but remains focusable for typing, paste, and mobile one-time-code autofill.",
      "Slot order is determined by render order; the legacy `index` prop is accepted but ignored.",
      "Destructive borders apply when `OTP` is invalid or when Base UI `Field` reports `data-invalid`.",
    ],
  },
  {
    id: "otp-group",
    title: "OTPGroup",
    summary:
      "Optional layout wrapper that groups slots with consistent spacing when you need multiple visual clusters.",
    fields: [
      field({
        name: "className",
        type: "string",
        description: "Classes merged onto the group flex container.",
      }),
    ],
  },
  {
    id: "otp-separator",
    title: "OTPSeparator",
    summary:
      "Screen-reader-accessible separator between OTP groups, rendered with the dotted divider used in the Iconiq preview.",
    fields: [
      field({
        name: "className",
        type: "string",
        description: "Classes merged onto the separator element.",
      }),
      field({
        name: "orientation",
        type: '"horizontal" | "vertical"',
        defaultValue: '"horizontal"',
        description: "Separator orientation passed through to Base UI.",
      }),
    ],
  },
  registryItem("input-otp.json", ["@base-ui/react", "motion"]),
];

const promptBoxApiDetails: DetailItem[] = [
  {
    id: "prompt-input",
    title: "PromptInput",
    summary:
      "Expandable prompt surface that grows from a compact pill into a textarea with model controls, attachment action, and send or voice affordances.",
    fields: [
      field({
        name: "onSubmit",
        type: "(value: string) => void",
        description:
          "Called with the trimmed prompt when the user presses Enter without Shift or clicks the send button.",
      }),
      field({
        name: "placeholder",
        type: "string",
        description:
          "Placeholder copy for the collapsed and expanded prompt field.",
      }),
      field({
        name: "menuActions",
        type: "PromptMenuAction[]",
        description:
          "Optional dropdown actions rendered above setting groups. Each action has `label`, optional `icon`, and `onSelect`.",
      }),
      field({
        name: "plusMenuItems",
        type: "PromptPlusMenuItem[]",
        description:
          "Items for the plus-button add menu. Actions use `onSelect` with optional `shortcut`. Submenus pass `options` and `onOptionSelect`.",
      }),
      field({
        name: "settingGroups",
        type: "PromptSettingGroup[]",
        description:
          'Grouped settings for the footer menu. Use `display: "featured"` for a selected summary row, `display: "submenu"` for a value row with flyout, and `moreMenuLabel` for an extra picker row (e.g. More models). Options support optional `description` text.',
      }),
      field({
        name: "settings",
        type: "Record<string, string>",
        description:
          "Controlled map of selected values keyed by setting group id.",
      }),
      field({
        name: "defaultSettings",
        type: "Record<string, string>",
        description:
          "Initial selected values for uncontrolled usage, keyed by setting group id.",
      }),
      field({
        name: "onSettingsChange",
        type: "(settings: Record<string, string>) => void",
        description:
          "Called when the user picks a new option in any settings group.",
      }),
    ],
    notes: [
      "Built on Base UI Input — collapsed state uses a read-only field, expanded state renders a textarea through the `render` prop.",
      "Click the collapsed field to expand and focus the prompt input.",
      "Press Enter to submit when the field has content; Shift+Enter inserts a newline.",
      "The expanded surface starts compact and grows with your prompt up to 300px, then scrolls inside the textarea.",
      "Press Escape or blur away with an empty draft to collapse back to the compact pill.",
      "The settings menu shows optional `menuActions`, then featured model rows, submenu rows with current values, and optional more-menu flyouts separated by dividers.",
      "The plus button opens an optional add menu when `plusMenuItems` is provided. Items support icons, keyboard shortcuts, and nested submenus.",
      "The footer reveals the settings popover and plus add menu while expanded.",
      "The trailing action button shows a microphone icon when empty and an arrow icon once text is entered.",
    ],
  },
  registryItem("prompt-box.json", ["@base-ui/react", "motion", "lucide-react"]),
];

const setupChecklistApiDetails: DetailItem[] = [
  {
    id: "setup-checklist",
    title: "SetupChecklist",
    summary:
      "Compound root that owns completion state and shares it through context with every checklist part. Renders the outer wrapper around the card and progress pill.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Composition surface. Place SetupChecklistCard with the header and list inside, and SetupChecklistProgress after the card.",
      }),
      field({
        name: "completedIds",
        type: "string[]",
        description:
          "Controlled list of completed item ids when the parent owns checklist state.",
      }),
      field({
        name: "defaultCompletedIds",
        type: "string[]",
        description: "Initial completed item ids for uncontrolled usage.",
      }),
      field({
        name: "onCompletedChange",
        type: "(completedIds: string[]) => void",
        description:
          "Called with the next completed id list whenever a row is toggled.",
      }),
      field({
        name: "onItemToggle",
        type: "(id: string, completed: boolean) => void",
        description:
          "Called with the toggled item id and its new completion state.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Extra classes for the outer wrapper.",
      }),
    ],
    notes: [
      "Progress is derived from the SetupChecklistItem elements composed under the root, so the pill always reflects the rendered rows.",
      "All entrance, badge, and press motion collapses to simple fades when the user prefers reduced motion.",
    ],
  },
  {
    id: "setup-checklist-structure",
    title: "SetupChecklistCard, Header, Title, Description, List, Action",
    summary:
      "Structural parts that compose the card shell. Card animates in with a spring, Header wraps the Title heading and muted Description copy, List staggers its items on mount, and Action is a footer slot for your own CTA such as a submit button. Each accepts `children` and an optional `className`.",
    notes: [
      "SetupChecklistCard renders the bordered card surface with the entrance spring.",
      "SetupChecklistList renders a ul and staggers each SetupChecklistItem in with a soft rise.",
      "SetupChecklistAction places your own button under the list — pair it with completedIds or onCompletedChange in the parent to enable submit when everything is done.",
      "Because the copy is composed as children, the title, description, and progress label are fully yours — nothing is hardcoded in the component.",
    ],
  },
  {
    id: "setup-checklist-item",
    title: "SetupChecklistItem",
    summary:
      "One toggleable task row with an icon tile, title, and description. Registers itself with the root so the progress fraction tracks mounted items.",
    fields: [
      field({
        name: "id",
        type: "string",
        required: true,
        description:
          "Stable id used in completedIds, defaultCompletedIds, and the toggle callbacks.",
      }),
      field({
        name: "title",
        type: "ReactNode",
        required: true,
        description: "Row heading.",
      }),
      field({
        name: "description",
        type: "ReactNode",
        description: "Muted supporting copy under the title.",
      }),
      field({
        name: "icon",
        type: "ReactNode",
        description: "Leading icon rendered in a bordered tile.",
      }),
      field({
        name: "onClick",
        type: "(id: string) => void",
        description:
          "Called on row click alongside the completion toggle, e.g. to navigate to the task.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Extra classes for the row button.",
      }),
    ],
    notes: [
      "Click a row to toggle completion — the green badge pops in with a spring and the checkmark draws itself in.",
      "Completed rows swap to a muted fill with a quiet crossfade and dimmed title.",
    ],
  },
  {
    id: "setup-checklist-progress",
    title: "SetupChecklistProgress",
    summary:
      "Floating pill that reads the completion fraction from context and renders your label with an animated percentage and pie wedge.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        description:
          "Label rendered before the percentage, e.g. Onboarding Progress. Omit to show the percentage alone.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Extra classes for the pill wrapper row.",
      }),
    ],
    notes: [
      "The percentage and pie wedge are driven by the same spring, so both settle together.",
    ],
  },
  registryItem("setup-checklist.json", ["motion", "lucide-react"]),
];

const teamInvitationApiDetails: DetailItem[] = [
  {
    id: "team-invitation",
    title: "TeamInvitation",
    summary:
      "Compound root that owns the active variant plus working member, pending-invite, and email state, and shares it through context with every part. Renders the outer wrapper around the card.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Composition surface. Place TeamInvitationCard with the header, tabs, and panels inside.",
      }),
      field({
        name: "variant",
        type: "string",
        description:
          "Controlled active variant when the parent owns which panel is shown. Matches TeamInvitationTab and TeamInvitationPanel values.",
      }),
      field({
        name: "defaultVariant",
        type: "string",
        description: "Initial variant for uncontrolled usage.",
      }),
      field({
        name: "onVariantChange",
        type: "(variant: string) => void",
        description: "Called when a variant tab is selected.",
      }),
      field({
        name: "members",
        type: "TeamMember[]",
        description:
          "Seed member list ({ id, name, email, role, avatar? }). The root keeps a working copy so role changes and removals animate locally.",
      }),
      field({
        name: "pendingInvites",
        type: "PendingInvite[]",
        description:
          "Seed pending invite list ({ id, email, sentAt? }). Invites submitted from TeamInvitationInviteField are appended here.",
      }),
      field({
        name: "roles",
        type: "string[]",
        description:
          "Assignable roles shown in role dropdowns and as TeamInvitationRoleGroups sections.",
      }),
      field({
        name: "onInvite",
        type: "(email: string) => void",
        description:
          "Called with the trimmed email when the invite button is pressed or Enter is hit in the field.",
      }),
      field({
        name: "onRoleChange",
        type: "(id: string, role: string) => void",
        description: "Called when a member is assigned a new role.",
      }),
      field({
        name: "onRemove",
        type: "(id: string) => void",
        description: "Called when a member is removed.",
      }),
      field({
        name: "onResend",
        type: "(id: string) => void",
        description: "Called when a pending invite's resend button is pressed.",
      }),
      field({
        name: "onCancelInvite",
        type: "(id: string) => void",
        description: "Called when a pending invite is cancelled.",
      }),
      field({
        name: "onClose",
        type: "() => void",
        description:
          "Renders the header close button and is called when it is pressed. Omit to hide the button.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Extra classes for the outer wrapper.",
      }),
    ],
    notes: [
      "Nothing is hardcoded: variants, tab labels, icons, section labels, and empty-state copy are all composed as children or props.",
      "All entrance, morph, and press motion collapses to simple fades when the user prefers reduced motion.",
    ],
  },
  {
    id: "team-invitation-structure",
    title: "TeamInvitationCard, Header, Title, Description, SectionLabel",
    summary:
      "Structural parts that compose the card shell. Card animates in with a spring and morphs its height between variants, Header wraps an optional icon tile, your Title and Description, and the close button when onClose is set on the root. Each accepts `children` and an optional `className`.",
    notes: [
      "TeamInvitationCard renders the bordered card surface with the entrance spring and fluid height morph.",
      "TeamInvitationHeader takes an optional `icon` rendered in a bordered tile before your heading copy.",
      "TeamInvitationSectionLabel is the shared heading used by the section parts — reuse it for your own panel content.",
    ],
  },
  {
    id: "team-invitation-tabs",
    title: "TeamInvitationTabs, TeamInvitationTab",
    summary:
      "Icon-bar style variant switcher. Tabs renders the row under a divider; each Tab is an icon pill that stretches open on a spring to reveal its label when its value matches the active variant.",
    fields: [
      field({
        name: "value",
        type: "string",
        required: true,
        description:
          "Variant id. Selecting the tab reveals the TeamInvitationPanel with the same value.",
      }),
      field({
        name: "icon",
        type: "ReactNode",
        description: "Icon shown while the tab is collapsed and expanded.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Label revealed while the tab is active.",
      }),
    ],
    notes: [
      "The active pill expands and its neighbors slide aside via Motion layout springs, so the row always fits without truncation.",
    ],
  },
  {
    id: "team-invitation-panels",
    title: "TeamInvitationPanels, TeamInvitationPanel",
    summary:
      "Panels walks its children, mounts only the panel whose value matches the active variant, and crossfades between them through a soft blur. Panel is the animated wrapper for one variant's content.",
    fields: [
      field({
        name: "value",
        type: "string",
        required: true,
        description:
          "Variant id paired with the TeamInvitationTab of the same value.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Panel content — section parts below or any custom markup.",
      }),
    ],
  },
  {
    id: "team-invitation-sections",
    title: "InviteField, MemberList, RoleGroups, PendingList",
    summary:
      'Prebuilt sections that read state from the root: TeamInvitationInviteField renders the email input and invite button, TeamInvitationMemberList renders member rows with a role dropdown (action="role"), a role badge with remove (action="remove"), or no control (action="none"), TeamInvitationRoleGroups groups members under one heading per role, and TeamInvitationPendingList renders pending invites with resend and cancel.',
    fields: [
      field({
        name: "label",
        type: "ReactNode",
        description:
          "Section heading rendered with TeamInvitationSectionLabel. On TeamInvitationInviteField this sits above the field row.",
      }),
      field({
        name: "buttonLabel",
        type: "ReactNode",
        required: true,
        description: "Invite button copy on TeamInvitationInviteField.",
      }),
      field({
        name: "placeholder",
        type: "string",
        description: "Input placeholder on TeamInvitationInviteField.",
      }),
      field({
        name: "action",
        type: '"role" | "remove" | "none"',
        description:
          "Trailing control per row on TeamInvitationMemberList. Defaults to role.",
      }),
      field({
        name: "emptyMessage",
        type: "ReactNode",
        description:
          "Dashed empty-state row shown when a list or role group has no entries. Omit to render nothing.",
      }),
    ],
    notes: [
      "Member rows carry a layoutId, so changing a role in TeamInvitationRoleGroups flies the row between groups instead of remounting it.",
      "Avatars load from the given URL and fall back to initials in a bordered tile when the image is missing or fails to load.",
    ],
  },
  registryItem("team-invitation.json", ["motion", "lucide-react"]),
];

const logosCarouselApiDetails: DetailItem[] = [
  {
    id: "logos-carousel",
    title: "LogosCarousel",
    summary:
      "Root container that distributes logo children across columns and cycles through them with a staggered wave animation.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Logo elements to cycle through. Each child is rendered as a single logo slot.",
      }),
      field({
        name: "columnCount",
        type: "number",
        defaultValue: "4",
        description:
          "Number of columns to spread logos across. Capped at the total number of logos.",
      }),
      field({
        name: "direction",
        type: '"ltr" | "rtl"',
        defaultValue: '"ltr"',
        description:
          "Direction the ripple wave sweeps across columns: left-to-right or right-to-left.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Extra classes applied to the grid wrapper.",
      }),
    ],
    notes: [
      "Animation is paused when the carousel scrolls out of view or the page loses focus.",
      "All motion collapses to an instant swap under reduced motion preferences.",
    ],
  },
];

const testimonialsApiDetails: DetailItem[] = [
  {
    id: "testimonials",
    title: "Testimonials",
    summary:
      "Compound root that renders the quotes as one flowing paragraph and owns which quote is highlighted. Hovering or focusing a quote dims and blurs every other quote through context.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Composition surface. Place one Testimonial per quote — the root indexes them in order to alternate tones and track the highlight.",
      }),
      field({
        name: "blur",
        type: "number",
        defaultValue: "4",
        description:
          "Blur radius in px applied to the non-highlighted quotes while one is active.",
      }),
      field({
        name: "dimOpacity",
        type: "number",
        defaultValue: "0.2",
        description:
          "Opacity the non-highlighted quotes fade to while one is active.",
      }),
      field({
        name: "onActiveChange",
        type: "(index: number | null) => void",
        description:
          "Called with the highlighted quote index, or null when the pointer leaves.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Extra classes for the paragraph wrapper — override the max width, text size, or leading here.",
      }),
    ],
    notes: [
      "The dim collapses to a plain opacity fade when the user prefers reduced motion.",
    ],
  },
  {
    id: "testimonials-item",
    title: "Testimonial",
    summary:
      "One inline quote: a small avatar, your quote text, and an attribution that springs in after the text while the quote is highlighted. Quotes alternate strong and muted tones by position.",
    fields: [
      field({
        name: "name",
        type: "string",
        required: true,
        description:
          "Author name revealed in the accent-colored attribution while the quote is highlighted.",
      }),
      field({
        name: "title",
        type: "ReactNode",
        description: "Author role or company shown under the name.",
      }),
      field({
        name: "avatar",
        type: "string",
        description:
          "Avatar image URL. Falls back to the author's initials when missing or broken.",
      }),
      field({
        name: "emphasis",
        type: '"strong" | "muted"',
        description:
          "Text tone at rest. Omit to alternate automatically by position.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "The quote text.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Extra classes for the quote span.",
      }),
    ],
    notes: [
      "Quotes are keyboard focusable, so the highlight and attribution also work without a pointer.",
    ],
  },
  registryItem(
    "testimonials.json",
    [],
    [
      createElement(
        "span",
        null,
        "Built by ",
        createElement(
          "a",
          {
            href: "https://www.edwinvakayil.info/",
            target: "_blank",
            rel: "noreferrer",
            className: "underline underline-offset-2 hover:text-foreground",
          },
          "Edwin"
        ),
        ". Inspired by the inline testimonial layout from ",
        createElement(
          "a",
          {
            href: "https://rauno.me/",
            target: "_blank",
            rel: "noreferrer",
            className: "underline underline-offset-2 hover:text-foreground",
          },
          "Rauno Freiberg"
        ),
        "."
      ),
    ]
  ),
];

const dialogApiDetails: DetailItem[] = [
  {
    id: "dialog-root",
    title: "Dialog",
    summary:
      "Dialog, DialogTrigger, DialogClose, and DialogPortal are direct re-exports of the matching Radix dialog primitives.",
    fields: [
      field({
        name: "open",
        type: "boolean",
        description:
          "Controlled open state on the Dialog root when you want the parent component to own visibility.",
      }),
      field({
        name: "defaultOpen",
        type: "boolean",
        description:
          "Uncontrolled initial state forwarded to Radix Dialog.Root.",
      }),
      field({
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description:
          "Called whenever Radix requests a state change through triggers, overlay clicks, or escape key handling.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Composition surface for the trigger, content, and any related dialog helpers.",
      }),
    ],
    notes: [
      "Any remaining Dialog.Root props continue to work because the root export is the Radix primitive itself.",
      "Accessibility and focus-trap behavior come from Radix rather than additional wrapper logic here.",
    ],
  },
  {
    id: "dialog-content",
    title: "DialogContent",
    summary:
      "Motion-enhanced content wrapper built around DialogPrimitive.Content and AnimatePresence.",
    fields: [
      field({
        name: "open",
        type: "boolean",
        description:
          "Controls whether the animated portal branch renders at all. In practice this must mirror the root open state for the content to appear and exit correctly.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the inner motion panel rather than the full-screen DialogPrimitive.Content wrapper.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Content rendered inside the animated panel. Each direct child is wrapped in its own motion.div for staggered entry.",
      }),
    ],
    notes: [
      "Accessibility props and Radix callbacks such as onEscapeKeyDown, onPointerDownOutside, aria-describedby, and aria-labelledby are forwarded to DialogPrimitive.Content.",
      "DialogContent always renders its own close button in the top-right corner using DialogPrimitive.Close and the Lucide X icon.",
    ],
  },
  {
    id: "dialog-trigger",
    title: "DialogTrigger",
    summary:
      "Radix trigger export used to open the dialog from any custom element.",
    fields: [
      field({
        name: "asChild",
        type: "boolean",
        description:
          "Lets you turn a custom button or link into the trigger without adding an extra wrapper element.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Interactive content rendered by the trigger primitive.",
      }),
    ],
    notes: [
      "Because DialogTrigger comes directly from Radix, it also accepts the remaining primitive props for event handling and accessibility wiring.",
    ],
  },
  {
    id: "dialog-close",
    title: "DialogClose",
    summary:
      "Radix close export used to dismiss the dialog from any custom control.",
    fields: [
      field({
        name: "asChild",
        type: "boolean",
        description:
          "Lets you turn an existing button or link into the close control without adding an extra wrapper element.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Interactive content rendered by the close primitive.",
      }),
    ],
    notes: [
      "DialogContent also renders its own close button in the top-right corner using DialogClose and the Lucide X icon.",
    ],
  },
  {
    id: "dialog-portal",
    title: "DialogPortal",
    summary:
      "Radix portal export for rendering dialog content outside the current DOM hierarchy.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Portal content such as overlay and dialog panel primitives.",
      }),
      field({
        name: "container",
        type: "HTMLElement",
        description:
          "Optional mount target for the portal. Defaults to document.body.",
      }),
    ],
  },
  {
    id: "dialog-header",
    title: "DialogHeader",
    summary: "Layout helper for the title area at the top of dialog content.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Content rendered inside the header container.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the helper wrapper so spacing and alignment can be adjusted per dialog.",
      }),
    ],
  },
  {
    id: "dialog-footer",
    title: "DialogFooter",
    summary:
      "Layout helper for actions or supporting context at the bottom of dialog content.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Content rendered inside the footer container.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the helper wrapper so spacing and alignment can be adjusted per dialog.",
      }),
    ],
    notes: [
      "Both header and footer helpers accept the normal div HTML attribute surface in addition to className and children.",
    ],
  },
  {
    id: "dialog-title",
    title: "DialogTitle",
    summary:
      "Semantic title helper forwarded to the matching Radix title primitive.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Text or inline markup rendered inside the title primitive.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the default title styles.",
      }),
    ],
  },
  {
    id: "dialog-description",
    title: "DialogDescription",
    summary:
      "Semantic description helper forwarded to the matching Radix description primitive.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Text or inline markup rendered inside the description primitive.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the default description styles.",
      }),
    ],
    notes: [
      "Both title and description helpers forward refs to the underlying Radix primitives.",
    ],
  },
  registryItem("dialog.json", [
    "@radix-ui/react-dialog",
    "motion",
    "lucide-react",
  ]),
];

const hoverCardApiDetails: DetailItem[] = [
  {
    id: "hover-card",
    title: "HoverCard",
    summary:
      "Stateful wrapper that opens a callout on delayed hover or immediate focus, then closes it once pointer and focus both leave the hover-card region.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Composition surface for the trigger and content primitives rendered inside the hover card root.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the inline-flex wrapper that groups the trigger and content primitives.",
      }),
      field({
        name: "openDelay",
        type: "number",
        defaultValue: "80",
        description:
          "Delay in milliseconds before the card opens after pointer entry. Keyboard focus opens immediately.",
      }),
      field({
        name: "closeDelay",
        type: "number",
        defaultValue: "120",
        description:
          "Delay in milliseconds before the card closes after pointer exit. Blur closes immediately unless focus is still moving within the card.",
      }),
    ],
    notes: [
      "Open state is internal only. This implementation does not expose a controlled open prop or state-change callback.",
      "The root manages hover and focus timing while Radix Popover handles portal-based positioning and collision avoidance.",
      "Pending timers are cleared before every new open or close request and again during unmount cleanup.",
    ],
  },
  {
    id: "hover-card-trigger",
    title: "HoverCardTrigger",
    summary:
      "Trigger surface that renders a button by default or forwards behavior into a custom child through Radix Slot.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Interactive content rendered by the trigger or by the child passed through asChild.",
      }),
      field({
        name: "asChild",
        type: "boolean",
        description:
          "Lets you supply your own trigger element while keeping the hover-card trigger behavior and class merging.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the rendered trigger element for local layout or visual styling.",
      }),
    ],
    notes: [
      "When asChild is false, the component renders a plain button with type='button', a larger default hit area, and a visible focus ring.",
      "The trigger is also used as the positioning anchor and automatically receives aria-expanded, aria-controls, and aria-haspopup.",
      "Standard button props such as disabled, onClick, aria-*, and data-* are forwarded to the rendered trigger element.",
    ],
  },
  {
    id: "hover-card-content",
    title: "HoverCardContent",
    summary:
      "Animated content panel with collision-aware positioning, side and align controls, and a spring-driven scale and directional offset fade.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Content rendered inside the hover card panel.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the motion.div panel so width, spacing, or surface styles can be adjusted.",
      }),
      field({
        name: "side",
        type: '"top" | "right" | "bottom" | "left"',
        defaultValue: '"bottom"',
        description:
          "Preferred side for the panel before collision handling adjusts the placement.",
      }),
      field({
        name: "align",
        type: '"start" | "center" | "end"',
        defaultValue: '"center"',
        description:
          "Horizontal or vertical alignment relative to the trigger, depending on side.",
      }),
      field({
        name: "sideOffset",
        type: "number",
        defaultValue: "12",
        description:
          "Gap between trigger and panel. The component also extends an invisible hover bridge through that gap to reduce accidental closes.",
      }),
      field({
        name: "alignOffset",
        type: "number",
        defaultValue: "0",
        description: "Additional offset applied along the alignment axis.",
      }),
      field({
        name: "avoidCollisions",
        type: "boolean",
        defaultValue: "true",
        description:
          "Enables Radix collision handling so the card can shift or flip when space is tight.",
      }),
      field({
        name: "collisionPadding",
        type: "number | Partial<Record<Side, number>>",
        defaultValue: "12",
        description:
          "Padding from viewport edges used during collision detection.",
      }),
    ],
    notes: [
      "Additional motion.div props such as style, role, onClick, aria-*, and data-* are forwarded, but initial, animate, exit, and transition are reserved by the component.",
      "The panel is portaled through Radix Popover content, so it can escape overflow-hidden ancestors and reposition near viewport edges.",
      "Focus can move from the trigger into interactive content without immediately closing the card.",
      "By default the content is centered below the trigger with a fixed w-72 width, no drop shadow, and a 12px hover bridge across the trigger-to-panel gap.",
    ],
  },
  registryItem("hover-card.json", [
    "@radix-ui/react-popover",
    "@radix-ui/react-slot",
    "motion",
  ]),
];

const popoverApiDetails: DetailItem[] = [
  {
    id: "popover-root",
    title: "Popover",
    summary:
      "Thin wrapper around `PopoverPrimitive.Root` that mirrors the resolved open state into local context so `PopoverContent` can infer presence automatically.",
    fields: [
      field({
        name: "open",
        type: "boolean",
        description:
          "Controlled open state on the Radix root when you want React state to own visibility.",
      }),
      field({
        name: "defaultOpen",
        type: "boolean",
        description:
          "Uncontrolled initial state forwarded to the underlying Radix popover root.",
      }),
      field({
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description:
          "Called whenever Radix requests a state change through the trigger, outside interaction, or escape handling.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Composition surface for the trigger, optional anchor, and content primitives.",
      }),
    ],
    notes: [
      "Remaining root props such as `modal` continue to flow through to the underlying Radix popover root.",
    ],
  },
  {
    id: "popover-trigger",
    title: "PopoverTrigger",
    summary:
      "Light wrapper around the Radix trigger with a larger default hit area when not using asChild.",
    fields: [
      field({
        name: "asChild",
        type: "boolean",
        description:
          "Lets you render your own button, link, or wrapper element without adding an extra DOM node.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Interactive content rendered by the trigger primitive.",
      }),
    ],
    notes: [
      "When you render an icon-only trigger with asChild, keep the interactive target around 40-44px so the hit area stays comfortable on touch and pointer devices.",
    ],
  },
  {
    id: "popover-anchor",
    title: "PopoverAnchor",
    summary:
      "Radix positioning anchor used when the popover should attach to a non-trigger element.",
    fields: [
      field({
        name: "asChild",
        type: "boolean",
        description:
          "Lets you render your own anchor element without adding an extra DOM node.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Layout content rendered by the anchor primitive.",
      }),
    ],
    notes: [
      "PopoverAnchor still accepts the remaining primitive props for event handling and accessibility wiring.",
    ],
  },
  {
    id: "popover-content",
    title: "PopoverContent",
    summary:
      "Animated content wrapper built on Radix Popover.Content and AnimatePresence.",
    fields: [
      field({
        name: "open",
        type: "boolean",
        description:
          "Accepted for backwards compatibility, but no longer required. The nearest `Popover` root state now drives content presence automatically.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Content rendered inside the animated panel.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the motion.div panel for local width, spacing, or surface overrides.",
      }),
      field({
        name: "align",
        type: '"start" | "center" | "end"',
        defaultValue: "center",
        description:
          "Forwarded to Radix Popover.Content to control horizontal alignment relative to the trigger or anchor.",
      }),
      field({
        name: "sideOffset",
        type: "number",
        defaultValue: "8",
        description:
          "Forwarded to Radix Popover.Content to control the gap between the anchor and the floating panel.",
      }),
      field({
        name: "collisionPadding",
        type: "number | Partial<Record<Side, number>>",
        defaultValue: "12",
        description:
          "Adds a little default breathing room from the viewport edge before collision handling nudges the popover inward.",
      }),
    ],
    notes: [
      "Remaining Radix content props are forwarded through to PopoverPrimitive.Content, including side, collisionPadding, onEscapeKeyDown, and accessibility props.",
      "The component always renders inside a Radix portal, reads the resolved placement for direction-aware motion, and uses the Radix transform-origin CSS variable so scaling stays anchored to the trigger.",
      "The panel ships without drop shadow so the surface stays flat against the page.",
      "Content size changes animate while the popover is open, so progressive disclosure and copy swaps do not snap abruptly.",
      "Entry and exit animation are owned internally, so Motion-specific props such as initial, animate, exit, and transition are not part of the public prop surface.",
    ],
  },
  registryItem("popover.json", ["@radix-ui/react-popover", "motion"]),
];

const colorPickerApiDetails: DetailItem[] = [
  {
    id: "color-picker",
    title: "ColorPicker",
    summary:
      "Self-contained HSV panel with saturation field, hue/alpha sliders, multi-format readouts, presets, popover mode, and EyeDropper.",
    fields: [
      field({
        name: "value",
        type: "string",
        description:
          "Controlled hex color such as #3B82F6 or #3B82F680. When provided, the picker syncs its internal state to this value.",
      }),
      field({
        name: "defaultValue",
        type: "string",
        defaultValue: "#3B82F6",
        description:
          "Starting color for uncontrolled usage (3-, 6-, or 8-digit hex). Ignored when value is supplied.",
      }),
      field({
        name: "onChange",
        type: "(color: string, detail: ColorPickerChangeDetail) => void",
        description:
          "Called when the color settles (pointer up on sliders, blur/Enter on inputs). Emits #RRGGBB, or #RRGGBBAA when alpha is below 100%, plus CSS strings in detail.",
      }),
      field({
        name: "onValueCommit",
        type: "(color: string, detail: ColorPickerChangeDetail) => void",
        description:
          "Fires alongside onChange when the color settles. Useful for form commit handlers.",
      }),
      field({
        name: "defaultAlpha",
        type: "number",
        defaultValue: "100",
        description:
          "Starting alpha percentage (0–100) for uncontrolled usage when defaultValue has no alpha channel.",
      }),
      field({
        name: "defaultFormat",
        type: '"HEX" | "RGB" | "HSL" | "OKLCH"',
        defaultValue: "HEX",
        description: "Initial readout format for the footer row.",
      }),
      field({
        name: "variant",
        type: '"inline" | "popover" | "swatch"',
        defaultValue: "inline",
        description:
          "Inline panel (default), field popover trigger, or compact swatch trigger that opens the picker on click.",
      }),
      field({
        name: "open",
        type: "boolean",
        description: "Controlled open state when variant is popover.",
      }),
      field({
        name: "defaultOpen",
        type: "boolean",
        defaultValue: "false",
        description: "Initial open state for uncontrolled popover usage.",
      }),
      field({
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Called when the popover panel opens or closes.",
      }),
      field({
        name: "placeholder",
        type: "string",
        defaultValue: "Pick a color",
        description: "Placeholder text for the popover trigger label.",
      }),
      field({
        name: "presets",
        type: "string[]",
        description:
          "Quick-select swatch colors shown above the saturation field.",
      }),
      field({
        name: "swatchShape",
        type: '"default" | "circle"',
        defaultValue: "default",
        description:
          "Corner style for swatch triggers and preset chips. Use circle for a fully round swatch.",
      }),
      field({
        name: "showAlpha",
        type: "boolean",
        defaultValue: "true",
        description:
          "Shows or hides alpha controls and keeps output opaque when false.",
      }),
      field({
        name: "showCopy",
        type: "boolean",
        defaultValue: "false",
        description:
          "Shows a copy-to-clipboard control for the active format string.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Disables picker interaction and lowers shell opacity.",
      }),
      field({
        name: "showEyedropper",
        type: "boolean",
        defaultValue: "true",
        description: "Shows or hides the pipette control in the footer row.",
      }),
      field({
        name: "onEyedropperUnsupported",
        type: "() => void",
        description:
          "Called when EyeDropper is unavailable. No alert dialog is shown by default.",
      }),
      field({
        name: "id",
        type: "string",
        description: "Root element id used for internal aria wiring.",
      }),
      field({
        name: "name",
        type: "string",
        description: "Hidden input name for native form submission.",
      }),
      field({
        name: "aria-label",
        type: "string",
        defaultValue: "Color picker",
        description: "Accessible label when not using aria-labelledby.",
      }),
      field({
        name: "aria-labelledby",
        type: "string",
        description: "ID of an external label element.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the outer shell for width, shadow, or layout overrides.",
      }),
    ],
    notes: [
      "Install with npx shadcn@latest add https://iconiqui.com/r/color-picker.json (requires @base-ui/react, lucide-react, motion, and a cn helper).",
      "Theme tokens are embedded on the panel node so the picker works without iconiq-theme, though it still maps cleanly to shadcn semantic colors.",
      "The saturation square, hue slider, and alpha slider share one RGB source of truth. Slider drags emit on pointer up to stay stable in controlled mode.",
      "Format switching exposes editable HEX, RGB, HSL, and OKLCH channels with labeled inputs. Values commit on blur or Enter so partial typing does not fight the live color state.",
      "HEX input accepts 3-, 6-, and 8-digit values. Invalid hex shows inline feedback on blur.",
      "OKLCH chroma max adapts to the current lightness and hue so vivid sRGB colors stay reachable.",
      "EyeDropper support depends on the browser API (Chrome/Edge). Use onEyedropperUnsupported for user-facing feedback.",
      "FluidColorPicker remains exported as a backward-compatible alias for older imports.",
    ],
  },
  registryItem("color-picker.json", [
    "@base-ui/react",
    "lucide-react",
    "motion",
  ]),
];

const accordionApiDetails: DetailItem[] = [
  {
    id: "accordion-item",
    title: "AccordionItem",
    summary:
      "Each row is described by a simple object and rendered as a single-expand accordion item.",
    fields: [
      field({
        name: "id",
        type: "string",
        required: true,
        description:
          "Stable key used for React rendering, internal open-state comparison, and the generated aria-controls id.",
      }),
      field({
        name: "title",
        type: "string",
        required: true,
        description: "Text shown in the trigger row.",
      }),
      field({
        name: "content",
        type: "string",
        required: true,
        description:
          "Body copy shown inside the open panel with a horizontal masked wipe and a soft lift into place.",
      }),
    ],
  },
  {
    id: "accordion",
    title: "Accordion",
    summary:
      "Stateful accordion component with internal open state and no controlled API.",
    fields: [
      field({
        name: "items",
        type: "AccordionItem[]",
        required: true,
        description: "Rows to render in order.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the max-w-2xl root wrapper so you can stretch or reposition the accordion in your layout.",
      }),
      field({
        name: "multiple",
        type: "boolean",
        defaultValue: "false",
        description:
          "Allows several rows to stay open at once. When omitted, opening one row closes the previously open row.",
      }),
      field({
        name: "variant",
        type: '"default" | "quiet"',
        defaultValue: '"default"',
        description:
          "Switches between the plain divided list and the quieter inline plus/minus treatment.",
      }),
    ],
    notes: [
      "Clicking an already open row closes it again by removing that item id from the internal open-state list.",
      "Single-open is the default behavior; pass multiple when you want a keep-open FAQ or settings list.",
      "There is no prop for default open or controlled open behavior in this implementation.",
      "The quiet variant keeps the same state model and API, but swaps in a lighter inline disclosure style.",
    ],
  },
  {
    id: "accordion-motion",
    title: "Motion and accessibility",
    summary:
      "The accordion uses native buttons and animated height transitions rather than a headless primitive.",
    notes: [
      "Each trigger button sets aria-expanded and aria-controls, and each open panel receives a matching id.",
      "The quiet variant uses a minimal plus/minus label while preserving the same keyboard, state, and content motion behavior.",
      "The content body reveals through a horizontal clipped wipe while the paragraph settles upward with a soft blur fade.",
      "Keyboard support is limited to standard button tab and click semantics; there is no arrow-key roving between items.",
    ],
  },
  registryItem("accordion.json", ["motion", "lucide-react"]),
];

const progressApiDetails: DetailItem[] = [
  {
    id: "progress",
    title: "Progress",
    summary: "Determinate and indeterminate progress—with subtle motion.",
    fields: [
      field({
        name: "value",
        type: "number | null",
        defaultValue: "0",
        description:
          "Current progress value. Pass null to switch into the indeterminate motion state instead of rendering a measured fill width.",
      }),
      field({
        name: "min",
        type: "number",
        defaultValue: "0",
        description:
          "Lower bound used to normalize the fill width and the visible value text.",
      }),
      field({
        name: "max",
        type: "number",
        defaultValue: "100",
        description:
          "Upper bound used to normalize the fill width and the visible value text.",
      }),
      field({
        name: "label",
        type: "string",
        description:
          "Optional title rendered above the bar and linked to the progress semantics when present.",
      }),
      field({
        name: "helper",
        type: "string",
        description:
          "Optional supporting copy rendered near the label for extra task context. When omitted, the header collapses down to just the label and trailing value readout.",
      }),
      field({
        name: "showValue",
        type: "boolean",
        defaultValue: "true",
        description:
          "Controls whether the trailing inline readout with the live formatted value or indeterminate label is shown.",
      }),
      field({
        name: "formatValue",
        type: "(value: number, percent: number) => string",
        description:
          "Optional formatter for the visible value readout. Receives the current normalized value and percent so you can render units, fractions, or custom labels.",
      }),
      field({
        name: "getValueLabel",
        type: "(value: number, percent: number) => string",
        description:
          "Optional formatter for screen-reader announcements when the accessible text should be more explicit than the visible readout.",
      }),
      field({
        name: "indeterminateLabel",
        type: "string",
        defaultValue: '"In progress"',
        description:
          "Text used for the visible value readout and accessible status when value is null.",
      }),
      field({
        name: "ariaLabel",
        type: "string",
        description:
          "Accessible name used when no visible label is rendered. When omitted, unlabeled installs fall back to a generic Progress label.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root wrapper so you can control width, spacing, or placement in your layout.",
      }),
      field({
        name: "variant",
        type: '"default" | "circular"',
        defaultValue: '"default"',
        description:
          "Linear bar (default) or circular gauge layout with a dual-stroke ring, 5% gap, and CSS-smoothed arc transitions. Circular mode renders the value readout centered inside the ring.",
      }),
      field({
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description:
          "Track height preset for the default bar, or ring diameter preset for the circular variant.",
      }),
      field({
        name: "tone",
        type: '"default" | "brand" | "destructive" | "success"',
        defaultValue: '"default"',
        description:
          "Fill color preset for neutral, brand, destructive, or success emphasis.",
      }),
      field({
        name: "trackClassName",
        type: "string",
        description: "Merged onto the track element for custom track styling.",
      }),
      field({
        name: "indicatorClassName",
        type: "string",
        description:
          "Merged onto the fill element for custom indicator styling.",
      }),
      field({
        name: "headerClassName",
        type: "string",
        description:
          "Merged onto the label, helper, and value readout row above the track.",
      }),
    ],
    notes: [
      "The component clamps numeric values into the min/max range before calculating the fill width.",
      "The visible value readout animates from the same motion value as the fill width, so the text and the bar stay visually locked together while values change.",
      "There is no controlled versus uncontrolled split here; value is simply rendered as the current state of the task.",
      "Helper copy is linked to the progressbar through aria-describedby on both Radix and Base UI installs.",
    ],
  },
  {
    id: "progress-motion",
    title: "Motion and semantics",
    summary:
      "Headless progress semantics from the provider primitive with a spring-smoothed fill and restrained indeterminate motion layered on top.",
    notes: [
      "Determinate mode uses a spring-smoothed width animation instead of a hard width jump, which keeps status updates feeling more fluid when values change rapidly.",
      "Indeterminate mode uses one minimal left-to-right flow band with a soft fade at the start and end of each pass, so the restart stays visually quiet.",
    ],
  },
  registryItem("r-progress.json", ["@radix-ui/react-progress", "motion"]),
];

const radioGroupApiDetails: DetailItem[] = [
  {
    id: "radio-option",
    title: "Radio option shape",
    summary: "Options are plain objects consumed by the RadioGroup component.",
    fields: [
      field({
        name: "value",
        type: "string",
        required: true,
        description:
          "Unique identifier for the option and the selected value reported through onChange.",
      }),
      field({
        name: "label",
        type: "string",
        required: true,
        description: "Primary line shown for the option.",
      }),
      field({
        name: "description",
        type: "string",
        description:
          "Optional secondary line shown below the label with reduced emphasis.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description:
          "Disables this option while keeping it visible in the list.",
      }),
    ],
  },
  {
    id: "radio-group",
    title: "RadioGroup",
    summary:
      "Single-choice selector with animated rows, form semantics, and support for both controlled and uncontrolled state.",
    fields: [
      field({
        name: "options",
        type: "{ value: string; label: string; description?: string; disabled?: boolean }[]",
        required: true,
        description: "Available choices in display order.",
      }),
      field({
        name: "defaultValue",
        type: "string",
        description:
          "Initial uncontrolled selection. If omitted or invalid, the component falls back to the first option.",
      }),
      field({
        name: "value",
        type: "string",
        description:
          "Controlled selected value. When provided, parent state owns selection and the component only reports changes.",
      }),
      field({
        name: "onChange",
        type: "(value: string) => void",
        description: "Called whenever a user selects a row.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description: "Disables the entire group and all rows.",
      }),
      field({
        name: "invalid",
        type: "boolean",
        description:
          "Marks the group invalid for assistive tech and applies destructive focus styling.",
      }),
      field({
        name: "label",
        type: "string",
        description:
          "Visible field label rendered above the group. When required is true, a destructive asterisk is appended.",
      }),
      field({
        name: "labelClassName",
        type: "string",
        description: "Merged onto the visible field label.",
      }),
      field({
        name: "required",
        type: "boolean",
        description:
          "Marks the native radio inputs as required for form validation and shows a destructive asterisk when label is set.",
      }),
      field({
        name: "form",
        type: "string",
        description:
          "Associates the native radio inputs with a form element by id when the group is rendered outside that form.",
      }),
      field({
        name: "orientation",
        type: '"horizontal" | "vertical"',
        description:
          "Layout direction for the option rows. Defaults to vertical.",
      }),
      field({
        name: "name",
        type: "string",
        description:
          "Shared radio input name. If omitted, the component generates one per instance.",
      }),
      field({
        name: '"aria-describedby"',
        type: "string",
        description:
          "ID of helper or error text associated with the radiogroup.",
      }),
      field({
        name: '"aria-label"',
        type: "string",
        description:
          "Accessible name for the radiogroup when label is omitted. Prefer label when you need a visible field title.",
      }),
      field({
        name: '"aria-labelledby"',
        type: "string",
        description:
          "ID of external text that labels the radiogroup. Use this instead of aria-label when visible copy already exists.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root wrapper for spacing or sizing adjustments.",
      }),
    ],
    notes: [
      "If options is empty, the component returns null rather than rendering an empty radiogroup.",
      "In uncontrolled mode, the selected value normalizes to the first enabled option when the current selection disappears or becomes disabled.",
      "In controlled mode, an invalid value leaves no row selected until the parent corrects the value.",
      "Use label with required to show the destructive asterisk. The group is wrapped in a native fieldset with legend for form semantics.",
      "Motion respects prefers-reduced-motion for entrance, hover, and ring transitions.",
    ],
  },
  {
    id: "radio-motion-a11y",
    title: "Motion and accessibility",
    summary:
      "The component wraps native radio inputs in an animated row shell so keyboard, form, and screen-reader behavior stay intact.",
    notes: [
      "The root keeps radiogroup semantics and each input supports Arrow keys plus Home and End navigation with a single tab stop inside the set.",
      "Disabled rows skip hover and tap motion while remaining visible.",
    ],
  },
  registryItem("b-radio-group.json", ["@base-ui/react", "motion"]),
  registryItem("r-radio-group.json", ["@radix-ui/react-radio-group", "motion"]),
];

const selectApiDetails: DetailItem[] = [
  {
    id: "select",
    title: "Select",
    summary:
      "Root select controller. Compose SelectTrigger, SelectValue, SelectContent, and SelectItem inside it.",
    fields: [
      field({
        name: "value",
        type: "string",
        description:
          "Controlled selected value. Leave unset with defaultValue for uncontrolled usage.",
      }),
      field({
        name: "defaultValue",
        type: "string",
        description: "Initial selected value for uncontrolled usage.",
      }),
      field({
        name: "onValueChange",
        type: "(value: string) => void",
        description:
          "Called when a SelectItem is chosen. The menu closes immediately afterward.",
      }),
      field({
        name: "open",
        type: "boolean",
        description:
          "Controlled popup state. Pair with onOpenChange when parent state owns the menu.",
      }),
      field({
        name: "defaultOpen",
        type: "boolean",
        defaultValue: "false",
        description: "Initial popup state for uncontrolled usage.",
      }),
      field({
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description:
          "Called whenever the trigger, keyboard, item choice, or outside interaction opens or closes the menu.",
      }),
    ],
    notes: [
      "The root wraps the provider primitive in the Iconiq motion layer so child parts share one animation setup.",
      "Selection and open state can be controlled or uncontrolled while still preserving primitive keyboard navigation and typeahead.",
    ],
  },
  {
    id: "select-trigger",
    title: "SelectTrigger",
    summary:
      "Button that opens the menu and hosts SelectValue plus the animated chevron.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        description:
          "Usually a SelectValue. The chevron icon is appended automatically.",
      }),
      field({
        name: "size",
        type: '"sm" | "default"',
        defaultValue: '"default"',
        description:
          "Data attribute hook for compact trigger variants without changing the default Iconiq styling.",
      }),
      field({
        name: "label",
        type: "ReactNode",
        description:
          "Optional field label rendered above the trigger and linked with htmlFor.",
      }),
      field({
        name: "description",
        type: "ReactNode",
        description:
          "Optional helper copy rendered above the trigger. Linked to the trigger with aria-describedby.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the trigger button. Use it for local width such as w-full max-w-48.",
      }),
    ],
    notes: [
      "The trigger keeps the previous press spring, hover color, focus ring, and chevron rotation.",
    ],
  },
  {
    id: "select-value",
    title: "SelectValue",
    summary:
      "Trigger label driven by the selected value primitive, with optional render-prop children for API-backed labels and icons.",
    fields: [
      field({
        name: "placeholder",
        type: "ReactNode",
        description: "Shown in the trigger when no item is selected.",
      }),
      field({
        name: "children",
        type: "ReactNode | (value: string | undefined) => ReactNode",
        description:
          "Optional custom trigger content. Use the render prop to resolve labels or icons from your options array when data is loaded dynamically.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the value span. The default keeps text truncated inside the trigger.",
      }),
    ],
    notes: [
      "Without children, the trigger shows the selected value string. Pass a render prop when you need human-readable labels from external data.",
    ],
  },
  {
    id: "select-overlay",
    title: "SelectContent",
    summary:
      "Portaled menu surface with the previous Iconiq dropdown fade, slide, and viewport clamping.",
    fields: [
      field({
        name: "side",
        type: '"top" | "right" | "bottom" | "left"',
        defaultValue: '"bottom"',
        description: "Preferred side for the menu before collision handling.",
      }),
      field({
        name: "align",
        type: '"start" | "center" | "end"',
        defaultValue: '"start"',
        description: "Horizontal alignment against the trigger or anchor.",
      }),
      field({
        name: "sideOffset",
        type: "number",
        defaultValue: "8",
        description:
          "Gap between trigger and menu. The default matches the prior select spacing.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the animated menu panel for local max height, width, or surface overrides.",
      }),
    ],
    notes: [
      "The popup is portaled, width-matches the trigger by default, and caps height at 320px before scrolling.",
      "Scroll up/down arrow slots are included for long menus while the panel keeps the same entry and exit animation.",
    ],
  },
  {
    id: "select-item",
    title: "SelectItem",
    summary:
      "Selectable row with primitive keyboard behavior plus the previous active-row highlight and checkmark motion.",
    fields: [
      field({
        name: "value",
        type: "string",
        required: true,
        description:
          "Stable value reported through onValueChange and used to determine the selected checkmark.",
      }),
      field({
        name: "label",
        type: "string",
        description:
          "Optional display label for the item and selected trigger value. Falls back to textValue, string children, then value.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        description:
          "Optional custom row content. When omitted, label or value is rendered in the menu.",
      }),
      field({
        name: "icon",
        type: "ReactNode",
        description:
          "Optional leading icon rendered inline with the item label and selected trigger value.",
      }),
      field({
        name: "textValue",
        type: "string",
        description:
          "Optional plain-text fallback used for trigger display and typeahead when label is omitted.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Prevents the item from receiving selection.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the row while preserving the animated active highlight and selected checkmark.",
      }),
    ],
  },
  {
    id: "select-group",
    title: "SelectGroup",
    summary: "Section wrapper for grouped options inside SelectContent.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "SelectItem rows or nested option content rendered inside the grouped section.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the default grouped section spacing classes.",
      }),
    ],
    notes: [
      "SelectGroup adds the same section spacing as the previous grouped option renderer.",
    ],
  },
  {
    id: "select-label",
    title: "SelectLabel",
    summary: "Compact section label rendered above grouped SelectItem rows.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Section label text rendered above a SelectGroup.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged with the uppercase section label typography classes.",
      }),
    ],
    notes: ["SelectLabel keeps the compact uppercase section label treatment."],
  },
  {
    id: "select-separator",
    title: "SelectSeparator",
    summary: "Non-interactive divider between item clusters inside the menu.",
    fields: [
      field({
        name: "className",
        type: "string",
        description: "Merged with the default border-token divider classes.",
      }),
    ],
    notes: [
      "SelectSeparator renders a non-interactive border-token divider between item clusters.",
    ],
  },
  {
    id: "select-scroll-up",
    title: "SelectScrollUpButton",
    summary: "Scroll affordance rendered above long SelectContent lists.",
    fields: [
      field({
        name: "className",
        type: "string",
        description: "Merged with the default scroll button layout classes.",
      }),
    ],
  },
  {
    id: "select-scroll-down",
    title: "SelectScrollDownButton",
    summary: "Scroll affordance rendered below long SelectContent lists.",
    fields: [
      field({
        name: "className",
        type: "string",
        description: "Merged with the default scroll button layout classes.",
      }),
    ],
  },
  registryItem("select.json", ["motion", "lucide-react"]),
];

const separatorApiDetails: DetailItem[] = [
  {
    id: "separator",
    title: "Separator",
    summary:
      "Horizontal or vertical divider with solid, dashed, and dotted variants plus tone, spacing, and inset helpers.",
    fields: [
      field({
        name: "orientation",
        type: '"horizontal" | "vertical"',
        defaultValue: '"horizontal"',
        description:
          "Controls whether the divider spans across the inline axis or separates items inside a fixed-height row.",
      }),
      field({
        name: "variant",
        type: '"line" | "dashed" | "dotted"',
        defaultValue: '"line"',
        description:
          "Chooses the visual treatment. The default line variant renders a solid rule, dashed repeats short strokes, and dotted uses native dotted border rendering.",
      }),
      field({
        name: "tone",
        type: '"default" | "muted" | "brand" | "destructive"',
        defaultValue: '"default"',
        description:
          "Maps the divider color to border, muted, brand, or destructive tokens without overriding className.",
      }),
      field({
        name: "spacing",
        type: '"none" | "sm" | "md" | "lg"',
        defaultValue: '"none"',
        description:
          "Adds orientation-aware margin around the divider for section gutters. Use inset instead for compact menu dividers.",
      }),
      field({
        name: "inset",
        type: "boolean",
        defaultValue: "false",
        description:
          "Applies the compact negative-margin treatment used between menu or list groups.",
      }),
      field({
        name: "decorative",
        type: "boolean",
        defaultValue: "true",
        description:
          "Removes the separator from the accessibility tree when true. Set it to false only when the divider communicates structure that needs to be announced.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the primitive root so local width, height, margin, color, or placement can be adjusted without changing the component file.",
      }),
    ],
    notes: [
      "Vertical separators use self-stretch inside flex rows and keep min-h-4 as a fallback when the parent does not define height.",
      "The dashed variant uses background gradients so horizontal and vertical strokes keep the same dash rhythm. The dotted variant uses border rendering with h-px sizing so dots stay visible in flex layouts.",
      'Every separator root exposes data-slot="separator" for parent styling hooks.',
    ],
  },
  {
    id: "separator-label",
    title: "SeparatorLabel",
    summary:
      "Centered caption layout that renders matching dividers on both sides of a label.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Caption rendered between the two separators.",
      }),
      field({
        name: "variant",
        type: '"line" | "dashed" | "dotted"',
        defaultValue: '"line"',
        description: "Variant applied to both flanking separators.",
      }),
      field({
        name: "tone",
        type: '"default" | "muted" | "brand" | "destructive"',
        defaultValue: '"default"',
        description: "Tone applied to both flanking separators.",
      }),
      field({
        name: "labelClassName",
        type: "string",
        description: "Classes merged onto the caption span.",
      }),
      field({
        name: "separatorClassName",
        type: "string",
        description: "Classes merged onto both flanking separators.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Classes merged onto the outer flex container.",
      }),
    ],
    notes: [
      "SeparatorLabel is included in the same registry file as Separator, so no extra install step is required.",
    ],
  },
  {
    id: "separator-semantics",
    title: "Semantics",
    summary:
      "The component defaults to decorative presentation, but both primitive versions can opt into separator semantics.",
    notes: [
      "Pass decorative=false when the divider is meaningful enough to be announced by assistive technology.",
      "Additional primitive props and data attributes are forwarded to the root element for composition with layout or menu surfaces.",
    ],
  },
  registryItem("b-separator.json", ["@base-ui/react"]),
];

const selectionToolbarApiDetails: DetailItem[] = [
  {
    id: "selectiontoolbar",
    title: "SelectionToolbar",
    summary:
      "Floating formatting toolbar for editable text. It watches document selection, shows itself only when the selection lives inside the provided container, and exposes bold, italic, and underline actions by default.",
    fields: [
      field({
        name: "containerRef",
        type: "React.RefObject<HTMLElement | null>",
        required: true,
        description:
          "Ref pointing at the editable container whose text selection should drive the toolbar. Selections outside this element immediately hide the toolbar.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Optional class names applied to the portaled toolbar shell.",
      }),
      field({
        name: "items",
        type: "SelectionToolbarItem[]",
        description:
          "Optional toolbar actions. Defaults to bold, italic, and underline. Use SelectionToolbarPresets for link, copy, and strikethrough helpers.",
      }),
      field({
        name: "children",
        type: "React.ReactNode",
        description:
          "Optional custom toolbar buttons rendered after the configured items.",
      }),
      field({
        name: "onCommand",
        type: "(command: SelectionToolbarCommand) => void",
        description: "Called after a native formatting command succeeds.",
      }),
      field({
        name: "portalContainer",
        type: "HTMLElement | null",
        defaultValue: "document.body",
        description:
          "Portal target for the floating toolbar. Defaults to document.body.",
      }),
      field({
        name: "offset",
        type: "number",
        defaultValue: "10",
        description:
          "Gap in pixels between the selection anchor and the toolbar.",
      }),
      field({
        name: "side",
        type: '"auto" | "top" | "bottom"',
        defaultValue: '"auto"',
        description:
          "Preferred placement relative to the selection. Auto flips above or below based on viewport space.",
      }),
      field({
        name: "zIndex",
        type: "number",
        defaultValue: "50",
        description: "Stacking order for the portaled toolbar.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, the toolbar stays hidden and actions are ignored.",
      }),
      field({
        name: "aria-controls",
        type: "string",
        description:
          "Optional id of the editable surface controlled by the toolbar.",
      }),
    ],
    notes: [
      "The toolbar listens to document-level selectionchange events and only dismisses on pointerdown outside both the toolbar and the editable container.",
      "Formatting actions run on mousedown instead of click so the active text selection is preserved while commands are applied.",
      "Active states are read from document.queryCommandState for inline formatting commands.",
      "Keyboard shortcuts Ctrl/Cmd+B, Ctrl/Cmd+I, and Ctrl/Cmd+U work while a non-collapsed selection is inside the container.",
      "Toolbar buttons support arrow-key roving focus, Home, and End while the toolbar is visible.",
    ],
  },
  {
    id: "selectiontoolbar-positioning",
    title: "Positioning and editing behavior",
    summary:
      "The toolbar positions itself from the live range rectangle returned by the browser selection API and applies formatting through the native rich-text command pipeline.",
    notes: [
      "Coordinates come from Range.getBoundingClientRect in viewport space and the toolbar uses position: fixed, so it stays anchored while the page scrolls.",
      "Horizontal placement is clamped to the viewport and vertical placement can flip above or below the selection when space is limited.",
      "The toolbar is portaled outside clipping containers by default, which avoids overflow-hidden wrappers trimming the floating shell.",
      "The current implementation depends on document.execCommand for inline formatting. That keeps the install lightweight for native contentEditable text, but apps with a custom text model should replace command handling via items or onCommand.",
    ],
  },
  registryItem("selectiontoolbar.json", ["lucide-react"]),
];

const iconBarApiDetails: DetailItem[] = [
  {
    id: "icon-bar",
    title: "IconBar",
    summary:
      "Horizontal toolbar of compact icon chips. Hover or focus previews labels; clicking selects one item and keeps it expanded.",
    fields: [
      field({
        name: "value",
        type: "string | null",
        description:
          "Controlled selected item value. Pair with onValueChange for fully controlled selection.",
      }),
      field({
        name: "defaultValue",
        type: "string | null",
        description:
          "Optional initial selected item when uncontrolled. Omit to start with every chip collapsed until the user clicks one.",
      }),
      field({
        name: "onValueChange",
        type: "(value: string | null) => void",
        description:
          "Called when selection changes. Receives null when the active chip is clicked again to deselect.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Optional class names applied to the outer flex container.",
      }),
      field({
        name: "children",
        type: "React.ReactNode",
        description:
          "One or more IconBarItem elements rendered in a single row with consistent spacing.",
      }),
    ],
  },
  {
    id: "icon-bar-item",
    title: "IconBarItem",
    summary:
      "Individual pill chip with a Lucide icon and animated label reveal on hover, focus, or selection.",
    fields: [
      field({
        name: "icon",
        type: "LucideIcon",
        required: true,
        description:
          "Lucide icon component rendered inside the fixed 36px icon well.",
      }),
      field({
        name: "label",
        type: "string",
        required: true,
        description:
          "Short text revealed when the chip expands. Keep labels concise so the width animation stays smooth.",
      }),
      field({
        name: "value",
        type: "string",
        description:
          "Selection identity for this chip. Defaults to label when omitted.",
      }),
      field({
        name: "onClick",
        type: "(event: React.MouseEvent<HTMLButtonElement>) => void",
        description: "Optional click handler fired after selection updates.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Disables interaction, hover preview, and selection.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Optional class names merged onto the chip button.",
      }),
    ],
    notes: [
      "Only one item stays expanded at a time. Clicking a chip selects it; clicking another moves selection; clicking the active chip again collapses it.",
      "Hover and keyboard focus preview labels on non-selected chips. Give each item a unique value when labels repeat.",
      "In controlled mode, update value from onValueChange (including null on deselect) for the UI to stay in sync.",
    ],
  },
  registryItem("icon-bar.json", [
    "@base-ui/react/toggle",
    "@base-ui/react/toggle-group",
    "motion",
    "lucide-react",
  ]),
];

const infiniteRibbonApiDetails: DetailItem[] = [
  {
    id: "infiniteribbon",
    title: "InfiniteRibbon",
    summary:
      "Full-width looping ribbon that duplicates content into a seamless marquee track with theme variants, viewport-aware repeat, reduced-motion support, and optional link banners.",
    fields: [
      field({
        name: "children",
        type: "React.ReactNode",
        description:
          "Content repeated across the moving ribbon. Short announcement copy works best because it stays legible while scrolling.",
      }),
      field({
        name: "items",
        type: "string[]",
        description:
          "Optional list of strings rendered with `separator` between each item instead of a single `children` node.",
      }),
      field({
        name: "separator",
        type: "React.ReactNode",
        defaultValue: '" · "',
        description: "Divider rendered between `items` entries.",
      }),
      field({
        name: "repeat",
        type: "number",
        defaultValue: "5",
        description:
          "Minimum number of copies rendered per half of the seamless track. The component auto-expands this value when the viewport is wider than the measured segment.",
      }),
      field({
        name: "duration",
        type: "number",
        defaultValue: "10",
        description:
          "Loop duration in seconds for one half of the track. Ignored when `speed` is set. Values below 0.1 are clamped.",
      }),
      field({
        name: "speed",
        type: "number",
        description:
          "Optional scroll speed in pixels per second. When set, loop duration is derived from the measured half-track distance.",
      }),
      field({
        name: "reverse",
        type: "boolean",
        defaultValue: "false",
        description:
          "Runs the marquee from left to right instead of the default right-to-left movement.",
      }),
      field({
        name: "rotation",
        type: "number",
        defaultValue: "0",
        description:
          "Degrees applied to an outer wrapper so additional transforms on the root do not conflict with diagonal banner layouts.",
      }),
      field({
        name: "variant",
        type: '"default" | "brand" | "warning"',
        defaultValue: '"default"',
        description:
          "Built-in surface tone mapped to Iconiq theme tokens instead of hard-coded colors.",
      }),
      field({
        name: "gap",
        type: "number | string",
        defaultValue: '"2rem"',
        description: "Spacing between repeated segments.",
      }),
      field({
        name: "pauseOnHover",
        type: "boolean",
        defaultValue: "true",
        description:
          "Pauses the animation while the ribbon is hovered or contains focused interactive content.",
      }),
      field({
        name: "pauseWhenHidden",
        type: "boolean",
        defaultValue: "true",
        description:
          "Pauses the animation while the document tab is hidden to reduce unnecessary work.",
      }),
      field({
        name: "fadeEdges",
        type: "boolean",
        defaultValue: "false",
        description:
          "Applies a soft gradient mask at the viewport edges for a polished marquee fade.",
      }),
      field({
        name: "selectable",
        type: "boolean",
        defaultValue: "true",
        description:
          "When false, repeated copy uses `select-none` so users cannot highlight moving text.",
      }),
      field({
        name: "href",
        type: "string",
        description:
          "Turns each repeated segment into a link. Only the first copy stays tabbable to avoid keyboard traps.",
      }),
      field({
        name: "interactive",
        type: "boolean",
        description:
          "Keeps the animated track available to assistive tech. Defaults to `true` when `href` is provided.",
      }),
      field({
        name: "aria-label",
        type: "string",
        description:
          "Accessible name for the announcement region. Falls back to joined `items` or plain-text `children`.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Optional class names merged onto the root ribbon for positioning, spacing, or typography overrides.",
      }),
    ],
    notes: [
      "Non-interactive ribbons render a single screen-reader-only copy of the content while the animated track stays `aria-hidden`.",
      "Keyframes are injected once through a shared style tag, so no global Tailwind animation extension is required.",
      "When `prefers-reduced-motion` is enabled, the ribbon shows a static centered copy instead of animating.",
      "Rotation is applied on an outer wrapper so you can still use transform utilities on the root element.",
    ],
  },
  registryItem("infiniteribbon.json", []),
];

const carouselApiDetails: DetailItem[] = [
  {
    id: "carousel",
    title: "Carousel",
    summary:
      "Root carousel region wired to Embla. Exposes scroll state through `useCarousel`, supports responsive nav placement, optional autoplay, and keyboard navigation for horizontal and vertical layouts.",
    fields: [
      field({
        name: "orientation",
        type: '"horizontal" | "vertical"',
        defaultValue: "horizontal",
        description:
          "Sets the Embla scroll axis and the spacing applied between slides.",
      }),
      field({
        name: "aspectRatio",
        type: '"square" | "video" | "4/3" | "3/2" | "portrait" | string',
        defaultValue: "video",
        description:
          "Sets the slide viewport shape on `CarouselContent`. Use presets like `video` (16:9) and `square`, or pass a custom ratio string such as `21/9`.",
      }),
      field({
        name: "navPlacement",
        type: '"outside" | "responsive"',
        defaultValue: "responsive",
        description:
          "Positions previous and next controls. `responsive` places controls below the carousel on the right on mobile and outside the track from `sm` upward.",
      }),
      field({
        name: "autoplay",
        type: "boolean | number",
        description:
          "When enabled, advances slides on a timer. Pass a number for the delay in milliseconds. Pair with `opts={{ loop: true }}` for continuous playback.",
      }),
      field({
        name: "opts",
        type: "CarouselOptions",
        description:
          "Forwarded Embla options such as `align`, `loop`, or `slidesToScroll`. The root merges `axis` from `orientation`.",
      }),
      field({
        name: "plugins",
        type: "CarouselPlugin",
        description:
          "Optional Embla plugins passed to `useEmblaCarousel`, such as `embla-carousel-autoplay`.",
      }),
      field({
        name: "setApi",
        type: "(api: CarouselApi) => void",
        description:
          "Optional callback that receives the Embla API instance after mount for external index or dot indicators.",
      }),
      field({
        name: "aria-label",
        type: "string",
        defaultValue: "Carousel",
        description:
          'Accessible label for the root `role="region"` carousel wrapper.',
      }),
      field({
        name: "className",
        type: "string",
        description:
          'Optional class names merged onto the root `role="region"` wrapper.',
      }),
    ],
    notes: [
      "Install path is `components/ui/carousel.tsx`. Exports include `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`, `useCarousel`, `CarouselApi`, `CarouselOptions`, and `CarouselPlugin`.",
      "Navigation controls are self-contained icon buttons — no separate button registry item is required.",
      "The root region is focusable (`tabIndex={0}`) and announces the active slide through an `aria-live` region.",
      "Custom aspect ratios are applied with inline `aspect-ratio` styles so Tailwind does not need safelisted arbitrary classes.",
      'With `navPlacement="outside"` or `"responsive"` at `sm+`, add horizontal padding to the carousel wrapper so controls stay visible.',
    ],
  },
  {
    id: "carousel-content",
    title: "CarouselContent",
    summary:
      "Overflow-hidden viewport that hosts the Embla ref and the flex track of slides.",
    fields: [
      field({
        name: "className",
        type: "string",
        description:
          "Optional class names merged onto the inner flex container that holds slides.",
      }),
    ],
  },
  {
    id: "carousel-item",
    title: "CarouselItem",
    summary:
      "Single slide wrapper sized to `basis-full` with directional padding between siblings. Inactive slides are marked `aria-hidden`.",
    fields: [
      field({
        name: "className",
        type: "string",
        description: "Optional class names merged onto each slide group.",
      }),
    ],
  },
  {
    id: "carousel-navigation",
    title: "CarouselPrevious / CarouselNext",
    summary:
      "Self-contained icon buttons that call `scrollPrev` and `scrollNext` and disable when Embla cannot scroll further.",
    fields: [
      field({
        name: "className",
        type: "string",
        description:
          "Optional class names merged onto the control for local offsets or sizing.",
      }),
    ],
  },
  {
    id: "use-carousel",
    title: "useCarousel",
    summary:
      "Hook for custom indicators or synced UI. Must be used inside `Carousel`.",
    fields: [
      field({
        name: "selectedIndex",
        type: "number",
        description: "Zero-based index of the active scroll snap.",
      }),
      field({
        name: "scrollSnapCount",
        type: "number",
        description: "Total number of scroll snaps reported by Embla.",
      }),
      field({
        name: "scrollTo",
        type: "(index: number) => void",
        description: "Scrolls directly to the requested snap index.",
      }),
      field({
        name: "scrollPrev / scrollNext",
        type: "() => void",
        description: "Moves to the previous or next snap.",
      }),
      field({
        name: "api",
        type: "CarouselApi",
        description:
          "Underlying Embla API instance when you need lower-level control.",
      }),
    ],
  },
  registryItem("carousel.json", ["embla-carousel-react", "lucide-react"]),
];

const faviconBadgeApiDetails: DetailItem[] = [
  {
    id: "favicon-badge",
    title: "FaviconBadge",
    summary:
      "Inline circular badge that resolves a website favicon from a domain or URL, with an optional text label and spring entrance animation.",
    fields: [
      field({
        name: "website",
        type: "string",
        required: true,
        description:
          "Domain or full URL used to resolve the favicon. Values such as `iconiqui.com` or `https://www.iconiqui.com` are normalized to a hostname.",
      }),
      field({
        name: "label",
        type: "string",
        description:
          "Optional label rendered beside the circular favicon badge. When omitted, only the badge is shown and the domain is exposed to screen readers.",
      }),
      field({
        name: "faviconUrl",
        type: "string",
        description:
          "Optional favicon URL that bypasses Google and DuckDuckGo resolution. Use for self-hosted icons or strict CSP environments.",
      }),
      field({
        name: "faviconSize",
        type: "16 | 32 | 64 | 128",
        defaultValue: "64",
        description:
          "Pixel size requested from Google's favicon service. Higher values can improve clarity on retina displays.",
      }),
      field({
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description:
          "Visual scale for the circular favicon badge container. Label text scales with size: `text-sm` on small, `text-base` on medium, and `text-lg` on large.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the root inline-flex wrapper.",
      }),
      field({
        name: "badgeClassName",
        type: "string",
        description:
          "Merged onto the circular favicon container for local border, background, or sizing overrides.",
      }),
      field({
        name: "labelClassName",
        type: "string",
        description: "Merged onto the optional label when `label` is provided.",
      }),
      field({
        name: "onFaviconLoad",
        type: "(url: string) => void",
        description:
          "Called after a favicon URL resolves successfully, including when `faviconUrl` is provided.",
      }),
      field({
        name: "onFaviconError",
        type: "() => void",
        description:
          "Called when every provider fails or an override URL fails to load.",
      }),
    ],
    notes: [
      "Extends native `span` props (`id`, `onClick`, `data-*`, and other `aria-*` attributes) via prop spreading on the root.",
      "Favicons are resolved from Google and DuckDuckGo icon services after `extractDomain` normalizes the `website` value.",
      "While resolving, the badge shows a pulsing skeleton and sets `aria-busy` on the root. Failed resolution uses a muted globe with a destructive-tinted border.",
      "Google placeholder icons (16×16 defaults) are skipped automatically before falling back to the next provider.",
      'Favicon images use `referrerPolicy="no-referrer"` and a single in-DOM `<img>` load path to avoid duplicate network requests.',
      'When `label` is omitted, the root uses `role="img"` with an `aria-label` derived from the label, domain, or raw `website` value.',
      "Exports `extractDomain`, `getFaviconCandidates`, `getFaviconUrl`, `isLikelyDefaultFavicon`, and `FaviconBadgeSize` for reuse in search fields or attribution rows.",
      "Install path is `components/ui/favicon-badge.tsx` with named and default `FaviconBadge` exports. Requires `@/lib/utils` (`cn`).",
      "External favicon requests require `img-src` allowances for `https://www.google.com` and `https://icons.duckduckgo.com` unless `faviconUrl` is used.",
    ],
  },
  registryItem(
    "favicon-badge.json",
    ["motion", "lucide-react"],
    [
      "Requires the local `cn` helper from `@/lib/utils`, which is included in a standard shadcn setup.",
    ]
  ),
];

const verifiedBadgeApiDetails: DetailItem[] = [
  {
    id: "verified-badge",
    title: "VerifiedBadge",
    summary:
      "Inline X-style verified scallop with a check. Use shimmer or static variants, size presets, and brand/gold/neutral tones.",
    fields: [
      field({
        name: "variant",
        type: '"shimmer" | "static"',
        defaultValue: "shimmer",
        description:
          "Use `shimmer` for a sweeping highlight across the scallop or `static` for a fixed badge.",
      }),
      field({
        name: "size",
        type: '"sm" | "md" | "lg" | number',
        defaultValue: "md",
        description:
          "Preset sizes map to 18px, 22px, and 28px. Pass a number for an explicit pixel width and height.",
      }),
      field({
        name: "tone",
        type: '"brand" | "gold" | "neutral"',
        defaultValue: "brand",
        description:
          "Brand uses `--verified-badge-color` (defaults to `--ic-brand`). Gold and neutral provide alternate trust-indicator palettes.",
      }),
      field({
        name: "decorative",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, hides the badge from assistive tech. Use when visible copy already announces verification.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root span. Pass a `text-*` class to override the tone color.",
      }),
      field({
        name: "aria-label",
        type: "string",
        defaultValue: "Verified",
        description:
          "Announced to screen readers when `decorative` is false. Override when the badge conveys a different status.",
      }),
    ],
    notes: [
      "Extends native `span` props (`id`, `style`, `onClick`, `data-*`, tooltips, and other `aria-*` attributes) via prop spreading on the root.",
      "Scallop paths use `currentColor`, so tone tokens and `className` color utilities both work.",
      "The `shimmer` variant uses Motion to sweep a highlight across the scallop (0.5s pass, 1.5s pause between repeats), mounts only after hydration, and automatically falls back to static when `prefers-reduced-motion` is enabled.",
      'Non-decorative badges use `role="img"` with `aria-label`; inner SVG shapes are `aria-hidden`.',
      "Check stroke width scales with badge size for crisp rendering at `sm` through custom pixel values.",
      "Install path is `components/ui/verified-badge.tsx` with the `VerifiedBadge` export.",
    ],
  },
  registryItem("verified-badge.json", ["motion"]),
];

const toggleApiDetails: DetailItem[] = [
  {
    id: "toggle",
    title: "Toggle",
    summary:
      "Two-state button with spring press feedback and a muted fill that bounces in when pressed.",
    fields: [
      field({
        name: "pressed",
        type: "boolean",
        description:
          "Controlled pressed state. Pass this when the parent owns whether the toggle is on.",
      }),
      field({
        name: "defaultPressed",
        type: "boolean",
        defaultValue: "false",
        description:
          "Initial pressed state for uncontrolled usage. The component manages future toggles internally.",
      }),
      field({
        name: "onPressedChange",
        type: "(pressed: boolean) => void",
        description:
          "Called with the next pressed state whenever the toggle is activated or deactivated.",
      }),
      field({
        name: "variant",
        type: '"default" | "outline"',
        defaultValue: '"default"',
        description:
          "Visual treatment. Outline adds a border for toolbar or segmented layouts.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description:
          "Disables interaction and dims the control while preserving its pressed appearance.",
      }),
      field({
        name: "children",
        type: "React.ReactNode",
        description:
          "Icon, text label, or icon-plus-label content. Children sit in normal document flow so labels expand the control width naturally.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root button for local spacing, width, or color overrides.",
      }),
    ],
    notes: [
      "Use aria-label when the toggle contains only an icon. Visible text or icon-plus-label children do not need a separate aria-label.",
      "Off-state copy uses muted foreground; pressed state shifts to foreground for clearer toolbar contrast.",
      "Use className to adjust footprint for icon-only controls, such as fixed square dimensions in toolbars.",
      "Additional primitive props such as value, name, and form attributes are forwarded to the root button.",
    ],
  },
  {
    id: "toggle-motion",
    title: "Motion and interaction behavior",
    summary:
      "Pressed state drives a horizontal liquid wipe, a one-shot light sheen, and tactile icon motion.",
    notes: [
      "The muted fill wipes in from the left when pressed and retracts to the right on release with a heavy spring.",
      "Each state change sends a diagonal sheen across the surface once. Outline keeps the same outer border in both states.",
      "Icons scale and squash on press with a spring settle.",
    ],
  },
  registryItem("b-toggle.json", [
    "@base-ui/react",
    "class-variance-authority",
    "motion",
  ]),
];

const toggleGroupApiDetails: DetailItem[] = [
  {
    id: "toggle-group",
    title: "ToggleGroup",
    summary:
      "Root container for toggle buttons with shared variant, spacing, and orientation. Use spacing={0} for a connected segmented layout.",
    fields: [
      field({
        name: "type",
        type: '"single" | "multiple"',
        defaultValue: '"multiple"',
        description:
          "Radix selection mode. Multiple allows several active items by default; single keeps one pressed item at a time.",
      }),
      field({
        name: "multiple",
        type: "boolean",
        defaultValue: "true",
        description:
          "Base UI selection mode. Pass multiple={false} for single selection; true keeps several active items.",
      }),
      field({
        name: "value",
        type: "string | string[]",
        description:
          "Controlled selection. Radix uses a string in single mode and a string array in multiple mode. Base UI always uses a string array.",
      }),
      field({
        name: "defaultValue",
        type: "string | string[]",
        description:
          "Initial selection for uncontrolled usage. Match the selection mode and value shape for your installed primitive.",
      }),
      field({
        name: "onValueChange",
        type: "(value: string | string[]) => void",
        description:
          "Called with the next selection whenever an item is pressed or released.",
      }),
      field({
        name: "variant",
        type: '"default" | "outline"',
        defaultValue: '"default"',
        description:
          "Shared visual treatment applied to every item unless an item overrides it locally.",
      }),
      field({
        name: "spacing",
        type: "number",
        defaultValue: "1",
        description:
          "Gap between items in spacing units. Defaults to 1 (4px). Set to 0 for a connected outline shell with one outer border and internal dividers.",
      }),
      field({
        name: "orientation",
        type: '"horizontal" | "vertical"',
        defaultValue: '"horizontal"',
        description:
          "Layout direction for the group. Also sets aria-orientation and connected divider direction when spacing={0}.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description: "Disables the entire group and all nested items.",
      }),
      field({
        name: "aria-label",
        type: "string",
        description:
          "Accessible name for the group. Required when items are icon-only and no visible group label is present.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root group wrapper for local layout or width overrides.",
      }),
    ],
    notes: [
      "Default spacing is 4px between items. Pass spacing={0} for a connected outline shell with one outer border and internal dividers between items.",
      "Each item uses the same fluid wipe fill, sheen sweep, and icon press feedback as the standalone Toggle component.",
      "Group items inherit variant from context but can override it locally. Use className on items to adjust footprint for icon-only controls.",
      "Radix installs use type; Base UI installs use multiple. Both default to multi-select.",
    ],
  },
  {
    id: "toggle-group-item",
    title: "ToggleGroupItem",
    summary:
      "Individual toggle button inside the group with the same fluid motion as the standalone toggle.",
    fields: [
      field({
        name: "value",
        type: "string",
        required: true,
        description:
          "Stable identifier used when reading or updating the group selection.",
      }),
      field({
        name: "variant",
        type: '"default" | "outline"',
        description:
          "Optional local override for the shared group variant treatment.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description:
          "Disables this item without affecting the rest of the group.",
      }),
      field({
        name: "aria-label",
        type: "string",
        description:
          "Accessible name for icon-only items. Omit when the item already contains visible text.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the item button for local width, color, or spacing overrides.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        description: "Icon or label content rendered inside the item.",
      }),
    ],
    notes: [
      "Items share the standalone toggle fluid motion system: liquid wipe fill, sheen sweep, and icon press squeeze.",
      "Supports aria-invalid styling for form validation parity with the standalone Toggle component.",
    ],
  },
  registryItem("b-togglegroup.json", [
    "@base-ui/react",
    "class-variance-authority",
    "motion",
  ]),
];

const themeToggleApiDetails: DetailItem[] = [
  {
    id: "theme-toggle",
    title: "ThemeToggle",
    summary:
      "Client-only pill switch that toggles light and dark mode by syncing the `dark` class on `document.documentElement`, persisting to `localStorage`, and falling back to `prefers-color-scheme` when no saved preference exists.",
    fields: [
      field({
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: "md",
        description:
          "Controls track, knob, and icon dimensions. Use `sm` in compact toolbars and `lg` for hero or settings layouts.",
      }),
      field({
        name: "pressed",
        type: "boolean",
        description:
          "Controlled dark-mode state. Pair with `onPressedChange` when wiring the toggle to next-themes or another theme provider.",
      }),
      field({
        name: "defaultPressed",
        type: "boolean",
        description:
          "Initial dark-mode state for uncontrolled usage when no saved preference or system preference is available.",
      }),
      field({
        name: "onPressedChange",
        type: "(pressed: boolean) => void",
        description:
          "Called when the user toggles theme. Receives `true` for dark mode and `false` for light mode.",
      }),
      field({
        name: "persist",
        type: "boolean",
        defaultValue: "true",
        description:
          "When enabled, writes `light` or `dark` to `localStorage` using `storageKey`. Disable when an external theme layer owns persistence.",
      }),
      field({
        name: "storageKey",
        type: "string",
        defaultValue: '"theme"',
        description:
          "localStorage key used for saved theme preference. Defaults to `theme` for next-themes compatibility.",
      }),
      field({
        name: "enableSystem",
        type: "boolean",
        defaultValue: "true",
        description:
          "When no saved preference exists, resolve the initial theme from `prefers-color-scheme` and keep following system changes until the user toggles manually.",
      }),
      field({
        name: "applyToDocument",
        type: "boolean",
        defaultValue: "true",
        description:
          "When enabled, toggles the `dark` class and `color-scheme` style on `document.documentElement`. Disable for controlled integrations that already apply theme changes.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description: "Prevents interaction and dims the control.",
      }),
      field({
        name: "aria-label",
        type: "string",
        defaultValue: '"Toggle theme"',
        description: "Accessible name for the toggle button.",
      }),
      field({
        name: "id",
        type: "string",
        description: "Forwarded to the underlying toggle button.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Optional class names merged onto the root button for spacing or layout in your header or settings panel.",
      }),
      field({
        name: "trackClassName",
        type: "string",
        description: "Optional class names merged onto the outer track button.",
      }),
      field({
        name: "knobClassName",
        type: "string",
        description: "Optional class names merged onto the sliding knob.",
      }),
      field({
        name: "ref",
        type: "Ref<HTMLButtonElement>",
        description: "Ref forwarded to the rendered button element.",
      }),
    ],
    notes: [
      "On mount, the control resolves theme from `localStorage`, then `prefers-color-scheme` when `enableSystem` is true, then the existing document `dark` class.",
      "User toggles persist as `light` or `dark` in `localStorage` and stop following system changes until storage is cleared or set back to `system`.",
      "For next-themes, use controlled mode with `pressed`, `onPressedChange`, `persist={false}`, and `applyToDocument={false}`.",
      "Install path is `components/ui/theme-toggle.tsx` with the `ThemeToggle` export.",
    ],
  },
  registryItem("theme-toggle.json", ["@base-ui/react/toggle", "lucide-react"]),
];

const radialButtonApiDetails: DetailItem[] = [
  {
    id: "radial-button",
    title: "RadialButton",
    summary:
      "Ref-forwarding motion button with a radial fill, press feedback, and native form support. Hover, focus-visible, pointer-down, and keyboard activation spread the fill from the entry point.",
    fields: [
      field({
        name: "children",
        type: "React.ReactNode",
        description:
          "Button label or custom content rendered above the animated fill layer.",
      }),
      field({
        name: "type",
        type: '"button" | "submit" | "reset"',
        defaultValue: "button",
        description:
          "Native button type. Defaults to button so the control does not submit a form unless you opt in.",
      }),
      field({
        name: "loading",
        type: "boolean",
        defaultValue: "false",
        description:
          "Sets aria-busy and disables interaction while a form or async action is in progress.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description:
          "Native disabled state. Also suppresses fill, press, and ripple-like feedback.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Optional class names merged onto the root button element.",
      }),
      field({
        name: "onClick",
        type: "React.MouseEventHandler<HTMLButtonElement>",
        description: "Native click handler forwarded to the underlying button.",
      }),
      field({
        name: "name",
        type: "string",
        description: "Form field name submitted with the parent form.",
      }),
      field({
        name: "value",
        type: "string",
        description: "Optional submitted value when type is submit.",
      }),
      field({
        name: "form",
        type: "string",
        description: "Associates the button with a form element by id.",
      }),
    ],
    notes: [
      "Standard button attributes such as aria-*, autoFocus, formAction, formEncType, formMethod, formNoValidate, formTarget, and data-* are forwarded to the underlying motion.button.",
      "Pointer-down sets the fill origin at the click point and enters a pressed state; pointer-up, pointer-leave, pointer-cancel, and blur clear it.",
      "Space and Enter mirror the pressed and fill state for keyboard users. Space calls preventDefault so the page does not scroll while the button is focused.",
      "Uses card/muted surfaces in dark mode, a foreground fill in light mode, and a neutral-50 fill in dark mode so resting and filled states stay legible.",
      "Icon-only usage should include aria-label or aria-labelledby for an accessible name.",
    ],
  },
  registryItem("radial-button.json", ["motion"]),
];

const fluxButtonApiDetails: DetailItem[] = [
  {
    id: "flux-button",
    title: "FluxButton",
    summary:
      "Async button with idle, loading, and success states, plus b-button visual variants.",
    fields: [
      field({
        name: "idleLabel",
        type: "string",
        required: true,
        description: "Label shown before the action starts.",
      }),
      field({
        name: "loadingLabel",
        type: "string",
        required: true,
        description:
          "Label shown with the built-in loader while onAction is in progress.",
      }),
      field({
        name: "successLabel",
        type: "string",
        required: true,
        description: "Label shown after onAction resolves.",
      }),
      field({
        name: "successIcon",
        type: "React.ReactNode",
        description:
          "Optional icon shown on success. Pass any node, such as a Lucide checkmark. Omit for text-only success.",
      }),
      field({
        name: "onAction",
        type: "() => void | Promise<void>",
        required: true,
        description:
          "Runs when the button is pressed, drives loading and success states, then returns to idle after successHold.",
      }),
      field({
        name: "variant",
        type: '"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"',
        defaultValue: "default",
        description: "Visual style variant. Matches the b-button variant set.",
      }),
      field({
        name: "successHold",
        type: "number",
        defaultValue: "1000",
        description:
          "Milliseconds to hold the success state before returning to the idle label.",
      }),
      field({
        name: "size",
        type: '"xs" | "sm" | "default" | "lg"',
        defaultValue: "default",
        description:
          "Height and horizontal padding preset. Matches b-button sizes.",
      }),
      field({
        name: "type",
        type: '"button" | "submit"',
        defaultValue: "button",
        description:
          "Native button type. Use submit inside forms; defaults to button so the control does not submit unless you opt in.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description:
          "Native disabled state. Also blocks the action flow while true.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Optional class names merged onto the root button element.",
      }),
      field({
        name: "onClick",
        type: "React.MouseEventHandler<HTMLButtonElement>",
        description: "Native click handler forwarded to the underlying button.",
      }),
    ],
    notes: [
      "Built on `@base-ui/react/button` with a Motion render surface, matching the b-button integration pattern.",
      "Locks interaction while loading or showing success without applying disabled opacity, using aria-disabled and pointer-events-none instead.",
      "Motion transitions start only after the first click, so the button renders statically on page load.",
      "Install path is `components/ui/flux-button.tsx` with the `FluxButton` export.",
    ],
  },
  registryItem("flux-button.json", [
    "@base-ui/react/button",
    "class-variance-authority",
    "lucide-react",
    "motion",
  ]),
];

const fileTreeApiDetails: DetailItem[] = [
  {
    id: "file-tree",
    title: "FileTree",
    summary:
      "Root provider for the compound file tree. Tracks expanded folders, selection, focus, hover highlight bounds, search filtering, and shared visual settings.",
    fields: [
      field({
        name: "defaultExpandedIds",
        type: "string[]",
        defaultValue: "[]",
        description:
          "Folder node ids that should start expanded on first render.",
      }),
      field({
        name: "expandedIds",
        type: "string[] | Set<string>",
        description:
          "Controlled expanded folder ids. Pair with `onExpandedIdsChange`.",
      }),
      field({
        name: "onExpandedIdsChange",
        type: "(expandedIds: string[]) => void",
        description: "Called when expanded folder ids change.",
      }),
      field({
        name: "defaultSelectedId",
        type: "string",
        description: "Node id selected on first render in single-select mode.",
      }),
      field({
        name: "defaultSelectedIds",
        type: "string[]",
        description:
          "Node ids selected on first render in multiple-select mode.",
      }),
      field({
        name: "selectedIds",
        type: "string[] | Set<string>",
        description:
          "Controlled selected node ids. Pair with `onSelectedIdsChange`.",
      }),
      field({
        name: "onSelectedIdsChange",
        type: "(selectedIds: string[]) => void",
        description: "Called when selected node ids change.",
      }),
      field({
        name: "selectionMode",
        type: '"single" | "multiple"',
        defaultValue: '"single"',
        description:
          "Selection behavior. Multiple mode supports Cmd/Ctrl additive and Shift range selection.",
      }),
      field({
        name: "searchQuery",
        type: "string",
        defaultValue: '""',
        description:
          "Case-insensitive label filter. Matching branches auto-expand.",
      }),
      field({
        name: "highlightColor",
        type: "string",
        defaultValue: "var(--color-brand, #3b82f6)",
        description:
          "Text color applied to items with `highlight` on `FileTreeItem`.",
      }),
      field({
        name: "iconMap",
        type: "Record<string, LucideIcon>",
        description:
          "Custom extension or filename to icon map merged over built-in defaults.",
      }),
      field({
        name: "indentSize",
        type: "number",
        defaultValue: "24",
        description:
          "Horizontal indent in pixels for each nested folder level.",
      }),
      field({
        name: "maxHeight",
        type: "number | string",
        description:
          "Enables a scrollable viewport for large trees via overflow-y auto.",
      }),
      field({
        name: "showIcons",
        type: "boolean",
        defaultValue: "true",
        description:
          "Whether to render icons. File icons are inferred from the label extension when no custom icon is provided.",
      }),
      field({
        name: "truncate",
        type: "boolean",
        defaultValue: "false",
        description:
          "Truncate long labels with a native title tooltip on each row.",
      }),
      field({
        name: "onLoadChildren",
        type: "(nodeId: string) => void",
        description:
          "Called when a lazy branch with `hasChildren` opens before children are mounted.",
      }),
      field({
        name: "onNodeClick",
        type: "(nodeId: string, event?: React.MouseEvent) => void",
        description: "Called when a file or folder row is activated.",
      }),
      field({
        name: "onNodeExpand",
        type: "(nodeId: string, expanded: boolean) => void",
        description: "Called when a folder branch opens or closes.",
      }),
      field({
        name: "onNodeContextMenu",
        type: "(nodeId: string, event: React.MouseEvent) => void",
        description: "Called when a row receives a context menu event.",
      }),
      field({
        name: "onNodeDragStart",
        type: "(nodeId: string, event: React.DragEvent) => void",
        description: "Called when a draggable row starts dragging.",
      }),
      field({
        name: "onNodeDragOver",
        type: "(nodeId: string, event: React.DragEvent) => void",
        description: "Called when a drag moves over a row.",
      }),
      field({
        name: "onNodeDrop",
        type: "(nodeId: string, event: React.DragEvent) => void",
        description: "Called when a drag is dropped on a row.",
      }),
      field({
        name: "onNodeDragEnd",
        type: "(nodeId: string, event: React.DragEvent) => void",
        description: "Called when a row drag ends.",
      }),
      field({
        name: "ref",
        type: "FileTreeHandle",
        description:
          "Imperative handle with `expandAll`, `collapseAll`, and `focusNode`.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Optional class names applied to the bordered root container.",
      }),
      field({
        name: "children",
        type: "React.ReactNode",
        description:
          "Usually a single `FileTreeList` with nested `FileTreeItem` rows, or use `FileTreeFromItems`.",
      }),
    ],
    notes: [
      "Wrap `FileTreeList` and nested `FileTreeItem` components inside the root provider.",
      "Hovering or focusing a row updates a single animated highlight inside the tree container.",
      "Arrow keys, Home, End, Enter, Space, and `*` implement the WAI-ARIA tree keyboard pattern.",
    ],
  },
  {
    id: "file-tree-from-items",
    title: "FileTreeFromItems",
    summary:
      "Data-driven helper that renders a `FileTree` from an `items` array of nested node definitions.",
    fields: [
      field({
        name: "items",
        type: "FileTreeNodeData[]",
        required: true,
        description:
          "Nested node definitions with `id`, `label`, optional `children`, `icon`, `highlight`, `disabled`, and `loading`.",
      }),
      field({
        name: "...FileTreeProps",
        type: "FileTreeProps",
        description: "All `FileTree` root props are supported.",
      }),
    ],
  },
  {
    id: "file-tree-list",
    title: "FileTreeList",
    summary:
      "Semantic tree container for top-level rows. Supports Base UI `render` composition.",
    fields: [
      field({
        name: "className",
        type: "string",
        description: "Merged with the default vertical stack layout.",
      }),
      field({
        name: "render",
        type: "ReactElement | ((props) => ReactElement)",
        description:
          "Optional Base UI render override for the list container element.",
      }),
    ],
  },
  {
    id: "file-tree-item",
    title: "FileTreeItem",
    summary:
      "Single file or folder row rendered as a Base UI Button treeitem. Nested children render inside an animated branch group.",
    fields: [
      field({
        name: "nodeId",
        type: "string",
        required: true,
        description:
          "Stable unique id used for expand state, selection, callbacks, and tree semantics.",
      }),
      field({
        name: "label",
        type: "string",
        required: true,
        description:
          "Display label for the row. File extension or filename is used to pick a default icon.",
      }),
      field({
        name: "icon",
        type: "React.ReactNode",
        description: "Optional custom icon node rendered before the label.",
      }),
      field({
        name: "openIcon",
        type: "React.ReactNode",
        description:
          "Optional open-state icon for folder rows. Defaults to FolderOpen.",
      }),
      field({
        name: "hasChildren",
        type: "boolean",
        description:
          "Marks the row as a branch even when it has no nested children yet. Otherwise inferred from child items.",
      }),
      field({
        name: "loading",
        type: "boolean",
        description: "Shows a spinner icon while lazy children are loading.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description:
          "Disables row activation and removes it from keyboard focus order.",
      }),
      field({
        name: "draggable",
        type: "boolean",
        defaultValue: "false",
        description: "Enables native drag interactions on the row button.",
      }),
      field({
        name: "highlight",
        type: "boolean",
        description:
          "When true, tints the row with `highlightColor` to mark it as new or relevant.",
      }),
      field({
        name: "render",
        type: "ReactElement | ((props) => ReactElement)",
        description:
          "Optional Base UI render override for the row button element.",
      }),
      field({
        name: "children",
        type: "React.ReactNode",
        description:
          "Nested `FileTreeItem` rows rendered when the branch is expanded.",
      }),
    ],
    notes: [
      'File and folder rows both use Base UI Button with `role="treeitem"`, roving tabindex, and `aria-selected` when selected.',
      "Folder icons swap with a spring transition, and child groups animate open and closed with height and opacity motion.",
      "Respects `prefers-reduced-motion` by skipping nonessential animations.",
    ],
  },
  registryItem("file-tree.json", ["@base-ui/react", "motion", "lucide-react"]),
];

const commandPaletteApiDetails: DetailItem[] = [
  {
    id: "command-palette",
    title: "CommandPalette",
    summary:
      "Keyboard-first command menu built on Radix Dialog with grouped items, substring search, optional recent commands, async search, and keyboard navigation.",
    fields: [
      field({
        name: "groups",
        type: "CommandMenuGroupDef[]",
        defaultValue: "[]",
        description:
          "Grouped command items. Each group has a heading and an items array with label, optional href or action, icon, keywords, description, shortcut, disabled, id, and value.",
      }),
      field({
        name: "showThemeGroup",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, appends a theme group that calls next-themes setTheme. Requires ThemeProvider. Override with themeGroup for custom items.",
      }),
      field({
        name: "themeGroup",
        type: "CommandMenuGroupDef",
        description:
          "Optional custom theme group. Used when showThemeGroup is true instead of the built-in Light, Dark, and System actions.",
      }),
      field({
        name: "themeGroupHeading",
        type: "string",
        defaultValue: '"Theme"',
        description:
          "Heading for the built-in theme group when themeGroup is not provided.",
      }),
      field({
        name: "showRecentGroup",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, shows recently selected commands from localStorage or the recentItems seed list.",
      }),
      field({
        name: "recentItems",
        type: "CommandMenuItemDef[]",
        description:
          "Optional seed list for the Recent group. Selections are also persisted to localStorage.",
      }),
      field({
        name: "maxRecentItems",
        type: "number",
        defaultValue: "5",
        description: "Maximum number of recent commands to keep.",
      }),
      field({
        name: "placeholder",
        type: "string",
        defaultValue: '"Search components, pages, actions…"',
        description: "Placeholder copy for the search field.",
      }),
      field({
        name: "shortcutKey",
        type: "string",
        defaultValue: '"k"',
        description:
          "Letter used with Cmd on macOS or Ctrl elsewhere to toggle the palette globally.",
      }),
      field({
        name: "enableGlobalShortcut",
        type: "boolean",
        defaultValue: "true",
        description:
          "When false, disables the document-level Cmd/Ctrl shortcut listener.",
      }),
      field({
        name: "open",
        type: "boolean",
        description: "Controlled open state for the dialog.",
      }),
      field({
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Called when the dialog open state changes.",
      }),
      field({
        name: "onSelect",
        type: "(item: CommandMenuItemDef) => void",
        description:
          "Called when a command is selected, before navigation or action execution.",
      }),
      field({
        name: "onNavigate",
        type: "(href: string, item: CommandMenuItemDef) => void",
        description:
          "Custom navigation handler. When provided, replaces the default Next.js router.push behavior for href items.",
      }),
      field({
        name: "onSearch",
        type: "(query: string) => Promise<CommandMenuGroupDef[]>",
        description:
          "Async search callback. Returned groups are merged with static groups and debounced by searchDebounceMs.",
      }),
      field({
        name: "searchDebounceMs",
        type: "number",
        defaultValue: "200",
        description: "Debounce delay used when onSearch is provided.",
      }),
      field({
        name: "filter",
        type: "(item: CommandMenuItemDef, query: string) => boolean",
        description:
          "Custom filter function. When omitted, ranked substring matching is used across label, keywords, and description.",
      }),
      field({
        name: "contentDelay",
        type: "number",
        defaultValue: "0",
        description:
          "Milliseconds to wait before revealing the results panel after the dialog opens.",
      }),
      field({
        name: "trigger",
        type: "React.ReactNode",
        description:
          "Custom trigger node. When provided, it replaces the default search button and receives merged open handlers plus aria-expanded.",
      }),
      field({
        name: "triggerProps",
        type: "CommandMenuTriggerProps",
        description:
          "Props for the default trigger button, including label, shortcut badge visibility, and className.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the dialog content panel.",
      }),
      field({
        name: "overlayClassName",
        type: "string",
        description: "Merged onto the dialog overlay.",
      }),
      field({
        name: "positionClassName",
        type: "string",
        description:
          "Overrides the default dialog positioning classes. The default uses portable CSS variables with optional nav offset fallbacks.",
      }),
      field({
        name: "themed",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, applies the self-contained Iconiq theme token scope to the dialog surface.",
      }),
      field({
        name: "showFooterHints",
        type: "boolean",
        defaultValue: "true",
        description:
          "Shows keyboard hint badges for navigate, select, and close actions.",
      }),
      field({
        name: "emptyMessage",
        type: "string",
        defaultValue: '"No results found."',
        description: "Copy shown when the current query matches no items.",
      }),
      field({
        name: "noQueryMessage",
        type: "string",
        defaultValue: '"Start typing to search commands."',
        description:
          "Copy shown when the query is empty and no items are visible.",
      }),
      field({
        name: "loadingMessage",
        type: "string",
        defaultValue: '"Searching…"',
        description: "Copy shown while onSearch is in flight.",
      }),
      field({
        name: "currentPath",
        type: "string",
        description:
          "Optional current route override used for the Current page badge. Defaults to usePathname when available.",
      }),
      field({
        name: "closeOnRouteChange",
        type: "boolean",
        defaultValue: "true",
        description:
          "When true, closes the palette automatically on pathname changes in Next.js App Router apps.",
      }),
    ],
    notes: [
      "Items with href navigate through onNavigate when provided, otherwise Next.js router.push or router.replace.",
      "External href values and external: true open in a new tab. Items with action run a callback and close the palette.",
      "Search matches every whitespace-separated term against label, keywords, and description.",
      "Icons are optional on items — pass icon only when you want one.",
      "CommandMenuItemDef, CommandMenuTrigger, Kbd, and KbdGroup are exported for custom compositions.",
      "Requires next-themes ThemeProvider only when showThemeGroup is enabled.",
    ],
  },
  registryItem("command-palette.json", [
    "@radix-ui/react-dialog",
    "lucide-react",
    "motion",
    "next-themes",
  ]),
];

const faqProApiDetails: DetailItem[] = [
  {
    id: "faq-pro",
    title: "FaqPro",
    summary:
      "Searchable FAQ accordion with rounded cards, animated panels, query highlighting, and automatic expansion for filtered results.",
    fields: [
      field({
        name: "items",
        type: "FaqProItem[]",
        required: true,
        description:
          "Array of `{ id, question, answer, keywords?, disabled? }` entries. `answer` accepts ReactNode (string answers get highlighted and searched). Each id must be unique.",
      }),
      field({
        name: "value",
        type: "string | null",
        description:
          "Controlled open item id. Pair with onOpenChange. Use null to close all.",
      }),
      field({
        name: "onOpenChange",
        type: "(openId: string | null) => void",
        description:
          "Called whenever the open item changes, in both controlled and uncontrolled modes.",
      }),
      field({
        name: "defaultValue",
        type: "string | null",
        description:
          "Initial open item id for uncontrolled usage. Overrides defaultOpenId and defaultOpenFirst.",
      }),
      field({
        name: "defaultOpenId",
        type: "string",
        description:
          "Opens a specific item id by default when there is no active query.",
      }),
      field({
        name: "defaultOpenFirst",
        type: "boolean",
        defaultValue: "false",
        description:
          "Opens the first enabled item when there is no active search query.",
      }),
      field({
        name: "hideSearch",
        type: "boolean",
        defaultValue: "false",
        description: "Hides the search field and renders the list only.",
      }),
      field({
        name: "filter",
        type: "(item: FaqProItem, query: string) => boolean",
        description:
          "Custom match predicate. Overrides the built-in multi-term substring search.",
      }),
      field({
        name: "onQueryChange",
        type: "(query: string) => void",
        description: "Called whenever the search query changes.",
      }),
      field({
        name: "searchPlaceholder",
        type: "string",
        defaultValue: "Search FAQs...",
        description: "Placeholder and accessible label for the search field.",
      }),
      field({
        name: "emptyMessage",
        type: "string",
        defaultValue: "No FAQs to show yet.",
        description: "Message shown when there are no items at all.",
      }),
      field({
        name: "noResultsMessage",
        type: "string",
        defaultValue: "No FAQs match your search.",
        description: "Message shown when a query returns no matches.",
      }),
      field({
        name: "themed",
        type: "boolean",
        defaultValue: "true",
        description:
          "Applies the built-in light/dark token surface. Set false to inherit your app tokens.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Optional class names applied to the root container.",
      }),
    ],
    notes: [
      "Search matches all whitespace-separated terms (AND) against question, string answers, and keywords.",
      "The first matching row opens automatically while you type; clearing the query restores the default open state.",
      "Only one FAQ panel can be open at a time. Respects prefers-reduced-motion for animations.",
      "Matched substrings render inside a highlight mark in the question and string answers.",
      "Rows expose data-slot attributes (faq-pro, faq-pro-item, faq-pro-trigger, faq-pro-panel) for styling.",
    ],
  },
  registryItem("faq-pro.json", [
    "@base-ui/react/accordion",
    "motion",
    "lucide-react",
  ]),
];

const sliderApiDetails: DetailItem[] = [
  {
    id: "slider",
    title: "Slider",
    summary:
      "Pointer-driven range control with optional single or dual-thumb value management, field chrome, and formatting helpers.",
    fields: [
      field({
        name: "value",
        type: "number | [number, number]",
        description:
          "Controlled value. Use a number for single-thumb mode or a tuple when range is enabled.",
      }),
      field({
        name: "defaultValue",
        type: "number | [number, number]",
        defaultValue: "50",
        description:
          "Initial internal value used when value is not supplied. Defaults to [25, 75] when range is true.",
      }),
      field({
        name: "range",
        type: "boolean",
        defaultValue: "false",
        description:
          "Renders two thumbs and fills the track between the low and high values.",
      }),
      field({
        name: "min",
        type: "number",
        defaultValue: "0",
        description: "Lower bound used for clamping and display mapping.",
      }),
      field({
        name: "max",
        type: "number",
        defaultValue: "100",
        description: "Upper bound used for clamping and display mapping.",
      }),
      field({
        name: "step",
        type: "number",
        defaultValue: "1",
        description:
          "Step size applied after translating pointer position into a raw numeric value.",
      }),
      field({
        name: "onChange",
        type: "(value: number | [number, number]) => void",
        description:
          "Called for live value updates from pointer or keyboard input when the snapped value actually changes.",
      }),
      field({
        name: "onValueCommit",
        type: "(value: number | [number, number]) => void",
        description:
          "Called when an interaction is committed, such as releasing a drag or finishing a keyboard step.",
      }),
      field({
        name: "showValue",
        type: "boolean",
        defaultValue: "true",
        description:
          "Controls whether the live numeric readout is shown on the right side of the label row.",
      }),
      field({
        name: "valueDecimals",
        type: "number",
        defaultValue: "0",
        description:
          "Controls how many decimal places are shown in the readout when you want precision without custom formatting.",
      }),
      field({
        name: "formatValue",
        type: "(value: number) => string",
        description:
          "Optional formatter for the visible readout and aria-valuetext, useful for units such as dB, percent, or milliseconds.",
      }),
      field({
        name: "label",
        type: "string",
        description:
          "Optional label shown on the left side of the header row above the track.",
      }),
      field({
        name: "description",
        type: "ReactNode",
        description:
          "Optional helper text rendered below the track and linked through aria-describedby.",
      }),
      field({
        name: "errorMessage",
        type: "ReactNode",
        description:
          "Validation message rendered below the track with alert semantics when present.",
      }),
      field({
        name: "invalid",
        type: "boolean",
        description:
          "Marks the slider as invalid for assistive tech even when no errorMessage is rendered.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description:
          "Prevents interaction, removes the slider from tab order, and applies disabled styling.",
      }),
      field({
        name: "readOnly",
        type: "boolean",
        defaultValue: "false",
        description:
          "Keeps the slider focusable while blocking pointer and keyboard value changes.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root wrapper so you can constrain width, spacing, or layout.",
      }),
      field({
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: "md",
        description:
          "Scales the hit area, thumb, and track thickness together while preserving the default md footprint.",
      }),
      field({
        name: "inverted",
        type: "boolean",
        defaultValue: "false",
        description:
          "Reverses pointer and keyboard direction. RTL documents also reverse horizontal pointer mapping.",
      }),
      field({
        name: "marksInteractive",
        type: "boolean",
        defaultValue: "false",
        description:
          "Turns tick marks into buttons that jump the nearest thumb to the mark value.",
      }),
      field({
        name: "name",
        type: "string",
        description:
          "When provided, renders hidden inputs so the current value can participate in native form submission.",
      }),
      field({
        name: "id",
        type: "string",
        description:
          "Optional id applied to the focusable slider element and used to derive description and error ids.",
      }),
      field({
        name: "ariaLabel",
        type: "string",
        description:
          "Accessible name used when no visible label is rendered for the slider. Falls back to Slider.",
      }),
      field({
        name: "ariaLabelledBy",
        type: "string",
        description:
          "ID of an external label element that should be announced instead of the built-in label.",
      }),
      field({
        name: "ariaDescribedBy",
        type: "string",
        description:
          "Additional ids merged into aria-describedby alongside description and errorMessage.",
      }),
      field({
        name: "marks",
        type: "{ value: number; label?: string }[]",
        description:
          "Optional tick marks rendered below or beside the track so large ranges can include landmarks like Low, Medium, and High.",
      }),
    ],
    notes: [
      "When value is undefined, the component stores the current value internally and updates it during drag operations.",
      "The displayed value is derived from the animated motion value, so the readout stays in sync with the spring animation rather than jumping immediately.",
      "Touch interaction keeps vertical page scrolling available with pan-y on horizontal sliders while still supporting dragging on the track itself.",
      "Spring motion honors prefers-reduced-motion and settles instantly when reduced motion is requested.",
    ],
  },
  {
    id: "slider-interaction",
    title: "Interaction model",
    summary:
      "Slider supports pointer, keyboard, and screen-reader friendly range semantics.",
    notes: [
      "The thumb and filled track animate with springs whenever the current value changes.",
      "Pointer capture is taken on pointer down and released on pointer up or cancel, which keeps dragging stable even when the pointer leaves the track.",
      "Keyboard support includes Arrow keys for step changes, Page Up and Page Down for larger jumps, and Home and End for min and max.",
      "Range mode tracks an active thumb during keyboard and pointer interaction so the nearest endpoint moves first.",
    ],
  },
  registryItem("slider.json", ["motion"]),
];

const spinnerApiDetails: DetailItem[] = [
  {
    id: "spinner",
    title: "Spinner",
    summary:
      "Default export for a lightweight loading indicator with ring, dots, or matrix variants, size presets, and accessibility controls.",
    fields: [
      field({
        name: "variant",
        type: '"ring" | "dots" | "matrix"',
        defaultValue: "ring",
        description:
          "Chooses between the rotating ring, three bouncing dots, or a square dot-matrix sweep.",
      }),
      field({
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: "md",
        description:
          "Scales the spinner footprint and ring border thickness together.",
      }),
      field({
        name: "decorative",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, hides the spinner from assistive tech so a parent can announce loading once.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root span so you can fine-tune color, spacing, or layout with Tailwind utilities.",
      }),
    ],
    notes: [
      'The root element is a span with role="status" when the spinner announces loading on its own.',
      "Use decorative spinners inside buttons or busy containers that already expose aria-busy and aria-label.",
      "Ring, dots, and matrix variants share the same ref, DOM prop forwarding, and accessibility resolver.",
      "Matrix renders a fixed 5x5 dot grid with a smooth diagonal wave driven by phase-offset CSS animation.",
      "Prefer size over manual width classes so border thickness stays proportional.",
    ],
  },
  registryItem("spinner.json", ["motion"]),
];

const statusDotApiDetails: DetailItem[] = [
  {
    id: "status-dot",
    title: "StatusDot",
    summary:
      "Inline status indicator with optional rippling halo, deployment presets, generic tones, and dot-only accessibility defaults.",
    fields: [
      field({
        name: "state",
        type: '"QUEUED" | "BUILDING" | "ERROR" | "READY" | "CANCELED"',
        description:
          "Deployment preset that maps to tone, default label, and default animation. Use this or `tone`.",
      }),
      field({
        name: "tone",
        type: '"neutral" | "active" | "success" | "warning" | "error"',
        description:
          "Generic presence tone when you do not need deployment vocabulary. Use this or `state`.",
      }),
      field({
        name: "showLabel",
        type: "boolean",
        defaultValue: "false",
        description:
          "Shows visible label text beside the dot. Defaults to dot-only for inline copy.",
      }),
      field({
        name: "label",
        type: "string",
        description:
          "Optional label override used for visible copy and screen reader naming.",
      }),
      field({
        name: "animate",
        type: "boolean",
        description:
          'Overrides ripple animation. Defaults to active states only, such as `BUILDING` or `tone="active"`.',
      }),
      field({
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "Scales the dot, ripple spread, and hit area together.",
      }),
      field({
        name: "inline",
        type: "boolean",
        defaultValue: "true",
        description:
          "Uses an inline-flex root for embedding inside sentences and compact rows.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Classes applied to the root element.",
      }),
      field({
        name: "labelClassName",
        type: "string",
        description:
          "Classes applied to the visible label when `showLabel` is enabled.",
      }),
    ],
    notes: [
      'Dot-only mode announces changes with `role="status"` and `aria-live="polite"`.',
      "Colors use embedded Iconiq CSS variables, so the dot works after registry install without extra theme setup.",
      "Ripple motion uses CSS keyframes and disables when `prefers-reduced-motion: reduce` is enabled.",
      "Use `getStatusDotConfig`, `statusDotStates`, and `statusDotStateConfig` when mapping app data to presets.",
    ],
  },
  registryItem("status-dot.json", []),
];

const timezoneApiDetails: DetailItem[] = [
  {
    id: "timezone",
    title: "Timezone",
    summary:
      "Inline live clock that resolves friendly city names or IANA timezone strings, then animates digit changes with fluid spring rolls and pulsing separators.",
    fields: [
      field({
        name: "zone",
        type: "string",
        required: true,
        description:
          "City alias such as `San Francisco`, common shorthand like `NYC`, region/city IANA paths such as `Africa/Cairo`, or any of the 400+ IANA timezones from `Intl.supportedValuesOf('timeZone')`.",
      }),
      field({
        name: "format",
        type: '"12h" | "24h"',
        defaultValue: '"12h"',
        description:
          "Controls whether the clock renders with a 12-hour or 24-hour display.",
      }),
      field({
        name: "showZoneLabel",
        type: "boolean",
        defaultValue: "true",
        description: "When true, appends a timezone label after the clock.",
      }),
      field({
        name: "showAbbreviation",
        type: "boolean",
        defaultValue: "true",
        description:
          "Deprecated alias for `showZoneLabel`. Prefer `showZoneLabel` in new code.",
      }),
      field({
        name: "zoneName",
        type: '"abbreviation" | "offset"',
        defaultValue: '"abbreviation"',
        description:
          "Controls the label style when `showZoneLabel` is true. `abbreviation` renders IST, EST, or PST. `offset` renders GMT-style labels such as GMT+5:30.",
      }),
      field({
        name: "live",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, updates every second and includes seconds in the formatted output.",
      }),
      field({
        name: "locale",
        type: "string",
        defaultValue: '"en-US"',
        description:
          "Locale passed to `Intl.DateTimeFormat` for number and time formatting.",
      }),
      field({
        name: "fallback",
        type: "ReactNode",
        description:
          "Custom content rendered when `zone` cannot be resolved. Defaults to `Unknown timezone: {zone}`.",
      }),
      field({
        name: "onError",
        type: "(zone: string) => void",
        description:
          "Called when `zone` cannot be resolved. Useful for logging or analytics.",
      }),
      field({
        name: "animate",
        type: "boolean",
        defaultValue: "true",
        description:
          "When false, disables digit and separator motion even if reduced motion is off.",
      }),
      field({
        name: "ariaLive",
        type: 'boolean | "polite" | "assertive" | "off"',
        description:
          "Adds `aria-live` to a screen-reader-only layer. Defaults to `polite` for minute clocks and off for `live` second clocks.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Optional class names applied to the rendered `time` element.",
      }),
    ],
    notes: [
      "City aliases normalize spacing and casing, so values like `San fransico` still resolve to `America/Los_Angeles`.",
      "Curated aliases such as `portland`, `la`, and `uk` intentionally resolve to specific regional zones and may not match every user expectation.",
      "Use `resolveTimezone(zone)` to validate user input and `getWorldTimezones()` to list every IANA timezone from the current runtime.",
      "All IANA timezones from the runtime environment are indexed automatically, including full paths like `Pacific/Kiritimati` and unique city slugs like `Africa/Abidjan`.",
      "The clock uses `suppressHydrationWarning` and client-side ticking so SSR and hydration stay stable in Next.js apps.",
      "Multiple clocks share one global minute or second timer and pause while the document is hidden.",
      "Digit motion and zone transitions automatically disable when `prefers-reduced-motion: reduce` is enabled.",
      "Digit rolls use transform and opacity only so Safari and other WebKit browsers avoid filter-blur compositing glitches.",
      "Colon separators pulse in `live` mode. The visual layer is `aria-hidden` when `ariaLive` is enabled.",
      "The component renders a semantic `time` element with a machine-readable `dateTime` value in the target timezone.",
      "By default the clock refreshes once per minute. Pass `live` for second-level updates in dashboards or hero copy.",
      "Unknown zones render a compact destructive fallback label instead of throwing during render.",
    ],
  },
  registryItem("timezone.json", ["motion"]),
];

const rollingDigitsApiDetails: DetailItem[] = [
  {
    id: "rolling-digits",
    title: "RollingDigits",
    summary:
      "Inline animated counter that swaps digits with spring-driven transform, opacity, and vertical motion while exiting the previous character.",
    fields: [
      field({
        name: "value",
        type: "number",
        required: true,
        description:
          "Target number to display. The component rounds to the nearest integer before formatting.",
      }),
      field({
        name: "pad",
        type: "number",
        description:
          "Minimum digit count. Applied with `padStart` for plain numbers, or through `minimumIntegerDigits` when `locale` is enabled.",
      }),
      field({
        name: "animationDelay",
        type: "number",
        defaultValue: "80",
        description:
          "Milliseconds between queued value steps when `value` changes faster than the animation can finish.",
      }),
      field({
        name: "stagger",
        type: "number",
        description:
          "Deprecated. Seconds between queued steps. Use `animationDelay` in milliseconds instead.",
      }),
      field({
        name: "coalesceUpdates",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, rapid `value` updates replace the pending queue with the latest value instead of stepping through every intermediate update.",
      }),
      field({
        name: "onAnimationComplete",
        type: "() => void",
        description:
          "Called when the displayed value catches up to the latest `value` prop.",
      }),
      field({
        name: "ariaLive",
        type: 'boolean | "polite" | "assertive" | "off"',
        defaultValue: "true",
        description:
          "Controls `aria-live` on the screen-reader layer. `true` maps to `polite`; `false` and `off` disable announcements.",
      }),
      field({
        name: "startOnView",
        type: "boolean",
        defaultValue: "true",
        description:
          "When true, playback waits until the component enters the viewport once before animating from zero.",
      }),
      field({
        name: "locale",
        type: "true | string | Intl.NumberFormatOptions",
        description:
          "Locale formatting. `locale` uses the runtime default locale, a string sets the locale tag, and an object is passed to `Intl.NumberFormat`. When combined with `pad`, padding is applied through `minimumIntegerDigits`.",
      }),
      field({
        name: "format",
        type: "(value: number) => string",
        description:
          "Custom formatter that runs after rounding. Overrides `locale` when both are provided.",
      }),
      field({
        name: "gap",
        type: "number",
        defaultValue: "2",
        description: "Pixel gap between rendered characters in the digit row.",
      }),
      field({
        name: "direction",
        type: '"dynamic" | "up" | "down"',
        defaultValue: "dynamic",
        description:
          "Controls whether incoming digits slide up or down. `dynamic` compares the previous and next digit values.",
      }),
      field({
        name: "enterStiffness",
        type: "number",
        defaultValue: "170",
        description: "Spring stiffness for incoming digit motion.",
      }),
      field({
        name: "enterDamping",
        type: "number",
        defaultValue: "10",
        description: "Spring damping for incoming digit motion.",
      }),
      field({
        name: "exitStiffness",
        type: "number",
        defaultValue: "170",
        description: "Spring stiffness for outgoing digit motion.",
      }),
      field({
        name: "exitDamping",
        type: "number",
        defaultValue: "15",
        description: "Spring damping for outgoing digit motion.",
      }),
      field({
        name: "enterY",
        type: "number",
        defaultValue: "32",
        description: "Vertical offset in pixels used when a digit enters.",
      }),
      field({
        name: "enterBlur",
        type: "number",
        description:
          "Deprecated. Blur is no longer applied; digit motion uses transform and opacity for Safari-safe rendering.",
      }),
      field({
        name: "enterScale",
        type: "number",
        defaultValue: "0.84",
        description: "Starting scale applied when a digit enters.",
      }),
      field({
        name: "exitScale",
        type: "number",
        defaultValue: "0.84",
        description: "Ending scale applied when a digit exits.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the outer inline-flex span that wraps the readable and visual layers.",
      }),
      field({
        name: "digitClassName",
        type: "string",
        description:
          "Merged onto each animated digit cell wrapper for per-digit styling.",
      }),
    ],
    notes: [
      "Export `RollingDigitsText` when you already have a formatted string such as `12:34:56`.",
      "Non-digit characters from locale separators or custom formatters render as static spans and do not animate.",
      "The visual layer is `aria-hidden`; screen readers receive the formatted number through an `sr-only` span with `aria-live`.",
      "When `startOnView` is enabled, the ticker displays zero until the container crosses the viewport threshold (`once: true`, `amount: 0.6`).",
      "Digit positions use right-aligned stable keys so rolls stay tied to place value when separators appear.",
      "Digit rolls use transform and opacity only so Safari and other WebKit browsers avoid filter-blur compositing glitches.",
      "Layer symbols such as `%` or `$` beside the component in your layout, or include them through `format`.",
    ],
  },
  registryItem("rolling-digits.json", ["motion"]),
];

const skeletonApiDetails: DetailItem[] = [
  {
    id: "skeleton",
    title: "Skeleton",
    summary:
      "Loading placeholder that renders a muted block with shimmer or fade animation, sensible defaults, and preset helpers for common shapes.",
    fields: [
      field({
        name: "variant",
        type: '"shimmer" | "fade"',
        defaultValue: "shimmer",
        description:
          "Chooses between the moving shimmer sweep and a softer opacity fade.",
      }),
      field({
        name: "rounded",
        type: '"none" | "sm" | "md" | "lg" | "full"',
        defaultValue: "md",
        description:
          "Chooses the corner radius utility applied to the placeholder surface.",
      }),
      field({
        name: "animate",
        type: "boolean",
        defaultValue: "true",
        description:
          "Controls whether the selected animation variant is rendered. Set it to false for a static loading block.",
      }),
      field({
        name: "duration",
        type: "number",
        defaultValue: "1.6",
        description:
          "Animation cycle duration in seconds. Defaults to 1.6s for shimmer and 2.4s for fade.",
      }),
      field({
        name: "decorative",
        type: "boolean",
        defaultValue: "true",
        description:
          "When true, the skeleton is hidden from assistive tech so grouped placeholders do not repeat loading announcements.",
      }),
      field({
        name: "label",
        type: "string | null",
        description:
          "Accessible label used when `decorative={false}`. Pass `null` to force a hidden decorative skeleton.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root div so you can control width, height, spacing, colors, and any extra local styling.",
      }),
      field({
        name: "HTML div props",
        type: "HTMLAttributes<HTMLDivElement>",
        description:
          "Standard div attributes such as style, data-*, aria-*, id, and event handlers are forwarded to the root element.",
      }),
    ],
    notes: [
      "The root defaults to `h-4 w-full`, so skeletons work without extra sizing for simple text lines.",
      'Decorative skeletons render `aria-hidden`. Standalone loading blocks can set `decorative={false}` to expose `role="status"`, `aria-live="polite"`, and a label.',
      "Theme tokens are embedded on the root node, so colors resolve out of the box without installing iconiq-theme separately.",
      "Shimmer and fade styles are injected once on the client through a scoped keyframe helper, so lists of skeletons do not duplicate `<style>` tags.",
      "Animations pause automatically when `prefers-reduced-motion: reduce` is enabled.",
      "Preset exports `SkeletonAvatar`, `SkeletonText`, and `SkeletonButton` cover the most common placeholder shapes.",
      "`ShimmerSkeleton` remains available as a backwards-compatible alias.",
    ],
  },
  {
    id: "skeleton-presets",
    title: "Preset helpers",
    summary:
      "Opinionated wrappers around the base skeleton for avatar, text-line, and button placeholders.",
    fields: [
      field({
        name: "SkeletonAvatar",
        type: "Component",
        description: "Renders a circular `size-10` avatar placeholder.",
      }),
      field({
        name: "SkeletonText",
        type: "Component",
        description: "Renders a `h-3` text-line placeholder.",
      }),
      field({
        name: "SkeletonButton",
        type: "Component",
        description:
          'Renders a `h-9 w-24` button placeholder with `rounded="lg"`.',
      }),
    ],
    notes: [
      "Each preset accepts the same props as `Skeleton` except where the shape is fixed by the helper.",
    ],
  },
  registryItem(
    "skeleton.json",
    [],
    [
      "No runtime dependencies beyond React.",
      "Requires the standard shadcn `cn` helper from `@/lib/utils` (clsx + tailwind-merge).",
    ]
  ),
];

const tabsApiDetails: DetailItem[] = [
  {
    id: "tabs",
    title: "Tabs",
    summary:
      "Radix tabs root with theme fallbacks, measured indicator motion, optional content transitions, and controlled or uncontrolled state with safe fallbacks.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Compose TabsList, TabsTrigger, and TabsContent inside the root.",
      }),
      field({
        name: "defaultValue",
        type: "string",
        description:
          "Initial active tab for uncontrolled usage. Falls back to the first TabsContent value when omitted or invalid.",
      }),
      field({
        name: "value",
        type: "string",
        description:
          "Controlled active tab value. Invalid values fall back to the first TabsContent value in development with a console warning.",
      }),
      field({
        name: "onValueChange",
        type: "(value: string) => void",
        description:
          "Called when a trigger activates a different tab through click or keyboard interaction.",
      }),
      field({
        name: "variant",
        type: '"pill" | "underline"',
        defaultValue: '"pill"',
        description:
          "Switches between the segmented pill rail and the underline indicator treatment.",
      }),
      field({
        name: "animateContent",
        type: "boolean",
        defaultValue: "false",
        description:
          "Applies a short fade-and-rise transition to the active panel body. Respects reduced-motion preferences.",
      }),
      field({
        name: "orientation",
        type: '"horizontal" | "vertical"',
        defaultValue: '"horizontal"',
        description:
          "Radix orientation forwarded to the list and content layout. Vertical roots render as a flex row with the list beside the panel.",
      }),
      field({
        name: "activationMode",
        type: '"automatic" | "manual"',
        defaultValue: '"automatic"',
        description:
          "Radix activation mode. Manual keeps focus and selection separate until Enter or Space.",
      }),
      field({
        name: "dir",
        type: '"ltr" | "rtl"',
        description: "Radix text direction for keyboard navigation order.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the Radix tabs root wrapper.",
      }),
    ],
    notes: [
      "Each Tabs instance scopes trigger and content ids from a unique base id for aria-controls wiring.",
      "Use controlled state with value and onValueChange, or pass defaultValue for uncontrolled usage.",
      "Reduced-motion users receive instant indicator transitions instead of spring motion.",
    ],
  },
  {
    id: "tabs-list",
    title: "TabsList",
    summary:
      "Scrollable trigger rail with a measured motion indicator for pill or underline variants.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        description: "Usually a row of TabsTrigger elements.",
      }),
      field({
        name: "fullWidth",
        type: "boolean",
        defaultValue: "false",
        description:
          "Stretches the list to the container width instead of fitting the trigger row.",
      }),
      field({
        name: "loop",
        type: "boolean",
        defaultValue: "true",
        description:
          "Radix loop behavior for keyboard navigation across the first and last triggers.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the trigger rail element.",
      }),
    ],
    notes: [
      "Uses horizontal overflow scrolling for long tab sets instead of clipping triggers.",
      "A ResizeObserver keeps the active indicator aligned when labels or icons change size.",
    ],
  },
  {
    id: "tabs-trigger",
    title: "TabsTrigger",
    summary:
      "Interactive tab button with optional icon and badge slots, token-based colors, and measured active-state treatment.",
    fields: [
      field({
        name: "value",
        type: "string",
        required: true,
        description:
          "Unique tab identifier used for active state and content matching.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Label content rendered inside the trigger button.",
      }),
      field({
        name: "icon",
        type: "ReactNode",
        description:
          "Optional leading icon rendered before the label with consistent sizing.",
      }),
      field({
        name: "badge",
        type: "ReactNode",
        description: "Optional trailing badge such as a count or status chip.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the trigger button for local spacing, typography, or state overrides.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description:
          "Prevents the trigger from receiving focus or changing the active tab.",
      }),
    ],
    notes: [
      "The active trigger indicator is rendered in TabsList and positioned with ResizeObserver measurements.",
      "Pill triggers use foreground-on-background label contrast instead of mix-blend tricks.",
    ],
  },
  {
    id: "tabs-content",
    title: "TabsContent",
    summary:
      "Radix content panel tied to a matching trigger value below or beside the tab list.",
    fields: [
      field({
        name: "value",
        type: "string",
        required: true,
        description: "Matches the corresponding TabsTrigger value.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Panel body shown when the content value is active.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the rendered content panel element.",
      }),
      field({
        name: "forceMount",
        type: "boolean",
        description:
          "Keeps the panel mounted while inactive. Useful for preserving form state or SSR-friendly markup.",
      }),
    ],
    notes: [
      "Radix handles mounting and visibility for the active panel.",
      "When animateContent is enabled on Tabs, the active panel body receives a short motion transition.",
    ],
  },
  registryItem("tabs.json", ["@radix-ui/react-tabs", "motion"]),
];

const tableApiDetails: DetailItem[] = [
  {
    id: "table",
    title: "Table",
    summary:
      "Root provider for the animated table primitives. It sets the shared column template so header and body rows stay aligned.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Compose TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, and optional helper primitives inside the root.",
      }),
      field({
        name: "columns",
        type: "string",
        defaultValue:
          '"minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)"',
        description:
          "Shared grid-template-columns value applied to every header and body row so the native table semantics still keep the custom grid layout aligned.",
      }),
      field({
        name: "size",
        type: '"default" | "compact"',
        defaultValue: "default",
        description:
          "Controls row density by tightening header and body cell padding across the table.",
      }),
      field({
        name: "stickyHeader",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, TableHeader stays pinned while the surrounding scroll container moves.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the native table element when you need to adjust width, spacing, or placement.",
      }),
    ],
    notes: [
      "The canonical JSX export is `Table`, and the lowercase `table` alias still ships for backward compatibility.",
      "The file also exports `TABLE_DEFAULT_COLUMNS`, `TableAlign`, `TableRowVariant`, `TableSize`, `TableSortDirection`, and `TableSortState` for stronger TypeScript reuse in app code.",
      "The registry component no longer owns demo data, search state, or add/remove actions. Those behaviors are expected to live in app code.",
      "In development, TableRow warns when the rendered cell count does not match the configured columns string.",
    ],
  },
  {
    id: "table-toolbar",
    title: "TableToolbar",
    summary:
      "Optional layout helper for the control row above the table, matching the original spacing and alignment treatment.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Usually a search field, actions, filters, or bulk controls placed above the table.",
      }),
      field({
        name: "tableId",
        type: "string",
        description:
          "Optional id of the related table, exposed through aria-controls for toolbar controls.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the toolbar wrapper.",
      }),
    ],
  },
  {
    id: "table-header",
    title: "TableHeader",
    summary:
      "Native table head wrapper for the column labels and sort controls.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Usually one header TableRow.",
      }),
      field({
        name: "sticky",
        type: "boolean",
        description:
          "Overrides the root stickyHeader setting for this header section.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the header wrapper.",
      }),
    ],
  },
  {
    id: "table-body",
    title: "TableBody",
    summary:
      "Native table body wrapper that adds LayoutGroup and AnimatePresence so row insertions, removals, and reordering stay animated.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "One or more TableRow elements, plus optional TableEmpty or TableLoading when no rows are visible or data is still loading.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the body wrapper.",
      }),
    ],
    notes: [
      "Exit animations for removed rows only run when body rows are rendered as direct children of TableBody.",
      "Row motion respects prefers-reduced-motion automatically.",
    ],
  },
  {
    id: "table-footer",
    title: "TableFooter",
    summary:
      "Native table footer wrapper for totals, pagination, and bulk actions below the body rows.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Usually one footer TableRow containing TablePagination or summary cells.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the footer wrapper.",
      }),
    ],
  },
  {
    id: "table-row",
    title: "TableRow",
    summary:
      "Motion-enabled native table row used for both header and body layouts.",
    fields: [
      field({
        name: "variant",
        type: '"header" | "body"',
        defaultValue: "body",
        description:
          "Header rows skip mount and exit motion, while body rows keep the original motion defaults.",
      }),
      field({
        name: "index",
        type: "number",
        defaultValue: "0",
        description:
          "Optional row index used to apply a subtle stagger to body row entry motion.",
      }),
      field({
        name: "hoverable",
        type: "boolean",
        description:
          "When true, body rows get the muted hover wash. Defaults to false so informational rows do not imply clickability.",
      }),
      field({
        name: "selected",
        type: "boolean",
        defaultValue: "false",
        description:
          'Applies selected styling and exposes data-state="selected" for active row selection.',
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the row shell for spacing or color overrides.",
      }),
      field({
        name: "Motion tr props",
        type: "ComponentPropsWithoutRef<typeof motion.tr>",
        description:
          "Additional motion.tr props such as layout, transition, whileHover, and exit can still be passed directly.",
      }),
    ],
    notes: [
      "Every row reads the shared columns string from Table and applies it as grid-template-columns.",
      'Rows expose `data-slot="table-row"`, plus `data-variant`, `data-hoverable`, and `data-selected`, which makes local styling overrides easier after installation.',
    ],
  },
  {
    id: "table-head",
    title: "TableHead",
    summary:
      "Native header cell wrapper for labels, sort buttons, and aligned controls.",
    fields: [
      field({
        name: "align",
        type: '"left" | "center" | "right"',
        defaultValue: "left",
        description:
          "Controls left, center, or right alignment for the header cell content.",
      }),
      field({
        name: "sortDirection",
        type: '"asc" | "desc" | "none"',
        description:
          'Explicit aria-sort source for sortable columns. Pass "none" on inactive sortable headers.',
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Header label or a custom control such as TableSortButton.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the header cell wrapper.",
      }),
    ],
  },
  {
    id: "table-cell",
    title: "TableCell",
    summary:
      "Native body cell wrapper for row content, status pills, numeric values, and row actions.",
    fields: [
      field({
        name: "align",
        type: '"left" | "center" | "right"',
        defaultValue: "left",
        description:
          "Controls left, center, or right alignment for the cell content.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Rendered cell content.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the cell wrapper.",
      }),
    ],
  },
  {
    id: "table-select-head",
    title: "TableSelectHead",
    summary:
      "Checkbox header cell helper for select-all row selection columns.",
    fields: [
      field({
        name: "checked",
        type: "boolean",
        defaultValue: "false",
        description: "Controlled checked state for the select-all checkbox.",
      }),
      field({
        name: "indeterminate",
        type: "boolean",
        defaultValue: "false",
        description:
          "Shows the mixed selection state when only some visible rows are selected.",
      }),
      field({
        name: "onCheckedChange",
        type: "(checked: boolean) => void",
        description: "Called when the select-all checkbox toggles.",
      }),
      field({
        name: "aria-label",
        type: "string",
        defaultValue: '"Select all rows"',
        description: "Accessible name for the select-all checkbox.",
      }),
    ],
  },
  {
    id: "table-select-cell",
    title: "TableSelectCell",
    summary: "Checkbox body cell helper for per-row selection columns.",
    fields: [
      field({
        name: "checked",
        type: "boolean",
        defaultValue: "false",
        description: "Controlled checked state for the row checkbox.",
      }),
      field({
        name: "onCheckedChange",
        type: "(checked: boolean) => void",
        description: "Called when the row checkbox toggles.",
      }),
      field({
        name: "aria-label",
        type: "string",
        required: true,
        description:
          "Accessible name for the row checkbox, such as the row title.",
      }),
    ],
  },
  {
    id: "table-caption",
    title: "TableCaption",
    summary:
      "Low-emphasis native table caption below the table, matching the original entry count styling.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Caption copy, summary text, or count information.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the caption paragraph.",
      }),
    ],
  },
  {
    id: "table-empty",
    title: "TableEmpty",
    summary:
      "Animated empty-state row for zero-result or no-data states inside TableBody.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Empty-state copy or a richer no-data message.",
      }),
      field({
        name: "colSpan",
        type: "number",
        description:
          "Overrides the automatically derived column span when the empty row should cover a different number of columns.",
      }),
      field({
        name: "Motion tr props",
        type: "ComponentPropsWithoutRef<typeof motion.tr>",
        description:
          "You can still override animate, initial, transition, or className when customizing the empty state row.",
      }),
    ],
    notes: [
      "The empty row uses the same grid column template as body rows so the message stays aligned with the table layout.",
    ],
  },
  {
    id: "table-loading",
    title: "TableLoading",
    summary:
      "Placeholder body rows with pulse bars for async loading states inside TableBody.",
    fields: [
      field({
        name: "rows",
        type: "number",
        defaultValue: "3",
        description: "Number of placeholder rows to render.",
      }),
      field({
        name: "TableRow props",
        type: 'Omit<TableRowProps, "children" | "variant">',
        description:
          "Optional TableRow props such as index or className passed to each loading row.",
      }),
    ],
  },
  {
    id: "table-sort-button",
    title: "TableSortButton",
    summary:
      "Optional header helper with a larger hit area, clearer active state, and direction animation.",
    fields: [
      field({
        name: "active",
        type: "boolean",
        defaultValue: "false",
        description:
          "Strengthens the visual treatment and enables the active sort direction state for the parent column header.",
      }),
      field({
        name: "direction",
        type: '"asc" | "desc"',
        defaultValue: "asc",
        description:
          "Rotates the chevron when the current active sort direction is descending.",
      }),
      field({
        name: "align",
        type: '"left" | "center" | "right"',
        defaultValue: "left",
        description:
          "Keeps the sort button aligned with the header cell it lives in, including full-width right-aligned targets.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Visible sort label.",
      }),
      field({
        name: "aria-label",
        type: "string",
        description:
          "Optional override for the generated sort label announced to screen readers.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the button wrapper.",
      }),
    ],
    notes: [
      "The helper defaults to type='button', so it stays safe inside forms.",
      "When children is plain text, an aria-label is generated automatically from the active sort direction.",
    ],
  },
  {
    id: "table-pagination",
    title: "TablePagination",
    summary:
      "Pagination helper with previous/next controls and optional range copy, placed below the table.",
    fields: [
      field({
        name: "align",
        type: '"left" | "center" | "right"',
        defaultValue: "right",
        description:
          "Aligns the page summary and previous/next controls as a group below the table.",
      }),
      field({
        name: "page",
        type: "number",
        required: true,
        description: "Current one-based page index.",
      }),
      field({
        name: "pageCount",
        type: "number",
        required: true,
        description: "Total number of available pages.",
      }),
      field({
        name: "onPageChange",
        type: "(page: number) => void",
        required: true,
        description: "Called when the previous or next control changes pages.",
      }),
      field({
        name: "pageSize",
        type: "number",
        description:
          "Used with totalItems to render a range label such as 1–5 of 12.",
      }),
      field({
        name: "totalItems",
        type: "number",
        description: "Total item count shown in the optional range label.",
      }),
      field({
        name: "showPageInfo",
        type: "boolean",
        defaultValue: "true",
        description: "Toggles the range or page summary text.",
      }),
    ],
  },
  registryItem("table.json", ["motion", "lucide-react"]),
];

const switchApiDetails: DetailItem[] = [
  {
    id: "switch",
    title: "Switch",
    summary:
      "Binary on or off control with motion-driven thumb travel, foreground fill sweep, and optional label and description field chrome.",
    fields: [
      field({
        name: "checked",
        type: "boolean",
        description:
          "Controlled checked state. Pass this when the parent owns the current on or off value.",
      }),
      field({
        name: "defaultChecked",
        type: "boolean",
        description:
          "Initial checked state for uncontrolled usage. The component keeps its local animation state in sync with this mode too.",
      }),
      field({
        name: "onCheckedChange",
        type: "(checked: boolean) => void",
        description:
          "Called whenever the switch changes state, after the thumb and fill animation sequence starts.",
      }),
      field({
        name: "label",
        type: "React.ReactNode",
        description:
          "Optional label rendered beside the switch. When provided with description, both sit inside a native label element linked by htmlFor.",
      }),
      field({
        name: "description",
        type: "React.ReactNode",
        description:
          "Optional helper copy rendered under the label and linked through aria-describedby.",
      }),
      field({
        name: "labelSide",
        type: '"left" | "right"',
        defaultValue: "right",
        description:
          "Controls which side of the switch the label and description block appears on.",
      }),
      field({
        name: "labelClassName",
        type: "string",
        description: "Merged onto the label text wrapper.",
      }),
      field({
        name: "descriptionClassName",
        type: "string",
        description: "Merged onto the description text wrapper.",
      }),
      field({
        name: "size",
        type: '"sm" | "default" | "lg"',
        defaultValue: "default",
        description:
          "Scales the track, thumb, label text, and row gap together.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description:
          "Disables pointer and keyboard interaction, and dims the switch and optional label together.",
      }),
      field({
        name: "readOnly",
        type: "boolean",
        defaultValue: "false",
        description:
          "Shows the current state without allowing toggles. Useful for locked preference rows.",
      }),
      field({
        name: "required",
        type: "boolean",
        defaultValue: "false",
        description:
          "Forwards native required validation to the hidden input and appends a visual asterisk to the label.",
      }),
      field({
        name: "invalid",
        type: "boolean",
        defaultValue: "false",
        description:
          "Applies destructive ring styling and aria-invalid for form validation feedback.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the switch track for local spacing or surface overrides.",
      }),
      field({
        name: "wrapperClassName",
        type: "string",
        description:
          "Merged onto the outer label wrapper when label or description text is present.",
      }),
    ],
    notes: [
      "Additional switch props such as id, aria-label, name, value, required, form, and inputRef are forwarded to the root control.",
      "If you provide label or description, the component wraps the row in a native label element so clicking the text also toggles the switch.",
      "When no label or description is provided, pass aria-label for an accessible name.",
    ],
  },
  {
    id: "switch-motion",
    title: "Motion and interaction behavior",
    summary:
      "The switch uses separate motion values for thumb travel, thumb squash, and track fill opacity so the state change feels tactile without becoming noisy.",
    notes: [
      "Pointer press slightly flattens the thumb before release, then the thumb snaps back with a softer bounce after the state change.",
      "The dark foreground fill fades in as the thumb travels right, rather than swapping track color instantly.",
      "Controlled and uncontrolled usage both keep the thumb animation synchronized with the underlying switch state.",
      "Thumb travel, squash, and fill animations honor prefers-reduced-motion automatically.",
      "The track keeps a fixed left-to-right thumb direction via dir=ltr so RTL layouts do not invert the on state.",
    ],
  },
  registryItem("switch.json", ["@radix-ui/react-switch", "motion"]),
];

const diaTextApiDetails: DetailItem[] = [
  {
    id: "dia-text",
    title: "DiaTextReveal",
    summary:
      "Animated inline text reveal that sweeps a multicolor gradient band across one string or rotates through multiple strings while preserving the same baseline flow.",
    fields: [
      field({
        name: "text",
        type: "string | string[]",
        required: true,
        description:
          "Single string to reveal, or an array of strings to cycle through. When you pass multiple entries, the component tracks an active index and can animate width between them.",
      }),
      field({
        name: "colors",
        type: "string[]",
        description:
          "Gradient stops used for the sweep band. If omitted, the component uses its built-in five-color palette.",
      }),
      field({
        name: "textColor",
        type: "string",
        defaultValue: '"var(--foreground)"',
        description:
          "Base text color used before and after the animated color band passes across the text.",
      }),
      field({
        name: "duration",
        type: "number",
        defaultValue: "1.5",
        description:
          "Duration of the sweep animation in seconds for each reveal cycle.",
      }),
      field({
        name: "delay",
        type: "number",
        defaultValue: "0",
        description: "Delay in seconds before the reveal animation begins.",
      }),
      field({
        name: "repeat",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, the component keeps replaying the sweep and advances through the text array if multiple entries are provided.",
      }),
      field({
        name: "repeatDelay",
        type: "number",
        defaultValue: "0.5",
        description: "Pause in seconds between repeated reveal cycles.",
      }),
      field({
        name: "triggerOnView",
        type: "boolean",
        defaultValue: "true",
        description:
          "Toggles viewport-based playback. When true, the reveal waits until the span enters view before it starts.",
      }),
      field({
        name: "once",
        type: "boolean",
        defaultValue: "true",
        description:
          "Controls whether in-view playback should only happen once or be allowed to replay when the element re-enters view.",
      }),
      field({
        name: "fixedWidth",
        type: "boolean",
        defaultValue: "false",
        description:
          "When rotating multiple text entries, fixes the rendered width to the widest measured string instead of animating width between each item.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the rendered motion span for local typography or layout overrides.",
      }),
    ],
    notes: [
      "The component forwards the remaining Motion span props, so aria attributes, inline data attributes, and other span-level props can still be applied at the call site.",
      "Children are not part of the public API surface here; the rendered content always comes from the text prop.",
    ],
  },
  {
    id: "dia-text-motion",
    title: "Motion and width behavior",
    summary:
      "The reveal is driven by a motion value that builds a gradient band in real time, then optionally replays and rotates through measured text entries.",
    notes: [
      "When multiple text values are provided, the component clones the span to measure each string and can animate the width between entries for a smoother swap.",
      "If triggerOnView is enabled, playback is gated by the local viewport observer instead of always running on mount.",
    ],
  },
  registryItem("dia-text.json", ["motion"]),
];

const revealTextApiDetails: DetailItem[] = [
  {
    id: "reveal-text",
    title: "RevealText",
    summary:
      "Staggered text reveal that animates each word or character upward with blur and opacity, with optional viewport-triggered playback and reduced-motion fallbacks.",
    fields: [
      field({
        name: "text",
        type: "string | string[]",
        required: true,
        description:
          "Copy to reveal. Pass one string or multiple lines; each line renders on its own block row.",
      }),
      field({
        name: "as",
        type: "React.ElementType",
        defaultValue: '"span"',
        description:
          "Root element type for the reveal container while preserving the same split and stagger behavior.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root container for typography, spacing, and layout overrides.",
      }),
      field({
        name: "split",
        type: '"word" | "char"',
        defaultValue: '"word"',
        description:
          "Controls whether the animation staggers by word or by individual character.",
      }),
      field({
        name: "stagger",
        type: "number",
        defaultValue: "0.09",
        description:
          "Delay in seconds added between each word or character in the sequence.",
      }),
      field({
        name: "delay",
        type: "number",
        defaultValue: "0",
        description:
          "Base delay in seconds before the first unit begins animating.",
      }),
      field({
        name: "blur",
        type: "number",
        defaultValue: "12",
        description:
          "Starting blur amount in pixels for each unit before it settles into focus.",
      }),
      field({
        name: "yOffset",
        type: "string | number",
        defaultValue: '"40%"',
        description:
          "Starting vertical offset for each unit. Accepts Motion-friendly values such as percentages or pixel lengths.",
      }),
      field({
        name: "spring",
        type: "{ stiffness?: number; damping?: number; mass?: number }",
        description:
          "Optional spring overrides for the vertical settle motion on each unit.",
      }),
      field({
        name: "once",
        type: "boolean",
        defaultValue: "true",
        description:
          "When whileInView is enabled, controls whether the in-view trigger should fire only once.",
      }),
      field({
        name: "whileInView",
        type: "boolean",
        defaultValue: "false",
        description:
          "When true, the reveal waits until the root enters the viewport before animating.",
      }),
      field({
        name: "children",
        type: "React.ReactNode",
        description:
          "Optional content rendered after the animated text lines inside the root container.",
      }),
    ],
    notes: [
      "Reduced-motion users receive a shorter opacity-only reveal while preserving readable timing.",
      "Duplicate words or characters on the same line receive stable keys so repeated units still animate independently.",
    ],
  },
  {
    id: "reveal-text-motion",
    title: "Reveal transition behavior",
    summary:
      "Each unit animates y, opacity, and filter on independent timelines so the blur fade can trail slightly behind the spring settle.",
    notes: [
      "Word mode preserves spaces between tokens with non-breaking space spans.",
      "Character mode uses Array.from so multi-byte characters split correctly.",
    ],
  },
  registryItem("reveal-text.json", ["motion"]),
];

const shimmerTextApiDetails: DetailItem[] = [
  {
    id: "shimmer-text",
    title: "TextShimmer",
    summary:
      "Animated text treatment that moves a highlight band across one string of copy while keeping the base text readable in both light and dark themes.",
    fields: [
      field({
        name: "children",
        type: "string",
        required: true,
        description:
          "The text content to shimmer. The component expects a string because it derives the highlight spread from the child length.",
      }),
      field({
        name: "as",
        type: "React.ElementType",
        defaultValue: '"p"',
        description:
          "Changes which HTML element gets rendered while preserving the same shimmer animation behavior.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the motion element for local typography, spacing, or color-variable overrides.",
      }),
      field({
        name: "duration",
        type: "number",
        defaultValue: "2",
        description:
          "Duration in seconds for one full shimmer sweep from right to left.",
      }),
      field({
        name: "spread",
        type: "number",
        defaultValue: "2",
        description:
          "Multiplier used to size the highlight band based on the current text length.",
      }),
    ],
    notes: [
      "The component memoizes the computed spread width so it only recalculates when the string content or spread value changes.",
      "Base and highlight colors come from internal CSS custom properties, which can still be overridden through className if you want a different shimmer tone.",
    ],
  },
  {
    id: "shimmer-text-motion",
    title: "Motion and styling behavior",
    summary:
      "The shimmer is driven by a looping background-position animation rather than per-character transforms, so the text stays stable while the highlight moves across it.",
    notes: [
      "The moving band is composed from layered gradients: one animated highlight layer plus one static base-color layer.",
      "Dark mode swaps the base and highlight color variables automatically, so the same component remains legible without extra props.",
      "Because the component uses Motion's repeat loop with linear easing, the shimmer reads as continuous rather than pulsing in place.",
    ],
  },
  registryItem("shimmer-text.json", ["motion"]),
];

const textInertiaApiDetails: DetailItem[] = [
  {
    id: "text-inertia",
    title: "TextInertia",
    summary:
      "Pointer-reactive word treatment that tracks local cursor velocity, applies that momentum to the hovered word, and springs the word back into place.",
    fields: [
      field({
        name: "text",
        type: "string",
        defaultValue: '"Interfaces remember momentum"',
        description:
          "The phrase to render. The component splits it into words and keeps those word wrappers stable for hover-driven motion.",
      }),
      field({
        name: "intensity",
        type: "number",
        defaultValue: "1",
        description:
          "Scales how strongly cursor velocity affects each hovered word. Values just above 1 feel more kinetic; lower values stay calmer.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root word group for typography, color, alignment, and layout overrides.",
      }),
      field({
        name: "wordClassName",
        type: "string",
        description:
          "Merged onto each animated word span when you need per-word styling without changing the root layout.",
      }),
    ],
    notes: [
      "The component forwards standard div props except children; the rendered words always come from the text prop.",
      "The root receives an aria-label with the full text, while individual animated word spans are hidden from assistive technology.",
    ],
  },
  {
    id: "text-inertia-motion",
    title: "Pointer velocity behavior",
    summary:
      "Text Inertia uses Motion values and spring animations instead of a runtime DOM-splitting animation plugin.",
    notes: [
      "Pointer movement over the root records x/y velocity, and entering a word maps that velocity to x, y, and rotation offsets.",
      "Each word immediately settles back to x=0, y=0, and rotate=0 with a spring, which creates the inertial feel with only Motion.",
      "The text is split with React during render, so there is no document query or third-party DOM splitting step.",
    ],
  },
  registryItem("text-inertia.json", ["motion"]),
];

const textLoopApiDetails: DetailItem[] = [
  {
    id: "text-loop",
    title: "TextLoop",
    summary:
      "Cycling text treatment that advances through child items on an interval, animating each change with a vertical slide and fade.",
    fields: [
      field({
        name: "children",
        type: "React.ReactNode[]",
        required: true,
        description:
          "The items to cycle through. Pass each entry as a separate child element so you can control typography and markup per item.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root wrapper for local typography, spacing, or alignment classes.",
      }),
      field({
        name: "interval",
        type: "number",
        defaultValue: "1",
        description:
          "Seconds each item stays visible before advancing to the next child.",
      }),
      field({
        name: "transition",
        type: "Transition",
        defaultValue: "{ duration: 0.3 }",
        description:
          "Motion transition applied to each enter and exit animation between items.",
      }),
      field({
        name: "variants",
        type: "Variants",
        description:
          "Optional Motion variants that override the default vertical slide and fade behavior.",
      }),
      field({
        name: "onIndexChange",
        type: "(index: number) => void",
        description:
          "Called whenever the active item changes, with the zero-based index of the newly visible child.",
      }),
    ],
    notes: [
      "The component renders nothing when no children are provided.",
      "AnimatePresence uses popLayout mode so outgoing and incoming items can overlap during the transition.",
    ],
  },
  {
    id: "text-loop-motion",
    title: "Loop and transition behavior",
    summary:
      "An internal interval increments a loop key on each tick, and the active child is resolved with modulo arithmetic so the sequence repeats indefinitely.",
    notes: [
      "Default motion variants slide the incoming item up from 100% while the outgoing item exits toward -100%.",
      "The exported useLoop hook exposes the same interval-driven key increment if you want to build a custom rotator around the same timing primitive.",
    ],
  },
  registryItem("text-loop.json", ["motion"]),
];

const morphTextsApiDetails: DetailItem[] = [
  {
    id: "morph-texts",
    title: "MorphText",
    summary:
      "Cycling headline treatment that morphs between words with blur, scale, and an SVG goo filter while optionally revealing subtext beneath the rotator.",
    fields: [
      field({
        name: "words",
        type: "string[]",
        required: true,
        description:
          "Words or short phrases to cycle through. The component advances to the next entry on each interval tick.",
      }),
      field({
        name: "interval",
        type: "number",
        defaultValue: "3000",
        description:
          "Milliseconds each word stays active before the next morph transition begins.",
      }),
      field({
        name: "subtext",
        type: "string",
        description:
          "Optional supporting line rendered below the morphing word with a delayed fade-up entrance.",
      }),
      field({
        name: "fontSize",
        type: "string",
        defaultValue: '"clamp(3rem, 15vw, 10rem)"',
        description:
          "CSS font-size value applied to the morphing headline container.",
      }),
      field({
        name: "fontFamily",
        type: "string",
        defaultValue: '"Space Grotesk", sans-serif',
        description:
          "CSS font-family value applied to the headline and subtext.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root wrapper for layout and color overrides.",
      }),
      field({
        name: "textClassName",
        type: "string",
        description:
          "Merged onto the morphing text container when you need local typography overrides.",
      }),
      field({
        name: "subtextClassName",
        type: "string",
        description: "Merged onto the optional subtext element.",
      }),
    ],
    notes: [
      "The active word is announced through aria-live=polite so screen readers can follow the rotation.",
      "Each instance generates a unique SVG filter id so multiple MorphText components can coexist on one page.",
    ],
  },
  {
    id: "morph-texts-motion",
    title: "Morph transition behavior",
    summary:
      "Word changes are driven by AnimatePresence and Motion variants that overlap enter and exit states so the goo filter can blend the outgoing and incoming text.",
    notes: [
      "Enter and exit animate opacity, blur, and scale over roughly 0.9 seconds with an ease-in-out curve.",
      "When only one word is provided, the interval timer is skipped and the headline stays static.",
    ],
  },
  registryItem("morph-texts.json", ["motion"]),
];

const typewriterApiDetails: DetailItem[] = [
  {
    id: "typewriter",
    title: "TextTypewriter",
    summary:
      "Looping typewriter text effect that types a string character by character, briefly swaps in glitch characters, and finishes each pass with a blinking cursor.",
    fields: [
      field({
        name: "children",
        type: "string",
        required: true,
        description:
          "The text content to type. The component expects a single string because the animation advances through each character in order.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root wrapper for local typography, color, spacing, or alignment classes.",
      }),
      field({
        name: "duration",
        type: "number",
        defaultValue: "3",
        description:
          "Scales the scheduled typing and glitch delays. Lower values make each pass faster; higher values slow the sequence down.",
      }),
    ],
    notes: [
      "The rendered text is announced with aria-live=polite so updates can be surfaced without replacing surrounding content.",
    ],
  },
  {
    id: "typewriter-motion",
    title: "Typing and glitch behavior",
    summary:
      "The animation schedules a small sequence of per-character timeouts, occasionally inserts a wrong character, removes it, then types the intended character before continuing.",
    notes: [
      "After the full string is typed, the cursor briefly returns and the sequence starts again from an empty string.",
      "Spaces are typed directly without the wrong-character substitution, which keeps word breaks stable during the effect.",
      "Unmount cleanup clears every pending timeout, so remounting the preview or leaving the page does not leave animation work behind.",
    ],
  },
  registryItem("typewriter.json", ["motion"]),
];

const typographyApiDetails: DetailItem[] = [
  {
    id: "typography",
    title: "Typography",
    summary:
      "Single text primitive that keeps the full type scale in one place, with semantic element defaults derived from the selected variant.",
    fields: [
      field({
        name: "variant",
        type: [
          '"h1"',
          '"h2"',
          '"h3"',
          '"h4"',
          '"h5"',
          '"h6"',
          '"label-xl"',
          '"label-lg"',
          '"label-md"',
          '"label-sm"',
          '"label-xs"',
          '"paragraph-xl"',
          '"paragraph-lg"',
          '"paragraph-md"',
          '"paragraph-sm"',
          '"paragraph-xs"',
          '"subheading-md"',
          '"subheading-sm"',
          '"subheading-xs"',
          '"subheading-2xs"',
          '"doc-label"',
          '"doc-paragraph"',
        ].join(" | "),
        defaultValue: '"paragraph-md"',
        description:
          "Chooses one of the exported typography recipes. Each variant locks in the exact font size, line height, weight, and letter spacing from the scale.",
      }),
      field({
        name: "as",
        type: "React.ElementType",
        description:
          "Overrides the rendered HTML tag when the default semantic element for the chosen variant is not the one you want in a specific layout.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Text or inline content rendered with the selected recipe.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged after the variant classes so local color, spacing, or layout adjustments can be layered on top without forking the scale.",
      }),
    ],
    notes: [
      "Heading variants default to their matching h1 through h6 tags.",
      "Label, paragraph, subheading, and doc variants default to paragraph tags so they remain flexible in flow content.",
      "The scale metadata is exported from the same file as the component, which keeps docs previews and the runtime component aligned.",
    ],
  },
  {
    id: "typography-scale",
    title: "Scale structure",
    summary:
      "The component ships with grouped metadata for titles, labels, paragraphs, subheadings, and documentation copy.",
    notes: [
      "Use label variants for interface emphasis, paragraph variants for reading copy, subheading variants for overlines or small section leads, and doc variants when you need a looser editorial line height.",
      "Letter spacing values are encoded in em units so the browser scales tracking proportionally with the selected font size.",
    ],
  },
  registryItem("typography.json", ["class-variance-authority"]),
];

const tooltipApiDetails: DetailItem[] = [
  {
    id: "tooltip",
    title: "Tooltip",
    summary:
      "Animated tooltip with a canonical Tooltip export. It owns its own open state, expects a single trigger element, and toggles in response to hover and focus events.",
    fields: [
      field({
        name: "children",
        type: "ReactElement",
        required: true,
        description:
          "A single trigger element that receives hover, focus, and aria-describedby props through a slotted wrapper.",
      }),
      field({
        name: "content",
        type: "string",
        required: true,
        description:
          "Short, non-interactive tooltip copy rendered inside the animated bubble. Use Popover for longer or richer content.",
      }),
      field({
        name: "side",
        type: '"top" | "bottom" | "left" | "right"',
        defaultValue: "top",
        description:
          "Preferred popup side passed into the collision-aware Radix popover positioner.",
      }),
      field({
        name: "delay",
        type: "number",
        defaultValue: "0.15",
        description:
          "Open delay in seconds. The implementation multiplies it by 1000 before scheduling the timer.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the tooltip bubble for local surface styling overrides.",
      }),
    ],
    notes: [
      "The trigger forwards onMouseEnter, onMouseLeave, onFocus, and onBlur directly into the child element through Radix Slot.",
      "The timeout used for delayed open is cleared on leave and again on unmount.",
      "Development builds warn when tooltip content grows beyond a short single-line hint.",
    ],
  },
  {
    id: "tooltip-positioning",
    title: "Positioning and accessibility",
    summary:
      "This tooltip is portaled through Radix Popover so it can avoid viewport collisions and escape clipping parents.",
    notes: [
      "The trigger receives an aria-describedby link to the active tooltip bubble.",
      "The popup uses avoidCollisions with collisionPadding=12 and sideOffset=10.",
      "The arrow is a rotated square whose placement follows the resolved data-side from Radix positioning.",
    ],
  },
  registryItem("tooltip.json", [
    "@radix-ui/react-popover",
    "@radix-ui/react-slot",
    "motion",
  ]),
];

export {
  alertApiDetails,
  alertDialogApiDetails,
  avatarApiDetails,
  badgeApiDetails,
  calendarApiDetails,
  datePickerApiDetails,
  cardApiDetails,
  chartsApiDetails,
  breadcrumbsApiDetails,
  buttonApiDetails,
  buttonGroupApiDetails,
  checkboxApiDetails,
  checkboxGroupApiDetails,
  colorPickerApiDetails,
  autocompleteApiDetails,
  comboboxApiDetails,
  commandPaletteApiDetails,
  contextMenuApiDetails,
  drawerApiDetails,
  diaTextApiDetails,
  dialogApiDetails,
  dropdownApiDetails,
  fileUploadApiDetails,
  hoverCardApiDetails,
  iconBarApiDetails,
  inputApiDetails,
  inputOtpApiDetails,
  infiniteRibbonApiDetails,
  carouselApiDetails,
  radialButtonApiDetails,
  fluxButtonApiDetails,
  themeToggleApiDetails,
  faviconBadgeApiDetails,
  verifiedBadgeApiDetails,
  faqProApiDetails,
  fileTreeApiDetails,
  popoverApiDetails,
  promptBoxApiDetails,
  setupChecklistApiDetails,
  teamInvitationApiDetails,
  logosCarouselApiDetails,
  testimonialsApiDetails,
  accordionApiDetails,
  progressApiDetails,
  radioGroupApiDetails,
  shimmerTextApiDetails,
  skeletonApiDetails,
  selectApiDetails,
  separatorApiDetails,
  selectionToolbarApiDetails,
  sliderApiDetails,
  spinnerApiDetails,
  statusDotApiDetails,
  timezoneApiDetails,
  switchApiDetails,
  tableApiDetails,
  tabsApiDetails,
  toggleApiDetails,
  toggleGroupApiDetails,
  morphTextsApiDetails,
  revealTextApiDetails,
  rollingDigitsApiDetails,
  textInertiaApiDetails,
  textLoopApiDetails,
  typewriterApiDetails,
  typographyApiDetails,
  tooltipApiDetails,
};
