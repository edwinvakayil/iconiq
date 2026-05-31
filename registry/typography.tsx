import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const TYPOGRAPHY_SAMPLE_TEXT = "Talent without working hard is nothing.";

const TYPOGRAPHY_VARIANT_META = {
  h1: {
    label: "Title / H1 Title",
    element: "h1",
    weight: "Medium / 500",
    fontSize: "56px",
    lineHeight: "64px",
    letterSpacing: "-1%",
    className: "font-medium text-[56px] leading-[64px] tracking-[-0.01em]",
  },
  h2: {
    label: "Title / H2 Title",
    element: "h2",
    weight: "Medium / 500",
    fontSize: "48px",
    lineHeight: "56px",
    letterSpacing: "-1%",
    className: "font-medium text-[48px] leading-[56px] tracking-[-0.01em]",
  },
  h3: {
    label: "Title / H3 Title",
    element: "h3",
    weight: "Medium / 500",
    fontSize: "40px",
    lineHeight: "48px",
    letterSpacing: "-1%",
    className: "font-medium text-[40px] leading-[48px] tracking-[-0.01em]",
  },
  h4: {
    label: "Title / H4 Title",
    element: "h4",
    weight: "Medium / 500",
    fontSize: "32px",
    lineHeight: "40px",
    letterSpacing: "-0.5%",
    className: "font-medium text-[32px] leading-[40px] tracking-[-0.005em]",
  },
  h5: {
    label: "Title / H5 Title",
    element: "h5",
    weight: "Medium / 500",
    fontSize: "24px",
    lineHeight: "32px",
    letterSpacing: "0%",
    className: "font-medium text-[24px] leading-[32px] tracking-[0em]",
  },
  h6: {
    label: "Title / H6 Title",
    element: "h6",
    weight: "Medium / 500",
    fontSize: "20px",
    lineHeight: "28px",
    letterSpacing: "0%",
    className: "font-medium text-[20px] leading-[28px] tracking-[0em]",
  },
  "label-xl": {
    label: "Label / X-Large",
    element: "p",
    weight: "Medium / 500",
    fontSize: "24px",
    lineHeight: "32px",
    letterSpacing: "-1.5%",
    className: "font-medium text-[24px] leading-[32px] tracking-[-0.015em]",
  },
  "label-lg": {
    label: "Label / Large",
    element: "p",
    weight: "Medium / 500",
    fontSize: "18px",
    lineHeight: "24px",
    letterSpacing: "-1.5%",
    className: "font-medium text-[18px] leading-[24px] tracking-[-0.015em]",
  },
  "label-md": {
    label: "Label / Medium",
    element: "p",
    weight: "Medium / 500",
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "-1.1%",
    className: "font-medium text-[16px] leading-[24px] tracking-[-0.011em]",
  },
  "label-sm": {
    label: "Label / Small",
    element: "p",
    weight: "Medium / 500",
    fontSize: "14px",
    lineHeight: "20px",
    letterSpacing: "-0.6%",
    className: "font-medium text-[14px] leading-[20px] tracking-[-0.006em]",
  },
  "label-xs": {
    label: "Label / X-Small",
    element: "p",
    weight: "Medium / 500",
    fontSize: "12px",
    lineHeight: "16px",
    letterSpacing: "0%",
    className: "font-medium text-[12px] leading-[16px] tracking-[0em]",
  },
  "paragraph-xl": {
    label: "Paragraph / X-Large",
    element: "p",
    weight: "Regular / 400",
    fontSize: "24px",
    lineHeight: "32px",
    letterSpacing: "-1.5%",
    className: "text-[24px] leading-[32px] tracking-[-0.015em]",
  },
  "paragraph-lg": {
    label: "Paragraph / Large",
    element: "p",
    weight: "Regular / 400",
    fontSize: "18px",
    lineHeight: "24px",
    letterSpacing: "-1.5%",
    className: "text-[18px] leading-[24px] tracking-[-0.015em]",
  },
  "paragraph-md": {
    label: "Paragraph / Medium",
    element: "p",
    weight: "Regular / 400",
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "-1.1%",
    className: "text-[16px] leading-[24px] tracking-[-0.011em]",
  },
  "paragraph-sm": {
    label: "Paragraph / Small",
    element: "p",
    weight: "Regular / 400",
    fontSize: "14px",
    lineHeight: "20px",
    letterSpacing: "-0.6%",
    className: "text-[14px] leading-[20px] tracking-[-0.006em]",
  },
  "paragraph-xs": {
    label: "Paragraph / X-Small",
    element: "p",
    weight: "Regular / 400",
    fontSize: "12px",
    lineHeight: "16px",
    letterSpacing: "0%",
    className: "text-[12px] leading-[16px] tracking-[0em]",
  },
  "subheading-md": {
    label: "Subheading / Medium",
    element: "p",
    weight: "Medium / 500",
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "6%",
    className: "font-medium text-[16px] leading-[24px] tracking-[0.06em]",
  },
  "subheading-sm": {
    label: "Subheading / Small",
    element: "p",
    weight: "Medium / 500",
    fontSize: "14px",
    lineHeight: "20px",
    letterSpacing: "6%",
    className: "font-medium text-[14px] leading-[20px] tracking-[0.06em]",
  },
  "subheading-xs": {
    label: "Subheading / X-Small",
    element: "p",
    weight: "Medium / 500",
    fontSize: "12px",
    lineHeight: "16px",
    letterSpacing: "4%",
    className: "font-medium text-[12px] leading-[16px] tracking-[0.04em]",
  },
  "subheading-2xs": {
    label: "Subheading / 2X-Small",
    element: "p",
    weight: "Medium / 500",
    fontSize: "11px",
    lineHeight: "12px",
    letterSpacing: "2%",
    className: "font-medium text-[11px] leading-[12px] tracking-[0.02em]",
  },
  "doc-label": {
    label: "Doc / Label",
    element: "p",
    weight: "Medium / 500",
    fontSize: "18px",
    lineHeight: "32px",
    letterSpacing: "-1.5%",
    className: "font-medium text-[18px] leading-[32px] tracking-[-0.015em]",
  },
  "doc-paragraph": {
    label: "Doc / Paragraph",
    element: "p",
    weight: "Regular / 400",
    fontSize: "18px",
    lineHeight: "32px",
    letterSpacing: "-1.5%",
    className: "text-[18px] leading-[32px] tracking-[-0.015em]",
  },
} as const;

