import type { DetailField, DetailItem } from "@/components/docs/page-shell";

function field(config: DetailField): DetailField {
  return config;
}

function registryItem(
  registryPath: string,
  dependencies: string[],
  notes: string[] = []
): DetailItem {
  return {
    id: "registry",
    title: "Registry bundle",
    summary:
      "Install the exact registry entry shown on the right when you want the component file and its declared runtime dependencies together.",
    notes: [`Dependencies: ${dependencies.join(", ")}.`, ...notes],
    registryPath,
  };
}

const alertApiDetails: DetailItem[] = [
  {
    id: "alert",
    title: "Alert",
    summary:
      "Default export for a single dismissible notice. It can render inline with surrounding content or portal to the viewport when you provide a position.",
    fields: [
      field({
        name: "icon",
        type: "ReactNode",
        required: true,
        description:
          "Leading visual passed straight into the icon slot. The wrapper applies fallback sizing to nested SVGs so Lucide icons land around 18px without extra setup.",
      }),
      field({
        name: "title",
        type: "string",
        required: true,
        description: "Primary line rendered in the stronger label style.",
      }),
      field({
        name: "message",
        type: "string",
        required: true,
        description:
          "Secondary copy rendered below the title with a lighter foreground tone.",
      }),
      field({
        name: "dismissible",
        type: "boolean",
        defaultValue: "true",
        description:
          "Controls whether the close button is rendered. Disabling it removes manual dismissal only; timeout still applies unless it is set to 0.",
      }),
      field({
        name: "position",
        type: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"',
        description:
          "When present, the component portals to document.body and uses fixed positioning classes. When omitted, the alert stays in normal flow and maxes out at max-w-sm.",
      }),
      field({
        name: "timeout",
        type: "number",
        defaultValue: "10000",
        description:
          "Auto-dismiss delay in milliseconds. Passing 0 disables the timer and removes the progress-bar countdown.",
      }),
      field({
        name: "onDismiss",
        type: "() => void",
        description:
          "Called after the component marks itself hidden, regardless of whether dismissal came from the close button or the timeout effect.",
      }),
    ],
    notes: [
      "Every positioned alert snaps to a full-width top placement on small screens, then switches to the requested corner at the sm breakpoint.",
      "The alert keeps its own visible state internally, so it is designed for fire-and-forget notifications rather than parent-controlled open state.",
    ],
  },
  {
    id: "alert-lifecycle",
    title: "Motion and lifecycle",
    summary:
      "Alert uses AnimatePresence for mount and exit, with separate variants for the container, icon, and text stack.",
    notes: [
      "Entry direction is derived from position: top placements slide down slightly, bottom placements rise upward, and inline alerts use a smaller upward offset.",
      "The timeout effect is cleared on cleanup, so unmounting or rerendering the alert does not leak timers.",
      "When position is set, the component waits until after mount before calling createPortal to avoid touching document during server render.",
    ],
  },
  registryItem("alert.json", ["framer-motion"]),
];

const avatarApiDetails: DetailItem[] = [
  {
    id: "avatar",
    title: "avatar",
    summary:
      'The registry exports a lowercase function named "avatar". Most consuming code aliases it to "Avatar" at import time.',
    fields: [
      field({
        name: "src",
        type: "string",
        description:
          "Image URL passed into next/image. When present, the image fills the 42x42 circular mask with a blur-and-clip reveal animation.",
      }),
      field({
        name: "fallback",
        type: "string",
        defaultValue: "?",
        description:
          "Text rendered in the center when no src is provided, typically initials or a short placeholder character.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root motion.div. The base component already fixes the size to 42x42 and applies the circular overflow mask.",
      }),
    ],
    notes: [
      "The component does not forward refs or arbitrary DOM props; the public surface is only src, fallback, and className.",
      "The root is a motion.div with pointer-style hover and tap animation, but it is not a button or link by itself.",
    ],
  },
  {
    id: "avatar-image-motion",
    title: "Image and motion behavior",
    summary:
      "Motion behavior changes slightly when reduced motion is enabled, but the same two rendering paths stay intact.",
    notes: [
      'next/image always receives a fixed alt value of "Avatar" plus width and height of 42, so this version is best suited to decorative or generic avatars.',
      "Hover adds a soft lift and pulse ring, while tap slightly compresses the root when reduced motion is not requested.",
      "Without src, the fallback text springs in over the primary-colored background instead of showing an empty frame.",
    ],
  },
  registryItem(
    "avatar.json",
    ["framer-motion"],
    [
      "This component also relies on next/image because the image branch is built with the Next.js Image component.",
    ]
  ),
];

