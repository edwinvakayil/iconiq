"use client";

import type {
  ClipboardEvent,
  DragEvent,
  FormEvent,
  KeyboardEvent,
} from "react";
import { useRef } from "react";

import { selectionToolbarApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { SelectionToolbar } from "@/registry/selectiontoolbar";

const previewText =
  "Select any phrase in this sentence to reveal the toolbar, then try bold or underline on the highlighted text. The interaction stays scoped to this text surface, which makes it useful for lightweight notes, comments, or internal writing tools.";

function isBlockedMutationInput(inputType: string) {
  return (
    inputType.startsWith("insert") ||
    inputType.startsWith("delete") ||
    inputType.startsWith("history")
  );
}

const usageCode = `"use client";

import { useRef } from "react";
import { SelectionToolbar } from "@/components/ui/selectiontoolbar";

const previewText =
  "Select any phrase in this sentence to reveal the toolbar, then try bold or underline on the highlighted text. The interaction stays scoped to this text surface, which makes it useful for lightweight notes, comments, or internal writing tools.";

export function SelectionToolbarPreview() {
  const editorRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <SelectionToolbar containerRef={editorRef} />

      <div
        ref={editorRef}
        className="text-[15px] text-foreground leading-7 outline-none"
        contentEditable
        spellCheck={false}
        suppressContentEditableWarning
      >
        {previewText}
      </div>
    </>
  );
}`;

function SelectionToolbarPreview() {
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

export default function SelectionToolbarPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Selection Toolbar" },
      ]}
      componentName="selectiontoolbar"
      description="Floating inline text formatter for contentEditable surfaces. It tracks the current text selection, anchors itself above the selected range, and exposes quick bold, italic, and underline actions."
      details={selectionToolbarApiDetails}
      preview={<SelectionToolbarPreview />}
      previewClassName="min-h-[24rem] overflow-visible"
      title="Selection Toolbar"
      usageCode={usageCode}
      usageDescription="Mount the toolbar next to the editable surface, pass the same container ref into `SelectionToolbar`, and let the browser selection drive visibility and command state."
    />
  );
}
