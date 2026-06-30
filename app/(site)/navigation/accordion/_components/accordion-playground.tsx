"use client";

import {
  type ComponentType,
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSegmentedField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import type { AccordionVariant } from "@/registry/r-accordion";

type AccordionRootProps = {
  children?: ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultValue?: string[];
  multiple?: boolean;
  onValueChange?: (value: string[]) => void;
  value?: string[];
  variant?: AccordionVariant;
};

type AccordionContentProps = {
  children?: ReactNode;
  className?: string;
  forceMount?: boolean;
  keepMounted?: boolean;
};

type AccordionItemProps = {
  children?: ReactNode;
  className?: string;
  value: string;
};

type AccordionTriggerProps = {
  children?: ReactNode;
  className?: string;
};

export type AccordionModule = {
  Accordion: ComponentType<AccordionRootProps>;
  AccordionContent: ComponentType<AccordionContentProps>;
  AccordionItem: ComponentType<AccordionItemProps>;
  AccordionTrigger: ComponentType<AccordionTriggerProps>;
};

export type AccordionDemoItem = {
  content: string;
  id: string;
  title: string;
};

export const ACCORDION_DEMO_ITEMS: AccordionDemoItem[] = [
  {
    id: "workflow",
    title: "How should I use this page?",
    content:
      "Switch libraries above. The preview, install command, and registry files update together.",
  },
  {
    id: "api",
    title: "Does the public API stay the same?",
    content:
      "Yes. Both entries export the same compound parts, variants, and multi-open behavior.",
  },
  {
    id: "install",
    title: "What changes when I switch providers?",
    content: "Only the underlying implementation and dependency list change.",
  },
];

type AccordionPlaygroundState = {
  collapsible: boolean;
  defaultOpenFirst: boolean;
  keepMounted: boolean;
  multiple: boolean;
  variant: AccordionVariant;
};

export const ACCORDION_DEFAULT_STATE: AccordionPlaygroundState = {
  collapsible: true,
  defaultOpenFirst: true,
  keepMounted: true,
  multiple: false,
  variant: "default",
};

const VARIANT_OPTIONS: Array<{ label: string; value: AccordionVariant }> = [
  { label: "Default", value: "default" },
  { label: "Quiet", value: "quiet" },
];

const AccordionPlaygroundContext = createContext<{
  state: AccordionPlaygroundState;
  ui: AccordionModule;
} | null>(null);

function useAccordionPlayground() {
  const context = useContext(AccordionPlaygroundContext);

  if (!context) {
    throw new Error(
      "AccordionPlayground components must be used within AccordionPlaygroundProvider."
    );
  }

  return context;
}

function buildAccordionRootProps(state: AccordionPlaygroundState) {
  const props: string[] = ['className="w-full max-w-xl"'];

  if (state.variant !== "default") {
    props.push(`variant="${state.variant}"`);
  }

  if (state.multiple) {
    props.push("multiple");
  }

  if (!(state.multiple || state.collapsible)) {
    props.push("collapsible={false}");
  }

  if (state.defaultOpenFirst) {
    props.push('defaultValue={["workflow"]}');
  }

  return props.map((prop) => `      ${prop}`).join("\n");
}

function buildAccordionContentProps(state: AccordionPlaygroundState) {
  if (state.keepMounted) {
    return "";
  }

  return " keepMounted={false}";
}

export function generateAccordionCode(
  state: AccordionPlaygroundState,
  importPath: string
) {
  const rootProps = buildAccordionRootProps(state);
  const contentProps = buildAccordionContentProps(state);

  const itemsCode = ACCORDION_DEMO_ITEMS.map(
    (item) => `      <AccordionItem value="${item.id}">
        <AccordionTrigger>${item.title}</AccordionTrigger>
        <AccordionContent${contentProps}>
          ${item.content}
        </AccordionContent>
      </AccordionItem>`
  ).join("\n");

  return `"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "${importPath}";

export function AccordionPreview() {
  return (
    <Accordion
${rootProps}
    >
${itemsCode}
    </Accordion>
  );
}`;
}

export function getAccordionDefaultUsageCode(importPath: string) {
  return generateAccordionCode(ACCORDION_DEFAULT_STATE, importPath);
}

function AccordionPlaygroundPreview() {
  const { state, ui } = useAccordionPlayground();
  const { Accordion, AccordionContent, AccordionItem, AccordionTrigger } = ui;

  const remountKey = useMemo(
    () =>
      [
        state.variant,
        state.multiple,
        state.collapsible,
        state.defaultOpenFirst,
        state.keepMounted,
      ].join(":"),
    [state]
  );

  const contentProps = state.keepMounted ? undefined : { keepMounted: false };

  return (
    <div className="flex min-h-[20rem] w-full items-start justify-center p-6">
      <Accordion
        className="w-full max-w-xl"
        collapsible={state.multiple ? undefined : state.collapsible}
        defaultValue={state.defaultOpenFirst ? ["workflow"] : undefined}
        key={remountKey}
        multiple={state.multiple || undefined}
        variant={state.variant}
      >
        {ACCORDION_DEMO_ITEMS.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent {...contentProps}>
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function AccordionPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<AccordionPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: AccordionPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Accordion"
    >
      <DocsPlaygroundSegmentedField
        label="Variant"
        onChange={(variant) => onChange({ variant })}
        options={VARIANT_OPTIONS}
        value={state.variant}
      />
      <DocsPlaygroundToggleField
        checked={state.multiple}
        label="Multiple open"
        onChange={(multiple) => onChange({ multiple })}
      />
      {state.multiple ? null : (
        <DocsPlaygroundToggleField
          checked={state.collapsible}
          label="Collapsible"
          onChange={(collapsible) => onChange({ collapsible })}
        />
      )}
      <DocsPlaygroundToggleField
        checked={state.defaultOpenFirst}
        label="Default open (first item)"
        onChange={(defaultOpenFirst) => onChange({ defaultOpenFirst })}
      />
      <DocsPlaygroundToggleField
        checked={state.keepMounted}
        label="Keep mounted"
        onChange={(keepMounted) => onChange({ keepMounted })}
      />
    </DocsPlaygroundPanel>
  );
}

type AccordionPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function AccordionPlaygroundProvider({
  children,
  importPath,
  ui,
}: {
  children: (props: AccordionPlaygroundRenderProps) => ReactNode;
  importPath: string;
  ui: AccordionModule;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<AccordionPlaygroundState>(
    ACCORDION_DEFAULT_STATE
  );

  const updateState = (next: Partial<AccordionPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(ACCORDION_DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateAccordionCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <AccordionPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <AccordionPlaygroundContext.Provider value={{ state, ui }}>
      {children({
        preview: <AccordionPlaygroundPreview />,
        renderSettings,
      })}
    </AccordionPlaygroundContext.Provider>
  );
}
