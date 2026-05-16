"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { tableApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { usageToV0Page } from "@/lib/component-v0-pages";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
  TableSortButton,
  TableToolbar,
} from "@/registry/table";

type DemoRow = {
  id: string;
  name: string;
  role: string;
  status: "Active" | "Pending" | "Archived";
  amount: number;
};

type SortKey = keyof Pick<DemoRow, "name" | "role" | "status" | "amount">;

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
];

const statusStyles: Record<DemoRow["status"], string> = {
  Active: "bg-foreground text-background",
  Pending: "bg-muted text-foreground",
  Archived: "border border-border bg-transparent text-muted-foreground",
};

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
  { id: "4", name: "Linus Torvalds", role: "Maintainer", status: "Archived", amount: 2750 },
  { id: "5", name: "Margaret Hamilton", role: "Lead", status: "Active", amount: 6400 },
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
      <TableToolbar>
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="h-10 w-full border-b border-border bg-transparent pl-9 pr-3 text-sm outline-none transition-colors focus:border-foreground"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search…"
            value={query}
          />
        </div>
      </TableToolbar>

      <Table>
        <TableHeader>
          <TableRow variant="header">
            <TableHead>
              <TableSortButton
                active={sort.key === "name"}
                direction={sort.dir}
                onClick={() => toggleSort("name")}
              >
                Name
              </TableSortButton>
            </TableHead>
            <TableHead>
              <TableSortButton
                active={sort.key === "role"}
                direction={sort.dir}
                onClick={() => toggleSort("role")}
              >
                Role
              </TableSortButton>
            </TableHead>
            <TableHead>
              <TableSortButton
                active={sort.key === "status"}
                direction={sort.dir}
                onClick={() => toggleSort("status")}
              >
                Status
              </TableSortButton>
            </TableHead>
            <TableHead align="right">
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

        <TableBody className="min-h-[288px]">
          {visible.map((row, index) => (
            <TableRow index={index} key={row.id}>
              <TableCell className="font-medium text-foreground">
                {row.name}
              </TableCell>
              <TableCell className="text-muted-foreground">{row.role}</TableCell>
              <TableCell>
                <span
                  className={\`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium \${statusStyles[row.status]}\`}
                >
                  {row.status}
                </span>
              </TableCell>
              <TableCell align="right" className="tabular-nums text-foreground">
                \${row.amount.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}

          {visible.length === 0 ? <TableEmpty>No results.</TableEmpty> : null}
        </TableBody>

        <TableCaption>
          {visible.length} of {rows.length} entries
        </TableCaption>
      </Table>
    </div>
  );
}`;

function TablePreview() {
  const rows = seedRows;
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "name",
    dir: "asc",
  });

  const visible = useMemo(() => {
    const filtered = rows.filter((row) =>
      (row.name + row.role + row.status)
        .toLowerCase()
        .includes(query.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [query, rows, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((current) => ({
      key,
      dir: current.key === key && current.dir === "asc" ? "desc" : "asc",
    }));

  return (
    <div className="flex min-h-[420px] w-full justify-center px-4 py-8">
      <div className="w-full max-w-4xl self-start">
        <TableToolbar>
          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-10 w-full border-border border-b bg-transparent pr-3 pl-9 text-sm outline-none transition-colors focus:border-foreground"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search…"
              value={query}
            />
          </div>
        </TableToolbar>

        <Table>
          <TableHeader>
            <TableRow variant="header">
              <TableHead>
                <TableSortButton
                  active={sort.key === "name"}
                  direction={sort.dir}
                  onClick={() => toggleSort("name")}
                >
                  Name
                </TableSortButton>
              </TableHead>
              <TableHead>
                <TableSortButton
                  active={sort.key === "role"}
                  direction={sort.dir}
                  onClick={() => toggleSort("role")}
                >
                  Role
                </TableSortButton>
              </TableHead>
              <TableHead>
                <TableSortButton
                  active={sort.key === "status"}
                  direction={sort.dir}
                  onClick={() => toggleSort("status")}
                >
                  Status
                </TableSortButton>
              </TableHead>
              <TableHead align="right">
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

          <TableBody className="min-h-[288px]">
            {visible.map((row, index) => (
              <TableRow index={index} key={row.id}>
                <TableCell className="font-medium text-foreground">
                  {row.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {row.role}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${statusStyles[row.status]}`}
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

            {visible.length === 0 ? <TableEmpty>No results.</TableEmpty> : null}
          </TableBody>

          <TableCaption>
            {visible.length} of {rows.length} entries
          </TableCaption>
        </Table>
      </div>
    </div>
  );
}

export default function TablePage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Table" },
      ]}
      componentName="table"
      description="Composable table primitives with animated sort helpers, layout-preserving rows, and the same minimal data-grid styling as the original demo."
      details={tableApiDetails}
      preview={<TablePreview />}
      previewDescription="Search and sort rows in the live playground while the installed component stays reusable and data-agnostic."
      title="Table"
      usageCode={usageCode}
      usageDescription="Use the canonical `Table` primitives for production data, then add your own filtering, sorting, and row actions around them in app code."
      v0PageCode={usageToV0Page(usageCode)}
    />
  );
}
