/** Stable PostHog event names (`area_object_action`). */
export const POSTHOG_EVENTS = {
  DOCS_INSTALL_COPIED: "docs_install_copied",
  DOCS_PAGE_COPIED: "docs_page_copied",
  DOCS_OPEN_IN_V0_CLICKED: "docs_open_in_v0_clicked",
  DOCS_ASK_CHATGPT_CLICKED: "docs_ask_chatgpt_clicked",
  DOCS_REGISTRY_JSON_VIEWED: "docs_registry_json_viewed",
  SEARCH_OPENED: "search_opened",
  SEARCH_RESULT_SELECTED: "search_result_selected",
  SETTINGS_PACKAGE_MANAGER_CHANGED: "settings_package_manager_changed",
  SPONSOR_PAGE_VIEWED: "sponsor_page_viewed",
} as const;

export type PostHogEventName =
  (typeof POSTHOG_EVENTS)[keyof typeof POSTHOG_EVENTS];
