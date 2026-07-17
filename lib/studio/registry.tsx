"use client";

/**
 * Studio component registry.
 *
 * Each entry pairs a live Iconiq component (rendered on canvas) with a prop
 * schema (drives the inspector) and a code emitter (drives export). Adding a
 * component to the studio means adding one entry here.
 */

import {
  BellIcon,
  ChevronsUpDownIcon,
  CircleUserIcon,
  CreditCardIcon,
  Link2Icon,
  LoaderCircleIcon,
  type LucideIcon,
  MinusIcon,
  MousePointerClickIcon,
  PanelTopIcon,
  SquareCheckIcon,
  TagIcon,
  TextCursorInputIcon,
  ToggleLeftIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { Accordion } from "@/registry/accordion";
import { Alert } from "@/registry/alert";
import { Avatar } from "@/registry/avatar";
import { Badge } from "@/registry/badge";
import { Breadcrumbs } from "@/registry/breadcrumbs";
import { Button } from "@/registry/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/card";
import { Checkbox } from "@/registry/checkbox";
import { Input } from "@/registry/input";
import { Spinner } from "@/registry/spinner";
import { Switch } from "@/registry/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/tabs";

import {
  type CodegenRegistry,
  classNameProp,
  expr,
  type ImportSpec,
  type JsxElement,
  serializeValue,
} from "./codegen";
import type { ComponentNode } from "./types";

/* ------------------------------------------------------------------ */
/* Schema types                                                        */
/* ------------------------------------------------------------------ */

export type PropControl =
  | { kind: "text"; key: string; label: string }
  | { kind: "textarea"; key: string; label: string }
  | { kind: "boolean"; key: string; label: string }
  | {
      kind: "select";
      key: string;
      label: string;
      options: Array<{ label: string; value: string }>;
    }
  | { kind: "stringList"; key: string; label: string; itemLabel: string }
  | { kind: "itemList"; key: string; label: string };

export type StudioCategory =
  | "Inputs"
  | "Navigation"
  | "Disclosure"
  | "Feedback"
  | "Layout";

export const STUDIO_CATEGORIES: StudioCategory[] = [
  "Inputs",
  "Navigation",
  "Disclosure",
  "Feedback",
  "Layout",
];

export type StudioComponentDef = {
  type: string;
  label: string;
  category: StudioCategory;
  description: string;
  icon: LucideIcon;
  keywords?: string[];
  /** Components like Card accept dropped children. */
  acceptsChildren?: boolean;
  /** Name passed to `npx iconiq add`. Null for pure-HTML built-ins. */
  cli: string | null;
  imports: ImportSpec[];
  defaultProps: () => Record<string, unknown>;
  controls: PropControl[];
  render: (props: Record<string, unknown>, children?: ReactNode) => ReactNode;
  emit: (
    node: ComponentNode,
    children: Array<JsxElement | string>
  ) => JsxElement;
};

const str = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const bool = (value: unknown): boolean => value === true;

const strList = (value: unknown): string[] =>
  Array.isArray(value) ? value.map((item) => String(item)) : [];

type TitledItem = { title: string; content: string };

const itemList = (value: unknown): TitledItem[] =>
  Array.isArray(value)
    ? value.map((item) => ({
        title: str((item as TitledItem)?.title),
        content: str((item as TitledItem)?.content),
      }))
    : [];

/** Include a prop only when it differs from its default. */
function omitDefault<T>(value: T, defaultValue: T): T | undefined {
  return value === defaultValue ? undefined : value;
}

/* ------------------------------------------------------------------ */
/* Definitions                                                         */
/* ------------------------------------------------------------------ */

const buttonDef: StudioComponentDef = {
  type: "button",
  label: "Button",
  category: "Inputs",
  description: "Ripple button with variants and spring press feedback.",
  icon: MousePointerClickIcon,
  cli: "button",
  imports: [{ names: ["Button"], path: "@/components/ui/button" }],
  defaultProps: () => ({
    text: "Button",
    variant: "default",
    size: "md",
    disabled: false,
  }),
  controls: [
    { kind: "text", key: "text", label: "Label" },
    {
      kind: "select",
      key: "variant",
      label: "Variant",
      options: [
        { label: "Default", value: "default" },
        { label: "Secondary", value: "secondary" },
        { label: "Outline", value: "outline" },
        { label: "Ghost", value: "ghost" },
        { label: "Destructive", value: "destructive" },
        { label: "Link", value: "link" },
      ],
    },
    {
      kind: "select",
      key: "size",
      label: "Size",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    { kind: "boolean", key: "disabled", label: "Disabled" },
  ],
  render: (props) => (
    <Button
      disabled={bool(props.disabled)}
      size={str(props.size, "md") as "sm" | "md" | "lg"}
      variant={
        str(props.variant, "default") as
          | "default"
          | "secondary"
          | "outline"
          | "ghost"
          | "destructive"
          | "link"
      }
    >
      {str(props.text, "Button")}
    </Button>
  ),
  emit: (node) => ({
    tag: "Button",
    props: {
      variant: omitDefault(str(node.props.variant, "default"), "default"),
      size: omitDefault(str(node.props.size, "md"), "md"),
      disabled: bool(node.props.disabled) || undefined,
    },
    children: [str(node.props.text, "Button")],
  }),
};

const inputDef: StudioComponentDef = {
  type: "input",
  label: "Input",
  category: "Inputs",
  description: "Text field with floating shell, label and description.",
  icon: TextCursorInputIcon,
  cli: "input",
  imports: [{ names: ["Input"], path: "@/components/ui/input" }],
  defaultProps: () => ({
    label: "Email",
    placeholder: "you@example.com",
    description: "",
    type: "text",
    disabled: false,
    required: false,
  }),
  controls: [
    { kind: "text", key: "label", label: "Label" },
    { kind: "text", key: "placeholder", label: "Placeholder" },
    { kind: "text", key: "description", label: "Description" },
    {
      kind: "select",
      key: "type",
      label: "Type",
      options: [
        { label: "Text", value: "text" },
        { label: "Email", value: "email" },
        { label: "Password", value: "password" },
        { label: "Number", value: "number" },
        { label: "Search", value: "search" },
      ],
    },
    { kind: "boolean", key: "required", label: "Required" },
    { kind: "boolean", key: "disabled", label: "Disabled" },
  ],
  render: (props) => (
    <Input
      description={str(props.description) || undefined}
      disabled={bool(props.disabled)}
      label={str(props.label) || undefined}
      placeholder={str(props.placeholder) || undefined}
      required={bool(props.required)}
      type={str(props.type, "text")}
    />
  ),
  emit: (node) => ({
    tag: "Input",
    props: {
      label: str(node.props.label) || undefined,
      placeholder: str(node.props.placeholder) || undefined,
      description: str(node.props.description) || undefined,
      type: omitDefault(str(node.props.type, "text"), "text"),
      required: bool(node.props.required) || undefined,
      disabled: bool(node.props.disabled) || undefined,
    },
  }),
};

const checkboxDef: StudioComponentDef = {
  type: "checkbox",
  label: "Checkbox",
  category: "Inputs",
  description: "Animated checkbox with a drawn check mark.",
  icon: SquareCheckIcon,
  cli: "checkbox",
  imports: [{ names: ["Checkbox"], path: "@/components/ui/checkbox" }],
  defaultProps: () => ({ label: "Accept terms", defaultChecked: false }),
  controls: [
    { kind: "text", key: "label", label: "Label" },
    { kind: "boolean", key: "defaultChecked", label: "Checked" },
  ],
  render: (props) => (
    <Checkbox
      defaultChecked={bool(props.defaultChecked)}
      key={`checked-${bool(props.defaultChecked)}`}
      label={str(props.label) || undefined}
    />
  ),
  emit: (node) => ({
    tag: "Checkbox",
    props: {
      label: str(node.props.label) || undefined,
      defaultChecked: bool(node.props.defaultChecked) || undefined,
    },
  }),
};

const switchDef: StudioComponentDef = {
  type: "switch",
  label: "Switch",
  category: "Inputs",
  description: "Spring toggle with squash-and-stretch thumb.",
  icon: ToggleLeftIcon,
  cli: "switch",
  imports: [{ names: ["Switch"], path: "@/components/ui/switch" }],
  defaultProps: () => ({
    label: "Notifications",
    labelSide: "right",
    defaultChecked: true,
    disabled: false,
  }),
  controls: [
    { kind: "text", key: "label", label: "Label" },
    {
      kind: "select",
      key: "labelSide",
      label: "Label side",
      options: [
        { label: "Right", value: "right" },
        { label: "Left", value: "left" },
      ],
    },
    { kind: "boolean", key: "defaultChecked", label: "Checked" },
    { kind: "boolean", key: "disabled", label: "Disabled" },
  ],
  render: (props) => (
    <Switch
      defaultChecked={bool(props.defaultChecked)}
      disabled={bool(props.disabled)}
      key={`checked-${bool(props.defaultChecked)}`}
      label={str(props.label) || undefined}
      labelSide={str(props.labelSide, "right") as "left" | "right"}
    />
  ),
  emit: (node) => ({
    tag: "Switch",
    props: {
      label: str(node.props.label) || undefined,
      labelSide: omitDefault(str(node.props.labelSide, "right"), "right"),
      defaultChecked: bool(node.props.defaultChecked) || undefined,
      disabled: bool(node.props.disabled) || undefined,
    },
  }),
};

const tabsDef: StudioComponentDef = {
  type: "tabs",
  label: "Tabs",
  category: "Navigation",
  description: "Pill or underline tabs with animated indicator.",
  icon: PanelTopIcon,
  cli: "tabs",
  imports: [
    {
      names: ["Tabs", "TabsContent", "TabsList", "TabsTrigger"],
      path: "@/components/ui/tabs",
    },
  ],
  defaultProps: () => ({
    variant: "pill",
    tabs: ["Overview", "Activity", "Settings"],
  }),
  controls: [
    {
      kind: "select",
      key: "variant",
      label: "Variant",
      options: [
        { label: "Pill", value: "pill" },
        { label: "Underline", value: "underline" },
      ],
    },
    { kind: "stringList", key: "tabs", label: "Tabs", itemLabel: "Tab" },
  ],
  render: (props) => {
    const tabs = strList(props.tabs);
    if (tabs.length === 0) {
      return null;
    }
    return (
      <Tabs
        defaultValue={tabs[0]}
        key={tabs.join("|")}
        variant={str(props.variant, "pill") as "pill" | "underline"}
      >
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab} value={tab}>
            <p className="py-3 text-muted-foreground text-sm">
              {tab} content goes here.
            </p>
          </TabsContent>
        ))}
      </Tabs>
    );
  },
  emit: (node) => {
    const tabs = strList(node.props.tabs);
    return {
      tag: "Tabs",
      props: {
        defaultValue: tabs[0],
        variant: omitDefault(str(node.props.variant, "pill"), "pill"),
      },
      children: [
        {
          tag: "TabsList",
          children: tabs.map((tab) => ({
            tag: "TabsTrigger",
            props: { value: tab },
            children: [tab],
          })),
        },
        ...tabs.map((tab) => ({
          tag: "TabsContent",
          props: { value: tab },
          children: [
            {
              tag: "p",
              props: { className: "py-3 text-muted-foreground text-sm" },
              children: [`${tab} content goes here.`],
            },
          ],
        })),
      ],
    };
  },
};