const badgeApiDetails: DetailItem[] = [
  {
    id: "badge",
    title: "Badge",
    summary:
      "Default export for a compact label pill with a permanent shimmer pass layered behind the content.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Badge content rendered in the foreground layer so it always stays above the animated shimmer.",
      }),
      field({
        name: "className",
        type: "string",
        defaultValue: '""',
        description:
          "Appended directly to the root span. Useful for size, radius, spacing, or border overrides.",
      }),
      field({
        name: "bgColor",
        type: "string",
        description:
          "Inline backgroundColor override. If omitted, the component uses a dark neutral surface in light mode and a white surface in dark mode.",
      }),
      field({
        name: "textColor",
        type: "string",
        description:
          "Inline text color override. If omitted, the badge picks the inverse of its default background palette.",
      }),
      field({
        name: "waveColor",
        type: "string",
        description:
          "Color used for the middle stop of the animated gradient sweep. Defaults to the local CSS variable declared on the shimmer layer.",
      }),
    ],
    notes: [
      "The public API does not spread other span props, so data attributes or click handlers require a local wrapper or a component fork.",
      "Color overrides are applied through inline styles, which means they take priority over the default Tailwind utility classes.",
    ],
  },
  {
    id: "badge-visuals",
    title: "Visual behavior",
    summary:
      "Badge uses a quick mount animation and a continuously repeating shimmer sweep.",
    notes: [
      "The root fades and scales from 0.95 to 1 on mount over 0.3 seconds.",
      "The shimmer travels from left to right over 2 seconds, waits 1.5 seconds, then repeats indefinitely.",
    ],
  },
  registryItem("badge.json", ["framer-motion"]),
];

const breadcrumbsApiDetails: DetailItem[] = [
  {
    id: "breadcrumb-item",
    title: "BreadcrumbItem",
    summary:
      "Each breadcrumb segment is described by a small object consumed by the Breadcrumbs component.",
    fields: [
      field({
        name: "label",
        type: "string",
        required: true,
        description:
          "Visible label and React key for the item. Labels should therefore be unique inside a single breadcrumb trail.",
      }),
      field({
        name: "href",
        type: "string",
        description:
          "Link destination used by the rendered anchor. If it is omitted, the component falls back to '#'.",
      }),
      field({
        name: "icon",
        type: "ReactNode",
        description:
          "Optional icon shown before the label, typically a Lucide icon or any other inline React node.",
      }),
    ],
  },
  {
    id: "breadcrumbs",
    title: "Breadcrumbs",
    summary:
      "Animated breadcrumb trail that maps over the items array and styles the last entry as the current location.",
    fields: [
      field({
        name: "items",
        type: "BreadcrumbItem[]",
        required: true,
        description:
          "Ordered list of segments. Earlier items receive hover and tap motion, while the last item gets the shimmer and pulsing dot treatment.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root nav wrapper so you can place the trail inside your own header layout.",
      }),
    ],
    notes: [
      "The last item still renders as a motion.a element, even if href is omitted. Its classes remove the interactive cursor but the fallback anchor target is still '#'.",
      "Separators only render after the first item and use the built-in ChevronRight icon from lucide-react.",
    ],
  },
  {
    id: "breadcrumbs-a11y",
    title: "Accessibility and motion",
    summary:
      "The component keeps semantic breadcrumb structure while layering Framer Motion on top.",
    notes: [
      'The root nav uses aria-label="breadcrumb" and wraps items in an ordered list.',
      "AnimatePresence runs in popLayout mode so reordering or changing the trail keeps the transitions coherent.",
      "This implementation does not add aria-current to the final item, so add that yourself if you need stricter breadcrumb semantics.",
    ],
  },
  registryItem("breadcrumbs.json", ["framer-motion", "lucide-react"]),
];

