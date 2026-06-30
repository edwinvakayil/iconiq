"use client";

import { Bold, Italic, Underline } from "lucide-react";
import {
  type ClipboardEvent,
  type ComponentType,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { docsPlaygroundTextInputClassName } from "@/components/docs/playground/docs-playground-styles";
import { useDocStore } from "@/hooks/use-doc-store";
import { cn } from "@/lib/utils";
import {
  type SelectionToolbarItem,
  SelectionToolbarPresets,
  type SelectionToolbarProps,
} from "@/registry/selectiontoolbar";

type SelectionToolbarModule = {
  SelectionToolbar: ComponentType<SelectionToolbarProps>;
};

type SelectionToolbarSide = NonNullable<SelectionToolbarProps["side"]>;

type SelectionToolbarPlaygroundState = {
  disabled: boolean;
  editable: boolean;
  offset: number;
  previewText: string;
  showCopy: boolean;
  showLink: boolean;
  showStrikeThrough: boolean;
  side: SelectionToolbarSide;
};

export const SELECTION_TOOLBAR_DEMO_TEXT =
  "Select any phrase here to reveal the toolbar, then try bold, underline, link, or copy on the highlight.";

export const SELECTION_TOOLBAR_DEFAULT_STATE: SelectionToolbarPlaygroundState =
  {
    disabled: false,
    editable: true,
    offset: 10,
    previewText: SELECTION_TOOLBAR_DEMO_TEXT,
    showCopy: true,
    showLink: true,
    showStrikeThrough: true,
    side: "auto",
  };

const SIDE_OPTIONS: Array<{ label: string; value: SelectionToolbarSide }> = [
  { label: "Auto", value: "auto" },
  { label: "Above", value: "top" },
  { label: "Below", value: "bottom" },
];

const OFFSET_OPTIONS = [
  { label: "8px", value: "8" },
  { label: "10px", value: "10" },
  { label: "16px", value: "16" },
  { label: "24px", value: "24" },
];

function isBlockedMutationInput(inputType: string) {
  return (
    inputType.startsWith("insert") ||
    inputType.startsWith("delete") ||
    inputType.startsWith("history")
  );
}

function buildItems(
  state: SelectionToolbarPlaygroundState
): SelectionToolbarItem[] | undefined {
  const items: SelectionToolbarItem[] = [
    {
      command: "bold",
      icon: <Bold className="h-4 w-4" strokeWidth={2.5} />,
      id: "bold",
      label: "Bold",
    },
    {
      command: "italic",
      icon: <Italic className="h-4 w-4" strokeWidth={2.5} />,
      id: "italic",
      label: "Italic",
    },
    {
      command: "underline",
      icon: <Underline className="h-4 w-4" strokeWidth={2.5} />,
      id: "underline",
      label: "Underline",
    },
  ];

  if (state.showStrikeThrough) {
    items.push(SelectionToolbarPresets.strikeThrough);
  }

  if (state.showLink) {
    items.push(SelectionToolbarPresets.link);
  }

  if (state.showCopy) {
    items.push(SelectionToolbarPresets.copy);
  }

  if (state.showStrikeThrough || state.showLink || state.showCopy) {
    return items;
  }

  return undefined;
}

function toolbarPropsFromState(
  state: SelectionToolbarPlaygroundState
): Pick<SelectionToolbarProps, "disabled" | "items" | "offset" | "side"> {
  return {
    disabled: state.disabled,
    items: buildItems(state),
    offset: state.offset,
    side: state.side,
  };
}

export function generateSelectionToolbarCode(
  state: SelectionToolbarPlaygroundState,
  importPath: string
) {
  const optionalProps: string[] = [];

  if (state.side !== "auto") {
    optionalProps.push(`side="${state.side}"`);
  }

  if (state.offset !== 10) {
    optionalProps.push(`offset={${state.offset}}`);
  }

  if (state.disabled) {
    optionalProps.push("disabled");
  }

  const extraItems: string[] = [];

  if (state.showStrikeThrough) {
    extraItems.push("SelectionToolbarPresets.strikeThrough");
  }

  if (state.showLink) {
    extraItems.push("SelectionToolbarPresets.link");
  }

  if (state.showCopy) {
    extraItems.push("SelectionToolbarPresets.copy");
  }

  const itemsProp =
    extraItems.length > 0
      ? `\n        items={[\n          { command: "bold", id: "bold", label: "Bold" },\n          { command: "italic", id: "italic", label: "Italic" },\n          { command: "underline", id: "underline", label: "Underline" },\n          ${extraItems.join(",\n          ")},\n        ]}`
      : "";

  const propsBlock =
    optionalProps.length > 0 || itemsProp.length > 0
      ? `\n        containerRef={editorRef}${itemsProp}${optionalProps.length > 0 ? `\n        ${optionalProps.join("\n        ")}` : ""}\n      `
      : "\n        containerRef={editorRef}\n      ";

  return `"use client";

import type {
  ClipboardEvent,
  DragEvent,
  FormEvent,
  KeyboardEvent,
} from "react";
import { useRef } from "react";
import { SelectionToolbar${extraItems.length > 0 ? ", SelectionToolbarPresets" : ""} } from "${importPath}";

const previewText = ${JSON.stringify(state.previewText)};

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
      <SelectionToolbar${propsBlock}/>

      <div className="mx-auto w-full max-w-xl text-center">
        <div
          aria-label="Editable preview"
          className="text-balance text-[15px] text-foreground leading-7 outline-none sm:text-[16px]"
          contentEditable
          id="selection-toolbar-editor"
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

function SelectionToolbarEditorPreview({
  SelectionToolbar,
  state,
}: {
  SelectionToolbar: ComponentType<SelectionToolbarProps>;
  state: SelectionToolbarPlaygroundState;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarProps = useMemo(() => toolbarPropsFromState(state), [state]);

  const handleBeforeInput = (event: FormEvent<HTMLDivElement>) => {
    if (!state.editable) {
      event.preventDefault();
      return;
    }

    const inputType = (event.nativeEvent as InputEvent).inputType ?? "";

    if (isBlockedMutationInput(inputType)) {
      event.preventDefault();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!state.editable) {
      event.preventDefault();
      return;
    }

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
    if (!state.editable) {
      event.preventDefault();
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    if (!state.editable) {
      event.preventDefault();
    }
  };

  return (
    <>
      <SelectionToolbar
        {...toolbarProps}
        aria-controls="selection-toolbar-editor"
        containerRef={editorRef}
      />

      <div className="mx-auto w-full max-w-xl text-center">
        <div
          className={cn(
            "text-balance text-[15px] leading-7 outline-none sm:text-[16px]",
            state.editable
              ? "text-foreground"
              : "cursor-default text-muted-foreground"
          )}
          contentEditable={state.editable}
          id="selection-toolbar-editor"
          onBeforeInput={handleBeforeInput}
          onCut={handleClipboard}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
          onPaste={handleClipboard}
          ref={editorRef}
          spellCheck={false}
          suppressContentEditableWarning
        >
          {state.previewText}
        </div>
      </div>
    </>
  );
}

function SelectionToolbarPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<SelectionToolbarPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: SelectionToolbarPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton onClick={onReset} />}
      onClose={onClose}
      title="Selection Toolbar"
    >
      <label className="flex flex-col gap-1.5">
        <span className="font-medium text-foreground text-xs">
          Preview text
        </span>
        <textarea
          className={cn(docsPlaygroundTextInputClassName, "min-h-24 resize-y")}
          onChange={(event) => onChange({ previewText: event.target.value })}
          value={state.previewText}
        />
      </label>
      <DocsPlaygroundSelectField
        label="Placement"
        onChange={(side) => onChange({ side })}
        options={SIDE_OPTIONS}
        value={state.side}
      />
      <DocsPlaygroundSelectField
        label="Offset"
        onChange={(offset) => onChange({ offset: Number(offset) })}
        options={OFFSET_OPTIONS}
        value={String(state.offset)}
      />
      <DocsPlaygroundToggleField
        checked={state.showStrikeThrough}
        label="Strikethrough"
        onChange={(showStrikeThrough) => onChange({ showStrikeThrough })}
      />
      <DocsPlaygroundToggleField
        checked={state.showLink}
        label="Link"
        onChange={(showLink) => onChange({ showLink })}
      />
      <DocsPlaygroundToggleField
        checked={state.showCopy}
        label="Copy"
        onChange={(showCopy) => onChange({ showCopy })}
      />
      <DocsPlaygroundToggleField
        checked={state.editable}
        label="Editable surface"
        onChange={(editable) => onChange({ editable })}
      />
      <DocsPlaygroundToggleField
        checked={state.disabled}
        label="Disabled"
        onChange={(disabled) => onChange({ disabled })}
      />
    </DocsPlaygroundPanel>
  );
}

type SelectionToolbarPlaygroundRenderProps = {
  preview: ReactNode;
  renderSettings: (onClose: () => void) => ReactNode;
};

export function SelectionToolbarPlaygroundProvider({
  SelectionToolbarModule,
  importPath,
  children,
}: {
  SelectionToolbarModule: SelectionToolbarModule;
  importPath: string;
  children: (props: SelectionToolbarPlaygroundRenderProps) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<SelectionToolbarPlaygroundState>(
    SELECTION_TOOLBAR_DEFAULT_STATE
  );

  const updateState = (next: Partial<SelectionToolbarPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(SELECTION_TOOLBAR_DEFAULT_STATE);
  };

  useLayoutEffect(() => {
    setPlaygroundCode(generateSelectionToolbarCode(state, importPath));
  }, [importPath, setPlaygroundCode, state]);

  useEffect(() => {
    return () => {
      setPlaygroundCode(null);
    };
  }, [setPlaygroundCode]);

  const renderSettings = (onClose: () => void) => (
    <SelectionToolbarPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  const preview = (
    <SelectionToolbarEditorPreview
      SelectionToolbar={SelectionToolbarModule.SelectionToolbar}
      state={state}
    />
  );

  return <>{children({ preview, renderSettings })}</>;
}
