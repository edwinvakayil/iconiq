"use client";

import { ArrowRight, FileText } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { HomeFeaturedShowcase } from "@/components/home-featured-showcase";
import { PageStagger, PageStaggerItem } from "@/components/page-reveal";
import { useMotionTier } from "@/providers/motion-tier";

let hasPlayedHomeEntrance = false;

const HERO_MOTION_EASE = [0.22, 1, 0.36, 1] as const;

const heroHeadingLineMotion = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.24,
      ease: HERO_MOTION_EASE,
    },
  },
};

const heroBrandMarkClassName =
  "relative mx-1 inline-flex h-[0.82em] w-[0.82em] shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-background align-middle shadow-[0_1px_0_rgba(0,0,0,0.04)] ring-1 ring-black/3 sm:mx-1.5";

function HeroBrandMark({
  alt,
  href,
  src,
}: {
  alt: string;
  href?: string;
  src: string;
}) {
  const image = (
    <Image alt={alt} className="object-cover" fill sizes="32px" src={src} />
  );

  if (href) {
    return (
      <a
        className={`${heroBrandMarkClassName} transition-opacity hover:opacity-85`}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        title={alt}
      >
        {image}
      </a>
    );
  }

  return <span className={heroBrandMarkClassName}>{image}</span>;
}

function HeroHeadingPrimaryLine() {
  return (
    <>
      Built on
      <HeroBrandMark
        alt="shadcn/ui"
        href="https://ui.shadcn.com/"
        src="/assets/shadcn.jpg"
      />
      shadcn/ui
      <span className="text-secondary"> with </span>
      <HeroBrandMark
        alt="Motion"
        href="https://motion.dev/"
        src="/assets/motion.png"
      />
      Motion
    </>
  );
}

function HeroHeadingSecondaryLine() {
  return <>Copy the source. Ship the polish.</>;
}

function HeroHeading({ animateEntrance }: { animateEntrance: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  const headingClassName =
    "max-w-none font-medium text-[clamp(1.45rem,5.5vw,1.875rem)] text-foreground leading-[1.1] tracking-[-0.06em] sm:mx-auto sm:max-w-none sm:text-[3.15rem] sm:leading-[1.06] lg:text-[3.75rem]";

  if (prefersReducedMotion || !animateEntrance) {
    return (
      <h1 className={headingClassName}>
        <span className="block sm:whitespace-nowrap">
          <HeroHeadingPrimaryLine />
        </span>
        <span className="mt-1 block text-secondary sm:mt-0 sm:whitespace-nowrap">
          <HeroHeadingSecondaryLine />
        </span>
      </h1>
    );
  }

  return (
    <motion.h1
      animate="visible"
      className={headingClassName}
      initial="hidden"
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: 0.06,
            staggerChildren: 0.08,
          },
        },
      }}
    >
      <motion.span
        className="block sm:whitespace-nowrap"
        variants={heroHeadingLineMotion}
      >
        <HeroHeadingPrimaryLine />
      </motion.span>
      <motion.span
        className="mt-1 block text-secondary sm:mt-0 sm:whitespace-nowrap"
        variants={heroHeadingLineMotion}
      >
        <HeroHeadingSecondaryLine />
      </motion.span>
    </motion.h1>
  );
}

export function HomeHero() {
  const tier = useMotionTier();
  const prefersReducedMotion = useReducedMotion();
  const animateEntrance =
    !(hasPlayedHomeEntrance || prefersReducedMotion) && tier === "full";

  if (animateEntrance) {
    hasPlayedHomeEntrance = true;
  }

  return (
    <section className="bg-background pt-12 pb-18 sm:pt-16 sm:pb-24">
      <motion.div
        animate={animateEntrance ? { opacity: 1, y: 0 } : undefined}
        className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8"
        initial={animateEntrance ? { opacity: 0, y: 8 } : false}
        transition={
          animateEntrance
            ? {
                duration: 0.22,
                ease: HERO_MOTION_EASE,
              }
            : undefined
        }
      >
        <PageStagger
          className="mx-auto max-w-[1120px] text-left sm:text-center"
          delayChildren={0.04}
          enabled={animateEntrance}
        >
          <PageStaggerItem>
            <HeroHeading animateEntrance={animateEntrance} />
          </PageStaggerItem>

          <PageStaggerItem>
            <p className="mt-5 max-w-[640px] text-[15px] text-secondary leading-6 sm:mx-auto sm:mt-6 sm:max-w-[760px] sm:text-[18px] sm:leading-8">
              shadcn/ui primitives you own, Motion animations you feel—paste a
              component, tune the tokens, and ship without the boilerplate hunt.
            </p>
          </PageStaggerItem>

          <PageStaggerItem>
            <div className="mt-8 flex flex-wrap justify-start gap-3 sm:justify-center">
              <Link
                className="inline-flex h-10 items-center gap-1.5 px-1 font-medium text-[15px] text-foreground decoration-transparent underline-offset-4 transition-[color,text-decoration-color] hover:text-foreground/80 hover:underline hover:decoration-foreground"
                href="/introduction"
              >
                <FileText className="size-[18px]" />
                See Docs
              </Link>
              <Link
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-foreground px-5 font-medium text-background text-sm shadow-[0_10px_24px_rgba(14,165,233,0.22)] transition-[background-color,box-shadow,color] hover:bg-foreground/92 hover:shadow-[0_12px_28px_rgba(14,165,233,0.3)] dark:hover:text-background!"
                href="/components/accordion"
              >
                View components
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </PageStaggerItem>

          <PageStaggerItem>
            <HomeFeaturedShowcase />
          </PageStaggerItem>
        </PageStagger>
      </motion.div>
    </section>
  );
}
