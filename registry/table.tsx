"use client";

import { ArrowUpDown } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export const TABLE_DEFAULT_COLUMNS =
  "minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)";

export type TableAlign = "left" | "right";
export type TableRowVariant = "body" | "header";
export type TableSortDirection = "asc" | "desc";

type TableContextValue = {
  columns: string;
};

const TableContext = React.createContext<TableContextValue | null>(null);

function useTableContext(componentName: string) {
  const context = React.useContext(TableContext);

  if (!context) {
    throw new Error(`${componentName} must be used within Table.`);
  }

  return context;
}

export interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: string;
}

const Table = React.forwardRef<HTMLDivElement, TableProps>(
  (
    {
      children,
      className,
      columns = TABLE_DEFAULT_COLUMNS,
      role = "table",
      ...props
    },
    ref
  ) => {
    const contextValue = React.useMemo(() => ({ columns }), [columns]);

    return (
      <TableContext.Provider value={contextValue}>
        <div
          className={cn("mx-auto w-full max-w-4xl", className)}
          data-slot="table"
          ref={ref}
          role={role}
          {...props}
        >
          {children}
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
  extends React.HTMLAttributes<HTMLDivElement> {}

const TableHeader = React.forwardRef<HTMLDivElement, TableHeaderProps>(
  ({ className, role = "rowgroup", ...props }, ref) => (
    <div
      className={cn("border-border border-t", className)}
      data-slot="table-header"
      ref={ref}
      role={role}
      {...props}
    />
  )
);
TableHeader.displayName = "TableHeader";

export interface TableBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const TableBody = React.forwardRef<HTMLDivElement, TableBodyProps>(
  ({ children, className, role = "rowgroup", ...props }, ref) => (
    <div
      className={className}
      data-slot="table-body"
      ref={ref}
      role={role}
      {...props}
    >
      <LayoutGroup>
        <AnimatePresence initial={false} mode="popLayout">
          {children}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  )
);
TableBody.displayName = "TableBody";

export interface TableRowProps
  extends React.ComponentPropsWithoutRef<typeof motion.div> {
  hoverable?: boolean;
  index?: number;
  variant?: TableRowVariant;
}

const TableRow = React.forwardRef<HTMLDivElement, TableRowProps>(
  (
    {
      animate,
      className,
      exit,
      hoverable,
      index = 0,
      initial,
      layout,
      role = "row",
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

    return (
      <motion.div
        animate={animate ?? (isHeader ? undefined : { opacity: 1, y: 0 })}
        className={cn(
          "grid items-center",
          isHeader
            ? "border-border border-b px-2 py-3 text-muted-foreground text-xs uppercase tracking-wider"
            : "group rounded-sm border-border border-b px-2 py-4 text-sm",
          className
        )}
        data-hoverable={(hoverable ?? !isHeader) ? "true" : "false"}
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
        role={role}
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
          (hoverable ?? !isHeader)
            ? (whileHover ?? { backgroundColor: "var(--muted)" })
            : undefined
        }
        {...props}
      />
    );
  }
);
TableRow.displayName = "TableRow";

export interface TableHeadProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: TableAlign;
}

const TableHead = React.forwardRef<HTMLDivElement, TableHeadProps>(
  ({ align = "left", className, role = "columnheader", ...props }, ref) => (
    <div
      className={cn(
        "min-w-0",
        align === "right" ? "flex justify-end text-right" : "text-left",
        className
      )}
      data-align={align}
      data-slot="table-head"
      ref={ref}
      role={role}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

export interface TableCellProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: TableAlign;
}

const TableCell = React.forwardRef<HTMLDivElement, TableCellProps>(
  ({ align = "left", className, role = "cell", ...props }, ref) => (
    <div
      className={cn(
        "min-w-0",
        align === "right" ? "text-right" : "text-left",
        className
      )}
      data-align={align}
      data-slot="table-cell"
      ref={ref}
      role={role}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

export interface TableCaptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const TableCaption = React.forwardRef<HTMLParagraphElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <p
      className={cn("mt-6 text-muted-foreground text-xs", className)}
      data-slot="table-caption"
      ref={ref}
      {...props}
    />
  )
);
TableCaption.displayName = "TableCaption";

export interface TableEmptyProps
  extends React.ComponentPropsWithoutRef<typeof motion.div> {}

const TableEmpty = React.forwardRef<HTMLDivElement, TableEmptyProps>(
  ({ animate, className, initial, transition, ...props }, ref) => (
    <motion.div
      animate={animate ?? { opacity: 1 }}
      className={cn(
        "py-16 text-center text-muted-foreground text-sm",
        className
      )}
      data-slot="table-empty"
      initial={initial ?? { opacity: 0 }}
      ref={ref}
      transition={transition ?? { duration: 0.2 }}
      {...props}
    />
  )
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
        "flex items-center gap-1.5 transition-colors hover:text-foreground",
        align === "right" ? "justify-end" : "",
        className
      )}
      data-align={align}
      data-slot="table-sort-button"
      data-state={active ? "active" : "inactive"}
      ref={ref}
      type={type}
      {...props}
    >
      {children}
      <motion.span
        animate={{
          opacity: active ? 1 : 0.3,
          rotate: active && direction === "desc" ? 180 : 0,
        }}
        transition={{ duration: 0.25 }}
      >
        <ArrowUpDown className="h-3 w-3" />
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