const buttonApiDetails: DetailItem[] = [
  {
    id: "button",
    title: "Button",
    summary:
      "Ref-forwarding button built on motion.button plus a CVA recipe for size and variant styling.",
    fields: [
      field({
        name: "variant",
        type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
        defaultValue: "default",
        description:
          "Chooses the visual recipe from the exported buttonVariants map.",
      }),
      field({
        name: "size",
        type: '"sm" | "md" | "lg" | "custom"',
        defaultValue: "md",
        description:
          "Controls height and padding. The custom size leaves sizing classes empty so the caller can drive layout entirely through className.",
      }),
      field({
        name: "type",
        type: '"button" | "submit" | "reset"',
        defaultValue: "button",
        description:
          "Passed directly to the underlying motion.button so the component does not submit forms accidentally by default.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        description:
          "Content rendered above the ripple layer inside a z-10 span.",
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
          "Native disabled state. It also prevents ripple creation because the pointer-down handler exits early.",
      }),
      field({
        name: "...buttonProps",
        type: "ButtonHTMLAttributes<HTMLButtonElement> except animation and drag event props that conflict with motion.button typings",
        description:
          "Standard button attributes such as onClick, aria-*, name, form, and data-* are forwarded onto motion.button.",
      }),
    ],
    notes: [
      "The local pointer-down handler always calls your onPointerDown first, then decides whether to spawn a ripple.",
      "Reduced-motion users still get the button component, but the ripple effect is skipped.",
    ],
  },
  {
    id: "button-variants",
    title: "buttonVariants",
    summary:
      "The CVA recipe is exported alongside the component so matching button classes can be reused on links or custom wrappers.",
    notes: [
      "Variants ship with six visual states and four size tokens.",
      "Because buttonVariants is a plain CVA export, you can compose it independently from the Button component when you do not want a motion.button element.",
    ],
  },
  registryItem("button.json", ["framer-motion", "class-variance-authority"]),
];

const checkboxGroupApiDetails: DetailItem[] = [
  {
    id: "checkbox-option",
    title: "CheckboxGroupOption",
    summary:
      "Each option row is described with a plain object and rendered as an animated button.",
    fields: [
      field({
        name: "label",
        type: "string",
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
        name: "description",
        type: "string",
        description: "Optional secondary text rendered below the label.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description:
          "Disables the row button and blocks hover, active, and toggle behavior for that option.",
      }),
    ],
  },
  {
    id: "checkbox-group",
    title: "CheckboxGroup",
    summary:
      "Animated multi-select list whose checked state is derived entirely from the value prop.",
    fields: [
      field({
        name: "options",
        type: "CheckboxGroupOption[]",
        required: true,
        description: "Array of rows to render, in display order.",
      }),
      field({
        name: "value",
        type: "string[]",
        defaultValue: "[]",
        description:
          "Current selected values. The component does not keep internal selection state beyond this prop.",
      }),
      field({
        name: "onChange",
        type: "(value: string[]) => void",
        description:
          "Receives the next selected values array after a row is toggled.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the root flex column wrapper.",
      }),
    ],
    notes: [
      "If you want the UI to update when a user clicks, you must feed the next array from onChange back into value. Without that parent state loop, the component stays visually unchanged.",
      "Rows are buttons, not native checkbox inputs, so form submission and checkbox semantics are not provided out of the box.",
    ],
  },
  {
    id: "checkbox-motion",
    title: "Motion and accessibility",
    summary:
      "The component leans on hover surfaces and AnimatePresence rather than native checkbox UI.",
    notes: [
      "Selection is represented by a Lucide Check icon instead of a filled checkbox background.",
      "There is no role='group', role='checkbox', or aria-checked wiring in this version, so accessibility-sensitive forms should add hidden inputs or extend the component.",
    ],
  },
  registryItem("checkbox-group.json", ["framer-motion", "lucide-react"]),
];

