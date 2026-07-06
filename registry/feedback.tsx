"use client";

import { Loader2 } from "lucide-react";
import {
  AnimatePresence,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react";
import {
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

/** Horizontal padding on the collapsed pill (px-3 on each side). */
const COLLAPSED_PADDING_X = 14;
/** Used only as a sane pre-measurement fallback — corrected on mount. */
const DEFAULT_COLLAPSED_WIDTH = 200;
const COLLAPSED_HEIGHT = 36;
const EXPANDED_WIDTH = 336;
const EXPANDED_HEIGHT = 220;
const EXPANDED_RADIUS = 20;

/**
 * The exact clamp CSS would apply anyway (min(width,height)/2) for a fully
 * pill-shaped collapsed state. Animating *to* an oversized value like 999
 * hits that clamp almost immediately — while the box is still wide — so the
 * corners look fully round way too early and the shape reads as a blob
 * mid-shrink instead of a rectangle that gradually rounds off at the end.
 */
const COLLAPSED_RADIUS = COLLAPSED_HEIGHT / 2;

/** Box grows with a snappy spring on open. */
const OPEN_TRANSITION: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 34,
  mass: 0.9,
};

/**
 * Box shrinks back down with a slow, even ease (no sharp acceleration at the
 * end, unlike a spring settling) so it doesn't feel like a quick snap. Real
 * width/height/border-radius are animated directly here — not Motion's
 * `layout` scale trick — so the border, shadow, and corners never stretch or
 * ring mid-transition.
 */
const CLOSE_TRANSITION: Transition = {
  type: "tween",
  duration: 0.55,
  ease: [0.65, 0, 0.35, 1],
};

/**
 * The dot + "Feedback" label travel between the pill and the panel header
 * via a shared layoutId. This transition is intentionally the same for both
 * open and close — the box's own resize can be asymmetric (spring vs ease),
 * but the label should trace the exact same path in reverse, not a
 * different one, or the two directions read as unrelated motions.
 */
const LABEL_TRANSITION: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 40,
  mass: 0.8,
};

const CONTENT_FADE: Transition = { duration: 0.4, ease: [0.65, 0, 0.35, 1] };
const INSTANT: Transition = { duration: 0 };

function SendIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="13"
      viewBox="0 0 14 14"
      width="13"
    >
      <path
        d="M7 12V2M7 2L2.5 6.5M7 2L11.5 6.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

type SharedElementProps = {
  dotLayoutId: string;
  labelLayoutId: string;
  labelTransition: Transition;
};

type CollapsedTriggerProps = SharedElementProps & {
  fadeTransition: Transition;
  label: string;
  onMeasuredWidth: (width: number) => void;
  onOpen: () => void;
  reduceMotion: boolean;
  width: number;
  height: number;
};

function CollapsedTrigger({
  dotLayoutId,
  fadeTransition,
  height,
  label,
  labelLayoutId,
  labelTransition,
  onMeasuredWidth,
  onOpen,
  reduceMotion,
  width,
}: CollapsedTriggerProps) {
  const contentRef = useRef<HTMLSpanElement>(null);

  // Measure the content so the pill hugs "label | Feedback" exactly instead
  // of sitting inside a fixed, guessed-at width. Runs fresh on every mount
  // (the trigger unmounts while the panel is open), so it always measures a
  // live, currently-attached node rather than a stale one from a previous
  // mount. The shared layoutId dot/label can transiently report zero
  // natural size mid-projection while Motion sets up their shared-element
  // transition — a real render never measures at 0, so that reading is
  // simply discarded rather than shrinking the pill down to a sliver.
  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const measure = () => {
      if (node.scrollWidth === 0) return;
      onMeasuredWidth(node.scrollWidth + COLLAPSED_PADDING_X * 2);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [onMeasuredWidth]);

  return (
    <motion.button
      animate={{ opacity: 1, transition: { delay: 0.08 } }}
      aria-expanded={false}
      className="absolute top-0 left-0 flex items-center justify-center"
      data-slot="feedback-form-trigger"
      exit={{ opacity: 0, transition: fadeTransition }}
      initial={reduceMotion ? false : { opacity: 0 }}
      key="collapsed"
      onClick={onOpen}
      style={{ width, height }}
      transition={reduceMotion ? INSTANT : undefined}
      type="button"
    >
      <span className="flex items-center gap-1.5" ref={contentRef}>
        <motion.span
          aria-hidden="true"
          className="size-2.5 shrink-0 rounded-full bg-[var(--color-brand,#3b82f6)]"
          layoutId={dotLayoutId}
          transition={labelTransition}
        />
        <span className="whitespace-nowrap font-semibold text-foreground text-xs leading-none">
          {label}
        </span>
        <span aria-hidden="true" className="h-3 w-px shrink-0 bg-border" />
        <motion.span
          className="shrink-0 font-medium text-muted-foreground text-xs leading-none"
          layoutId={labelLayoutId}
          transition={labelTransition}
        >
          Feedback
        </motion.span>
      </span>
    </motion.button>
  );
}

