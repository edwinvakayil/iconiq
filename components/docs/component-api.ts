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
  registryItem("alert.json", ["motion"]),
];

const avatarApiDetails: DetailItem[] = [
  {
    id: "avatar",
    title: "Avatar",
    summary:
      "Compact motion avatar with a canonical Avatar export, optional image source, and fallback text for empty states.",
    fields: [
      field({
        name: "src",
        type: "string",
        description:
          "Image URL rendered into a framework-agnostic img element. When present, the image fills the 42x42 circular mask with a blur-and-clip reveal animation.",
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
      'The image path always uses a fixed alt value of "Avatar" plus width and height of 42, so this version is best suited to decorative or generic avatars.',
      "Hover adds a soft lift and pulse ring, while tap slightly compresses the root when reduced motion is not requested.",
      "Without src, the fallback text springs in over the primary-colored background instead of showing an empty frame.",
    ],
  },
  registryItem("avatar.json", ["motion"]),
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
  registryItem("badge.json", ["motion"]),
];

const calendarApiDetails: DetailItem[] = [
  {
    id: "calendar",
    title: "Calendar",
    summary:
      "Animated monthly calendar card that now supports both controlled and uncontrolled month and selection state.",
    fields: [
      field({
        name: "selected",
        type: "Date",
        description:
          "Controlled selected day. When provided, the highlighted day is always derived from this prop.",
      }),
      field({
        name: "defaultSelected",
        type: "Date",
        description:
          "Initial selected day for uncontrolled usage when selected is not provided.",
      }),
      field({
        name: "onSelect",
        type: "(date: Date) => void",
        description:
          "Called when the user picks an interactive day in the current month.",
      }),
      field({
        name: "month",
        type: "Date",
        description:
          "Controlled visible month. Prev/next navigation requests flow through onMonthChange.",
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
          "Called whenever the user navigates to a previous or next month.",
      }),
      field({
        name: "disabled",
        type: "(date: Date) => boolean",
        description:
          "Marks dates as non-interactive. Disabled days keep the same visuals but cannot be selected.",
      }),
    ],
    notes: [
      "Controlled mode: pass selected/month and respond to onSelect/onMonthChange.",
      "Uncontrolled mode: omit selected/month and optionally seed with defaultSelected/defaultMonth.",
      "When no defaults are provided, selected date and visible month both start from new Date().",
    ],
  },
  {
    id: "calendar-grid",
    title: "Date math and layout behavior",
    summary:
      "The grid is rebuilt with date-fns whenever the visible month changes.",
    notes: [
      "The rendered range runs from startOfWeek(startOfMonth(currentMonth)) through endOfWeek(endOfMonth(currentMonth)), so leading and trailing days from adjacent months are always visible.",
      "Days outside the active month are dimmed and made non-interactive with pointer-events-none, which keeps context without allowing cross-month selection from the overflow cells.",
      "Weekday labels are hardcoded as Sun through Sat and displayed as single-letter headers, so localization or alternate week starts require editing the component source.",
    ],
  },
  {
    id: "calendar-motion-a11y",
    title: "Motion and interaction model",
    summary:
      "Month transitions, selected-day changes, and the footer summary each animate independently.",
    notes: [
      "Prev and next controls are real buttons with aria-label values, and each in-month day is rendered as a button with hover and tap motion.",
      "The selected day highlight uses a shared layoutId of selected-day so the active surface glides between dates instead of remounting abruptly.",
      "This is still not a full calendar input primitive: there is no keyboard date navigation, no ARIA grid semantics, and no range or multi-select mode.",
    ],
  },
  registryItem("calendar.json", ["motion", "lucide-react", "date-fns"]),
];

const carouselApiDetails: DetailItem[] = [
  {
    id: "carousel",
    title: "Carousel",
    summary:
      "Single exported testimonial carousel with internal pagination state, swipe gestures, animated slide transitions, and built-in arrow and dot controls.",
    fields: [
      field({
        name: "testimonials",
        type: "Testimonial[]",
        description:
          "Optional testimonial list shown by the carousel. When omitted, the component falls back to the sample items declared in the source file.",
      }),
    ],
    notes: [
      "The component does not expose a controlled index, change callback, or autoplay API. Navigation state is fully internal.",
      "Because the public surface only accepts testimonials, layout width, labels, and control styling require a local wrapper or a source edit if you want to change them.",
    ],
  },
  {
    id: "carousel-testimonial",
    title: "Testimonial item",
    summary:
      "Each item passed into the testimonials array follows a small typed shape used for the quote, author, and avatar row.",
    fields: [
      field({
        name: "quote",
        type: "string",
        required: true,
        description:
          "Main testimonial copy rendered in the large italic text block inside the active slide.",
      }),
      field({
        name: "name",
        type: "string",
        required: true,
        description:
          "Author name shown in the lower identity row beside the avatar or initials fallback.",
      }),
      field({
        name: "handle",
        type: "string",
        required: true,
        description:
          "Secondary identity label rendered below the name, usually a short username or role marker.",
      }),
      field({
        name: "avatar",
        type: "string",
        description:
          "Optional avatar image source. When omitted, the component shows the initials fallback chip instead.",
      }),
      field({
        name: "initials",
        type: "string",
        description:
          "Optional fallback text rendered when no avatar string is provided. Leave it empty when you want the author row to render without any leading media.",
      }),
    ],
    notes: [
      "The active slide clamps the quote to three lines, so longer testimonials should still be edited to read cleanly inside the fixed-height card.",
    ],
  },
  {
    id: "carousel-interaction",
    title: "Interaction and layout behavior",
    summary:
      "The component couples motion and navigation into one fixed layout, so consumers get a ready-made interaction shell rather than a headless slider primitive.",
    fields: [
      field({
        name: "swipe threshold",
        type: "built-in",
        description:
          "Dragging left or right past 80px changes slides. Smaller drags snap back to the current item.",
      }),
      field({
        name: "pagination dots",
        type: "built-in",
        description:
          "Each testimonial maps to a dot button. The active dot stretches wider and clicking any dot jumps to that index.",
      }),
      field({
        name: "arrow controls",
        type: "built-in",
        description:
          "Previous and next buttons wrap around the array length instead of stopping at the edges.",
      }),
    ],
    notes: [
      "The root width is capped at max-w-md and the slide stage uses a fixed 230px height, so very different aspect ratios require a source edit.",
      "Slide direction is used by AnimatePresence to decide whether the next card enters from the left or right.",
    ],
  },
  registryItem("carousels.json", ["motion", "lucide-react"]),
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
      "The component keeps semantic breadcrumb structure while layering Motion on top.",
    notes: [
      'The root nav uses aria-label="breadcrumb" and wraps items in an ordered list.',
      "AnimatePresence runs in popLayout mode so reordering or changing the trail keeps the transitions coherent.",
      "This implementation does not add aria-current to the final item, so add that yourself if you need stricter breadcrumb semantics.",
    ],
  },
  registryItem("breadcrumbs.json", ["motion", "lucide-react"]),
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
    ],
    notes: [
      "Standard button attributes such as onClick, aria-*, name, form, and data-* are forwarded to the underlying motion.button.",
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
  registryItem("button.json", ["motion", "class-variance-authority"]),
];

const buttonGroupApiDetails: DetailItem[] = [
  {
    id: "button-group-button",
    title: "Button",
    summary:
      "Standalone motion button with a light upward entrance, hover scale, and a small label nudge inside the content span.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Button content rendered inside an animated inline span so the label can shift slightly on hover.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root button. Use it for local width, spacing, or surface overrides.",
      }),
    ],
    notes: [
      "Most standard button props such as type, disabled, onClick, name, value, aria-*, and data-* are forwarded to the underlying motion button.",
      "The public prop surface intentionally leaves out the native drag and CSS animation callback props because they conflict with Motion's own handler names.",
    ],
  },
  {
    id: "button-group-icon-button",
    title: "IconButton",
    summary:
      "Compact icon-only version of the same button surface, with a stronger hover scale and a rotating inner icon span.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Icon content rendered inside the motion span. SVG children inherit the built-in 1rem sizing utility.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the icon button root for size or surface overrides.",
      }),
    ],
  },
  {
    id: "button-group-layout",
    title: "ButtonGroup",
    summary:
      "Simple flex wrapper for arranging several button surfaces in one row with shared staggered entrance motion.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Buttons, icon buttons, or any other inline controls you want to keep in the same row.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the outer motion div. The base layout already applies a horizontal flex row with a small gap.",
      }),
    ],
  },
  {
    id: "button-group-items",
    title: "ButtonGroupItems",
    summary:
      "Segmented button shell that turns each valid child element into an internal motion button with shared borders and equal visual rhythm.",
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
    ],
    notes: [
      "Only valid React elements are rendered. Non-element children are ignored.",
      "The child node itself is not preserved; ButtonGroupItems reads each child's props and children, then renders a fresh motion button for that slot.",
    ],
  },
  {
    id: "segmented-control",
    title: "SegmentedControl",
    summary:
      "String-based segmented selector with internal state support, hover wash, and a spring-driven selected indicator.",
    fields: [
      field({
        name: "options",
        type: "string[]",
        required: true,
        description:
          "Ordered list of visible segments. The first option becomes the uncontrolled initial selection when value is not provided.",
      }),
      field({
        name: "value",
        type: "string",
        description:
          "Controlled selected option. When provided, the internal state syncs to this prop through an effect.",
      }),
      field({
        name: "onChange",
        type: "(value: string) => void",
        description:
          "Called with the selected option whenever a segment is pressed.",
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
        defaultValue: '"segmented-indicator"',
        description:
          "Motion layout id used by the selected indicator. Override it when you render multiple segmented controls on the same page and want isolated indicator motion.",
      }),
    ],
  },
  {
    id: "button-group-motion",
    title: "Motion and interaction",
    summary:
      "Each export shares the same spring-heavy motion language, but the interaction style changes slightly by surface.",
    notes: [
      "Button and IconButton both animate in on mount, scale on hover and tap, and apply a muted background shift during hover.",
      "ButtonGroup only handles layout and entrance motion; the interactive behavior still comes from the child buttons inside it.",
      "SegmentedControl animates each option into place individually, then uses a shared layout indicator for the active segment and a lighter hover wash for inactive segments.",
    ],
  },
  registryItem("button-group.json", ["motion"]),
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
  registryItem("checkbox-group.json", ["motion", "lucide-react"]),
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
    title: "Combobox",
    summary:
      "Searchable single-select field that owns open state, search query, and active row internally, while the selected value stays parent-driven.",
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
      "The dropdown is portaled to document.body, positioned from the field bounds, and supports a stronger keyboard model than the simpler select component.",
    notes: [
      "Filtering is a case-insensitive substring match across label, value, and description.",
      "ArrowUp, ArrowDown, Home, End, Enter, Escape, and Tab are all handled directly on the input to drive the internal activeIndex and open state.",
      "The clear button uses tabIndex={-1}, so it is pointer-accessible but not keyboard reachable in this version.",
      "Because the list is rendered in a portal with fixed positioning, overflow-hidden ancestors do not clip it. Placement is recalculated from the trigger rect while it is open.",
    ],
  },
  registryItem("combobox.json", ["motion", "lucide-react"]),
];