const comboboxApiDetails: DetailItem[] = [
  {
    id: "combobox-option",
    title: "ComboboxOption",
    summary:
      "Each selectable row is described by a plain object and can optionally include a secondary description line.",
    fields: [
      field({
        name: "value",
        type: "string",
        required: true,
        description:
          "Stable identifier used for the selected state and returned through onChange.",
      }),
      field({
        name: "label",
        type: "string",
        required: true,
        description:
          "Primary text shown in the closed field and inside the dropdown row.",
      }),
      field({
        name: "description",
        type: "string",
        description:
          "Optional helper copy rendered under the label inside the dropdown list.",
      }),
    ],
  },
  {
    id: "combobox",
    title: "combobox",
    summary:
      'The registry exports a lowercase function named "combobox". It owns open state, search query, and active row internally, while the selected value stays parent-driven.',
    fields: [
      field({
        name: "options",
        type: "ComboboxOption[]",
        required: true,
        description:
          "Available rows rendered in display order and used as the filtering source.",
      }),
      field({
        name: "value",
        type: "string",
        description:
          "Currently selected option value. The component derives the visible label entirely from this prop when the field is closed.",
      }),
      field({
        name: "onChange",
        type: "(value: string) => void",
        description:
          "Called when a row is selected and also when the clear action resets the field to an empty string.",
      }),
      field({
        name: "placeholder",
        type: "string",
        defaultValue: '"Select an option..."',
        description:
          "Shown when no value is selected, and again while the field is open with an empty query.",
      }),
      field({
        name: "emptyMessage",
        type: "string",
        defaultValue: '"No results found."',
        description:
          "Fallback copy rendered when filtering produces no matching options.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the outer relative wrapper so width or placement can be adjusted externally.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description:
          "Disables the input, blocks opening, and applies a reduced-opacity presentation.",
      }),
      field({
        name: "clearable",
        type: "boolean",
        defaultValue: "true",
        description:
          "Controls whether the clear button appears once a value has been selected.",
      }),
    ],
    notes: [
      "This is effectively controlled for selection. If the parent does not feed the next onChange result back into value, the checkmark and closed-field label do not update.",
      "Closing the popover resets the live query string, so reopening the field starts from the full option list again.",
    ],
  },
  {
    id: "combobox-filtering",
    title: "Filtering, keyboard, and layout behavior",
    summary:
      "The dropdown stays attached to the field instead of portaling out, and it supports a stronger keyboard model than the simpler select component.",
    notes: [
      "Filtering is a case-insensitive substring match across label, value, and description.",
      "ArrowUp, ArrowDown, Home, End, Enter, Escape, and Tab are all handled directly on the input to drive the internal activeIndex and open state.",
      "The clear button uses tabIndex={-1}, so it is pointer-accessible but not keyboard reachable in this version.",
      "Because the list is absolutely positioned under the root instead of portaled to document.body, overflow-hidden ancestors can clip it.",
    ],
  },
  registryItem("combobox.json", ["framer-motion", "lucide-react"]),
];

