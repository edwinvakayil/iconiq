"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import type { Icon } from "@/actions/get-icons";

import { Separator } from "@/components/ui/separator";
import { ICON_LIST } from "@/icons";
import { SearchInput } from "./search-input";

type Props = {
  icons: Icon[];
};

const ICON_MAP = new Map(ICON_LIST.map((item) => [item.name, item.icon]));

const IconItem = ({
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
      className="group block border border-border/80 bg-background p-4 transition-colors hover:bg-muted/45"
      href={`/icons/${icon.name}`}
      key={icon.name}
      onMouseEnter={() => animationRef.current?.startAnimation()}
      onMouseLeave={() => animationRef.current?.stopAnimation()}
    >
      <div className="flex min-h-[132px] flex-col justify-between gap-6 [contain-intrinsic-size:auto_180px] [content-visibility:auto]">
        <div className="flex items-center justify-between gap-3">
          <Icon
            className="flex items-center justify-center [&>svg]:size-10 [&>svg]:text-neutral-900 [&>svg]:dark:text-white"
            ref={animationRef}
          />
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
            icon
          </span>
        </div>
        <div className="space-y-3">
          <Separator />
          <div className="space-y-1">
            <p className="font-medium text-[15px] text-foreground tracking-[-0.03em]">
              {icon.name}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
              Open detail
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

const IconsList = ({ icons }: Props) => {
  const [searchValue, setSearchValue] = useState("");
  const deferredSearchValue = useDeferredValue(searchValue);

  const fuse = useMemo(
    () =>
      new Fuse(icons, {
        keys: [
          { name: "name", weight: 3 },
          { name: "keywords", weight: 2 },
        ],
        threshold: 0.3,
        ignoreLocation: true,
        findAllMatches: true,
        isCaseSensitive: false,
        minMatchCharLength: 2,
      }),
    [icons]
  );

  const filteredIcons = useMemo(() => {
    if (!deferredSearchValue.trim()) return icons;
    return fuse.search(deferredSearchValue).map((result) => result.item);
  }, [fuse, icons, deferredSearchValue]);

  const totalCount = icons.length;

  return (
    <section className="mb-20 w-full space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
            Icon library
          </h2>
          <p className="font-mono text-secondary text-xs">
            Showing {filteredIcons.length.toLocaleString()} of{" "}
            {totalCount.toLocaleString()} icons
          </p>
        </div>
        <SearchInput
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </div>
      <Separator />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {filteredIcons.length === 0 && (
          <div className="col-span-full border border-border/80 bg-muted/[0.12] px-4 py-12 text-center text-neutral-500 text-sm dark:text-neutral-400">
            No icons found
          </div>
        )}
        {filteredIcons.map((icon) => (
          <IconItem
            Icon={ICON_MAP.get(icon.name) ?? undefined}
            icon={icon}
            key={icon.name}
          />
        ))}
      </div>
    </section>
  );
};

export { IconsList };
