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
        <thead className="bg-neutral-50 font-medium text-[13px] text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
          <tr>
            <th className="px-4 py-2 font-medium">Prop</th>
            <th className="px-4 py-2 font-medium">Type</th>
            <th className="px-4 py-2 font-medium">Default</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {rows.map((row) => (
            <tr className="align-top" key={row.name}>
              <td className="px-4 py-2 font-mono text-neutral-900 text-xs dark:text-neutral-100">
                {row.name}
              </td>
              <td className="px-4 py-2 font-mono text-neutral-700 text-xs dark:text-neutral-300">
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
