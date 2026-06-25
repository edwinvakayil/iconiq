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
import {
  type BadgeColorProp,
  type BadgeProps,
  getBadgePlaygroundColorOptions,
  preferBadgeSemanticColor,
} from "@/registry/badge";

type BadgePattern = "inline" | "sizes" | "semantic" | "dismissible";

type BadgeModule = {
  Badge: ComponentType<BadgeProps>;
};

type BadgePlaygroundState = {
  color: BadgeColorProp;
  dismissible: boolean;
  pattern: BadgePattern;
  shimmer: boolean;
  showIcon: boolean;
  size: NonNullable<BadgeProps["size"]>;
  variant: NonNullable<BadgeProps["variant"]>;
};

const sentenceClassName =
  "flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-balance font-medium text-lg text-neutral-800 leading-snug tracking-tight sm:text-xl dark:text-neutral-100";

const inlineBadgeClassName = "inline-flex translate-y-px align-middle";

const DEFAULT_STATE: BadgePlaygroundState = {
  color: "teal",
  dismissible: false,
  pattern: "inline",
  shimmer: true,
  showIcon: false,
  size: "md",
  variant: "default",
};

const PATTERN_OPTIONS: Array<{ label: string; value: BadgePattern }> = [
  { label: "Inline", value: "inline" },
  { label: "Sizes", value: "sizes" },
  { label: "Semantic", value: "semantic" },
  { label: "Dismissible", value: "dismissible" },
];

const VARIANT_OPTIONS: Array<{
  label: string;
  value: NonNullable<BadgeProps["variant"]>;
}> = [
  { label: "Default", value: "default" },
  { label: "Dot", value: "dot" },
];

const SIZE_OPTIONS: Array<{
  label: string;
  value: NonNullable<BadgeProps["size"]>;
}> = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

const COLOR_OPTIONS = getBadgePlaygroundColorOptions(["gray", "teal"]);

const BadgePlaygroundContext = createContext<{
  BadgeModule: BadgeModule;
  state: BadgePlaygroundState;
} | null>(null);

