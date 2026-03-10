"use client";
import type {
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from "react";
import { useRef } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/accordion";
import { cn } from "@/lib/utils";

interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

type AnimatedIconComponent = ForwardRefExoticComponent<
  {
    className?: string;
    size?: number;
  } & RefAttributes<AnimatedIconHandle>
>;

export interface AccordionAnimatedItem {
  value: string;
  title: string;
  subtitle?: string;
  content: ReactNode;
  icon: AnimatedIconComponent;
  textColor?: string;
  bgColor?: string;
}

interface AccordionAnimatedProps {
  items: readonly AccordionAnimatedItem[];
  defaultValue?: readonly string[];
  className?: string;
}

export function AccordionAnimated({
  items,
  defaultValue,
}: AccordionAnimatedProps) {
  const initial: string[] = defaultValue
    ? [...defaultValue]
    : items[0]
      ? [items[0].value]
      : [];

  return (
    <div className="flex w-full max-w-md items-center justify-center">
      <Accordion
        className="w-full -space-y-px"
        defaultValue={initial}
        type="multiple"
      >
        {items.map((item) => (
          <AccordionAnimatedItemRow item={item} key={item.value} />
        ))}
      </Accordion>
    </div>
  );
}

function AccordionAnimatedItemRow({ item }: { item: AccordionAnimatedItem }) {
  const iconRef = useRef<AnimatedIconHandle | null>(null);
  const Icon = item.icon;

  return (
    <AccordionItem
      className="border border-neutral-200/80 bg-background px-4 first:rounded-t-lg last:rounded-b-lg last:border-b dark:border-neutral-800/80"
      value={item.value}
    >
      <AccordionTrigger
        className="hover:no-underline"
        onMouseEnter={() => iconRef.current?.startAnimation()}
        onMouseLeave={() => iconRef.current?.stopAnimation()}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl",
              item.bgColor,
              item.textColor
            )}
          >
            <Icon ref={iconRef} size={24} />
          </div>
          <div className="flex flex-col items-start text-left">
            <span>{item.title}</span>
            {item.subtitle ? (
              <span className="text-muted-foreground text-sm">
                {item.subtitle}
              </span>
            ) : null}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="ps-14">
        <p className="text-muted-foreground">{item.content}</p>
      </AccordionContent>
    </AccordionItem>
  );
}
