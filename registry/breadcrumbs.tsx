"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type * as React from "react";
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const subtleEase = [0.22, 1, 0.36, 1] as const;

const itemVariants = {
  initial: { opacity: 0, x: -6 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 6 },
};

const separatorVariants = {
  initial: { opacity: 0, x: -4 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 4 },
};

const breadcrumbLinkClassName =
  "rounded-sm outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const breadcrumbTruncateClassName =
  "block max-w-[9rem] truncate sm:max-w-[14rem]";

const breadcrumbIconClassName =
  "flex shrink-0 items-center justify-center text-current [&>svg]:size-3.5";

const menuCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

const menuCornerInheritClassName =
  "rounded-[inherit] supports-[corner-shape:squircle]:[corner-shape:inherit]";

const menuPanelClassName = cn(
  menuCornerClassName,
  "absolute top-[calc(100%+0.35rem)] left-0 z-50 min-w-[10rem] overflow-hidden border border-border/60 bg-card p-1 text-card-foreground shadow-[var(--ic-shadow-soft)]"
);

const menuItemClassName = cn(
  menuCornerClassName,
  "relative isolate flex min-h-11 w-full cursor-pointer touch-manipulation select-none items-center gap-2 px-3 py-2.5 text-left text-foreground text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
);

const menuItemHighlightClassName = cn(
  menuCornerInheritClassName,
  "absolute inset-0 -z-10 bg-accent/68"
);

const menuHighlightSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 41,
  mass: 0.82,
};

type MotionOlProps = React.ComponentProps<typeof motion.ol>;
type MotionLiProps = React.ComponentProps<typeof motion.li>;

type BreadcrumbItemData = {
  href?: string;
  icon?: ReactNode;
  label: ReactNode;
  title?: string;
};

type BreadcrumbEllipsisMenuItem = {
  href?: string;
  icon?: ReactNode;
  label: ReactNode;
};

type BreadcrumbJsonLdItem = {
  href?: string;
  label: string;
};

type BreadcrumbJsonLdProps = {
  currentPath?: string;
  items: BreadcrumbJsonLdItem[];
  siteUrl: string;
};

type BreadcrumbListItem = {
  "@type": "ListItem";
  item: string;
  name: string;
  position: number;
};

type BreadcrumbProps = React.ComponentProps<"nav"> & {
  ariaLabel?: string;
};

type BreadcrumbLinkProps = useRender.ComponentProps<"a"> & {
  truncate?: boolean;
};

type BreadcrumbPageProps = React.ComponentProps<"span"> & {
  truncate?: boolean;
};

type BreadcrumbEllipsisMenuProps = {
  className?: string;
  items: BreadcrumbEllipsisMenuItem[];
  menuLabel?: string;
};

type BreadcrumbsProps = Omit<BreadcrumbProps, "children"> & {
  currentPath?: string;
  items: BreadcrumbItemData[];
  listClassName?: string;
  maxItems?: number;
  renderLink?: (props: {
    children: ReactNode;
    className?: string;
    href: string;
    title?: string;
    truncate?: boolean;
  }) => ReactNode;
  separator?: ReactNode;
  siteUrl?: string;
  truncate?: boolean;
};

function getBreadcrumbItemTitle(item: BreadcrumbItemData) {
  if (item.title) {
    return item.title;
  }

  return typeof item.label === "string" ? item.label : undefined;
}

function getBreadcrumbItemKey(item: BreadcrumbItemData, index: number) {
  if (typeof item.label === "string") {
    return `breadcrumb-${index}-${item.label}`;
  }

  return `breadcrumb-${index}`;
}

function getMenuItemLabel(item: BreadcrumbEllipsisMenuItem, index: number) {
  return typeof item.label === "string" ? item.label : `Item ${index + 1}`;
}

function collapseBreadcrumbItems<T>(items: T[], maxItems: number) {
  if (items.length <= maxItems) {
    return {
      collapsed: [] as T[],
      leading: items,
      trailing: [] as T[],
    };
  }

  const trailingCount = Math.max(1, maxItems - 2);
  const leading = items.slice(0, 1);
  const trailing = items.slice(items.length - trailingCount);
  const collapsed = items.slice(1, items.length - trailingCount);

  return { collapsed, leading, trailing };
}

