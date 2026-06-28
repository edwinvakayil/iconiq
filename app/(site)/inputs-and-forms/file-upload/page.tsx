"use client";

import { type ReactNode, useEffect, useState } from "react";

import { SharedPrimitiveProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { fileUploadApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import {
  DocsPlaygroundClearButton,
  DocsPlaygroundPanel,
  DocsPlaygroundSelectField,
  DocsPlaygroundToggleField,
} from "@/components/docs/playground/docs-playground-fields";
import { LINK } from "@/constants";
import { useDocStore } from "@/hooks/use-doc-store";
import { FileUpload } from "@/registry/file-upload";

type AcceptPreset = "any" | "images" | "pdf";
type MaxFilesPreset = "unlimited" | "1" | "3";
type MaxSizePreset = "none" | "100kb" | "1mb";

type FileUploadPlaygroundState = {
  accept: AcceptPreset;
  disabled: boolean;
  invalid: boolean;
  maxFiles: MaxFilesPreset;
  maxSize: MaxSizePreset;
  multiple: boolean;
  preventDuplicates: boolean;
  required: boolean;
  showClearAll: boolean;
  showDescription: boolean;
};

const DEFAULT_STATE: FileUploadPlaygroundState = {
  accept: "any",
  disabled: false,
  invalid: false,
  maxFiles: "unlimited",
  maxSize: "none",
  multiple: true,
  preventDuplicates: false,
  required: false,
  showClearAll: true,
  showDescription: false,
};

const ACCEPT_OPTIONS: Array<{ label: string; value: AcceptPreset }> = [
  { label: "Any", value: "any" },
  { label: "Images", value: "images" },
  { label: "PDF", value: "pdf" },
];

const MAX_FILES_OPTIONS: Array<{ label: string; value: MaxFilesPreset }> = [
  { label: "Unlimited", value: "unlimited" },
  { label: "1", value: "1" },
  { label: "3", value: "3" },
];

const MAX_SIZE_OPTIONS: Array<{ label: string; value: MaxSizePreset }> = [
  { label: "None", value: "none" },
  { label: "100 KB", value: "100kb" },
  { label: "1 MB", value: "1mb" },
];

function resolveAccept(preset: AcceptPreset) {
  if (preset === "images") return "image/*";
  if (preset === "pdf") return ".pdf,application/pdf";
  return undefined;
}

function resolveMaxFiles(preset: MaxFilesPreset) {
  if (preset === "1") return 1;
  if (preset === "3") return 3;
  return undefined;
}

function resolveMaxSize(preset: MaxSizePreset) {
  if (preset === "100kb") return 100 * 1024;
  if (preset === "1mb") return 1024 * 1024;
  return undefined;
}

function formatOptionalLines(state: FileUploadPlaygroundState) {
  const lines: string[] = [];

  const accept = resolveAccept(state.accept);
  if (accept) lines.push(`accept="${accept}"`);
  if (!state.multiple) lines.push("multiple={false}");

  const maxFiles = resolveMaxFiles(state.maxFiles);
  if (typeof maxFiles === "number") lines.push(`maxFiles={${maxFiles}}`);

  const maxSize = resolveMaxSize(state.maxSize);
  if (typeof maxSize === "number") lines.push(`maxSize={${maxSize}}`);

  if (state.disabled) lines.push("disabled");
  if (state.required) lines.push("required");
  if (state.invalid) lines.push("invalid");
  if (state.preventDuplicates) lines.push("preventDuplicates");
  if (!state.showClearAll) lines.push("showClearAll={false}");
  if (state.showDescription) {
    lines.push('description="Attach screenshots or PDFs for review."');
  }

  if (lines.length === 0) return "";
  return `\n        ${lines.join("\n        ")}`;
}

function generateFileUploadCode(state: FileUploadPlaygroundState) {
  return `"use client";

import { FileUpload } from "@/components/ui/file-upload";

export function FileUploadPreview() {
  return (
    <div className="w-full">
      <FileUpload${formatOptionalLines(state)} />
    </div>
  );
}`;
}

function FileUploadPlaygroundPreview({
  state,
}: {
  state: FileUploadPlaygroundState;
}) {
  return (
    <div className="w-full px-2 py-4">
      <FileUpload
        accept={resolveAccept(state.accept)}
        description={
          state.showDescription
            ? "Attach screenshots or PDFs for review."
            : undefined
        }
        disabled={state.disabled}
        invalid={state.invalid}
        maxFiles={resolveMaxFiles(state.maxFiles)}
        maxSize={resolveMaxSize(state.maxSize)}
        multiple={state.multiple}
        preventDuplicates={state.preventDuplicates}
        required={state.required}
        showClearAll={state.showClearAll}
      />
    </div>
  );
}

function FileUploadPlaygroundSettings({
  onChange,
  onClose,
  onReset,
  state,
}: {
  onChange: (next: Partial<FileUploadPlaygroundState>) => void;
  onClose?: () => void;
  onReset: () => void;
  state: FileUploadPlaygroundState;
}) {
  return (
    <DocsPlaygroundPanel
      footer={<DocsPlaygroundClearButton label="Reset" onClick={onReset} />}
      onClose={onClose}
      title="File Upload"
    >
      <DocsPlaygroundSelectField
        label="Accept"
        onChange={(accept) => onChange({ accept })}
        options={ACCEPT_OPTIONS}
        value={state.accept}
      />
      <DocsPlaygroundSelectField
        label="Max files"
        onChange={(maxFiles) => onChange({ maxFiles })}
        options={MAX_FILES_OPTIONS}
        value={state.maxFiles}
      />
      <DocsPlaygroundSelectField
        label="Max size"
        onChange={(maxSize) => onChange({ maxSize })}
        options={MAX_SIZE_OPTIONS}
        value={state.maxSize}
      />
      <DocsPlaygroundToggleField
        checked={state.multiple}
        label="Multiple"
        onChange={(multiple) => onChange({ multiple })}
      />
      <DocsPlaygroundToggleField
        checked={state.preventDuplicates}
        label="Prevent duplicates"
        onChange={(preventDuplicates) => onChange({ preventDuplicates })}
      />
      <DocsPlaygroundToggleField
        checked={state.showClearAll}
        label="Clear all"
        onChange={(showClearAll) => onChange({ showClearAll })}
      />
      <DocsPlaygroundToggleField
        checked={state.showDescription}
        label="Description"
        onChange={(showDescription) => onChange({ showDescription })}
      />
      <DocsPlaygroundToggleField
        checked={state.required}
        label="Required"
        onChange={(required) => onChange({ required })}
      />
      <DocsPlaygroundToggleField
        checked={state.invalid}
        label="Invalid"
        onChange={(invalid) => onChange({ invalid })}
      />
      <DocsPlaygroundToggleField
        checked={state.disabled}
        label="Disabled"
        onChange={(disabled) => onChange({ disabled })}
      />
    </DocsPlaygroundPanel>
  );
}

function FileUploadPlaygroundProvider({
  children,
}: {
  children: (props: {
    preview: ReactNode;
    renderSettings: (onClose: () => void) => ReactNode;
  }) => ReactNode;
}) {
  const { setPlaygroundCode } = useDocStore();
  const [state, setState] = useState<FileUploadPlaygroundState>(DEFAULT_STATE);

  const updateState = (next: Partial<FileUploadPlaygroundState>) => {
    setState((current) => ({ ...current, ...next }));
  };

  const resetState = () => {
    setState(DEFAULT_STATE);
  };

  useEffect(() => {
    setPlaygroundCode(generateFileUploadCode(state));
  }, [setPlaygroundCode, state]);

  useEffect(
    () => () => {
      setPlaygroundCode(null);
    },
    [setPlaygroundCode]
  );

  const renderSettings = (onClose: () => void) => (
    <FileUploadPlaygroundSettings
      onChange={updateState}
      onClose={onClose}
      onReset={resetState}
      state={state}
    />
  );

  return children({
    preview: <FileUploadPlaygroundPreview state={state} />,
    renderSettings,
  });
}

const usageCode = `"use client";

import { FileUpload } from "@/components/ui/file-upload";

export function FileUploadPreview() {
  return (
    <div className="w-full">
      <FileUpload
        accept="image/*,.pdf"
        maxFiles={5}
        maxSize={1024 * 1024}
        preventDuplicates
      />
    </div>
  );
}`;

export default function FileUploadPage() {
  return (
    <FileUploadPlaygroundProvider>
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={[
            { label: "Docs", href: "/" },
            { label: "Inputs & Forms" },
            { label: "File Upload" },
          ]}
          componentName="file-upload"
          description="File upload surface with previews, validation, queue states, and optional real upload hooks."
          details={fileUploadApiDetails}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/file-upload/page.tsx`}
          headerActions={<SharedPrimitiveProviderSwitch />}
          pageUrl="/inputs-and-forms/file-upload"
          preview={preview}
          previewClassName="min-h-[20rem] lg:col-span-8"
          previewDescription="Tune accept rules, limits, validation, and disabled states from the playground."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="File Upload"
          railNotes={[
            "Drop, click, or paste files onto the surface to add them to the queue.",
            "Use onUpload for real uploads, or rely on built-in simulated progress for demos.",
            "The hidden file input stays synced to the queue for native form submission.",
            "Rejected files surface inline errors and also flow through onReject when provided.",
          ]}
          title="File Upload"
          usageCode={usageCode}
          usageDescription="Use the uploader as-is for the built-in queue UI, then hook into onFilesChange, onReject, or onUpload when you need validation, real uploads, or form integration."
          v0PageCode={usageCode}
        />
      )}
    </FileUploadPlaygroundProvider>
  );
}
