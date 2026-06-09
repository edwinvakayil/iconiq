"use client";

import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
import { Bold, Italic, Underline } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";

type Pos = { x: number; y: number } | null;

export interface SelectionToolbarProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

export function SelectionToolbar({ containerRef }: SelectionToolbarProps) {
  const [mounted, setMounted] = React.useState(false);
  const [pos, setPos] = React.useState<Pos>(null);
  const [active, setActive] = React.useState({
    bold: false,
    italic: false,
    underline: false,
  });
  const toolbarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }

    const update = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        setPos(null);
        return;
      }

      const range = selection.getRangeAt(0);
      if (!el.contains(range.commonAncestorContainer)) {
        setPos(null);
        return;
      }

      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        setPos(null);
        return;
      }

      setPos({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
      setActive({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
      });
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (toolbarRef.current?.contains(event.target as Node)) {
        return;
      }

      setPos(null);
    };

    document.addEventListener("selectionchange", update);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      document.removeEventListener("selectionchange", update);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [containerRef]);

  const exec =
    (command: "bold" | "italic" | "underline") =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      document.execCommand(command);
      setActive({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
      });
    };

  const visible = pos !== null;

  if (!mounted) {
    return null;
  }

  return createPortal(
    <ToolbarPrimitive.Root
      aria-label="Text formatting"
      className="z-50 flex items-center gap-1 rounded-lg bg-neutral-800 px-2 py-1.5 shadow-xl ring-1 ring-black/20"
      onMouseDown={(event) => event.preventDefault()}
      orientation="horizontal"
      ref={toolbarRef}
      style={{
        position: "fixed",
        left: pos?.x ?? 0,
        top: pos?.y ?? 0,
        transform: `translate(-50%, calc(-100% - 10px)) scale(${visible ? 1 : 0.9})`,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition:
          "opacity 150ms ease, transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <ToolbarButton
        active={active.bold}
        label="Bold"
        onMouseDown={exec("bold")}
      >
        <Bold className="h-4 w-4" strokeWidth={2.5} />
      </ToolbarButton>
      <ToolbarButton
        active={active.italic}
        label="Italic"
        onMouseDown={exec("italic")}
      >
        <Italic className="h-4 w-4" strokeWidth={2.5} />
      </ToolbarButton>
      <ToolbarButton
        active={active.underline}
        label="Underline"
        onMouseDown={exec("underline")}
      >
        <Underline className="h-4 w-4" strokeWidth={2.5} />
      </ToolbarButton>
    </ToolbarPrimitive.Root>,
    document.body
  );
}

function ToolbarButton({
  children,
  label,
  active,
  onMouseDown,
}: {
  children: React.ReactNode;
  label: string;
  active: boolean;
  onMouseDown: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <ToolbarPrimitive.Button
      aria-label={label}
      aria-pressed={active}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-neutral-200 transition-colors hover:bg-neutral-700 hover:text-white ${
        active ? "bg-neutral-700 text-white" : ""
      }`}
      onMouseDown={onMouseDown}
      type="button"
    >
      {children}
    </ToolbarPrimitive.Button>
  );
}
