"use client";

import {
  type ComponentType,
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
import { cn } from "@/lib/utils";
import type {
  SeparatorSpacing,
  SeparatorTone,
  SeparatorVariant,
} from "@/registry/b-separator";

type SharedSeparatorProps = {
  className?: string;
  decorative?: boolean;
  inset?: boolean;
  orientation?: "horizontal" | "vertical";
  spacing?: SeparatorSpacing;
  tone?: SeparatorTone;
  variant?: SeparatorVariant;
};

type SeparatorModule = {
  Separator: ComponentType<SharedSeparatorProps>;
  SeparatorLabel: ComponentType<{
    children: React.ReactNode;
    className?: string;
    tone?: SeparatorTone;
    variant?: SeparatorVariant;
  }>;
};

type SeparatorOrientation = NonNullable<SharedSeparatorProps["orientation"]>;

type SeparatorPlaygroundState = {
  decorative: boolean;
  inset: boolean;
  label: string;
  orientation: SeparatorOrientation;
  showLabel: boolean;
  spacing: SeparatorSpacing;
  tone: SeparatorTone;
  variant: SeparatorVariant;
};

export const SEPARATOR_DEFAULT_STATE: SeparatorPlaygroundState = {
  decorative: true,
  inset: false,
  label: "or continue with",
  orientation: "horizontal",
  showLabel: false,
  spacing: "none",
  tone: "default",
  variant: "line",
};

const ORIENTATION_OPTIONS: Array<{
  label: string;
  value: SeparatorOrientation;
}> = [
  { label: "Horizontal", value: "horizontal" },
  { label: "Vertical", value: "vertical" },
];

const VARIANT_OPTIONS: Array<{ label: string; value: SeparatorVariant }> = [
  { label: "Line", value: "line" },
  { label: "Dashed", value: "dashed" },
  { label: "Dotted", value: "dotted" },
];

const TONE_OPTIONS: Array<{ label: string; value: SeparatorTone }> = [
  { label: "Default", value: "default" },
  { label: "Muted", value: "muted" },
  { label: "Brand", value: "brand" },
  { label: "Destructive", value: "destructive" },
];

const SPACING_OPTIONS: Array<{ label: string; value: SeparatorSpacing }> = [
  { label: "None", value: "none" },
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

function separatorPropsFromState(
  state: SeparatorPlaygroundState
): SharedSeparatorProps {
  return {
    decorative: state.decorative,
    inset: state.inset,
    orientation: state.orientation,
    spacing: state.spacing === "none" ? undefined : state.spacing,
    tone: state.tone === "default" ? undefined : state.tone,
    variant: state.variant === "line" ? undefined : state.variant,
  };
}

function buildSeparatorPropsCode(state: SeparatorPlaygroundState) {
  const props: string[] = [];

  if (state.orientation !== "horizontal") {
    props.push(`orientation="${state.orientation}"`);
  }

  if (state.variant !== "line") {
    props.push(`variant="${state.variant}"`);
  }

  if (state.tone !== "default") {
    props.push(`tone="${state.tone}"`);
  }

  if (state.spacing !== "none") {
    props.push(`spacing="${state.spacing}"`);
  }

  if (state.inset) {
    props.push("inset");
  }

  if (!state.decorative) {
    props.push("decorative={false}");
  }

  if (props.length === 0) {
    return "";
  }

  return `\n        ${props.join("\n        ")}\n      `;
}

export function generateSeparatorCode(
  state: SeparatorPlaygroundState,
  importPath: string
) {
  const separatorProps = buildSeparatorPropsCode(state);
  const imports = state.showLabel
    ? `import { Separator, SeparatorLabel } from "${importPath}";`
    : `import { Separator } from "${importPath}";`;

  if (state.showLabel) {
    return `"use client";

${imports}

export function SeparatorPreview() {
  return (
    <div className="w-full max-w-md px-4">
      <SeparatorLabel${state.tone !== "default" ? `\n        tone="${state.tone}"` : ""}${state.variant !== "line" ? `\n        variant="${state.variant}"` : ""}
      >
        ${state.label}
      </SeparatorLabel>
    </div>
  );
}`;
  }

  if (state.orientation === "vertical") {
    return `"use client";

${imports}

export function SeparatorPreview() {
  return (
    <div className="flex h-28 items-stretch gap-6 px-4">
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border/70 text-muted-foreground text-sm">
        Left
      </div>
      <Separator${separatorProps}/>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border/70 text-muted-foreground text-sm">
        Right
      </div>
    </div>
  );
}`;
  }

  return `"use client";

${imports}

export function SeparatorPreview() {
  return (
    <div className="w-full max-w-md space-y-4 px-4">
      <div className="rounded-lg border border-dashed border-border/70 p-4 text-muted-foreground text-sm">
        Section above
      </div>
      <Separator${separatorProps}/>
      <div className="rounded-lg border border-dashed border-border/70 p-4 text-muted-foreground text-sm">
        Section below
      </div>
    </div>
  );
}`;
}

function SeparatorPlaygroundPreview({
  Separator,
  SeparatorLabel,
  state,
}: {
  Separator: SeparatorModule["Separator"];
  SeparatorLabel: SeparatorModule["SeparatorLabel"];
  state: SeparatorPlaygroundState;
}) {
  const separatorProps = useMemo(() => separatorPropsFromState(state), [state]);

  if (state.showLabel) {
    return (
      <div className="flex min-h-[220px] w-full items-center justify-center p-6">
        <div className="w-full max-w-md">
          <SeparatorLabel tone={state.tone} variant={state.variant}>
            {state.label}
          </SeparatorLabel>
        </div>
      </div>
    );
  }

  if (state.orientation === "vertical") {
    return (
      <div className="flex min-h-[220px] w-full items-center justify-center p-6">
        <div className="flex h-28 w-full max-w-md items-stretch gap-6">
          <div className="flex flex-1 items-center justify-center rounded-lg border border-border/70 border-dashed text-muted-foreground text-sm">
            Left
          </div>
          <Separator {...separatorProps} />
          <div className="flex flex-1 items-center justify-center rounded-lg border border-border/70 border-dashed text-muted-foreground text-sm">
            Right
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[220px] w-full items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <div className="rounded-lg border border-border/70 border-dashed p-4 text-muted-foreground text-sm">
          Section above
        </div>
        <Separator {...separatorProps} />
        <div className="rounded-lg border border-border/70 border-dashed p-4 text-muted-foreground text-sm">
          Section below
        </div>
      </div>
    </div>
  );
}

function SeparatorPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<SeparatorPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: SeparatorPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Separator"
    >
      <DocsPlaygroundSegmentedField
        label="Orientation"
        onChange={(orientation) => onChange({ orientation })}
        options={ORIENTATION_OPTIONS}
        value={state.orientation}
      />
      <DocsPlaygroundSegmentedField
        label="Variant"
        onChange={(variant) => onChange({ variant })}
        options={VARIANT_OPTIONS}
        value={state.variant}
      />
      <DocsPlaygroundSelectField
        label="Tone"
        onChange={(tone) => onChange({ tone })}
        options={TONE_OPTIONS}
        value={state.tone}
      />
      <DocsPlaygroundSelectField
        label="Spacing"
        onChange={(spacing) => onChange({ spacing })}
        options={SPACING_OPTIONS}
        value={state.spacing}
      />
      <DocsPlaygroundToggleField
        checked={state.inset}
        label="Inset (menu)"
        onChange={(inset) => onChange({ inset })}
      />
      <DocsPlaygroundToggleField
        checked={state.decorative}
        label="Decorative"
        onChange={(decorative) => onChange({ decorative })}
      />
      <DocsPlaygroundToggleField
        checked={state.showLabel}
        label="Labeled layout"
        onChange={(showLabel) => onChange({ showLabel })}
      />
      {state.showLabel ? (
        <label className="flex flex-col gap-1.5">
          <span className="font-medium text-foreground text-xs">
            Label text
          </span>
          <input
            className={cn(
              "h-9 rounded-md border border-border bg-background px-3 text-foreground text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            )}
            onChange={(event) => onChange({ label: event.target.value })}
            value={state.label}
          />
        </label>
      ) : null}
    </DocsPlaygroundPanel>
  );
}

type SeparatorPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function SeparatorPlaygroundProvider({
  SeparatorModule,
  importPath,
  children,
}: {
  SeparatorModule: SeparatorModule;
  importPath: string;
  children: (props: SeparatorPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<SeparatorPlaygroundState>(
    SEPARATOR_DEFAULT_STATE
  );

  const updateState = (next: Partial<SeparatorPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(SEPARATOR_DEFAULT_STATE);
  };

  useLayoutEffect(() => {
    setPlaygroundCode(generateSeparatorCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(() => {
    return () => {
      setPlaygroundCode(null);
    };
  }, [setPlaygroundCode]);

  const renderSettings = (onClose: () => void) => (
    <SeparatorPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  const preview = (
    <SeparatorPlaygroundPreview
      Separator={SeparatorModule.Separator}
      SeparatorLabel={SeparatorModule.SeparatorLabel}
      state={state}
    />
  );

  return <>{children({ preview, renderSettings })}</>;
}
