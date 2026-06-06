"use client";

import { ChevronDownIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { buttonApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { useResolvedReducedMotion } from "@/lib/reduced-motion";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/registry/b-button";

type ButtonVariant = NonNullable<ButtonProps["variant"]>;

const variantOptions: { label: string; value: ButtonVariant }[] = [
  { value: "default", label: "Default" },
  { value: "outline", label: "Outline" },
  { value: "secondary", label: "Secondary" },
  { value: "ghost", label: "Ghost" },
  { value: "destructive", label: "Destructive" },
  { value: "link", label: "Link" },
];

const sentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

const SOFT_EASE = [0.22, 1, 0.36, 1] as const;
const EXIT_EASE = [0.55, 0.06, 0.68, 0.19] as const;
const FLUID_EASE = [0.16, 1, 0.3, 1] as const;
const POPUP_EXIT_EASE = [0.4, 0, 0.6, 1] as const;
const POPUP_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 32,
  mass: 0.95,
};

function getMenuMotion(reduceMotion: boolean) {
  if (reduceMotion) {
    return {
      animate: { opacity: 1, scale: 1, y: 0 },
      closed: { opacity: 0, scale: 1, y: 0 },
      initial: { opacity: 0, scale: 1, y: 0 },
      openTransition: { duration: 0.12, ease: "easeOut" as const },
      closedTransition: { duration: 0.1, ease: "easeOut" as const },
    };
  }

  return {
    animate: { opacity: 1, scale: 1, y: 0 },
    closed: { opacity: 0, scale: 0.985, y: -5 },
    initial: { opacity: 0, scale: 0.985, y: -5 },
    openTransition: {
      opacity: { duration: 0.34, ease: FLUID_EASE },
      scale: POPUP_SPRING,
      y: POPUP_SPRING,
    },
    closedTransition: {
      opacity: { duration: 0.22, ease: POPUP_EXIT_EASE },
      scale: { duration: 0.22, ease: POPUP_EXIT_EASE },
      y: { duration: 0.22, ease: POPUP_EXIT_EASE },
    },
  };
}

function getMenuItemVariants(reduceMotion: boolean) {
  return {
    exit: (index: number) => ({
      opacity: 0,
      transition: {
        delay: reduceMotion ? 0 : Math.min(index, 4) * 0.01,
        duration: reduceMotion ? 0.1 : 0.12,
        ease: reduceMotion ? ("easeOut" as const) : EXIT_EASE,
      },
      y: reduceMotion ? 0 : -2,
    }),
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : -4,
    },
    visible: (index: number) => ({
      opacity: 1,
      transition: {
        delay: reduceMotion ? 0 : Math.min(index, 4) * 0.02,
        duration: reduceMotion ? 0.12 : 0.18,
        ease: reduceMotion ? ("easeOut" as const) : SOFT_EASE,
      },
      y: 0,
    }),
  };
}

const usageCode = `import { Button } from "@/components/ui/b-button";

export function ButtonPreview() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="${sentenceClassName}">
        <span>When you are ready to ship with</span>
        <span className="font-medium text-foreground">Default</span>
        <span>Tap</span>
        <span className="inline-flex translate-y-px align-middle">
          <Button variant="default">Continue</Button>
        </span>
        <span>to finish.</span>
      </p>
    </div>
  );
}`;

