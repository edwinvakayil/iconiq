"use client";

import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { openComponentInV0Action } from "@/actions/open-component-in-v0";
import { cn } from "@/lib/utils";

function V0Icon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="currentColor"
      viewBox="0 0 40 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z" />
      <path d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z" />
    </svg>
  );
}

type ActionState = "idle" | "loading" | "done" | "error";

export function OpenInV0Button({
  name,
  pageContent,
  className,
  variant = "canvas",
}: {
  name: string;
  pageContent?: string;
  className?: string;
  variant?: "canvas" | "menu";
}) {
  const [state, setState] = useState<ActionState>("idle");

  const handleOpenInV0 = async () => {
    if (state !== "idle") {
      return;
    }

    try {
      setState("loading");
      const data = await openComponentInV0Action(name, pageContent);

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
        } else {
          setState("done");
        }
      } else {
        toast.error("Failed to open in v0", {
          description: data.error ?? "Please try again later.",
        });
        setState("error");
      }

      setTimeout(() => setState("idle"), 2000);
    } catch {
      toast.error("Failed to open in v0", {
        description: "Please try again later.",
      });
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  };

  const icon =
    state === "loading" ? (
      <Loader aria-hidden className="size-3.5 animate-spin" />
    ) : (
      <V0Icon className="h-3.5 w-auto" />
    );

  if (variant === "menu") {
    return (
      <button
        className={cn(
          "flex w-full items-center justify-between whitespace-nowrap rounded-xl px-3 py-2 text-[14px] text-foreground transition-colors hover:bg-muted/70",
          className
        )}
        disabled={state !== "idle"}
        onClick={handleOpenInV0}
        type="button"
      >
        <span>Open in v0</span>
        {icon}
      </button>
    );
  }

  return (
    <button
      aria-label="Open in v0"
      className={cn(
        "dark:hover:!text-neutral-950 dark:focus-visible:!text-neutral-950 inline-flex h-8 cursor-pointer items-center gap-1 rounded-md bg-neutral-950 px-3 text-white text-xs transition-colors hover:bg-neutral-800 disabled:pointer-events-none disabled:opacity-60 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200",
        className
      )}
      disabled={state !== "idle"}
      onClick={handleOpenInV0}
      type="button"
    >
      <span>Open in</span>
      {icon}
    </button>
  );
}
