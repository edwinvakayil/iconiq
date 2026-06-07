import { CircleXIcon, TriangleAlertIcon } from "lucide-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

import { ConditionalFooter } from "@/components/conditional-footer";
import { DocsSidebar } from "@/components/docs-sidebar";
import { GitHubStarNudge } from "@/components/github-star-nudge";
import { Header } from "@/components/header";
import { PageTitleSync } from "@/components/page-title-sync";
import { PageTransition } from "@/components/page-transition";
import { RouteScrollReset } from "@/components/route-scroll-reset";
import { getRouteMetadata } from "@/lib/seo-routes";

export async function generateMetadata(): Promise<Metadata> {
  const pathname = (await headers()).get("x-pathname") ?? "/";
  return getRouteMetadata(pathname);
}

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <PageTitleSync />
      <RouteScrollReset />
      <div className="root">
        <Header />
        <div className="root-content">
          <div className="flex min-h-0 min-w-0 flex-1">
            <DocsSidebar />
            <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
              <NuqsAdapter>
                <PageTransition>{children}</PageTransition>
                <Toaster
                  icons={{
                    error: <CircleXIcon className="size-4 text-red-600" />,
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
            </div>
          </div>
        </div>
      </div>
      <GitHubStarNudge />
    </>
  );
}
