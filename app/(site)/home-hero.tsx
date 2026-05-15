"use client";

import { ArrowRight, FileText } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";

import { HomeFeaturedShowcase } from "@/components/home-featured-showcase";
import { PageStagger, PageStaggerItem } from "@/components/page-reveal";
import { useMotionTier } from "@/providers/motion-tier";

function ReactLogo() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="currentColor"
      viewBox="0 0 1093 977"
    >
      <g transform="translate(183.79242,-1.1577341)">
        <path d="m144 1c-20 0-39 5-56 15-21 13-37 34-46 56-11 27-15 57-16 86-1 50 7 99 19 147-22 7-44 14-66 22-36 15-72 32-103 57-22 18-43 41-53 68-9 23-9 48-1 71 7 21 21 40 37 55 20 19 42 34 66 47 38 20 78 35 120 47-12 51-21 103-19 155 1 26 5 53 16 77 8 19 20 37 36 49 16 13 35 20 55 22 22 2 45-2 66-9 24-8 47-20 69-34 35-22 67-49 97-78 30 29 61 55 96 77 29 18 60 34 94 41 21 4 43 4 64-3 18-6 35-17 47-31 15-17 24-38 29-60 7-27 9-55 8-83-2-42-9-84-19-124 46-13 92-30 134-55 27-16 52-35 70-60 15-20 25-43 25-68 0-23-8-46-21-64-18-27-44-47-71-64-42-25-89-43-136-57 13-51 21-104 19-156-1-26-6-53-16-77-8-19-20-37-37-49-16-12-36-19-56-21-21-2-42 2-62 9-25 8-48 21-70 35-34 22-66 49-95 77-32-31-66-59-103-82-28-17-59-32-93-37-8-1-15-2-23-2zm2 47c15 0 29 4 43 9 35 13 65 34 94 57 16 13 32 27 47 42-34 36-64 75-93 115-49 5-99 12-147 23-7-29-13-58-16-87-3-27-3-54 1-80 3-16 7-33 16-47 8-14 21-25 36-29 7-2 13-2 20-2zm435 0c11 0 21 2 31 7 15 8 25 23 31 38 9 22 11 47 11 71 0 44-7 88-18 130-48-11-98-18-147-23-29-40-59-79-93-115 29-28 61-55 96-77 22-13 45-24 70-29 6-1 13-2 19-2zM363 189c23 25 44 51 65 77-43-2-86-2-129 0 20-27 42-53 65-77zm0 123c33 0 67 1 100 4 38 55 71 114 101 174-29 60-62 119-101 174-66 5-133 5-199 0-38-55-72-114-101-174 29-60 63-119 101-174 33-2 67-4 100-4zm-160 10c-23 37-45 74-65 113-13-31-25-63-35-95 33-8 67-13 100-17zm320 0c34 4 67 10 100 18-10 32-22 64-35 96-20-38-42-76-65-113zm-466 29c15 47 33 94 54 139-21 45-39 92-54 139-45-13-89-29-129-54-19-12-38-27-52-46-10-14-16-32-13-49 4-21 19-39 35-53 27-23 59-39 91-53 22-9 45-17 68-23zm611 0c43 12 85 28 123 50 19 11 37 24 51 40 11 12 20 28 21 44 1 16-5 31-14 44-12 17-29 31-46 42-41 27-87 44-134 57-15-47-33-94-54-139 21-45 39-91 54-139zm-80 194c13 31 25 63 35 96-33 8-67 13-100 18 24-37 45-74 65-113zm-450 0c20 39 42 76 65 113-34-4-67-10-100-17 10-32 22-64 35-96zm498 141c10 39 17 78 18 118 1 25-1 50-8 74-5 16-13 32-27 43-13 10-29 13-44 11-24-2-46-11-67-22-41-22-77-53-111-85 33-35 63-72 90-111 1-1 2-4 4-4 49-5 98-12 146-23zm-546 0c49 11 98 18 147 23 29 40 60 79 93 116-30 29-62 56-97 78-22 13-45 24-70 29-16 3-34 2-49-6-15-8-25-23-31-39-8-22-11-46-11-70 0-44 8-87 18-129zm208 27c43 2 86 2 130 0-20 27-42 53-65 78-23-25-44-51-65-77z" />
        <path d="m354 392c19-2 38 2 55 11 20 11 36 28 44 49 10 24 10 52 0 76-13 33-45 57-80 60-21 2-44-3-62-14-20-12-35-32-42-54-8-24-5-51 6-74 15-30 46-51 79-53z" />
      </g>
    </svg>
  );
}