function useBadgePlayground() {
  const context = useContext(BadgePlaygroundContext);

  if (!context) {
    throw new Error(
      "BadgePlayground components must be used within BadgePlaygroundProvider."
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

function CheckIcon() {
  return (
    <svg aria-hidden fill="none" viewBox="0 0 12 12">
      <path
        d="M2.5 6.25 5 8.75 9.5 3.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function badgePropsFromState(
  state: BadgePlaygroundState,
  options?: { dismissible?: boolean; onDismiss?: () => void }
) {
  const isDismissible = options?.dismissible ?? state.dismissible;

  return {
    animate: state.shimmer,
    color: state.color,
    icon:
      state.showIcon && state.variant === "default" ? <CheckIcon /> : undefined,
    onDismiss:
      isDismissible && state.variant === "default" && !state.showIcon
        ? options?.onDismiss
        : undefined,
    shimmer: state.shimmer,
    size: state.size,
    variant: state.variant,
  } satisfies BadgeProps;
}

function generateBadgeCode(state: BadgePlaygroundState, importPath: string) {
  const iconImport = state.showIcon
    ? `\n\nfunction CheckIcon() {
  return (
    <svg aria-hidden fill="none" viewBox="0 0 12 12">
      <path
        d="M2.5 6.25 5 8.75 9.5 3.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}`
    : "";

  const props: string[] = [];

  if (state.color !== "gray") {
    props.push(`color="${state.color}"`);
  }

  if (state.variant !== "default") {
    props.push(`variant="${state.variant}"`);
  }

  if (state.size !== "md") {
    props.push(`size="${state.size}"`);
  }

  if (!state.shimmer) {
    props.push("animate={false}");
    if (state.variant === "default") {
      props.push("shimmer={false}");
    }
  }

  if (state.showIcon && state.variant === "default") {
    props.push("icon={<CheckIcon />}");
  }

  if (
    state.dismissible &&
    state.pattern === "inline" &&
    state.variant === "default" &&
    !state.showIcon
  ) {
    props.push('onDismiss={() => console.log("dismissed")}');
  }

  const badgeProps = props.length > 0 ? ` ${props.join(" ")}` : "";

  switch (state.pattern) {
    case "sizes": {
      const sharedProps = props.filter((prop) => !prop.startsWith('size="'));
      const shared = sharedProps.length > 0 ? ` ${sharedProps.join(" ")}` : "";

      return `import { Badge } from "${importPath}";${iconImport}

export function BadgeSizesDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge${shared} size="sm">Small</Badge>
      <Badge${shared}>Medium</Badge>
      <Badge${shared} size="lg">Large</Badge>
    </div>
  );
}`;
    }

    case "semantic":
      return `import { Badge } from "${importPath}";

export function BadgeSemanticDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge color="success">Success</Badge>
      <Badge color="warning">Warning</Badge>
      <Badge color="error">Error</Badge>
      <Badge color="info">Info</Badge>
    </div>
  );
}`;

    case "dismissible":
      return `"use client";

import { useState } from "react";

import { Badge } from "${importPath}";

export function BadgeDismissibleDemo() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <button
        className="font-medium text-muted-foreground text-sm underline-offset-4 hover:underline"
        onClick={() => setVisible(true)}
        type="button"
      >
        Show badge again
      </button>
    );
  }

  return (
    <Badge${badgeProps} onDismiss={() => setVisible(false)}>
      Design
    </Badge>
  );
}`;

    default:
      return `import { Badge } from "${importPath}";${iconImport}

export function BadgeDemo() {
  return (
    <p className="${sentenceClassName}">
      <span>This update is</span>
      <span className="${inlineBadgeClassName}">
        <Badge${badgeProps}>Early Access</Badge>
      </span>
      <span>and ready to ship.</span>
    </p>
  );
}`;
  }
}

function DismissibleBadgePreview({
  Badge,
  state,
}: {
  Badge: BadgeModule["Badge"];
  state: BadgePlaygroundState;
}) {
  const [visible, setVisible] = useState(true);
  const badgeProps = badgePropsFromState(state, {
    dismissible: true,
    onDismiss: () => setVisible(false),
  });

  if (!visible) {
    return (
      <PreviewFrame>
        <button
          className="font-medium text-muted-foreground text-sm underline-offset-4 hover:underline"
          onClick={() => setVisible(true)}
          type="button"
        >
          Show badge again
        </button>
      </PreviewFrame>
    );
  }

  return (
    <PreviewFrame>
      <Badge {...badgeProps}>Design</Badge>
    </PreviewFrame>
  );
}

function InlineBadgePreview({
  Badge,
  state,
}: {
  Badge: BadgeModule["Badge"];
  state: BadgePlaygroundState;
}) {
  const [visible, setVisible] = useState(true);
  const badgeProps = badgePropsFromState(state, {
    dismissible: state.dismissible,
    onDismiss: state.dismissible ? () => setVisible(false) : undefined,
  });

  return (
    <PreviewFrame>
      <p className={sentenceClassName}>
        <span>This update is</span>
        <span className={inlineBadgeClassName}>
          {visible ? (
            <Badge {...badgeProps}>Early Access</Badge>
          ) : (
            <button
              className="font-medium text-muted-foreground text-sm underline-offset-4 hover:underline"
              onClick={() => setVisible(true)}
              type="button"
            >
              Show badge
            </button>
          )}
        </span>
        <span>and ready to ship.</span>
      </p>
    </PreviewFrame>
  );
}

function BadgePlaygroundPreview() {
  const { BadgeModule, state } = useBadgePlayground();
  const { Badge } = BadgeModule;
  const badgeProps = badgePropsFromState(state, {
    dismissible: state.pattern === "dismissible" || state.dismissible,
  });

  switch (state.pattern) {
    case "sizes":
      return (
        <PreviewFrame>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge {...badgeProps} size="sm">
              Small
            </Badge>
            <Badge {...badgeProps} size="md">
              Medium
            </Badge>
            <Badge {...badgeProps} size="lg">
              Large
            </Badge>
          </div>
        </PreviewFrame>
      );

    case "semantic":
      return (
        <PreviewFrame>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge
              animate={state.shimmer}
              color="success"
              shimmer={state.shimmer}
            >
              Success
            </Badge>
            <Badge
              animate={state.shimmer}
              color="warning"
              shimmer={state.shimmer}
            >
              Warning
            </Badge>
            <Badge
              animate={state.shimmer}
              color="error"
              shimmer={state.shimmer}
            >
              Error
            </Badge>
            <Badge animate={state.shimmer} color="info" shimmer={state.shimmer}>
              Info
            </Badge>
          </div>
        </PreviewFrame>
      );

    case "dismissible":
      return <DismissibleBadgePreview Badge={Badge} state={state} />;

    default:
      return <InlineBadgePreview Badge={Badge} state={state} />;
  }
}

function BadgePlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<BadgePlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: BadgePlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Badge"
    >
      <DocsPlaygroundSelectField
        label="Pattern"
        onChange={(pattern) =>
          onChange({
            pattern,
            dismissible:
              pattern === "dismissible" && state.variant === "default",
          })
        }
        options={
          state.variant === "dot"
            ? PATTERN_OPTIONS.filter((option) => option.value !== "dismissible")
            : PATTERN_OPTIONS
        }
        value={
          state.variant === "dot" && state.pattern === "dismissible"
            ? "inline"
            : state.pattern
        }
      />
      {state.pattern !== "semantic" ? (
        <>
          <DocsPlaygroundSelectField
            label="Variant"
            onChange={(variant) =>
              onChange({
                variant,
                ...(variant === "dot"
                  ? {
                      showIcon: false,
                      dismissible: false,
                      ...(state.pattern === "dismissible"
                        ? { pattern: "inline" as BadgePattern }
                        : {}),
                    }
                  : {}),
              })
            }
            options={VARIANT_OPTIONS}
            value={state.variant}
          />
          <DocsPlaygroundSelectField
            label="Size"
            onChange={(size) => onChange({ size })}
            options={SIZE_OPTIONS}
            value={state.size}
          />
          <DocsPlaygroundSelectField
            label="Color"
            onChange={(color) => onChange({ color })}
            options={COLOR_OPTIONS}
            value={state.color}
          />
        </>
      ) : null}
      {state.pattern === "inline" || state.pattern === "dismissible" ? (
        <>
          {state.pattern === "inline" &&
          state.variant === "default" &&
          !state.showIcon ? (
            <DocsPlaygroundToggleField
              checked={state.dismissible}
              label="Dismiss"
              onChange={(dismissible) =>
                onChange({
                  dismissible,
                  showIcon: dismissible ? false : state.showIcon,
                })
              }
            />
          ) : null}
          {state.variant === "default" &&
          state.pattern !== "dismissible" &&
          !state.dismissible ? (
            <DocsPlaygroundToggleField
              checked={state.showIcon}
              label="Icon"
              onChange={(showIcon) =>
                onChange({
                  showIcon,
                  dismissible: showIcon ? false : state.dismissible,
                })
              }
            />
          ) : null}
        </>
      ) : null}
      {state.pattern !== "semantic" ? (
        <DocsPlaygroundToggleField
          checked={state.shimmer}
          label={state.variant === "dot" ? "Animate" : "Shimmer"}
          onChange={(shimmer) => onChange({ shimmer })}
        />
      ) : null}
    </DocsPlaygroundPanel>
  );
}

type BadgePlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function BadgePlaygroundProvider({
  BadgeModule,
  importPath,
  children,
}: {
  BadgeModule: BadgeModule;
  importPath: string;
  children: (props: BadgePlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<BadgePlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<BadgePlaygroundState>) => {
    setState((current) => {
      const merged = { ...current, ...next };

      return {
        ...merged,
        color: preferBadgeSemanticColor(merged.color),
      };
    });
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateBadgeCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <BadgePlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <BadgePlaygroundContext.Provider value={{ BadgeModule, state }}>
      {children({
        preview: <BadgePlaygroundPreview />,
        renderSettings,
      })}
    </BadgePlaygroundContext.Provider>
  );
}
