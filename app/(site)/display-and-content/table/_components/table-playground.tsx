"use client";

import { Search } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import {
  docsPlaygroundRowClassName,
  docsPlaygroundTextInputClassName,
} from "@/components/docs/playground/docs-playground-styles";
import { useDocStore } from "@/hooks/use-doc-store";
import { cn } from "@/lib/utils";
import {
  TABLE_DEFAULT_COLUMNS,
  type TableSize,
  type TableSortDirection,
} from "@/registry/table";

type TableModule = typeof import("@/registry/table");

type DemoRow = {
  id: string;
  name: string;
  role: string;
  status: "Active" | "Pending" | "Archived";
  amount: number;
};

type SortKey = keyof Pick<DemoRow, "name" | "role" | "status" | "amount">;

type TablePlaygroundState = {
  forceEmpty: boolean;
  hoverable: boolean;
  loading: boolean;
  page: number;
  pageSize: number;
  query: string;
  showPagination: boolean;
  showSelection: boolean;
  size: TableSize;
  stickyHeader: boolean;
};

const seedRows: DemoRow[] = [
  {
    id: "1",
    name: "Ada Lovelace",
    role: "Engineer",
    status: "Active",
    amount: 4200,
  },
  {
    id: "2",
    name: "Alan Turing",
    role: "Researcher",
    status: "Active",
    amount: 5800,
  },
  {
    id: "3",
    name: "Grace Hopper",
    role: "Architect",
    status: "Pending",
    amount: 3100,
  },
  {
    id: "4",
    name: "Linus Torvalds",
    role: "Maintainer",
    status: "Archived",
    amount: 2750,
  },
  {
    id: "5",
    name: "Margaret Hamilton",
    role: "Lead",
    status: "Active",
    amount: 6400,
  },
  {
    id: "6",
    name: "Katherine Johnson",
    role: "Analyst",
    status: "Active",
    amount: 5100,
  },
  {
    id: "7",
    name: "Tim Berners-Lee",
    role: "Architect",
    status: "Pending",
    amount: 3900,
  },
  {
    id: "8",
    name: "Radia Perlman",
    role: "Engineer",
    status: "Active",
    amount: 4700,
  },
];

const statusStyles: Record<DemoRow["status"], string> = {
  Active: "bg-foreground text-background",
  Pending: "bg-muted text-foreground",
  Archived: "border border-border bg-transparent text-muted-foreground",
};

const DEFAULT_STATE: TablePlaygroundState = {
  forceEmpty: false,
  hoverable: false,
  loading: false,
  page: 1,
  pageSize: 5,
  query: "",
  showPagination: false,
  showSelection: false,
  size: "default",
  stickyHeader: false,
};

const SIZE_OPTIONS: Array<{ label: string; value: TableSize }> = [
  { label: "Default", value: "default" },
  { label: "Compact", value: "compact" },
];

