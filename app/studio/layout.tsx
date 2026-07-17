import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iconiq Studio — Visual composition, production code",
  description:
    "Compose interfaces visually with Iconiq components and export clean, production-ready React + Tailwind code.",
  robots: { index: true, follow: true },
};

export default function StudioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
