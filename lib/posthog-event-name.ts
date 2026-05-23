const REGISTRY_JSON_SUFFIX_REGEX = /\.json$/i;
const DOCS_HREF_SLUG_REGEX =
  /^\/(?:components|texts|special-one|foundation)\/([^/?#]+)/;
const DOCS_HREF_SECTION_REGEX =
  /^\/(components|texts|special-one|foundation)\//;
const PAGE_URL_ORIGIN_REGEX = /^https?:\/\/[^/]+/i;
const LEADING_SLASH_REGEX = /^\//;

/** `button.json` → `button` */
export function registrySlugFromPath(registryPath: string): string {
  return registryPath.replace(REGISTRY_JSON_SUFFIX_REGEX, "");
}

/** `/components/accordion` → `accordion` */
export function slugFromDocsHref(href: string): string | null {
  const match = href.match(DOCS_HREF_SLUG_REGEX);
  return match?.[1] ?? null;
}

/** `/components/accordion` → `components` */
export function sectionFromDocsHref(href: string): string | null {
  const match = href.match(DOCS_HREF_SECTION_REGEX);
  return match?.[1] ?? null;
}

/** `/installation` → `installation` */
export function slugFromPageUrl(pageUrl: string): string {
  const path = pageUrl
    .replace(PAGE_URL_ORIGIN_REGEX, "")
    .replace(LEADING_SLASH_REGEX, "");
  return path.split("/").filter(Boolean)[0] ?? "page";
}
