"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { Moon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type ThemeToggleSize = "sm" | "md" | "lg";

type ThemePreference = "dark" | "light" | "system";

export interface ThemeToggleProps {
  "aria-label"?: string;
  applyToDocument?: boolean;
  className?: string;
  defaultPressed?: boolean;
  disabled?: boolean;
  enableSystem?: boolean;
  id?: string;
  knobClassName?: string;
  onPressedChange?: (pressed: boolean) => void;
  persist?: boolean;
  pressed?: boolean;
  size?: ThemeToggleSize;
  storageKey?: string;
  trackClassName?: string;
}

const DEFAULT_STORAGE_KEY = "theme";
const ICON_EASE = "ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]";
const SUN_COLOR = "#ffffff";
const MOON_COLOR = "#1a1838";

const sizeConfig = {
  sm: {
    track: "h-6 w-11",
    knob: "h-4 w-4",
    knobOffset: "left-[calc(100%-1.125rem)]",
    knobStart: "left-0.5",
    icon: 12,
    sunIcon: 12,
  },
  md: {
    track: "h-8 w-14",
    knob: "h-6 w-6",
    knobOffset: "left-[calc(100%-1.625rem)]",
    knobStart: "left-0.5",
    icon: 16,
    sunIcon: 16,
  },
  lg: {
    track: "h-10 w-[4.5rem]",
    knob: "h-8 w-8",
    knobOffset: "left-[calc(100%-2.125rem)]",
    knobStart: "left-0.5",
    icon: 20,
    sunIcon: 20,
  },
} as const;

type SizeConfig = (typeof sizeConfig)[ThemeToggleSize];

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

function readStoredPreference(storageKey: string): ThemePreference | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(storageKey);

    if (value === "dark" || value === "light" || value === "system") {
      return value;
    }
  } catch {
    return null;
  }

  return null;
}

function writeStoredPreference(storageKey: string, pressed: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, pressed ? "dark" : "light");
  } catch {
    return;
  }
}

function getSystemPrefersDark() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function documentHasDarkClass() {
  if (typeof document === "undefined") {
    return false;
  }

  return document.documentElement.classList.contains("dark");
}

function resolveIsDark({
  defaultPressed,
  enableSystem,
  stored,
}: {
  defaultPressed?: boolean;
  enableSystem: boolean;
  stored: ThemePreference | null;
}) {
  if (stored === "dark") {
    return true;
  }

  if (stored === "light") {
    return false;
  }

  if (stored === "system" || (stored === null && enableSystem)) {
    return getSystemPrefersDark();
  }

  if (defaultPressed !== undefined) {
    return defaultPressed;
  }

  return documentHasDarkClass();
}

function applyDocumentTheme(isDark: boolean) {
  if (typeof document === "undefined") {
    return;
  }

  const hasDark = documentHasDarkClass();

  if (hasDark === isDark) {
    return;
  }

  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}

function ThemeSunIcon({
  className,
  size,
}: {
  className?: string;
  size: number;
}) {
  return (
    <svg
      aria-hidden
      className={cn("block shrink-0", className)}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" fill={SUN_COLOR} r="3.25" />
      <g stroke={SUN_COLOR} strokeLinecap="round" strokeWidth="2">
        <path d="M12 2.5v2.5" />
        <path d="M12 19v2.5" />
        <path d="M4.22 4.22l1.77 1.77" />
        <path d="M18.01 18.01l1.77 1.77" />
        <path d="M2.5 12h2.5" />
        <path d="M19 12h2.5" />
        <path d="M4.22 19.78l1.77-1.77" />
        <path d="M18.01 5.99l1.77-1.77" />
      </g>
    </svg>
  );
}

type ThemeToggleTrackProps = React.ComponentProps<"button"> & {
  ariaLabel?: string;
  config: SizeConfig;
  disabled?: boolean;
  isDark: boolean;
  knobClassName?: string;
  renderRef?: React.Ref<HTMLButtonElement>;
  trackClassName?: string;
};

