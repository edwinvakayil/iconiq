"use client";

/**
 * Right inspector: edits the selected node. Component props come from the
 * registry's declarative control schema; containers get layout/style panels;
 * every node gets the shared sizing panel. Multi-selection exposes group ops.
 */

import {
  AlignCenterHorizontalIcon,
  AlignEndHorizontalIcon,
  AlignStartHorizontalIcon,
  BoxSelectIcon,
  CopyPlusIcon,
  GroupIcon,
  Trash2Icon,
} from "lucide-react";

import { getComponentDef, type PropControl } from "@/lib/studio/registry";
import { useStudioStore } from "@/lib/studio/store";
import { MAX_WIDTH_OPTIONS, SPACING_OPTIONS } from "@/lib/studio/tailwind";
import { findNode } from "@/lib/studio/tree";
import type {
  ContainerNode,
  NodeSize,
  StudioNode,
  TextNode,
  TextTag,
} from "@/lib/studio/types";

import {
  Field,
  SegmentedControl,
  SelectControl,
  SteppedNumberControl,
  TextareaControl,
  TextControl,
  ToggleControl,
} from "./inspector-controls";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-border border-b px-3 py-3">
      <p className="mb-2.5 font-medium text-[11px] text-muted-foreground uppercase tracking-wide">
        {title}
      </p>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component props from the registry schema                            */
/* ------------------------------------------------------------------ */

