"use client";

import {
  ArrowUpRight,
  Check,
  FileText,
  ImageIcon,
  Music,
  Plus,
  RefreshCw,
  Video,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react";
import {
  forwardRef,
  type Ref,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const controlCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

export type FileUploadStatus = "uploading" | "done" | "error";

export type FileUploadRejectReason =
  | "accept"
  | "max-size"
  | "max-files"
  | "duplicate"
  | "validation"
  | "disabled";

export type FileUploadItem = {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: FileUploadStatus;
  error?: string;
};

export type FileUploadUploadContext = {
  setProgress: (progress: number) => void;
};

export interface FileUploadProps {
  accept?: string;
  ariaDescribedBy?: string;
  ariaLabel?: string;
  browseLabel?: string;
  className?: string;
  clearAllLabel?: string;
  defaultValue?: File[];
  description?: string;
  disabled?: boolean;
  dropzoneDescription?: string;
  dropzoneTitle?: string;
  id?: string;
  invalid?: boolean;
  libraryLabel?: string;
  maxFiles?: number;
  maxSize?: number;
  multiple?: boolean;
  name?: string;
  onFileRemove?: (file: File, nextFiles: File[]) => void;
  onFilesChange?: (files: File[]) => void;
  onReject?: (
    files: File[],
    reason: FileUploadRejectReason,
    message: string
  ) => void;
  onUpload?: (file: File, context: FileUploadUploadContext) => Promise<void>;
  onUploadComplete?: (files: File[]) => void;
  onValueChange?: (items: FileUploadItem[]) => void;
  preventDuplicates?: boolean;
  required?: boolean;
  showClearAll?: boolean;
  simulateUpload?: boolean;
  validateFile?: (file: File) => boolean | string;
  value?: FileUploadItem[];
}

const clampProgress = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
};

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const resolveMaxFiles = (maxFiles?: number) => {
  if (typeof maxFiles !== "number" || !Number.isFinite(maxFiles))
    return undefined;
  return Math.max(0, Math.floor(maxFiles));
};

const resolveMaxSize = (maxSize?: number) => {
  if (
    typeof maxSize !== "number" ||
    !Number.isFinite(maxSize) ||
    maxSize <= 0
  ) {
    return undefined;
  }
  return maxSize;
};

const buildFileId = (file: File) =>
  `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`;

const fileSignature = (file: File) =>
  `${file.name}:${file.size}:${file.lastModified}`;

const matchesAccept = (file: File, accept?: string) => {
  if (!accept?.trim()) return true;

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return accept
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .some((entry) => {
      if (!entry) return false;
      if (entry.endsWith("/*")) {
        const prefix = entry.slice(0, -1);
        return fileType.startsWith(prefix);
      }
      if (entry.startsWith(".")) {
        return fileName.endsWith(entry);
      }
      if (entry.includes("/")) {
        return fileType === entry;
      }
      return fileName.endsWith(`.${entry}`) || fileType === entry;
    });
};

const formatAcceptHint = (accept: string) =>
  accept
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .join(", ");

const buildDropzoneHint = ({
  accept,
  maxFiles,
  maxSize,
}: {
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
}) => {
  const parts: string[] = [];

  if (accept?.trim()) {
    parts.push(formatAcceptHint(accept));
  } else {
    parts.push("Images, videos, audio, or documents");
  }

  if (typeof maxSize === "number") {
    parts.push(`Max ${formatBytes(maxSize)} per file`);
  }

  if (typeof maxFiles === "number") {
    parts.push(maxFiles === 1 ? "1 file only" : `Up to ${maxFiles} files`);
  }

  return parts.join(" · ");
};

const createPreviewUrl = (file: File) => {
  if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
    return URL.createObjectURL(file);
  }
  return undefined;
};

const createUploadItem = (file: File): FileUploadItem => ({
  id: buildFileId(file),
  file,
  preview: createPreviewUrl(file),
  progress: 0,
  status: "uploading",
});

const revokePreview = (item: FileUploadItem) => {
  if (!item.preview) return;
  URL.revokeObjectURL(item.preview);
  item.preview = undefined;
};

const revokeAllPreviews = (items: FileUploadItem[]) => {
  for (const item of items) revokePreview(item);
};

const kindOf = (file: File) => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "doc";
};

const setRef = <T,>(ref: Ref<T> | undefined, value: T | null) => {
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  if (ref) {
    ref.current = value;
  }
};

function syncInputFiles(input: HTMLInputElement, items: FileUploadItem[]) {
  try {
    const dt = new DataTransfer();
    for (const item of items) {
      if (item.status !== "error") {
        dt.items.add(item.file);
      }
    }
    input.files = dt.files;
  } catch {
    // DataTransfer assignment can fail in unsupported environments.
  }
}

function startUploadRun(runUpload: (id: string) => Promise<void>, id: string) {
  runUpload(id).catch(() => undefined);
}

function getAvailableSlots(
  multiple: boolean,
  maxFiles: number | undefined,
  currentCount: number
) {
  if (!multiple) return maxFiles === 0 ? 0 : 1;
  if (typeof maxFiles === "number") return Math.max(maxFiles - currentCount, 0);
  return Number.POSITIVE_INFINITY;
}

