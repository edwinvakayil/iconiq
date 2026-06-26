"use client";

import { SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { DocsPlaygroundSelectRow } from "./docs-playground-select-menu";

const rowBase =
  "flex min-h-12 items-center overflow-hidden rounded-2xl bg-[#ebebeb] dark:bg-[#232323]";

function PlaygroundRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(rowBase, className)}>{children}</div>;
}

export function DocsPlaygroundPanel({
  children,
  className,
  footer,
  onClose,
  title,
}: {
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  onClose?: () => void;
  title: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full max-h-[min(28rem,56vh)] min-h-0 w-full flex-col overflow-hidden p-2",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 px-2 pt-2 pb-2">
        <h2 className="font-semibold text-[#111113] text-[17px] tracking-[-0.03em] dark:text-zinc-50">
          {title}
        </h2>
        {onClose ? (
          <button
            aria-label="Close settings"
            className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg text-[#5c5c61] transition-colors hover:bg-[#ebebeb] hover:text-[#111113] dark:text-[#a1a1a6] dark:hover:bg-[#232323] dark:hover:text-zinc-100"
            onClick={onClose}
            type="button"
          >
            <SlidersHorizontal className="size-4" strokeWidth={1.75} />
          </button>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="space-y-2">{children}</div>
      </div>

      {footer ? <div className="px-1 pt-1 pb-1">{footer}</div> : null}
    </div>
  );
}

export function DocsPlaygroundSection({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <section className="space-y-2">
      {title ? (
        <h3 className="px-2 font-medium text-[#5c5c61] text-[13px] dark:text-[#a1a1a6]">
          {title}
        </h3>
      ) : null}
      <div className="space-y-2">{children}</div>
    </section>
  );
}

export function DocsPlaygroundSelectField<T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: T) => void;
  options: Array<{ label: string; value: T }>;
  value: T;
}) {
  return (
    <DocsPlaygroundSelectRow
      label={label}
      onChange={onChange}
      options={options}
      value={value}
    />
  );
}

export function DocsPlaygroundSegmentedField<T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label?: string;
  onChange: (value: T) => void;
  options: Array<{ label: string; value: T }>;
  value: T;
}) {
  const segments = (
    <div className="flex min-w-0 flex-1 items-center justify-end gap-0.5 p-1">
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            aria-pressed={active}
            className={cn(
              "min-w-0 flex-1 truncate rounded-xl px-2 py-1.5 font-medium text-[12px] transition-colors",
              active
                ? "bg-[#d1d1d1] text-[#111113] dark:bg-[#3a3a3a] dark:text-zinc-100"
                : "text-[#5c5c61] hover:text-[#111113] dark:text-[#a1a1a6] dark:hover:text-zinc-100"
            )}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );

  if (!label) {
    return <PlaygroundRow>{segments}</PlaygroundRow>;
  }

  return (
    <PlaygroundRow className="flex-nowrap gap-3 px-3">
      <span className="shrink-0 whitespace-nowrap font-medium text-[#5c5c61] text-[13px] dark:text-[#a1a1a6]">
        {label}
      </span>
      {segments}
    </PlaygroundRow>
  );
}

export function DocsPlaygroundToggleField({
  checked,
  disabled = false,
  label,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className={disabled ? "pointer-events-none opacity-45" : undefined}>
      <DocsPlaygroundSegmentedField
        label={label}
        onChange={(next) => onChange(next === "on")}
        options={[
          { label: "off", value: "off" },
          { label: "on", value: "on" },
        ]}
        value={checked ? "on" : "off"}
      />
    </div>
  );
}

export function DocsPlaygroundClearButton({
  label = "Clear value",
  onClick,
}: {
  label?: string;
  onClick: () => void;
}) {
  return (
    <button
      className="h-12 w-full rounded-2xl bg-[#ebebeb] font-medium text-[#2f2f33] text-[13px] transition-colors hover:bg-[#e2e2e5] dark:bg-[#232323] dark:text-zinc-100 dark:hover:bg-[#2b2b2b]"
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
