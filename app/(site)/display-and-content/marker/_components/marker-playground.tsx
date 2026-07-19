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
import type { MarkerProps } from "@/registry/marker";

type MarkerModule = {
  Marker: ComponentType<MarkerProps>;
};

type MarkerVariant = NonNullable<MarkerProps["variant"]>;
type Speed = "fast" | "normal" | "slow";

type MarkerPlaygroundState = {
  animate: boolean;
  speed: Speed;
  variant: MarkerVariant;
};

const DEFAULT_STATE: MarkerPlaygroundState = {
  animate: true,
  speed: "normal",
  variant: "wavy",
};

const SPEED_DURATIONS: Record<Speed, number> = {
  fast: 0.4,
  normal: 0.7,
  slow: 1.1,
};

const VARIANT_OPTIONS: { label: string; value: MarkerVariant }[] = [
  { label: "Wavy", value: "wavy" },
  { label: "Circle", value: "circle" },
  { label: "Highlight", value: "highlight" },
  { label: "Underline", value: "underline" },
  { label: "Line", value: "line" },
  { label: "Dotted underline", value: "dottedUnderline" },
  { label: "Double underline", value: "doubleUnderline" },
  { label: "Strikethrough", value: "strikethrough" },
  { label: "Cross out", value: "crossOut" },
  { label: "Arrow", value: "arrow" },
  { label: "Bracket", value: "bracket" },
  { label: "Box", value: "box" },
];

const SPEED_OPTIONS: { label: string; value: Speed }[] = [
  { label: "Fast", value: "fast" },
  { label: "Normal", value: "normal" },
  { label: "Slow", value: "slow" },
];

const MarkerPlaygroundContext = createContext<{
  MarkerModule: MarkerModule;
  state: MarkerPlaygroundState;
} | null>(null);

function useMarkerPlayground() {
  const context = useContext(MarkerPlaygroundContext);
  if (!context) {
    throw new Error(
      "MarkerPlayground components must be used within MarkerPlaygroundProvider."
    );
  }
  return context;
}

function generateMarkerCode(state: MarkerPlaygroundState, importPath: string) {
  const props: string[] = [];

  if (state.variant !== "wavy") {
    props.push(`variant="${state.variant}"`);
  }

  if (!state.animate) {
    props.push("animate={false}");
  } else if (state.speed !== "normal") {
    props.push(`duration={${SPEED_DURATIONS[state.speed]}}`);
  }

  const markerProps = props.length > 0 ? ` ${props.join(" ")}` : "";

  return `import { Marker } from "${importPath}";

export function MarkerPreview() {
  return (
    <p>
      The quick brown fox jumps over the{" "}
      <Marker${markerProps}>lazy dog</Marker>.
    </p>
  );
}`;
}

function MarkerPlaygroundPreview() {
  const { MarkerModule, state } = useMarkerPlayground();
  const { Marker } = MarkerModule;

  return (
    <div className="flex min-h-[22rem] w-full items-center justify-center px-6 py-6">
      <p
        className="max-w-sm text-balance text-center font-medium text-2xl leading-relaxed"
        key={`${state.variant}-${state.animate}-${state.speed}`}
      >
        The quick brown fox jumps over the{" "}
        <Marker
          animate={state.animate}
          duration={SPEED_DURATIONS[state.speed]}
          variant={state.variant}
        >
          lazy dog
        </Marker>
        .
      </p>
    </div>
  );
}

function MarkerPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<MarkerPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: MarkerPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Marker"
    >
      <DocsPlaygroundSelectField
        label="Variant"
        onChange={(variant) => onChange({ variant })}
        options={VARIANT_OPTIONS}
        value={state.variant}
      />
      <DocsPlaygroundToggleField
        checked={state.animate}
        label="Animate"
        onChange={(animate) => onChange({ animate })}
      />
      <DocsPlaygroundSelectField
        label="Speed"
        onChange={(speed) => onChange({ speed })}
        options={SPEED_OPTIONS}
        value={state.speed}
      />
    </DocsPlaygroundPanel>
  );
}

type MarkerPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function MarkerPlaygroundProvider({
  MarkerModule,
  importPath,
  children,
}: {
  MarkerModule: MarkerModule;
  importPath: string;
  children: (props: MarkerPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<MarkerPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<MarkerPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateMarkerCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <MarkerPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <MarkerPlaygroundContext.Provider value={{ MarkerModule, state }}>
      {children({
        preview: <MarkerPlaygroundPreview />,
        renderSettings,
      })}
    </MarkerPlaygroundContext.Provider>
  );
}
