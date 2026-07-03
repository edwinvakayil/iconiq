"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { hoverCardApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { LINK } from "@/constants";
import { useDocStore } from "@/hooks/use-doc-store";
import {
  HoverCard as BaseHoverCard,
  HoverCardContent as BaseHoverCardContent,
  HoverCardTrigger as BaseHoverCardTrigger,
} from "@/registry/b-hover-card";
import {
  HoverCard as RadixHoverCard,
  HoverCardContent as RadixHoverCardContent,
  HoverCardTrigger as RadixHoverCardTrigger,
} from "@/registry/r-hover-card";

const IMPORT_PATHS = {
  base: "@/components/ui/b-hover-card",
  radix: "@/components/ui/r-hover-card",
} as const;

type HoverCardComponents = {
  HoverCard: React.ComponentType<{
    openDelay?: number;
    closeDelay?: number;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultOpen?: boolean;
    className?: string;
    children?: React.ReactNode;
  }>;
  HoverCardTrigger: React.ComponentType<{
    asChild?: boolean;
    children?: React.ReactNode;
    className?: string;
  }>;
  HoverCardContent: React.ComponentType<{
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    className?: string;
    children?: React.ReactNode;
  }>;
};

type ProviderConfig = {
  componentName: "b-hover-card" | "r-hover-card";
  dependencyLabel: string;
  importPath: string;
  libraryLabel: string;
  notes: string[];
  ui: HoverCardComponents;
  usageCode: string;
};

type HoverCardPlaygroundState = {
  align: "start" | "center" | "end";
  side: "top" | "bottom" | "left" | "right";
  openDelay: number;
  closeDelay: number;
  controlled: boolean;
};

const HOVER_CARD_DEFAULT_STATE: HoverCardPlaygroundState = {
  align: "center",
  side: "bottom",
  openDelay: 80,
  closeDelay: 120,
  controlled: false,
};

const ALIGN_OPTIONS = [
  { label: "Start", value: "start" as const },
  { label: "Center", value: "center" as const },
  { label: "End", value: "end" as const },
];

const SIDE_OPTIONS = [
  { label: "Bottom", value: "bottom" as const },
  { label: "Top", value: "top" as const },
  { label: "Left", value: "left" as const },
  { label: "Right", value: "right" as const },
];

const DELAY_OPTIONS = [
  { label: "0ms (Immediate)", value: "0" },
  { label: "80ms (Fast)", value: "80" },
  { label: "100ms (Default)", value: "100" },
  { label: "300ms (Slow)", value: "300" },
  { label: "800ms (Very Slow)", value: "800" },
];

function generateHoverCardCode(
  state: HoverCardPlaygroundState,
  importPath: string
) {
  const rootProps = [
    state.openDelay !== 80 ? `openDelay={${state.openDelay}}` : "",
    state.closeDelay !== 120 ? `closeDelay={${state.closeDelay}}` : "",
    state.controlled ? "onOpenChange={setOpen} open={open}" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const contentProps = [
    state.side !== "bottom" ? `side="${state.side}"` : "",
    state.align !== "center" ? `align="${state.align}"` : "",
    'className="w-[320px]"',
  ]
    .filter(Boolean)
    .join(" ");

  const stateSetup = state.controlled
    ? "  const [open, setOpen] = useState(false);\n\n"
    : "";

  return `"use client";

import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "${importPath}";

export function HoverCardPreview() {
${stateSetup}  return (
    <div className="flex flex-col items-center gap-5">
      <HoverCard${rootProps ? ` ${rootProps}` : ""}>
        <HoverCardTrigger asChild>
          <button
            className="inline-flex items-center text-[15px] font-medium tracking-[-0.02em] text-foreground decoration-transparent underline-offset-4 transition-[text-decoration-color] hover:underline hover:decoration-foreground focus-visible:underline focus-visible:decoration-foreground focus-visible:outline-none"
            type="button"
          >
            View profile
          </button>
        </HoverCardTrigger>
        <HoverCardContent${contentProps ? ` ${contentProps}` : ""}>
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-[15px] font-medium text-foreground">
                Edwin Vakayil
              </p>
              <p className="text-[13px] leading-5 text-secondary">
                @edwinvakayil · Design Engineer
              </p>
            </div>
            <p className="text-[14px] leading-6 text-secondary">
              Leading onboarding, motion systems, and dense product surfaces
              across the core workspace.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}`;
}

function HoverCardPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<HoverCardPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: HoverCardPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton label="Reset" onClick={onReset} />}
      onClose={onClose}
      title="Hover Card"
    >
      <DocsPlaygroundSelectField
        label="Side"
        onChange={(side) =>
          onChange({ side: side as HoverCardPlaygroundState["side"] })
        }
        options={SIDE_OPTIONS}
        value={state.side}
      />
      <DocsPlaygroundSelectField
        label="Align"
        onChange={(align) =>
          onChange({ align: align as HoverCardPlaygroundState["align"] })
        }
        options={ALIGN_OPTIONS}
        value={state.align}
      />
      <DocsPlaygroundSelectField
        label="Open Delay"
        onChange={(val) => onChange({ openDelay: Number(val) })}
        options={DELAY_OPTIONS}
        value={String(state.openDelay)}
      />
      <DocsPlaygroundSelectField
        label="Close Delay"
        onChange={(val) => onChange({ closeDelay: Number(val) })}
        options={DELAY_OPTIONS}
        value={String(state.closeDelay)}
      />
      <DocsPlaygroundToggleField
        checked={state.controlled}
        label="Controlled State"
        onChange={(controlled) => onChange({ controlled })}
      />
    </DocsPlaygroundPanel>
  );
}