const contextMenuApiDetails: DetailItem[] = [
  {
    id: "context-menu",
    title: "ContextMenu",
    summary:
      "Stateful wrapper that listens for the native contextmenu event on a local surface and renders a fixed-position floating menu.",
    fields: [
      field({
        name: "items",
        type: "ContextMenuItem[]",
        required: true,
        description:
          "Ordered list of menu rows. Each item defines its own label, optional icon and shortcut, click handler, and row state.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Content wrapped by the local context-click target. The component always renders a div around this content and attaches the right-click handler there.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the wrapper div that receives the native context menu event.",
      }),
      field({
        name: "menuClassName",
        type: "string",
        description:
          "Merged onto the floating motion.div for local surface styling overrides. The component still applies an inline width of 232px.",
      }),
    ],
    notes: [
      "Open state is fully internal. This implementation does not expose controlled open props, state callbacks, or an imperative API.",
      "The menu opens only from the native contextmenu event, then flips horizontally or vertically when the estimated panel would overflow the viewport.",
      "Closing is handled internally on outside mousedown, scroll, resize, and Escape. ArrowUp and ArrowDown move the highlighted row in local state, but DOM focus does not move into the menu.",
    ],
  },
  {
    id: "context-menu-item",
    title: "ContextMenuItem",
    summary:
      "Data shape used by the items prop to define each row in the menu.",
    fields: [
      field({
        name: "label",
        type: "string",
        required: true,
        description: "Primary row copy rendered as the main action label.",
      }),
      field({
        name: "icon",
        type: "ReactNode",
        description:
          "Optional leading visual rendered inside the fixed 16px icon slot.",
      }),
      field({
        name: "shortcut",
        type: "string",
        description:
          "Optional trailing helper text, typically a keyboard hint such as R or Cmd+D.",
      }),
      field({
        name: "onSelect",
        type: "() => void",
        description:
          "Called when the row is activated with a click or Enter on the currently highlighted item.",
      }),
      field({
        name: "destructive",
        type: "boolean",
        description:
          "Switches the row into the destructive color treatment and changes the active highlight tint.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description: "Dims the row and blocks pointer and Enter selection.",
      }),
      field({
        name: "separatorAfter",
        type: "boolean",
        description:
          "Inserts a thin divider after the row unless it is already the last rendered item.",
      }),
    ],
    notes: [
      "Keyboard navigation skips disabled rows in both directions. If every row is disabled, the highlighted index stays unchanged.",
    ],
  },
  registryItem("context-menu.json", ["motion"]),
];

