"use client";

import { useState } from "react";

import { paginationApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/pagination";

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

const usageCode = `"use client";

import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

export function ResultsPagination() {
  const [page, setPage] = useState(4);

  return (
    <Pagination onChange={setPage} page={page} total={12}>
      <PaginationContent>
        <PaginationPrevious />
        {getVisiblePages(page, 12).map((item, index) =>
          item === "…" ? (
            <PaginationItem key={\`ellipsis-\${index}\`}>
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
    </Pagination>
  );
}`;

function PaginationPreview() {
  const [page, setPage] = useState(4);

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-5 px-2 py-4">
      <Pagination onChange={setPage} page={page} total={12}>
        <PaginationContent>
          <PaginationPrevious />
          {getVisiblePages(page, 12).map((item, index) =>
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
      </Pagination>
      <p className="text-center text-[13px] text-secondary leading-6">
        Move between pages to inspect the centered rail, the animated underline,
        and the way the ellipsis compresses the page range around the current
        selection.
      </p>
    </div>
  );
}

export default function PaginationPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Pagination" },
      ]}
      componentName="pagination"
      description="Animated pagination control with compact numbering, previous and next affordances, and a centered page rail that stays steady as the active range shifts."
      details={paginationApiDetails}
      preview={<PaginationPreview />}
      previewDescription="Use the live control to inspect the page-range compression, the underline movement, and the previous or next affordances."
      railNotes={[
        "Use a controlled page prop when surrounding content or URL state should stay in sync with the current selection.",
        "The component is best suited to compact result lists, archive navigation, and any interface that needs centered pagination without bulky chrome.",
      ]}
      title="Pagination"
      usageCode={usageCode}
      usageDescription="Compose the same paginator from small pieces while keeping the current centered rail and motion treatment intact."
    />
  );
}
