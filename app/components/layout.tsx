import type { Metadata } from "next";

import { ComponentItemListJsonLd } from "@/seo/json-ld";
import { createMetadata } from "@/seo/metadata";

export const metadata: Metadata = createMetadata({
  title: "Components",
  description:
    "Browse Iconiq component documentation with live previews, installation steps, usage examples, and API details for editable React UI primitives.",
  keywords: [
    "component documentation",
    "react ui primitives",
    "live component previews",
    "shadcn registry components",
  ],
});

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ComponentItemListJsonLd />
      {children}
    </>
  );
}