const drawerApiDetails: DetailItem[] = [
  {
    id: "drawer",
    title: "Drawer",
    summary:
      "Single exported overlay drawer controlled entirely from parent state, with side-based panel motion and built-in body scroll locking.",
    fields: [
      field({
        name: "open",
        type: "boolean",
        required: true,
        description:
          "Controls whether the drawer and overlay render at all. The component is fully controlled and does not keep its own open state.",
      }),
      field({
        name: "onClose",
        type: "() => void",
        required: true,
        description:
          "Called when the overlay is clicked or when Escape is pressed while the drawer is open.",
      }),
      field({
        name: "side",
        type: '"left" | "right" | "top" | "bottom"',
        defaultValue: '"right"',
        description:
          "Chooses the panel edge, slide direction, and the matching border placement from the internal panelVariants map.",
      }),
      field({
        name: "title",
        type: "string",
        description:
          "Primary heading rendered in the header row. When omitted, the heading node still renders but stays empty.",
      }),
      field({
        name: "description",
        type: "string",
        description:
          "Secondary helper line rendered under the title when present.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        description:
          "Content rendered inside the scrolling body area below the header.",
      }),
    ],
    notes: [
      "This component does not forward arbitrary DOM props or refs to the overlay or panel. The public API is limited to the controlled props above.",
      "While open, the component sets document.body.style.overflow to hidden and restores it during cleanup.",
      "There is no focus trap, portal primitive, or aria dialog wiring here, so this version is closer to a visual application drawer than a full modal accessibility primitive.",
    ],
  },
  {
    id: "drawer-motion-layout",
    title: "Motion, layout, and close behavior",
    summary:
      "The drawer uses a spring-driven panel plus staggered header and body children, with a softer duration fallback when reduced motion is enabled.",
    fields: [
      field({
        name: "overlay",
        type: "built-in",
        description:
          "A fixed full-screen overlay is always rendered behind the panel and closes the drawer on click.",
      }),
      field({
        name: "close button",
        type: "built-in",
        description:
          "The header always includes a close button with the Lucide X icon wired to onClose.",
      }),
    ],
    notes: [
      "Top and bottom drawers cap their height at 80vh, while left and right drawers cap their width at max-w-md and otherwise fill the viewport edge-to-edge.",
      "A decorative top shimmer is always rendered inside the panel. Remove or restyle it locally if you want a flatter surface.",
    ],
  },
  registryItem("drawer.json", ["motion", "lucide-react"]),
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
          "Compose DropdownTrigger, DropdownContent, DropdownItem, and optional helpers like DropdownValue or DropdownSeparator inside the root.",
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
          "Use select when items should commit a persistent value with a checkmark, or action when items should behave like immediate commands.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the outer relative wrapper around the trigger and content.",
      }),
    ],
    notes: [
      "The menu stays local to the trigger wrapper and is absolutely positioned under it instead of being portaled to document.body.",
      "Escape and outside clicks close the menu. This version does not ship a full roving-focus keyboard model like Radix dropdown-menu.",
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
        name: "className",
        type: "string",
        description: "Merged onto the trigger button shell.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description: "Prevents opening and dims the trigger styling.",
      }),
    ],
    notes: [
      "The trigger is always rendered as a button in this version, so custom trigger visuals should be passed as children and styled with className.",
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
        description: "Horizontal alignment relative to the trigger wrapper.",
      }),
      field({
        name: "sideOffset",
        type: "number",
        defaultValue: "8",
        description:
          "Vertical gap between the trigger and the dropdown surface.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the dropdown surface, which is useful for setting a custom width or changing shadows in docs/examples.",
      }),
    ],
    notes: [
      "The content stays mounted only while the menu is open, and its spring animation is handled internally.",
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
          "Optional explicit label used by DropdownValue when your item children are not plain text.",
      }),
      field({
        name: "onClick",
        type: "(event: MouseEvent<HTMLButtonElement>) => void",
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
      "Select items do not render a filled selected background in this version; only the trailing checkmark indicates the chosen value.",
      "If you omit value in select mode, the item behaves like a plain closing action and will not update the current value.",
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
      "The base separator uses the shared border token and a small vertical margin between item groups.",
    ],
  },
  registryItem("dropdown.json", ["motion", "lucide-react"]),
];

