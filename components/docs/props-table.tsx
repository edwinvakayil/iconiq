import { PropInformation } from "@/components/docs/prop-information";
import { cn } from "@/lib/utils";

interface PropsTableItem {
  name: string;
  nameDetails?: React.ReactNode;
  type: string;
  typeDetails?: React.ReactNode;
  default?: string;
  defaultDetails?: React.ReactNode;
}

interface PropsTableProps {
  data: PropsTableItem[];
}

export function PropsTable({ data }: PropsTableProps) {
  if (data.length === 0) {
    return (
      <div className="mt-6 flex h-[42px] w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30">
        <div className="text-center text-muted-foreground text-sm">
          No Additional Props
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full overflow-x-scroll rounded-lg border border-border">
      <table className="not-prose w-full">
        <thead className="border-border border-b bg-muted/30 text-left">
          <tr>
            <th className="px-4 py-3 font-medium text-muted-foreground text-sm">
              Prop
            </th>
            <th className="px-4 py-3 font-medium text-muted-foreground text-sm">
              Type
            </th>
            <th className="px-4 py-3 font-medium text-muted-foreground text-sm">
              Default
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              className={cn(
                "text-left",
                index !== data.length - 1 && "border-border border-b"
              )}
              key={item.name}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <code className="rounded-md bg-muted/75 px-2 py-0.5 font-mono text-neutral-600 text-sm dark:bg-muted/50 dark:text-neutral-300">
                    {item.name}
                  </code>
                  {item.nameDetails ? (
                    <PropInformation content={item.nameDetails} />
                  ) : null}
                </div>
              </td>
              <td className="px-4 py-3">
                {item.type ? (
                  <div className="flex items-center gap-1">
                    <code className="rounded-md bg-muted/75 px-2 py-0.5 font-mono text-neutral-600 text-sm dark:bg-muted/50 dark:text-neutral-300">
                      {item.type}
                    </code>
                    {item.typeDetails ? (
                      <PropInformation content={item.typeDetails} />
                    ) : null}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="px-4 py-3">
                {item.default ? (
                  <div className="flex items-center gap-1">
                    <code className="rounded-md bg-muted/75 px-2 py-0.5 font-mono text-neutral-600 text-sm dark:bg-muted/50 dark:text-neutral-300">
                      {item.default}
                    </code>
                    {item.defaultDetails ? (
                      <PropInformation content={item.defaultDetails} />
                    ) : null}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
