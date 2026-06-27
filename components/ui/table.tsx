"use client";

import type { ComponentPropsWithoutRef, ElementRef } from "react";
import * as React from "react";
import RegistryTable, {
  TableBody as RegistryTableBody,
  TableCaption as RegistryTableCaption,
  TableCell as RegistryTableCell,
  TableEmpty as RegistryTableEmpty,
  TableFooter as RegistryTableFooter,
  TableHead as RegistryTableHead,
  TableHeader as RegistryTableHeader,
  TableLoading as RegistryTableLoading,
  TablePagination as RegistryTablePagination,
  TableRow as RegistryTableRow,
  TableSelectCell as RegistryTableSelectCell,
  TableSelectHead as RegistryTableSelectHead,
  TableSortButton as RegistryTableSortButton,
  TableToolbar as RegistryTableToolbar,
  TABLE_DEFAULT_COLUMNS as registryTableDefaultColumns,
} from "@/registry/table";

export type {
  TableAlign,
  TableBodyProps,
  TableCaptionProps,
  TableCellProps,
  TableEmptyProps,
  TableFooterProps,
  TableHeaderProps,
  TableHeadProps,
  TableLoadingProps,
  TablePaginationProps,
  TableProps,
  TableRowProps,
  TableRowVariant,
  TableSelectCellProps,
  TableSelectHeadProps,
  TableSize,
  TableSortButtonProps,
  TableSortDirection,
  TableSortState,
  TableToolbarProps,
} from "@/registry/table";

type TableProps = import("@/registry/table").TableProps;

const TABLE_DEFAULT_COLUMNS = `${registryTableDefaultColumns}`;

const Table = React.forwardRef<ElementRef<typeof RegistryTable>, TableProps>(
  (props, ref) => <RegistryTable {...props} ref={ref} />
);
Table.displayName = "Table";

const TableToolbar = React.forwardRef<
  ElementRef<typeof RegistryTableToolbar>,
  ComponentPropsWithoutRef<typeof RegistryTableToolbar>
>((props, ref) => <RegistryTableToolbar {...props} ref={ref} />);
TableToolbar.displayName = "TableToolbar";

const TableHeader = React.forwardRef<
  ElementRef<typeof RegistryTableHeader>,
  ComponentPropsWithoutRef<typeof RegistryTableHeader>
>((props, ref) => <RegistryTableHeader {...props} ref={ref} />);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  ElementRef<typeof RegistryTableBody>,
  ComponentPropsWithoutRef<typeof RegistryTableBody>
>((props, ref) => <RegistryTableBody {...props} ref={ref} />);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  ElementRef<typeof RegistryTableFooter>,
  ComponentPropsWithoutRef<typeof RegistryTableFooter>
>((props, ref) => <RegistryTableFooter {...props} ref={ref} />);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  ElementRef<typeof RegistryTableRow>,
  ComponentPropsWithoutRef<typeof RegistryTableRow>
>((props, ref) => <RegistryTableRow {...props} ref={ref} />);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  ElementRef<typeof RegistryTableHead>,
  ComponentPropsWithoutRef<typeof RegistryTableHead>
>((props, ref) => <RegistryTableHead {...props} ref={ref} />);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  ElementRef<typeof RegistryTableCell>,
  ComponentPropsWithoutRef<typeof RegistryTableCell>
>((props, ref) => <RegistryTableCell {...props} ref={ref} />);
TableCell.displayName = "TableCell";

const TableSelectHead = React.forwardRef<
  ElementRef<typeof RegistryTableSelectHead>,
  ComponentPropsWithoutRef<typeof RegistryTableSelectHead>
>((props, ref) => <RegistryTableSelectHead {...props} ref={ref} />);
TableSelectHead.displayName = "TableSelectHead";

const TableSelectCell = React.forwardRef<
  ElementRef<typeof RegistryTableSelectCell>,
  ComponentPropsWithoutRef<typeof RegistryTableSelectCell>
>((props, ref) => <RegistryTableSelectCell {...props} ref={ref} />);
TableSelectCell.displayName = "TableSelectCell";

const TableCaption = React.forwardRef<
  ElementRef<typeof RegistryTableCaption>,
  ComponentPropsWithoutRef<typeof RegistryTableCaption>
>((props, ref) => <RegistryTableCaption {...props} ref={ref} />);
TableCaption.displayName = "TableCaption";

const TableEmpty = React.forwardRef<
  ElementRef<typeof RegistryTableEmpty>,
  ComponentPropsWithoutRef<typeof RegistryTableEmpty>
>((props, ref) => <RegistryTableEmpty {...props} ref={ref} />);
TableEmpty.displayName = "TableEmpty";

function TableLoading(
  props: ComponentPropsWithoutRef<typeof RegistryTableLoading>
) {
  return <RegistryTableLoading {...props} />;
}
TableLoading.displayName = "TableLoading";

const TableSortButton = React.forwardRef<
  ElementRef<typeof RegistryTableSortButton>,
  ComponentPropsWithoutRef<typeof RegistryTableSortButton>
>((props, ref) => <RegistryTableSortButton {...props} ref={ref} />);
TableSortButton.displayName = "TableSortButton";

const TablePagination = React.forwardRef<
  ElementRef<typeof RegistryTablePagination>,
  ComponentPropsWithoutRef<typeof RegistryTablePagination>
>((props, ref) => <RegistryTablePagination {...props} ref={ref} />);
TablePagination.displayName = "TablePagination";

const table = Table;

export {
  TABLE_DEFAULT_COLUMNS,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableLoading,
  TablePagination,
  TableRow,
  TableSelectCell,
  TableSelectHead,
  TableSortButton,
  TableToolbar,
  table,
};
export default Table;