function TypeScriptLogo() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M19.24 3H4.76A1.76 1.76 0 0 0 3 4.76v14.48A1.76 1.76 0 0 0 4.76 21h14.48A1.76 1.76 0 0 0 21 19.24V4.76A1.76 1.76 0 0 0 19.24 3m-5.8 10h-2.25v6.44H9.4V13H7.15v-1.46h6.29zm5.8 5.28a1.7 1.7 0 0 1-.67.74 3 3 0 0 1-1 .39 6 6 0 0 1-1.2.12 7 7 0 0 1-1.23-.11 4.5 4.5 0 0 1-1-.33v-1.71l-.06-.06h.06v.07a3.4 3.4 0 0 0 1 .54 3.1 3.1 0 0 0 1.13.2 2.6 2.6 0 0 0 .6-.06 1.5 1.5 0 0 0 .42-.17.75.75 0 0 0 .25-.25.69.69 0 0 0-.06-.74 1.2 1.2 0 0 0-.35-.33 3 3 0 0 0-.53-.3l-.67-.28a3.6 3.6 0 0 1-1.37-1 2 2 0 0 1-.46-1.33 2.16 2.16 0 0 1 .24-1.06 2.1 2.1 0 0 1 .66-.71 2.9 2.9 0 0 1 1-.42 5 5 0 0 1 1.19-.13 7 7 0 0 1 1.09.07 4.5 4.5 0 0 1 .88.23v1.65a2.4 2.4 0 0 0-.42-.24 4 4 0 0 0-.49-.17 3 3 0 0 0-.49-.1 2.5 2.5 0 0 0-.46 0 2.3 2.3 0 0 0-.56.06 1.5 1.5 0 0 0-.43.16.8.8 0 0 0-.26.25.63.63 0 0 0-.09.33.6.6 0 0 0 .1.35 1.2 1.2 0 0 0 .3.29 2.2 2.2 0 0 0 .46.28l.63.28a6.6 6.6 0 0 1 .84.42 2.7 2.7 0 0 1 .64.49 1.8 1.8 0 0 1 .42.63 2.5 2.5 0 0 1 .14.85 2.7 2.7 0 0 1-.25 1.08z" />
    </svg>
  );
}

function TailwindLogo() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M18.5 9.51a4.2 4.2 0 0 1-1.91-1.34A5.77 5.77 0 0 0 12 6a4.72 4.72 0 0 0-5 4 3.23 3.23 0 0 1 3.5-1.49 4.3 4.3 0 0 1 1.91 1.35A5.77 5.77 0 0 0 17 12a4.72 4.72 0 0 0 5-4 3.2 3.2 0 0 1-3.5 1.51m-13 4.98a4.2 4.2 0 0 1 1.91 1.34A5.77 5.77 0 0 0 12 18a4.72 4.72 0 0 0 5-4 3.23 3.23 0 0 1-3.5 1.49 4.3 4.3 0 0 1-1.91-1.35A5.8 5.8 0 0 0 7 12a4.72 4.72 0 0 0-5 4 3.2 3.2 0 0 1 3.5-1.51" />
    </svg>
  );
}

function MotionLogo() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="currentColor"
      viewBox="0 0 1260 454"
    >
      <path d="M475.753 0 226.8 453.6H0L194.392 99.412C224.526 44.508 299.724 0 362.353 0zM1031.93 113.4c0-62.63 50.77-113.4 113.4-113.4s113.4 50.77 113.4 113.4c0 62.629-50.77 113.4-113.4 113.4s-113.4-50.771-113.4-113.4M518.278 0h226.8L496.125 453.6h-226.8zM786.147 0h226.803L818.555 354.188C788.422 409.092 713.223 453.6 650.594 453.6h-113.4z" />
    </svg>
  );
}

function ShadcnLogo() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="m19.01 11.55-7.46 7.46c-.46.46-.46 1.19 0 1.65a1.16 1.16 0 0 0 1.64 0l7.46-7.46c.46-.46.46-1.19 0-1.65s-1.19-.46-1.65 0ZM19.17 3.34c-.46-.46-1.19-.46-1.65 0L3.34 17.52c-.46.46-.46 1.19 0 1.65a1.16 1.16 0 0 0 1.64 0L19.16 4.99c.46-.46.46-1.19 0-1.65Z" />
    </svg>
  );
}

const frameworkLogos = [
  { label: "React", icon: <ReactLogo /> },
  { label: "TS", icon: <TypeScriptLogo /> },
  { label: "Tailwind", icon: <TailwindLogo /> },
  { label: "Motion", icon: <MotionLogo /> },
  { label: "shadcn", icon: <ShadcnLogo /> },
] as const;

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

