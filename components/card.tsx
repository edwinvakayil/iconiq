"use client";

import { useOpenPanel } from "@openpanel/nextjs";
import { Copy, PauseIcon, PlayIcon, Terminal } from "lucide-react";
import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getIconContent } from "@/actions/get-icon-content";
import type { Icon } from "@/actions/get-icons";
import { openInV0Action } from "@/actions/open-in-v0";
import { ANALYTIC_EVENT } from "@/components/analytics";
import type { IconStatus } from "@/components/ui/icon-state";
import { IconState } from "@/components/ui/icon-state";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SITE } from "@/constants";
import { useTouchDevice } from "@/hooks/use-touch-device";
import { getPackageManagerPrefix } from "@/lib/get-package-manager-prefix";
import { cn } from "@/lib/utils";
import { usePackageNameContext } from "@/providers/package-name";

const V0Icon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 40 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z" />
      <path d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z" />
    </svg>
  );
};

interface CardProps extends React.ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  animationRef?: RefObject<{
    startAnimation: () => void;
    stopAnimation: () => void;
  } | null>;
}

const Card = ({ children, animationRef, className, ...props }: CardProps) => {
  const isTouchDevice = useTouchDevice();
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isAnimating) {
      animationRef?.current?.stopAnimation();
      setIsAnimating(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else {
      animationRef?.current?.startAnimation();
      setIsAnimating(true);

      timeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        animationRef?.current?.stopAnimation();
      }, 1500);
    }
  };

  return (
    <div
      className={cn(
        "group/card supports-[corner-shape:squircle]:corner-squircle relative flex h-full flex-col items-stretch justify-between rounded-[18px] border border-neutral-200/80 bg-background px-4 pt-5 pb-4 supports-[corner-shape:squircle]:rounded-[24px]",
        className
      )}
      {...props}
      onMouseEnter={isTouchDevice ? undefined : props.onMouseEnter}
      onMouseLeave={isTouchDevice ? undefined : props.onMouseLeave}
    >
      {isTouchDevice && (
        <button
          aria-label={isAnimating ? "Stop animation" : "Play animation"}
          aria-pressed={isAnimating}
          className="supports-[corner-shape:squircle]:corner-squircle absolute top-3 right-3 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full bg-neutral-100/80 text-neutral-700 transition-[background-color] duration-100 hover:bg-neutral-200 focus-visible:outline-1 focus-visible:outline-primary supports-[corner-shape:squircle]:rounded-[999px]"
          onClick={handlePlayClick}
          type="button"
        >
          {isAnimating ? (
            <PauseIcon aria-hidden="true" className="size-4 text-neutral-800" />
          ) : (
            <PlayIcon aria-hidden="true" className="size-4 text-neutral-800" />
          )}
        </button>
      )}
      {children}
    </div>
  );
};

const Title = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="mt-4 text-left font-mono text-[11px] text-neutral-500 uppercase tracking-[0.18em]">
      {children}
    </p>
  );
};

