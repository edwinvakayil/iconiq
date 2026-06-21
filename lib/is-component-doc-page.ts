import { BASE_LINKS, SITE_SECTIONS } from "@/lib/site-nav";

const COMPONENT_DOC_PATHS: Set<string> = new Set(
  SITE_SECTIONS.flatMap((section) => section.children.map((item) => item.href))
);

const GETTING_STARTED_DOC_PATHS: Set<string> = new Set(
  BASE_LINKS.filter((item) => item.href !== "/").map((item) => item.href)
);

export function isComponentDocPage(pathname: string) {
  return COMPONENT_DOC_PATHS.has(pathname);
}

export function isGettingStartedDocPage(pathname: string) {
  return GETTING_STARTED_DOC_PATHS.has(pathname);
}

export function isSplitDocsPage(pathname: string) {
  return isComponentDocPage(pathname) || isGettingStartedDocPage(pathname);
}
