import { Bold, Italic, Underline } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Pos = { x: number; y: number } | null;

export function SelectionToolbar({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<Pos>(null);
  const [active, setActive] = useState<{
    bold: boolean;
    italic: boolean;
    underline: boolean;
  }>({
    bold: false,
    italic: false,
    underline: false,
  });
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
        setPos(null);
        return;
      }
      const range = sel.getRangeAt(0);
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

    const onMouseDown = (e: MouseEvent) => {
      if (toolbarRef.current?.contains(e.target as Node)) return;
      setPos(null);
    };

    document.addEventListener("selectionchange", update);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      document.removeEventListener("selectionchange", update);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [containerRef]);

  const exec =
    (cmd: "bold" | "italic" | "underline") => (e: React.MouseEvent) => {
      e.preventDefault();
      document.execCommand(cmd);
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
    <div
      aria-label="Text formatting"
      className="z-50 flex items-center gap-1 rounded-lg bg-neutral-800 px-2 py-1.5 shadow-xl ring-1 ring-black/20"
      onMouseDown={(e) => e.preventDefault()}
      ref={toolbarRef}
      role="toolbar"
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
    </div>,
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
  onMouseDown: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-neutral-200 transition-colors hover:bg-neutral-700 hover:text-white ${
        active ? "bg-neutral-700 text-white" : ""
      }`}
      onMouseDown={onMouseDown}
      type="button"
    >
      {children}
    </button>
  );
}