type IncomingValidation = {
  accepted: File[];
  rejected: File[];
  rejectionMessages: string[];
  reason: FileUploadRejectReason;
};

function runValidateFile(
  file: File,
  validateFile?: (file: File) => boolean | string
) {
  if (!validateFile) return true as const;

  try {
    return validateFile(file);
  } catch {
    return `${file.name} failed validation`;
  }
}

type IncomingFileRejection = {
  reason: FileUploadRejectReason;
  message: string;
};

function getIncomingFileRejection(
  file: File,
  {
    accept,
    maxSize,
    validateFile,
    preventDuplicates,
    existingSignatures,
  }: {
    accept?: string;
    maxSize?: number;
    validateFile?: (file: File) => boolean | string;
    preventDuplicates: boolean;
    existingSignatures: Set<string>;
  }
): IncomingFileRejection | null {
  if (!matchesAccept(file, accept)) {
    return {
      reason: "accept",
      message: `${file.name} is not an accepted file type`,
    };
  }

  if (typeof maxSize === "number" && file.size > maxSize) {
    return {
      reason: "max-size",
      message: `${file.name} exceeds the ${formatBytes(maxSize)} limit`,
    };
  }

  const validationResult = runValidateFile(file, validateFile);
  if (validationResult !== true) {
    return {
      reason: "validation",
      message:
        typeof validationResult === "string"
          ? validationResult
          : `${file.name} failed validation`,
    };
  }

  const signature = fileSignature(file);
  if (preventDuplicates && existingSignatures.has(signature)) {
    return {
      reason: "duplicate",
      message: `${file.name} is already in the queue`,
    };
  }

  return null;
}

function validateIncomingFiles({
  accept,
  currentCount,
  files,
  maxFiles,
  maxSize,
  multiple,
  preventDuplicates,
  existingSignatures,
  validateFile,
}: {
  accept?: string;
  currentCount: number;
  files: File[];
  maxFiles?: number;
  maxSize?: number;
  multiple: boolean;
  preventDuplicates: boolean;
  existingSignatures: Set<string>;
  validateFile?: (file: File) => boolean | string;
}): IncomingValidation {
  const accepted: File[] = [];
  const rejected: File[] = [];
  const rejectionMessages: string[] = [];
  let reason: FileUploadRejectReason = "validation";
  const availableSlots = getAvailableSlots(multiple, maxFiles, currentCount);
  const rejectionOptions = {
    accept,
    maxSize,
    validateFile,
    preventDuplicates,
    existingSignatures,
  };

  for (const file of files) {
    if (accepted.length >= availableSlots) {
      rejected.push(file);
      reason = "max-files";
      rejectionMessages.push(
        typeof maxFiles === "number"
          ? `Maximum of ${maxFiles} file${maxFiles === 1 ? "" : "s"} reached`
          : "File limit reached"
      );
      continue;
    }

    const rejection = getIncomingFileRejection(file, rejectionOptions);
    if (rejection) {
      rejected.push(file);
      reason = rejection.reason;
      rejectionMessages.push(rejection.message);
      continue;
    }

    accepted.push(file);
    existingSignatures.add(fileSignature(file));
  }

  return { accepted, rejected, rejectionMessages, reason };
}

function buildNextQueue({
  acceptedFiles,
  currentItems,
  maxFiles,
  multiple,
}: {
  acceptedFiles: File[];
  currentItems: FileUploadItem[];
  maxFiles?: number;
  multiple: boolean;
}) {
  const createdItems = acceptedFiles.map(createUploadItem);
  const merged = multiple
    ? [...createdItems, ...currentItems]
    : createdItems.slice(0, 1);
  const nextItems =
    typeof maxFiles === "number" ? merged.slice(0, maxFiles) : merged;
  const keptIds = new Set(nextItems.map((item) => item.id));

  for (const item of currentItems) {
    if (!keptIds.has(item.id)) revokePreview(item);
  }

  for (const item of createdItems) {
    if (!keptIds.has(item.id)) revokePreview(item);
  }

  return { createdItems, keptIds, nextItems };
}

function shouldAbortUpload(
  id: string,
  uploadCancelledRef: RefObject<Set<string>>,
  itemIsQueued: (id: string) => boolean,
  mountedRef: RefObject<boolean>
) {
  return (
    uploadCancelledRef.current.has(id) ||
    !itemIsQueued(id) ||
    !mountedRef.current
  );
}

function simulateUploadTick(items: FileUploadItem[]) {
  let changed = false;
  const next = items.map((item) => {
    if (item.status !== "uploading") return item;
    changed = true;
    const progress = Math.min(100, item.progress + Math.random() * 18 + 6);
    if (progress >= 100) {
      return { ...item, progress: 100, status: "done" as const };
    }
    return { ...item, progress };
  });
  return changed ? next : items;
}

const KindIcon = ({ kind }: { kind: string }) => {
  const cls = "h-4 w-4";
  if (kind === "image") return <ImageIcon className={cls} />;
  if (kind === "video") return <Video className={cls} />;
  if (kind === "audio") return <Music className={cls} />;
  return <FileText className={cls} />;
};

