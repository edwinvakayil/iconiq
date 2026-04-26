"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  Check,
  FileText,
  ImageIcon,
  Music,
  Plus,
  Video,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type FileUploadStatus = "uploading" | "done";

export type FileUploadItem = {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: FileUploadStatus;
};

export interface FileUploadProps {
  accept?: string;
  className?: string;
  disabled?: boolean;
  maxFiles?: number;
  multiple?: boolean;
  name?: string;
  onFileRemove?: (file: File, nextFiles: File[]) => void;
  onFilesChange?: (files: File[]) => void;
  onUploadComplete?: (files: File[]) => void;
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const buildFileId = (file: File) =>
  `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`;

const matchesAccept = (file: File, accept?: string) => {
  if (!accept?.trim()) return true;

  return accept
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .some((entry) => {
      if (!entry) return false;
      if (entry.endsWith("/*")) {
        return file.type.toLowerCase().startsWith(entry.replace("*", ""));
      }
      if (entry.startsWith(".")) {
        return file.name.toLowerCase().endsWith(entry);
      }
      return file.type.toLowerCase() === entry;
    });
};

const revokePreview = (file: FileUploadItem) => {
  if (file.preview) URL.revokeObjectURL(file.preview);
};

const kindOf = (file: File) => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "doc";
};

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
}: {
  progress: number;
  size?: number;
}) {
  const stroke = 2.5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;
  return (
    <svg className="-rotate-90" height={size} width={size}>
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
        stroke="var(--color-brand)"
        strokeDasharray={c}
        strokeLinecap="round"
        strokeWidth={stroke}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
      />
    </svg>
  );
}

