"use client";

import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

export const TABLE_DEFAULT_COLUMNS =
  "minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)";

export type TableAlign = "left" | "center" | "right";
export type TableRowVariant = "body" | "header";
export type TableSize = "default" | "compact";
export type TableSortDirection = "asc" | "desc";
export type TableSortState = TableSortDirection | "none";

type TableContextValue = {
  columnCount: number;
  columns: string;
  size: TableSize;
  stickyHeader: boolean;
};

const TableContext = React.createContext<TableContextValue | null>(null);

const selectCheckboxClassName =
  "size-4 shrink-0 rounded border border-border accent-foreground";

function getColumnTokens(columns: string) {
  const tokens: string[] = [];
  let token = "";
  let depth = 0;

  for (const char of columns) {
    if (char === "(") {
      depth += 1;
    }

    if (char === ")") {
      depth = Math.max(0, depth - 1);
    }

    if (char === " " && depth === 0) {
      const nextToken = token.trim();

      if (nextToken) {
        tokens.push(nextToken);
      }

      token = "";
      continue;
    }

    token += char;
  }

  const lastToken = token.trim();

  if (lastToken) {
    tokens.push(lastToken);
  }

  return tokens;
}

function useTableContext(componentName: string) {
  const context = React.useContext(TableContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Table.`);
  }

  return context;
}

function alignClassName(align: TableAlign) {
  if (align === "right") {
    return "text-right";
  }

  if (align === "center") {
    return "text-center";
  }

  return "text-left";
}

function sortButtonAlignClassName(align: TableAlign) {
  if (align === "right") {
    return "justify-end text-right";
  }

  if (align === "center") {
    return "justify-center text-center";
  }

  return "";
}

function getAriaSortValue(
  sortDirection?: TableSortState
): "ascending" | "descending" | "none" | undefined {
  if (sortDirection === "asc") {
    return "ascending";
  }

  if (sortDirection === "desc") {
    return "descending";
  }

  if (sortDirection === "none") {
    return "none";
  }

  return undefined;
}

function countRowCells(children: React.ReactNode) {
  return React.Children.toArray(children).filter(React.isValidElement).length;
}

function useRowColumnCountWarning(
  componentName: string,
  children: React.ReactNode,
  columnCount: number
) {
  const cellCount = countRowCells(children);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      return;
    }

    if (cellCount > 0 && cellCount !== columnCount) {
      console.warn(
        `[Iconiq Table] ${componentName} rendered ${cellCount} cells but Table columns defines ${columnCount}. Update the \`columns\` prop or cell count to keep rows aligned.`
      );
    }
  }, [cellCount, columnCount, componentName]);
}

function getSortButtonLabel(
  children: React.ReactNode,
  active: boolean,
  direction: TableSortDirection
) {
  if (typeof children !== "string" || !children.trim()) {
    return "Sort column";
  }

  if (!active) {
    return `Sort by ${children}`;
  }

  return `Sort by ${children}, ${direction === "desc" ? "descending" : "ascending"}`;
}

function useTableMotionEnabled() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return mounted && reduceMotion !== true;
}

export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement> {
  columns?: string;
  size?: TableSize;
  stickyHeader?: boolean;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      children,
      className,
      columns = TABLE_DEFAULT_COLUMNS,
      size = "default",
      stickyHeader = false,
      ...props
    },
    ref
  ) => {
    const columnCount = React.useMemo(
      () => Math.max(1, getColumnTokens(columns).length),
      [columns]
    );
    const contextValue = React.useMemo(
      () => ({ columns, columnCount, size, stickyHeader }),
      [columnCount, columns, size, stickyHeader]
    );

    return (
      <TableContext.Provider value={contextValue}>
        <div
          className={cn(componentThemeClassName, "w-full overflow-x-auto")}
          data-slot="table-wrapper"
        >
          <table
            className={cn(
              "w-full caption-bottom border-separate border-spacing-0",
              className
            )}
            data-slot="table"
            ref={ref}
            {...props}
          >
            {children}
          </table>
        </div>
      </TableContext.Provider>
    );
  }
);
Table.displayName = "Table";

export interface TableToolbarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  tableId?: string;
}