const breadcrumbsDef: StudioComponentDef = {
  type: "breadcrumbs",
  label: "Breadcrumb",
  category: "Navigation",
  description: "Path trail with truncation and overflow menu.",
  icon: Link2Icon,
  cli: "breadcrumbs",
  imports: [{ names: ["Breadcrumbs"], path: "@/components/ui/breadcrumbs" }],
  defaultProps: () => ({ items: ["Home", "Library", "Data"] }),
  controls: [
    { kind: "stringList", key: "items", label: "Items", itemLabel: "Crumb" },
  ],
  render: (props) => {
    const items = strList(props.items);
    if (items.length === 0) {
      return null;
    }
    return (
      <Breadcrumbs
        items={items.map((label, index) => ({
          label,
          href: index < items.length - 1 ? "#" : undefined,
        }))}
      />
    );
  },
  emit: (node) => {
    const items = strList(node.props.items);
    const value = items.map((label, index) =>
      index < items.length - 1 ? { label, href: "#" } : { label }
    );
    return {
      tag: "Breadcrumbs",
      props: { items: expr(serializeValue(value, 1)) },
    };
  },
};

const accordionDef: StudioComponentDef = {
  type: "accordion",
  label: "Accordion",
  category: "Disclosure",
  description: "Spring-height disclosure list.",
  icon: ChevronsUpDownIcon,
  cli: "accordion",
  imports: [{ names: ["Accordion"], path: "@/components/ui/accordion" }],
  defaultProps: () => ({
    items: [
      {
        title: "Is it accessible?",
        content: "Yes. It adheres to the WAI-ARIA design pattern.",
      },
      {
        title: "Is it styled?",
        content: "Yes. It comes with default styles that match your theme.",
      },
    ],
    multiple: false,
    variant: "default",
  }),
  controls: [
    { kind: "itemList", key: "items", label: "Items" },
    { kind: "boolean", key: "multiple", label: "Allow multiple open" },
    {
      kind: "select",
      key: "variant",
      label: "Variant",
      options: [
        { label: "Default", value: "default" },
        { label: "Quiet", value: "quiet" },
      ],
    },
  ],
  render: (props) => {
    const items = itemList(props.items);
    if (items.length === 0) {
      return null;
    }
    return (
      <Accordion
        items={items.map((item, index) => ({
          id: `item-${index + 1}`,
          title: item.title,
          content: item.content,
        }))}
        multiple={bool(props.multiple)}
        variant={str(props.variant, "default") as "default" | "quiet"}
      />
    );
  },
  emit: (node) => {
    const items = itemList(node.props.items).map((item, index) => ({
      id: `item-${index + 1}`,
      title: item.title,
      content: item.content,
    }));
    return {
      tag: "Accordion",
      props: {
        items: expr(serializeValue(items, 1)),
        multiple: bool(node.props.multiple) || undefined,
        variant: omitDefault(str(node.props.variant, "default"), "default"),
      },
    };
  },
};

