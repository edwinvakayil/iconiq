"use client";

import Fuse from "fuse.js";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import type { Icon } from "@/actions/get-icons";

import { Card, CardActions, CardTitle } from "@/components/card";
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
    <Card
      animationRef={animationRef}
      className="[contain-intrinsic-size:auto_200px] [content-visibility:auto]"
      key={icon.name}
      onMouseEnter={() => animationRef.current?.startAnimation()}
      onMouseLeave={() => animationRef.current?.stopAnimation()}
    >
      <div className="flex items-center justify-start">
        <Icon
          className="flex items-center justify-center [&>svg]:size-10 [&>svg]:text-neutral-900"
          ref={animationRef}
        />
      </div>
      <CardTitle>{icon.name}</CardTitle>
      <CardActions {...icon} />
    </Card>
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
    <section className="mb-20 w-full space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-sans text-xs uppercase tracking-[0.18em] text-secondary">
            Icon library
          </h2>
          <p className="font-mono text-xs text-secondary">
            Showing {filteredIcons.length.toLocaleString()} of{" "}
            {totalCount.toLocaleString()} icons
          </p>
        </div>
        <SearchInput
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </div>
      <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {filteredIcons.length === 0 && (
          <div className="col-span-full pt-10 text-center text-neutral-500 text-sm">
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