type ExpandedPanelProps = SharedElementProps & {
  fadeTransition: Transition;
  hasValue: boolean;
  height: number;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string | undefined;
  reduceMotion: boolean;
  submitting: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  width: number;
};

function ExpandedPanel({
  dotLayoutId,
  fadeTransition,
  hasValue,
  height,
  labelLayoutId,
  labelTransition,
  onChange,
  onSubmit,
  placeholder,
  reduceMotion,
  submitting,
  textareaRef,
  value,
  width,
}: ExpandedPanelProps) {
  return (
    <motion.div
      animate={{ opacity: 1, transition: { delay: 0.08 } }}
      aria-label="Feedback"
      className="absolute top-0 left-0 flex flex-col gap-3 p-4"
      data-slot="feedback-form-panel"
      exit={{ opacity: 0, transition: fadeTransition }}
      initial={reduceMotion ? false : { opacity: 0 }}
      key="expanded"
      role="dialog"
      style={{ width, height }}
      transition={reduceMotion ? INSTANT : undefined}
    >
      <div className="flex items-center gap-2">
        <motion.span
          aria-hidden="true"
          className="size-2.5 shrink-0 rounded-full bg-[var(--color-brand,#3b82f6)]"
          layoutId={dotLayoutId}
          transition={labelTransition}
        />
        <motion.span
          className="font-medium text-foreground leading-none"
          layoutId={labelLayoutId}
          transition={labelTransition}
        >
          Feedback
        </motion.span>
      </div>

      <motion.textarea
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        aria-label="Feedback message"
        className="w-full flex-1 resize-none bg-transparent text-foreground leading-relaxed outline-none placeholder:text-muted-foreground disabled:opacity-60"
        disabled={submitting}
        initial={reduceMotion ? false : { opacity: 0 }}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
            event.preventDefault();
            onSubmit();
          }
        }}
        placeholder={placeholder}
        ref={textareaRef}
        transition={reduceMotion ? INSTANT : undefined}
        value={value}
      />

      <motion.div
        animate={{ opacity: 1, transition: { delay: 0.16 } }}
        className="flex items-center justify-between gap-3"
        initial={reduceMotion ? false : { opacity: 0 }}
        transition={reduceMotion ? INSTANT : undefined}
      >
        <span className="flex items-center gap-1 text-muted-foreground text-xs">
          <kbd className="rounded-md bg-muted px-1.5 py-1 font-sans">⌘</kbd>
          <kbd className="rounded-md bg-muted px-1.5 py-1 font-sans">Enter</kbd>
          <span>to send</span>
        </span>
        <button
          aria-label={submitting ? "Sending feedback" : "Send feedback"}
          className="flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 font-medium text-background text-xs transition-opacity disabled:opacity-50"
          disabled={submitting || !hasValue}
          onClick={onSubmit}
          type="button"
        >
          {submitting ? (
            <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
          ) : (
            <SendIcon />
          )}
          {submitting ? "Sending" : "Send"}
        </button>
      </motion.div>
    </motion.div>
  );
}

