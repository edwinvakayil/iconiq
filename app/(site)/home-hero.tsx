"use client";

import { ArrowRight, FileText } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

const heroHeadingClassName =
  "max-w-none font-medium text-[clamp(1.45rem,5.5vw,1.875rem)] text-foreground leading-[1.1] tracking-[-0.06em] sm:mx-auto sm:max-w-none sm:text-[3.15rem] sm:leading-[1.06] lg:text-[3.75rem]";

const heroBrandMarkClassName =
  "relative mx-1 inline-flex h-[0.82em] w-[0.82em] shrink-0 items-center justify-center overflow-hidden rounded-full bg-background align-middle sm:mx-1.5";

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
      Built on
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
      Motion
    </>
  );
}

function HeroHeadingSecondaryLine() {
  return <>Copy the source. Ship the polish.</>;
}

function HeroHeading({ animateEntrance }: { animateEntrance: boolean }) {
  if (!animateEntrance) {
    return (
      <h1 className={heroHeadingClassName}>
        <span className="block sm:whitespace-nowrap">
          <HeroHeadingPrimaryLine animateEntrance={false} />
        </span>
        <span className="mt-1 block text-secondary sm:mt-0 sm:whitespace-nowrap">
          <HeroHeadingSecondaryLine />
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
        <HeroHeadingPrimaryLine animateEntrance={animateEntrance} />
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

function HeroDescription({
  animateEntrance,
  useFullMotion,
}: {
  animateEntrance: boolean;
  useFullMotion: boolean;
}) {
  const className =
    "mt-5 max-w-[640px] text-[15px] text-secondary leading-6 sm:mx-auto sm:mt-6 sm:max-w-[760px] sm:text-[18px] sm:leading-8";
  const copy =
    "shadcn/ui primitives you own, Motion animations you feel—paste a component, tune the tokens, and ship without the boilerplate hunt.";

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

function HeroCtas({
  animateEntrance,
  useFullMotion,
}: {
  animateEntrance: boolean;
  useFullMotion: boolean;
}) {
  const links = (
    <>
      <Link
        className="inline-flex h-10 items-center gap-1.5 px-1 font-medium text-[15px] text-foreground decoration-transparent underline-offset-4 transition-[color,text-decoration-color] hover:text-foreground/80 hover:underline hover:decoration-foreground"
        href="/introduction"
      >
        <FileText className="size-[18px]" />
        See Docs
      </Link>
      <Link
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-foreground px-5 font-medium text-background text-sm shadow-[0_10px_24px_rgba(14,165,233,0.22)] transition-[background-color,box-shadow,color] hover:bg-foreground/92 hover:shadow-[0_12px_28px_rgba(14,165,233,0.3)] dark:hover:text-background!"
        href="/radix-base-ui/accordion"
      >
        View components
        <ArrowRight className="size-4" />
      </Link>
    </>
  );

  if (!animateEntrance) {
    return (
      <div className="mt-8 flex flex-wrap justify-start gap-3 sm:justify-center">
        {links}
      </div>
    );
  }

  return (
    <motion.div
      className="mt-8 flex flex-wrap justify-start gap-3 sm:justify-center"
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
      <div className="mx-auto max-w-[1120px] text-left sm:text-center">
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
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const [entranceState, setEntranceState] = useState<"hidden" | "visible">(
    "hidden"
  );

  const motionAllowed = tier !== "none" && prefersReducedMotion !== true;
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
      className="mx-auto max-w-[1120px] text-left sm:text-center"
      initial={animateEntrance ? "hidden" : false}
      variants={showcaseVariants}
    >
      <HomeFeaturedShowcase />
    </motion.div>
  );

  return (
    <section
      className={cn(
        "bg-background pt-12 pb-18 sm:pt-44 sm:pb-24 lg:pt-36",
        !isMounted && motionAllowed && "opacity-0"
      )}
    >
      {animateEntrance ? (
        <motion.div
          animate={entranceState}
          className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8"
          initial="hidden"
          variants={containerVariants}
        >
          <motion.div
            className="mx-auto max-w-[1120px] text-left sm:text-center"
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
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          {content}
          <div className="mx-auto max-w-[1120px] text-left sm:text-center">
            <HomeFeaturedShowcase />
          </div>
        </div>
      )}
    </section>
  );
}
