"use client";

import type {
  ClipboardEvent,
  ComponentType,
  DragEvent,
  FormEvent,
  KeyboardEvent,
} from "react";
import { useMemo, useRef, useState } from "react";

import {
  type PrimitiveProvider,
  ProviderSwitch,
} from "@/app/(site)/components/_components/provider-switch";
import { selectionToolbarApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as BaseSelectionToolbar from "@/registry/b-selection-toolbar";
import * as RadixSelectionToolbar from "@/registry/r-selection-toolbar";

type SelectionToolbarModule = {
  SelectionToolbar: ComponentType<{
    containerRef: React.RefObject<HTMLElement | null>;
    reducedMotion?: boolean;
  }>;
};

type ProviderConfig = {
  componentName: "b-selection-toolbar" | "r-selection-toolbar";
  dependencyLabel: string;
  libraryLabel: string;
  notes: string[];
  ui: SelectionToolbarModule;
  usageCode: string;
};

const previewText =
  "Select any phrase in this sentence to reveal the toolbar, then try bold or underline on the highlighted text. The interaction stays scoped to this text surface, which makes it useful for lightweight notes, comments, or internal writing tools.";

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Components" },
  { label: "Selection Toolbar" },
];

function isBlockedMutationInput(inputType: string) {
  return (
    inputType.startsWith("insert") ||
    inputType.startsWith("delete") ||
    inputType.startsWith("history")
  );
}

function createUsageCode(componentName: ProviderConfig["componentName"]) {
  return `"use client";

import type {
  ClipboardEvent,
  DragEvent,
  FormEvent,
  KeyboardEvent,
} from "react";
import { useRef } from "react";
import { SelectionToolbar } from "@/components/ui/${componentName}";

const previewText =
  "Select any phrase in this sentence to reveal the toolbar, then try bold or underline on the highlighted text. The interaction stays scoped to this text surface, which makes it useful for lightweight notes, comments, or internal writing tools.";

function isBlockedMutationInput(inputType: string) {
  return (
    inputType.startsWith("insert") ||
    inputType.startsWith("delete") ||
    inputType.startsWith("history")
  );
}

export function SelectionToolbarPreview() {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const handleBeforeInput = (event: FormEvent<HTMLDivElement>) => {
    const inputType = (event.nativeEvent as InputEvent).inputType ?? "";

    if (isBlockedMutationInput(inputType)) {
      event.preventDefault();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key === "Backspace" ||
      event.key === "Delete" ||
      event.key === "Enter" ||
      (event.key.length === 1 &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey)
    ) {
      event.preventDefault();
    }
  };

  const handleClipboard = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <SelectionToolbar containerRef={editorRef} />

      <div className="w-full max-w-3xl">
        <div
          className="text-[15px] text-foreground leading-7 outline-none sm:text-[16px]"
          contentEditable
          onBeforeInput={handleBeforeInput}
          onCut={handleClipboard}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
          onPaste={handleClipboard}
          ref={editorRef}
          spellCheck={false}
          suppressContentEditableWarning
        >
          {previewText}
        </div>
      </div>
    </>
  );
}`;
}

const usageCodeByProvider: Record<ProviderConfig["componentName"], string> = {
  "b-selection-toolbar": createUsageCode("b-selection-toolbar"),
  "r-selection-toolbar": createUsageCode("r-selection-toolbar"),
};

function SelectionToolbarPreview({ ui }: { ui: SelectionToolbarModule }) {
  const { SelectionToolbar } = ui;
  const editorRef = useRef<HTMLDivElement | null>(null);

  const handleBeforeInput = (event: FormEvent<HTMLDivElement>) => {
    const inputType = (event.nativeEvent as InputEvent).inputType ?? "";

    if (isBlockedMutationInput(inputType)) {
      event.preventDefault();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key === "Backspace" ||
      event.key === "Delete" ||
      event.key === "Enter" ||
      (event.key.length === 1 &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey)
    ) {
      event.preventDefault();
    }
  };

  const handleClipboard = (event: ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <SelectionToolbar containerRef={editorRef} />

      <div className="w-full max-w-3xl">
        <div
          className="text-[15px] text-foreground leading-7 outline-none sm:text-[16px]"
          contentEditable
          onBeforeInput={handleBeforeInput}
          onCut={handleClipboard}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
          onPaste={handleClipboard}
          ref={editorRef}
          spellCheck={false}
          suppressContentEditableWarning
        >
          {previewText}
        </div>
      </div>
    </>
  );
}

