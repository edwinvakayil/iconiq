"use client";

import { useMemo } from "react";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { InputOtpPlaygroundProvider } from "@/app/(site)/inputs-and-forms/input-otp/_components/input-otp-playground";
import { inputOtpApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
  type VariantItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import * as InputOtpModule from "@/registry/input-otp";

const importPath = "@/components/ui/input-otp";

const usageCode = `"use client";

import { useState } from "react";

import { OTP, OTPSlots } from "${importPath}";

export function InputOtpPreview() {
  const [value, setValue] = useState("");

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 px-4 py-10">
      <OTP
        description="Enter the 6-digit verification code sent to your device."
        id="verification-code"
        label="Verification code"
        length={6}
        onValueChange={setValue}
        value={value}
      >
        <OTPSlots separatorAfter={3} />
      </OTP>
    </div>
  );
}`;

const inputOtpExamples: VariantItem[] = [
  {
    title: "Invalid",
    code: `"use client";

import { useState } from "react";
import { OTP, OTPSlots } from "${importPath}";

export function InputOtpInvalidExample() {
  const [value, setValue] = useState("123450");

  return (
    <OTP
      errorMessage="That code is incorrect. Try again."
      id="verification-code"
      invalid
      label="Verification code"
      length={6}
      onValueChange={setValue}
      value={value}
    >
      <OTPSlots separatorAfter={3} />
    </OTP>
  );
}`,
  },
  {
    title: "Masked",
    code: `"use client";

import { useState } from "react";
import { OTP, OTPSlots } from "${importPath}";

export function InputOtpMaskedExample() {
  const [value, setValue] = useState("");

  return (
    <OTP
      description="Use mask on shared screens."
      id="access-code"
      label="Access code"
      length={6}
      mask
      onValueChange={setValue}
      value={value}
    >
      <OTPSlots />
    </OTP>
  );
}`,
  },
  {
    title: "Alphanumeric",
    code: `"use client";

import { useState } from "react";
import { OTP, OTPSlots } from "${importPath}";

export function InputOtpAlphanumericExample() {
  const [value, setValue] = useState("");

  return (
    <OTP
      description="Accept letters and numbers for backup codes."
      id="recovery-code"
      label="Recovery code"
      length={8}
      onValueChange={setValue}
      validationType="alphanumeric"
      value={value}
    >
      <OTPSlots separatorAfter={[4]} />
    </OTP>
  );
}`,
  },
  {
    title: "Auto submit",
    code: `"use client";

import { OTP, OTPSlots } from "${importPath}";

export function InputOtpAutoSubmitExample() {
  return (
    <form
      className="flex w-full max-w-md flex-col gap-4"
      onSubmit={(event) => event.preventDefault()}
    >
      <OTP
        autoSubmit
        description="The form submits when all slots are filled."
        id="verification-code"
        label="Verification code"
        length={6}
        name="code"
      >
        <OTPSlots separatorAfter={3} />
      </OTP>
      <button
        className="rounded-md bg-foreground px-3 py-2 text-background text-sm"
        type="submit"
      >
        Verify
      </button>
    </form>
  );
}`,
  },
];

const breadcrumbs = [
  { label: "Docs", href: "/" },
  { label: "Inputs & Forms" },
  { label: "Input OTP" },
];

function getDetails(): DetailItem[] {
  return inputOtpApiDetails.map((item) => {
    if (item.id !== "registry") {
      return item;
    }

    return {
      ...item,
      notes: [
        "Dependencies: @base-ui/react/otp-field, motion.",
        "This page documents the Base UI OTP Field preview install only.",
        "The generated registry file is /r/input-otp.json.",
      ],
      registryPath: "input-otp.json",
    };
  });
}

function handleProviderSelect() {
  return undefined;
}

export default function InputOtpPage() {
  const details = useMemo(() => getDetails(), []);

  return (
    <InputOtpPlaygroundProvider
      InputOtpModule={InputOtpModule}
      importPath={importPath}
    >
      {({ preview, renderSettings }) => (
        <ComponentDocsPage
          breadcrumbs={breadcrumbs}
          componentName="input-otp"
          description="Animated one-time password field with form-field chrome, spring slot focus, masked entry, and reduced-motion support."
          details={details}
          detailsDescription="Use `OTPSlots` for the default layout or compose OTP, OTPGroup, OTPSlot, and OTPSeparator manually. Base UI manages value, focus, paste, and keyboard navigation while Motion handles the slot visuals."
          editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/input-otp/page.tsx`}
          examples={inputOtpExamples}
          headerActions={
            <ProviderSwitch
              disabledProviders={["radix"]}
              onSelect={handleProviderSelect}
              selectedProvider="base"
            />
          }
          itemSlug="input-otp"
          pageUrl="/inputs-and-forms/input-otp"
          preview={preview}
          previewClassName="min-h-[20rem] overflow-visible lg:col-span-8"
          previewDescription="Tune length, size, separators, validation, mask, and field chrome from the playground."
          previewPersonalize={({ onClose }) => renderSettings(onClose)}
          previewPersonalizeTitle="Input OTP"
          railNotes={[
            "Current install target: Base UI.",
            "Use label, description, errorMessage, invalid, and required for complete form-field semantics.",
            "Motion respects prefers-reduced-motion for borders, characters, and caret pulse.",
            "mask obscures both native inputs and the animated slot display.",
            "separatorAfter accepts a single index or an array for multi-group codes.",
          ]}
          title="Input OTP"
          usageCode={usageCode}
          usageDescription="Set `length` on `OTP`, wire `value` with `onValueChange` or `onValueComplete`, and render `OTPSlots` for the default layout. Add `label`, `description`, and `errorMessage` for accessible form fields."
          v0PageCode={usageCode}
        />
      )}
    </InputOtpPlaygroundProvider>
  );
}