const fileUploadApiDetails: DetailItem[] = [
  {
    id: "file-upload",
    title: "FileUpload",
    summary:
      "Drag-and-drop uploader with an internal queue, hidden file input, keyboard-triggerable drop zone, and callback hooks for parent integrations.",
    fields: [
      field({
        name: "accept",
        type: "string",
        description:
          "Optional accept string passed to the hidden file input and also enforced for dropped files, including MIME types like image/* and extensions like .pdf.",
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
          "Caps the queue length. New files are prepended, and anything beyond the limit is trimmed from the end.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        defaultValue: "false",
        description:
          "Disables click, drag, keyboard activation, and the hidden file input without changing the component structure.",
      }),
      field({
        name: "name",
        type: "string",
        description:
          "Passes a form field name through to the hidden file input for form integrations.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Adds classes to the outer wrapper without changing the component internals.",
      }),
      field({
        name: "onFilesChange",
        type: "(files: File[]) => void",
        description:
          "Called when files are added or removed from the queue. It does not fire on every progress tick.",
      }),
      field({
        name: "onFileRemove",
        type: "(file: File, nextFiles: File[]) => void",
        description:
          "Called after a queued file is removed. The second argument contains the remaining files in queue order.",
      }),
      field({
        name: "onUploadComplete",
        type: "(files: File[]) => void",
        description:
          "Called once the current queue reaches 100% completion for every item.",
      }),
    ],
    notes: [
      "The drop zone is keyboard accessible and opens the hidden file input on Enter or Space.",
      "Both drag-and-drop and click-to-browse flow through the same queue logic, so accept filtering and max file limits stay consistent.",
    ],
  },
  {
    id: "file-upload-behavior",
    title: "Built-in behavior",
    summary:
      "The component still owns its progress visuals and preview lifecycle, even when you attach callbacks from parent code.",
    fields: [
      field({
        name: "progress state",
        type: "built-in",
        description:
          "Each added file starts in an uploading state and advances through the built-in simulated progress loop until it reaches done.",
      }),
      field({
        name: "image previews",
        type: "built-in",
        description:
          "Image files receive object URL previews and render as thumbnails; non-image files fall back to a file icon surface.",
      }),
      field({
        name: "remove action",
        type: "built-in",
        description:
          "Each queued file can be removed individually from the trailing action button, with preview URLs revoked immediately.",
      }),
    ],
    notes: [
      "Preview object URLs are cleaned up on remove and during component unmount.",
      "Each queue item id is built from the file name, file size, and a random suffix to reduce collisions between repeated uploads.",
    ],
  },
  registryItem("file-upload.json", ["motion", "lucide-react"]),
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
    id: "dialog-trigger-close",
    title: "DialogTrigger and DialogClose",
    summary:
      "These exports are direct Radix aliases used to open or close the dialog from any custom element.",
    fields: [
      field({
        name: "asChild",
        type: "boolean",
        description:
          "Lets you turn a custom button or link into the trigger or close control without adding an extra wrapper element.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Interactive content rendered by the trigger or close primitive.",
      }),
    ],
    notes: [
      "Because both exports come directly from Radix, they also accept the remaining primitive props for event handling and accessibility wiring.",
    ],
  },
  {
    id: "dialog-layout-helpers",
    title: "DialogHeader and DialogFooter",
    summary:
      "Layout helpers used to structure dialog content without changing dialog behavior.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Content rendered inside the helper container.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the helper wrapper so spacing and alignment can be adjusted per dialog.",
      }),
    ],
    notes: [
      "Both helpers accept the normal div HTML attribute surface in addition to className and children.",
    ],
  },
  {
    id: "dialog-text-helpers",
    title: "DialogTitle and DialogDescription",
    summary:
      "Semantic text helpers that forward to the matching Radix title and description primitives.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Text or inline markup rendered inside the title or description primitive.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged with the default title or description styles.",
      }),
    ],
    notes: ["Both helpers forward refs to the underlying Radix primitives."],
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
      "Stateful wrapper that opens and closes a local callout from pointer and focus events with configurable delays.",
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
          "Merged onto the root span that anchors the trigger and positioned content.",
      }),
      field({
        name: "openDelay",
        type: "number",
        defaultValue: "80",
        description:
          "Delay in milliseconds before the card opens after pointer or focus entry.",
      }),
      field({
        name: "closeDelay",
        type: "number",
        defaultValue: "120",
        description:
          "Delay in milliseconds before the card closes after pointer or focus leaves the root.",
      }),
    ],
    notes: [
      "Open state is internal only. This implementation does not expose a controlled open prop or state-change callback.",
      "The root renders a relative inline-block span and attaches the hover and focus handlers there, so the content stays anchored to that local wrapper.",
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
      "When asChild is false, the component renders a plain button element. Pass type='button' yourself if you place it inside a form.",
      "Standard button props such as disabled, onClick, aria-*, and data-* are forwarded to the rendered trigger element.",
    ],
  },
  {
    id: "hover-card-content",
    title: "HoverCardContent",
    summary:
      "Animated content panel that appears below the trigger with a spring entrance and blur fade.",
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
    ],
    notes: [
      "Additional motion.div props such as style, role, onClick, aria-*, and data-* are forwarded, but initial, animate, exit, and transition are reserved by the component.",
      "The panel is absolutely positioned relative to the root wrapper rather than portaled to document.body, so overflow-hidden ancestors can clip it.",
      "By default the content is centered below the trigger with mt-3 spacing and a fixed w-72 width.",
    ],
  },
  registryItem("hover-card.json", ["@radix-ui/react-slot", "motion"]),
];