function ThemeToggleTrack({
  ariaLabel = "Toggle theme",
  className,
  config,
  disabled = false,
  isDark,
  knobClassName,
  renderRef,
  trackClassName,
  ...buttonProps
}: ThemeToggleTrackProps) {
  return (
    <button
      {...buttonProps}
      aria-label={ariaLabel}
      className={cn(
        "relative cursor-pointer rounded-full border-2 transition-colors duration-700",
        ICON_EASE,
        config.track,
        isDark
          ? "border-[#2d2a4e] bg-[#1a1838]"
          : "border-[#e8d5b7] bg-[#fef3c7]",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
        trackClassName,
        className
      )}
      disabled={disabled}
      ref={renderRef}
      type="button"
    >
      <div
        className={cn(
          "absolute top-1/2 grid -translate-y-1/2 place-items-center rounded-full transition-[left,background-color] duration-700",
          ICON_EASE,
          config.knob,
          isDark ? config.knobOffset : config.knobStart,
          isDark ? "bg-[#e8e6f0]" : "bg-[#ff9500]",
          knobClassName
        )}
      >
        <ThemeSunIcon
          className={cn(
            "col-start-1 row-start-1 origin-center transition-[transform,opacity] duration-500",
            ICON_EASE,
            isDark
              ? "rotate-90 scale-50 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          )}
          size={config.sunIcon}
        />
        <Moon
          aria-hidden
          className={cn(
            "col-start-1 row-start-1 block shrink-0 origin-center transition-[transform,opacity] duration-500",
            ICON_EASE,
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-50 opacity-0"
          )}
          color={MOON_COLOR}
          size={config.icon}
          strokeWidth={2}
        />
      </div>
    </button>
  );
}

export const ThemeToggle = React.forwardRef<
  HTMLButtonElement,
  ThemeToggleProps
>(function ThemeToggle(
  {
    "aria-label": ariaLabel,
    applyToDocument = true,
    className,
    defaultPressed,
    disabled = false,
    enableSystem = true,
    id,
    knobClassName,
    onPressedChange,
    persist = true,
    pressed,
    size = "md",
    storageKey = DEFAULT_STORAGE_KEY,
    trackClassName,
  },
  ref
) {
  const isControlled = pressed !== undefined;
  const [visualPressed, setVisualPressed] = React.useState(
    defaultPressed ?? false
  );
  const [hasResolvedTheme, setHasResolvedTheme] = React.useState(false);
  const config = sizeConfig[size];
  const followsSystemPreference = React.useRef(false);
  const hasInitialized = React.useRef(false);
  const onPressedChangeRef = React.useRef(onPressedChange);
  const resolvedAriaLabel = ariaLabel ?? "Toggle theme";

  onPressedChangeRef.current = onPressedChange;

  const commitTheme = React.useCallback(
    (
      nextPressed: boolean,
      options?: {
        notify?: boolean;
        persistPreference?: boolean;
        updateDocument?: boolean;
      }
    ) => {
      const shouldPersist = options?.persistPreference !== false && persist;
      const shouldUpdateDocument =
        options?.updateDocument !== false && applyToDocument;
      const shouldNotify = options?.notify !== false;

      if (shouldPersist) {
        writeStoredPreference(storageKey, nextPressed);
        followsSystemPreference.current = false;
      }

      if (shouldUpdateDocument) {
        applyDocumentTheme(nextPressed);
      }

      if (shouldNotify) {
        onPressedChangeRef.current?.(nextPressed);
      }
    },
    [applyToDocument, persist, storageKey]
  );

  React.useLayoutEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;

    const stored = persist ? readStoredPreference(storageKey) : null;
    const initialPressed = isControlled
      ? (pressed ?? false)
      : resolveIsDark({
          defaultPressed,
          enableSystem,
          stored,
        });

    followsSystemPreference.current =
      !isControlled &&
      persist &&
      enableSystem &&
      (stored === "system" || stored === null);

    setVisualPressed(initialPressed);

    if (!isControlled) {
      commitTheme(initialPressed, {
        notify: false,
        persistPreference: false,
      });
    }

    setHasResolvedTheme(true);
  }, [
    commitTheme,
    defaultPressed,
    enableSystem,
    isControlled,
    persist,
    pressed,
    storageKey,
  ]);

  React.useEffect(() => {
    if (!isControlled) {
      return;
    }

    setVisualPressed(pressed);

    commitTheme(pressed, {
      notify: false,
      persistPreference: false,
    });
  }, [commitTheme, isControlled, pressed]);

  React.useEffect(() => {
    if (!(persist && enableSystem) || isControlled) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemChange = () => {
      if (!followsSystemPreference.current) {
        return;
      }

      const nextPressed = mediaQuery.matches;
      setVisualPressed(nextPressed);
      commitTheme(nextPressed);
    };

    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, [commitTheme, enableSystem, isControlled, persist]);

  React.useEffect(() => {
    if (!persist || isControlled) {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) {
        return;
      }

      const nextStored = event.newValue;

      if (nextStored !== "dark" && nextStored !== "light") {
        return;
      }

      const nextPressed = nextStored === "dark";
      followsSystemPreference.current = false;
      setVisualPressed(nextPressed);
      commitTheme(nextPressed, { persistPreference: false });
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [commitTheme, isControlled, persist, storageKey]);

  const handlePressedChange = React.useCallback(
    (nextPressed: boolean) => {
      if (disabled || nextPressed === visualPressed) {
        return;
      }

      setVisualPressed(nextPressed);
      commitTheme(nextPressed);
    },
    [commitTheme, disabled, visualPressed]
  );

  if (!hasResolvedTheme) {
    return (
      <button
        aria-label={resolvedAriaLabel}
        className={cn(
          "relative rounded-full border-2 border-border bg-muted",
          config.track,
          className
        )}
        disabled={disabled}
        id={id}
        ref={ref}
        suppressHydrationWarning
        type="button"
      />
    );
  }

  return (
    <TogglePrimitive
      aria-label={resolvedAriaLabel}
      disabled={disabled}
      id={id}
      onPressedChange={handlePressedChange}
      pressed={visualPressed}
      render={(renderProps) => {
        const {
          className: renderClassName,
          ref: renderRef,
          ...resolvedRenderProps
        } = renderProps;

        return (
          <ThemeToggleTrack
            {...resolvedRenderProps}
            ariaLabel={resolvedAriaLabel}
            className={cn(renderClassName, className)}
            config={config}
            disabled={disabled}
            isDark={visualPressed}
            knobClassName={knobClassName}
            renderRef={(node) => {
              setRef(renderRef, node);
              setRef(ref, node);
            }}
            trackClassName={trackClassName}
          />
        );
      }}
    />
  );
});

ThemeToggle.displayName = "ThemeToggle";