export type FeedbackFormProps = {
  /** Label shown next to the indicator dot in the collapsed pill. */
  label?: string;
  /** Placeholder for the expanded textarea. Unset by default. */
  placeholder?: string;
  /**
   * Called with the trimmed value on submit (Send button or Cmd/Ctrl+Enter).
   * May return a promise — the Send button shows a loading state until it
   * resolves, then the panel collapses back to the pill. Throwing keeps the
   * panel open so the user can retry.
   */
  onSubmit?: (value: string) => void | Promise<void>;
  className?: string;
};

export function FeedbackForm({
  label = "Iconiq UI",
  placeholder,
  onSubmit,
  className,
}: FeedbackFormProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [collapsedWidth, setCollapsedWidth] = useState(DEFAULT_COLLAPSED_WIDTH);

  const uid = useId();
  const dotLayoutId = `${uid}-dot`;
  const labelLayoutId = `${uid}-label`;

  const reduceMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // The very first measurement corrects the pill from its pre-measurement
  // guess to its real content-fit width — that correction must apply
  // instantly, or it plays as a visible open/close-style shrink on load.
  // This is a ref (not state) read directly during render: it must still
  // read `false` on the render that *applies* the corrected width, and only
  // flip afterward, once that instant correction has already committed —
  // updating it via the same setState call the width change came from would
  // make both land in one render, so the correction itself would already
  // see it as "measured" and animate instead of snapping.
  const hasMeasuredWidthRef = useRef(false);
  const lastWidthRef = useRef(collapsedWidth);
  useEffect(() => {
    if (lastWidthRef.current !== collapsedWidth) {
      lastWidthRef.current = collapsedWidth;
      hasMeasuredWidthRef.current = true;
    }
  }, [collapsedWidth]);

  const hasValue = value.trim() !== "";

  const close = useCallback(() => {
    if (submitting) return;
    setOpen(false);
    setValue("");
  }, [submitting]);

  const submit = useCallback(async () => {
    if (submitting || !hasValue) return;

    setSubmitting(true);
    try {
      await onSubmit?.(value.trim());
      setOpen(false);
      setValue("");
    } catch {
      // Swallow — the caller is expected to surface its own error UI
      // (e.g. a toast). The panel stays open so the user can retry.
    } finally {
      setSubmitting(false);
    }
  }, [hasValue, onSubmit, submitting, value]);

  // Dismiss on outside click or Escape while open.
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) close();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close]);

  // Autofocus the textarea once the panel opens.
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => textareaRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const boxTransition =
    reduceMotion || !hasMeasuredWidthRef.current
      ? INSTANT
      : open
        ? OPEN_TRANSITION
        : CLOSE_TRANSITION;
  const labelTransition = reduceMotion ? INSTANT : LABEL_TRANSITION;
  const fadeTransition = reduceMotion ? INSTANT : CONTENT_FADE;

  return (
    <motion.div
      animate={{
        width: open ? EXPANDED_WIDTH : collapsedWidth,
        height: open ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
        borderRadius: open ? EXPANDED_RADIUS : COLLAPSED_RADIUS,
      }}
      className={cn(
        "relative overflow-hidden border border-border bg-white text-sm shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)] dark:bg-zinc-950",
        className
      )}
      data-slot="feedback-form"
      initial={false}
      ref={containerRef}
      transition={boxTransition}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {open ? (
          <ExpandedPanel
            dotLayoutId={dotLayoutId}
            fadeTransition={fadeTransition}
            hasValue={hasValue}
            height={EXPANDED_HEIGHT}
            labelLayoutId={labelLayoutId}
            labelTransition={labelTransition}
            onChange={setValue}
            onSubmit={submit}
            placeholder={placeholder}
            reduceMotion={reduceMotion}
            submitting={submitting}
            textareaRef={textareaRef}
            value={value}
            width={EXPANDED_WIDTH}
          />
        ) : (
          <CollapsedTrigger
            dotLayoutId={dotLayoutId}
            fadeTransition={fadeTransition}
            height={COLLAPSED_HEIGHT}
            label={label}
            labelLayoutId={labelLayoutId}
            labelTransition={labelTransition}
            onMeasuredWidth={setCollapsedWidth}
            onOpen={() => setOpen(true)}
            reduceMotion={reduceMotion}
            width={collapsedWidth}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
