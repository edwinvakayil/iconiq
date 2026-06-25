"use client";

import {
  type ComponentType,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import type { AvatarBadgeVariant, AvatarSize } from "@/registry/avatar";

type AvatarPattern = "inline" | "group" | "sizes" | "fallback";
type TooltipTarget = "none" | "avatar" | "badge";

type AvatarModule = {
  Avatar: ComponentType<{
    "aria-label"?: string;
    className?: string;
    name?: string;
    size?: AvatarSize;
    tooltip?: string;
    children?: ReactNode;
  }>;
  AvatarBadge: ComponentType<{
    tooltip?: string;
    variant?: AvatarBadgeVariant;
    children?: ReactNode;
  }>;
  AvatarFallback: ComponentType<{ children?: ReactNode }>;
  AvatarGroup: ComponentType<{ children?: ReactNode }>;
  AvatarGroupCount: ComponentType<{ children?: ReactNode }>;
  AvatarImage: ComponentType<{
    alt: string;
    src?: string;
  }>;
};

type PlaygroundBadgeVariant = AvatarBadgeVariant | "none";

type AvatarPlaygroundState = {
  badgeVariant: PlaygroundBadgeVariant;
  groupCount: boolean;
  pattern: AvatarPattern;
  size: AvatarSize;
  tooltipTarget: TooltipTarget;
};

const sentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

const inlineAvatarClassName = "inline-flex translate-y-px align-middle";

const DEFAULT_STATE: AvatarPlaygroundState = {
  badgeVariant: "online",
  groupCount: true,
  pattern: "inline",
  size: "default",
  tooltipTarget: "avatar",
};

const SIZE_OPTIONS: Array<{ label: string; value: AvatarSize }> = [
  { label: "Small", value: "sm" },
  { label: "Default", value: "default" },
  { label: "Large", value: "lg" },
];

const PATTERN_OPTIONS: Array<{ label: string; value: AvatarPattern }> = [
  { label: "Inline", value: "inline" },
  { label: "Group", value: "group" },
  { label: "Sizes", value: "sizes" },
  { label: "Fallback", value: "fallback" },
];

const BADGE_VARIANT_OPTIONS: Array<{
  label: string;
  value: PlaygroundBadgeVariant;
}> = [
  { label: "None", value: "none" },
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
  { label: "Busy", value: "busy" },
  { label: "Away", value: "away" },
];

const TOOLTIP_TARGET_OPTIONS: Array<{ label: string; value: TooltipTarget }> = [
  { label: "None", value: "none" },
  { label: "Avatar", value: "avatar" },
  { label: "Badge", value: "badge" },
];

const AvatarPlaygroundContext = createContext<{
  AvatarModule: AvatarModule;
  state: AvatarPlaygroundState;
} | null>(null);

function useAvatarPlayground() {
  const context = useContext(AvatarPlaygroundContext);

  if (!context) {
    throw new Error(
      "AvatarPlayground components must be used within AvatarPlaygroundProvider."
    );
  }

  return context;
}

function PreviewFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[18rem] w-full items-center justify-center px-4 py-6">
      <div className="mx-auto max-w-3xl text-center">{children}</div>
    </div>
  );
}

function getTooltipProps(target: TooltipTarget, scope: "avatar" | "badge") {
  if (target !== scope) {
    return {};
  }

  return scope === "avatar"
    ? { tooltip: "Online now" }
    : { tooltip: "Online now" };
}

function renderBadge(
  AvatarBadge: AvatarModule["AvatarBadge"],
  state: AvatarPlaygroundState
) {
  if (state.badgeVariant === "none") {
    return null;
  }

  return (
    <AvatarBadge
      variant={state.badgeVariant}
      {...getTooltipProps(state.tooltipTarget, "badge")}
    />
  );
}