const TableToolbar = React.forwardRef<HTMLDivElement, TableToolbarProps>(
  ({ className, tableId, ...props }, ref) => (
    <div
      {...(tableId
        ? { "aria-controls": tableId, role: "toolbar" as const }
        : {})}
      className={cn("mb-6 flex items-center justify-between gap-3", className)}
      data-slot="table-toolbar"
      ref={ref}
      {...props}
    />
  )
);
TableToolbar.displayName = "TableToolbar";

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  sticky?: boolean;
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, sticky, ...props }, ref) => {
    const { stickyHeader } = useTableContext("TableHeader");
    const isSticky = sticky ?? stickyHeader;

    return (
      <thead
        className={cn(
          isSticky &&
            "sticky top-0 z-10 bg-background shadow-[0_1px_0_0_var(--ic-border)]",
          className
        )}
        data-slot="table-header"
        data-sticky={isSticky ? "true" : "false"}
        ref={ref}
        {...props}
      />
    );
  }
);
TableHeader.displayName = "TableHeader";

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className, ...props }, ref) => (
    <tbody
      className={cn("relative", className)}
      data-slot="table-body"
      ref={ref}
      {...props}
    >
      <LayoutGroup>
        <AnimatePresence initial={false}>{children}</AnimatePresence>
      </LayoutGroup>
    </tbody>
  )
);
TableBody.displayName = "TableBody";

export interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      className={cn(
        "border-border border-t text-muted-foreground text-sm",
        className
      )}
      data-slot="table-footer"
      ref={ref}
      {...props}
    />
  )
);
TableFooter.displayName = "TableFooter";

export interface TableRowProps
  extends Omit<React.ComponentPropsWithoutRef<typeof motion.tr>, "children"> {
  children?: React.ReactNode;
  hoverable?: boolean;
  index?: number;
  selected?: boolean;
  variant?: TableRowVariant;
}

function getTableRowClassName({
  className,
  isCompact,
  isHeader,
  isHoverable,
  selected,
}: {
  className?: string;
  isCompact: boolean;
  isHeader: boolean;
  isHoverable: boolean;
  selected: boolean;
}) {
  return cn(
    "grid items-center",
    isHeader
      ? "border-border border-y text-muted-foreground text-xs uppercase tracking-wider"
      : cn(
          "border-border border-b",
          isCompact ? "text-xs" : "text-sm",
          selected && "bg-accent"
        ),
    isHoverable ? "rounded-lg" : "",
    className
  );
}

function getTableRowMotionProps({
  animate,
  exit,
  index,
  initial,
  isHeader,
  layout,
  motionEnabled,
  transition,
}: {
  animate: TableRowProps["animate"];
  exit: TableRowProps["exit"];
  index: number;
  initial: TableRowProps["initial"];
  isHeader: boolean;
  layout: TableRowProps["layout"];
  motionEnabled: boolean;
  transition: TableRowProps["transition"];
}) {
  const bodyMotionEnabled = motionEnabled && !isHeader;

  return {
    animate: animate ?? (bodyMotionEnabled ? { opacity: 1, y: 0 } : undefined),
    exit:
      exit ??
      (bodyMotionEnabled
        ? { opacity: 0, x: -16, transition: { duration: 0.2 } }
        : undefined),
    initial: initial ?? (bodyMotionEnabled ? { opacity: 0, y: 8 } : false),
    layout: motionEnabled ? (layout ?? !isHeader) : false,
    transition:
      transition ??
      (bodyMotionEnabled
        ? {
            delay: index * 0.02,
            type: "spring" as const,
            stiffness: 380,
            damping: 32,
            mass: 0.6,
          }
        : undefined),
  };
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    {
      animate,
      children,
      className,
      exit,
      hoverable,
      index = 0,
      initial,
      layout,
      selected = false,
      style,
      transition,
      variant = "body",
      whileHover,
      ...props
    },
    ref
  ) => {
    const { columnCount, columns, size } = useTableContext("TableRow");
    const motionEnabled = useTableMotionEnabled();
    const isHeader = variant === "header";
    const isHoverable = hoverable ?? false;
    const isCompact = size === "compact";
    const rowMotion = getTableRowMotionProps({
      animate,
      exit,
      index,
      initial,
      isHeader,
      layout,
      motionEnabled,
      transition,
    });

    useRowColumnCountWarning("TableRow", children, columnCount);

    return (
      <motion.tr
        {...rowMotion}
        className={getTableRowClassName({
          className,
          isCompact,
          isHeader,
          isHoverable,
          selected,
        })}
        data-hoverable={isHoverable ? "true" : "false"}
        data-selected={selected ? "true" : "false"}
        data-slot="table-row"
        data-state={selected ? "selected" : undefined}
        data-variant={variant}
        ref={ref}
        style={{ ...style, gridTemplateColumns: columns }}
        whileHover={
          isHoverable
            ? (whileHover ?? { backgroundColor: "var(--ic-muted)" })
            : undefined
        }
        {...props}
      >
        {children}
      </motion.tr>
    );
  }
);
TableRow.displayName = "TableRow";

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: TableAlign;
  sortDirection?: TableSortState;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      align = "left",
      "aria-sort": ariaSort,
      children,
      className,
      scope = "col",
      sortDirection,
      ...props
    },
    ref
  ) => {
    const { size } = useTableContext("TableHead");
    const isCompact = size === "compact";

    return (
      <th
        aria-sort={ariaSort ?? getAriaSortValue(sortDirection)}
        className={cn(
          "min-w-0 px-2 font-normal",
          isCompact ? "py-2" : "py-3",
          alignClassName(align),
          className
        )}
        data-align={align}
        data-slot="table-head"
        ref={ref}
        scope={scope}
        {...props}
      >
        {children}
      </th>
    );
  }
);
TableHead.displayName = "TableHead";

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: TableAlign;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ align = "left", className, ...props }, ref) => {
    const { size } = useTableContext("TableCell");
    const isCompact = size === "compact";

    return (
      <td
        className={cn(
          "min-w-0 px-2 align-middle",
          isCompact ? "py-2" : "py-4",
          alignClassName(align),
          className
        )}
        data-align={align}
        data-slot="table-cell"
        ref={ref}
        {...props}
      />
    );
  }
);
TableCell.displayName = "TableCell";