function ProgressRing({
  progress,
  size = 44,
  label,
  reduceMotion,
}: {
  progress: number;
  size?: number;
  label: string;
  reduceMotion: boolean;
}) {
  const stroke = 2.5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (clampProgress(progress) / 100) * c;
  const rounded = Math.round(clampProgress(progress));
  const transition: Transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 80, damping: 20 };

  return (
    <svg
      aria-label={label}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={rounded}
      className="-rotate-90"
      height={size}
      role="progressbar"
      width={size}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        fill="none"
        r={r}
        stroke="var(--color-border)"
        strokeWidth={stroke}
      />
      <motion.circle
        animate={{ strokeDashoffset: offset }}
        cx={size / 2}
        cy={size / 2}
        fill="none"
        r={r}
        stroke="color-mix(in oklab, var(--color-foreground) 26%, transparent)"
        strokeDasharray={c}
        strokeLinecap="round"
        strokeWidth={stroke}
        transition={transition}
      />
    </svg>
  );
}

async function executeFileUpload({
  announce,
  id,
  itemIsQueued,
  mountedRef,
  onUpload,
  updateFileItem,
  uploadCancelledRef,
  uploadRunRef,
  file,
}: {
  announce: (message: string) => void;
  id: string;
  itemIsQueued: (id: string) => boolean;
  mountedRef: RefObject<boolean>;
  onUpload: (file: File, context: FileUploadUploadContext) => Promise<void>;
  updateFileItem: (id: string, patch: Partial<FileUploadItem>) => void;
  uploadCancelledRef: RefObject<Set<string>>;
  uploadRunRef: RefObject<Set<string>>;
  file: File;
}) {
  uploadCancelledRef.current.delete(id);
  uploadRunRef.current.add(id);
  updateFileItem(id, { status: "uploading", progress: 0, error: undefined });

  try {
    await onUpload(file, {
      setProgress: (progress) => {
        if (
          shouldAbortUpload(id, uploadCancelledRef, itemIsQueued, mountedRef)
        ) {
          return;
        }
        updateFileItem(id, { progress: clampProgress(progress) });
      },
    });

    if (shouldAbortUpload(id, uploadCancelledRef, itemIsQueued, mountedRef)) {
      return;
    }

    updateFileItem(id, { status: "done", progress: 100 });
    announce(`${file.name} upload complete`);
  } catch (error) {
    if (shouldAbortUpload(id, uploadCancelledRef, itemIsQueued, mountedRef)) {
      return;
    }

    const message = error instanceof Error ? error.message : "Upload failed";
    updateFileItem(id, { status: "error", error: message, progress: 0 });
    announce(`${file.name} upload failed`);
  } finally {
    uploadRunRef.current.delete(id);
  }
}

type FileUploadDropzoneProps = {
  accept?: string;
  ariaDescribedBy?: string;
  ariaLabel: string;
  atMaxFiles: boolean;
  browseLabel: string;
  disabled: boolean;
  dropzoneDescription: string;
  dropzoneTitle: string;
  filesCount: number;
  hintId: string;
  inputRef: RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  maxFiles?: number;
  multiple: boolean;
  name?: string;
  onBrowse: () => void;
  onDragEnter: (event: React.DragEvent) => void;
  onDragLeave: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent) => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  prefersReducedMotion: boolean;
  required: boolean;
  rootId: string;
  shellTransition: Transition;
  showError: boolean;
};

function FileUploadDropzone({
  accept,
  ariaDescribedBy,
  ariaLabel,
  atMaxFiles,
  browseLabel,
  disabled,
  dropzoneDescription,
  dropzoneTitle,
  filesCount,
  hintId,
  inputRef,
  isDragging,
  maxFiles,
  multiple,
  name,
  onBrowse,
  onDragEnter,
  onDragLeave,
  onDrop,
  onInputChange,
  onKeyDown,
  prefersReducedMotion,
  required,
  rootId,
  shellTransition,
  showError,
}: FileUploadDropzoneProps) {
  const title =
    atMaxFiles && !isDragging
      ? `Maximum of ${maxFiles} file${maxFiles === 1 ? "" : "s"} reached`
      : dropzoneTitle;

  return (
    <motion.div
      animate={{
        scale: isDragging && !disabled && !prefersReducedMotion ? 1.015 : 1,
        y: isDragging && !disabled && !prefersReducedMotion ? -2 : 0,
      }}
      aria-describedby={ariaDescribedBy || undefined}
      aria-disabled={disabled || atMaxFiles || undefined}
      aria-invalid={showError || undefined}
      aria-label={ariaLabel}
      className={[
        "relative overflow-hidden border bg-paper px-5 py-4",
        controlCornerClassName,
        showError ? "border-destructive" : "border-border",
        disabled || atMaxFiles
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer",
      ].join(" ")}
      onClick={atMaxFiles ? undefined : onBrowse}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={(event) => {
        event.preventDefault();
        if (!(disabled || atMaxFiles)) event.dataTransfer.dropEffect = "copy";
      }}
      onDrop={onDrop}
      onKeyDown={onKeyDown}
      role="button"
      style={{ boxShadow: "var(--file-upload-shell-shadow)" }}
      tabIndex={disabled || atMaxFiles ? -1 : 0}
      transition={shellTransition}
    >
      <input
        accept={accept}
        aria-hidden
        className="hidden"
        disabled={disabled}
        id={rootId}
        multiple={multiple}
        name={name}
        onChange={onInputChange}
        ref={inputRef}
        required={required && filesCount === 0}
        tabIndex={-1}
        type="file"
      />

      <div className="pointer-events-none relative flex items-center gap-4">
        <FileUploadDropzoneIcon
          isDragging={isDragging}
          prefersReducedMotion={prefersReducedMotion}
          shellTransition={shellTransition}
        />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground text-sm">{title}</p>
          <p className="truncate text-muted-foreground text-xs" id={hintId}>
            {dropzoneDescription}
          </p>
        </div>
        <FileUploadBrowseHint
          atMaxFiles={atMaxFiles}
          browseLabel={browseLabel}
          disabled={disabled}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>
    </motion.div>
  );
}