function InlineVariantSelect({
  onChange,
  value,
}: {
  onChange: (value: ButtonVariant) => void;
  value: ButtonVariant;
}) {
  const reduceMotion = useResolvedReducedMotion();
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuMotion = getMenuMotion(reduceMotion);
  const menuItemVariants = getMenuItemVariants(reduceMotion);
  const selectedLabel =
    variantOptions.find((option) => option.value === value)?.label ?? value;

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;

    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();

    setMenuStyle({
      left: rect.left + rect.width / 2,
      top: rect.bottom + 6,
      width: Math.max(rect.width, 152),
    });
  }, []);

  function toggleMenu() {
    setOpen((current) => {
      if (current) {
        return false;
      }

      updateMenuPosition();
      return true;
    });
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function updateMenuPositionOnScroll() {
      updateMenuPosition();
    }

    updateMenuPositionOnScroll();
    window.addEventListener("resize", updateMenuPositionOnScroll);
    window.addEventListener("scroll", updateMenuPositionOnScroll, true);

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (containerRef.current?.contains(target)) {
        return;
      }

      if (
        target instanceof Element &&
        target.closest("[data-button-variant-menu]")
      ) {
        return;
      }

      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", updateMenuPositionOnScroll);
      window.removeEventListener("scroll", updateMenuPositionOnScroll, true);
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, updateMenuPosition]);

  const menu =
    menuStyle && typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            {open ? (
              <motion.ul
                animate={{ ...menuMotion.animate, x: "-50%" }}
                className="fixed z-[300] m-0 origin-top list-none rounded-lg border border-border bg-card p-1 text-card-foreground shadow-[0_12px_32px_-18px_rgba(15,23,42,0.28)] dark:border-border dark:bg-card dark:shadow-[0_12px_32px_-18px_rgba(0,0,0,0.6)]"
                data-button-variant-menu=""
                exit={{
                  ...menuMotion.closed,
                  transition: menuMotion.closedTransition,
                  x: "-50%",
                }}
                initial={{ ...menuMotion.initial, x: "-50%" }}
                key="button-variant-menu"
                role="listbox"
                style={{
                  left: menuStyle.left,
                  top: menuStyle.top,
                  width: menuStyle.width,
                }}
                transition={menuMotion.openTransition}
              >
                {variantOptions.map((option, index) => {
                  const isSelected = option.value === value;

                  return (
                    <motion.li
                      animate="visible"
                      custom={index}
                      exit="exit"
                      initial={reduceMotion ? false : "hidden"}
                      key={option.value}
                      role="presentation"
                      variants={menuItemVariants}
                    >
                      <button
                        aria-selected={isSelected}
                        className={cn(
                          "flex w-full cursor-pointer items-center rounded-md border-0 px-3 py-2 text-left text-sm transition-colors",
                          isSelected
                            ? "bg-accent font-medium text-foreground"
                            : "bg-card font-normal text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                        onClick={() => {
                          onChange(option.value);
                          setOpen(false);
                        }}
                        role="option"
                        type="button"
                      >
                        {option.label}
                      </button>
                    </motion.li>
                  );
                })}
              </motion.ul>
            ) : null}
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <>
      <span className="relative inline-flex align-middle" ref={containerRef}>
        <button
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label="Button variant"
          className="inline-flex items-center gap-0.5 border-0 bg-transparent p-0 font-medium text-foreground transition-colors hover:text-foreground focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none"
          onClick={toggleMenu}
          ref={triggerRef}
          type="button"
        >
          <span>{selectedLabel}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            className="inline-flex"
            transition={
              reduceMotion
                ? { duration: 0.12, ease: "easeOut" }
                : { duration: 0.2, ease: SOFT_EASE }
            }
          >
            <ChevronDownIcon className="size-4 text-muted-foreground" />
          </motion.span>
        </button>
      </span>
      {menu}
    </>
  );
}

function ButtonPreview() {
  const [variant, setVariant] = useState<ButtonVariant>("default");

  return (
    <div className="flex min-h-[280px] w-full items-center justify-center px-4 py-2">
      <div className="mx-auto max-w-2xl text-center">
        <p className={sentenceClassName}>
          <span>When you are ready to ship with</span>
          <InlineVariantSelect onChange={setVariant} value={variant} />
          <span>Tap</span>
          <span className="inline-flex translate-y-px align-middle">
            <Button variant={variant}>Continue</Button>
          </span>
          <span>to finish.</span>
        </p>
      </div>
    </div>
  );
}

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Button" },
];

function getDetails(): DetailItem[] {
  return buttonApiDetails.map((item) => {
    if (item.id !== "registry") {
      return item;
    }

    return {
      ...item,
      notes: [
        "Dependencies: @base-ui/react, motion, class-variance-authority.",
        "This page documents the Base UI install only, because Radix UI does not ship a separate button primitive.",
        "The generated registry file is /r/b-button.json.",
      ],
      registryPath: "b-button.json",
    };
  });
}

function handleProviderSelect() {
  return undefined;
}

export default function RadixBaseButtonPage() {
  const details = useMemo(() => getDetails(), []);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="b-button"
      description="Action button for primary, secondary, and inline interactions."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/button/page.tsx`}
      headerActions={
        <ProviderSwitch
          disabledProviders={["radix"]}
          onSelect={handleProviderSelect}
          selectedProvider="base"
        />
      }
      itemSlug="button"
      pageUrl="/components/button"
      preview={<ButtonPreview />}
      previewDescription="Pick a variant inline in the sentence, then see how the Continue button reads on the line below."
      title="Button"
      usageCode={usageCode}
      usageDescription="This Base UI install keeps the same public Button API, ripple behavior, press spring, hover lift, and optional intrinsic-width animation as the core Iconiq button."
      v0PageCode={usageCode}
    />
  );
}
