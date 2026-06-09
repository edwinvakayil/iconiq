"use client";

import { motion } from "motion/react";

import {
  BaseUILogo,
  RadixUILogo,
} from "@/app/(site)/components/_components/primitive-brand-icons";
import { cn } from "@/lib/utils";

export type PrimitiveProvider = "base" | "radix";

const slideSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
};

const providerOptions: Array<{
  key: PrimitiveProvider;
  label: "Base UI" | "Radix UI";
  Logo: typeof BaseUILogo;
  logoClassName: string;
}> = [
  {
    key: "base",
    label: "Base UI",
    Logo: BaseUILogo,
    logoClassName: "h-4 w-auto",
  },
  {
    key: "radix",
    label: "Radix UI",
    Logo: RadixUILogo,
    logoClassName: "size-4",
  },
];

function handleDisabledProviderSelect() {
  return undefined;
}

export function ProviderSwitch({
  selectedProvider,
  onSelect,
  disabledProviders = [],
  mutedTrigger = false,
}: {
  disabledProviders?: PrimitiveProvider[];
  selectedProvider: PrimitiveProvider;
  onSelect: (provider: PrimitiveProvider) => void;
  showSelectionIndicator?: boolean;
  showActiveBackground?: boolean;
  mutedTrigger?: boolean;
  muteActiveDisabledOption?: boolean;
}) {
  const activeIndex = Math.max(
    0,
    providerOptions.findIndex((option) => option.key === selectedProvider)
  );

  return (
    <div
      aria-label="Primitive"
      className="relative mr-2 inline-flex h-8 w-16 shrink-0 overflow-hidden rounded-md bg-transparent dark:bg-[var(--secondary-bg)]"
      role="radiogroup"
    >
      <motion.div
        animate={{ x: `${activeIndex * 100}%` }}
        aria-hidden
        className="absolute inset-y-0 left-0 z-0 h-full w-1/2 bg-background dark:bg-[#1d1d1b]"
        transition={slideSpring}
      />

      {providerOptions.map((option, index) => {
        const isActive = option.key === selectedProvider;
        const isDisabled = disabledProviders.includes(option.key);
        const Logo = option.Logo;

        return (
          <motion.button
            aria-checked={isActive}
            aria-label={option.label}
            className={cn(
              "relative z-1 inline-flex h-8 w-8 shrink-0 items-center justify-center bg-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              index === 0 && "dark:border-border/80 dark:border-r",
              isActive ? "text-foreground" : "text-muted-foreground/55",
              !(isDisabled || isActive) && "hover:text-muted-foreground",
              isDisabled && "cursor-not-allowed opacity-40",
              isDisabled && isActive && mutedTrigger && "opacity-55"
            )}
            disabled={isDisabled}
            key={option.key}
            onClick={() => {
              if (isDisabled) {
                return;
              }

              onSelect(option.key);
            }}
            role="radio"
            title={option.label}
            type="button"
            whileTap={isDisabled ? undefined : { scale: 0.96 }}
          >
            <Logo className={option.logoClassName} />
          </motion.button>
        );
      })}
    </div>
  );
}

export function SharedPrimitiveProviderSwitch() {
  return (
    <ProviderSwitch
      disabledProviders={["base", "radix"]}
      mutedTrigger
      onSelect={handleDisabledProviderSelect}
      selectedProvider="radix"
      showActiveBackground={false}
      showSelectionIndicator={false}
    />
  );
}