function FileUploadDropzoneIcon({
  isDragging,
  prefersReducedMotion,
  shellTransition,
}: {
  isDragging: boolean;
  prefersReducedMotion: boolean;
  shellTransition: Transition;
}) {
  return (
    <div className="relative h-11 w-11 shrink-0">
      <motion.div
        animate={{
          rotate: isDragging && !prefersReducedMotion ? -14 : -8,
          x: isDragging && !prefersReducedMotion ? -4 : -2,
        }}
        className={[
          "absolute inset-0 border border-border bg-card",
          controlCornerClassName,
        ].join(" ")}
        transition={shellTransition}
      />
      <motion.div
        animate={{
          rotate: isDragging && !prefersReducedMotion ? 10 : 6,
          x: isDragging && !prefersReducedMotion ? 4 : 2,
        }}
        className={[
          "absolute inset-0 border border-border bg-paper",
          controlCornerClassName,
        ].join(" ")}
        transition={shellTransition}
      />
      <motion.div
        animate={{ scale: isDragging && !prefersReducedMotion ? 1.06 : 1 }}
        className={[
          "absolute inset-0 flex items-center justify-center bg-foreground text-background",
          controlCornerClassName,
        ].join(" ")}
        style={{ boxShadow: "var(--file-upload-icon-shadow)" }}
        transition={shellTransition}
      >
        <motion.div
          animate={{ rotate: isDragging && !prefersReducedMotion ? 45 : 0 }}
          transition={shellTransition}
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </motion.div>
      </motion.div>
    </div>
  );
}

function FileUploadBrowseHint({
  atMaxFiles,
  browseLabel,
  disabled,
  prefersReducedMotion,
}: {
  atMaxFiles: boolean;
  browseLabel: string;
  disabled: boolean;
  prefersReducedMotion: boolean;
}) {
  if (prefersReducedMotion) {
    return (
      <div className="inline-flex shrink-0 items-center gap-1 text-[10px] text-foreground/70 uppercase tracking-[0.18em]">
        {browseLabel} <ArrowUpRight className="h-3 w-3" />
      </div>
    );
  }

  return (
    <motion.div
      className="inline-flex shrink-0 items-center gap-1 text-[10px] text-foreground/70 uppercase tracking-[0.18em]"
      whileHover={disabled || atMaxFiles ? undefined : { x: 2, y: -1 }}
    >
      {browseLabel} <ArrowUpRight className="h-3 w-3" />
    </motion.div>
  );
}