const collapsibleApiDetails: DetailItem[] = [
  {
    id: "collapsible-root",
    title: "Collapsible",
    summary:
      "Root wrapper around Radix Collapsible.Root with a small internal context used by the custom content animation.",
    fields: [
      field({
        name: "open",
        type: "boolean",
        description:
          "Controlled open state. When provided, the component follows this prop instead of its own internal state.",
      }),
      field({
        name: "defaultOpen",
        type: "boolean",
        description: "Initial open value for uncontrolled usage.",
      }),
      field({
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description:
          "Called whenever the trigger toggles the root. It runs for both controlled and uncontrolled usage.",
      }),
      field({
        name: "...rootProps",
        type: "ComponentProps<typeof CollapsiblePrimitive.Root>",
        description:
          "Any remaining Radix root props are forwarded unchanged to the primitive root.",
      }),
    ],
    notes: [
      "The root stores the resolved open state in React context so CollapsibleContent can animate without reading Radix data attributes.",
    ],
  },
  {
    id: "collapsible-trigger",
    title: "CollapsibleTrigger",
    summary: "Thin wrapper around Radix CollapsibleTrigger.",
    fields: [
      field({
        name: "...triggerProps",
        type: "ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>",
        description:
          "All trigger props are forwarded directly to the Radix trigger, including asChild, disabled, and event handlers.",
      }),
    ],
    notes: [
      'The wrapper only adds data-slot="collapsible-trigger" so callers can target it in CSS.',
    ],
  },
  {
    id: "collapsible-content",
    title: "CollapsibleContent",
    summary:
      "Custom motion-driven content area that intentionally exposes a smaller API than the Radix primitive.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Rendered inside the animated content wrapper.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Applied to the inner motion.div that reveals the content.",
      }),
    ],
    notes: [
      "This component does not forward arbitrary CollapsiblePrimitive.Content props such as forceMount, asChild, or custom ids.",
      "Height is animated on an outer wrapper and clip-path is animated on an inner wrapper, producing the open and close effect without relying on CSS keyframes.",
    ],
  },
  registryItem("collapsible.json", [
    "@radix-ui/react-collapsible",
    "framer-motion",
  ]),
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
        name: "...rootProps",
        type: "ComponentPropsWithoutRef<typeof DialogPrimitive.Root>",
        description:
          "All other Radix root props continue to work because the root export is the primitive itself.",
      }),
    ],
    notes: [
      "Because these exports are direct aliases, their accessibility and focus-trap behavior comes from Radix rather than additional wrapper logic here.",
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
        name: "...contentProps",
        type: "ComponentPropsWithoutRef<typeof DialogPrimitive.Content>",
        description:
          "Forwarded to the Radix content primitive, including event callbacks and accessibility props.",
      }),
    ],
    notes: [
      "DialogContent always renders its own close button in the top-right corner using DialogPrimitive.Close and the Lucide X icon.",
      "Children are wrapped one by one in motion.div elements so the header, body, and footer can stagger on entry.",
    ],
  },
  {
    id: "dialog-layout-helpers",
    title: "DialogHeader, DialogFooter, DialogTitle, DialogDescription",
    summary:
      "These helpers provide the layout structure used in the examples while keeping primitive semantics where relevant.",
    notes: [
      "DialogHeader and DialogFooter accept normal div HTML attributes and primarily contribute layout classes.",
      "DialogTitle and DialogDescription forward refs to the corresponding Radix primitives and only merge additional className values.",
    ],
  },
  registryItem("dialog.json", [
    "@radix-ui/react-dialog",
    "framer-motion",
    "lucide-react",
  ]),
];

const inputApiDetails: DetailItem[] = [
  {
    id: "input",
    title: "Input",
    summary:
      'The registry exports a lowercase function named "input". Most consumers alias it to "Input" when importing.',
    fields: [
      field({
        name: "label",
        type: "string",
        defaultValue: "Type here",
        description:
          "Always-visible label rendered above the field and linked to the input via htmlFor.",
      }),
      field({
        name: "value",
        type: "string",
        description:
          "Controlled string value. When omitted, the component uses local state starting from an empty string.",
      }),
      field({
        name: "onChange",
        type: "(value: string) => void",
        description:
          "Receives the next string value rather than the original change event.",
      }),
      field({
        name: "type",
        type: "HTMLInputTypeAttribute",
        defaultValue: "text",
        description:
          "Native input type used by the underlying input element. Password, email, search, and number each trigger additional local behavior.",
      }),
      field({
        name: "id",
        type: "string",
        description:
          "Optional input id. If you leave it out, the component creates one with useId.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Applied to the outer wrapper that contains both the label and the animated input shell.",
      }),
    ],
    notes: [
      "disabled and readOnly are forwarded to the native input and also collapse the interactive affordances such as the password toggle and search clear button.",
    ],
  },
  {
    id: "input-native-props",
    title: "Native input props",
    summary:
      "InputProps extends the native input attribute set with two deliberate changes: value is narrowed to string and onChange is remapped to a string callback.",
    fields: [
      field({
        name: "...nativeProps",
        type: 'Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">',
        description:
          "Placeholder, autoComplete, name, min, max, step, inputMode, onBlur, onFocus, and the rest of the standard input props are forwarded to the actual input element.",
      }),
    ],
    notes: [
      "Your onBlur and onFocus callbacks still run after the component updates its internal focused and validation state.",
      "The visible character animation is driven by an overlay display, but editing still happens through a real native input element.",
    ],
  },
  {
    id: "input-type-specific",
    title: "Type-specific behavior",
    summary:
      "Several input types ship with extra runtime behavior beyond what the browser gives you for free.",
    notes: [
      "Password inputs add a local show-or-hide toggle that flips the input type between password and text.",
      "Search inputs render a clear button whenever the field is interactive and the current value is non-empty.",
      "Email inputs apply a built-in pattern, title, and aria-invalid flag. The destructive border only appears after blur when the field is non-empty and fails the regex.",
      "Number, password, and search inputs opt out of overflow clipping so their trailing affordances can sit outside the text flow cleanly.",
    ],
  },
  registryItem("input.json", ["framer-motion"]),
];

