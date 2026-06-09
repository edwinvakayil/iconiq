"use client";

import { ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/home-button";
import { cn } from "@/lib/utils";
import { useMotionTier } from "@/providers/motion-tier";

const HomeFeaturedShowcase = dynamic(
  () =>
    import("@/components/home-featured-showcase").then(
      (mod) => mod.HomeFeaturedShowcase
    ),
  { ssr: false }
);

const HOME_FLUID_SPRING = {
  type: "spring" as const,
  stiffness: 280,
  damping: 32,
  mass: 0.88,
};

const HOME_GENTLE_SPRING = {
  type: "spring" as const,
  stiffness: 240,
  damping: 30,
  mass: 0.95,
};

const HOME_SHOWCASE_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 34,
  mass: 1,
};

const HOME_CTA_ARROW_SPRING = {
  type: "spring" as const,
  stiffness: 380,
  damping: 34,
  mass: 0.72,
};

const heroContainerMotion = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: HOME_FLUID_SPRING,
  },
};

const heroContainerLiteMotion = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const heroPrimaryLineMotion = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      ...HOME_GENTLE_SPRING,
      staggerChildren: 0.07,
      delayChildren: 0.06,
    },
  },
};

const heroHeadingLineMotion = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: HOME_GENTLE_SPRING,
  },
};

const heroBrandMarkMotion = {
  hidden: {
    opacity: 0,
    scale: 0.6,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 420,
      damping: 26,
      mass: 0.7,
    },
  },
};

const heroDescriptionMotion = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      ...HOME_GENTLE_SPRING,
      delay: 0.38,
    },
  },
};

const heroDescriptionLiteMotion = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: 0.28,
    },
  },
};

const heroCtasMotion = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...HOME_GENTLE_SPRING,
      delay: 0.62,
    },
  },
};

const heroCtasLiteMotion = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: 0.42,
    },
  },
};

const heroShowcaseMotion = {
  hidden: {
    opacity: 0,
    y: 32,
    filter: "blur(12px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      ...HOME_SHOWCASE_SPRING,
      delay: 0.42,
      opacity: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.42 },
      filter: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.42 },
    },
  },
};

const heroShowcaseLiteMotion = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 },
  },
};

const heroHeadingClassName =
  "mt-[36px] max-w-none font-[450] text-[clamp(1.35rem,4.2vw,1.75rem)] text-foreground leading-[1.16] tracking-[-0.02em] sm:max-w-none sm:text-[2.25rem] sm:leading-[1.12] lg:text-[2.75rem]";

const heroBrandMarkClassName =
  "relative mx-1 inline-flex h-[0.76em] w-[0.76em] shrink-0 items-center justify-center overflow-hidden rounded-full bg-background align-middle sm:mx-1.5";

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

function AnimatedBrandMark({
  animateEntrance,
  alt,
  href,
  src,
}: {
  animateEntrance: boolean;
  alt: string;
  href?: string;
  src: string;
}) {
  if (!animateEntrance) {
    return <HeroBrandMark alt={alt} href={href} src={src} />;
  }

  return (
    <motion.span
      className="inline-flex align-middle"
      style={{ transformOrigin: "center center" }}
      variants={heroBrandMarkMotion}
    >
      <HeroBrandMark alt={alt} href={href} src={src} />
    </motion.span>
  );
}

function HeroHeadingPrimaryLine({
  animateEntrance,
}: {
  animateEntrance: boolean;
}) {
  return (
    <>
      — Built on
      <AnimatedBrandMark
        alt="shadcn/ui"
        animateEntrance={animateEntrance}
        href="https://ui.shadcn.com/"
        src="/assets/shadcn.jpg"
      />
      shadcn/ui
      <span className="text-secondary"> with </span>
      <AnimatedBrandMark
        alt="Motion"
        animateEntrance={animateEntrance}
        href="https://motion.dev/"
        src="/assets/motion.png"
      />
      motion
    </>
  );
}

function HeroHeadingSecondaryLine() {
  return <>Cut the noise. Ship the calm.</>;
}

function HeroHeading({ animateEntrance }: { animateEntrance: boolean }) {
  if (!animateEntrance) {
    return (
      <h1 className={heroHeadingClassName}>
        <span className="block sm:whitespace-nowrap">
          <HeroHeadingSecondaryLine />
        </span>
        <span className="mt-1 block text-secondary sm:mt-0 sm:whitespace-nowrap">
          <HeroHeadingPrimaryLine animateEntrance={false} />
        </span>
      </h1>
    );
  }

  return (
    <motion.h1
      className={heroHeadingClassName}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: 0.06,
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <motion.span
        className="block sm:whitespace-nowrap"
        variants={heroPrimaryLineMotion}
      >
        <HeroHeadingSecondaryLine />
      </motion.span>
      <motion.span
        className="mt-1 block text-secondary sm:mt-0 sm:whitespace-nowrap"
        variants={heroHeadingLineMotion}
      >
        <HeroHeadingPrimaryLine animateEntrance={animateEntrance} />
      </motion.span>
    </motion.h1>
  );
}

function HeroDescription({
  animateEntrance,
  useFullMotion,
}: {
  animateEntrance: boolean;
  useFullMotion: boolean;
}) {
  const className =
    "mt-4 max-w-[620px] text-[15px] text-secondary leading-7 sm:mt-5 sm:max-w-[700px] sm:text-[16px] sm:leading-7";
  const copy =
    "Components with motion that stays out of the way—small transitions that confirm what happened, not decoration fighting for attention.";

  if (!animateEntrance) {
    return <p className={className}>{copy}</p>;
  }

  return (
    <motion.p
      className={className}
      variants={
        useFullMotion ? heroDescriptionMotion : heroDescriptionLiteMotion
      }
    >
      {copy}
    </motion.p>
  );
}

