"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { ChevronDown, X } from "lucide-react";
import { motion, type Transition, useReducedMotion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const QUERY_SPLIT_REGEX = /\s+/;
const ESCAPE_REGEX = /[.*+?^${}()|[\]\\]/g;

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)]";

const PANEL_EASE = [0.18, 1, 0.32, 1] as const;

const panelShellTransition: Transition = {
  height: {
    type: "spring",
    stiffness: 138,
    damping: 27,
    mass: 0.98,
  },
  opacity: { duration: 0.28, ease: PANEL_EASE },
};

const panelCopyOpenTransition: Transition = {
  opacity: { duration: 0.28, ease: PANEL_EASE, delay: 0.05 },
  y: { duration: 0.3, ease: PANEL_EASE, delay: 0.04 },
};

const panelCopyCloseTransition: Transition = {
  opacity: { duration: 0.24, ease: PANEL_EASE },
  y: { duration: 0.28, ease: PANEL_EASE },
};

const instantTransition: Transition = { duration: 0 };

const searchInputClassName = cn(
  "h-12 w-full appearance-none rounded-full border-[0.5px] border-border bg-card px-5 pr-11 text-[15px] text-foreground",
  "placeholder:text-muted-foreground",
  "outline-none focus-visible:ring-2 focus-visible:ring-ring",
  "[&::-webkit-search-cancel-button]:appearance-none",
  "[&::-webkit-search-decoration]:appearance-none"
);

const itemClassName = "overflow-hidden rounded-lg bg-muted/70 dark:bg-muted/50";

const triggerClassName =
  "flex w-full items-start justify-between gap-4 px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-not-allowed";

const answerClassName = "px-5 pb-5 text-[14px] text-muted-foreground leading-6";

type PanelRenderProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  className?: string;
  hidden?: boolean;
  ref?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
};

export type FaqProItem = {
  id: string;
  question: string;
  answer: React.ReactNode;
  keywords?: string[];
  disabled?: boolean;
};

export type FaqProProps = {
  className?: string;
  defaultOpenFirst?: boolean;
  defaultOpenId?: string;
  defaultValue?: string | null;
  emptyMessage?: string;
  filter?: (item: FaqProItem, query: string) => boolean;
  hideSearch?: boolean;
  items: FaqProItem[];
  noResultsMessage?: string;
  onOpenChange?: (openId: string | null) => void;
  onQueryChange?: (query: string) => void;
  searchPlaceholder?: string;
  themed?: boolean;
  value?: string | null;
};

function escapeRegExp(value: string) {
  return value.replace(ESCAPE_REGEX, "\\$&");
}

function getQueryTerms(query: string) {
  return query.trim().toLowerCase().split(QUERY_SPLIT_REGEX).filter(Boolean);
}

function itemSearchText(item: FaqProItem) {
  const answerText = typeof item.answer === "string" ? item.answer : "";

  return [item.question, answerText, ...(item.keywords ?? [])]
    .join(" ")
    .toLowerCase();
}

function defaultMatchesQuery(item: FaqProItem, query: string) {
  const terms = getQueryTerms(query);

  if (terms.length === 0) {
    return true;
  }

  return terms.every((term) => itemSearchText(item).includes(term));
}