export function FileUpload({
  accept,
  className,
  disabled = false,
  maxFiles,
  multiple = true,
  name,
  onFileRemove,
  onFilesChange,
  onUploadComplete,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const filesRef = useRef<FileUploadItem[]>([]);
  const completedSignatureRef = useRef("");
  const reportedSignatureRef = useRef("");

  // Pointer-tracking glow
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });
  const glow = useTransform(
    [sx, sy],
    ([x, y]) =>
      `radial-gradient(420px circle at ${(x as number) * 100}% ${(y as number) * 100}%, color-mix(in oklab, var(--color-brand) 22%, transparent), transparent 60%)`
  );

  const handlePointer = (e: React.PointerEvent) => {
    const rect = dropRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      if (maxFiles === 0) return;

      const accepted = Array.from(incoming).filter((file) =>
        matchesAccept(file, accept)
      );
      if (accepted.length === 0) return;

      const list: FileUploadItem[] = accepted.map((file) => ({
        id: buildFileId(file),
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
        progress: 0,
        status: "uploading",
      }));

      const merged = multiple ? [...list, ...files] : list.slice(0, 1);
      const limited =
        typeof maxFiles === "number"
          ? merged.slice(0, Math.max(maxFiles, 0))
          : merged;
      const keptIds = new Set(limited.map((file) => file.id));

      for (const file of files) {
        if (!keptIds.has(file.id)) revokePreview(file);
      }

      setFiles(limited);
    },
    [accept, files, maxFiles, multiple]
  );

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(
    () => () => {
      for (const file of filesRef.current) revokePreview(file);
    },
    []
  );

  // Simulate upload progress for any uploading files
  useEffect(() => {
    const hasActive = files.some((f) => f.status === "uploading");
    if (!hasActive) return;
    const t = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.status === "done") return f;
          const next = Math.min(100, f.progress + Math.random() * 18 + 6);
          return next >= 100
            ? { ...f, progress: 100, status: "done" as FileUploadStatus }
            : { ...f, progress: next };
        })
      );
    }, 380);
    return () => clearInterval(t);
  }, [files]);

  const fileListSignature = files.map((file) => file.id).join("|");

  useEffect(() => {
    if (!onFilesChange) return;
    if (reportedSignatureRef.current === fileListSignature) return;

    reportedSignatureRef.current = fileListSignature;
    onFilesChange(files.map((file) => file.file));
  }, [fileListSignature, files, onFilesChange]);

  useEffect(() => {
    if (!onUploadComplete) return;
    if (files.length === 0) {
      completedSignatureRef.current = "";
      return;
    }
    if (files.some((file) => file.status !== "done")) return;
    if (completedSignatureRef.current === fileListSignature) return;

    completedSignatureRef.current = fileListSignature;
    onUploadComplete(files.map((file) => file.file));
  }, [fileListSignature, files, onUploadComplete]);

  const removeFile = useCallback(
    (id: string) => {
      const target = files.find((file) => file.id === id);
      if (!target) return;

      revokePreview(target);

      const nextFiles = files.filter((file) => file.id !== id);
      setFiles(nextFiles);
      onFileRemove?.(
        target.file,
        nextFiles.map((file) => file.file)
      );
    },
    [files, onFileRemove]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const handleBrowse = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !e.target.files?.length) return;
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const totalDone = files.filter((f) => f.status === "done").length;

  return (
    <div
      className={["mx-auto w-full max-w-2xl", className]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Drop zone */}
      <motion.div
        animate={{
          scale: isDragging && !disabled ? 1.015 : 1,
          y: isDragging && !disabled ? -2 : 0,
        }}
        aria-disabled={disabled}
        className={[
          "relative overflow-hidden rounded-2xl border border-border bg-paper px-5 py-4",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        ].join(" ")}
        onClick={handleBrowse}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => {
          e.preventDefault();
          if (disabled) return;
          setIsDragging(true);
        }}
        onDrop={onDrop}
        onKeyDown={handleKeyDown}
        onPointerMove={disabled ? undefined : handlePointer}
        ref={dropRef}
        role="button"
        style={{ boxShadow: "var(--shadow-soft)" }}
        tabIndex={disabled ? -1 : 0}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      >
        {/* Pointer glow */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: glow as unknown as string }}
        />

        <input
          accept={accept}
          className="hidden"
          disabled={disabled}
          multiple={multiple}
          name={name}
          onChange={handleInputChange}
          ref={inputRef}
          type="file"
        />

        <div className="relative flex items-center gap-4">
          {/* Stacked sheets icon */}
          <div className="relative h-11 w-11 shrink-0">
            <motion.div
              animate={{
                rotate: isDragging ? -14 : -8,
                x: isDragging ? -4 : -2,
              }}
              className="absolute inset-0 rounded-lg border border-border bg-card"
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            />
            <motion.div
              animate={{
                rotate: isDragging ? 10 : 6,
                x: isDragging ? 4 : 2,
              }}
              className="absolute inset-0 rounded-lg border border-border bg-paper"
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            />
            <motion.div
              animate={{ scale: isDragging ? 1.06 : 1 }}
              className="absolute inset-0 flex items-center justify-center rounded-lg bg-foreground text-background"
              style={{ boxShadow: "var(--shadow-soft)" }}
              transition={{ type: "spring", stiffness: 240, damping: 16 }}
            >
              <motion.div
                animate={{ rotate: isDragging ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
              </motion.div>
            </motion.div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground text-sm">
              {isDragging ? "Release to upload" : "Drop or click to upload"}
            </p>
            <p className="truncate text-muted-foreground text-xs">
              Images, videos, audio, or documents
            </p>
          </div>

          <motion.div
            className="inline-flex shrink-0 items-center gap-1 text-[10px] text-foreground/70 uppercase tracking-[0.18em]"
            whileHover={{ x: 2, y: -1 }}
          >
            Browse <ArrowUpRight className="h-3 w-3" />
          </motion.div>
        </div>
      </motion.div>

      {/* File list header */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 mb-4 flex items-end justify-between"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, y: -6 }}
          >
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] text-muted-foreground uppercase tracking-[0.2em]">
                Library
              </span>
              <span className="h-px w-10 bg-border" />
            </div>
            <div className="text-[11px] text-muted-foreground tabular-nums">
              <motion.span
                animate={{ opacity: 1, y: 0 }}
                className="font-medium text-foreground"
                initial={{ opacity: 0, y: -4 }}
                key={totalDone}
              >
                {totalDone}
              </motion.span>{" "}
              of {files.length} ready
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File list */}
      <motion.ul className="space-y-2.5" layout>
        <AnimatePresence initial={false}>
          {files.map((f) => {
            const kind = kindOf(f.file);
            return (
              <motion.li
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card p-3 pr-4"
                exit={{ opacity: 0, x: 60, scale: 0.92, filter: "blur(4px)" }}
                initial={{
                  opacity: 0,
                  y: 16,
                  scale: 0.97,
                  filter: "blur(6px)",
                }}
                key={f.id}
                layout
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 30,
                  mass: 0.6,
                }}
              >
                {/* Progress fill behind row */}
                <motion.div
                  animate={{ width: `${f.progress}%` }}
                  aria-hidden
                  className="absolute inset-y-0 left-0 origin-left"
                  initial={{ width: 0 }}
                  style={{
                    background:
                      "linear-gradient(90deg, color-mix(in oklab, var(--color-brand-soft) 60%, transparent), transparent)",
                  }}
                  transition={{ type: "spring", stiffness: 80, damping: 20 }}
                />

                {/* Thumb / ring */}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center">
                  {f.preview ? (
                    <motion.div
                      className="h-12 w-12 overflow-hidden rounded-xl border border-border"
                      layoutId={`thumb-${f.id}`}
                    >
                      {/* biome-ignore lint/performance/noImgElement: registry component stays framework-agnostic for non-Next consumers. */}
                      <img
                        alt={f.file.name}
                        className="h-full w-full object-cover"
                        height={48}
                        src={f.preview}
                        width={48}
                      />
                    </motion.div>
                  ) : (
                    <div className="relative flex h-12 w-12 items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ProgressRing
                          progress={f.status === "done" ? 100 : f.progress}
                        />
                      </div>
                      <div className="relative text-foreground/80">
                        <KindIcon kind={kind} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="relative z-10 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-foreground text-sm">
                      {f.file.name}
                    </p>
                    <AnimatePresence>
                      {f.status === "done" && (
                        <motion.span
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background"
                          exit={{ scale: 0, opacity: 0 }}
                          initial={{ scale: 0, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                          }}
                        >
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground tabular-nums">
                    <span className="uppercase tracking-wider">{kind}</span>
                    <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/60" />
                    <span>{formatBytes(f.file.size)}</span>
                    <AnimatePresence mode="wait">
                      {f.status === "uploading" && (
                        <motion.span
                          animate={{ opacity: 1 }}
                          className="ml-auto text-foreground/80"
                          exit={{ opacity: 0 }}
                          initial={{ opacity: 0 }}
                          key="pct"
                        >
                          {Math.round(f.progress)}%
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Remove */}
                <button
                  aria-label={`Remove ${f.file.name}`}
                  className="relative z-10 flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => removeFile(f.id)}
                  type="button"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
