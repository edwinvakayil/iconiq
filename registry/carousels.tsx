"use client";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
      <div className="relative h-[214px]">
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.article
            animate="center"
            className="absolute inset-0 flex cursor-grab select-none flex-col rounded-2xl border border-border bg-card p-6 text-card-foreground active:cursor-grabbing"
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
            <p
              className="overflow-hidden text-base text-foreground/90 italic leading-relaxed"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              &ldquo;{current.quote}&rdquo;
            </p>

            <div className="my-5 h-px bg-border" />

            <div className="mt-auto flex items-center gap-3">
              {current.avatar ? (
                /* biome-ignore lint/performance/noImgElement: registry component stays framework-agnostic for non-Next consumers. */
                <img
                  alt={current.name}
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
                  height={40}
                  loading="lazy"
                  src={current.avatar}
                  width={40}
                />
              ) : current.initials ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-sm ring-1 ring-border">
                  {current.initials}
                </div>
              ) : null}
              <div className="leading-tight">
                <div className="font-semibold text-foreground">
                  {current.name}
                </div>
                <div className="text-muted-foreground text-sm">
                  {current.handle}
                </div>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              aria-label={`Go to testimonial ${i + 1}`}
              className="h-1.5 rounded-full transition-all"
              key={i}
              onClick={() => setState([i, i > index ? 1 : -1])}
              style={{
                width: i === index ? 24 : 8,
                backgroundColor:
                  i === index
                    ? "var(--color-foreground)"
                    : "var(--color-border)",
              }}
              type="button"
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            aria-label="Previous"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-accent"
            onClick={() => paginate(-1)}
            type="button"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Next"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-accent"
            onClick={() => paginate(1)}
            type="button"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
