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
  registryItem("avatar.json", ["framer-motion"]),
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
  registryItem("calendar.json", ["framer-motion", "lucide-react", "date-fns"]),
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
  registryItem("carousels.json", ["framer-motion", "lucide-react"]),
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
  registryItem("combobox.json", ["framer-motion", "lucide-react"]),
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
  registryItem("context-menu.json", ["framer-motion"]),
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
  registryItem("drawer.json", ["framer-motion", "lucide-react"]),
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
  registryItem("dropdown.json", ["framer-motion", "lucide-react"]),
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
  registryItem("file-upload.json", ["framer-motion", "lucide-react"]),
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
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Composition surface for the trigger and content primitives rendered inside the root.",
      }),
    ],
    notes: [
      "Other Radix root props continue to work because the wrapper forwards the remaining root props to CollapsiblePrimitive.Root.",
      "The root stores the resolved open state in React context so CollapsibleContent can animate without reading Radix data attributes.",
    ],
  },
  {
    id: "collapsible-trigger",
    title: "CollapsibleTrigger",
    summary: "Thin wrapper around Radix CollapsibleTrigger.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description: "Interactive content rendered inside the trigger surface.",
      }),
      field({
        name: "asChild",
        type: "boolean",
        description:
          "Lets you supply your own trigger element while preserving the Radix trigger behavior.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description:
          "Disables trigger interaction through the underlying Radix primitive.",
      }),
    ],
    notes: [
      "Any remaining trigger props and event handlers are forwarded directly to CollapsiblePrimitive.CollapsibleTrigger.",
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
    "framer-motion",
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
  registryItem("hover-card.json", ["@radix-ui/react-slot", "framer-motion"]),
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
  registryItem("popover.json", ["@radix-ui/react-popover", "framer-motion"]),
];

const inputApiDetails: DetailItem[] = [
  {
    id: "input",
    title: "Input",
    summary:
      "Animated text input with a canonical Input export, always-visible label, and built-in helper behaviors for password, search, and email states.",
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
        name: "placeholder",
        type: "string",
        description:
          "Forwarded to the native input so empty fields can show guidance copy before any text is entered.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description:
          "Disables the native input and also turns off interactive affordances such as the password toggle and search clear button.",
      }),
      field({
        name: "readOnly",
        type: "boolean",
        description:
          "Leaves the field focusable but disables local editing affordances and prevents value changes through the built-in helper actions.",
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
      "Standard input attributes such as name, autoComplete, min, max, step, inputMode, onBlur, and onFocus are forwarded to the native input element.",
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
          "Body copy shown inside the open panel with a masked fade-and-slide reveal plus softly staggered text chunks.",
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
      "The content body reveals through a clipped slide-and-fade motion, then resolves in softly staggered text chunks.",
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
    title: "Switch",
    summary:
      "Animated switch with a canonical Switch export. Checked state is expected to come from the parent.",
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

const tabsApiDetails: DetailItem[] = [
  {
    id: "tabs",
    title: "Tabs",
    summary:
      "Root provider that manages the active value, hover state, trigger measurements, and the shared animated panel transition.",
    fields: [
      field({
        name: "children",
        type: "ReactNode",
        required: true,
        description:
          "Compose TabsList, TabsTrigger, and TabsContent inside the root, following the same structure people expect from shadcn tabs.",
      }),
      field({
        name: "defaultValue",
        type: "string",
        description:
          "Initial active tab value for uncontrolled usage. When omitted, the first TabsContent value becomes active.",
      }),
      field({
        name: "value",
        type: "string",
        description: "Controlled active tab value.",
      }),
      field({
        name: "onValueChange",
        type: "(value: string) => void",
        description:
          "Called when a trigger changes the active tab through click or keyboard navigation.",
      }),
      field({
        name: "className",
        type: "string",
        description:
          "Merged onto the root wrapper around the tab rail and the animated content area.",
      }),
    ],
    notes: [
      "Underline positions are still measured from the live trigger layout, so the indicators follow the actual tab widths instead of fixed columns.",
      "The root renders the active panel through a single AnimatePresence block, which preserves the existing blur-and-slide motion while exposing a composable API.",
    ],
  },
  {
    id: "tabs-list",
    title: "TabsList",
    summary:
      "Measured trigger rail that renders the active underline and hover ghost underline without changing the visual design of the original component.",
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
      "The list sets role='tablist' and clears the hover underline when the pointer leaves the rail.",
    ],
  },
  {
    id: "tabs-trigger",
    title: "TabsTrigger",
    summary:
      "Native button trigger that drives the active tab, hover state, keyboard navigation, and underline measurements.",
    fields: [
      field({
        name: "value",
        type: "string",
        required: true,
        description:
          "Unique tab identifier used for active state, focus movement, and content matching.",
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
          "Merged onto the trigger button if you need local spacing or typography overrides.",
      }),
      field({
        name: "disabled",
        type: "boolean",
        description:
          "Prevents the trigger from receiving focus or changing the active tab.",
      }),
    ],
    notes: [
      "Arrow keys, Home, and End move between enabled triggers and also activate the next tab so the panel transition stays in sync with focus.",
      "Trigger color treatment is unchanged from the original component: active tabs are strongest, hover/focus tabs are mid-tone, and inactive tabs stay quieter.",
    ],
  },
  {
    id: "tabs-content",
    title: "TabsContent",
    summary:
      "Declarative content marker for a single tab panel. The root reads these nodes and renders the active one through the shared animated content shell.",
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
        description:
          "Merged onto the animated panel wrapper for the active content only.",
      }),
    ],
    notes: [
      "TabsContent itself does not render in place. It acts as a declarative child so the root can preserve a single shared animated panel area below the list.",
      "Place TabsContent as direct or nested children of Tabs; the root collects them recursively before picking the active panel.",
      "Standard div attributes such as data-*, aria-*, id, style, and event handlers are forwarded to the rendered active panel.",
    ],
  },
  registryItem("tabs.json", ["framer-motion"]),
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
  registryItem("table.json", ["framer-motion", "lucide-react"]),
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
  registryItem("tooltip.json", ["framer-motion"]),
];

export {
  alertApiDetails,
  avatarApiDetails,
  badgeApiDetails,
  calendarApiDetails,
  carouselApiDetails,
  breadcrumbsApiDetails,
  buttonApiDetails,
  checkboxGroupApiDetails,
  comboboxApiDetails,
  contextMenuApiDetails,
  collapsibleApiDetails,
  drawerApiDetails,
  dialogApiDetails,
  dropdownApiDetails,
  fileUploadApiDetails,
  hoverCardApiDetails,
  popoverApiDetails,
  inputApiDetails,
  motionAccordionApiDetails,
  radioGroupApiDetails,
  selectApiDetails,
  sliderApiDetails,
  spinnerApiDetails,
  switchApiDetails,
  tableApiDetails,
  tabsApiDetails,
  tooltipApiDetails,
};
