"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import type { Icon } from "@/actions/get-icons";

import { Separator } from "@/components/ui/separator";
import { ICON_LIST } from "@/icons";

type Props = {
  currentIcon: Icon;
};

const ICON_MAP = new Map(ICON_LIST.map((item) => [item.name, item.icon]));

const SimilarIconItem = ({
  icon,
  Icon,
}: {
  icon: Icon;
  Icon: React.ElementType | undefined;
}) => {
  const animationRef = useRef<{
    startAnimation: () => void;
    stopAnimation: () => void;
  }>(null);

  if (!Icon) {
    return null;
  }

  return (
    <Link
      className="block border border-border/80 bg-background p-4 focus-visible:outline-1 focus-visible:outline-primary focus-visible:outline-offset-2"
      href={`/icons/${icon.name}`}
    >
      <div
        className="flex min-h-[132px] flex-col justify-between gap-6"
        onMouseEnter={() => animationRef.current?.startAnimation()}
        onMouseLeave={() => animationRef.current?.stopAnimation()}
      >
        <Icon
          className="flex items-center justify-center [&>svg]:size-10 [&>svg]:text-neutral-800 dark:[&>svg]:text-neutral-100"
          ref={animationRef}
        />
        <div className="space-y-3">
          <Separator />
          <p className="font-medium text-[15px] text-foreground tracking-[-0.03em]">
            {icon.name}
          </p>
        </div>
      </div>
    </Link>
  );
};

const SimilarIcons = ({ currentIcon }: Props) => {
  const similarIcons = useMemo(() => {
    const currentKeywords = new Set(currentIcon.keywords);

    const scored = ICON_LIST.filter((icon) => icon.name !== currentIcon.name)
      .map((icon) => {
        const sharedKeywords = icon.keywords.filter((kw) =>
          currentKeywords.has(kw)
        ).length;
        return { icon, score: sharedKeywords };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    return scored.map((item) => item.icon);
  }, [currentIcon]);

  if (similarIcons.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 w-full">
      <h2 className="mb-4 text-xl tracking-[-0.03em]">Similar Icons</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {similarIcons.map((icon) => (
          <SimilarIconItem
            Icon={ICON_MAP.get(icon.name) ?? undefined}
            icon={icon}
            key={icon.name}
          />
        ))}
      </div>
    </div>
  );
};

export { SimilarIcons };
