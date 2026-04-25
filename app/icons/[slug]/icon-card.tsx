"use client";

import { useMemo, useRef } from "react";
import type { Icon } from "@/actions/get-icons";

import { Separator } from "@/components/ui/separator";
import { ICON_LIST } from "@/icons";

type Props = {
  icon: Icon;
};

const IconCard = ({ icon }: Props) => {
  const animationRef = useRef<{
    startAnimation: () => void;
    stopAnimation: () => void;
  }>(null);

  const IconComponent = useMemo(() => {
    return ICON_LIST.find((item) => item.name === icon.name)?.icon;
  }, [icon.name]);

  if (!IconComponent) {
    return null;
  }

  return (
    <div
      className="w-full border border-border/80 bg-background p-6 min-[880px]:w-auto"
      onMouseEnter={() => animationRef.current?.startAnimation()}
      onMouseLeave={() => animationRef.current?.stopAnimation()}
    >
      <div className="flex min-h-[180px] min-w-[220px] flex-col justify-between gap-8">
        <div className="flex items-start justify-between gap-4">
          <IconComponent
            className="flex items-center justify-center [&>svg]:size-14 [&>svg]:text-neutral-800 dark:[&>svg]:text-neutral-100"
            ref={animationRef}
          />
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
            animated icon
          </span>
        </div>
        <div className="space-y-3">
          <Separator />
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
            Preview only. Install command sits below.
          </p>
        </div>
      </div>
    </div>
  );
};

export { IconCard };
