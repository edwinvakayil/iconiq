import type { Viewport } from "next";

import "./globals.css";
import { CircleXIcon, TriangleAlertIcon } from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

import { Analytics } from "@/components/analytics";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
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
  userScalable: false,
  maximumScale: 1,
  minimumScale: 1,
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
        <JsonLdScripts />
      </head>
      <body className={`${geist.className} relative bg-background antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="root">
            <PackageNameProvider>
              <Header />
              <div className="root-content">
                <div className="min-w-0 px-4 sm:px-6 lg:px-[80px]">
                  <main className="flex-1">
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
                  </main>
                  <Analytics />
                </div>
                <Footer />
              </div>
            </PackageNameProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
