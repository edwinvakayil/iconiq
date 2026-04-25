const SITE = {
  NAME: "Iconiq",
  LOGO: "iconiq.",
  URL: "https://iconiqui.com",
  OG_IMAGE: "/og.png",
  AUTHOR: {
    NAME: "Edwin Vakayil",
    TWITTER: "@edwinvakayil",
  },
  DESCRIPTION: {
    LONG: "Iconiq is an open-source library of motion-powered React components with a source-first registry workflow. Copy-paste ready, customizable, and designed for modern product interfaces.",
    SHORT:
      "Iconiq is a motion-powered component library for React with a source-first registry workflow. Open-source and copy-paste ready.",
  },
  KEYWORDS: [
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
    "source first ui",
    "motion ui library",
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