function HoverCardPlaygroundProvider({
  importPath,
  ui,
  children,
}: {
  importPath: string;
  ui: HoverCardComponents;
  children: (props: {
    preview: ReactNode;
    renderSettings: (onClose: () => void) => ReactNode;
  }) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<HoverCardPlaygroundState>(
    HOVER_CARD_DEFAULT_STATE
  );
  const [controlledOpen, setControlledOpen] = useState(false);

  const updateState = (next: Partial<HoverCardPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(HOVER_CARD_DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateHoverCardCode(state, importPath));
  }, [setPlaygroundCode, state, importPath]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const { HoverCard, HoverCardTrigger, HoverCardContent } = ui;

  const handleOpenChange = (nextOpen: boolean) => {
    if (state.controlled) {
      setControlledOpen(nextOpen);
    }
  };

  const openProps = state.controlled
    ? { open: controlledOpen, onOpenChange: handleOpenChange }
    : {};

  const preview = (
    <div className="flex min-h-[280px] w-full flex-col items-center justify-center gap-5 px-4 py-10">
      <HoverCard
        closeDelay={state.closeDelay}
        openDelay={state.openDelay}
        {...openProps}
      >
        <HoverCardTrigger asChild>
          <button
            className="inline-flex items-center font-medium text-[15px] text-foreground tracking-[-0.02em] decoration-transparent underline-offset-4 transition-[text-decoration-color] hover:underline hover:decoration-foreground focus-visible:underline focus-visible:decoration-foreground focus-visible:outline-none"
            type="button"
          >
            View profile
          </button>
        </HoverCardTrigger>
        <HoverCardContent
          align={state.align}
          className="w-[320px]"
          side={state.side}
        >
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="select-text font-medium text-[15px] text-foreground">
                Edwin Vakayil
              </p>
              <p className="select-text text-[13px] text-secondary leading-5">
                @edwinvakayil · Design Engineer
              </p>
            </div>
            <p className="select-text text-[14px] text-secondary leading-6">
              Leading onboarding, motion systems, and dense product surfaces
              across the core workspace.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );

  const renderSettings = (onClose: () => void) => (
    <HoverCardPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return <>{children({ preview, renderSettings })}</>;
}

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Overlay & Popups" },
  { label: "Hover Card" },
];

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-hover-card": `import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/b-hover-card";

export function HoverCardPreview() {
  return (
    <div className="flex flex-col items-center gap-5">
      <HoverCard openDelay={100}>
        <HoverCardTrigger asChild>
          <button
            className="inline-flex items-center text-[15px] font-medium tracking-[-0.02em] text-foreground decoration-transparent underline-offset-4 transition-[text-decoration-color] hover:underline hover:decoration-foreground focus-visible:underline focus-visible:decoration-foreground focus-visible:outline-none"
            type="button"
          >
            View profile
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-[320px]">
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-[15px] font-medium text-foreground">
                Edwin Vakayil
              </p>
              <p className="text-[13px] leading-5 text-secondary">
                @edwinvakayil · Design Engineer
              </p>
            </div>
            <p className="text-[14px] leading-6 text-secondary">
              Leading onboarding, motion systems, and dense product surfaces
              across the core workspace.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}`,
  "r-hover-card": `import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/r-hover-card";

export function HoverCardPreview() {
  return (
    <div className="flex flex-col items-center gap-5">
      <HoverCard openDelay={100}>
        <HoverCardTrigger asChild>
          <button
            className="inline-flex items-center text-[15px] font-medium tracking-[-0.02em] text-foreground decoration-transparent underline-offset-4 transition-[text-decoration-color] hover:underline hover:decoration-foreground focus-visible:underline focus-visible:decoration-foreground focus-visible:outline-none"
            type="button"
          >
            View profile
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-[320px]">
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-[15px] font-medium text-foreground">
                Edwin Vakayil
              </p>
              <p className="text-[13px] leading-5 text-secondary">
                @edwinvakayil · Design Engineer
              </p>
            </div>
            <p className="text-[14px] leading-6 text-secondary">
              Leading onboarding, motion systems, and dense product surfaces
              across the core workspace.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}`,
};

function getDetails(provider: ProviderConfig): DetailItem[] {
  return hoverCardApiDetails.map((item) => {
    if (item.id === "hover-card") {
      return {
        ...item,
        notes: [
          "Open state supports controlled and uncontrolled modes. Controlled mode supports open and onOpenChange props.",
          provider.libraryLabel === "Base UI"
            ? "The root keeps the original hover and focus timing, while Base UI Popover handles floating positioning and viewport-aware placement."
            : "The root keeps the original hover and focus timing, while Radix Hover Card handles portal-based positioning and collision-aware placement.",
          "Pending timers are cleared before every new open or close request and again during unmount cleanup.",
        ],
      };
    }

    if (item.id === "hover-card-content") {
      return {
        ...item,
        notes: [
          "Additional motion.div props such as style, role, onClick, aria-*, and data-* are forwarded, but initial, animate, exit, and transition are reserved by the component.",
          provider.libraryLabel === "Base UI"
            ? "The panel is portaled through Base UI popover positioner and popup primitives, while preserving the same spring-driven scale and directional offset animation."
            : "The panel is portaled through Radix Hover Card content, while preserving the same spring-driven scale and directional offset animation.",
          "Focus can move from the trigger into interactive content without immediately closing the card.",
          "By default the content is centered below the trigger with a fixed w-72 width, no drop shadow, and a 12px hover bridge across the trigger-to-panel gap.",
        ],
      };
    }

    if (item.id === "registry" || item.registryPath) {
      return {
        ...item,
        notes: [
          `Dependencies: ${provider.dependencyLabel}.`,
          ...provider.notes,
          `The generated registry file is /r/${provider.componentName}.json.`,
        ],
        registryPath: `${provider.componentName}.json`,
      };
    }

    return item;
  });
}

export default function RadixBaseHoverCardPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-hover-card",
        dependencyLabel: "@base-ui/react, motion",
        importPath: IMPORT_PATHS.base,
        libraryLabel: "Base UI",
        notes: [
          "Uses Base UI popover primitives to recreate the same hover-card surface because Base UI does not ship a dedicated hover card primitive.",
          "Preserves the original delayed hover reveal, instant focus open, and spring-driven content motion.",
        ],
        ui: {
          HoverCard: BaseHoverCard,
          HoverCardTrigger: BaseHoverCardTrigger,
          HoverCardContent: BaseHoverCardContent,
        },
        usageCode: usageCodeByProvider["b-hover-card"],
      };
    }

    return {
      componentName: "r-hover-card",
      dependencyLabel:
        "@radix-ui/react-hover-card, @radix-ui/react-slot, motion",
      importPath: IMPORT_PATHS.radix,
      libraryLabel: "Radix UI",
      notes: [
        "Uses the dedicated Radix Hover Card primitive instead of Radix Popover for the floating surface.",
        "Preserves the original delayed hover reveal, instant focus open, and spring-driven content motion.",
      ],
      ui: {
        HoverCard: RadixHoverCard,
        HoverCardTrigger: RadixHoverCardTrigger,
        HoverCardContent: RadixHoverCardContent,
      },
      usageCode: usageCodeByProvider["r-hover-card"],
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  return (
    <HoverCardPlaygroundProvider
      importPath={provider.importPath}
      key={provider.componentName}
      ui={provider.ui}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName={provider.componentName}
          description="Hover preview for extra context without leaving the page."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/overlay-and-popups/hover-card/page.tsx`}
          headerActions={
            <ProviderSwitch
              onSelect={setSelectedProvider}
              selectedProvider={selectedProvider}
            />
          }
          itemSlug="hover-card"
          pageUrl="/overlay-and-popups/hover-card"
          preview={preview}
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Hover Card"
          title="Hover Card"
          usageCode={provider.usageCode}
          usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
          v0PageCode={provider.usageCode}
        />
      )}
    </HoverCardPlaygroundProvider>
  );
}
