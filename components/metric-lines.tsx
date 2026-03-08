export interface MetricLine {
  position: string;
  label: string;
}

interface MetricLinesProps {
  lines: MetricLine[];
}

export function MetricLines({ lines }: MetricLinesProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {lines.map((line) => (
        <div
          className="absolute right-0 left-0 flex items-center gap-2"
          key={line.label}
          style={{ top: line.position }}
        >
          <div className="flex-1 border-neutral-200 border-t border-dashed dark:border-neutral-700" />
          <span className="shrink-0 font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
            {line.label}
          </span>
        </div>
      ))}
    </div>
  );
}
