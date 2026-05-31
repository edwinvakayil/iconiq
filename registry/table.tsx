"use client";

import { ArrowUpDown } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

export const TABLE_DEFAULT_COLUMNS =
  "minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)";

export type TableAlign = "left" | "right";
export type TableRowVariant = "body" | "header";
export type TableSortDirection = "asc" | "desc";

type TableContextValue = {
  columns: string;
  columnCount: number;
};

const TableContext = React.createContext<TableContextValue | null>(null);

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

function getSortAriaValue(children: React.ReactNode) {
  if (!React.isValidElement(children)) {
    return undefined;
  }

  const childProps = children.props as {
    active?: boolean;
    direction?: TableSortDirection;
  };

  if (!childProps.active) {
    return undefined;
  }

  return childProps.direction === "desc" ? "descending" : "ascending";
}

export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement> {
  columns?: string;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ children, className, columns = TABLE_DEFAULT_COLUMNS, ...props }, ref) => {
    const columnCount = React.useMemo(
      () => Math.max(1, getColumnTokens(columns).length),
      [columns]
    );
    const contextValue = React.useMemo(
      () => ({ columns, columnCount }),
      [columnCount, columns]
    );

    return (
      <TableContext.Provider value={contextValue}>
        <div
          className={cn(componentThemeClassName, "w-full overflow-x-auto")}
          data-slot="table-wrapper"
        >
          <table
            className={cn(
              "mx-auto w-full max-w-4xl caption-bottom border-separate border-spacing-0",
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
  extends React.HTMLAttributes<HTMLDivElement> {}

const TableToolbar = React.forwardRef<HTMLDivElement, TableToolbarProps>(
  ({ className, ...props }, ref) => (
    <div
      className={cn("mb-6 flex items-center justify-between gap-3", className)}
      data-slot="table-toolbar"
      ref={ref}
      {...props}
    />
  )
);
TableToolbar.displayName = "TableToolbar";

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead
      className={className}
      data-slot="table-header"
      ref={ref}
      {...props}
    />
  )
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

export interface TableRowProps
  extends React.ComponentPropsWithoutRef<typeof motion.tr> {
  hoverable?: boolean;
  index?: number;
  variant?: TableRowVariant;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    {
      animate,
      className,
      exit,
      hoverable,
      index = 0,
      initial,
      layout,
      style,
      transition,
      variant = "body",
      whileHover,
      ...props
    },
    ref
  ) => {
    const { columns } = useTableContext("TableRow");
    const isHeader = variant === "header";
    const isHoverable = hoverable ?? false;

    return (
      <motion.tr
        animate={animate ?? (isHeader ? undefined : { opacity: 1, y: 0 })}
        className={cn(
          "grid items-center",
          isHeader
            ? "border-border border-y text-muted-foreground text-xs uppercase tracking-wider"
            : "border-border border-b text-sm",
          isHoverable ? "rounded-lg" : "",
          className
        )}
        data-hoverable={isHoverable ? "true" : "false"}
        data-slot="table-row"
        data-variant={variant}
        exit={
          exit ??
          (isHeader
            ? undefined
            : { opacity: 0, x: -16, transition: { duration: 0.2 } })
        }
        initial={initial ?? (isHeader ? false : { opacity: 0, y: 8 })}
        layout={layout ?? !isHeader}
        ref={ref}
        style={{ ...style, gridTemplateColumns: columns }}
        transition={
          transition ??
          (isHeader
            ? undefined
            : {
                delay: index * 0.02,
                type: "spring",
                stiffness: 380,
                damping: 32,
                mass: 0.6,
              })
        }
        whileHover={
          isHoverable
            ? (whileHover ?? { backgroundColor: "var(--ic-muted)" })
            : undefined
        }
        {...props}
      />
    );
  }
);
TableRow.displayName = "TableRow";

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: TableAlign;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ align = "left", children, className, scope = "col", ...props }, ref) => (
    <th
      aria-sort={props["aria-sort"] ?? getSortAriaValue(children)}
      className={cn(
        "min-w-0 px-2 py-3 font-normal",
        align === "right" ? "text-right" : "text-left",
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
  )
);
TableHead.displayName = "TableHead";

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: TableAlign;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ align = "left", className, ...props }, ref) => (
    <td
      className={cn(
        "min-w-0 px-2 py-4 align-middle",
        align === "right" ? "text-right" : "text-left",
        className
      )}
      data-align={align}
      data-slot="table-cell"
      ref={ref}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

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
    { animate, children, className, colSpan, initial, transition, ...props },
    ref
  ) => {
    const { columnCount } = useTableContext("TableEmpty");

    return (
      <motion.tr
        animate={animate ?? { opacity: 1 }}
        className="border-border border-b"
        data-slot="table-empty"
        initial={initial ?? { opacity: 0 }}
        ref={ref}
        transition={transition ?? { duration: 0.2 }}
        {...props}
      >
        <td
          className={cn(
            "px-2 py-16 text-center text-muted-foreground text-sm",
            className
          )}
          colSpan={colSpan ?? columnCount}
        >
          {children}
        </td>
      </motion.tr>
    );
  }
);
TableEmpty.displayName = "TableEmpty";

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
      children,
      className,
      direction = "asc",
      type = "button",
      ...props
    },
    ref
  ) => (
    <button
      className={cn(
        componentThemeClassName,
        "flex min-h-10 w-full items-center gap-2 rounded-md px-3 py-2 text-left outline-none transition-colors transition-shadow focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
        align === "right" ? "justify-end text-right" : "",
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
        animate={{
          opacity: active ? 1 : 0.45,
          rotate: active && direction === "desc" ? 180 : 0,
          scale: active ? 1 : 0.95,
        }}
        className={cn(
          "shrink-0",
          active ? "text-foreground" : "text-muted-foreground"
        )}
        transition={{ duration: 0.2 }}
      >
        <ArrowUpDown className="h-3.5 w-3.5" />
      </motion.span>
    </button>
  )
);
TableSortButton.displayName = "TableSortButton";

export {
  Table,
  TableToolbar,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableEmpty,
  TableSortButton,
  Table as table,
};