function DocsPlaygroundTextField({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <div className={docsPlaygroundRowClassName}>
      <span className="shrink-0 px-4 font-medium text-[#111113] text-[13px] dark:text-zinc-100">
        {label}
      </span>
      <input
        className={docsPlaygroundTextInputClassName}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
}

function getColumns(showSelection: boolean) {
  return showSelection
    ? `2.5rem ${TABLE_DEFAULT_COLUMNS}`
    : TABLE_DEFAULT_COLUMNS;
}

function getSortDirection(
  activeKey: SortKey,
  key: SortKey,
  direction: TableSortDirection
): "asc" | "desc" | "none" {
  if (activeKey !== key) {
    return "none";
  }

  return direction;
}

function generateTableCode(state: TablePlaygroundState, importPath: string) {
  const tableProps: string[] = [];

  if (state.size !== "default") {
    tableProps.push(`size="${state.size}"`);
  }

  if (state.stickyHeader) {
    tableProps.push("stickyHeader");
  }

  if (state.showSelection) {
    tableProps.push(
      'columns="2.5rem minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)"'
    );
  }

  const tablePropBlock =
    tableProps.length > 0 ? ` ${tableProps.join(" ")}` : "";

  return `"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableLoading,
  TablePagination,
  TableRow,
  TableSelectCell,
  TableSelectHead,
  TableSortButton,
  TableToolbar,
} from "${importPath}";

export function TablePreview() {
  return (
    <div className="w-full max-w-4xl">
      <TableToolbar tableId="team-table">
        {/* Search, filters, or bulk actions */}
      </TableToolbar>

      <Table id="team-table"${tablePropBlock}>
        <TableHeader>
          <TableRow variant="header">
            ${state.showSelection ? "<TableSelectHead />\n            " : ""}<TableHead sortDirection="asc">
              <TableSortButton active direction="asc">
                Name
              </TableSortButton>
            </TableHead>
            <TableHead sortDirection="none">
              <TableSortButton>Role</TableSortButton>
            </TableHead>
            <TableHead sortDirection="none">
              <TableSortButton>Status</TableSortButton>
            </TableHead>
            <TableHead align="right" sortDirection="none">
              <TableSortButton align="right">Amount</TableSortButton>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          ${state.loading ? "<TableLoading rows={5} />\n          " : ""}${
            state.forceEmpty
              ? "<TableEmpty>No results.</TableEmpty>"
              : `<TableRow${state.hoverable ? " hoverable" : ""}>
            <TableCell className="font-medium text-foreground">Ada Lovelace</TableCell>
            <TableCell className="text-muted-foreground">Engineer</TableCell>
            <TableCell>Active</TableCell>
            <TableCell align="right" className="tabular-nums text-foreground">$4,200</TableCell>
          </TableRow>`
          }
        </TableBody>
        ${state.showPagination ? "" : "<TableCaption>Showing team entries</TableCaption>\n        "}</Table>

      ${state.showPagination ? "<TablePagination page={1} pageCount={2} onPageChange={() => {}} totalItems={8} pageSize={5} />\n      " : ""}    </div>
    </div>
  );
}`;
}

function TablePlaygroundPreview({
  onChange,
  state,
  TableModule,
}: {
  onChange: (next: Partial<TablePlaygroundState>) => void;
  state: TablePlaygroundState;
  TableModule: TableModule;
}) {
  const {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableEmpty,
    TableHead,
    TableHeader,
    TableLoading,
    TablePagination,
    TableRow,
    TableSelectCell,
    TableSelectHead,
    TableSortButton,
    TableToolbar,
  } = TableModule;

  const [sort, setSort] = useState<{ key: SortKey; dir: TableSortDirection }>({
    key: "name",
    dir: "asc",
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const query = state.forceEmpty ? "__no_results__" : state.query;

    return seedRows.filter((row) =>
      (row.name + row.role + row.status)
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [state.forceEmpty, state.query]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];

      if (av < bv) {
        return sort.dir === "asc" ? -1 : 1;
      }

      if (av > bv) {
        return sort.dir === "asc" ? 1 : -1;
      }

      return 0;
    });
  }, [filtered, sort]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / state.pageSize));
  const currentPage = Math.min(state.page, pageCount);

  const visible = useMemo(() => {
    if (!state.showPagination) {
      return sorted;
    }

    const start = (currentPage - 1) * state.pageSize;
    return sorted.slice(start, start + state.pageSize);
  }, [currentPage, sorted, state.pageSize, state.showPagination]);

  const allVisibleSelected =
    visible.length > 0 && visible.every((row) => selectedIds.has(row.id));
  const someVisibleSelected =
    visible.some((row) => selectedIds.has(row.id)) && !allVisibleSelected;

  const toggleSort = (key: SortKey) => {
    setSort((current) => ({
      key,
      dir: current.key === key && current.dir === "asc" ? "desc" : "asc",
    }));
  };

  const toggleRow = (id: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  };

  const toggleAllVisible = (checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);

      for (const row of visible) {
        if (checked) {
          next.add(row.id);
        } else {
          next.delete(row.id);
        }
      }

      return next;
    });
  };

  return (
    <div className="flex min-h-[28rem] w-full justify-center px-4 py-8">
      <div className="w-full max-w-4xl self-start">
        <TableToolbar tableId="table-playground">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-10 w-full border-border border-b bg-transparent pr-3 pl-9 text-sm outline-none transition-colors focus:border-foreground"
              disabled={state.forceEmpty || state.loading}
              onChange={(event) =>
                onChange({ query: event.target.value, page: 1 })
              }
              placeholder="Search…"
              value={state.query}
            />
          </div>
        </TableToolbar>

        <div
          className={cn(state.stickyHeader && "max-h-[22rem] overflow-y-auto")}
        >
          <Table
            columns={getColumns(state.showSelection)}
            id="table-playground"
            size={state.size}
            stickyHeader={state.stickyHeader}
          >
            <TableHeader>
              <TableRow variant="header">
                {state.showSelection ? (
                  <TableSelectHead
                    checked={allVisibleSelected}
                    indeterminate={someVisibleSelected}
                    onCheckedChange={toggleAllVisible}
                  />
                ) : null}
                <TableHead
                  sortDirection={getSortDirection(sort.key, "name", sort.dir)}
                >
                  <TableSortButton
                    active={sort.key === "name"}
                    direction={sort.dir}
                    onClick={() => toggleSort("name")}
                  >
                    Name
                  </TableSortButton>
                </TableHead>
                <TableHead
                  sortDirection={getSortDirection(sort.key, "role", sort.dir)}
                >
                  <TableSortButton
                    active={sort.key === "role"}
                    direction={sort.dir}
                    onClick={() => toggleSort("role")}
                  >
                    Role
                  </TableSortButton>
                </TableHead>
                <TableHead
                  sortDirection={getSortDirection(sort.key, "status", sort.dir)}
                >
                  <TableSortButton
                    active={sort.key === "status"}
                    direction={sort.dir}
                    onClick={() => toggleSort("status")}
                  >
                    Status
                  </TableSortButton>
                </TableHead>
                <TableHead
                  align="right"
                  sortDirection={getSortDirection(sort.key, "amount", sort.dir)}
                >
                  <TableSortButton
                    active={sort.key === "amount"}
                    align="right"
                    direction={sort.dir}
                    onClick={() => toggleSort("amount")}
                  >
                    Amount
                  </TableSortButton>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="min-h-[240px]">
              {state.loading ? (
                <TableLoading rows={state.pageSize} />
              ) : (
                <>
                  {visible.map((row, index) => (
                    <TableRow
                      hoverable={state.hoverable}
                      index={index}
                      key={row.id}
                      selected={selectedIds.has(row.id)}
                    >
                      {state.showSelection ? (
                        <TableSelectCell
                          aria-label={`Select ${row.name}`}
                          checked={selectedIds.has(row.id)}
                          onCheckedChange={(checked) =>
                            toggleRow(row.id, checked)
                          }
                        />
                      ) : null}
                      <TableCell className="font-medium text-foreground">
                        {row.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.role}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs",
                            statusStyles[row.status]
                          )}
                        >
                          {row.status}
                        </span>
                      </TableCell>
                      <TableCell
                        align="right"
                        className="text-foreground tabular-nums"
                      >
                        ${row.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}

                  {visible.length === 0 ? (
                    <TableEmpty>No results.</TableEmpty>
                  ) : null}
                </>
              )}
            </TableBody>

            {state.showPagination ? null : (
              <TableCaption>
                {state.loading
                  ? "Loading entries…"
                  : `${visible.length} of ${seedRows.length} entries`}
              </TableCaption>
            )}
          </Table>

          {state.showPagination ? (
            <TablePagination
              onPageChange={(page) => onChange({ page })}
              page={currentPage}
              pageCount={pageCount}
              pageSize={state.pageSize}
              totalItems={sorted.length}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TablePlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<TablePlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: TablePlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Table"
    >
      <DocsPlaygroundSelectField
        label="Density"
        onChange={(size) => onChange({ size })}
        options={SIZE_OPTIONS}
        value={state.size}
      />
      <DocsPlaygroundToggleField
        checked={state.hoverable}
        label="Hoverable rows"
        onChange={(hoverable) => onChange({ hoverable })}
      />
      <DocsPlaygroundToggleField
        checked={state.stickyHeader}
        label="Sticky header"
        onChange={(stickyHeader) => onChange({ stickyHeader })}
      />
      <DocsPlaygroundToggleField
        checked={state.loading}
        label="Loading"
        onChange={(loading) => onChange({ loading })}
      />
      <DocsPlaygroundToggleField
        checked={state.forceEmpty}
        label="Empty state"
        onChange={(forceEmpty) => onChange({ forceEmpty })}
      />
      <DocsPlaygroundToggleField
        checked={state.showSelection}
        label="Row selection"
        onChange={(showSelection) => onChange({ showSelection })}
      />
      <DocsPlaygroundToggleField
        checked={state.showPagination}
        label="Pagination footer"
        onChange={(showPagination) => onChange({ showPagination, page: 1 })}
      />
      <DocsPlaygroundTextField
        label="Search"
        onChange={(query) => onChange({ query, page: 1 })}
        placeholder="Filter rows"
        value={state.query}
      />
    </DocsPlaygroundPanel>
  );
}

type TablePlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function TablePlaygroundProvider({
  TableModule,
  importPath,
  children,
}: {
  TableModule: TableModule;
  importPath: string;
  children: (props: TablePlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<TablePlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<TablePlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateTableCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <TablePlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: (
      <TablePlaygroundPreview
        onChange={updateState}
        state={state}
        TableModule={TableModule}
      />
    ),
    renderSettings,
  });
}