function HeroHeading({ animateEntrance }: { animateEntrance: boolean }) {
  const prefersReducedMotion = useReducedMotion();

  const heading = (
    <>
      <span className="block whitespace-nowrap">
        Build UI that{" "}
        <span className="relative inline-block">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[-0.08em] bottom-[0.06em] h-[0.26em] translate-y-[38%] text-sky-200/90 dark:text-sky-500/35"
          >
            <svg
              className="h-full w-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 240 28"
            >
              <path
                d="M6 18.5C28 14.2 52.4 15.1 75 14.4C102.2 13.6 129 13.5 156.4 12.9C182.9 12.3 207.5 11 234 9.8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="11"
              />
              <path
                d="M15 22.1C40.6 19.1 68 19.2 95.2 18.4C122.5 17.8 149.9 16.9 177.1 16.4C196.8 16 214.3 15.2 232 13.8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="7"
              />
            </svg>
          </span>
          <span className="relative text-sky-500 dark:text-sky-400">
            stands out.
          </span>
        </span>
      </span>
      <span className="block whitespace-nowrap">
        Without giving up the source.
      </span>
    </>
  );

  if (prefersReducedMotion || !animateEntrance) {
    return (
      <h1 className="max-w-none font-medium text-[clamp(1.7rem,8vw,2rem)] text-foreground leading-[1.04] tracking-[-0.075em] sm:mx-auto sm:max-w-[24ch] sm:text-[4.35rem] sm:leading-[0.98] lg:text-[5.2rem]">
        {heading}
      </h1>
    );
  }

  return (
    <motion.h1
      animate="visible"
      className="max-w-none font-medium text-[clamp(1.7rem,8vw,2rem)] text-foreground leading-[1.04] tracking-[-0.075em] sm:mx-auto sm:max-w-[24ch] sm:text-[4.35rem] sm:leading-[0.98] lg:text-[5.2rem]"
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
        className="block whitespace-nowrap"
        variants={heroHeadingLineMotion}
      >
        Build UI that{" "}
        <span className="relative inline-block">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[-0.08em] bottom-[0.06em] h-[0.26em] translate-y-[38%] text-sky-200/90 dark:text-sky-500/35"
          >
            <svg
              className="h-full w-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 240 28"
            >
              <path
                d="M6 18.5C28 14.2 52.4 15.1 75 14.4C102.2 13.6 129 13.5 156.4 12.9C182.9 12.3 207.5 11 234 9.8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="11"
              />
              <path
                d="M15 22.1C40.6 19.1 68 19.2 95.2 18.4C122.5 17.8 149.9 16.9 177.1 16.4C196.8 16 214.3 15.2 232 13.8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="7"
              />
            </svg>
          </span>
          <span className="relative text-sky-500 dark:text-sky-400">
            stands out.
          </span>
        </span>
      </motion.span>
      <motion.span
        className="block whitespace-nowrap"
        variants={heroHeadingLineMotion}
      >
        Without giving up the source.
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
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div
          animate={animateEntrance ? { opacity: 1, y: 0 } : undefined}
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
              <div className="mb-3 w-full sm:mx-auto sm:mb-4 sm:max-w-[760px]">
                <div className="flex justify-start">
                  <div className="inline-flex items-center -space-x-2.5 text-[#6f7787] dark:text-muted-foreground">
                    {frameworkLogos.map((item) => (
                      <span
                        className="inline-flex size-8 items-center justify-center rounded-full border border-border/70 bg-background/95 transition-colors dark:bg-background/75"
                        key={item.label}
                        title={item.label}
                      >
                        {item.icon}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </PageStaggerItem>

            <PageStaggerItem>
              <HeroHeading animateEntrance={animateEntrance} />
            </PageStaggerItem>

            <PageStaggerItem>
              <p className="mt-5 max-w-[640px] text-[15px] text-secondary leading-6 sm:mx-auto sm:mt-6 sm:max-w-[760px] sm:text-[18px] sm:leading-8">
                Copy, customize, and ship polished React components in minutes.
              </p>
            </PageStaggerItem>

            <PageStaggerItem>
              <div className="mt-8 flex flex-wrap justify-start gap-3 sm:justify-center">
                <Link
                  className="inline-flex h-10 items-center gap-1.5 px-1 font-medium text-[15px] text-foreground transition-colors hover:text-foreground/80"
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
      </div>
    </section>
  );
}
