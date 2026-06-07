/** URL path prefix for each docs sidebar section. */
export const SECTION_PATH_PREFIX = {
  "Buttons & Actions": "/buttons-and-actions",
  "Inputs & Forms": "/inputs-and-forms",
  "Overlay & Popups": "/overlay-and-popups",
  Navigation: "/navigation",
  "Display & Content": "/display-and-content",
  "Feedback & Alerts": "/feedback-and-alerts",
  "Layout & Toolbars": "/layout-and-toolbars",
  "Special One": "/special-one",
  Foundation: "/foundation",
  Texts: "/texts",
} as const;

export type SectionLabel = keyof typeof SECTION_PATH_PREFIX;

export const DOCS_SECTION_SEGMENTS = [
  "buttons-and-actions",
  "inputs-and-forms",
  "overlay-and-popups",
  "navigation",
  "display-and-content",
  "feedback-and-alerts",
  "layout-and-toolbars",
  "components",
  "radix-base-ui",
  "texts",
  "special-one",
  "foundation",
] as const;
