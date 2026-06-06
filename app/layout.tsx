import type { Viewport } from "next";

import "./globals.css";

import { statsigAdapter } from "@flags-sdk/statsig";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";

import { DynamicStatsigProvider } from "@/app/dynamic-statsig-provider";
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

async function getStatsigShell(children: React.ReactNode) {
  if (
    !(
      process.env.STATSIG_SERVER_API_KEY &&
      process.env.NEXT_PUBLIC_STATSIG_CLIENT_KEY
    )
  ) {
    return children;
  }

  const Statsig = await statsigAdapter.initialize();
  const datafile = await Statsig.getClientInitializeResponse(
    { userID: "anonymous" },
    { hash: "djb2" }
  );

  if (!datafile) {
    return children;
  }

  return (
    <DynamicStatsigProvider datafile={datafile}>
      {children}
    </DynamicStatsigProvider>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const statsigShell = await getStatsigShell(children);

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
            <PackageNameProvider>{statsigShell}</PackageNameProvider>
          </MotionTierProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