export interface TableSelectHeadProps
  extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, "children"> {
  "aria-label"?: string;
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const TableSelectHead = React.forwardRef<
  HTMLTableCellElement,
  TableSelectHeadProps
>(
  (
    {
      "aria-label": ariaLabel = "Select all rows",
      checked = false,
      className,
      indeterminate = false,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const { size } = useTableContext("TableSelectHead");
    const isCompact = size === "compact";

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <th
        className={cn(
          "w-10 min-w-0 px-2 text-center",
          isCompact ? "py-2" : "py-3",
          className
        )}
        data-slot="table-select-head"
        ref={ref}
        scope="col"
        {...props}
      >
        <input
          aria-label={ariaLabel}
          checked={checked}
          className={selectCheckboxClassName}
          onChange={(event) => onCheckedChange?.(event.target.checked)}
          ref={inputRef}
          type="checkbox"
        />
      </th>
    );
  }
);
TableSelectHead.displayName = "TableSelectHead";

export interface TableSelectCellProps
  extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, "children"> {
  "aria-label"?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const TableSelectCell = React.forwardRef<
  HTMLTableCellElement,
  TableSelectCellProps
>(
  (
    {
      "aria-label": ariaLabel = "Select row",
      checked = false,
      className,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const { size } = useTableContext("TableSelectCell");
    const isCompact = size === "compact";

    return (
      <td
        className={cn(
          "w-10 min-w-0 px-2 text-center align-middle",
          isCompact ? "py-2" : "py-4",
          className
        )}
        data-slot="table-select-cell"
        ref={ref}
        {...props}
      >
        <input
          aria-label={ariaLabel}
          checked={checked}
          className={selectCheckboxClassName}
          onChange={(event) => onCheckedChange?.(event.target.checked)}
          type="checkbox"
        />
      </td>
    );
  }
);
TableSelectCell.displayName = "TableSelectCell";

export interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {}

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, ...props }, ref) => (
  <caption
    className={cn("pt-6 text-muted-foreground text-xs", className)}
    data-slot="table-caption"
    ref={ref}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export interface TableEmptyProps
  extends Omit<React.ComponentPropsWithoutRef<typeof motion.tr>, "children"> {
  colSpan?: number;
  children?: React.ReactNode;
}

const TableEmpty = React.forwardRef<HTMLTableRowElement, TableEmptyProps>(
  (
    {
      animate,
      children,
      className,
      colSpan,
      initial,
      style,
      transition,
      ...props
    },
    ref
  ) => {
    const { columnCount, columns } = useTableContext("TableEmpty");
    const motionEnabled = useTableMotionEnabled();

    return (
      <motion.tr
        animate={animate ?? (motionEnabled ? { opacity: 1 } : undefined)}
        className={cn("grid border-border border-b", className)}
        data-slot="table-empty"
        initial={initial ?? (motionEnabled ? { opacity: 0 } : false)}
        ref={ref}
        style={{ ...style, gridTemplateColumns: columns }}
        transition={
          transition ?? (motionEnabled ? { duration: 0.2 } : undefined)
        }
        {...props}
      >
        <td
          className="col-span-full px-2 py-16 text-center text-muted-foreground text-sm"
          colSpan={colSpan ?? columnCount}
        >
          {children}
        </td>
      </motion.tr>
    );
  }
);
TableEmpty.displayName = "TableEmpty";

function TableLoadingBar({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-3.5 animate-pulse rounded-md bg-muted", className)}
    />
  );
}

export interface TableLoadingProps
  extends Omit<TableRowProps, "children" | "variant"> {
  rows?: number;
}

const TableLoading = ({ rows = 3, ...props }: TableLoadingProps) => {
  const { columnCount } = useTableContext("TableLoading");
  const safeRows = Math.max(0, rows);

  return Array.from({ length: safeRows }, (_, rowIndex) => (
    <TableRow index={rowIndex} key={`table-loading-${rowIndex}`} {...props}>
      {Array.from({ length: columnCount }, (_, columnIndex) => (
        <TableCell key={`table-loading-${rowIndex}-${columnIndex}`}>
          <TableLoadingBar
            className={cn(
              columnIndex === 0 && "w-36",
              columnIndex > 0 && columnIndex < columnCount - 1 && "w-24",
              columnIndex === columnCount - 1 && "ml-auto w-16"
            )}
          />
        </TableCell>
      ))}
    </TableRow>
  ));
};
TableLoading.displayName = "TableLoading";

export interface TableSortButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  align?: TableAlign;
  direction?: TableSortDirection;
}

const TableSortButton = React.forwardRef<
  HTMLButtonElement,
  TableSortButtonProps
>(
  (
    {
      active = false,
      align = "left",
      "aria-label": ariaLabel,
      children,
      className,
      direction = "asc",
      type = "button",
      ...props
    },
    ref
  ) => {
    const motionEnabled = useTableMotionEnabled();
    const resolvedAriaLabel =
      ariaLabel ?? getSortButtonLabel(children, active, direction);

    return (
      <button
        aria-label={resolvedAriaLabel}
        className={cn(
          componentThemeClassName,
          "flex min-h-10 w-full items-center gap-2 rounded-md px-3 py-2 text-left outline-none transition-colors transition-shadow focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          active
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
          sortButtonAlignClassName(align),
          className
        )}
        data-align={align}
        data-slot="table-sort-button"
        data-state={active ? "active" : "inactive"}
        ref={ref}
        type={type}
        {...props}
      >
        <span className={cn("truncate", active ? "font-medium" : undefined)}>
          {children}
        </span>
        <motion.span
          animate={
            motionEnabled
              ? {
                  opacity: active ? 1 : 0.45,
                  rotate: active && direction === "desc" ? 180 : 0,
                  scale: active ? 1 : 0.95,
                }
              : undefined
          }
          className={cn(
            "shrink-0",
            active ? "text-foreground" : "text-muted-foreground"
          )}
          transition={motionEnabled ? { duration: 0.2 } : undefined}
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
        </motion.span>
      </button>
    );
  }
);
TableSortButton.displayName = "TableSortButton";

export interface TablePaginationProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: TableAlign;
  onPageChange: (page: number) => void;
  page: number;
  pageCount: number;
  pageSize?: number;
  showPageInfo?: boolean;
  totalItems?: number;
}

