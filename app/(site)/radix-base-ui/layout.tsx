import type { Metadata } from "next";

import { createMetadata } from "@/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Components",
  description:
    "Compare provider-backed registry entries that keep the same product-facing API while swapping the underlying headless library.",
  keywords: [
    "radix ui components",
    "base ui components",
    "headless react components",
    "registry variants",
  ],
});

export default function RadixBaseUiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
