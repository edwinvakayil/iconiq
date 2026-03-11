"use client";

import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { openComponentInV0Action } from "@/actions/open-component-in-v0";
import { cn } from "@/lib/utils";

const V0Icon = ({ className }: { className?: string }) => (
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

type ActionState = "idle" | "loading" | "done" | "error";

const btnBase =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-sm border px-3.5 py-1.5 font-sans text-xs font-medium transition-colors duration-150 focus-visible:outline-1 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-60";

const OpenInV0Button = ({ name }: { name: string }) => {
  const [state, setState] = useState<ActionState>("idle");

  const handleOpenInV0 = async () => {
    if (state !== "idle") return;
    try {
      setState("loading");
      const data = await openComponentInV0Action(name);
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
      <Loader aria-hidden className="size-3 animate-spin" />
    ) : (
      <V0Icon aria-hidden className="h-3 w-auto" />
    );

  return (
    <button
      aria-label="Open in v0"
      className={cn(
        btnBase,
        "border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800",
        "dark:border-neutral-100 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
      )}
      disabled={state !== "idle"}
      onClick={handleOpenInV0}
      type="button"
    >
      Open in {icon}
    </button>
  );
};

export function ComponentActions({ name }: { name: string }) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      <OpenInV0Button name={name} />
    </div>
  );
}
