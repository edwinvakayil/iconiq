import type { Metadata } from "next";

import { createMetadata } from "@/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Texts",
  description:
    "Animated text treatments and motion-aware inline typography utilities for Iconiq.",
  keywords: [
    "animated text components",
    "react text reveal",
    "motion typography",
  ],
});

export default function TextsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
