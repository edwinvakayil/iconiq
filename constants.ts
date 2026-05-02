const SITE = {
  NAME: "Iconiq",
  LOGO: "iconiq.",
  URL: "https://iconiqui.com",
  OG_IMAGE: "/opengraph-image",
  AUTHOR: {
    NAME: "Edwin Vakayil",
    TWITTER: "@edwinvakayil",
  },
  DESCRIPTION: {
    LONG: "Iconiq is an open-source React component library built around the shadcn registry workflow. Browse polished UI primitives, install them as local files, and adapt them directly inside modern interfaces.",
    SHORT:
      "Open-source React components delivered through the shadcn registry with editable, polished UI primitives.",
  },
  KEYWORDS: [
    "open source react component library",
    "motion-powered components",
    "react components",
    "component library",
    "open source components",
    "framer motion components",
    "animated react components",
    "copy paste components",
    "tailwind components",
    "nextjs components",
    "shadcn registry",
    "shadcn component library",
    "editable ui library",
    "motion ui library",
    "editable react components",
  ],
} as const;

const LINK = {
  TWITTER: "https://x.com/edwinvakayil",
  GITHUB: "https://github.com/edwinvakayil/iconiq",
  LUCIDE: "https://lucide.dev",
  MOTION: "https://motion.dev",
  LICENSE: "https://github.com/edwinvakayil/iconiq/blob/main/LICENSE",
  BUYMEACOFFEE: "https://buymeacoffee.com/edwinvakayil",
} as const;

const PACKAGE_MANAGER = {
  NPM: "npm",
  PNPM: "pnpm",
  YARN: "yarn",
  BUN: "bun",
} as const;

export { LINK, PACKAGE_MANAGER, SITE };