const motionAccordionApiDetails: DetailItem[] = [
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
          "Body copy shown inside the open panel. The implementation splits this string by spaces to stagger words individually.",
      }),
    ],
  },
  {
    id: "accordion",
    title: "Accordion",
    summary:
      "Stateful accordion component with one internal openId value and no controlled API.",
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
    ],
    notes: [
      "Clicking an already open row closes it again because toggle compares against the current openId.",
      "There is no prop for default open, controlled open, or multiple-open behavior in this implementation.",
    ],
  },
  {
    id: "accordion-motion",
    title: "Motion and accessibility",
    summary:
      "The accordion uses native buttons and animated height transitions rather than a headless primitive.",
    notes: [
      "Each trigger button sets aria-expanded and aria-controls, and each open panel receives a matching id.",
      "Word-by-word motion in the content body only works for plain strings, not arbitrary React nodes.",
      "Keyboard support is limited to standard button tab and click semantics; there is no arrow-key roving between items.",
    ],
  },
  registryItem("motion-accordion.json", ["framer-motion", "lucide-react"]),
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
    ],
  },
  {
    id: "radio-group",
    title: "RadioGroup",
    summary:
      "Single-choice selector that can run uncontrolled from local state or sync to a controlled value prop.",
    fields: [
      field({
        name: "options",
        type: "{ value: string; label: string; description?: string }[]",
        required: true,
        description: "Available choices in display order.",
      }),
      field({
        name: "value",
        type: "string",
        description:
          "Controlled selected value. If omitted, the component starts from the first option's value and manages selection locally.",
      }),
      field({
        name: "onChange",
        type: "(value: string) => void",
        description: "Called whenever a user selects a row.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root wrapper for spacing or sizing adjustments.",
      }),
    ],
    notes: [
      "If options is empty, the uncontrolled initial state becomes undefined and no row is selected.",
      "Controlled updates are synced through an effect that watches the value prop.",
    ],
  },
  {
    id: "radio-motion-a11y",
    title: "Motion and accessibility",
    summary:
      "The component layers Framer Motion over custom radio semantics rather than using native input[type=radio].",
    notes: [
      "The active background uses a fixed layoutId of radio-active-bg. Multiple RadioGroup instances on the same screen can therefore share cross-layout animation unless you fork the implementation.",
      "The root sets role='radiogroup' and each row sets role='radio' plus aria-checked, but there is no arrow-key navigation or roving tabindex behavior.",
    ],
  },
  registryItem("radiogroup.json", ["framer-motion"]),
];

