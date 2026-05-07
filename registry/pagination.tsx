"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, type HTMLMotionProps, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const spring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 36,
  mass: 0.5,
};

type PaginationContextValue = {
  page?: number;
  setPage?: (page: number) => void;
  total?: number;
  underlineLayoutId: string;
};

const PaginationContext = React.createContext<PaginationContextValue | null>(
  null
);

function usePaginationContext(componentName: string) {
  const context = React.useContext(PaginationContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Pagination.`);
  }

  return context;
}

function getVisiblePages(page: number, total: number) {
  const pages: (number | "…")[] = [];

  for (let index = 1; index <= total; index++) {
    if (
      index === 1 ||
      index === total ||
      (index >= page - 1 && index <= page + 1)
    ) {
      pages.push(index);
    } else if (pages.at(-1) !== "…") {
      pages.push("…");
    }
  }

  return pages;
}

export interface PaginationProps
  extends Omit<React.ComponentPropsWithoutRef<"nav">, "onChange"> {
  total?: number;
  page?: number;
  onChange?: (page: number) => void;
}

export function Pagination({
  children,
  className,
  onChange,
  page: controlled,
  total,
  ...props
}: PaginationProps) {
  const [internal, setInternal] = React.useState(1);
  const page = controlled ?? internal;
  const underlineLayoutId = React.useId();

  const setPage = React.useCallback(
    (nextPage: number) => {
      if (typeof total === "number" && (nextPage < 1 || nextPage > total)) {
        return;
      }

      if (controlled === undefined) {
        setInternal(nextPage);
      }

      onChange?.(nextPage);
    },
    [controlled, onChange, total]
  );

  const renderedChildren =
    children ??
    (typeof total === "number" ? (
      <PaginationContent>
        <PaginationPrevious />
        {getVisiblePages(page, total).map((item, index) =>
          item === "…" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                className="tabular-nums"
                isActive={item === page}
                onClick={() => setPage(item)}
              >
                {String(item).padStart(2, "0")}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationNext />
      </PaginationContent>
    ) : null);

  return (
    <PaginationContext.Provider
      value={{ page, setPage, total, underlineLayoutId }}
    >
      <nav
        aria-label="Pagination"
        className={cn("inline-flex max-w-full", className)}
        {...props}
      >
        {renderedChildren}
      </nav>
    </PaginationContext.Provider>
  );
}

export const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<"ul">
>(({ children, className, ...props }, ref) => {
  const childArray = React.Children.toArray(children);
  let previousItem: React.ReactNode = null;
  let nextItem: React.ReactNode = null;
  const pageItems: React.ReactNode[] = [];

  for (const child of childArray) {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) {
      pageItems.push(child);
      continue;
    }

    if (child.type === PaginationPrevious) {
      previousItem = child;
      continue;
    }

    if (child.type === PaginationNext) {
      nextItem = child;
      continue;
    }

    const nestedChild = child.props.children;

    if (
      React.isValidElement(nestedChild) &&
      nestedChild.type === PaginationPrevious
    ) {
      previousItem = nestedChild;
      continue;
    }

    if (
      React.isValidElement(nestedChild) &&
      nestedChild.type === PaginationNext
    ) {
      nextItem = nestedChild;
      continue;
    }

    pageItems.push(child);
  }

  return (
    <ul
      className={cn(
        "inline-flex max-w-full items-center gap-3 text-sm sm:gap-6",
        className
      )}
      ref={ref}
      {...props}
    >
      {previousItem}

      <li className="min-w-0 list-none">
        <div className="relative flex w-[clamp(11rem,62vw,17.5rem)] items-center justify-center gap-0.5 sm:gap-1">
          <AnimatePresence initial={false} mode="popLayout">
            {pageItems}
          </AnimatePresence>
        </div>
      </li>

      {nextItem}
    </ul>
  );
});

PaginationContent.displayName = "PaginationContent";

export const PaginationItem = React.forwardRef<
  HTMLLIElement,
  HTMLMotionProps<"li">
>(({ className, ...props }, ref) => (
  <motion.li
    className={cn("list-none", className)}
    layout
    ref={ref}
    {...props}
  />
));

PaginationItem.displayName = "PaginationItem";

export interface PaginationLinkProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode;
  isActive?: boolean;
}

export const PaginationLink = React.forwardRef<
  HTMLButtonElement,
  PaginationLinkProps
>(({ children, className, isActive, ...props }, ref) => {
  const { underlineLayoutId } = usePaginationContext("PaginationLink");

  return (
    <motion.button
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative flex h-8 w-7 items-center justify-center sm:h-10 sm:w-8",
        className
      )}
      exit={{ opacity: 0, y: -6 }}
      initial={{ opacity: 0, y: 6 }}
      ref={ref}
      transition={spring}
      type="button"
      {...props}
    >
      <motion.span
        animate={{
          color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
          fontWeight: isActive ? 500 : 450,
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      {isActive && (
        <motion.span
          className="absolute bottom-1 left-1/2 h-px w-3 -translate-x-1/2 bg-foreground sm:w-4"
          layoutId={underlineLayoutId}
          transition={spring}
        />
      )}
    </motion.button>
  );
});

PaginationLink.displayName = "PaginationLink";

export interface PaginationPreviousProps
  extends React.ComponentPropsWithoutRef<"button"> {
  text?: string;
}

export const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  PaginationPreviousProps
>(({ className, disabled, onClick, text = "Prev", ...props }, ref) => {
  const context = usePaginationContext("PaginationPrevious");
  const isDisabled = disabled ?? context.page === 1;

  return (
    <button
      aria-label="Previous"
      className={cn(
        "group flex shrink-0 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-20 sm:gap-2",
        className
      )}
      disabled={isDisabled}
      onClick={(event) => {
        onClick?.(event);

        if (!(event.defaultPrevented || onClick) && context.page) {
          context.setPage?.(context.page - 1);
        }
      }}
      ref={ref}
      type="button"
      {...props}
    >
      <motion.span
        aria-hidden
        className="inline-flex"
        transition={spring}
        whileHover={{ x: -4 }}
      >
        <ArrowLeft className="h-3.5 w-3.5 stroke-[1.8]" />
      </motion.span>
      <span className="hidden text-[11px] uppercase tracking-[0.2em] sm:inline">
        {text}
      </span>
    </button>
  );
});

PaginationPrevious.displayName = "PaginationPrevious";

export interface PaginationNextProps
  extends React.ComponentPropsWithoutRef<"button"> {
  text?: string;
}

export const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  PaginationNextProps
>(({ className, disabled, onClick, text = "Next", ...props }, ref) => {
  const context = usePaginationContext("PaginationNext");
  const isDisabled = disabled ?? context.page === context.total;

  return (
    <button
      aria-label="Next"
      className={cn(
        "group flex shrink-0 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-20 sm:gap-2",
        className
      )}
      disabled={isDisabled}
      onClick={(event) => {
        onClick?.(event);

        if (
          !(event.defaultPrevented || onClick) &&
          typeof context.page === "number"
        ) {
          context.setPage?.(context.page + 1);
        }
      }}
      ref={ref}
      type="button"
      {...props}
    >
      <span className="hidden text-[11px] uppercase tracking-[0.2em] sm:inline">
        {text}
      </span>
      <motion.span
        aria-hidden
        className="inline-flex"
        transition={spring}
        whileHover={{ x: 4 }}
      >
        <ArrowRight className="h-3.5 w-3.5 stroke-[1.8]" />
      </motion.span>
    </button>
  );
});

PaginationNext.displayName = "PaginationNext";

export const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  HTMLMotionProps<"span">
>(({ className, ...props }, ref) => (
  <motion.span
    animate={{ opacity: 0.4 }}
    className={cn(
      "flex h-8 w-4 items-center justify-center text-muted-foreground sm:h-10 sm:w-5",
      className
    )}
    exit={{ opacity: 0 }}
    initial={{ opacity: 0 }}
    ref={ref}
    transition={spring}
    {...props}
  >
    <span aria-hidden>·</span>
    <span className="sr-only">More pages</span>
  </motion.span>
));

PaginationEllipsis.displayName = "PaginationEllipsis";