const alertDef: StudioComponentDef = {
  type: "alert",
  label: "Alert",
  category: "Feedback",
  description: "Inline alert with semantic appearances.",
  icon: BellIcon,
  cli: "alert",
  imports: [{ names: ["Alert"], path: "@/components/ui/alert" }],
  defaultProps: () => ({
    title: "Heads up!",
    message: "You can compose alerts straight from the studio.",
    appearance: "default",
    dismissible: false,
  }),
  controls: [
    { kind: "text", key: "title", label: "Title" },
    { kind: "textarea", key: "message", label: "Message" },
    {
      kind: "select",
      key: "appearance",
      label: "Appearance",
      options: [
        { label: "Default", value: "default" },
        { label: "Info", value: "info" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
        { label: "Destructive", value: "destructive" },
      ],
    },
    { kind: "boolean", key: "dismissible", label: "Dismissible" },
  ],
  render: (props) => (
    <Alert
      appearance={
        str(props.appearance, "default") as
          | "default"
          | "info"
          | "success"
          | "warning"
          | "destructive"
      }
      dismissible={bool(props.dismissible)}
      message={str(props.message) || undefined}
      timeout={0}
      title={str(props.title) || undefined}
      variant="inline"
    />
  ),
  emit: (node) => ({
    tag: "Alert",
    props: {
      title: str(node.props.title) || undefined,
      message: str(node.props.message) || undefined,
      appearance: omitDefault(str(node.props.appearance, "default"), "default"),
      dismissible: bool(node.props.dismissible) || undefined,
      variant: "inline",
    },
  }),
};

const badgeDef: StudioComponentDef = {
  type: "badge",
  label: "Badge",
  category: "Feedback",
  description: "Status badge with semantic colors and dot variant.",
  icon: TagIcon,
  cli: "badge",
  imports: [{ names: ["Badge"], path: "@/components/ui/badge" }],
  defaultProps: () => ({
    text: "New",
    color: "blue",
    variant: "default",
    size: "md",
  }),
  controls: [
    { kind: "text", key: "text", label: "Label" },
    {
      kind: "select",
      key: "color",
      label: "Color",
      options: [
        { label: "Gray", value: "gray" },
        { label: "Blue", value: "blue" },
        { label: "Green", value: "green" },
        { label: "Amber", value: "amber" },
        { label: "Red", value: "red" },
        { label: "Violet", value: "violet" },
      ],
    },
    {
      kind: "select",
      key: "variant",
      label: "Variant",
      options: [
        { label: "Filled", value: "default" },
        { label: "Dot", value: "dot" },
      ],
    },
    {
      kind: "select",
      key: "size",
      label: "Size",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
  ],
  render: (props) => (
    <Badge
      color={
        str(props.color, "blue") as
          | "gray"
          | "blue"
          | "green"
          | "amber"
          | "red"
          | "violet"
      }
      size={str(props.size, "md") as "sm" | "md" | "lg"}
      variant={str(props.variant, "default") as "default" | "dot"}
    >
      {str(props.text, "Badge")}
    </Badge>
  ),
  emit: (node) => ({
    tag: "Badge",
    props: {
      color: str(node.props.color, "blue"),
      variant: omitDefault(str(node.props.variant, "default"), "default"),
      size: omitDefault(str(node.props.size, "md"), "md"),
    },
    children: [str(node.props.text, "Badge")],
  }),
};

const spinnerDef: StudioComponentDef = {
  type: "spinner",
  label: "Spinner",
  category: "Feedback",
  description: "Loading indicator: ring, dots or matrix.",
  icon: LoaderCircleIcon,
  cli: "spinner",
  imports: [{ names: ["Spinner"], path: "@/components/ui/spinner" }],
  defaultProps: () => ({ size: "md", variant: "ring" }),
  controls: [
    {
      kind: "select",
      key: "variant",
      label: "Variant",
      options: [
        { label: "Ring", value: "ring" },
        { label: "Dots", value: "dots" },
        { label: "Matrix", value: "matrix" },
      ],
    },
    {
      kind: "select",
      key: "size",
      label: "Size",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
  ],
  render: (props) => (
    <Spinner
      size={str(props.size, "md") as "sm" | "md" | "lg"}
      variant={str(props.variant, "ring") as "ring" | "dots" | "matrix"}
    />
  ),
  emit: (node) => ({
    tag: "Spinner",
    props: {
      variant: omitDefault(str(node.props.variant, "ring"), "ring"),
      size: omitDefault(str(node.props.size, "md"), "md"),
    },
  }),
};

const cardDef: StudioComponentDef = {
  type: "card",
  label: "Card",
  category: "Layout",
  description: "Surface with header and droppable content area.",
  icon: CreditCardIcon,
  acceptsChildren: true,
  cli: "card",
  imports: [
    {
      names: [
        "Card",
        "CardContent",
        "CardDescription",
        "CardHeader",
        "CardTitle",
      ],
      path: "@/components/ui/card",
    },
  ],
  defaultProps: () => ({
    title: "Card title",
    description: "A short supporting description.",
    interactive: false,
  }),
  controls: [
    { kind: "text", key: "title", label: "Title" },
    { kind: "text", key: "description", label: "Description" },
    { kind: "boolean", key: "interactive", label: "Hover lift" },
  ],
  render: (props, children) => {
    const title = str(props.title);
    const description = str(props.description);
    return (
      <Card className="w-full" interactive={bool(props.interactive)}>
        {title || description ? (
          <CardHeader>
            {title ? <CardTitle>{title}</CardTitle> : null}
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </CardHeader>
        ) : null}
        <CardContent>{children}</CardContent>
      </Card>
    );
  },
  emit: (node, children) => {
    const title = str(node.props.title);
    const description = str(node.props.description);
    const headerChildren: JsxElement[] = [];
    if (title) {
      headerChildren.push({ tag: "CardTitle", children: [title] });
    }
    if (description) {
      headerChildren.push({
        tag: "CardDescription",
        children: [description],
      });
    }
    const cardChildren: JsxElement[] = [];
    if (headerChildren.length > 0) {
      cardChildren.push({ tag: "CardHeader", children: headerChildren });
    }
    cardChildren.push({ tag: "CardContent", children });
    return {
      tag: "Card",
      props: { interactive: bool(node.props.interactive) || undefined },
      children: cardChildren,
    };
  },
};

const avatarDef: StudioComponentDef = {
  type: "avatar",
  label: "Avatar",
  category: "Layout",
  description: "Initials avatar with optional image and tooltip.",
  icon: CircleUserIcon,
  cli: "avatar",
  imports: [{ names: ["Avatar"], path: "@/components/ui/avatar" }],
  defaultProps: () => ({ name: "Ada Lovelace", size: "default" }),
  controls: [
    { kind: "text", key: "name", label: "Name" },
    {
      kind: "select",
      key: "size",
      label: "Size",
      options: [
        { label: "Small", value: "sm" },
        { label: "Default", value: "default" },
        { label: "Large", value: "lg" },
      ],
    },
  ],
  render: (props) => (
    <Avatar
      name={str(props.name, "Ada Lovelace")}
      size={str(props.size, "default") as "sm" | "default" | "lg"}
    />
  ),
  emit: (node) => ({
    tag: "Avatar",
    props: {
      name: str(node.props.name, "Ada Lovelace"),
      size: omitDefault(str(node.props.size, "default"), "default"),
    },
  }),
};

const dividerDef: StudioComponentDef = {
  type: "divider",
  label: "Divider",
  category: "Layout",
  description: "Hairline separator between sections.",
  icon: MinusIcon,
  cli: null,
  imports: [],
  defaultProps: () => ({ orientation: "horizontal" }),
  controls: [
    {
      kind: "select",
      key: "orientation",
      label: "Orientation",
      options: [
        { label: "Horizontal", value: "horizontal" },
        { label: "Vertical", value: "vertical" },
      ],
    },
  ],
  render: (props) =>
    str(props.orientation, "horizontal") === "vertical" ? (
      <div className="h-full min-h-6 w-px self-stretch bg-border" />
    ) : (
      <div className="h-px w-full bg-border" />
    ),
  emit: (node) => ({
    tag: "div",
    props: {
      className: classNameProp(
        str(node.props.orientation, "horizontal") === "vertical"
          ? ["h-full", "w-px", "self-stretch", "bg-border"]
          : ["h-px", "w-full", "bg-border"]
      ),
    },
  }),
};

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

export const STUDIO_COMPONENTS: StudioComponentDef[] = [
  buttonDef,
  inputDef,
  checkboxDef,
  switchDef,
  tabsDef,
  breadcrumbsDef,
  accordionDef,
  alertDef,
  badgeDef,
  spinnerDef,
  cardDef,
  avatarDef,
  dividerDef,
];

export const STUDIO_COMPONENT_MAP: Record<string, StudioComponentDef> =
  Object.fromEntries(STUDIO_COMPONENTS.map((def) => [def.type, def]));

export function getComponentDef(type: string): StudioComponentDef | null {
  return STUDIO_COMPONENT_MAP[type] ?? null;
}

/** Codegen view over the registry, consumed by `generateCode`. */
export const CODEGEN_REGISTRY: CodegenRegistry = {
  emit: Object.fromEntries(
    STUDIO_COMPONENTS.map((def) => [def.type, def.emit])
  ),
  imports: Object.fromEntries(
    STUDIO_COMPONENTS.map((def) => [def.type, def.imports])
  ),
  cliNames: Object.fromEntries(
    STUDIO_COMPONENTS.map((def) => [def.type, def.cli])
  ),
};
