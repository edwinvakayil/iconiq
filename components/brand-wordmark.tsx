import Link from "next/link";

import { SITE } from "@/constants";
import { scrollToTop } from "@/lib/scroll-to-top";
import { cn } from "@/lib/utils";

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
    <span className="inline-flex items-end text-foreground leading-none">
      <span
        className={cn(
          "font-semibold tracking-[-0.09em]",
          size === "mobile" && "text-[24px]",
          size === "desktop" && "text-[21px]",
          size === "footer" && "text-[20px]"
        )}
      >
        {label}
      </span>
      {dot ? (
        <span
          aria-hidden
          className={cn(
            "ml-0.5 font-semibold text-neutral-400",
            size === "mobile" && "text-[24px]",
            size === "desktop" && "text-[21px]",
            size === "footer" && "text-[20px]"
          )}
        >
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
        variant === "mark" ? "items-center" : "items-end",
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
