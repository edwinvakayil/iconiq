import type { Viewport } from "next";

import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

import { SITE } from "@/constants";
import { MotionTierProvider } from "@/providers/motion-tier";
import { PackageNameProvider } from "@/providers/package-name";
import { ThemeProvider } from "@/providers/theme";
import { JsonLdScripts } from "@/seo/json-ld";
import { baseMetadata } from "@/seo/metadata";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = baseMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${geistMono.variable} ${geistSans.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link
          href="/llms.txt"
          rel="alternate"
          title={`${SITE.NAME} LLM overview`}
          type="text/plain"
        />
        <link
          href="/llms-full.txt"
          rel="alternate"
          title={`${SITE.NAME} full LLM index`}
          type="text/plain"
        />
        <link
          href="/ai-index.json"
          rel="alternate"
          title={`${SITE.NAME} AI index`}
          type="application/json"
        />
        <JsonLdScripts />
      </head>
      <body className="relative bg-background font-sans antialiased">
        <ThemeProvider>
          <MotionTierProvider>
            <PackageNameProvider>{children}</PackageNameProvider>
          </MotionTierProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