const popoverApiDetails: DetailItem[] = [
  {
    id: "popover-root",
    title: "Popover",
    summary:
      "Standard shadcn-style export: `Popover` is `PopoverPrimitive.Root`, matching what the CLI installs into `components/ui/popover`.",
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
      "Any remaining root props continue to work because the export is the Radix primitive itself.",
    ],
  },
  {
    id: "popover-trigger",
    title: "PopoverTrigger and PopoverAnchor",
    summary:
      "These exports are direct aliases of the matching Radix primitives and are used to open the popover or redefine its positioning anchor.",
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
        description:
          "Interactive or layout content rendered by the trigger or anchor primitive.",
      }),
    ],
    notes: [
      "Because both exports come directly from Radix, they also accept the remaining primitive props for event handling and accessibility wiring.",
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
        required: true,
        description:
          "Controls whether the animated portal branch renders at all. In practice this must mirror the root open state for entry and exit motion to run correctly.",
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
    ],
    notes: [
      "Remaining Radix content props are forwarded through to PopoverPrimitive.Content, including side, collisionPadding, onEscapeKeyDown, and accessibility props.",
      "The component always renders inside a Radix portal and uses the Radix transform-origin CSS variable so the motion scales from the resolved placement.",
      "Entry and exit animation are owned internally, so initial, animate, exit, and transition are not part of the public prop surface.",
    ],
  },
  registryItem("popover.json", ["@radix-ui/react-popover", "motion"]),
];

const inputGroupApiDetails: DetailItem[] = [
  {
    id: "inputgroups",
    title: "Inputgroups",
    summary:
      "Floating-label input field with optional prefix and suffix slots, a center-out focus rule, and inline error messaging driven entirely by props.",
    fields: [
      field({
        name: "label",
        type: "string",
        required: true,
        description:
          "Field label rendered inside the shell until the input becomes focused or contains a value, then animated upward into its floating position.",
      }),
      field({
        name: "error",
        type: "string",
        description:
          "Optional validation message rendered below the field. Passing a value also switches the label and underline to the destructive palette.",
      }),
      field({
        name: "prefixIcon",
        type: "ReactNode",
        description:
          "Leading visual placed before the input area. The slot is best suited to compact icons and inherits the same focus-aware color shift as the suffix.",
      }),
      field({
        name: "suffixIcon",
        type: "ReactNode",
        description:
          "Optional trailing visual rendered inside a button, which makes it useful for actions such as show-password toggles or clear controls.",
      }),
      field({
        name: "onSuffixClick",
        type: "() => void",
        description:
          "Called when the suffix button is pressed. It only matters when suffixIcon is also present.",
      }),
      field({
        name: "id",
        type: "string",
        description:
          "Optional input id. When omitted, the component creates one with useId and links the animated label automatically.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Applied to the native input element itself, not the outer shell. Use it for text sizing, placeholder, or input-level spacing overrides.",
      }),
    ],
    notes: [
      "Standard native input props such as name, type, value, defaultValue, placeholder, autoComplete, disabled, onFocus, onBlur, and onChange are forwarded directly to the underlying input element.",
      "The outer field shell uses a mouse-down focus handoff, so clicking the label area or prefix icon focuses the input without stealing focus from the suffix button.",
      "Value presence is tracked from the real input value, which keeps the floating label aligned for both controlled and uncontrolled usage.",
    ],
  },
  {
    id: "input-group",
    title: "InputGroup",
    summary:
      "Lightweight vertical wrapper for stacking multiple Inputgroups fields with consistent spacing.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "One or more Inputgroups fields, or any other custom content you want to keep in the same vertical flow.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the wrapper div. The base layout already uses a full-width flex column with a 1.5rem gap.",
      }),
    ],
    notes: [
      "All remaining div props are forwarded to the wrapper, so data attributes and layout helpers can be attached at the group level.",
    ],
  },
  {
    id: "input-group-motion",
    title: "Motion and behavior",
    summary:
      "The component keeps its motion treatment quiet and focused on form affordances rather than full-panel animation.",
    notes: [
      "The label, prefix slot, and suffix slot all use spring transitions, so they respond to focus without introducing layout shift.",
      "The bottom accent line grows from the center outward only while the field is focused, then collapses away on blur.",
      "Error copy mounts and exits through AnimatePresence, which keeps the spacing stable while still giving feedback a small fade-and-rise transition.",
    ],
  },
  registryItem("input-group.json", ["motion"]),
];