function toAbsoluteBreadcrumbUrl(siteUrl: string, path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedSiteUrl = siteUrl.endsWith("/")
    ? siteUrl.slice(0, -1)
    : siteUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedSiteUrl}${normalizedPath}`;
}

function BreadcrumbSegmentContent({
  icon,
  label,
  truncate = false,
}: {
  icon?: ReactNode;
  label: ReactNode;
  truncate?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-w-0 items-center",
        icon ? "gap-1.5" : undefined
      )}
    >
      {icon ? <span className={breadcrumbIconClassName}>{icon}</span> : null}
      <span className={cn("min-w-0", truncate && breadcrumbTruncateClassName)}>
        {label}
      </span>
    </span>
  );
}

function BreadcrumbMenuItemContent({
  icon,
  label,
}: {
  icon?: ReactNode;
  label: ReactNode;
}) {
  return (
    <>
      {icon ? (
        <span
          className={cn(
            breadcrumbIconClassName,
            "relative z-10 size-4 text-muted-foreground [&>svg]:size-4"
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className="relative z-10 min-w-0 flex-1 truncate text-left">
        {label}
      </span>
    </>
  );
}

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ ariaLabel = "Breadcrumb", className, ...props }, ref) => {
    return (
      <nav
        aria-label={ariaLabel}
        className={cn(componentThemeClassName, className)}
        data-slot="breadcrumb"
        ref={ref}
        {...props}
      />
    );
  }
);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = forwardRef<HTMLOListElement, React.ComponentProps<"ol">>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.ol
        className={cn(
          "wrap-break-word flex flex-wrap items-center gap-1.5 text-muted-foreground text-sm",
          className
        )}
        data-slot="breadcrumb-list"
        ref={ref}
        transition={{ duration: 0.18, ease: subtleEase }}
        {...(props as MotionOlProps)}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {children}
        </AnimatePresence>
      </motion.ol>
    );
  }
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => {
    return (
      <motion.li
        animate="animate"
        className={cn("inline-flex items-center gap-1", className)}
        data-slot="breadcrumb-item"
        exit="exit"
        initial="initial"
        layout="position"
        ref={ref}
        transition={{ duration: 0.18, ease: subtleEase }}
        variants={itemVariants}
        {...(props as MotionLiProps)}
      />
    );
  }
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, render, truncate = false, title, ...props }, ref) => {
    return useRender({
      defaultTagName: "a",
      props: mergeProps<"a">(
        {
          className: cn(
            breadcrumbLinkClassName,
            truncate && breadcrumbTruncateClassName,
            className
          ),
          ref,
          title,
        },
        props
      ),
      render,
      state: {
        slot: "breadcrumb-link",
      },
    });
  }
);
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, truncate = false, title, ...props }, ref) => {
    return (
      <span
        aria-current="page"
        className={cn(
          "inline-flex min-w-0 items-center font-medium text-foreground",
          truncate && breadcrumbTruncateClassName,
          className
        )}
        data-slot="breadcrumb-page"
        ref={ref}
        title={title}
        {...props}
      />
    );
  }
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ children, className, ...props }, ref) => {
  return (
    <motion.li
      animate="animate"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      data-slot="breadcrumb-separator"
      exit="exit"
      initial="initial"
      layout="position"
      ref={ref}
      role="presentation"
      transition={{ duration: 0.18, ease: subtleEase }}
      variants={separatorVariants}
      {...(props as MotionLiProps)}
    >
      {children ?? <ChevronRightIcon className="cn-rtl-flip" />}
    </motion.li>
  );
});
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-5 items-center justify-center [&>svg]:size-4",
        className
      )}
      data-slot="breadcrumb-ellipsis"
      {...props}
    >
      <MoreHorizontalIcon />
    </span>
  );
}
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

function BreadcrumbEllipsisMenuRow({
  activeIndex,
  highlightLayoutId,
  index,
  item,
  itemRef,
  onActivate,
  onHighlight,
}: {
  activeIndex: number;
  highlightLayoutId: string;
  index: number;
  item: BreadcrumbEllipsisMenuItem;
  itemRef: (node: HTMLAnchorElement | HTMLDivElement | null) => void;
  onActivate: (index: number) => void;
  onHighlight: (index: number) => void;
}) {
  const isActive = index === activeIndex;
  const label = getMenuItemLabel(item, index);
  const content = (
    <BreadcrumbMenuItemContent icon={item.icon} label={item.label} />
  );

  if (item.href) {
    return (
      <motion.a
        className={menuItemClassName}
        href={item.href}
        onClick={() => onActivate(index)}
        onMouseEnter={() => onHighlight(index)}
        onPointerMove={() => onHighlight(index)}
        ref={itemRef}
        role="menuitem"
        tabIndex={isActive ? 0 : -1}
        title={label}
        whileTap={{ scale: 0.96 }}
      >
        {isActive ? (
          <motion.span
            className={menuItemHighlightClassName}
            initial={false}
            layoutId={highlightLayoutId}
            transition={menuHighlightSpring}
          />
        ) : null}
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      aria-disabled="true"
      className={cn(menuItemClassName, "text-muted-foreground")}
      onMouseEnter={() => onHighlight(index)}
      onPointerMove={() => onHighlight(index)}
      ref={itemRef}
      role="menuitem"
      tabIndex={-1}
      title={label}
    >
      {isActive ? (
        <motion.span
          className={menuItemHighlightClassName}
          initial={false}
          layoutId={highlightLayoutId}
          transition={menuHighlightSpring}
        />
      ) : null}
      {content}
    </motion.div>
  );
}

function getEllipsisMenuIndexForKey(
  key: string,
  activeIndex: number,
  itemCount: number
) {
  switch (key) {
    case "ArrowDown":
      return (activeIndex + 1) % itemCount;
    case "ArrowUp":
      return (activeIndex - 1 + itemCount) % itemCount;
    case "Home":
      return 0;
    case "End":
      return itemCount - 1;
    default:
      return null;
  }
}

function handleEllipsisMenuKeyDown({
  activeIndex,
  closeMenu,
  event,
  itemRefs,
  items,
  setActiveIndex,
}: {
  activeIndex: number;
  closeMenu: () => void;
  event: KeyboardEvent;
  itemRefs: { current: Array<HTMLAnchorElement | HTMLDivElement | null> };
  items: BreadcrumbEllipsisMenuItem[];
  setActiveIndex: (index: number) => void;
}) {
  if (event.key === "Escape") {
    event.preventDefault();
    closeMenu();
    return;
  }

  if (!items.length) {
    return;
  }

  const nextIndex = getEllipsisMenuIndexForKey(
    event.key,
    activeIndex,
    items.length
  );

  if (nextIndex !== null) {
    event.preventDefault();
    setActiveIndex(nextIndex);
    return;
  }

  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const item = items[activeIndex];

  if (!item?.href) {
    return;
  }

  event.preventDefault();
  itemRefs.current[activeIndex]?.click();
}

function BreadcrumbEllipsisMenu({
  className,
  items,
  menuLabel = "Show collapsed breadcrumb items",
}: BreadcrumbEllipsisMenuProps) {
  const menuId = useId();
  const highlightLayoutId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | HTMLDivElement | null>>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  const activateItem = useCallback(
    (index: number) => {
      const item = items[index];

      if (item?.href) {
        closeMenu();
      }
    },
    [closeMenu, items]
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    setActiveIndex(0);
    const frameId = window.requestAnimationFrame(() => {
      itemRefs.current[0]?.focus();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    itemRefs.current[activeIndex]?.focus();
  }, [activeIndex, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      handleEllipsisMenuKeyDown({
        activeIndex,
        closeMenu,
        event,
        itemRefs,
        items,
        setActiveIndex,
      });
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, closeMenu, items, open]);

  if (!items.length) {
    return (
      <span
        className={cn(
          "inline-flex size-5 items-center justify-center text-muted-foreground",
          className
        )}
        data-slot="breadcrumb-ellipsis-empty"
      >
        <BreadcrumbEllipsis />
      </span>
    );
  }

  return (
    <div className={cn("relative inline-flex", className)} ref={rootRef}>
      <button
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={menuLabel}
        className={cn(
          breadcrumbLinkClassName,
          "flex size-5 items-center justify-center text-muted-foreground hover:text-foreground [&>svg]:size-4"
        )}
        data-slot="breadcrumb-ellipsis-menu-trigger"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <MoreHorizontalIcon />
      </button>
      {open ? (
        <div className={menuPanelClassName} id={menuId} role="menu">
          {items.map((item, index) => (
            <div key={`breadcrumb-menu-${index}`} role="none">
              <BreadcrumbEllipsisMenuRow
                activeIndex={activeIndex}
                highlightLayoutId={highlightLayoutId}
                index={index}
                item={item}
                itemRef={(node) => {
                  itemRefs.current[index] = node;
                }}
                onActivate={activateItem}
                onHighlight={setActiveIndex}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
BreadcrumbEllipsisMenu.displayName = "BreadcrumbEllipsisMenu";

function BreadcrumbJsonLd({
  currentPath = "/",
  items,
  siteUrl,
}: BreadcrumbJsonLdProps) {
  const itemListElement = items
    .map((item, index) => {
      const isLast = index === items.length - 1;
      const url = item.href
        ? toAbsoluteBreadcrumbUrl(siteUrl, item.href)
        : isLast
          ? toAbsoluteBreadcrumbUrl(siteUrl, currentPath)
          : null;

      if (!url) {
        return null;
      }

      return {
        "@type": "ListItem",
        item: url,
        name: item.label,
        position: index + 1,
      } satisfies BreadcrumbListItem;
    })
    .filter((item): item is BreadcrumbListItem => item !== null);

  if (itemListElement.length < 2) {
    return null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD script payload
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
}
BreadcrumbJsonLd.displayName = "BreadcrumbJsonLd";

function BreadcrumbSegment({
  isCurrent,
  item,
  renderLink,
  truncate,
}: {
  isCurrent: boolean;
  item: BreadcrumbItemData;
  renderLink?: BreadcrumbsProps["renderLink"];
  truncate: boolean;
}) {
  const title = getBreadcrumbItemTitle(item);
  const content = (
    <BreadcrumbSegmentContent
      icon={item.icon}
      label={item.label}
      truncate={truncate}
    />
  );

  if (isCurrent || !item.href) {
    return <BreadcrumbPage title={title}>{content}</BreadcrumbPage>;
  }

  if (renderLink) {
    return renderLink({
      children: content,
      className: "inline-flex min-w-0 items-center",
      href: item.href,
      title,
      truncate,
    });
  }

  return (
    <BreadcrumbLink
      className="inline-flex min-w-0 items-center"
      href={item.href}
      title={title}
    >
      {content}
    </BreadcrumbLink>
  );
}

function buildBreadcrumbTrailNodes({
  items,
  maxItems,
  renderLink,
  separator,
  truncate,
}: {
  items: BreadcrumbItemData[];
  maxItems?: number;
  renderLink?: BreadcrumbsProps["renderLink"];
  separator?: ReactNode;
  truncate: boolean;
}) {
  const nodes: ReactNode[] = [];

  const pushSeparator = (key: string) => {
    nodes.push(
      <BreadcrumbSeparator key={key}>{separator}</BreadcrumbSeparator>
    );
  };

  const pushSegment = (
    item: BreadcrumbItemData,
    index: number,
    isCurrent: boolean
  ) => {
    nodes.push(
      <BreadcrumbItem key={getBreadcrumbItemKey(item, index)}>
        <BreadcrumbSegment
          isCurrent={isCurrent}
          item={item}
          renderLink={renderLink}
          truncate={truncate}
        />
      </BreadcrumbItem>
    );
  };

  const shouldCollapse =
    typeof maxItems === "number" && maxItems >= 2 && items.length > maxItems;

  if (!shouldCollapse) {
    items.forEach((item, index) => {
      if (index > 0) {
        pushSeparator(`breadcrumb-separator-${index}`);
      }

      pushSegment(item, index, index === items.length - 1);
    });

    return nodes;
  }

  const { collapsed, leading, trailing } = collapseBreadcrumbItems(
    items,
    maxItems
  );

  leading.forEach((item, index) => {
    if (index > 0) {
      pushSeparator(`breadcrumb-leading-separator-${index}`);
    }

    pushSegment(item, index, false);
  });

  if (collapsed.length > 0) {
    pushSeparator("breadcrumb-ellipsis-separator");
    nodes.push(
      <BreadcrumbItem key="breadcrumb-ellipsis-menu">
        <BreadcrumbEllipsisMenu
          items={collapsed.map((item) => ({
            href: item.href,
            icon: item.icon,
            label: item.label,
          }))}
        />
      </BreadcrumbItem>
    );
  }

  trailing.forEach((item, index) => {
    const itemIndex = items.length - trailing.length + index;

    pushSeparator(`breadcrumb-trailing-separator-${itemIndex}`);
    pushSegment(item, itemIndex, itemIndex === items.length - 1);
  });

  return nodes;
}

function Breadcrumbs({
  ariaLabel,
  className,
  currentPath,
  items,
  listClassName,
  maxItems,
  renderLink,
  separator,
  siteUrl,
  truncate = false,
  ...navProps
}: BreadcrumbsProps) {
  const jsonLdItems = useMemo(
    () =>
      items.map((item, index) => ({
        href: item.href,
        label:
          typeof item.label === "string" ? item.label : `Item ${index + 1}`,
      })),
    [items]
  );

  const trailNodes = useMemo(
    () =>
      buildBreadcrumbTrailNodes({
        items,
        maxItems,
        renderLink,
        separator,
        truncate,
      }),
    [items, maxItems, renderLink, separator, truncate]
  );

  return (
    <Breadcrumb ariaLabel={ariaLabel} className={className} {...navProps}>
      {siteUrl ? (
        <BreadcrumbJsonLd
          currentPath={currentPath}
          items={jsonLdItems}
          siteUrl={siteUrl}
        />
      ) : null}
      <BreadcrumbList className={listClassName}>{trailNodes}</BreadcrumbList>
    </Breadcrumb>
  );
}
Breadcrumbs.displayName = "Breadcrumbs";

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbEllipsisMenu,
  BreadcrumbItem,
  BreadcrumbJsonLd,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  Breadcrumbs,
  BreadcrumbSeparator,
};
export type {
  BreadcrumbEllipsisMenuItem,
  BreadcrumbItemData,
  BreadcrumbJsonLdItem,
  BreadcrumbJsonLdProps,
  BreadcrumbsProps,
};
