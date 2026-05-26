import type { ReactNode } from "react";

export const homeDisplayHeadingClassName =
  "font-medium text-[clamp(1.45rem,5.5vw,1.875rem)] text-foreground leading-[1.1] tracking-[-0.06em] sm:text-[3.15rem] sm:leading-[1.06] lg:text-[3.75rem]";

export const homeDisplaySubheadingClassName =
  "font-medium text-[clamp(1.45rem,5.5vw,1.875rem)] text-secondary leading-[1.1] tracking-[-0.06em] sm:text-[3.15rem] sm:leading-[1.06] lg:text-[3.75rem]";

export const homeSectionHeadingClassName =
  "font-medium text-[clamp(1.35rem,4vw,1.75rem)] text-foreground leading-[1.1] tracking-[-0.06em] sm:text-[2.35rem] sm:leading-[1.06]";

export const homeSectionSubheadingClassName =
  "font-medium text-[clamp(1.35rem,4vw,1.75rem)] text-secondary leading-[1.1] tracking-[-0.06em] sm:text-[2.35rem] sm:leading-[1.06]";

export const homeBodyCopyClassName =
  "text-[15px] text-secondary leading-6 sm:text-[18px] sm:leading-8";

export function HomeSectionHeading({
  primary,
  secondary,
  className,
  id,
}: {
  primary: ReactNode;
  secondary?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div className={className ?? "sm:text-center"}>
      <h2 className={homeSectionHeadingClassName} id={id}>
        {primary}
      </h2>
      {secondary ? (
        <p className={`mt-1 ${homeSectionSubheadingClassName}`}>{secondary}</p>
      ) : null}
    </div>
  );
}
