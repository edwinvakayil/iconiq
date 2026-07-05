"use client";

import {
  Children,
  type CSSProperties,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const WHITESPACE_REGEX = /\s+/;

function getInitials(name: string) {
  const parts = name.trim().split(WHITESPACE_REGEX);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "";

  return `${first}${last}`.toUpperCase();
}

export type TestimonialsProps = {
  children: ReactNode;
  /** Blur radius in px applied to the non-hovered quotes. */
  blur?: number;
  /** Opacity the non-hovered quotes fade to while one is highlighted. */
  dimOpacity?: number;
  /** Called with the highlighted quote index, or null when nothing is highlighted. */
  onActiveChange?: (index: number | null) => void;
  className?: string;
};

export function Testimonials({
  children,
  blur = 4,
  dimOpacity = 0.2,
  onActiveChange,
  className,
}: TestimonialsProps) {
  let runningIndex = 0;
  const items = Children.map(children, (child) => {
    if (!isValidElement(child)) {
      return child;
    }

    const type = child.type as { isTestimonialItem?: boolean };

    if (type !== Testimonial && type.isTestimonialItem !== true) {
      return child;
    }

    const index = runningIndex;
    runningIndex += 1;

    return cloneElement(child as ReactElement<TestimonialProps>, {
      index,
      onActiveChange,
    });
  });

  return (
    <p
      className={cn(
        // group/wall lets each quote's dim rule below check "does any quote
        // in this wall currently have hover or focus" via :has(). Everything
        // here is a native CSS pseudo-class transition — the browser applies
        // it to all quotes in one synchronous style/paint pass, so there is
        // no per-element timing drift (that drift is what reads as a wave
        // when the same effect is driven from React state instead).
        "group/wall max-w-3xl text-justify font-medium text-base leading-[1.75] tracking-[-0.01em] sm:text-xl motion-reduce:[--testimonial-blur:0px]",
        className
      )}
      style={
        {
          "--testimonial-blur": `${blur}px`,
          "--testimonial-dim": dimOpacity,
        } as CSSProperties
      }
    >
      {items}
    </p>
  );
}

function TestimonialAvatar({
  name,
  avatar,
}: {
  name: string;
  avatar?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (avatar && !failed) {
    return (
      // biome-ignore lint/performance/noImgElement: registry components stay framework-agnostic.
      <img
        alt=""
        className="mr-[0.35em] inline-block size-[1.15em] select-none rounded-full border border-border/60 object-cover align-[-0.2em]"
        height={24}
        onError={() => setFailed(true)}
        src={avatar}
        width={24}
      />
    );
  }

  return (
    <span
      aria-hidden
      className="mr-[0.35em] inline-flex size-[1.15em] select-none items-center justify-center rounded-full border border-border bg-muted align-[-0.2em] font-semibold text-[0.45em] text-muted-foreground uppercase tracking-[0.08em]"
    >
      {getInitials(name)}
    </span>
  );
}

export type TestimonialProps = {
  /** Author name revealed in the attribution while the quote is highlighted. */
  name: string;
  /** Author role or company shown under the name. */
  title?: ReactNode;
  /** Avatar image URL. Falls back to initials when missing or broken. */
  avatar?: string;
  /**
   * Text tone at rest. Quotes alternate strong and muted automatically;
   * set this to pin one.
   */
  emphasis?: "strong" | "muted";
  children: ReactNode;
  className?: string;
  /** Position in the flow. Injected by Testimonials — do not set manually. */
  index?: number;
  /** Injected by Testimonials — do not set manually. */
  onActiveChange?: (index: number | null) => void;
};

export function Testimonial({
  name,
  title,
  avatar,
  emphasis,
  children,
  className,
  index = 0,
  onActiveChange,
}: TestimonialProps) {
  const tone = emphasis ?? (index % 2 === 0 ? "strong" : "muted");

  return (
    <span
      className={cn(
        // group/quote scopes the attribution reveal below to this exact
        // quote, independent of the wall-wide dim rule. Padding (canceled
        // by an equal negative margin, so nothing visually shifts) claims
        // the surrounding word-gap and inter-line leading as part of this
        // quote's own hoverable box: browsers size a wrapped line's hit
        // fragment to the glyph metrics, not the full line-height, so
        // without this the leading between wrapped lines is dead space
        // that belongs to no quote. Vertical padding on an inline element
        // never affects line-box spacing, so this is purely an expanded
        // hit area, not a layout change.
        "group/quote relative -mx-[0.15em] -my-[0.3em] inline cursor-pointer px-[0.15em] py-[0.3em] outline-none [filter:blur(0px)] [transition:filter_0.3s_cubic-bezier(0.32,0.72,0,1),opacity_0.2s_ease-out,color_0.3s_ease] motion-reduce:transition-none",
        tone === "strong" ? "text-foreground" : "text-muted-foreground",
        "hover:z-[1] hover:text-foreground focus-visible:z-[1] focus-visible:text-foreground",
        "group-has-[[data-testimonial-quote]:is(:hover,:focus-visible)]/wall:not-hover:not-focus-visible:opacity-[var(--testimonial-dim)]",
        "group-has-[[data-testimonial-quote]:is(:hover,:focus-visible)]/wall:not-hover:not-focus-visible:[filter:blur(var(--testimonial-blur))]",
        className
      )}
      data-testimonial-quote=""
      onBlur={() => onActiveChange?.(null)}
      onFocus={() => onActiveChange?.(index)}
      onMouseEnter={() => onActiveChange?.(index)}
      onMouseLeave={() => onActiveChange?.(null)}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: focus is the keyboard path to the highlight + attribution.
      tabIndex={0}
    >
      <TestimonialAvatar avatar={avatar} name={name} />
      {children}
      {/* Zero-width anchor so the attribution overlays the neighbors instead of reflowing the paragraph. */}
      <span className="inline-block w-0 overflow-visible align-middle">
        <span
          className={cn(
            "pointer-events-none inline-flex translate-y-1 flex-col gap-[0.3em] whitespace-nowrap pl-[0.5em] font-mono text-[0.52em] uppercase leading-none tracking-[0.14em] opacity-0 blur-[2px] transition-[opacity,transform,filter] duration-300 ease-out motion-reduce:translate-y-0 motion-reduce:transition-none",
            "group-hover/quote:translate-y-0 group-hover/quote:opacity-100 group-hover/quote:blur-none",
            "group-focus-visible/quote:translate-y-0 group-focus-visible/quote:opacity-100 group-focus-visible/quote:blur-none"
          )}
        >
          <span className="text-orange-600 dark:text-orange-500">{name}</span>
          {title ? (
            <span className="text-muted-foreground">{title}</span>
          ) : null}
        </span>
      </span>{" "}
    </span>
  );
}

Testimonial.isTestimonialItem = true;
