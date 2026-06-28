"use client";

import { useMemo } from "react";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { InputPlaygroundProvider } from "@/app/(site)/inputs-and-forms/input/_components/input-playground";
import { inputApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as InputModule from "@/registry/input";

const importPath = "@/components/ui/input";

const usageCode = `"use client";

import { useState } from "react";

import { Input } from "${importPath}";

export function InputPreview() {
  const [value, setValue] = useState("");

  return (
    <div className="flex w-full items-center justify-center px-4 py-6">
      <div className="flex w-full max-w-sm flex-col gap-2.5">
        <Input
          description="We only use this for account notifications."
          label="Work email"
          onValueChange={setValue}
          placeholder="name@company.com"
          showClear
          value={value}
        />
        <p className="text-pretty text-left text-[13px] text-muted-foreground leading-snug tracking-tight sm:text-sm">
          Type to watch the spring caret follow each keystroke.
        </p>
      </div>
    </div>
  );
}`;

const inputExamples: VariantItem[] = [
  {
    title: "Password",
    code: `"use client";

import { useState } from "react";
import { Input } from "${importPath}";

export function InputPasswordExample() {
  const [value, setValue] = useState("");

  return (
    <Input
      label="Password"
      onValueChange={setValue}
      placeholder="Enter your password"
      type="password"
      value={value}
    />
  );
}`,
  },
  {
    title: "Invalid",
    code: `"use client";

import { useState } from "react";
import { Input } from "${importPath}";

export function InputInvalidExample() {
  const [value, setValue] = useState("not-an-email");

  return (
    <Input
      errorMessage="Enter a valid company email address."
      invalid
      label="Work email"
      onValueChange={setValue}
      placeholder="name@company.com"
      value={value}
    />
  );
}`,
  },
  {
    title: "With adornments",
    code: `"use client";

import { Input } from "${importPath}";

export function InputAdornmentExample() {
  return (
    <Input
      defaultValue="name@company.com"
      endAdornment={<span className="text-xs">.com</span>}
      label="Domain"
      startAdornment={<span className="text-xs">https://</span>}
    />
  );
}`,
  },
  {
    title: "Form field",
    code: `"use client";

import { Input } from "${importPath}";

export function InputFormExample() {
  return (
    <form className="space-y-4">
      <Input
        autoComplete="email"
        label="Work email"
        name="email"
        placeholder="name@company.com"
        required
        type="email"
      />
      <button className="rounded-md bg-foreground px-3 py-2 text-background text-sm" type="submit">
        Continue
      </button>
    </form>
  );
}`,
  },
];

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
    <InputPlaygroundProvider InputModule={InputModule} importPath={importPath}>
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName="input"
          description="Input with a spring-animated caret."
          details={details}
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/input/page.tsx`}
          examples={inputExamples}
          headerActions={
            <ProviderSwitch
              disabledProviders={["radix"]}
              onSelect={handleProviderSelect}
              selectedProvider="base"
            />
          }
          itemSlug="input"
          pageUrl="/inputs-and-forms/input"
          preview={preview}
          previewClassName="min-h-[18rem] overflow-visible lg:col-span-8"
          previewDescription="Tune size, validation, password, clear, and label layout from the playground."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Input"
          railNotes={[
            "Current install target: Base UI.",
            "Smooth caret is enabled for text-like input types and respects prefers-reduced-motion.",
            "Use description, errorMessage, invalid, and required for complete form-field semantics.",
            "showClear and the password visibility toggle render inside the input shell.",
            "Click the shell to focus the field; trailing actions keep their own pointer targets.",
          ]}
          title="Input"
          usageCode={usageCode}
          usageDescription={
            "Use controlled or uncontrolled value with onValueChange or onChange. Add description, errorMessage, adornments, showClear, and size to match your form layout."
          }
          v0PageCode={usageCode}
        />
      )}
    </InputPlaygroundProvider>
  );
}