const heroCtaRowClassName =
  "mt-8 flex flex-wrap items-center justify-start gap-2 sm:gap-3";

const heroCtaPrimaryClassName =
  "h-9 gap-1.5 px-3 text-sm leading-5 sm:h-10 sm:px-4 sm:text-base sm:leading-5 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 sm:has-data-[icon=inline-end]:pr-3.5 sm:has-data-[icon=inline-start]:pl-3.5";

const heroCtaLinkClassName =
  "h-9 px-0 text-sm leading-5 sm:h-10 sm:text-base sm:leading-5";

const heroCtaIconClassName = "size-3.5 sm:size-4";

function HeroCtaArrowIcon({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
        heroCtaIconClassName
      )}
    >
      <motion.span
        animate={
          active
            ? { opacity: 0, x: -5, scale: 0.92 }
            : { opacity: 1, x: 0, scale: 1 }
        }
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        transition={HOME_CTA_ARROW_SPRING}
      >
        <ChevronRight className={heroCtaIconClassName} />
      </motion.span>
      <motion.span
        animate={
          active
            ? { opacity: 1, x: 0, scale: 1 }
            : { opacity: 0, x: -7, scale: 0.92 }
        }
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        transition={{
          ...HOME_CTA_ARROW_SPRING,
          delay: active ? 0.05 : 0,
        }}
      >
        <ArrowRight className={heroCtaIconClassName} />
      </motion.span>
    </span>
  );
}

function HeroViewComponentsButton() {
  const [active, setActive] = useState(false);

  return (
    <Button
      className={heroCtaPrimaryClassName}
      href="/buttons-and-actions/icon-bar"
      icon={<HeroCtaArrowIcon active={active} />}
      iconPosition="end"
      onBlur={() => setActive(false)}
      onFocus={() => setActive(true)}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      size="lg"
    >
      View components
    </Button>
  );
}

function HeroCtas({
  animateEntrance,
  useFullMotion,
}: {
  animateEntrance: boolean;
  useFullMotion: boolean;
}) {
  const links = (
    <>
      <HeroViewComponentsButton />
      <Button
        className={heroCtaLinkClassName}
        href="/introduction"
        size="lg"
        variant="link"
      >
        Getting started
      </Button>
    </>
  );

  if (!animateEntrance) {
    return <div className={heroCtaRowClassName}>{links}</div>;
  }

  return (
    <motion.div
      className={heroCtaRowClassName}
      variants={useFullMotion ? heroCtasMotion : heroCtasLiteMotion}
    >
      {links}
    </motion.div>
  );
}

function HeroAnimatedContent({
  animateEntrance,
  useFullMotion,
}: {
  animateEntrance: boolean;
  useFullMotion: boolean;
}) {
  if (!animateEntrance) {
    return (
      <div className="w-full max-w-[760px] text-left">
        <HeroHeading animateEntrance={false} />
        <HeroDescription
          animateEntrance={false}
          useFullMotion={useFullMotion}
        />
        <HeroCtas animateEntrance={false} useFullMotion={useFullMotion} />
      </div>
    );
  }

  return (
    <>
      <HeroHeading animateEntrance={useFullMotion} />
      <HeroDescription animateEntrance useFullMotion={useFullMotion} />
      <HeroCtas animateEntrance useFullMotion={useFullMotion} />
    </>
  );
}

export function HomeHero() {
  const pathname = usePathname();
  const tier = useMotionTier();
  const [isMounted, setIsMounted] = useState(false);
  const [entranceState, setEntranceState] = useState<"hidden" | "visible">(
    "hidden"
  );

  const motionAllowed = tier !== "none";
  const useFullMotion = tier === "full";
  const animateEntrance = isMounted && motionAllowed;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || pathname !== "/" || !motionAllowed) {
      setEntranceState("visible");
      return;
    }

    setEntranceState("hidden");

    let outerFrame = 0;
    let innerFrame = 0;

    outerFrame = requestAnimationFrame(() => {
      innerFrame = requestAnimationFrame(() => {
        setEntranceState("visible");
      });
    });

    return () => {
      cancelAnimationFrame(outerFrame);
      cancelAnimationFrame(innerFrame);
    };
  }, [isMounted, motionAllowed, pathname]);

  const containerVariants = useFullMotion
    ? heroContainerMotion
    : heroContainerLiteMotion;
  const showcaseVariants = useFullMotion
    ? heroShowcaseMotion
    : heroShowcaseLiteMotion;

  const content = (
    <HeroAnimatedContent
      animateEntrance={animateEntrance}
      useFullMotion={useFullMotion}
    />
  );

  const showcase = (
    <motion.div
      animate={animateEntrance ? entranceState : false}
      className="w-full text-left"
      initial={animateEntrance ? "hidden" : false}
      variants={showcaseVariants}
    >
      <HomeFeaturedShowcase />
    </motion.div>
  );

  return (
    <section
      className={cn(
        "bg-background pt-10 pb-16 sm:pt-18 sm:pb-20 lg:pt-20",
        !isMounted && motionAllowed && "opacity-0"
      )}
    >
      {animateEntrance ? (
        <motion.div
          animate={entranceState}
          className="w-full px-4 sm:px-6 lg:px-42"
          initial="hidden"
          variants={containerVariants}
        >
          <motion.div
            className="w-full max-w-[760px] text-left"
            variants={{
              hidden: {},
              visible: {},
            }}
          >
            {content}
          </motion.div>
          {showcase}
        </motion.div>
      ) : (
        <div className="w-full px-4 sm:px-6 lg:px-42">
          <div className="w-full max-w-[760px] text-left">{content}</div>
          {showcase}
        </div>
      )}
    </section>
  );
}
