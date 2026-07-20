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
import type { RatingButtonProps, RatingProps } from "@/registry/rating";

type RatingModule = {
  Rating: ComponentType<RatingProps>;
  RatingButton: ComponentType<RatingButtonProps>;
};

type Size = "sm" | "md" | "lg";

type RatingPlaygroundState = {
  count: 3 | 5 | 7;
  readOnly: boolean;
  size: Size;
};

const DEFAULT_STATE: RatingPlaygroundState = {
  count: 5,
  readOnly: false,
  size: "md",
};

const SIZE_PX: Record<Size, number> = {
  sm: 16,
  md: 20,
  lg: 28,
};

const COUNT_OPTIONS = [
  { label: "3 stars", value: "3" as const },
  { label: "5 stars", value: "5" as const },
  { label: "7 stars", value: "7" as const },
];

const SIZE_OPTIONS: { label: string; value: Size }[] = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

const RatingPlaygroundContext = createContext<{
  RatingModule: RatingModule;
  state: RatingPlaygroundState;
} | null>(null);

function useRatingPlayground() {
  const context = useContext(RatingPlaygroundContext);
  if (!context) {
    throw new Error(
      "RatingPlayground components must be used within RatingPlaygroundProvider."
    );
  }
  return context;
}

function generateRatingCode(state: RatingPlaygroundState, importPath: string) {
  const ratingProps: string[] = [];
  if (state.readOnly) {
    ratingProps.push("readOnly");
  }
  const ratingPropsStr =
    ratingProps.length > 0 ? ` ${ratingProps.join(" ")}` : "";

  const sizeProp = state.size === "md" ? "" : ` size={${SIZE_PX[state.size]}}`;
  const buttons = Array.from(
    { length: state.count },
    () => "      <RatingButton />"
  ).join("\n");

  return `import { Rating, RatingButton } from "${importPath}";

export function RatingPreview() {
  return (
    <Rating defaultValue={3}${sizeProp}${ratingPropsStr}>
${buttons}
    </Rating>
  );
}`;
}

function RatingPlaygroundPreview() {
  const { RatingModule, state } = useRatingPlayground();
  const { Rating, RatingButton } = RatingModule;

  return (
    <div className="flex min-h-[22rem] w-full items-center justify-center px-6 py-6">
      <Rating
        defaultValue={3}
        key={`${state.count}-${state.size}-${state.readOnly}`}
        readOnly={state.readOnly}
        size={SIZE_PX[state.size]}
      >
        {Array.from({ length: state.count }, (_, index) => (
          <RatingButton key={index} />
        ))}
      </Rating>
    </div>
  );
}

function RatingPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<RatingPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: RatingPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Rating"
    >
      <DocsPlaygroundSelectField
        label="Count"
        onChange={(value) => onChange({ count: Number(value) as 3 | 5 | 7 })}
        options={COUNT_OPTIONS}
        value={String(state.count) as "3" | "5" | "7"}
      />
      <DocsPlaygroundSelectField
        label="Size"
        onChange={(size) => onChange({ size })}
        options={SIZE_OPTIONS}
        value={state.size}
      />
      <DocsPlaygroundToggleField
        checked={state.readOnly}
        label="Read only"
        onChange={(readOnly) => onChange({ readOnly })}
      />
    </DocsPlaygroundPanel>
  );
}

type RatingPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function RatingPlaygroundProvider({
  RatingModule,
  importPath,
  children,
}: {
  RatingModule: RatingModule;
  importPath: string;
  children: (props: RatingPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<RatingPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<RatingPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateRatingCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <RatingPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <RatingPlaygroundContext.Provider value={{ RatingModule, state }}>
      {children({
        preview: <RatingPlaygroundPreview />,
        renderSettings,
      })}
    </RatingPlaygroundContext.Provider>
  );
}