function ControlRenderer({
  control,
  value,
  onChange,
}: {
  control: PropControl;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  switch (control.kind) {
    case "text":
      return (
        <Field label={control.label}>
          <TextControl
            onChange={onChange}
            value={typeof value === "string" ? value : ""}
          />
        </Field>
      );
    case "textarea":
      return (
        <Field label={control.label}>
          <TextareaControl
            onChange={onChange}
            value={typeof value === "string" ? value : ""}
          />
        </Field>
      );
    case "boolean":
      return (
        <Field inline label={control.label}>
          <ToggleControl onChange={onChange} value={value === true} />
        </Field>
      );
    case "select":
      return (
        <Field label={control.label}>
          <SelectControl
            onChange={onChange}
            options={control.options}
            value={typeof value === "string" ? value : control.options[0].value}
          />
        </Field>
      );
    case "stringList": {
      const items = Array.isArray(value) ? value.map(String) : [];
      return (
        <Field label={control.label}>
          <div className="flex flex-col gap-1.5">
            {items.map((item, index) => (
              <div className="flex items-center gap-1" key={index}>
                <TextControl
                  onChange={(next) => {
                    const updated = [...items];
                    updated[index] = next;
                    onChange(updated);
                  }}
                  value={item}
                />
                <button
                  aria-label={`Remove ${control.itemLabel}`}
                  className="shrink-0 cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-red-500"
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                  type="button"
                >
                  <Trash2Icon className="size-3" />
                </button>
              </div>
            ))}
            <button
              className="cursor-pointer rounded-md border border-border border-dashed py-1 text-[11px] text-muted-foreground transition-colors hover:border-solid hover:text-foreground"
              onClick={() =>
                onChange([...items, `${control.itemLabel} ${items.length + 1}`])
              }
              type="button"
            >
              Add {control.itemLabel.toLowerCase()}
            </button>
          </div>
        </Field>
      );
    }
    case "itemList": {
      const items = Array.isArray(value)
        ? (value as Array<{ title?: string; content?: string }>)
        : [];
      return (
        <Field label={control.label}>
          <div className="flex flex-col gap-2">
            {items.map((item, index) => (
              <div
                className="flex flex-col gap-1 rounded-md border border-border p-1.5"
                key={index}
              >
                <div className="flex items-center gap-1">
                  <TextControl
                    onChange={(next) => {
                      const updated = [...items];
                      updated[index] = { ...item, title: next };
                      onChange(updated);
                    }}
                    placeholder="Title"
                    value={item.title ?? ""}
                  />
                  <button
                    aria-label="Remove item"
                    className="shrink-0 cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:text-red-500"
                    onClick={() =>
                      onChange(items.filter((_, i) => i !== index))
                    }
                    type="button"
                  >
                    <Trash2Icon className="size-3" />
                  </button>
                </div>
                <TextareaControl
                  onChange={(next) => {
                    const updated = [...items];
                    updated[index] = { ...item, content: next };
                    onChange(updated);
                  }}
                  value={item.content ?? ""}
                />
              </div>
            ))}
            <button
              className="cursor-pointer rounded-md border border-border border-dashed py-1 text-[11px] text-muted-foreground transition-colors hover:border-solid hover:text-foreground"
              onClick={() =>
                onChange([
                  ...items,
                  { title: `Item ${items.length + 1}`, content: "Content" },
                ])
              }
              type="button"
            >
              Add item
            </button>
          </div>
        </Field>
      );
    }
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Shared node panels                                                  */
/* ------------------------------------------------------------------ */

const SIZE_OPTIONS = [
  { label: "Auto", value: "auto" },
  { label: "Fill", value: "full" },
  { label: "Fixed", value: "fixed" },
];

const FIXED_WIDTH_STEPS = [
  16, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192, 224, 256, 288, 320, 384,
];

function SizeField({
  label,
  size,
  onChange,
}: {
  label: string;
  size: NodeSize | undefined;
  onChange: (size: NodeSize | undefined) => void;
}) {
  const mode = size?.mode ?? "auto";
  return (
    <div className="flex flex-col gap-1.5">
      <Field label={label}>
        <SegmentedControl
          onChange={(next) =>
            onChange(
              next === "auto"
                ? undefined
                : {
                    mode: next as NodeSize["mode"],
                    ...(next === "fixed" ? { value: 128 } : {}),
                  }
            )
          }
          options={SIZE_OPTIONS}
          value={mode}
        />
      </Field>
      {mode === "fixed" ? (
        <SteppedNumberControl
          format={(step) => `${step}px`}
          onChange={(value) => onChange({ mode: "fixed", value })}
          steps={FIXED_WIDTH_STEPS}
          value={size?.value ?? 128}
        />
      ) : null}
    </div>
  );
}

function LayoutPanel({ node }: { node: StudioNode }) {
  const updateBase = useStudioStore((state) => state.updateBase);
  return (
    <Section title="Sizing & spacing">
      <SizeField
        label="Width"
        onChange={(width) => updateBase(node.id, { width })}
        size={node.width}
      />
      <SizeField
        label="Height"
        onChange={(height) => updateBase(node.id, { height })}
        size={node.height}
      />
      <Field label="Margin">
        <SteppedNumberControl
          format={(step) => `${step}px`}
          onChange={(margin) => updateBase(node.id, { margin })}
          steps={SPACING_OPTIONS}
          value={node.margin ?? 0}
        />
      </Field>
      <Field label="Custom Tailwind classes">
        <TextControl
          onChange={(customClasses) => updateBase(node.id, { customClasses })}
          placeholder="e.g. opacity-80"
          value={node.customClasses ?? ""}
        />
      </Field>
      <Field inline label="Hidden">
        <ToggleControl
          onChange={(hidden) => updateBase(node.id, { hidden })}
          value={node.hidden === true}
        />
      </Field>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Container panels                                                    */
/* ------------------------------------------------------------------ */

function ContainerPanel({ node }: { node: ContainerNode }) {
  const updateContainer = useStudioStore((state) => state.updateContainer);
  const { layout, style } = node;

  return (
    <>
      <Section title="Layout">
        <Field label="Type">
          <SegmentedControl
            onChange={(mode) =>
              updateContainer(node.id, {
                layout: { mode: mode as "flex" | "grid" },
              })
            }
            options={[
              { label: "Stack", value: "flex" },
              { label: "Grid", value: "grid" },
            ]}
            value={layout.mode}
          />
        </Field>
        {layout.mode === "flex" ? (
          <>
            <Field label="Direction">
              <SegmentedControl
                onChange={(direction) =>
                  updateContainer(node.id, {
                    layout: { direction: direction as "row" | "column" },
                  })
                }
                options={[
                  { label: "Vertical", value: "column" },
                  { label: "Horizontal", value: "row" },
                ]}
                value={layout.direction}
              />
            </Field>
            <Field label="Align">
              <SegmentedControl
                onChange={(align) =>
                  updateContainer(node.id, {
                    layout: {
                      align: align as ContainerNode["layout"]["align"],
                    },
                  })
                }
                options={[
                  {
                    label: <AlignStartHorizontalIcon className="size-3" />,
                    value: "start",
                    title: "Align start",
                  },
                  {
                    label: <AlignCenterHorizontalIcon className="size-3" />,
                    value: "center",
                    title: "Align center",
                  },
                  {
                    label: <AlignEndHorizontalIcon className="size-3" />,
                    value: "end",
                    title: "Align end",
                  },
                  {
                    label: <BoxSelectIcon className="size-3" />,
                    value: "stretch",
                    title: "Stretch",
                  },
                ]}
                value={layout.align}
              />
            </Field>
            <Field label="Justify">
              <SelectControl
                onChange={(justify) =>
                  updateContainer(node.id, {
                    layout: {
                      justify: justify as ContainerNode["layout"]["justify"],
                    },
                  })
                }
                options={[
                  { label: "Start", value: "start" },
                  { label: "Center", value: "center" },
                  { label: "End", value: "end" },
                  { label: "Space between", value: "between" },
                  { label: "Space around", value: "around" },
                  { label: "Space evenly", value: "evenly" },
                ]}
                value={layout.justify}
              />
            </Field>
            <Field inline label="Wrap">
              <ToggleControl
                onChange={(wrap) =>
                  updateContainer(node.id, { layout: { wrap } })
                }
                value={layout.wrap}
              />
            </Field>
          </>
        ) : (
          <Field label="Columns">
            <SteppedNumberControl
              onChange={(columns) =>
                updateContainer(node.id, { layout: { columns } })
              }
              steps={[1, 2, 3, 4, 5, 6]}
              value={layout.columns}
            />
          </Field>
        )}
        <Field label="Gap">
          <SteppedNumberControl
            format={(step) => `${step}px`}
            onChange={(gap) => updateContainer(node.id, { layout: { gap } })}
            steps={SPACING_OPTIONS}
            value={layout.gap}
          />
        </Field>
        <Field label="Padding">
          <SteppedNumberControl
            format={(step) => `${step}px`}
            onChange={(padding) =>
              updateContainer(node.id, { layout: { padding } })
            }
            steps={SPACING_OPTIONS}
            value={layout.padding}
          />
        </Field>
      </Section>
      <Section title="Appearance">
        <Field label="Background">
          <SelectControl
            onChange={(background) =>
              updateContainer(node.id, {
                style: {
                  background:
                    background as ContainerNode["style"]["background"],
                },
              })
            }
            options={[
              { label: "None", value: "none" },
              { label: "Background", value: "background" },
              { label: "Card", value: "card" },
              { label: "Muted", value: "muted" },
              { label: "Accent", value: "accent" },
            ]}
            value={style.background}
          />
        </Field>
        <Field label="Radius">
          <SegmentedControl
            onChange={(radius) =>
              updateContainer(node.id, {
                style: { radius: radius as ContainerNode["style"]["radius"] },
              })
            }
            options={[
              { label: "0", value: "none" },
              { label: "S", value: "sm" },
              { label: "M", value: "md" },
              { label: "L", value: "lg" },
              { label: "XL", value: "xl" },
            ]}
            value={style.radius}
          />
        </Field>
        <Field label="Shadow">
          <SegmentedControl
            onChange={(shadow) =>
              updateContainer(node.id, {
                style: { shadow: shadow as ContainerNode["style"]["shadow"] },
              })
            }
            options={[
              { label: "None", value: "none" },
              { label: "S", value: "sm" },
              { label: "M", value: "md" },
              { label: "L", value: "lg" },
            ]}
            value={style.shadow}
          />
        </Field>
        <Field inline label="Border">
          <ToggleControl
            onChange={(border) =>
              updateContainer(node.id, { style: { border } })
            }
            value={style.border}
          />
        </Field>
        <Field label="Max width">
          <SelectControl
            onChange={(maxWidth) =>
              updateContainer(node.id, {
                style: { maxWidth: Number(maxWidth) },
              })
            }
            options={MAX_WIDTH_OPTIONS.map((option) => ({
              label: option === 0 ? "None" : `${option}px`,
              value: String(option),
            }))}
            value={String(style.maxWidth)}
          />
        </Field>
      </Section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Text panel                                                          */
/* ------------------------------------------------------------------ */

const TEXT_TAG_OPTIONS: Array<{ label: string; value: TextTag }> = [
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
  { label: "Heading 4", value: "h4" },
  { label: "Paragraph", value: "p" },
  { label: "Span", value: "span" },
];

function TextPanel({ node }: { node: TextNode }) {
  const updateText = useStudioStore((state) => state.updateText);
  return (
    <Section title="Text">
      <Field label="Content">
        <TextareaControl
          onChange={(text) => updateText(node.id, { text })}
          value={node.text}
        />
      </Field>
      <Field label="Style">
        <SelectControl
          onChange={(tag) => updateText(node.id, { tag: tag as TextTag })}
          options={TEXT_TAG_OPTIONS}
          value={node.tag}
        />
      </Field>
      <Field inline label="Muted color">
        <ToggleControl
          onChange={(muted) => updateText(node.id, { muted })}
          value={node.muted}
        />
      </Field>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Actions + shell                                                     */
/* ------------------------------------------------------------------ */

function ActionsRow({ ids }: { ids: string[] }) {
  const remove = useStudioStore((state) => state.remove);
  const duplicate = useStudioStore((state) => state.duplicate);
  const wrapSelection = useStudioStore((state) => state.wrapSelection);

  const actionClass =
    "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-border py-1.5 text-[11px] text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground";

  return (
    <div className="flex gap-1.5 border-border border-b px-3 py-2.5">
      <button
        className={actionClass}
        onClick={() => duplicate(ids)}
        type="button"
      >
        <CopyPlusIcon className="size-3" /> Duplicate
      </button>
      <button
        className={actionClass}
        onClick={() => wrapSelection()}
        type="button"
      >
        <GroupIcon className="size-3" /> Wrap
      </button>
      <button
        className={cnDanger(actionClass)}
        onClick={() => remove(ids)}
        type="button"
      >
        <Trash2Icon className="size-3" /> Delete
      </button>
    </div>
  );
}

function cnDanger(base: string): string {
  return `${base.replace("hover:text-foreground", "hover:text-red-500")} hover:border-red-200`;
}

export function StudioInspector() {
  const selection = useStudioStore((state) => state.selection);
  const root = useStudioStore((state) => state.project.root);
  const updateComponentProps = useStudioStore(
    (state) => state.updateComponentProps
  );

  const selectedNodes = selection
    .map((id) => findNode(root, id))
    .filter((node): node is StudioNode => node !== null);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-border border-l bg-background">
      <div className="border-border border-b px-3 py-2.5">
        <p className="font-medium text-[13px] text-foreground">
          {selectedNodes.length === 0 && "Page"}
          {selectedNodes.length === 1 && inspectorTitle(selectedNodes[0])}
          {selectedNodes.length > 1 && `${selectedNodes.length} selected`}
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {selectedNodes.length === 0 ? <ContainerPanel node={root} /> : null}
        {selectedNodes.length === 1
          ? (() => {
              const node = selectedNodes[0];
              return (
                <>
                  <ActionsRow ids={[node.id]} />
                  {node.kind === "container" ? (
                    <ContainerPanel node={node} />
                  ) : null}
                  {node.kind === "text" ? <TextPanel node={node} /> : null}
                  {node.kind === "component"
                    ? (() => {
                        const def = getComponentDef(node.component);
                        if (!def) {
                          return null;
                        }
                        return (
                          <Section title={def.label}>
                            {def.controls.map((control) => (
                              <ControlRenderer
                                control={control}
                                key={control.key}
                                onChange={(value) =>
                                  updateComponentProps(node.id, {
                                    [control.key]: value,
                                  })
                                }
                                value={node.props[control.key]}
                              />
                            ))}
                          </Section>
                        );
                      })()
                    : null}
                  <LayoutPanel node={node} />
                </>
              );
            })()
          : null}
        {selectedNodes.length > 1 ? (
          <>
            <ActionsRow ids={selection} />
            <p className="px-3 py-3 text-[12px] text-muted-foreground leading-relaxed">
              Wrap groups the selection into a stack. Hold Shift and click to
              add or remove items.
            </p>
          </>
        ) : null}
      </div>
    </aside>
  );
}

function inspectorTitle(node: StudioNode): string {
  if (node.kind === "container") {
    return node.layout.mode === "grid" ? "Grid" : "Stack";
  }
  if (node.kind === "text") {
    return "Text";
  }
  return getComponentDef(node.component)?.label ?? node.component;
}
