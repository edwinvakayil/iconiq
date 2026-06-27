"use client";

import { useMemo } from "react";
import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { TablePlaygroundProvider } from "@/app/(site)/display-and-content/table/_components/table-playground";
import { tableApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as TableModule from "@/registry/table";

const usageCode = `"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
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
  TableSortButton,
  TableToolbar,
} from "@/components/ui/table";

type Row = {
  id: string;
  name: string;
  role: string;
  status: "Active" | "Pending" | "Archived";
  amount: number;
};

type SortKey = keyof Pick<Row, "name" | "role" | "status" | "amount">;

const rows: Row[] = [
  { id: "1", name: "Ada Lovelace", role: "Engineer", status: "Active", amount: 4200 },
  { id: "2", name: "Alan Turing", role: "Researcher", status: "Active", amount: 5800 },
  { id: "3", name: "Grace Hopper", role: "Architect", status: "Pending", amount: 3100 },
];

const statusStyles: Record<Row["status"], string> = {
  Active: "bg-foreground text-background",
  Pending: "bg-muted text-foreground",
  Archived: "border border-border bg-transparent text-muted-foreground",
};

export function TablePreview() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "name",
    dir: "asc",
  });
  const [loading, setLoading] = useState(false);

  const visible = useMemo(() => {
    const filtered = rows.filter((row) =>
      (row.name + row.role + row.status).toLowerCase().includes(query.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [query, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((current) => ({
      key,
      dir: current.key === key && current.dir === "asc" ? "desc" : "asc",
    }));

  return (
    <div className="w-full max-w-4xl">
      <TableToolbar tableId="team-table">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="h-10 w-full border-b border-border bg-transparent pl-9 pr-3 text-sm outline-none transition-colors focus:border-foreground"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search…"
            value={query}
          />
        </div>
        <button
          className="text-muted-foreground text-sm transition-colors hover:text-foreground"
          onClick={() => setLoading((current) => !current)}
          type="button"
        >
          {loading ? "Show data" : "Simulate loading"}
        </button>
      </TableToolbar>

      <Table id="team-table">
        <TableHeader>
          <TableRow variant="header">
            <TableHead sortDirection={sort.key === "name" ? sort.dir : "none"}>
              <TableSortButton
                active={sort.key === "name"}
                direction={sort.dir}
                onClick={() => toggleSort("name")}
              >
                Name
              </TableSortButton>
            </TableHead>
            <TableHead sortDirection={sort.key === "role" ? sort.dir : "none"}>
              <TableSortButton
                active={sort.key === "role"}
                direction={sort.dir}
                onClick={() => toggleSort("role")}
              >
                Role
              </TableSortButton>
            </TableHead>
            <TableHead sortDirection={sort.key === "status" ? sort.dir : "none"}>
              <TableSortButton
                active={sort.key === "status"}
                direction={sort.dir}
                onClick={() => toggleSort("status")}
              >
                Status
              </TableSortButton>
            </TableHead>
            <TableHead align="right" sortDirection={sort.key === "amount" ? sort.dir : "none"}>
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
          {loading ? (
            <TableLoading rows={3} />
          ) : (
            <>
              {visible.map((row, index) => (
                <TableRow hoverable index={index} key={row.id}>
                  <TableCell className="font-medium text-foreground">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.role}</TableCell>
                  <TableCell>
                    <span className={\`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium \${statusStyles[row.status]}\`}>
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell align="right" className="tabular-nums text-foreground">
                    \${row.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}

              {visible.length === 0 ? <TableEmpty>No results.</TableEmpty> : null}
            </>
          )}
        </TableBody>
      </Table>

      <TablePagination
        onPageChange={() => {}}
        page={1}
        pageCount={1}
        pageSize={10}
        totalItems={visible.length}
      />
    </div>
  );
}`;

const tableExamples: VariantItem[] = [
  {
    title: "Loading rows",
    code: `"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableLoading,
  TableRow,
} from "@/components/ui/table";

export function TableLoadingExample() {
  return (
    <Table aria-busy="true" aria-label="Loading team table">
      <TableHeader>
        <TableRow variant="header">
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead align="right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableLoading rows={4} />
      </TableBody>
    </Table>
  );
}`,
  },
  {
    title: "Empty state",
    code: `"use client";

import {
  Table,
  TableBody,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableEmptyExample() {
  return (
    <Table>
      <TableHeader>
        <TableRow variant="header">
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmpty>No matching entries.</TableEmpty>
      </TableBody>
    </Table>
  );
}`,
  },
  {
    title: "Compact + sticky header",
    code: `"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const rows = [
  { name: "Ada Lovelace", role: "Engineer", region: "EU" },
  { name: "Alan Turing", role: "Researcher", region: "UK" },
  { name: "Grace Hopper", role: "Architect", region: "US" },
  { name: "Margaret Hamilton", role: "Lead", region: "US" },
  { name: "Radia Perlman", role: "Engineer", region: "US" },
];

export function TableCompactStickyExample() {
  return (
    <div className="max-h-56 overflow-y-auto">
      <Table size="compact" stickyHeader>
        <TableHeader>
          <TableRow variant="header">
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead align="center">Region</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow hoverable index={index} key={row.name}>
              <TableCell className="font-medium text-foreground">{row.name}</TableCell>
              <TableCell className="text-muted-foreground">{row.role}</TableCell>
              <TableCell align="center">{row.region}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}`,
  },
  {
    title: "Selection column",
    code: `"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectCell,
  TableSelectHead,
} from "@/components/ui/table";

const rows = [
  { id: "1", name: "Ada Lovelace" },
  { id: "2", name: "Alan Turing" },
];

export function TableSelectionExample() {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  return (
    <Table columns="2.5rem minmax(0,1.4fr) minmax(0,1fr)">
      <TableHeader>
        <TableRow variant="header">
          <TableSelectHead
            checked={selected.size === rows.length}
            indeterminate={selected.size > 0 && selected.size < rows.length}
            onCheckedChange={(checked) =>
              setSelected(checked ? new Set(rows.map((row) => row.id)) : new Set())
            }
          />
          <TableHead>Name</TableHead>
          <TableHead align="right">ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow
            index={index}
            key={row.id}
            selected={selected.has(row.id)}
          >
            <TableSelectCell
              aria-label={\`Select \${row.name}\`}
              checked={selected.has(row.id)}
              onCheckedChange={(checked) =>
                setSelected((current) => {
                  const next = new Set(current);
                  if (checked) next.add(row.id);
                  else next.delete(row.id);
                  return next;
                })
              }
            />
            <TableCell className="font-medium text-foreground">{row.name}</TableCell>
            <TableCell align="right" className="text-muted-foreground">{row.id}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}`,
  },
];

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Display & Content" },
  { label: "Table" },
];

