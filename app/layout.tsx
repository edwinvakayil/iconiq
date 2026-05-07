import type { Viewport } from "next";

import "./globals.css";
import { CircleXIcon, TriangleAlertIcon } from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

import { Analytics } from "@/components/analytics";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { ConditionalFooter } from "@/components/conditional-footer";
import { DocsSidebar } from "@/components/docs-sidebar";
import { Header } from "@/components/header";
import { PageTitleSync } from "@/components/page-title-sync";
import { StarPromptCard } from "@/components/star-prompt-card";
import { SITE } from "@/constants";
import { PackageNameProvider } from "@/providers/package-name";
import { ThemeProvider } from "@/providers/theme";
import { JsonLdScripts } from "@/seo/json-ld";
import { baseMetadata } from "@/seo/metadata";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const geist = Geist({
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
      className={`${geistMono.variable} ${geist.variable}`}
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
      <body className={`${geist.className} relative bg-background antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PageTitleSync />
          <div className="root">
            <PackageNameProvider>
              <AnnouncementBanner />
              <Header />
              <div className="root-content">
                <div className="flex min-h-0 min-w-0 flex-1">
                  <DocsSidebar />
                  <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
                    <NuqsAdapter>
                      {children}
                      <Toaster
                        icons={{
                          error: (
                            <CircleXIcon className="size-4 text-red-600" />
                          ),
                          warning: (
                            <TriangleAlertIcon className="size-4 text-yellow-500" />
                          ),
                        }}
                        position="top-center"
                        toastOptions={{
                          classNames: {
                            toast:
                              "!flex !items-center !justify-center !bg-white !px-4 !py-4 !gap-2 !border-neutral-900/5 supports-[corner-shape:squircle]:!corner-squircle supports-[corner-shape:squircle]:!rounded-[30px] !rounded-[14px]",
                            title: "font-sans text-black !text-center",
                            icon: "translate-y-[-9.5px]",
                            actionButton:
                              "!mt-2 w-full flex items-center justify-center !font-sans !bg-primary focus-visible:outline-primary cursor-pointer !h-8 !text-[14px] transition-colors duration-100 hover:!bg-[color-mix(in_oklab,var(--color-primary),black_10%)] focus-visible:outline-1 focus-visible:outline-offset-1 supports-[corner-shape:squircle]:!corner-squircle supports-[corner-shape:squircle]:!rounded-[30px] !rounded-[14px]",
                            description: "font-sans text-secondary",
                          },
                        }}
                      />
                    </NuqsAdapter>
                    <ConditionalFooter />
                    <Analytics />
                  </div>
                </div>
              </div>
              <StarPromptCard />
            </PackageNameProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