const paginationApiDetails: DetailItem[] = [
  {
    id: "pagination",
    title: "Pagination",
    summary:
      "Pagination root that can either render the full paginator from total, page, and onChange props or act as the parent wrapper for the composed shadcn-style pieces.",
    fields: [
      field({
        name: "total",
        type: "number",
        description:
          "Total number of pages available. When you use the built-in wrapper mode, the component renders the first page, last page, current page, and one sibling on either side, collapsing the rest into ellipsis markers.",
      }),
      field({
        name: "page",
        type: "number",
        description:
          "Controlled current page. When omitted, the root manages its own page state internally starting from page 1.",
      }),
      field({
        name: "onChange",
        type: "(page: number) => void",
        description:
          "Called whenever a valid next page is chosen from the numbered buttons or the previous and next controls. The composed primitives also use this through context when you do not provide custom button handlers.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        description:
          "Optional composed pagination structure. When omitted, the root renders the full paginator automatically using total, page, and onChange.",
      }),
    ],
    notes: [
      "This keeps the same UI and motion treatment as the original single-component paginator, but now also exposes shadcn-style building blocks.",
      "Out-of-range page changes are ignored, so previous is inert on page 1 and next is inert on the final page.",
    ],
  },
  {
    id: "pagination-content",
    title: "PaginationContent and PaginationItem",
    summary:
      "The composed content wrapper keeps previous and next controls on the edges while the page links stay centered inside the same fixed-width rail.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Render PaginationPrevious, PaginationNext, PaginationLink, and PaginationEllipsis inside PaginationContent. Numeric and ellipsis entries can be wrapped with PaginationItem.",
      }),
    ],
    notes: [
      "PaginationContent preserves the same centered 280px page rail from the current design instead of switching to a looser layout.",
      "PaginationItem uses layout-aware motion so page entries keep the same fluid shifting behavior when the visible range changes.",
    ],
  },
  {
    id: "pagination-links",
    title:
      "PaginationLink, PaginationPrevious, PaginationNext, and PaginationEllipsis",
    summary:
      "These primitives expose the numbered buttons and edge controls individually while keeping the existing visual behavior intact.",
    fields: [
      field({
        name: "isActive",
        type: "boolean",
        description:
          "Marks the current page on PaginationLink and keeps the underline anchored under the active number.",
      }),
      field({
        name: "text",
        type: "string",
        description:
          "Optional label override for PaginationPrevious and PaginationNext. They default to Prev and Next.",
      }),
    ],
    notes: [
      "Previous and next keep the same hover arrow nudge and current label treatment from the approved design.",
      "Ellipsis markers remain static separators and are not interactive.",
    ],
  },
  registryItem("pagination.json", ["motion"]),
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
      "The content body reveals through a horizontal clipped wipe while the paragraph settles upward with a soft blur fade.",
      "Keyboard support is limited to standard button tab and click semantics; there is no arrow-key roving between items.",
    ],
  },
  registryItem("accordion.json", ["motion", "lucide-react"]),
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
      "The component layers Motion over custom radio semantics rather than using native input[type=radio].",
    notes: [
      "The active background uses a fixed layoutId of radio-active-bg. Multiple RadioGroup instances on the same screen can therefore share cross-layout animation unless you fork the implementation.",
      "The root sets role='radiogroup' and each row sets role='radio' plus aria-checked, but there is no arrow-key navigation or roving tabindex behavior.",
    ],
  },
  registryItem("radiogroup.json", ["motion"]),
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
    title: "Select",
    summary:
      "Animated single-select dropdown that manages open state internally but expects the selected value to come from the parent.",
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
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the outer wrapper so width and placement can be adjusted without editing the component source.",
      }),
    ],
    notes: [
      "This implementation is effectively controlled for selection. If you call onChange without updating value, the visible selection and checkmark do not move.",
      "The public API still does not expose disabled or native form props.",
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
  registryItem("select.json", ["motion", "lucide-react"]),
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
  registryItem("slider.json", ["motion"]),
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
  registryItem("spinner.json", ["motion"]),
];

const skeletonApiDetails: DetailItem[] = [
  {
    id: "skeleton",
    title: "ShimmerSkeleton",
    summary:
      "Lightweight loading placeholder that renders a muted block with an optional shimmer pass layered above it.",
    fields: [
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
          "Controls whether the shimmer overlay is rendered. Set it to false when you want a static loading block.",
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
      "The component always renders role='status' and aria-label='Loading' on the root placeholder.",
      "The shimmer uses a local keyframes definition and a gradient overlay span, so there are no runtime dependencies beyond React.",
      "Use rounded='full' for avatar placeholders and the default rounded='md' or rounded='lg' for cards and text blocks.",
    ],
  },
  {
    id: "skeleton-registry",
    title: "Registry bundle",
    summary:
      "Install the exact registry entry shown on the right when you want the component file with no additional runtime dependencies.",
    notes: ["No runtime dependencies."],
    registryPath: "skeleton.json",
  },
];

