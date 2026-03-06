const SITE = {
  NAME: "Iconiq",
  URL: "https://iconiqs.vercel.app",
  OG_IMAGE: "/og.png",
  AUTHOR: {
    NAME: "Edwin Vakayil",
    TWITTER: "@edwinvakayil",
  },
  DESCRIPTION: {
    LONG: "Iconiq is a free open-source library of 350+ beautifully crafted animated React icons. Built with Motion and based on Lucide icons. Copy-paste ready, MIT licensed, fully customizable SVG icons with smooth animations.",
    SHORT:
      "Iconiq is a free animated React icons library with 350+ smooth Motion-powered icons based on Lucide icons. MIT licensed and copy-paste ready.",
  },
  KEYWORDS: [
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
    "MIT license icons",
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
} as const;

const PACKAGE_MANAGER = {
  NPM: "npm",
  PNPM: "pnpm",
  YARN: "yarn",
  BUN: "bun",
} as const;

export { LINK, PACKAGE_MANAGER, SITE };
