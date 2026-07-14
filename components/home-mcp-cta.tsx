"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/home-button";
import { PageReveal } from "@/components/page-reveal";
import { SITE } from "@/constants";

const ctaPrimaryButtonClassName =
  "h-9 gap-1.5 border-transparent px-3 text-sm leading-5 [--primary:#ffffff] [--primary-foreground:#000000] shadow-[0_10px_24px_-6px_rgba(0,0,0,0.35)] sm:h-10 sm:px-4 sm:text-base";

const ctaSecondaryButtonClassName =
  "h-9 gap-1.5 border-white/45 px-3 text-sm leading-5 backdrop-blur-sm [--primary:rgba(255,255,255,0.16)] [--primary-foreground:#ffffff] sm:h-10 sm:px-4 sm:text-base";

export function HomeMcpCta() {
  return (
    <PageReveal className="mt-16 sm:mt-24" inView>
      <section
        aria-labelledby="home-mcp-cta-heading"
        className="relative overflow-hidden rounded-2xl"
      >
        <Image
          alt=""
          className="object-cover object-top"
          fill
          sizes="(min-width: 1024px) 1100px, 100vw"
          src="/CTA.png"
        />

        <div aria-hidden className="absolute inset-0 bg-black/45 sm:hidden" />

        <div className="relative grid gap-10 px-6 py-14 sm:px-12 sm:py-20 md:grid-cols-2 md:items-center md:gap-14 lg:px-16">
          <div>
            <h2
              className="max-w-[28ch] text-balance font-semibold text-[clamp(1.4rem,4.4vw,1.85rem)] text-white leading-[1.12] tracking-[-0.025em] [text-shadow:0_1px_12px_rgba(0,0,0,0.25)] sm:text-[2.15rem] sm:leading-[1.08]"
              id="home-mcp-cta-heading"
            >
              Install {SITE.NAME} components straight from your editor.
            </h2>
          </div>

          <div>
            <p className="max-w-[560px] font-medium text-[15px] text-white/90 leading-7 [text-shadow:0_1px_8px_rgba(0,0,0,0.2)] sm:text-[16px]">
              Connect {SITE.SHORT_NAME} UI to shadcn MCP and install editable
              components straight from your AI editor. Prefer browsing? Explore
              every component in the marketplace.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3">
              <Button
                className={ctaPrimaryButtonClassName}
                href="/mcp"
                icon={<ArrowRight className="size-3.5 sm:size-4" />}
                iconPosition="end"
                size="lg"
              >
                Set up MCP
              </Button>
              <Button
                className={ctaSecondaryButtonClassName}
                href="/marketplace"
                size="lg"
              >
                View marketplace
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageReveal>
  );
}
