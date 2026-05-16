import type { Metadata } from "next";

import { createMetadata } from "@/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Foundation",
  description:
    "Foundational design primitives and shared scales for Iconiq interfaces.",
  keywords: ["design foundation", "typography scale", "interface foundations"],
});

export default function FoundationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