function highlightText(text: string, query: string) {
  const terms = getQueryTerms(query);

  if (terms.length === 0) {
    return text;
  }

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    if (terms.some((term) => part.toLowerCase() === term.toLowerCase())) {
      return (
        <mark
          className="rounded-sm bg-amber-200/90 px-0.5 text-foreground dark:bg-amber-400/40"
          key={index}
        >
          {part}
        </mark>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function renderAnswer(answer: React.ReactNode, query: string) {
  return typeof answer === "string" ? highlightText(answer, query) : answer;
}

function getInitialOpenId(
  items: FaqProItem[],
  defaultValue: string | null | undefined,
  defaultOpenId: string | undefined,
  defaultOpenFirst: boolean
) {
  if (defaultValue !== undefined) {
    return defaultValue;
  }

  if (defaultOpenId && items.some((item) => item.id === defaultOpenId)) {
    return defaultOpenId;
  }

  if (defaultOpenFirst) {
    return items.find((item) => !item.disabled)?.id ?? null;
  }

  return null;
}

function isOpenIdVisible(openId: string | null, visibleItems: FaqProItem[]) {
  return (
    openId !== null &&
    visibleItems.some((item) => item.id === openId && !item.disabled)
  );
}

function getFirstVisibleId(visibleItems: FaqProItem[]) {
  return visibleItems.find((item) => !item.disabled)?.id ?? null;
}

function resolveAccordionOpenId(
  openId: string | null,
  visibleItems: FaqProItem[],
  searchActive: boolean
) {
  if (isOpenIdVisible(openId, visibleItems)) {
    return openId;
  }

  if (searchActive) {
    return getFirstVisibleId(visibleItems);
  }

  return null;
}

function sanitizePanelStyle(style?: React.CSSProperties) {
  if (!style) {
    return undefined;
  }

  const {
    height: _height,
    maxHeight: _maxHeight,
    minHeight: _minHeight,
    overflow: _overflow,
    ...rest
  } = style;

  return Object.keys(rest).length > 0 ? rest : undefined;
}

function resolvePanelProps(panelProps: PanelRenderProps) {
  const {
    children: _panelChildren,
    className: panelClassName,
    hidden: _panelHidden,
    onAnimationEnd: _onAnimationEnd,
    onAnimationIteration: _onAnimationIteration,
    onAnimationStart: _onAnimationStart,
    onDrag: _onDrag,
    onDragEnd: _onDragEnd,
    onDragEnter: _onDragEnter,
    onDragExit: _onDragExit,
    onDragLeave: _onDragLeave,
    onDragOver: _onDragOver,
    onDragStart: _onDragStart,
    onDrop: _onDrop,
    ref: panelRef,
    style: panelStyle,
    ...resolvedPanelProps
  } = panelProps;

  return {
    panelClassName,
    panelRef,
    panelStyle,
    resolvedPanelProps,
  };
}

function getPanelShellTransition(reduceMotion: boolean) {
  return reduceMotion ? instantTransition : panelShellTransition;
}

function getPanelCopyTransition(reduceMotion: boolean, isOpen: boolean) {
  if (reduceMotion) {
    return instantTransition;
  }

  return isOpen ? panelCopyOpenTransition : panelCopyCloseTransition;
}

type FaqProPanelBodyProps = {
  answer: React.ReactNode;
  isOpen: boolean;
  query: string;
  reduceMotion: boolean;
};

function FaqProPanelBody({
  answer,
  isOpen,
  query,
  reduceMotion,
}: FaqProPanelBodyProps) {
  if (reduceMotion) {
    if (!isOpen) {
      return null;
    }

    return (
      <div className="overflow-hidden">
        <div className={answerClassName}>{renderAnswer(answer, query)}</div>
      </div>
    );
  }

  return (
    <motion.div
      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
      className="overflow-hidden"
      initial={false}
      transition={getPanelShellTransition(reduceMotion)}
    >
      <motion.div
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -4 }}
        aria-hidden={!isOpen}
        className={answerClassName}
        inert={isOpen ? undefined : true}
        initial={false}
        transition={getPanelCopyTransition(reduceMotion, isOpen)}
      >
        {renderAnswer(answer, query)}
      </motion.div>
    </motion.div>
  );
}

type FaqProRowProps = {
  item: FaqProItem;
  query: string;
  reduceMotion: boolean;
};

function FaqProRow({ item, query, reduceMotion }: FaqProRowProps) {
  return (
    <AccordionPrimitive.Item
      className={cn(itemClassName, item.disabled && "opacity-60")}
      data-slot="faq-pro-item"
      disabled={item.disabled}
      value={item.id}
    >
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          className={triggerClassName}
          data-slot="faq-pro-trigger"
        >
          <span className="font-medium text-[15px] text-foreground leading-6 tracking-[-0.02em]">
            {highlightText(item.question, query)}
          </span>
          <ChevronDown
            aria-hidden
            className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-panel-open:rotate-180"
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      <AccordionPrimitive.Panel
        data-slot="faq-pro-panel"
        keepMounted
        render={(renderProps, state) => {
          const { panelClassName, panelRef, panelStyle, resolvedPanelProps } =
            resolvePanelProps(renderProps);

          return (
            <div
              {...resolvedPanelProps}
              className={cn("overflow-hidden", panelClassName)}
              ref={panelRef}
              style={sanitizePanelStyle(panelStyle)}
            >
              <FaqProPanelBody
                answer={item.answer}
                isOpen={state.open}
                query={query}
                reduceMotion={reduceMotion}
              />
            </div>
          );
        }}
      />
    </AccordionPrimitive.Item>
  );
}

const FaqPro = React.forwardRef<HTMLDivElement, FaqProProps>(
  (
    {
      className,
      defaultOpenFirst = false,
      defaultOpenId,
      defaultValue,
      emptyMessage = "No FAQs to show yet.",
      filter,
      hideSearch = false,
      items,
      noResultsMessage = "No FAQs match your search.",
      onOpenChange,
      onQueryChange,
      searchPlaceholder = "Search FAQs...",
      themed = true,
      value: valueProp,
    },
    ref
  ) => {
    const reduceMotion = useReducedMotion() === true;
    const wasSearchingRef = React.useRef(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const [query, setQuery] = React.useState("");
    const [uncontrolledOpenId, setUncontrolledOpenId] = React.useState<
      string | null
    >(() =>
      getInitialOpenId(items, defaultValue, defaultOpenId, defaultOpenFirst)
    );

    const isControlled = valueProp !== undefined;
    const openId = isControlled ? (valueProp ?? null) : uncontrolledOpenId;

    const normalizedQuery = query.trim();
    const searchActive = !hideSearch && normalizedQuery.length > 0;

    const matchesQuery = React.useCallback(
      (item: FaqProItem, searchQuery: string) =>
        filter
          ? filter(item, searchQuery)
          : defaultMatchesQuery(item, searchQuery),
      [filter]
    );

    const visibleItems = React.useMemo(() => {
      if (hideSearch || !searchActive) {
        return items;
      }

      return items.filter((item) => matchesQuery(item, query));
    }, [hideSearch, items, matchesQuery, query, searchActive]);

    const accordionOpenId = React.useMemo(() => {
      if (isControlled) {
        return isOpenIdVisible(openId, visibleItems) ? openId : null;
      }

      return resolveAccordionOpenId(openId, visibleItems, searchActive);
    }, [isControlled, openId, searchActive, visibleItems]);

    const setOpenId = React.useCallback(
      (next: string | null | ((current: string | null) => string | null)) => {
        if (isControlled) {
          const resolved =
            typeof next === "function" ? next(valueProp ?? null) : next;
          onOpenChange?.(resolved);
          return;
        }

        setUncontrolledOpenId((current) => {
          const resolved = typeof next === "function" ? next(current) : next;
          onOpenChange?.(resolved);
          return resolved;
        });
      },
      [isControlled, onOpenChange, valueProp]
    );

    const updateQuery = React.useCallback(
      (nextQuery: string) => {
        setQuery(nextQuery);
        onQueryChange?.(nextQuery);
      },
      [onQueryChange]
    );

    React.useEffect(() => {
      if (isControlled || hideSearch) {
        return;
      }

      if (searchActive) {
        wasSearchingRef.current = true;

        if (accordionOpenId !== openId) {
          setUncontrolledOpenId(accordionOpenId);
          onOpenChange?.(accordionOpenId);
        }

        return;
      }

      if (wasSearchingRef.current) {
        wasSearchingRef.current = false;
        const restored = getInitialOpenId(
          items,
          undefined,
          defaultOpenId,
          defaultOpenFirst
        );
        setUncontrolledOpenId(restored);
        onOpenChange?.(restored);
        return;
      }

      if (openId && !items.some((item) => item.id === openId)) {
        setUncontrolledOpenId(null);
        onOpenChange?.(null);
      }
    }, [
      accordionOpenId,
      defaultOpenFirst,
      defaultOpenId,
      hideSearch,
      isControlled,
      items,
      onOpenChange,
      openId,
      searchActive,
    ]);

    const handleValueChange = React.useCallback(
      (nextValue: string[]) => {
        setOpenId(nextValue[0] ?? null);
      },
      [setOpenId]
    );

    const handleSearchKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === "Escape" && query) {
        event.preventDefault();
        updateQuery("");
      }
    };

    const accordionValue = accordionOpenId ? [accordionOpenId] : [];
    const hasItems = items.length > 0;
    const hasVisibleItems = visibleItems.length > 0;
    const statusMessage = searchActive
      ? `${visibleItems.length} result${visibleItems.length === 1 ? "" : "s"} for "${normalizedQuery}"`
      : "";
    const emptyMessageText = searchActive ? noResultsMessage : emptyMessage;

    return (
      <div
        className={cn(
          themed && componentThemeClassName,
          "mx-auto flex w-full max-w-2xl flex-col gap-3",
          className
        )}
        data-slot="faq-pro"
        ref={ref}
      >
        {hideSearch ? null : (
          <div className="relative" data-slot="faq-pro-search">
            <input
              aria-label={searchPlaceholder}
              className={searchInputClassName}
              onChange={(event) => updateQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder={searchPlaceholder}
              ref={inputRef}
              type="search"
              value={query}
            />
            {query ? (
              <button
                aria-label="Clear search"
                className="absolute top-1/2 right-3 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => {
                  updateQuery("");
                  inputRef.current?.focus();
                }}
                type="button"
              >
                <X aria-hidden className="size-4" />
              </button>
            ) : null}
          </div>
        )}

        <output
          aria-live="polite"
          className="sr-only"
          data-slot="faq-pro-status"
        >
          {statusMessage}
        </output>

        {hasItems && hasVisibleItems ? null : (
          <p
            className="px-2 py-8 text-center text-[14px] text-muted-foreground"
            data-slot="faq-pro-empty"
          >
            {emptyMessageText}
          </p>
        )}

        {hasVisibleItems ? (
          <AccordionPrimitive.Root
            aria-label="Frequently asked questions"
            className="flex flex-col gap-2.5"
            data-slot="faq-pro-list"
            multiple={false}
            onValueChange={handleValueChange}
            value={accordionValue}
          >
            {visibleItems.map((item) => (
              <FaqProRow
                item={item}
                key={item.id}
                query={query}
                reduceMotion={reduceMotion}
              />
            ))}
          </AccordionPrimitive.Root>
        ) : null}
      </div>
    );
  }
);

FaqPro.displayName = "FaqPro";

export { FaqPro };