const paginationAlignClassName: Record<TableAlign, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

const paginationButtonClassName =
  "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40";

const TablePagination = React.forwardRef<HTMLDivElement, TablePaginationProps>(
  (
    {
      align = "right",
      className,
      onPageChange,
      page,
      pageCount,
      pageSize,
      showPageInfo = true,
      totalItems,
      ...props
    },
    ref
  ) => {
    const safePageCount = Math.max(0, pageCount);
    const safePage =
      safePageCount === 0 ? 1 : Math.min(Math.max(page, 1), safePageCount);
    const canPrevious = safePageCount > 0 && safePage > 1;
    const canNext = safePageCount > 0 && safePage < safePageCount;
    const rangeStart =
      totalItems !== undefined && pageSize !== undefined
        ? totalItems === 0
          ? 0
          : Math.min((safePage - 1) * pageSize + 1, totalItems)
        : undefined;
    const rangeEnd =
      totalItems !== undefined && pageSize !== undefined
        ? totalItems === 0
          ? 0
          : Math.min(safePage * pageSize, totalItems)
        : undefined;

    return (
      <div
        className={cn(
          "flex items-center gap-3 px-2 py-3",
          paginationAlignClassName[align],
          className
        )}
        data-align={align}
        data-slot="table-pagination"
        ref={ref}
        {...props}
      >
        {showPageInfo ? (
          <p className="text-muted-foreground text-xs">
            {rangeStart !== undefined &&
            rangeEnd !== undefined &&
            totalItems !== undefined
              ? `${rangeStart}–${rangeEnd} of ${totalItems}`
              : safePageCount === 0
                ? "No pages"
                : `Page ${safePage} of ${safePageCount}`}
          </p>
        ) : null}
        <div className="flex items-center gap-1">
          <button
            aria-label="Previous page"
            className={paginationButtonClassName}
            disabled={!canPrevious}
            onClick={() => onPageChange(Math.max(1, safePage - 1))}
            type="button"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            aria-label="Next page"
            className={paginationButtonClassName}
            disabled={!canNext}
            onClick={() =>
              onPageChange(Math.min(safePageCount || 1, safePage + 1))
            }
            type="button"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    );
  }
);
TablePagination.displayName = "TablePagination";

export {
  Table,
  TableToolbar,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableSelectHead,
  TableSelectCell,
  TableCaption,
  TableEmpty,
  TableLoading,
  TableSortButton,
  TablePagination,
  Table as table,
};

export default Table;