const tabsApiDetails: DetailItem[] = [
  {
    id: "tabs",
    title: "Tabs",
    summary:
      "Root wrapper for a clean tab interface with controlled or uncontrolled value handling from Base UI.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Compose TabsList, TabsTrigger, and TabsContent inside the root, following the familiar shadcn-style structure.",
      }),
      field({
        name: "defaultValue",
        type: "string",
        description: "Initial active tab value for uncontrolled usage.",
      }),
      field({
        name: "value",
        type: "string",
        description: "Controlled active tab value.",
      }),
      field({
        name: "onValueChange",
        type: "(value: string, details: object) => void",
        description:
          "Called when a trigger changes the active tab through click or keyboard navigation.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root wrapper around the list and content panels.",
      }),
    ],
    notes: [
      "The implementation stays intentionally small: it relies on Base UI for selection state, keyboard behavior, and panel wiring.",
      "Use local className overrides on TabsList or TabsTrigger when a specific screen needs a more opinionated visual treatment.",
    ],
  },
  {
    id: "tabs-list",
    title: "TabsList",
    summary:
      "Inline trigger rail that provides the muted segmented background behind a set of tab triggers.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        description: "Usually a row of TabsTrigger elements.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the inline-flex rail around the triggers.",
      }),
    ],
    notes: [
      "The default styles keep the list compact so it works well for docs toggles, install blocks, and simple settings surfaces.",
    ],
  },
  {
    id: "tabs-trigger",
    title: "TabsTrigger",
    summary:
      "Interactive tab button with a clean active surface, quieter inactive state, and built-in accessibility wiring from Base UI.",
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
        name: "className",
        type: "string",
        description:
          "Merged onto the trigger button for local spacing, typography, or active-state overrides.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description:
          "Prevents the trigger from receiving focus or changing the active tab.",
      }),
    ],
    notes: [
      "Active styling uses the presence of Base UI's data-active attribute rather than a custom indicator layer.",
      "Focus, arrow-key navigation, and ARIA relationships come from the underlying tabs primitive.",
    ],
  },
  {
    id: "tabs-content",
    title: "TabsContent",
    summary: "Single panel tied to a matching trigger value.",
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
        description: "Merged onto the rendered panel element.",
      }),
    ],
    notes: [
      "Hidden panels are managed by the underlying tabs primitive, so you keep the usual DOM and accessibility behavior without extra wrapper logic.",
      "Standard div attributes such as data-*, aria-*, id, style, and event handlers are forwarded to the panel element.",
    ],
  },
  registryItem("tabs.json", ["@base-ui/react"]),
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
          "Compose TableHeader, TableBody, TableRow, TableHead, TableCell, and optional helper primitives inside the root.",
      }),
      field({
        name: "columns",
        type: "string",
        defaultValue:
          '"minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)"',
        description:
          "Shared grid-template-columns value applied to every header and body row so custom layouts stay aligned.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root wrapper when you need to adjust width, spacing, or placement.",
      }),
    ],
    notes: [
      "The canonical JSX export is `Table`, and the lowercase `table` alias still ships for backward compatibility.",
      "The file also exports `TABLE_DEFAULT_COLUMNS`, `TableAlign`, `TableRowVariant`, and `TableSortDirection` for stronger TypeScript reuse in app code.",
      "The registry component no longer owns demo data, search state, or add/remove actions. Those behaviors are expected to live in app code.",
      "Semantic roles default to a div-based table structure (`table`, `rowgroup`, `row`, `columnheader`, and `cell`) so the installed primitive is more accessible without changing the visual layout.",
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
      "Top shell for the header area. It preserves the original top border before the first row.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Usually one header TableRow.",
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
      "Body wrapper that adds LayoutGroup and AnimatePresence so row insertions, removals, and reordering stay animated.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "One or more TableRow elements, plus optional TableEmpty when no rows are visible.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the body wrapper.",
      }),
    ],
    notes: [
      "Exit animations for removed rows only run when body rows are rendered as direct children of TableBody.",
    ],
  },
  {
    id: "table-row",
    title: "TableRow",
    summary:
      "Motion-enabled row primitive used for both header and body layouts.",
    fields: [
      field({
        name: "variant",
        type: '"header" | "body"',
        defaultValue: "body",
        description:
          "Header rows skip mount and exit motion, while body rows use the original spring-based row transitions.",
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
          "When true, body rows keep the original muted hover wash. Defaults to false for header rows and true for body rows.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the row shell for spacing or color overrides.",
      }),
      field({
        name: "Motion div props",
        type: "ComponentPropsWithoutRef<typeof motion.div>",
        description:
          "Additional motion.div props such as layout, transition, whileHover, and exit can still be passed directly.",
      }),
    ],
    notes: [
      "Every row reads the shared columns string from Table and applies it as grid-template-columns.",
      'Rows expose `data-slot="table-row"`, plus `data-variant` and `data-hoverable`, which makes local styling overrides easier after installation.',
    ],
  },
  {
    id: "table-head",
    title: "TableHead",
    summary:
      "Header cell wrapper for labels, sort buttons, and right-aligned controls.",
    fields: [
      field({
        name: "align",
        type: '"left" | "right"',
        defaultValue: "left",
        description:
          "Controls left or right alignment for the header cell content.",
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
      "Body cell wrapper for row content, status pills, numeric values, and row actions.",
    fields: [
      field({
        name: "align",
        type: '"left" | "right"',
        defaultValue: "left",
        description: "Controls left or right alignment for the cell content.",
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
    id: "table-caption",
    title: "TableCaption",
    summary:
      "Low-emphasis caption line below the table, matching the original entry count styling.",
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
      "Animated empty-state block for zero-result or no-data states inside TableBody.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Empty-state copy or a richer no-data message.",
      }),
      field({
        name: "Motion div props",
        type: "ComponentPropsWithoutRef<typeof motion.div>",
        description:
          "You can still override animate, initial, transition, or className when customizing the empty state.",
      }),
    ],
  },
  {
    id: "table-sort-button",
    title: "TableSortButton",
    summary:
      "Optional header helper that preserves the original label-plus-chevron treatment and direction animation.",
    fields: [
      field({
        name: "active",
        type: "boolean",
        defaultValue: "false",
        description:
          "Strengthens the icon opacity and enables the active sort direction treatment.",
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
        type: '"left" | "right"',
        defaultValue: "left",
        description:
          "Keeps the sort button aligned with the header cell it lives in.",
      }),
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Visible sort label.",
      }),
      field({
        name: "className",
        type: "string",
        description: "Merged onto the button wrapper.",
      }),
    ],
    notes: [
      "The helper defaults to type='button', so it stays safe inside forms.",
    ],
  },
  registryItem("table.json", ["motion", "lucide-react"]),
];