function FileUploadListHeader({
  clearAll,
  clearAllLabel,
  disabled,
  filesCount,
  libraryLabel,
  listLabelId,
  prefersReducedMotion,
  showClearAll,
  totalDone,
}: {
  clearAll: () => void;
  clearAllLabel: string;
  disabled: boolean;
  filesCount: number;
  libraryLabel: string;
  listLabelId: string;
  prefersReducedMotion: boolean;
  showClearAll: boolean;
  totalDone: number;
}) {
  if (filesCount === 0) return null;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="mt-10 mb-4 flex items-end justify-between gap-3"
      exit={prefersReducedMotion ? undefined : { opacity: 0 }}
      initial={prefersReducedMotion ? false : { opacity: 0, y: -6 }}
    >
      <div className="flex items-baseline gap-2">
        <span
          className="text-[11px] text-muted-foreground uppercase tracking-[0.2em]"
          id={listLabelId}
        >
          {libraryLabel}
        </span>
        <span className="h-px w-10 bg-border" />
      </div>
      <div className="flex items-center gap-3">
        {showClearAll ? (
          <button
            className="text-[11px] text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline disabled:pointer-events-none disabled:opacity-50"
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation();
              clearAll();
            }}
            type="button"
          >
            {clearAllLabel}
          </button>
        ) : null}
        <div className="text-[11px] text-muted-foreground tabular-nums">
          <span className="font-medium text-foreground">{totalDone}</span> of{" "}
          {filesCount} ready
        </div>
      </div>
    </motion.div>
  );
}

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  function FileUpload(
    {
      accept,
      ariaDescribedBy,
      ariaLabel = "Upload files",
      browseLabel = "Browse",
      className,
      clearAllLabel = "Clear all",
      defaultValue,
      description,
      disabled = false,
      dropzoneDescription,
      dropzoneTitle,
      id: idProp,
      invalid = false,
      libraryLabel = "Library",
      maxFiles: maxFilesProp,
      maxSize: maxSizeProp,
      multiple = true,
      name,
      onFileRemove,
      onFilesChange,
      onReject,
      onUpload,
      onUploadComplete,
      onValueChange,
      preventDuplicates = false,
      required = false,
      showClearAll = true,
      simulateUpload,
      validateFile,
      value,
    },
    ref
  ) {
    const generatedId = useId();
    const rootId = idProp ?? generatedId;
    const descriptionId = `${rootId}-description`;
    const hintId = `${rootId}-hint`;
    const errorId = `${rootId}-error`;
    const liveId = `${rootId}-live`;
    const listLabelId = `${rootId}-list-label`;

    const maxFiles = resolveMaxFiles(maxFilesProp);
    const maxSize = resolveMaxSize(maxSizeProp);
    const prefersReducedMotion = useReducedMotion() === true;
    const shouldSimulateUpload = simulateUpload ?? !onUpload;

    const [internalFiles, setInternalFiles] = useState<FileUploadItem[]>(() =>
      defaultValue?.length ? defaultValue.map(createUploadItem) : []
    );
    const [isDragging, setIsDragging] = useState(false);
    const [inlineError, setInlineError] = useState<string | null>(null);
    const [liveMessage, setLiveMessage] = useState("");

    const inputRef = useRef<HTMLInputElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const filesRef = useRef<FileUploadItem[]>([]);
    const previousFilesRef = useRef<FileUploadItem[]>([]);
    const completedSignatureRef = useRef("");
    const reportedSignatureRef = useRef("");
    const uploadRunRef = useRef<Set<string>>(new Set());
    const uploadCancelledRef = useRef<Set<string>>(new Set());
    const mountedRef = useRef(true);

    const isControlled = value !== undefined;
    const files = isControlled ? value : internalFiles;
    const canSimulateUpload =
      shouldSimulateUpload && !isControlled && !onUpload;
    const atMaxFiles =
      typeof maxFiles === "number" && maxFiles > 0 && files.length >= maxFiles;

    const setFileItems = useCallback(
      (
        updater:
          | FileUploadItem[]
          | ((current: FileUploadItem[]) => FileUploadItem[])
      ) => {
        const resolveNext = (current: FileUploadItem[]) =>
          typeof updater === "function" ? updater(current) : updater;

        if (isControlled) {
          const next = resolveNext(filesRef.current);
          filesRef.current = next;
          onValueChange?.(next);
          return;
        }

        setInternalFiles((current) => {
          const next = resolveNext(current);
          filesRef.current = next;
          onValueChange?.(next);
          return next;
        });
      },
      [isControlled, onValueChange]
    );

    const itemIsQueued = useCallback((id: string) => {
      return filesRef.current.some((entry) => entry.id === id);
    }, []);

    const updateFileItem = useCallback(
      (id: string, patch: Partial<FileUploadItem>) => {
        if (uploadCancelledRef.current.has(id)) return;
        if (!itemIsQueued(id)) return;

        setFileItems((current) =>
          current.map((item) => (item.id === id ? { ...item, ...patch } : item))
        );
      },
      [itemIsQueued, setFileItems]
    );

    const announce = useCallback((message: string) => {
      if (!mountedRef.current) return;
      setLiveMessage("");
      requestAnimationFrame(() => {
        if (mountedRef.current) setLiveMessage(message);
      });
    }, []);

    const rejectFiles = useCallback(
      (rejected: File[], reason: FileUploadRejectReason, message: string) => {
        if (rejected.length === 0) return;
        setInlineError(message);
        onReject?.(rejected, reason, message);
        announce(message);
      },
      [announce, onReject]
    );

    const runUpload = useCallback(
      async (id: string) => {
        if (!onUpload || uploadRunRef.current.has(id)) return;

        const item = filesRef.current.find((entry) => entry.id === id);
        if (!item) return;

        await executeFileUpload({
          announce,
          file: item.file,
          id,
          itemIsQueued,
          mountedRef,
          onUpload,
          updateFileItem,
          uploadCancelledRef,
          uploadRunRef,
        });
      },
      [announce, itemIsQueued, onUpload, updateFileItem]
    );

    const queueUploads = useCallback(
      (items: FileUploadItem[]) => {
        if (!onUpload) return;
        for (const item of items) {
          if (item.status === "uploading") {
            startUploadRun(runUpload, item.id);
          }
        }
      },
      [onUpload, runUpload]
    );

    const addFiles = useCallback(
      (incoming: FileList | File[]) => {
        const incomingList = Array.from(incoming);

        if (disabled) {
          rejectFiles(incomingList, "disabled", "File upload is disabled.");
          return;
        }

        if (maxFiles === 0) {
          rejectFiles(
            incomingList,
            "max-files",
            "File uploads are not allowed."
          );
          return;
        }

        const currentItems = filesRef.current;
        const validation = validateIncomingFiles({
          accept,
          currentCount: currentItems.length,
          files: incomingList,
          maxFiles,
          maxSize,
          multiple,
          preventDuplicates,
          existingSignatures: new Set(
            currentItems.map((item) => fileSignature(item.file))
          ),
          validateFile,
        });

        if (validation.accepted.length === 0) {
          if (validation.rejected.length > 0) {
            rejectFiles(
              validation.rejected,
              validation.reason,
              validation.rejectionMessages[0] ?? "No files were added."
            );
          }
          return;
        }

        const { createdItems, keptIds, nextItems } = buildNextQueue({
          acceptedFiles: validation.accepted,
          currentItems,
          maxFiles,
          multiple,
        });

        const addedCount = Math.max(nextItems.length - currentItems.length, 0);
        if (addedCount > 0) {
          announce(
            `${addedCount} file${addedCount === 1 ? "" : "s"} added to upload queue`
          );
        }

        if (validation.rejected.length > 0) {
          setInlineError(validation.rejectionMessages[0] ?? null);
          onReject?.(
            validation.rejected,
            validation.reason,
            validation.rejectionMessages[0] ?? "Some files were rejected."
          );
        } else {
          setInlineError(null);
        }

        filesRef.current = nextItems;
        setFileItems(nextItems);
        queueUploads(createdItems.filter((item) => keptIds.has(item.id)));
      },
      [
        accept,
        announce,
        disabled,
        maxFiles,
        maxSize,
        multiple,
        onReject,
        preventDuplicates,
        queueUploads,
        rejectFiles,
        setFileItems,
        validateFile,
      ]
    );

    useEffect(() => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
      };
    }, []);

    useEffect(() => {
      filesRef.current = files;
    }, [files]);

    useEffect(() => {
      const previous = previousFilesRef.current;
      const nextIds = new Set(files.map((item) => item.id));

      for (const item of previous) {
        if (!nextIds.has(item.id)) revokePreview(item);
      }

      previousFilesRef.current = files;
    }, [files]);

    useEffect(() => {
      const input = inputRef.current;
      if (!input) return;
      syncInputFiles(input, files);
    }, [files]);

    useEffect(
      () => () => {
        revokeAllPreviews(filesRef.current);
      },
      []
    );

    useEffect(() => {
      if (!canSimulateUpload) return;

      const interval = window.setInterval(() => {
        setFileItems((current) => simulateUploadTick(current));
      }, 380);

      return () => window.clearInterval(interval);
    }, [canSimulateUpload, setFileItems]);

    useEffect(() => {
      queueUploads(filesRef.current);
    }, [queueUploads]);

    useEffect(() => {
      const resetDragState = () => {
        setIsDragging(false);
      };

      window.addEventListener("dragend", resetDragState);

      return () => {
        window.removeEventListener("dragend", resetDragState);
      };
    }, []);

    const fileListSignature = files.map((item) => item.id).join("|");

    useEffect(() => {
      if (!onFilesChange) return;
      if (reportedSignatureRef.current === fileListSignature) return;

      reportedSignatureRef.current = fileListSignature;
      onFilesChange(files.map((item) => item.file));
    }, [fileListSignature, files, onFilesChange]);

    useEffect(() => {
      if (!onUploadComplete) return;
      if (files.length === 0) {
        completedSignatureRef.current = "";
        return;
      }
      if (files.some((item) => item.status !== "done")) return;
      if (completedSignatureRef.current === fileListSignature) return;

      completedSignatureRef.current = fileListSignature;
      onUploadComplete(files.map((item) => item.file));
      announce("All files are ready");
    }, [announce, fileListSignature, files, onUploadComplete]);

    const removeFile = useCallback(
      (id: string) => {
        if (disabled) return;

        const target = filesRef.current.find((item) => item.id === id);
        if (!target) return;

        uploadCancelledRef.current.add(id);
        uploadRunRef.current.delete(id);
        revokePreview(target);

        const nextItems = filesRef.current.filter((item) => item.id !== id);
        filesRef.current = nextItems;
        setFileItems(nextItems);
        onFileRemove?.(
          target.file,
          nextItems.map((item) => item.file)
        );
        announce(`${target.file.name} removed`);
      },
      [announce, disabled, onFileRemove, setFileItems]
    );

    const clearAll = useCallback(() => {
      if (disabled || filesRef.current.length === 0) return;

      for (const item of filesRef.current) {
        uploadCancelledRef.current.add(item.id);
      }
      uploadRunRef.current.clear();
      revokeAllPreviews(filesRef.current);
      filesRef.current = [];
      setFileItems([]);
      setInlineError(null);
      announce("All files cleared");
    }, [announce, disabled, setFileItems]);

    const retryUpload = useCallback(
      (id: string) => {
        if (disabled) return;

        uploadCancelledRef.current.delete(id);

        if (onUpload) {
          startUploadRun(runUpload, id);
          return;
        }

        updateFileItem(id, {
          status: "uploading",
          progress: 0,
          error: undefined,
        });
      },
      [disabled, onUpload, runUpload, updateFileItem]
    );

    const handleDragEnter = (event: React.DragEvent) => {
      event.preventDefault();
      if (disabled || atMaxFiles) return;
      setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent) => {
      event.preventDefault();
      if (disabled) return;

      const related = event.relatedTarget as Node | null;
      if (related && event.currentTarget.contains(related)) return;

      setIsDragging(false);
    };

    const onDrop = (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      if (disabled || atMaxFiles) return;
      if (event.dataTransfer.files?.length) addFiles(event.dataTransfer.files);
    };

    const handleBrowse = () => {
      if (disabled) return;
      inputRef.current?.click();
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || !event.target.files?.length) return;
      addFiles(event.target.files);
      event.target.value = "";
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        inputRef.current?.click();
      }
    };

    useEffect(() => {
      const root = rootRef.current;
      if (!root) return;

      const handlePaste = (event: ClipboardEvent) => {
        if (disabled) return;
        if (!root.contains(document.activeElement)) return;

        const pastedFiles = Array.from(event.clipboardData?.files ?? []);
        if (pastedFiles.length === 0) return;

        event.preventDefault();
        addFiles(pastedFiles);
      };

      root.addEventListener("paste", handlePaste);
      return () => root.removeEventListener("paste", handlePaste);
    }, [addFiles, disabled]);

    const totalDone = files.filter((item) => item.status === "done").length;
    const hasQueueError = files.some((item) => item.status === "error");
    const showError = Boolean(inlineError) || invalid || hasQueueError;
    const resolvedDropzoneTitle =
      dropzoneTitle ??
      (isDragging ? "Release to upload" : "Drop, click, or paste to upload");
    const resolvedDropzoneDescription =
      dropzoneDescription ?? buildDropzoneHint({ accept, maxFiles, maxSize });

    const describedBy = [
      description ? descriptionId : null,
      hintId,
      showError && inlineError ? errorId : null,
      ariaDescribedBy,
    ]
      .filter(Boolean)
      .join(" ");

    const shellTransition: Transition = prefersReducedMotion
      ? { duration: 0 }
      : { type: "spring", stiffness: 260, damping: 24 };

    const listTransition: Transition = prefersReducedMotion
      ? { duration: 0 }
      : { type: "spring", stiffness: 320, damping: 30, mass: 0.6 };

    return (
      <div
        className={[
          componentThemeClassName,
          "[--file-upload-shell-shadow:0_12px_28px_-24px_rgba(15,23,42,0.18)]",
          "[--file-upload-icon-shadow:0_10px_18px_-16px_rgba(15,23,42,0.16)]",
          "dark:[--file-upload-shell-shadow:0_16px_32px_-26px_rgba(0,0,0,0.38)]",
          "dark:[--file-upload-icon-shadow:0_12px_22px_-18px_rgba(0,0,0,0.32)]",
          "mx-auto w-full max-w-2xl",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        ref={(node) => {
          rootRef.current = node;
          setRef(ref, node);
        }}
      >
        {description ? (
          <p className="mb-2 text-muted-foreground text-sm" id={descriptionId}>
            {description}
          </p>
        ) : null}

        <FileUploadDropzone
          accept={accept}
          ariaDescribedBy={describedBy}
          ariaLabel={ariaLabel}
          atMaxFiles={atMaxFiles}
          browseLabel={browseLabel}
          disabled={disabled}
          dropzoneDescription={resolvedDropzoneDescription}
          dropzoneTitle={resolvedDropzoneTitle}
          filesCount={files.length}
          hintId={hintId}
          inputRef={inputRef}
          isDragging={isDragging}
          maxFiles={maxFiles}
          multiple={multiple}
          name={name}
          onBrowse={handleBrowse}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={onDrop}
          onInputChange={handleInputChange}
          onKeyDown={handleKeyDown}
          prefersReducedMotion={prefersReducedMotion}
          required={required}
          rootId={rootId}
          shellTransition={shellTransition}
          showError={showError}
        />

        {inlineError ? (
          <p
            className="mt-2 text-destructive text-xs"
            id={errorId}
            role="alert"
          >
            {inlineError}
          </p>
        ) : null}

        <p aria-live="polite" className="sr-only" id={liveId}>
          {liveMessage}
        </p>

        <AnimatePresence>
          <FileUploadListHeader
            clearAll={clearAll}
            clearAllLabel={clearAllLabel}
            disabled={disabled}
            filesCount={files.length}
            libraryLabel={libraryLabel}
            listLabelId={listLabelId}
            prefersReducedMotion={prefersReducedMotion}
            showClearAll={showClearAll}
            totalDone={totalDone}
          />
        </AnimatePresence>

        <motion.ul
          aria-labelledby={files.length > 0 ? listLabelId : undefined}
          className="space-y-2.5"
          layout={!prefersReducedMotion}
        >
          <AnimatePresence initial={false}>
            {files.map((item) => (
              <FileUploadRow
                disabled={disabled}
                item={item}
                key={item.id}
                listTransition={listTransition}
                onRemove={removeFile}
                onRetry={retryUpload}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

function FileUploadRowThumbnail({
  item,
  kind,
  prefersReducedMotion,
  progressValue,
  showProgress,
}: {
  item: FileUploadItem;
  kind: string;
  prefersReducedMotion: boolean;
  progressValue: number;
  showProgress: boolean;
}) {
  if (item.preview) {
    return (
      <div
        className={[
          "relative h-12 w-12 overflow-hidden border border-border",
          controlCornerClassName,
        ].join(" ")}
      >
        {item.file.type.startsWith("video/") ? (
          <video
            aria-hidden
            className="h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
            src={item.preview}
          />
        ) : (
          /* biome-ignore lint/performance/noImgElement: registry component stays framework-agnostic for non-Next consumers. */
          <img
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
            height={48}
            src={item.preview}
            width={48}
          />
        )}
        {showProgress ? (
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center bg-background/55"
          >
            <ProgressRing
              label={`Upload progress for ${item.file.name}`}
              progress={progressValue}
              reduceMotion={prefersReducedMotion}
              size={40}
            />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative flex h-12 w-12 items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <ProgressRing
          label={`Upload progress for ${item.file.name}`}
          progress={progressValue}
          reduceMotion={prefersReducedMotion}
        />
      </div>
      <div aria-hidden className="relative text-foreground/80">
        <KindIcon kind={kind} />
      </div>
    </div>
  );
}

function FileUploadRowMeta({
  item,
  kind,
  listTransition,
  prefersReducedMotion,
}: {
  item: FileUploadItem;
  kind: string;
  listTransition: Transition;
  prefersReducedMotion: boolean;
}) {
  return (
    <div className="relative z-10 min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <p className="truncate font-medium text-foreground text-sm">
          {item.file.name}
        </p>
        <AnimatePresence>
          {item.status === "done" ? (
            <motion.span
              animate={
                prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }
              }
              aria-hidden
              className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background"
              exit={
                prefersReducedMotion ? undefined : { scale: 0.95, opacity: 0 }
              }
              initial={
                prefersReducedMotion ? false : { scale: 0.95, opacity: 0 }
              }
              transition={listTransition}
            >
              <Check className="h-2.5 w-2.5" strokeWidth={3} />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground tabular-nums">
        <span className="uppercase tracking-wider">{kind}</span>
        <span
          aria-hidden
          className="h-0.5 w-0.5 rounded-full bg-muted-foreground/60"
        />
        <span>{formatBytes(item.file.size)}</span>
        {item.status === "uploading" ? (
          <span aria-live="polite" className="ml-auto text-foreground/80">
            {Math.round(item.progress)}%
          </span>
        ) : null}
        {item.status === "error" && item.error ? (
          <span className="ml-auto truncate text-destructive" role="alert">
            {item.error}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function FileUploadRowActions({
  disabled,
  item,
  onRemove,
  onRetry,
}: {
  disabled: boolean;
  item: FileUploadItem;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}) {
  return (
    <div className="relative z-10 flex items-center gap-1">
      {item.status === "error" ? (
        <button
          aria-label={`Retry upload for ${item.file.name}`}
          className={[
            "flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50",
            controlCornerClassName,
          ].join(" ")}
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            onRetry(item.id);
          }}
          type="button"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      ) : null}
      <button
        aria-label={`Remove ${item.file.name}`}
        className={[
          "flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50",
          controlCornerClassName,
        ].join(" ")}
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation();
          onRemove(item.id);
        }}
        type="button"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function FileUploadRow({
  disabled,
  item,
  listTransition,
  onRemove,
  onRetry,
  prefersReducedMotion,
}: {
  disabled: boolean;
  item: FileUploadItem;
  listTransition: Transition;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
  prefersReducedMotion: boolean;
}) {
  const kind = kindOf(item.file);
  const showProgress = item.status === "uploading";
  const progressValue = item.status === "done" ? 100 : item.progress;

  return (
    <motion.li
      animate={
        prefersReducedMotion
          ? undefined
          : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
      }
      className={[
        "group relative flex items-center gap-4 overflow-hidden border border-border bg-card p-3 pr-4",
        controlCornerClassName,
        item.status === "error" ? "border-destructive/40" : "",
      ].join(" ")}
      exit={
        prefersReducedMotion
          ? undefined
          : { opacity: 0, x: 60, scale: 0.92, filter: "blur(4px)" }
      }
      initial={
        prefersReducedMotion
          ? false
          : { opacity: 0, y: 16, scale: 0.97, filter: "blur(6px)" }
      }
      layout={!prefersReducedMotion}
      transition={listTransition}
    >
      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center">
        <FileUploadRowThumbnail
          item={item}
          kind={kind}
          prefersReducedMotion={prefersReducedMotion}
          progressValue={progressValue}
          showProgress={showProgress}
        />
      </div>

      <FileUploadRowMeta
        item={item}
        kind={kind}
        listTransition={listTransition}
        prefersReducedMotion={prefersReducedMotion}
      />

      <FileUploadRowActions
        disabled={disabled}
        item={item}
        onRemove={onRemove}
        onRetry={onRetry}
      />
    </motion.li>
  );
}
