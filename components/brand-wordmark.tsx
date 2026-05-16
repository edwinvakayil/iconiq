import { Instrument_Sans } from "next/font/google";
import Link from "next/link";

import { SITE } from "@/constants";
import { scrollToTop } from "@/lib/scroll-to-top";
import { cn } from "@/lib/utils";

const brandType = Instrument_Sans({
  subsets: ["latin"],
  weight: "500",
  display: "swap",
});

const wordmarkSizeClass = {
  mobile: "text-[23px] tracking-[-0.045em]",
  desktop: "text-[20px] tracking-[-0.04em]",
  footer: "text-[19px] tracking-[-0.038em]",
} as const;

type BrandVariant = "mark" | "wordmark";

type BrandWordmarkProps = {
  size?: "desktop" | "mobile" | "footer";
  variant?: BrandVariant;
};

function BrandMark({ size = "desktop" }: Pick<BrandWordmarkProps, "size">) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex items-center justify-center text-foreground",
        size === "mobile" && "size-[18px]",
        size === "desktop" && "size-[18px]",
        size === "footer" && "size-[18px]"
      )}
    >
      <svg
        className="size-full"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        viewBox="0 0 20 20"
      >
        <circle cx="4.5" cy="4.4" fill="currentColor" r="1.1" stroke="none" />
        <path d="M4.5 8.2v6.1" />
        <circle cx="11.2" cy="10.5" r="4.15" />
        <path d="M14.1 13.4 16.4 15.7" />
      </svg>
    </span>
  );
}

function BrandWordmark({
  size = "desktop",
  variant = "wordmark",
}: BrandWordmarkProps) {
  if (variant === "mark") {
    return <BrandMark size={size} />;
  }

  const label = SITE.LOGO.endsWith(".") ? SITE.LOGO.slice(0, -1) : SITE.LOGO;
  const dot = SITE.LOGO.endsWith(".") ? "." : "";

  return (
    <span
      className={cn(
        brandType.className,
        "inline-flex items-baseline text-foreground leading-none antialiased",
        wordmarkSizeClass[size]
      )}
    >
      <span>{label}</span>
      {dot ? (
        <span aria-hidden className="ml-px text-muted-foreground">
          {dot}
        </span>
      ) : null}
    </span>
  );
}

type BrandLinkProps = BrandWordmarkProps & {
  className?: string;
};

function BrandLink({ className, size, variant = "wordmark" }: BrandLinkProps) {
  return (
    <Link
      className={cn(
        "group inline-flex text-foreground leading-none",
        variant === "mark" ? "items-center" : "items-baseline",
        className
      )}
      href="/"
      onClick={() => scrollToTop()}
      prefetch
    >
      {variant === "mark" ? <span className="sr-only">{SITE.LOGO}</span> : null}
      <span className="transition-opacity group-hover:opacity-78">
        <BrandWordmark size={size} variant={variant} />
      </span>
    </Link>
  );
}

export { BrandLink, BrandMark, BrandWordmark };