const toggleApiDetails: DetailItem[] = [
  {
    id: "toggle",
    title: "Toggle",
    summary:
      "Single pressed-state toggle built on Radix Toggle, with Motion-driven button, icon, and ripple feedback layered over shadcn-style size and variant classes.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Visible button content rendered inside the animated inner span. This can be plain text, icons, or both.",
      }),
      field({
        name: "variant",
        type: '"default" | "outline"',
        defaultValue: "default",
        description:
          "Visual treatment from the internal CVA config. Outline adds the input border and shadow-sm treatment.",
      }),
      field({
        name: "size",
        type: '"default" | "sm" | "lg"',
        defaultValue: "default",
        description:
          "Height and horizontal padding preset applied through the shared toggleVariants helper.",
      }),
      field({
        name: "pressed",
        type: "boolean",
        description:
          "Controlled pressed state from Radix Toggle.Root. Use this when the parent should own the on/off state.",
      }),
      field({
        name: "defaultPressed",
        type: "boolean",
        description: "Initial pressed state for uncontrolled usage.",
      }),
      field({
        name: "onPressedChange",
        type: "(pressed: boolean) => void",
        description:
          "Called after the component kicks off its local motion sequence, with the next pressed value from Radix.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description:
          "Disables the toggle and prevents the hover, tap, and pressed-state interaction flow.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the rendered motion button for local spacing or surface overrides.",
      }),
    ],
    notes: [
      "Additional Radix toggle button props such as aria-label, name, value, and type are forwarded through the underlying Toggle.Root surface.",
      "The component renders Radix Root with asChild internally, then supplies its own motion.button as the child node.",
    ],
  },
  {
    id: "toggle-motion",
    title: "Motion and state behavior",
    summary:
      "Every pressed change triggers a button squash, a center ripple, and a separate icon animation sequence.",
    notes: [
      "The outer button uses useAnimationControls so the pressed sequence can run immediately whenever Radix reports a state change.",
      "The icon motion differs between on and off transitions, so enabling and disabling the toggle do not feel identical.",
      "Hover always applies a slight upward lift and tap applies an extra scale-down, independent of whether the toggle is currently pressed.",
    ],
  },
  registryItem("toggle.json", [
    "@radix-ui/react-toggle",
    "class-variance-authority",
    "motion",
  ]),
];

const switchApiDetails: DetailItem[] = [
  {
    id: "switch",
    title: "Switch",
    summary:
      "Binary on or off control built on Radix Switch, with a motion-driven thumb travel, foreground fill sweep, and optional inline label.",
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
        name: "disabled",
        type: "boolean",
        description:
          "Disables pointer and keyboard interaction, and dims the switch and optional label together.",
      }),
      field({
        name: "label",
        type: "string",
        description:
          "Optional inline text rendered beside the switch. When omitted, the component returns only the switch control itself.",
      }),
      field({
        name: "labelSide",
        type: '"left" | "right"',
        defaultValue: "right",
        description:
          "Controls which side of the switch the optional label text appears on.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the Radix root element for local spacing or surface overrides.",
      }),
    ],
    notes: [
      "Additional Radix switch props such as aria-label, name, value, required, and form are forwarded to the root control.",
      "If you provide label, the component wraps the control in a native label element so clicking the text also toggles the switch.",
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
      "Controlled and uncontrolled usage both keep the thumb animation synchronized with the underlying Radix state.",
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
      "Reduced-motion mode skips the sweep and settles immediately into the completed text state.",
      "When multiple text values are provided, the component clones the span to measure each string and can animate the width between entries for a smoother swap.",
      "If triggerOnView is enabled, playback is gated by the local viewport observer instead of always running on mount.",
    ],
  },
  registryItem("dia-text.json", ["motion"]),
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

const tooltipApiDetails: DetailItem[] = [
  {
    id: "tooltip",
    title: "Tooltip",
    summary:
      "Animated tooltip with a canonical Tooltip export. It owns its own open state and toggles in response to hover and focus events.",
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
  registryItem("tooltip.json", ["motion"]),
];

export {
  alertApiDetails,
  avatarApiDetails,
  badgeApiDetails,
  calendarApiDetails,
  carouselApiDetails,
  breadcrumbsApiDetails,
  buttonApiDetails,
  buttonGroupApiDetails,
  checkboxGroupApiDetails,
  comboboxApiDetails,
  contextMenuApiDetails,
  drawerApiDetails,
  diaTextApiDetails,
  dialogApiDetails,
  dropdownApiDetails,
  fileUploadApiDetails,
  hoverCardApiDetails,
  popoverApiDetails,
  inputGroupApiDetails,
  paginationApiDetails,
  accordionApiDetails,
  radioGroupApiDetails,
  shimmerTextApiDetails,
  skeletonApiDetails,
  selectApiDetails,
  sliderApiDetails,
  spinnerApiDetails,
  switchApiDetails,
  tableApiDetails,
  tabsApiDetails,
  toggleApiDetails,
  tooltipApiDetails,
};