const TYPOGRAPHY_VARIANT_CLASSES = {
  h1: TYPOGRAPHY_VARIANT_META.h1.className,
  h2: TYPOGRAPHY_VARIANT_META.h2.className,
  h3: TYPOGRAPHY_VARIANT_META.h3.className,
  h4: TYPOGRAPHY_VARIANT_META.h4.className,
  h5: TYPOGRAPHY_VARIANT_META.h5.className,
  h6: TYPOGRAPHY_VARIANT_META.h6.className,
  "label-xl": TYPOGRAPHY_VARIANT_META["label-xl"].className,
  "label-lg": TYPOGRAPHY_VARIANT_META["label-lg"].className,
  "label-md": TYPOGRAPHY_VARIANT_META["label-md"].className,
  "label-sm": TYPOGRAPHY_VARIANT_META["label-sm"].className,
  "label-xs": TYPOGRAPHY_VARIANT_META["label-xs"].className,
  "paragraph-xl": TYPOGRAPHY_VARIANT_META["paragraph-xl"].className,
  "paragraph-lg": TYPOGRAPHY_VARIANT_META["paragraph-lg"].className,
  "paragraph-md": TYPOGRAPHY_VARIANT_META["paragraph-md"].className,
  "paragraph-sm": TYPOGRAPHY_VARIANT_META["paragraph-sm"].className,
  "paragraph-xs": TYPOGRAPHY_VARIANT_META["paragraph-xs"].className,
  "subheading-md": TYPOGRAPHY_VARIANT_META["subheading-md"].className,
  "subheading-sm": TYPOGRAPHY_VARIANT_META["subheading-sm"].className,
  "subheading-xs": TYPOGRAPHY_VARIANT_META["subheading-xs"].className,
  "subheading-2xs": TYPOGRAPHY_VARIANT_META["subheading-2xs"].className,
  "doc-label": TYPOGRAPHY_VARIANT_META["doc-label"].className,
  "doc-paragraph": TYPOGRAPHY_VARIANT_META["doc-paragraph"].className,
} as const;

const TYPOGRAPHY_GROUPS = [
  {
    label: "Title",
    variants: ["h1", "h2", "h3", "h4", "h5", "h6"],
  },
  {
    label: "Label",
    variants: ["label-xl", "label-lg", "label-md", "label-sm", "label-xs"],
  },
  {
    label: "Paragraph",
    variants: [
      "paragraph-xl",
      "paragraph-lg",
      "paragraph-md",
      "paragraph-sm",
      "paragraph-xs",
    ],
  },
  {
    label: "Subheading",
    variants: [
      "subheading-md",
      "subheading-sm",
      "subheading-xs",
      "subheading-2xs",
    ],
  },
  {
    label: "Doc",
    variants: ["doc-label", "doc-paragraph"],
  },
] as const satisfies ReadonlyArray<{
  label: string;
  variants: readonly (keyof typeof TYPOGRAPHY_VARIANT_META)[];
}>;

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: TYPOGRAPHY_VARIANT_CLASSES,
  },
  defaultVariants: {
    variant: "paragraph-md",
  },
});

type TypographyElement = React.ElementType;

type TypographyVariant = keyof typeof TYPOGRAPHY_VARIANT_META;

type TypographyProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof typographyVariants> & {
    as?: TypographyElement;
  };

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ as, className, variant, ...props }, ref) => {
    const resolvedVariant = variant ?? "paragraph-md";
    const Component = as ?? TYPOGRAPHY_VARIANT_META[resolvedVariant].element;

    return (
      <Component
        className={cn(
          componentThemeClassName,
          typographyVariants({ variant: resolvedVariant }),
          className
        )}
        ref={ref as never}
        {...props}
      />
    );
  }
);
Typography.displayName = "Typography";

export {
  Typography,
  TYPOGRAPHY_GROUPS,
  TYPOGRAPHY_SAMPLE_TEXT,
  TYPOGRAPHY_VARIANT_META,
  typographyVariants,
};
export type { TypographyProps, TypographyVariant };