const selectApiDetails: DetailItem[] = [
  {
    id: "select-option",
    title: "Option shape",
    summary:
      "Each selectable row is described by a plain object and rendered inside a portaled menu.",
    fields: [
      field({
        name: "value",
        type: "string",
        required: true,
        description:
          "Stable identifier used to determine the selected option and what onChange returns.",
      }),
      field({
        name: "label",
        type: "string",
        required: true,
        description: "Text shown in both the trigger and the dropdown row.",
      }),
      field({
        name: "icon",
        type: "ReactNode",
        description:
          "Optional leading visual shown only inside the dropdown row.",
      }),
    ],
  },
  {
    id: "select",
    title: "select",
    summary:
      'The registry exports a lowercase function named "select". It manages open state internally but expects the selected value to come from the parent.',
    fields: [
      field({
        name: "options",
        type: "{ value: string; label: string; icon?: ReactNode }[]",
        required: true,
        description: "Rows available in the dropdown menu.",
      }),
      field({
        name: "value",
        type: "string",
        description:
          "Currently selected option value. The component derives its selected label entirely from this prop.",
      }),
      field({
        name: "onChange",
        type: "(value: string) => void",
        description:
          "Called when a row is chosen. The menu closes immediately afterward.",
      }),
      field({
        name: "placeholder",
        type: "string",
        defaultValue: "Select an option…",
        description:
          "Fallback trigger text shown when no option matches the current value.",
      }),
    ],
    notes: [
      "This implementation is effectively controlled for selection. If you call onChange without updating value, the visible selection and checkmark do not move.",
      "The public API does not expose className, disabled, or native form props.",
    ],
  },
  {
    id: "select-overlay",
    title: "Overlay and interaction behavior",
    summary:
      "The dropdown menu is portaled to document.body and continuously repositioned while open.",
    notes: [
      "A mounted flag prevents createPortal from running during the initial server render.",
      "useLayoutEffect starts a requestAnimationFrame loop that keeps the menu aligned to the trigger while the viewport changes.",
      "Clicking outside the trigger and menu closes the dropdown. There is no keyboard list navigation or highlighted-option state in this version.",
    ],
  },
  registryItem("select.json", ["framer-motion", "lucide-react"]),
];

const sliderApiDetails: DetailItem[] = [
  {
    id: "slider",
    title: "Slider",
    summary:
      "Pointer-driven range control with optional controlled or uncontrolled value management.",
    fields: [
      field({
        name: "value",
        type: "number",
        description:
          "Controlled value. When provided, the parent owns the current position.",
      }),
      field({
        name: "defaultValue",
        type: "number",
        defaultValue: "50",
        description: "Initial internal value used when value is not supplied.",
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
        type: "(value: number) => void",
        description:
          "Called whenever pointer interaction computes a new clamped value.",
      }),
      field({
        name: "showValue",
        type: "boolean",
        defaultValue: "true",
        description:
          "Controls whether the live numeric readout is shown on the right side of the label row.",
      }),
      field({
        name: "label",
        type: "string",
        description:
          "Optional label shown on the left side of the header row above the track.",
      }),
    ],
    notes: [
      "When value is undefined, the component stores the current value internally and updates it during drag operations.",
      "The displayed number is derived from the animated motion value, so the readout stays in sync with the spring animation rather than jumping immediately.",
    ],
  },
  {
    id: "slider-interaction",
    title: "Interaction model",
    summary: "Slider is currently optimized for pointer interaction only.",
    notes: [
      "The thumb and filled track animate with springs whenever the current value changes.",
      "Pointer capture is taken on pointer down and released on pointer up or cancel, which keeps dragging stable even when the pointer leaves the track.",
      "This version does not expose keyboard controls, role='slider', or aria-valuenow, so accessible form-heavy experiences should wrap or extend it.",
    ],
  },
  registryItem("slider.json", ["framer-motion"]),
];

