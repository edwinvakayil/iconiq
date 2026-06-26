import { cn } from "@/lib/utils";

export interface DocsPropItem {
  id: string;
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface DocsPropGroup {
  id: string;
  title: string;
  props: DocsPropItem[];
}

interface DocsPropsTableProps {
  groups: DocsPropGroup[];
  className?: string;
}

function PropDescription({ prop }: { prop: DocsPropItem }) {
  const hasMeta = (prop.type && prop.type !== "—") || Boolean(prop.default);

  return (
    <div className="space-y-1">
      <p className="text-[15px] text-zinc-800 leading-6 dark:text-zinc-200">
        {prop.description}
      </p>
      {hasMeta ? (
        <p className="text-[13px] text-zinc-400 leading-5 dark:text-zinc-500">
          {prop.type && prop.type !== "—" ? (
            <span>
              Type{" "}
              <code className="font-mono text-zinc-500 dark:text-zinc-400">
                {prop.type}
              </code>
            </span>
          ) : null}
          {prop.type && prop.type !== "—" && prop.default ? (
            <span className="px-1.5">·</span>
          ) : null}
          {prop.default ? (
            <span>
              Default{" "}
              <code className="font-mono text-zinc-500 dark:text-zinc-400">
                {prop.default}
              </code>
            </span>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}

function PropsTableHeader() {
  return (
    <div className="grid grid-cols-[minmax(0,11rem)_minmax(0,1fr)] items-center gap-x-10 border-zinc-200 border-b py-3 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:gap-x-14 dark:border-zinc-800">
      <div className="font-medium text-[11px] text-zinc-400 uppercase tracking-[0.1em] dark:text-zinc-500">
        Props
      </div>
      <div className="font-medium text-[11px] text-zinc-400 uppercase tracking-[0.1em] dark:text-zinc-500">
        Description
      </div>
    </div>
  );
}

function PropGroupHeader({
  showDivider,
  title,
}: {
  showDivider: boolean;
  title: string;
}) {
  return (
    <div
      className={cn(
        "border-zinc-200 border-b bg-zinc-50/70 px-0 py-3 dark:border-zinc-800 dark:bg-zinc-900/40",
        showDivider && "border-t"
      )}
    >
      <h4 className="font-medium text-[15px] text-foreground tracking-[-0.02em]">
        {title}
      </h4>
    </div>
  );
}

export function DocsPropsTable({ groups, className }: DocsPropsTableProps) {
  return (
    <div className={cn("w-full", className)}>
      <PropsTableHeader />

      {groups.map((group, groupIndex) => (
        <div key={group.id}>
          <PropGroupHeader showDivider={groupIndex > 0} title={group.title} />

          {group.props.map((prop, propIndex) => (
            <div
              className={cn(
                "grid grid-cols-[minmax(0,11rem)_minmax(0,1fr)] items-center gap-x-10 border-zinc-200 border-b py-5 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:gap-x-14 dark:border-zinc-800",
                propIndex === group.props.length - 1 &&
                  groupIndex === groups.length - 1 &&
                  "last:border-b-0"
              )}
              key={prop.id}
            >
              <div className="min-w-0">
                <code className="inline-block rounded-md bg-zinc-100 px-2.5 py-1 font-mono text-[13px] text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                  {prop.name}
                </code>
              </div>
              <PropDescription prop={prop} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
