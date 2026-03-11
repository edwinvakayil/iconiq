type PropRow = {
  name: string;
  type: string;
  defaultValue?: string;
};

type PropsTableProps = {
  rows: PropRow[];
};

export function PropsTable({ rows }: PropsTableProps) {
  if (!rows.length) return null;

  return (
    <div className="mt-4 overflow-hidden rounded-sm border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-neutral-50 text-[13px] font-medium text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
          <tr>
            <th className="px-4 py-2 font-medium">Prop</th>
            <th className="px-4 py-2 font-medium">Type</th>
            <th className="px-4 py-2 font-medium">Default</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {rows.map((row) => (
            <tr key={row.name} className="align-top">
              <td className="px-4 py-2 font-mono text-xs text-neutral-900 dark:text-neutral-100">
                {row.name}
              </td>
              <td className="px-4 py-2 font-mono text-xs text-neutral-700 dark:text-neutral-300">
                {row.type}
              </td>
              <td className="px-4 py-2">
                <span className="inline-flex min-h-[22px] items-center rounded-sm bg-neutral-100 px-2 font-mono text-[11px] text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                  {row.defaultValue ?? "-"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

