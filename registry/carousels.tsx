"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { useState } from "react";

export type Testimonial = {
  quote: string;
  name: string;
  handle: string;
  avatar?: string;
  initials?: string;
};

const defaultTestimonials: Testimonial[] = [
  {
    quote:
      "We evaluated multiple solutions, but this stood out immediately. It's fast, scalable, and thoughtfully designed for growing teams.",
    name: "Jenny",
    handle: "@jenny",
    initials: "JN",
  },
  {
    quote:
      "The team shipped what used to take us weeks in just a couple of days. The developer experience is genuinely delightful.",
    name: "Marcus",
    handle: "@marcus",
    initials: "MA",
  },
  {
    quote:
      "Minimal, refined, and powerful. Every detail feels intentional — exactly the kind of tool we want to build with.",
    name: "Sofia",
    handle: "@sofia",
    initials: "SO",
  },
  {
    quote:
      "Onboarding was effortless. We were in production within an afternoon, and our customers noticed the difference right away.",
    name: "Daniel",
    handle: "@daniel",
    initials: "DA",
  },
];

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 320 : -320,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -320 : 320,
    opacity: 0,
    scale: 0.95,
  }),
};

export interface CarouselProps {
  testimonials?: Testimonial[];
}

export function Carousel({
  testimonials = defaultTestimonials,
}: CarouselProps) {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);

  const paginate = (dir: number) => {
    setState(([i]) => [
      (i + dir + testimonials.length) % testimonials.length,
      dir,
    ]);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80) paginate(1);
    else if (info.offset.x > 80) paginate(-1);
  };

  const current = testimonials[index];

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="relative h-[222px]">
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.article
            animate="center"
            className="absolute inset-0 flex cursor-grab select-none flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 text-card-foreground active:cursor-grabbing"
            custom={direction}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            exit="exit"
            initial="enter"
            key={index}
            onDragEnd={handleDragEnd}
            transition={{
              x: { type: "spring", stiffness: 260, damping: 30 },
              opacity: { duration: 0.25 },
              scale: { duration: 0.3 },
            }}
            variants={variants}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute top-2 left-3 select-none font-serif text-[4.5rem] text-foreground/6 leading-none dark:text-foreground/9"
            >
              &ldquo;
            </span>

            <p
              className="relative z-1 h-19.5 overflow-hidden text-[15px] text-foreground/88 leading-[1.62] tracking-[-0.012em] antialiased sm:text-base"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {current.quote}
            </p>

            <div className="relative z-1 mt-auto flex items-center gap-3 border-border/60 border-t pt-5">
              {current.avatar ? (
                /* biome-ignore lint/performance/noImgElement: registry component stays framework-agnostic for non-Next consumers. */
                <img
                  alt={current.name}
                  className="h-10 w-10 rounded-full object-cover shadow-sm ring-2 ring-background ring-offset-0"
                  height={40}
                  loading="lazy"
                  src={current.avatar}
                  width={40}
                />
              ) : current.initials ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/80 font-medium text-muted-foreground text-sm shadow-sm ring-2 ring-background">
                  {current.initials}
                </div>
              ) : null}
              <div className="min-w-0 leading-tight">
                <div className="truncate font-semibold text-foreground tracking-tight">
                  {current.name}
                </div>
                <div className="truncate text-muted-foreground text-sm tracking-tight">
                  {current.handle}
                </div>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="mt-7 flex justify-end gap-1.5">
        <button
          aria-label="Previous"
          className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={() => paginate(-1)}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
        </button>
        <button
          aria-label="Next"
          className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={() => paginate(1)}
          type="button"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
