import type { OutputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ShimmerSkeletonProps extends OutputHTMLAttributes<HTMLOutputElement> {
  rounded?: "none" | "sm" | "md" | "lg" | "full";
  animate?: boolean;
}

function ShimmerSkeleton({
  className,
  rounded = "md",
  animate = true,
  ...props
}: ShimmerSkeletonProps) {
  const roundedClass = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }[rounded];

  return (
    <output
      aria-label="Loading"
      className={cn(
        "relative block overflow-hidden bg-muted",
        roundedClass,
        className
      )}
      {...props}
    >
      {animate && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--foreground) 6%, transparent) 50%, transparent 100%)",
            animation: "shimmer 1.6s ease-in-out infinite",
          }}
        />
      )}
      <style>
        {"@keyframes shimmer { to { transform: translateX(200%); } }"}
      </style>
    </output>
  );
}

export { ShimmerSkeleton };
export type { ShimmerSkeletonProps };