function getDetails(): DetailItem[] {
  return tableApiDetails.map((item) => {
    if (item.id !== "registry") {
      return item;
    }

    return {
      ...item,
      notes: [
        "Dependencies: motion, lucide-react.",
        "This page lives in the Components section, but the install itself is the shared Iconiq table primitive rather than a Radix or Base UI table wrapper.",
        "The provider switch is shown for section consistency, but both Radix UI and Base UI options are disabled because there is only one table install on this page.",
        "The generated registry file is /r/table.json.",
      ],
      registryPath: "table.json",
    };
  });
}

export default function TablePage() {
  const details = useMemo(() => getDetails(), []);

  return (
    <TablePlaygroundProvider
      importPath="@/components/ui/table"
      TableModule={TableModule}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName="table"
          description="Structured data table for rows, columns, and comparisons."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/display-and-content/table/page.tsx`}
          examples={tableExamples}
          headerActions={<SharedPrimitiveProviderSwitch />}
          itemSlug="table"
          pageUrl="/display-and-content/table"
          preview={preview}
          previewClassName="min-h-[28rem] overflow-visible"
          previewDescription="Use the playground to toggle density, hover, sticky headers, loading and empty states, row selection, and pagination while keeping sorting and filtering in app code."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Table"
          railNotes={[
            "Pass `sortDirection` to `TableHead` for explicit `aria-sort` instead of inferring it from children.",
            "Set `hoverable` on body rows when the row is clickable or selectable.",
            'Use `selected` on `TableRow` for active selection styling via `data-state="selected"`.',
            "Add a selection column with `TableSelectHead` and `TableSelectCell`, then widen `columns` with a leading `2.5rem` track.",
            "Wrap long tables in a scroll container and enable `stickyHeader` to keep labels visible.",
            "Render `TableLoading` inside `TableBody` while async data resolves.",
          ]}
          title="Table"
          usageCode={usageCode}
          usageDescription="Use the canonical `Table` primitives for production data, then add your own filtering, sorting, and row actions around them in app code."
          v0PageCode={usageCode}
        />
      )}
    </TablePlaygroundProvider>
  );
}
