"use client";

import {
  Folder,
  Home,
  Layers,
  LayoutGrid,
  Map as MapIcon,
  Slash,
} from "lucide-react";
import {
  Fragment,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSegmentedField,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import {
  Breadcrumb,
  BreadcrumbEllipsisMenu,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@/registry/breadcrumbs";

type BreadcrumbsApiMode = "compound" | "items";

type BreadcrumbsPlaygroundState = {
  apiMode: BreadcrumbsApiMode;
  customSeparator: boolean;
  longPath: boolean;
  maxItems: "all" | "3" | "4" | "5";
  showHomeIcon: boolean;
  truncate: boolean;
};

type PlaygroundItem = {
  href?: string;
  icon?: ReactNode;
  label: ReactNode;
  title?: string;
};

export const BREADCRUMBS_DEFAULT_STATE: BreadcrumbsPlaygroundState = {
  apiMode: "items",
  customSeparator: false,
  longPath: false,
  maxItems: "4",
  showHomeIcon: true,
  truncate: false,
};

const API_MODE_OPTIONS: Array<{
  label: string;
  value: BreadcrumbsApiMode;
}> = [
  { label: "Items API", value: "items" },
  { label: "Compound", value: "compound" },
];

const MAX_ITEMS_OPTIONS: Array<{
  label: string;
  value: BreadcrumbsPlaygroundState["maxItems"];
}> = [
  { label: "Show all", value: "all" },
  { label: "3 items", value: "3" },
  { label: "4 items", value: "4" },
  { label: "5 items", value: "5" },
];

const COMPOUND_ICON_NAMES: Record<string, string> = {
  Home: "Home",
  Workspace: "Folder",
  Projects: "Layers",
  "Design System": "LayoutGrid",
  Navigation: "Map",
};

const SHORT_ITEMS = [
  { label: "Home", href: "/", icon: <Home className="size-3.5" /> },
  { label: "Components", href: "/components" },
  { label: "Breadcrumbs" },
] as const;

const LONG_ITEMS = [
  { label: "Home", href: "/", icon: <Home className="size-3.5" /> },
  {
    label: "Workspace",
    href: "/workspace",
    icon: <Folder className="size-3.5" />,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: <Layers className="size-3.5" />,
  },
  {
    label: "Design System",
    href: "/design-system",
    icon: <LayoutGrid className="size-3.5" />,
  },
  {
    label: "Navigation",
    href: "/navigation",
    icon: <MapIcon className="size-3.5" />,
  },
  { label: "Breadcrumbs" },
] as const;

function getPlaygroundItems(
  state: BreadcrumbsPlaygroundState
): PlaygroundItem[] {
  const source = state.longPath ? LONG_ITEMS : SHORT_ITEMS;

  return source.map((item) => ({
    href: "href" in item ? item.href : undefined,
    icon: state.showHomeIcon && "icon" in item ? item.icon : undefined,
    label:
      state.truncate && typeof item.label === "string"
        ? `${item.label} with a much longer label for truncation`
        : item.label,
    title: typeof item.label === "string" ? item.label : undefined,
  }));
}

function getMaxItemsValue(maxItems: BreadcrumbsPlaygroundState["maxItems"]) {
  return maxItems === "all" ? undefined : Number(maxItems);
}

function collapsePlaygroundItems<T>(items: T[], maxItems: number) {
  if (items.length <= maxItems) {
    return {
      collapsed: [] as T[],
      leading: items,
      trailing: [] as T[],
    };
  }

  const trailingCount = Math.max(1, maxItems - 2);
  const leading = items.slice(0, 1);
  const trailing = items.slice(items.length - trailingCount);
  const collapsed = items.slice(1, items.length - trailingCount);

  return { collapsed, leading, trailing };
}

function getCompoundTrail(state: BreadcrumbsPlaygroundState) {
  const items = getPlaygroundItems(state);
  const maxItems = getMaxItemsValue(state.maxItems);

  if (!maxItems || items.length <= maxItems) {
    return {
      collapsed: [] as PlaygroundItem[],
      items,
      leading: items,
      shouldCollapse: false,
      trailing: [] as PlaygroundItem[],
    };
  }

  const { collapsed, leading, trailing } = collapsePlaygroundItems(
    items,
    maxItems
  );

  return {
    collapsed,
    items,
    leading,
    shouldCollapse: true,
    trailing,
  };
}

function getItemLabel(item: PlaygroundItem) {
  return typeof item.label === "string" ? item.label : "Item";
}

function buildItemsApiCode(
  state: BreadcrumbsPlaygroundState,
  importPath: string
) {
  const props: string[] = ['className="w-full max-w-xl"'];

  if (state.maxItems !== "all") {
    props.push(`maxItems={${state.maxItems}}`);
  }

  if (state.truncate) {
    props.push("truncate");
  }

  const itemsLiteral = (state.longPath ? LONG_ITEMS : SHORT_ITEMS)
    .map((item) => {
      const parts = [`label: "${item.label}"`];
      if ("href" in item && item.href) {
        parts.push(`href: "${item.href}"`);
      }
      if (state.showHomeIcon && "icon" in item && item.icon) {
        const iconName = COMPOUND_ICON_NAMES[item.label] ?? "Home";
        parts.push(`icon: <${iconName} className="size-3.5" />`);
      }
      return `  { ${parts.join(", ")} }`;
    })
    .join(",\n");

  const iconImports = state.showHomeIcon
    ? [
        ...new Set(
          (state.longPath ? LONG_ITEMS : SHORT_ITEMS)
            .map((item) =>
              "icon" in item ? COMPOUND_ICON_NAMES[item.label] : null
            )
            .filter(Boolean)
        ),
      ].join(", ")
    : "";

  const imports = state.showHomeIcon
    ? `import { ${iconImports} } from "lucide-react";\n\nimport { Breadcrumbs } from "${importPath}";`
    : `import { Breadcrumbs } from "${importPath}";`;

  return `"use client";

${imports}

const items = [
${itemsLiteral},
];

export function BreadcrumbsPreview() {
  return (
    <Breadcrumbs
      ${props.join("\n      ")}
      items={items}
    />
  );
}`;
}

function buildCompoundIconSnippet(
  label: string,
  state: BreadcrumbsPlaygroundState
) {
  const iconName = COMPOUND_ICON_NAMES[label];

  if (!(state.showHomeIcon && iconName)) {
    return "";
  }

  return `<${iconName} className="size-3.5" />\n            `;
}

function buildCompoundSegmentCode(
  item: PlaygroundItem,
  state: BreadcrumbsPlaygroundState,
  isCurrent: boolean
) {
  const label = getItemLabel(item);

  if (isCurrent || !item.href) {
    return `        <BreadcrumbItem>
          <BreadcrumbPage${state.truncate ? " truncate" : ""}>${item.label}</BreadcrumbPage>
        </BreadcrumbItem>`;
  }

  return `        <BreadcrumbItem>
          <BreadcrumbLink className="inline-flex min-w-0 items-center gap-1.5" href="${item.href}"${item.title ? ` title="${item.title}"` : ""}>
            ${buildCompoundIconSnippet(label, state)}${item.label}
          </BreadcrumbLink>
        </BreadcrumbItem>`;
}

function buildCompoundCollapsedMenuCode(
  collapsed: PlaygroundItem[],
  state: BreadcrumbsPlaygroundState
) {
  const itemsCode = collapsed
    .map((item) => {
      const label = getItemLabel(item);
      const iconName = COMPOUND_ICON_NAMES[label];
      const iconPart =
        state.showHomeIcon && iconName
          ? `, icon: <${iconName} className="size-3.5" />`
          : "";

      return `                { label: ${JSON.stringify(item.label)}, href: "${item.href}"${iconPart} }`;
    })
    .join(",\n");

  return `        <BreadcrumbItem>
          <BreadcrumbEllipsisMenu
            items={[
${itemsCode},
            ]}
          />
        </BreadcrumbItem>`;
}

function buildCompoundCode(
  state: BreadcrumbsPlaygroundState,
  importPath: string
) {
  const separatorSnippet = state.customSeparator
    ? `        <BreadcrumbSeparator>
          <Slash className="size-3.5" />
        </BreadcrumbSeparator>`
    : "        <BreadcrumbSeparator />";

  const trail = getCompoundTrail(state);
  const needsEllipsis = trail.shouldCollapse && trail.collapsed.length > 0;
  const iconImports = [
    ...new Set(
      getPlaygroundItems(state)
        .map((item) => COMPOUND_ICON_NAMES[getItemLabel(item)])
        .filter(Boolean)
    ),
    ...(state.customSeparator ? ["Slash"] : []),
  ];

  const imports = [
    `import {\n  Breadcrumb,\n  BreadcrumbItem,\n  BreadcrumbLink,\n  BreadcrumbList,\n  BreadcrumbPage,\n  BreadcrumbSeparator${needsEllipsis ? ",\n  BreadcrumbEllipsisMenu" : ""},\n} from "${importPath}";`,
    iconImports.length > 0
      ? `import { ${iconImports.join(", ")} } from "lucide-react";`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const segments: string[] = [];

  trail.leading.forEach((item, index) => {
    if (index > 0) {
      segments.push(separatorSnippet);
    }
    segments.push(
      buildCompoundSegmentCode(
        item,
        state,
        !trail.shouldCollapse && index === trail.items.length - 1
      )
    );
  });

  if (needsEllipsis) {
    segments.push(separatorSnippet);
    segments.push(buildCompoundCollapsedMenuCode(trail.collapsed, state));
  }

  trail.trailing.forEach((item, index) => {
    segments.push(separatorSnippet);
    segments.push(
      buildCompoundSegmentCode(item, state, index === trail.trailing.length - 1)
    );
  });

  return `"use client";

${imports}

export function BreadcrumbsPreview() {
  return (
    <Breadcrumb className="w-full max-w-xl">
      <BreadcrumbList>
${segments.join("\n")}
      </BreadcrumbList>
    </Breadcrumb>
  );
}`;
}

export function generateBreadcrumbsCode(
  state: BreadcrumbsPlaygroundState,
  importPath: string
) {
  if (state.apiMode === "items") {
    return buildItemsApiCode(state, importPath);
  }

  return buildCompoundCode(state, importPath);
}

export function getBreadcrumbsDefaultUsageCode(importPath: string) {
  return generateBreadcrumbsCode(BREADCRUMBS_DEFAULT_STATE, importPath);
}

function renderCompoundItem(
  item: PlaygroundItem,
  state: BreadcrumbsPlaygroundState,
  isCurrent: boolean
) {
  const content = (
    <>
      {item.icon}
      {item.label}
    </>
  );

  if (isCurrent || !item.href) {
    return (
      <BreadcrumbPage title={item.title} truncate={state.truncate}>
        {content}
      </BreadcrumbPage>
    );
  }

  return (
    <BreadcrumbLink
      className="inline-flex min-w-0 items-center gap-1.5"
      href={item.href}
      title={item.title}
      truncate={state.truncate}
    >
      {content}
    </BreadcrumbLink>
  );
}

function CompoundBreadcrumbPreview({
  separator,
  state,
}: {
  separator: ReactNode;
  state: BreadcrumbsPlaygroundState;
}) {
  const trail = useMemo(() => getCompoundTrail(state), [state]);

  return (
    <Breadcrumb className="w-full max-w-xl">
      <BreadcrumbList>
        {trail.leading.map((item, index) => (
          <Fragment key={`leading-${getItemLabel(item)}-${index}`}>
            {index > 0 ? (
              <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
            ) : null}
            <BreadcrumbItem>
              {renderCompoundItem(
                item,
                state,
                !trail.shouldCollapse && index === trail.items.length - 1
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
        {trail.shouldCollapse && trail.collapsed.length > 0 ? (
          <>
            <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbEllipsisMenu
                items={trail.collapsed.map((item) => ({
                  href: item.href,
                  icon: item.icon,
                  label: item.label,
                }))}
              />
            </BreadcrumbItem>
          </>
        ) : null}
        {trail.trailing.map((item, index) => (
          <Fragment key={`trailing-${getItemLabel(item)}-${index}`}>
            <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
            <BreadcrumbItem>
              {renderCompoundItem(
                item,
                state,
                index === trail.trailing.length - 1
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function BreadcrumbsPlaygroundPreview({
  state,
}: {
  state: BreadcrumbsPlaygroundState;
}) {
  const items = useMemo(() => getPlaygroundItems(state), [state]);
  const separator = state.customSeparator ? (
    <Slash className="size-3.5" />
  ) : undefined;

  if (state.apiMode === "items") {
    return (
      <div className="flex min-h-[220px] w-full items-center justify-center p-6">
        <Breadcrumbs
          className="w-full max-w-xl"
          items={items}
          maxItems={getMaxItemsValue(state.maxItems)}
          separator={separator}
          truncate={state.truncate}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[220px] w-full items-center justify-center p-6">
      <CompoundBreadcrumbPreview separator={separator} state={state} />
    </div>
  );
}

function BreadcrumbsPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<BreadcrumbsPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: BreadcrumbsPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Breadcrumbs"
    >
      <DocsPlaygroundSegmentedField
        label="API"
        onChange={(apiMode) => onChange({ apiMode })}
        options={API_MODE_OPTIONS}
        value={state.apiMode}
      />
      <DocsPlaygroundToggleField
        checked={state.longPath}
        label="Long path"
        onChange={(longPath) => onChange({ longPath })}
      />
      <DocsPlaygroundSelectField
        label="Max items"
        onChange={(maxItems) => onChange({ maxItems })}
        options={MAX_ITEMS_OPTIONS}
        value={state.maxItems}
      />
      <DocsPlaygroundToggleField
        checked={state.customSeparator}
        label="Slash separator"
        onChange={(customSeparator) => onChange({ customSeparator })}
      />
      <DocsPlaygroundToggleField
        checked={state.showHomeIcon}
        label="Icons"
        onChange={(showHomeIcon) => onChange({ showHomeIcon })}
      />
      <DocsPlaygroundToggleField
        checked={state.truncate}
        label="Truncate labels"
        onChange={(truncate) => onChange({ truncate })}
      />
    </DocsPlaygroundPanel>
  );
}

type BreadcrumbsPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

const IMPORT_PATH = "@/components/ui/breadcrumbs";

export function BreadcrumbsPlaygroundProvider({
  children,
}: {
  children: (props: BreadcrumbsPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<BreadcrumbsPlaygroundState>(
    BREADCRUMBS_DEFAULT_STATE
  );

  const updateState = (next: Partial<BreadcrumbsPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(BREADCRUMBS_DEFAULT_STATE);
  };

  useLayoutEffect(() => {
    setPlaygroundCode(generateBreadcrumbsCode(state, IMPORT_PATH));
  }, [setPlaygroundCode, state]);

  useEffect(() => {
    return () => {
      setPlaygroundCode(null);
    };
  }, [setPlaygroundCode]);

  const renderSettings = (onClose: () => void) => (
    <BreadcrumbsPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <>
      {children({
        preview: <BreadcrumbsPlaygroundPreview state={state} />,
        renderSettings,
      })}
    </>
  );
}