const spinnerApiDetails: DetailItem[] = [
  {
    id: "spinner",
    title: "Spinner",
    summary:
      "Default export for a lightweight loading indicator built around an output element.",
    fields: [
      field({
        name: "variant",
        type: '"ring" | "dots"',
        defaultValue: "ring",
        description:
          "Chooses between the rotating circular border and the three bouncing dots treatment.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root output element so you can resize or recolor the spinner with Tailwind utilities.",
      }),
    ],
    notes: [
      "The ring variant uses motion.create('output'), while the dots variant renders a plain output element with animated child spans.",
      'Both variants ship with aria-label="Loading" and aria-live="polite". The component does not currently accept a custom accessible label prop.',
      "No additional DOM props are forwarded beyond className, so wrap the component if you need extra data attributes or inline event handlers.",
    ],
  },
  registryItem("spinner.json", ["framer-motion"]),
];

const switchApiDetails: DetailItem[] = [
  {
    id: "switch",
    title: "switch",
    summary:
      'The registry export is lowercase "switch" and is usually aliased to "Switch" when imported. Checked state is expected to come from the parent.',
    fields: [
      field({
        name: "checked",
        type: "boolean",
        defaultValue: "false",
        description:
          "Current switch state shown by the thumb position and track color.",
      }),
      field({
        name: "onCheckedChange",
        type: "(checked: boolean) => void",
        description: "Called with the next boolean when the button is clicked.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description: "Disables the native button and dims the control.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root button for placement and sizing overrides.",
      }),
      field({
        name: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: "md",
        description:
          "Selects the track dimensions, thumb size, and travel distance from the internal SWITCH_LAYOUT map.",
      }),
    ],
    notes: [
      "This implementation does not keep its own checked state. If you do not update checked in response to onCheckedChange, the visual state stays where it was.",
      "A forwarded ref points at the native button element.",
    ],
  },
  {
    id: "switch-size-motion",
    title: "Size and motion behavior",
    summary:
      "The switch uses separate transitions for the track and the thumb so the two parts settle at slightly different tempos.",
    notes: [
      "sm uses a 42x22 track with 20px of thumb travel, md uses 52x30 with 22px travel, and lg uses 64x36 with 28px travel.",
      "Reduced-motion mode switches the thumb to a short tween and shortens the track color transition.",
      "The button carries role='switch' and aria-checked, plus focus-visible ring styles for keyboard users.",
    ],
  },
  registryItem("switch.json", ["framer-motion"]),
];

const tooltipApiDetails: DetailItem[] = [
  {
    id: "tooltip",
    title: "tooltip",
    summary:
      'The registry exports a lowercase function named "tooltip". It owns its own open state and toggles in response to hover and focus events.',
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Trigger content wrapped in a relative inline-flex container.",
      }),
      field({
        name: "content",
        type: "ReactNode",
        required: true,
        description: "Tooltip body rendered inside the animated bubble.",
      }),
      field({
        name: "side",
        type: '"top" | "bottom" | "left" | "right"',
        defaultValue: "top",
        description:
          "Controls which positioning class and directional motion offset are used.",
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
      "The trigger wrapper handles onMouseEnter, onMouseLeave, onFocus, and onBlur. No trigger props are forwarded directly to the child node.",
      "The timeout used for delayed open is cleared on leave and again on unmount.",
    ],
  },
  {
    id: "tooltip-positioning",
    title: "Positioning and accessibility",
    summary:
      "This tooltip is absolutely positioned inside its local wrapper rather than portaled to the document body.",
    notes: [
      "Because the bubble is not portaled, overflow-hidden ancestors can clip it and z-index stacking still depends on the surrounding layout.",
      "The bubble itself gets role='tooltip', but the trigger does not receive aria-describedby or an id link automatically.",
      "The arrow is a rotated square whose placement changes with the side prop.",
    ],
  },
  registryItem("tooltip.json", ["framer-motion"]),
];

export {
  alertApiDetails,
  avatarApiDetails,
  badgeApiDetails,
  breadcrumbsApiDetails,
  buttonApiDetails,
  checkboxGroupApiDetails,
  comboboxApiDetails,
  collapsibleApiDetails,
  dialogApiDetails,
  inputApiDetails,
  motionAccordionApiDetails,
  radioGroupApiDetails,
  selectApiDetails,
  sliderApiDetails,
  spinnerApiDetails,
  switchApiDetails,
  tooltipApiDetails,
};
