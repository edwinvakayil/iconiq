import * as React from "react";

import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<"label">
>(({ className, ...props }, ref) => (
  // htmlFor is provided by the consumer via props
  // biome-ignore lint/a11y/noLabelWithoutControl: primitive; association via props
  <label
    className={cn(
      "font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    ref={ref}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
