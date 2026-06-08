"use client";

import { useMemo, useState } from "react";

import { ProviderSwitch } from "@/app/(site)/components/_components/provider-switch";
import { inputOtpApiDetails } from "@/components/docs/component-api";
import {
  ComponentDocsPage,
  type DetailItem,
} from "@/components/docs/page-shell";
import { LINK } from "@/constants";
import { OTP, OTPSlots } from "@/registry/input-otp";

const previewSentenceClassName =
  "text-balance text-center text-[13px] text-muted-foreground leading-tight";

const usageCode = `"use client";

import { useState } from "react";

import { OTP, OTPSlots } from "@/components/ui/input-otp";

export function InputOtpPreview() {
  const [value, setValue] = useState("");

  return (
    <div className="flex w-full flex-col items-center gap-4 px-4 py-10">
      <OTP length={6} onValueChange={setValue} value={value}>
        <OTPSlots separatorAfter={3} />
      </OTP>
      <p className="text-balance text-center text-[13px] text-muted-foreground leading-tight">
        Enter the 6-digit verification code sent to your device.
      </p>
    </div>
  );
}`;

function InputOtpPreview() {
  const [value, setValue] = useState("");

  return (
    <div className="flex w-full flex-col items-center gap-4 px-4 py-10">
      <OTP length={6} onValueChange={setValue} value={value}>
        <OTPSlots separatorAfter={3} />
      </OTP>
      <p className={previewSentenceClassName}>
        Enter the 6-digit verification code sent to your device.
      </p>
    </div>
  );
}

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
    <ComponentDocsPage
      breadcrumbs={breadcrumbs}
      componentName="input-otp"
      description="Animated one-time password field with spring slot focus, character entrance, and a blinking caret."
      details={details}
      detailsDescription="Use `OTPSlots` for the default layout or compose OTP, OTPGroup, OTPSlot, and OTPSeparator manually. Base UI manages value, focus, paste, and keyboard navigation while Motion handles the slot visuals."
      editHref={`${LINK.GITHUB}/edit/main/app/(site)/inputs-and-forms/input-otp/page.tsx`}
      headerActions={
        <ProviderSwitch
          disabledProviders={["radix"]}
          onSelect={handleProviderSelect}
          selectedProvider="base"
        />
      }
      itemSlug="input-otp"
      pageUrl="/inputs-and-forms/input-otp"
      preview={<InputOtpPreview />}
      previewClassName="min-h-[20rem] overflow-visible"
      previewDescription="A grouped 6-digit layout with animated slot focus, character transitions, and a pulsing caret on the active empty cell."
      title="Input OTP"
      usageCode={usageCode}
      usageDescription="Set `length` on `OTP`, then render `OTPSlots` for the default layout or compose slots manually. Wire `value` with `onValueChange` or `onValueComplete` for form flows. `separatorAfter` inserts a divider before the slot at that zero-based index."
    />
  );
}