const CopyCLIAction = ({ name }: Pick<Icon, "name">) => {
  const op = useOpenPanel();
  const { packageName } = usePackageNameContext();

  const [state, setState] = useState<IconStatus>("idle");

  const handleCopy = async () => {
    if (state !== "idle") return;

    try {
      op.track(ANALYTIC_EVENT.ICON_COPY_TERMINAL, { icon: `${name}.tsx` });
      await navigator.clipboard.writeText(
        `${getPackageManagerPrefix(packageName)} shadcn@latest add "${SITE.URL}/r/${name}.json"`
      );
      setState("done");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      toast.error("Failed to copy to clipboard", {
        description: "Please check your browser permissions.",
      });
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger
        aria-disabled={state !== "idle"}
        aria-label="Copy shadcn/cli command"
        className="supports-[corner-shape:squircle]:corner-squircle flex size-9 cursor-pointer items-center justify-center rounded-[999px] bg-neutral-100 transition-[background-color] duration-100 hover:bg-neutral-200 focus-visible:outline-1 focus-visible:outline-primary supports-[corner-shape:squircle]:rounded-[999px]"
        data-busy={state !== "idle" ? "" : undefined}
        onClick={handleCopy}
        tabIndex={0}
      >
        <IconState status={state}>
          <Terminal aria-hidden="true" className="size-4 text-neutral-800" />
        </IconState>
      </TooltipTrigger>
      <TooltipContent>
        Copy{" "}
        <code className="rounded-[4px] bg-neutral-50/20 px-1 py-0.5 font-mono dark:bg-neutral-700/80 dark:text-neutral-200">
          shadcn/cli
        </code>{" "}
        command
      </TooltipContent>
    </Tooltip>
  );
};

const CopyCodeAction = ({ name }: Pick<Icon, "name">) => {
  const op = useOpenPanel();

  const [state, setState] = useState<IconStatus>("idle");

  const handleCopy = async () => {
    if (state !== "idle") return;

    try {
      setState("loading");
      op.track(ANALYTIC_EVENT.ICON_COPY, { icon: `${name}.tsx` });

      const content = await getIconContent(name);

      await navigator.clipboard.writeText(content);
      setState("done");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      toast.error("Failed to copy to clipboard", {
        description: "Please check your browser permissions.",
      });
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger
        aria-disabled={state !== "idle"}
        aria-label="Copy .tsx code"
        className="supports-[corner-shape:squircle]:corner-squircle flex size-9 cursor-pointer items-center justify-center rounded-[999px] bg-neutral-100 transition-[background-color] duration-100 hover:bg-neutral-200 focus-visible:outline-1 focus-visible:outline-primary supports-[corner-shape:squircle]:rounded-[999px]"
        data-busy={state !== "idle" ? "" : undefined}
        onClick={handleCopy}
        tabIndex={0}
      >
        <IconState status={state}>
          <Copy aria-hidden="true" className="size-4 text-neutral-800" />
        </IconState>
      </TooltipTrigger>
      <TooltipContent>
        Copy{" "}
        <code className="rounded-[4px] bg-neutral-50/20 px-1 py-0.5 font-mono dark:bg-neutral-700/80 dark:text-neutral-200">
          .tsx
        </code>{" "}
        code
      </TooltipContent>
    </Tooltip>
  );
};

const OpenInV0Action = ({ name }: Pick<Icon, "name">) => {
  const op = useOpenPanel();

  const [state, setState] = useState<IconStatus>("idle");

  const handleOpenInV0 = async () => {
    if (state !== "idle") return;
    try {
      setState("loading");
      op.track(ANALYTIC_EVENT.ICON_OPEN_IN_V0, { icon: `${name}.tsx` });
      const data = await openInV0Action(name);

      if (data.url) {
        const popupOpened = window.open(data.url, "_blank");
        if (popupOpened === null) {
          toast.warning("Pop-up window blocked.", {
            description: "Click below to continue in new tab.",
            duration: 5000,
            action: {
              label: "Open in new tab",
              onClick: () => window.open(data.url, "_blank"),
            },
          });

          setState("error");
        }
      } else {
        setState("done");
      }

      setTimeout(() => setState("idle"), 2000);
    } catch (_error) {
      toast.error("Failed to open in v0", {
        description: "Please try again later.",
      });
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger
        aria-disabled={state !== "idle"}
        aria-label="Open in v0"
        className="supports-[corner-shape:squircle]:corner-squircle flex size-9 cursor-pointer items-center justify-center rounded-[999px] bg-neutral-100 transition-[background-color] duration-100 hover:bg-neutral-200 focus-visible:outline-1 focus-visible:outline-primary supports-[corner-shape:squircle]:rounded-[999px]"
        data-busy={state !== "idle" ? "" : undefined}
        onClick={handleOpenInV0}
        tabIndex={0}
      >
        <IconState status={state}>
          <V0Icon aria-hidden="true" className="size-5 text-neutral-800" />
        </IconState>
      </TooltipTrigger>
      <TooltipContent>
        Open in{" "}
        <code className="rounded-[4px] bg-neutral-50/20 px-1 py-0.5 font-mono dark:bg-neutral-700/80 dark:text-neutral-200">
          v0
        </code>
      </TooltipContent>
    </Tooltip>
  );
};

type ActionsProps = Pick<Icon, "name"> & {
  alwaysVisible?: boolean;
};

const Actions = ({ name, alwaysVisible = false }: ActionsProps) => {
  return (
    <TooltipProvider>
      <div
        className={cn(
          "my-6 flex items-center justify-center gap-2 transition-opacity duration-100",
          alwaysVisible
            ? "opacity-100"
            : "opacity-0 group-hover/card:opacity-100 has-data-busy:opacity-100 has-data-popup-open:opacity-100 has-focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
        )}
      >
        <CopyCodeAction name={name} />
        <CopyCLIAction name={name} />
        <OpenInV0Action name={name} />
      </div>
    </TooltipProvider>
  );
};

const CardTitle = Title;
const CardActions = Actions;

export { Card, CardTitle, CardActions };
