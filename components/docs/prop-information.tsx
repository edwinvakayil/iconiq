"use client";

import { InfoIcon } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/popover";

interface PropInformationProps {
  content: React.ReactNode;
}

export function PropInformation({ content }: PropInformationProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <button
          aria-label="More information"
          className="inline-flex items-center justify-center rounded-md p-1 transition-colors hover:bg-accent"
          type="button"
        >
          <InfoIcon className="size-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto max-w-96 px-3 py-1.5 text-muted-foreground text-sm leading-[18px]"
        open={open}
        side="top"
        sideOffset={8}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}
