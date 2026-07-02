"use client";

import { type ReactNode, useEffect, useLayoutEffect, useState } from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { useDocStore } from "@/hooks/use-doc-store";
import { FaqPro, type FaqProItem } from "@/registry/faq-pro";

type FaqProPlaygroundState = {
  defaultOpenFirst: boolean;
  hideSearch: boolean;
  includeDisabled: boolean;
  includeKeywords: boolean;
  themed: boolean;
};

export const FAQ_PRO_DEFAULT_STATE: FaqProPlaygroundState = {
  defaultOpenFirst: true,
  hideSearch: false,
  includeDisabled: false,
  includeKeywords: true,
  themed: true,
};

const BASE_ITEMS: FaqProItem[] = [
  {
    id: "what-is-iconiq",
    question: "What is Iconiq?",
    answer:
      "Iconiq is an open-source library of motion-powered React components built around the shadcn registry workflow. Browse polished UI primitives, install them as local files, and adapt them inside your own codebase.",
    keywords: ["about", "overview", "library"],
  },
  {
    id: "install-iconiq",
    question: "How do I install an Iconiq component?",
    answer:
      "Install components with shadcn using commands like npx shadcn@latest add @iconiq/b-button, or use a direct registry URL from iconiqui.com/r/b-button.json.",
    keywords: ["setup", "shadcn", "registry", "cli"],
  },
  {
    id: "iconiq-free",
    question: "Is Iconiq free to use?",
    answer:
      "Yes. Iconiq is open source and free to use for personal and commercial projects.",
    keywords: ["pricing", "license", "cost"],
  },
  {
    id: "iconiq-support",
    question: "Where can I get help?",
    answer:
      "Open an issue on GitHub or start a discussion. Community support is available for setup, theming, and customization questions.",
    keywords: ["help", "contact", "community"],
  },
];

function buildItems(state: FaqProPlaygroundState): FaqProItem[] {
  const items = BASE_ITEMS.map((item) => {
    const next: FaqProItem = {
      id: item.id,
      question: item.question,
      answer: item.answer,
    };

    if (state.includeKeywords) {
      next.keywords = item.keywords;
    }

    return next;
  });

  if (state.includeDisabled) {
    items.push({
      id: "iconiq-enterprise",
      question: "Do you offer enterprise support? (coming soon)",
      answer: "Enterprise support is not available yet.",
      disabled: true,
    });
  }

  return items;
}

function serializeItem(item: FaqProItem) {
  const lines = [
    `    id: "${item.id}",`,
    `    question: ${JSON.stringify(item.question)},`,
    `    answer: ${JSON.stringify(item.answer)},`,
  ];

  if (item.keywords?.length) {
    lines.push(
      `    keywords: [${item.keywords.map((keyword) => `"${keyword}"`).join(", ")}],`
    );
  }

  if (item.disabled) {
    lines.push("    disabled: true,");
  }

  return `  {
${lines.join("\n")}
  }`;
}

function buildProps(state: FaqProPlaygroundState) {
  const props = ['className="w-full"'];

  if (state.defaultOpenFirst) {
    props.push("defaultOpenFirst");
  }

  if (state.hideSearch) {
    props.push("hideSearch");
  }

  if (!state.themed) {
    props.push("themed={false}");
  }

  props.push("items={items}");

  return props;
}

function generateFaqProCode(state: FaqProPlaygroundState, importPath: string) {
  const items = buildItems(state);
  const props = buildProps(state);

  return `"use client";

import { FaqPro, type FaqProItem } from "${importPath}";

const items: FaqProItem[] = [
${items.map(serializeItem).join(",\n")}
];

export function FaqProPreview() {
  return (
    <FaqPro
      ${props.join("\n      ")}
    />
  );
}`;
}

export function getFaqProDefaultUsageCode(importPath: string) {
  return generateFaqProCode(FAQ_PRO_DEFAULT_STATE, importPath);
}

function FaqProPlaygroundPreview({ state }: { state: FaqProPlaygroundState }) {
  const items = buildItems(state);

  return (
    <div className="flex w-full justify-center px-4 py-10">
      <FaqPro
        className="w-full"
        defaultOpenFirst={state.defaultOpenFirst}
        hideSearch={state.hideSearch}
        items={items}
        themed={state.themed}
      />
    </div>
  );
}

function FaqProPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<FaqProPlaygroundState>) => void;
  onClose: () => void;
  onReset: () => void;
  state: FaqProPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="FAQ Pro"
    >
      <DocsPlaygroundToggleField
        checked={!state.hideSearch}
        label="Search field"
        onChange={(showSearch) => onChange({ hideSearch: !showSearch })}
      />
      <DocsPlaygroundToggleField
        checked={state.defaultOpenFirst}
        label="Open first"
        onChange={(defaultOpenFirst) => onChange({ defaultOpenFirst })}
      />
      <DocsPlaygroundToggleField
        checked={state.includeKeywords}
        label="Keywords"
        onChange={(includeKeywords) => onChange({ includeKeywords })}
      />
      <DocsPlaygroundToggleField
        checked={state.includeDisabled}
        label="Disabled item"
        onChange={(includeDisabled) => onChange({ includeDisabled })}
      />
      <DocsPlaygroundToggleField
        checked={state.themed}
        label="Themed surface"
        onChange={(themed) => onChange({ themed })}
      />
    </DocsPlaygroundPanel>
  );
}

type FaqProPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

const IMPORT_PATH = "@/components/ui/faq-pro";

export function FaqProPlaygroundProvider({
  children,
}: {
  children: (props: FaqProPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<FaqProPlaygroundState>(
    FAQ_PRO_DEFAULT_STATE
  );

  const updateState = (next: Partial<FaqProPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(FAQ_PRO_DEFAULT_STATE);
  };

  useLayoutEffect(() => {
    setPlaygroundCode(generateFaqProCode(state, IMPORT_PATH));
  }, [setPlaygroundCode, state]);

  useEffect(() => {
    return () => {
      setPlaygroundCode(null);
    };
  }, [setPlaygroundCode]);

  const renderSettings = (onClose: () => void) => (
    <FaqProPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return (
    <>
      {children({
        preview: <FaqProPlaygroundPreview state={state} />,
        renderSettings,
      })}
    </>
  );
}
