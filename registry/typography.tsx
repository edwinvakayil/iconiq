import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

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
