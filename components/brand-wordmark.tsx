import Link from "next/link";

import { SITE } from "@/constants";
import { cn } from "@/lib/utils";

type BrandWordmarkProps = {
  size?: "desktop" | "mobile" | "footer";
};

function BrandWordmark({ size = "desktop" }: BrandWordmarkProps) {
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

function BrandLink({ className, size }: BrandLinkProps) {
  return (
    <Link
      className={cn(
        "group inline-flex items-end text-foreground leading-none",
        className
      )}
      href="/"
    >
      <span className="transition-opacity group-hover:opacity-78">
        <BrandWordmark size={size} />
      </span>
    </Link>
  );
}

export { BrandLink, BrandWordmark };
