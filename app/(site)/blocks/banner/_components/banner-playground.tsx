"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
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
  Banner,
  type BannerProps,
  type BannerVariant,
} from "@/registry/banner";

type BannerActionMode = "link" | "button" | "morph" | "none";

type BannerPlaygroundState = {
  variant: BannerVariant;
  action: BannerActionMode;
  showIcon: boolean;
  dismissible: boolean;
};

const DEFAULT_STATE: BannerPlaygroundState = {
  variant: "default",
  action: "link",
  showIcon: true,
  dismissible: true,
};

const VARIANT_OPTIONS: Array<{ label: string; value: BannerVariant }> = [
  { label: "Inverted", value: "default" },
  { label: "Info", value: "info" },
  { label: "Success", value: "success" },
  { label: "Error", value: "error" },
];

const ACTION_OPTIONS: Array<{ label: string; value: BannerActionMode }> = [
  { label: "Link", value: "link" },
  { label: "Button", value: "button" },
  { label: "Morph action", value: "morph" },
  { label: "None", value: "none" },
];

/** Per-variant copy so every combination reads like a real announcement. */
const VARIANT_PRESETS: Record<
  BannerVariant,
  {
    message: string;
    linkLabel: string;
    morphMessage: string;
    morphLabel: string;
    morphText: string;
  }
> = {
  default: {
    message: "Important message",
    linkLabel: "Learn more",
    morphLabel: "Undo Rollback",
    morphMessage: "Rollback undone",
    morphText: "This project was rolled back by @johnphamous",
  },
  info: {
    message:
      "Version 2.0 is here — new components, faster theming, better docs",
    linkLabel: "See what's new",
    morphLabel: "Got it",
    morphMessage: "Marked as read",
    morphText:
      "Version 2.0 is here — new components, faster theming, better docs",
  },
  success: {
    message: "Deployment completed — your site is live on production",
    linkLabel: "View deployment",
    morphLabel: "Approve",
    morphMessage: "Deployment approved",
    morphText: "Deployment completed — your site is live on production",
  },
  error: {
    message:
      "Your last payment failed — update billing to keep your workspace active",
    linkLabel: "Update billing",
    morphLabel: "Retry payment",
    morphMessage: "Payment retried",
    morphText:
      "Your last payment failed — update billing to keep your workspace active",
  },
};

const BannerPlaygroundContext = createContext<BannerPlaygroundState | null>(
  null
);

function useBannerPlaygroundState() {
  const context = useContext(BannerPlaygroundContext);

  if (!context) {
    throw new Error(
      "BannerPlayground components must be used within BannerPlaygroundProvider."
    );
  }

  return context;
}

function generateBannerCode(state: BannerPlaygroundState) {
  const preset = VARIANT_PRESETS[state.variant];
  const attrs: string[] = [];

  if (state.action === "link") {
    attrs.push(`actionHref="/changelog"`, `actionLabel="${preset.linkLabel}"`);
  }
  if (state.action === "button") {
    attrs.push(
      `actionLabel="${preset.linkLabel}"`,
      `onAction={() => console.log("action")}`
    );
  }
  if (state.action === "morph") {
    attrs.push(
      `actionLabel="${preset.morphLabel}"`,
      `morphMessage="${preset.morphMessage}"`,
      `onAction={() => console.log("action")}`
    );
  }
  if (!state.showIcon) {
    attrs.push("icon={null}");
  }
  if (!state.dismissible) {
    attrs.push("dismissible={false}");
  }
  if (state.variant !== "default") {
    attrs.push(`variant="${state.variant}"`);
  }

  const message = state.action === "morph" ? preset.morphText : preset.message;
  const attrBlock =
    attrs.length > 0 ? `\n      ${attrs.join("\n      ")}\n    ` : "";

  return `import { Banner } from "@/components/ui/banner";

export function Example() {
  return (
    <Banner${attrBlock}>
      ${message}
    </Banner>
  );
}`;
}

/**
 * Docs-only wrapper: brings the banner back a moment after it dismisses so
 * the morph and collapse can be replayed without reloading the page.
 */
function ReplayableBanner(props: BannerProps) {
  const [instance, setInstance] = useState(0);
  const respawnTimer = useRef<number | null>(null);

  return (
    <Banner
      {...props}
      key={instance}
      onDismiss={() => {
        props.onDismiss?.();

        if (respawnTimer.current !== null) {
          window.clearTimeout(respawnTimer.current);
        }
        respawnTimer.current = window.setTimeout(
          () => setInstance((current) => current + 1),
          1400
        );
      }}
    />
  );
}

/**
 * Centers the banner in the docs preview so it is easy to look at — in a
 * real app the banner sits at the very top of the page instead.
 */
function BannerPlaygroundPreview() {
  const state = useBannerPlaygroundState();
  const preset = VARIANT_PRESETS[state.variant];
  const isMorph = state.action === "morph";

  const actionProps: Partial<BannerProps> = {};
  if (state.action === "link") {
    actionProps.actionHref = "#";
    actionProps.actionLabel = preset.linkLabel;
  }
  if (state.action === "button") {
    actionProps.actionLabel = preset.linkLabel;
  }
  if (isMorph) {
    actionProps.actionLabel = preset.morphLabel;
    actionProps.morphMessage = preset.morphMessage;
  }

  return (
    <div className="flex min-h-[20rem] w-full flex-col justify-center">
      <ReplayableBanner
        {...actionProps}
        dismissible={state.dismissible}
        icon={state.showIcon ? undefined : null}
        key={`${state.variant}-${state.action}-${state.showIcon}-${state.dismissible}`}
        variant={state.variant}
      >
        {isMorph && state.variant === "default" ? (
          <>
            This project was rolled back by <strong>@johnphamous</strong>
          </>
        ) : (
          preset.message
        )}
      </ReplayableBanner>
    </div>
  );
}

function BannerPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<BannerPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: BannerPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Banner"
    >
      <DocsPlaygroundSelectField
        label="Variant"
        onChange={(variant) => onChange({ variant })}
        options={VARIANT_OPTIONS}
        value={state.variant}
      />
      <DocsPlaygroundSelectField
        label="Action"
        onChange={(action) => onChange({ action })}
        options={ACTION_OPTIONS}
        value={state.action}
      />
      <DocsPlaygroundToggleField
        checked={state.showIcon}
        label="Icon"
        onChange={(showIcon) => onChange({ showIcon })}
      />
      <DocsPlaygroundToggleField
        checked={state.dismissible}
        label="Dismissible"
        onChange={(dismissible) => onChange({ dismissible })}
      />
    </DocsPlaygroundPanel>
  );
}

type BannerPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function BannerPlaygroundProvider({
  children,
}: {
  children: (props: BannerPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<BannerPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<BannerPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateBannerCode(state));
  }, [setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <BannerPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <BannerPlaygroundContext.Provider value={state}>
      {children({
        preview: <BannerPlaygroundPreview />,
        renderSettings,
      })}
    </BannerPlaygroundContext.Provider>
  );
}
