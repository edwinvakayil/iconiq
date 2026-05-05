"use client";

import { Eye, EyeOff, LockKeyhole, Mail, User2 } from "lucide-react";
import { useState } from "react";

import { inputGroupApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { InputGroup, Inputgroups } from "@/registry/input-group";

const usageCode = `"use client";

import { Eye, EyeOff, LockKeyhole, Mail, User2 } from "lucide-react";
import { useState } from "react";
import { InputGroup, Inputgroups } from "@/components/ui/input-group";

export function ContactFields() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailError =
    email.length > 0 && !email.includes("@")
      ? "Enter a valid email address."
      : undefined;

  return (
    <InputGroup className="max-w-xl">
      <Inputgroups
        label="Full name"
        onChange={(event) => setName(event.target.value)}
        prefixIcon={<User2 aria-hidden className="size-5" />}
        value={name}
      />

      <Inputgroups
        error={emailError}
        label="Work email"
        onChange={(event) => setEmail(event.target.value)}
        prefixIcon={<Mail aria-hidden className="size-5" />}
        type="email"
        value={email}
      />

      <Inputgroups
        label="Password"
        prefixIcon={<LockKeyhole aria-hidden className="size-5" />}
        suffixIcon={
          showPassword ? (
            <EyeOff aria-hidden className="size-5" />
          ) : (
            <Eye aria-hidden className="size-5" />
          )
        }
        onSuffixClick={() => setShowPassword((current) => !current)}
        type={showPassword ? "text" : "password"}
      />
    </InputGroup>
  );
}`;

function InputGroupPreview() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailError =
    email.length > 0 && !email.includes("@")
      ? "Enter a valid email address."
      : undefined;

  return (
    <div className="w-full max-w-xl space-y-5 px-2">
      <InputGroup>
        <Inputgroups
          label="Full name"
          onChange={(event) => setName(event.target.value)}
          prefixIcon={<User2 aria-hidden className="size-5" />}
          value={name}
        />
        <Inputgroups
          error={emailError}
          label="Work email"
          onChange={(event) => setEmail(event.target.value)}
          prefixIcon={<Mail aria-hidden className="size-5" />}
          type="email"
          value={email}
        />
        <Inputgroups
          label="Password"
          onSuffixClick={() => setShowPassword((current) => !current)}
          prefixIcon={<LockKeyhole aria-hidden className="size-5" />}
          suffixIcon={
            showPassword ? (
              <EyeOff aria-hidden className="size-5" />
            ) : (
              <Eye aria-hidden className="size-5" />
            )
          }
          type={showPassword ? "text" : "password"}
        />
      </InputGroup>

      <p className="text-[13px] text-secondary leading-6">
        Try the password suffix action and enter an incomplete email to inspect
        the floating label, inline error, and focus rule together.
      </p>
    </div>
  );
}

export default function InputGroupPage() {
  return (
    <ComponentDocsPage
      breadcrumbs={[
        { label: "Docs", href: "/" },
        { label: "Components" },
        { label: "Input Group" },
      ]}
      componentName="input-group"
      description="Floating-label form fields with optional prefix and suffix icons, inline errors, and a companion wrapper for stacked input sets."
      details={inputGroupApiDetails}
      preview={<InputGroupPreview />}
      previewDescription="Use the grouped fields to inspect the floating label motion, focus underline, destructive state, and suffix-button behavior in one compact form."
      railNotes={[
        "Each field accepts native input props directly, so controlled and uncontrolled patterns both fit cleanly.",
        "The grouped wrapper is optional, but it keeps multi-field forms spaced consistently without extra layout code.",
      ]}
      title="Input Group"
      usageCode={usageCode}
      usageDescription="Use Inputgroups for each field, then wrap several fields in InputGroup when you want the same vertical spacing across a compact form section."
    />
  );
}