function getDetails(provider: ProviderConfig): DetailItem[] {
  return selectionToolbarApiDetails.map((item) => {
    if (item.id === "selectiontoolbar") {
      return {
        ...item,
        summary: `Floating formatting toolbar for editable text with the same Iconiq selection tracking, button shell, and reveal motion layered over ${provider.libraryLabel} toolbar primitives.`,
        notes: [
          provider.libraryLabel === "Base UI"
            ? "Uses Base UI toolbar root and button primitives while keeping the same selectionchange tracking, mousedown command behavior, and visible shell as the core component."
            : "Uses Radix toolbar root and button primitives while keeping the same selectionchange tracking, mousedown command behavior, and visible shell as the core component.",
          "Formatting actions still run on mousedown so the current browser selection is preserved while bold, italic, or underline is applied.",
          "Active states are still read from document.queryCommandState for the same three formatting commands the toolbar exposes.",
        ],
      };
    }

    if (item.id === "selectiontoolbar-positioning") {
      return {
        ...item,
        notes: [
          "The toolbar is still portaled to document.body and positioned from the live range rectangle returned by the Selection API.",
          "The visible reveal keeps the same fixed-position translate and scale transition as the core selection toolbar component.",
          "The current implementation still depends on document.execCommand for inline formatting, which keeps the install surface lightweight for native contentEditable text.",
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

export default function RadixBaseSelectionToolbarPage() {
  const [selectedProvider, setSelectedProvider] =
    useState<PrimitiveProvider>("radix");

  const provider = useMemo<ProviderConfig>(() => {
    if (selectedProvider === "base") {
      return {
        componentName: "b-selection-toolbar",
        dependencyLabel: "@base-ui/react, lucide-react",
        libraryLabel: "Base UI",
        notes: [
          "Installs a Base UI-backed selection toolbar with the same containerRef API and the same visible toolbar shell as the core component.",
          "Keeps the original fixed-position reveal, native rich-text commands, and editable-surface scoping behavior intact.",
        ],
        ui: BaseSelectionToolbar,
        usageCode: usageCodeByProvider["b-selection-toolbar"],
      };
    }

    return {
      componentName: "r-selection-toolbar",
      dependencyLabel: "@radix-ui/react-toolbar, lucide-react",
      libraryLabel: "Radix UI",
      notes: [
        "Installs a Radix-backed selection toolbar with the same containerRef API and the same visible toolbar shell as the core component.",
        "Keeps the original fixed-position reveal, native rich-text commands, and editable-surface scoping behavior intact.",
      ],
      ui: RadixSelectionToolbar,
      usageCode: usageCodeByProvider["r-selection-toolbar"],
    };
  }, [selectedProvider]);

  const details = useMemo(() => getDetails(provider), [provider]);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName={provider.componentName}
      description="Compare the same floating text-selection toolbar on Radix UI and Base UI."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/components/selection-toolbar/page.tsx`}
      headerActions={
        <ProviderSwitch
          onSelect={setSelectedProvider}
          selectedProvider={selectedProvider}
        />
      }
      itemSlug="selection-toolbar"
      pageUrl="/components/selection-toolbar"
      preview={<SelectionToolbarPreview ui={provider.ui} />}
      previewClassName="min-h-[24rem] overflow-visible"
      title="Selection Toolbar"
      usageCode={provider.usageCode}
      usageDescription="Switch libraries above to update the install command, registry JSON, preview code, and generated file set together."
      v0PageCode={provider.usageCode}
    />
  );
}