function generateAvatarCode(state: AvatarPlaygroundState, importPath: string) {
  const imports = [
    "Avatar",
    "AvatarBadge",
    "AvatarFallback",
    "AvatarGroup",
    "AvatarGroupCount",
    "AvatarImage",
  ];

  const avatarTooltip =
    state.tooltipTarget === "avatar" ? `\n      tooltip="Online now"` : "";
  const badgeTooltip =
    state.tooltipTarget === "badge" && state.badgeVariant !== "none"
      ? ` tooltip="Online now"`
      : "";
  const sizeAttr =
    state.size === "default" ? "" : `\n      size="${state.size}"`;
  const badgeVariantAttr =
    state.badgeVariant === "online" || state.badgeVariant === "none"
      ? ""
      : `\n        variant="${state.badgeVariant}"`;
  const badgeBlock =
    state.badgeVariant === "none"
      ? ""
      : `\n          <AvatarBadge${badgeVariantAttr}${badgeTooltip} />`;
  const inlineImports =
    state.badgeVariant === "none"
      ? ["Avatar", "AvatarFallback", "AvatarImage"]
      : ["Avatar", "AvatarBadge", "AvatarFallback", "AvatarImage"];

  switch (state.pattern) {
    case "group":
      return `import {
  ${imports.join(",\n  ")},
} from "${importPath}";

export function AvatarGroupDemo() {
  return (
    <AvatarGroup>
      <Avatar size="${state.size}">
        <AvatarImage src="/assets/av1.png" alt="Avatar 1" />
        <AvatarFallback>A1</AvatarFallback>
      </Avatar>
      <Avatar size="${state.size}">
        <AvatarImage src="/assets/av3.png" alt="Avatar 3" />
        <AvatarFallback>A3</AvatarFallback>
      </Avatar>
      <Avatar size="${state.size}">
        <AvatarImage src="/assets/av2.png" alt="Avatar 2" />
        <AvatarFallback>A2</AvatarFallback>
      </Avatar>${
        state.groupCount
          ? `
      <AvatarGroupCount>+3</AvatarGroupCount>`
          : ""
      }
    </AvatarGroup>
  );
}`;

    case "sizes":
      return `import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "${importPath}";

export function AvatarSizesDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Avatar size="sm">
        <AvatarImage src="/assets/shadcn.jpg" alt="shadcn/ui" />
        <AvatarFallback>SU</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="/assets/shadcn.jpg" alt="shadcn/ui" />
        <AvatarFallback>SU</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage src="/assets/shadcn.jpg" alt="shadcn/ui" />
        <AvatarFallback>SU</AvatarFallback>
      </Avatar>
    </div>
  );
}`;

    case "fallback":
      return `import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "${importPath}";

export function AvatarFallbackDemo() {
  return (
    <Avatar name="Jordan Lee">
      <AvatarImage src="/assets/missing.png" alt="Jordan Lee" />
      <AvatarFallback />
    </Avatar>
  );
}`;

    default:
      return `import {
  ${inlineImports.join(",\n  ")},
} from "${importPath}";

export function AvatarDemo() {
  return (
    <p className="${sentenceClassName}">
      <span>Assigned to</span>
      <span className="${inlineAvatarClassName}">
        <Avatar${sizeAttr}${avatarTooltip}>
          <AvatarImage src="/assets/shadcn.jpg" alt="shadcn/ui" />
          <AvatarFallback>SU</AvatarFallback>${badgeBlock}
        </Avatar>
      </span>
      <span>on this release.</span>
    </p>
  );
}`;
  }
}

