import { cn } from "@/lib/utils";

const gridDotSize = "10px";

function gridAxisFraction(
  index: number,
  count: number,
  weights?: number[]
): number {
  const segments =
    weights?.length === count
      ? weights
      : Array.from({ length: count }, () => 1);
  const total = segments.reduce((sum, weight) => sum + weight, 0);
  const leading = segments
    .slice(0, index)
    .reduce((sum, weight) => sum + weight, 0);
  return leading / total;
}

function gridAxisPosition(
  index: number,
  count: number,
  weights?: number[]
): string {
  const fraction = gridAxisFraction(index, count, weights);
  return `calc(${gridDotSize} / 2 + ${fraction} * (100% - ${gridDotSize}))`;
}

export function GridCornerDots({
  columns,
  rows,
  columnWeights,
  rowWeights,
  className,
}: {
  columns: number;
  rows: number;
  columnWeights?: number[];
  rowWeights?: number[];
  className?: string;
}) {
  const dots = Array.from(
    { length: (rows + 1) * (columns + 1) },
    (_, index) => ({
      col: index % (columns + 1),
      row: Math.floor(index / (columns + 1)),
      key: index,
    })
  );

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute z-0", className)}
      data-grid-dots
      style={{ inset: `calc(-1 * ${gridDotSize} / 2)` }}
    >
      {dots.map(({ col, row, key }) => (
        <span
          className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-background md:size-3"
          key={key}
          style={{
            left: gridAxisPosition(col, columns, columnWeights),
            top: gridAxisPosition(row, rows, rowWeights),
          }}
        />
      ))}
    </div>
  );
}
