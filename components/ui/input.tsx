import { Input as BaseInput } from "@base-ui/react/input";
import type * as React from "react";

import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<typeof BaseInput> {
  inputContainerClassName?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Input = ({
  inputContainerClassName,
  className,
  type,
  leadingIcon,
  trailingIcon,
  disabled,
  ...props
}: InputProps) => {
  const inputEl = (
    <BaseInput
      className={cn(
        "flex h-10 w-full min-w-0 border border-border bg-background px-3 py-1 text-sm outline-none",
        "text-foreground selection:bg-primary selection:text-white placeholder:text-muted-foreground/80 dark:bg-background",
        "transition-[color,box-shadow,ring-color]",
        "focus-visible:border-foreground focus-visible:shadow-[0_0_0_3px_rgb(17_17_17_/_0.08)] dark:focus-visible:shadow-[0_0_0_3px_rgb(246_243_236_/_0.08)]",
        "rounded-none",
        leadingIcon && "pl-10",
        trailingIcon && "pr-12",
        className
      )}
      data-slot="input"
      disabled={disabled}
      type={type}
      {...props}
    />
  );

  // When no chrome (icons/container) is requested, render a bare input.
  // This keeps DOM simple for patterns like floating labels that rely on `label + input`.
  if (!(leadingIcon || trailingIcon || inputContainerClassName)) {
    return inputEl;
  }

  return (
    <div
      className={cn(
        "group relative w-full data-disabled:pointer-events-none",
        inputContainerClassName
      )}
      data-disabled={disabled ? "" : undefined}
      data-slot="input-container"
    >
      {leadingIcon && (
        <span
          className="pointer-events-none absolute top-1/2 left-3 shrink-0 -translate-y-1/2 [&_svg]:shrink-0"
          data-slot="input-leading-icon"
        >
          {leadingIcon}
        </span>
      )}
      {inputEl}
      {trailingIcon && (
        <span
          className="pointer-events-none absolute top-1/2 right-3 shrink-0 -translate-y-1/2 [&_svg]:shrink-0"
          data-slot="input-trailing-icon"
        >
          {trailingIcon}
        </span>
      )}
    </div>
  );
};

export { Input };