function AvatarPlaygroundPreview() {
  const { AvatarModule, state } = useAvatarPlayground();
  const {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
  } = AvatarModule;

  switch (state.pattern) {
    case "group":
      return (
        <PreviewFrame>
          <AvatarGroup>
            <Avatar size={state.size}>
              <AvatarImage alt="Avatar 1" src="/assets/av1.png" />
              <AvatarFallback>A1</AvatarFallback>
            </Avatar>
            <Avatar size={state.size}>
              <AvatarImage alt="Avatar 3" src="/assets/av3.png" />
              <AvatarFallback>A3</AvatarFallback>
            </Avatar>
            <Avatar size={state.size}>
              <AvatarImage alt="Avatar 2" src="/assets/av2.png" />
              <AvatarFallback>A2</AvatarFallback>
            </Avatar>
            {state.groupCount ? <AvatarGroupCount>+3</AvatarGroupCount> : null}
          </AvatarGroup>
        </PreviewFrame>
      );

    case "sizes":
      return (
        <PreviewFrame>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Avatar size="sm">
              <AvatarImage alt="shadcn/ui" src="/assets/shadcn.jpg" />
              <AvatarFallback>SU</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage alt="shadcn/ui" src="/assets/shadcn.jpg" />
              <AvatarFallback>SU</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarImage alt="shadcn/ui" src="/assets/shadcn.jpg" />
              <AvatarFallback>SU</AvatarFallback>
            </Avatar>
          </div>
        </PreviewFrame>
      );

    case "fallback":
      return (
        <PreviewFrame>
          <Avatar name="Jordan Lee">
            <AvatarImage alt="Jordan Lee" src="/assets/missing.png" />
            <AvatarFallback />
          </Avatar>
        </PreviewFrame>
      );

    default:
      return (
        <PreviewFrame>
          <p className={sentenceClassName}>
            <span>Assigned to</span>
            <span className={inlineAvatarClassName}>
              <Avatar
                size={state.size}
                {...getTooltipProps(state.tooltipTarget, "avatar")}
              >
                <AvatarImage alt="shadcn/ui" src="/assets/shadcn.jpg" />
                <AvatarFallback>SU</AvatarFallback>
                {renderBadge(AvatarBadge, state)}
              </Avatar>
            </span>
            <span>on this release.</span>
          </p>
        </PreviewFrame>
      );
  }
}

function AvatarPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<AvatarPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: AvatarPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Avatar"
    >
      <DocsPlaygroundSelectField
        label="Pattern"
        onChange={(pattern) => onChange({ pattern })}
        options={PATTERN_OPTIONS}
        value={state.pattern}
      />
      {state.pattern === "inline" || state.pattern === "group" ? (
        <DocsPlaygroundSelectField
          label="Size"
          onChange={(size) => onChange({ size })}
          options={SIZE_OPTIONS}
          value={state.size}
        />
      ) : null}
      {state.pattern === "inline" ? (
        <>
          <DocsPlaygroundSelectField
            label="Badge"
            onChange={(badgeVariant) =>
              onChange({
                badgeVariant,
                ...(badgeVariant === "none" && state.tooltipTarget === "badge"
                  ? { tooltipTarget: "none" as TooltipTarget }
                  : {}),
              })
            }
            options={BADGE_VARIANT_OPTIONS}
            value={state.badgeVariant}
          />
          <DocsPlaygroundSelectField
            label="Tooltip"
            onChange={(tooltipTarget) => onChange({ tooltipTarget })}
            options={
              state.badgeVariant === "none"
                ? TOOLTIP_TARGET_OPTIONS.filter(
                    (option) => option.value !== "badge"
                  )
                : TOOLTIP_TARGET_OPTIONS
            }
            value={
              state.badgeVariant === "none" && state.tooltipTarget === "badge"
                ? "none"
                : state.tooltipTarget
            }
          />
        </>
      ) : null}
      {state.pattern === "group" ? (
        <DocsPlaygroundToggleField
          checked={state.groupCount}
          label="Count"
          onChange={(groupCount) => onChange({ groupCount })}
        />
      ) : null}
    </DocsPlaygroundPanel>
  );
}

type AvatarPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function AvatarPlaygroundProvider({
  AvatarModule,
  importPath,
  children,
}: {
  AvatarModule: AvatarModule;
  importPath: string;
  children: (props: AvatarPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<AvatarPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<AvatarPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateAvatarCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <AvatarPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <AvatarPlaygroundContext.Provider value={{ AvatarModule, state }}>
      {children({
        preview: <AvatarPlaygroundPreview />,
        renderSettings,
      })}
    </AvatarPlaygroundContext.Provider>
  );
}
