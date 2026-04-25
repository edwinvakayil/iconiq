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
    LONG: "Iconiq is a free open-source library of 350+ beautifully crafted motion-powered icons and components. Built with Motion and based on Lucide icons. Copy-paste ready, fully customizable SVG icons with smooth animations.",
    SHORT:
      "Iconiq is a free motion-powered icons and components library with 350+ smooth icons based on Lucide. Open-source and copy-paste ready.",
  },
  KEYWORDS: [
    "motion-powered icons",
    "motion-powered components",
    "animated icons",
    "react icons",
    "motion icons",
    "lucide icons",
    "svg icons",
    "animated svg",
    "react components",
    "icon library",
    "open source icons",
    "framer motion icons",
    "animated react components",
    "free icons",
    "open source react icons",
    "copy paste icons",
    "tailwind icons",
    "nextjs icons",
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
