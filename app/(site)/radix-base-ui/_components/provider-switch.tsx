"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/popover";

export type PrimitiveProvider = "base" | "radix";

const providerOptions: Array<{
  key: PrimitiveProvider;
  label: "Base UI" | "Radix UI";
}> = [
  { key: "base", label: "Base UI" },
  { key: "radix", label: "Radix UI" },
];

export function ProviderSwitch({
  selectedProvider,
  onSelect,
  disabledProviders = [],
}: {
  disabledProviders?: PrimitiveProvider[];
  selectedProvider: PrimitiveProvider;
  onSelect: (provider: PrimitiveProvider) => void;
}) {
  const [open, setOpen] = useState(false);
  const activeOption =
    providerOptions.find((option) => option.key === selectedProvider) ??
    providerOptions[0];

  return (
    <div className="mr-2 inline-flex h-8 shrink-0 items-center gap-3 whitespace-nowrap rounded-md px-3 text-sm">
      <span className="text-muted-foreground">Primitive</span>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <button
            aria-expanded={open}
            aria-haspopup="menu"
            className="inline-flex items-center gap-1.5 font-medium text-foreground transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            type="button"
          >
            <span>{activeOption.label}</span>
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                open && "rotate-180"
              )}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="z-20 mt-2 w-44 rounded-2xl border border-border/80 bg-background p-1.5 shadow-[0_20px_60px_rgba(15,23,42,0.12)] dark:bg-neutral-950"
          open={open}
          side="bottom"
          sideOffset={8}
        >
          {providerOptions.map((option) => {
            const isActive = option.key === selectedProvider;
            const isDisabled = disabledProviders.includes(option.key);

            return (
              <button
                aria-disabled={isDisabled}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[14px] text-foreground transition-colors",
                  !isDisabled && "hover:bg-muted/70",
                  isActive && "bg-muted/55",
                  isDisabled && "cursor-not-allowed text-muted-foreground/70"
                )}
                disabled={isDisabled}
                key={option.key}
                onClick={() => {
                  if (isDisabled) {
                    return;
                  }

                  onSelect(option.key);
                  setOpen(false);
                }}
                type="button"
              >
                <span>{option.label}</span>
                <Check
                  className={cn(
                    "size-4 text-emerald-500 transition-opacity",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                />
              </button>
            );
          })}
        </PopoverContent>
      </Popover>
    </div>
  );
}
