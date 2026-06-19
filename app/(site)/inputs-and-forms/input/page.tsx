"use client";

import { useMemo, useState } from "react";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { inputApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { Input } from "@/registry/input";

const previewSentenceClassName =
  "text-pretty text-left text-[13px] text-muted-foreground leading-snug tracking-tight sm:text-sm";

const previewContentClassName = "flex w-full max-w-sm flex-col gap-2.5";

const usageCode = `"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";

export function InputPreview() {
  const [value, setValue] = useState("");

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className="flex w-full max-w-sm flex-col gap-2.5">
        <Input
          aria-label="Email"
          label="Work email"
          onChange={(event) => setValue(event.target.value)}
          placeholder="name@company.com"
          value={value}
        />
        <p className="text-pretty text-left text-[13px] text-muted-foreground leading-snug tracking-tight sm:text-sm">
          Type to watch the spring caret follow each keystroke.
        </p>
      </div>
    </div>
  );
}`;

function InputPreview() {
  const [value, setValue] = useState("");

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className={previewContentClassName}>
        <Input
          aria-label="Email"
          label="Work email"
          onChange={(event) => setValue(event.target.value)}
          placeholder="name@company.com"
          value={value}
        />
        <p className={previewSentenceClassName}>
          Type to watch the spring caret follow each keystroke.
        </p>
      </div>
    </div>
  );
}

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Inputs & Forms" },
  { label: "Input" },
];

function getDetails(): DetailItem[] {
  return inputApiDetails.map((item) => {
    if (item.id !== "registry") {
      return item;
    }

    return {
      ...item,
      notes: [
        "Dependencies: @base-ui/react/input, motion.",
        "This page documents the Base UI install only. Input uses the Base UI Input primitive for value handling and Field integration.",
        "The generated registry file is /r/input.json.",
      ],
      registryPath: "input.json",
    };
  });
}

function handleProviderSelect() {
  return undefined;
}

export default function InputPage() {
  const details = useMemo(() => getDetails(), []);

  return (
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="input"
      description="Input with a spring-animated caret."
      details={details}
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/input/page.tsx`}
      headerActions={
        <ProviderSwitch
          disabledProviders={["radix"]}
          onSelect={handleProviderSelect}
          selectedProvider="base"
        />
      }
      itemSlug="input"
      pageUrl="/inputs-and-forms/input"
      preview={<InputPreview />}
      previewClassName="min-h-[18rem] overflow-visible"
      previewDescription="Labeled email field with a short caption below the input."
      title="Input"
      usageCode={usageCode}
      usageDescription={
        'Use controlled or uncontrolled `value` with `onValueChange` or `onChange`. Tune `fontSize` and `spring` to match your form layout, and set `type="password"` when you need masked entry.'
      }
    />
  );
}
