const SITE = {
  NAME: "Iconiq UI",
  SHORT_NAME: "Iconiq",
  LOGO: "iconiq.",
  URL: "https://iconiqui.com",
  GOOGLE_SITE_VERIFICATION: "Q0ClgYhHbG0_wpdPrrl4AaoNekaLVmjgT-nIp_-sD7Y",
  OG_IMAGE: "/iconiqui.png",
  /** Bump when replacing the social preview image so crawlers fetch a fresh asset. */
  OG_IMAGE_VERSION: "2",
  AUTHOR: {
    NAME: "Edwin Vakayil",
    TWITTER: "@edwinvakayil",
  },
  DESCRIPTION: {
    LONG: "Iconiq UI is an open-source React component library built around the shadcn registry workflow. Browse motion-powered UI primitives, install them as local files, and adapt them directly inside modern interfaces.",
    SHORT:
      "Open-source React UI components with motion, shadcn registry installs, and editable source files.",
  },
  KEYWORDS: [
    "Iconiq UI",
    "iconiq ui",
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
  MOTION: "https://motion.dev",
  BUYMEACOFFEE: "https://buymeacoffee.com/edwinvakayil",
  VSCODE_MARKETPLACE:
    "https://marketplace.visualstudio.com/items?itemName=IconiqUI.iconiq-ui",
} as const;

const PACKAGE_MANAGER = {
  NPM: "npm",
  PNPM: "pnpm",
  YARN: "yarn",
  BUN: "bun",
} as const;

export { LINK, PACKAGE_MANAGER, SITE };
