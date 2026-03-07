"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import Fuse from "fuse.js";
import { CopyIcon, SearchIcon, Terminal } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { Icon } from "@/actions/get-icons";
import { CodeBlock } from "@/components/code-block";
import type { IconStatus } from "@/components/ui/icon-state";
import { IconState } from "@/components/ui/icon-state";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PACKAGE_MANAGER } from "@/constants";
import { ICON_LIST } from "@/icons";
import { BUTTON_VARIANTS, getButtonWithIconCode } from "@/lib/button-icon-code";
import { getPackageManagerPrefix } from "@/lib/get-package-manager-prefix";
import { cn } from "@/lib/utils";
import { usePackageNameContext } from "@/providers/package-name";

const ICON_MAP = new Map(ICON_LIST.map((item) => [item.name, item.icon]));

type ButtonSvgBuilderProps = {
  icons: Icon[];
};

export function ButtonSvgBuilder({ icons }: ButtonSvgBuilderProps) {
  const [selectedName, setSelectedName] = useState(icons[0]?.name ?? "bell");
  const [searchValue, setSearchValue] = useState("");
  const [buttonLabel, setButtonLabel] = useState("Click me");
  const [buttonVariant, setButtonVariant] =
    useState<(typeof BUTTON_VARIANTS)[number]>("default");
  const [codeState, setCodeState] = useState<IconStatus>("idle");
  const [cliState, setCliState] = useState<IconStatus>("idle");

  const previewAnimationRef = useRef<{
    startAnimation: () => void;
    stopAnimation: () => void;
  }>(null);
  const iconSearchRef = useRef<HTMLInputElement>(null);

  useHotkey(
    "Mod+F",
    (event) => {
      event?.preventDefault?.();
      iconSearchRef.current?.focus();
      iconSearchRef.current?.select();
    },
    { ignoreInputs: false }
  );

  const { packageName, setPackageName } = usePackageNameContext();
  const cliPrefix = getPackageManagerPrefix(packageName);

  const fuse = useMemo(
    () =>
      new Fuse(icons, {
        keys: [
          { name: "name", weight: 3 },
          { name: "keywords", weight: 2 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [icons]
  );

  const filteredIcons = useMemo(() => {
    if (!searchValue.trim()) return icons.slice(0, 48);
    return fuse
      .search(searchValue)
      .map((r) => r.item)
      .slice(0, 48);
  }, [icons, fuse, searchValue]);

  const SelectedIconComponent = selectedName
    ? ICON_MAP.get(selectedName)
    : undefined;

  const codeSnippet = getButtonWithIconCode({
    iconName: selectedName,
    cliPrefix,
    buttonLabel,
    variant: buttonVariant,
  });

  const cliCommand = `${cliPrefix} shadcn add @iconiq/${selectedName}`;

  const handleCopyCode = async () => {
    if (codeState !== "idle") return;
    try {
      setCodeState("loading");
      await navigator.clipboard.writeText(codeSnippet);
      setCodeState("done");
      toast.success("Code copied", {
        description: "Button + icon code copied to clipboard.",
      });
      setTimeout(() => setCodeState("idle"), 2000);
    } catch {
      toast.error("Failed to copy", {
        description: "Please check your browser permissions.",
      });
      setCodeState("error");
      setTimeout(() => setCodeState("idle"), 2000);
    }
  };

  const handleCopyCli = async () => {
    if (cliState !== "idle") return;
    try {
      await navigator.clipboard.writeText(cliCommand);
      setCliState("done");
      toast.success("Command copied", {
        description: "npm/shadcn command copied to clipboard.",
      });
      setTimeout(() => setCliState("idle"), 2000);
    } catch {
      toast.error("Failed to copy", {
        description: "Please check your browser permissions.",
      });
      setCliState("error");
      setTimeout(() => setCliState("idle"), 2000);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Icon picker */}
        <div>
          <label
            className="mb-2 block font-medium font-sans text-[11px] text-neutral-500 uppercase tracking-wider dark:text-neutral-400"
            htmlFor="icon-search"
          >
            Choose an icon
          </label>
          <div className="relative mb-3 w-full max-w-[260px]">
            <Input
              aria-label="Search icons"
              className="pr-20 pl-8"
              id="icon-search"
              leadingIcon={
                <SearchIcon
                  className="size-4 text-neutral-400 dark:text-neutral-500"
                  strokeWidth={2.5}
                />
              }
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  setSearchValue("");
                  iconSearchRef.current?.blur();
                }
              }}
              placeholder="Search icons..."
              ref={iconSearchRef}
              value={searchValue}
            />
            <div className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 items-center gap-1 font-mono text-[10px] text-neutral-500 dark:text-neutral-400 md:flex">
              <kbd className="flex h-4 min-w-4 items-center justify-center rounded-[3px] bg-neutral-200 px-1 text-[10px] leading-4 dark:bg-neutral-700 dark:text-neutral-200">
                ⌘
              </kbd>
              <kbd className="flex h-4 min-w-4 items-center justify-center rounded-[3px] bg-neutral-200 px-1 text-[10px] leading-4 dark:bg-neutral-700 dark:text-neutral-200">
                F
              </kbd>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {filteredIcons.map((icon) => {
              const IconComp = ICON_MAP.get(icon.name);
              const isSelected = selectedName === icon.name;
              return (
                <button
                  aria-pressed={isSelected}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg border transition-colors hover:bg-neutral-100 focus-visible:outline-1 focus-visible:outline-primary dark:hover:bg-neutral-800",
                    isSelected
                      ? "border-neutral-900 bg-neutral-100 ring-1 ring-neutral-900 dark:border-neutral-200 dark:bg-neutral-800 dark:ring-neutral-200"
                      : "border-neutral-200 bg-background dark:border-neutral-700 dark:bg-background"
                  )}
                  key={icon.name}
                  onClick={() => setSelectedName(icon.name)}
                  title={icon.name}
                  type="button"
                >
                  {IconComp && (
                    <IconComp className="[&>svg]:size-5 [&>svg]:text-neutral-900 [&>svg]:dark:text-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-6">
          {/* Button text */}
          <div>
            <label
              className="mb-2 block font-medium font-sans text-[11px] text-neutral-500 uppercase tracking-wider dark:text-neutral-400"
              htmlFor="button-text"
            >
              Button text
            </label>
            <Input
              aria-label="Button text"
              className="max-w-[240px]"
              id="button-text"
              onChange={(e) => setButtonLabel(e.target.value)}
              placeholder="Click me"
              value={buttonLabel}
            />
          </div>

          {/* Button variant */}
          <div>
            <label
              className="mb-2 block font-medium font-sans text-[11px] text-neutral-500 uppercase tracking-wider dark:text-neutral-400"
              htmlFor="button-variant"
            >
              Variant
            </label>
            <select
              aria-label="Button variant"
              className="flex h-9 max-w-[180px] rounded-md border border-neutral-200 bg-background px-3 py-1 font-sans text-sm outline-none ring-1 ring-neutral-200 transition-colors hover:ring-neutral-300 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-0 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:ring-neutral-700 dark:hover:ring-neutral-600 dark:focus:ring-neutral-500"
              id="button-variant"
              onChange={(e) =>
                setButtonVariant(
                  e.target.value as (typeof BUTTON_VARIANTS)[number]
                )
              }
              value={buttonVariant}
            >
              {BUTTON_VARIANTS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preview */}
        <div>
          <p className="mb-2 font-medium font-sans text-[11px] text-neutral-500 uppercase tracking-wider dark:text-neutral-400">
            Preview
          </p>
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 dark:border-neutral-800 dark:bg-neutral-900/30">
            <button
              className={cn(
                "inline-flex cursor-default items-center justify-center gap-2 rounded-md px-4 py-2 font-medium font-sans text-sm transition-colors",
                buttonVariant === "default" &&
                  "bg-neutral-900 text-white hover:bg-neutral-800",
                buttonVariant === "destructive" &&
                  "bg-red-600 text-white hover:bg-red-700",
                buttonVariant === "outline" &&
                  "border border-neutral-200 bg-transparent text-neutral-900 hover:bg-neutral-100 dark:border-neutral-600 dark:text-white dark:hover:bg-neutral-800",
                buttonVariant === "secondary" &&
                  "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700",
                buttonVariant === "ghost" &&
                  "text-neutral-900 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800",
                buttonVariant === "link" &&
                  "text-neutral-900 underline-offset-4 hover:underline dark:text-white"
              )}
              onMouseEnter={() => previewAnimationRef.current?.startAnimation()}
              onMouseLeave={() => previewAnimationRef.current?.stopAnimation()}
              type="button"
            >
              {SelectedIconComponent && (
                <SelectedIconComponent
                  className={cn(
                    "[&>svg]:size-4",
                    buttonVariant === "default" ||
                      buttonVariant === "destructive"
                      ? "[&>svg]:text-white"
                      : "[&>svg]:text-neutral-900 [&>svg]:dark:text-white"
                  )}
                  ref={previewAnimationRef}
                />
              )}
              {buttonLabel || " "}
            </button>
          </div>
        </div>

        {/* Package manager */}
        <div>
          <p className="mb-2 font-medium font-sans text-[11px] text-neutral-500 uppercase tracking-wider dark:text-neutral-400">
            Package manager
          </p>
          <Tabs
            onValueChange={(value) =>
              setPackageName(
                value as (typeof PACKAGE_MANAGER)[keyof typeof PACKAGE_MANAGER]
              )
            }
            value={packageName}
          >
            <TabsList className="w-full max-w-[320px]">
              {Object.values(PACKAGE_MANAGER).map((pm) => (
                <TabsTrigger key={pm} value={pm}>
                  {pm}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Copy code (button + icon) */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="font-medium font-sans text-[11px] text-neutral-500 uppercase tracking-wider dark:text-neutral-400">
              Code (Button + Icon)
            </p>
            <Tooltip>
              <TooltipTrigger
                aria-label="Copy code"
                className="flex size-9 items-center justify-center rounded-full bg-neutral-100 transition-colors hover:bg-neutral-200 focus-visible:outline-1 focus-visible:outline-primary disabled:opacity-50 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                data-busy={codeState !== "idle" ? "" : undefined}
                disabled={codeState !== "idle"}
                onClick={handleCopyCode}
              >
                <IconState status={codeState}>
                  <CopyIcon className="size-4 text-neutral-800 dark:text-neutral-200" />
                </IconState>
              </TooltipTrigger>
              <TooltipContent>
                Copy code (Button + Icon component)
              </TooltipContent>
            </Tooltip>
          </div>
          <CodeBlock className="text-xs">{codeSnippet}</CodeBlock>
        </div>

        {/* Copy npm / shadcn CLI */}
        <div>
          <p className="mb-2 font-medium font-sans text-[11px] text-neutral-500 uppercase tracking-wider dark:text-neutral-400">
            Install via {packageName} / SHADCN CLI
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50/50 px-4 py-3 font-mono text-sm dark:border-neutral-800 dark:bg-neutral-900/30">
            <code className="flex-1 truncate text-neutral-900 dark:text-neutral-100">
              {cliCommand}
            </code>
            <Tooltip>
              <TooltipTrigger
                aria-label="Copy CLI command"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 transition-colors hover:bg-neutral-200 focus-visible:outline-1 focus-visible:outline-primary disabled:opacity-50 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                data-busy={cliState !== "idle" ? "" : undefined}
                disabled={cliState !== "idle"}
                onClick={handleCopyCli}
              >
                <IconState status={cliState}>
                  <Terminal className="size-4 text-neutral-800 dark:text-neutral-200" />
                </IconState>
              </TooltipTrigger>
              <TooltipContent>Copy shadcn CLI command</TooltipContent>
            </Tooltip>
          </div>
          <p className="mt-2 font-sans text-neutral-500 text-sm dark:text-neutral-400">
            Run this in your project to add the icon. Add the Button component
            with{" "}
            <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
              shadcn add button
            </code>{" "}
            if you don’t have it yet.
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}
