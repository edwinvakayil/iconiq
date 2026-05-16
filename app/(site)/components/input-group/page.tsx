"use client";

import { Eye, EyeOff, LockKeyhole, Mail, User2 } from "lucide-react";
import { useState } from "react";

import { inputGroupApiDetails } from "@/components/docs/component-api";
import { ComponentDocsPage } from "@/components/docs/page-shell";
import { usageToV0Page } from "@/lib/component-v0-pages";
import { InputGroup, InputGroupField } from "@/registry/input-group";

const usageCode = `"use client";

import { Eye, EyeOff, LockKeyhole, Mail, User2 } from "lucide-react";
import { useState } from "react";
import { InputGroup, InputGroupField } from "@/components/ui/input-group";

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
      <InputGroupField
        label="Full name"
        onChange={(event) => setName(event.target.value)}
        prefixIcon={<User2 aria-hidden className="size-5" />}
        value={name}
      />

      <InputGroupField
        error={emailError}
        label="Work email"
        onChange={(event) => setEmail(event.target.value)}
        prefixIcon={<Mail aria-hidden className="size-5" />}
        type="email"
        value={email}
      />

      <InputGroupField
        label="Password"
        prefixIcon={<LockKeyhole aria-hidden className="size-5" />}
        suffixLabel={showPassword ? "Hide password" : "Show password"}
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
    <div className="w-full max-w-xl px-2">
      <InputGroup>
        <InputGroupField
          label="Full name"
          onChange={(event) => setName(event.target.value)}
          prefixIcon={<User2 aria-hidden className="size-5" />}
          value={name}
        />
        <InputGroupField
          error={emailError}
          label="Work email"
          onChange={(event) => setEmail(event.target.value)}
          prefixIcon={<Mail aria-hidden className="size-5" />}
          type="email"
          value={email}
        />
        <InputGroupField
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
          suffixLabel={showPassword ? "Hide password" : "Show password"}
          type={showPassword ? "text" : "password"}
        />
      </InputGroup>
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
      description="Floating-label form fields with optional prefix and suffix actions, accessible inline errors, and a companion wrapper for stacked input sets."
      details={inputGroupApiDetails}
      preview={<InputGroupPreview />}
      previewDescription="Use the grouped fields to inspect the floating label motion, focus underline, destructive state, error reveal, and suffix-button behavior in one compact form."
      railNotes={[
        "Each field accepts native input props directly, so controlled and uncontrolled patterns both fit cleanly.",
        "Suffix actions can expose a larger tap target and an explicit accessible label without changing the visual footprint of the icon.",
        "The grouped wrapper is optional, but it keeps multi-field forms spaced consistently without extra layout code.",
      ]}
      title="Input Group"
      usageCode={usageCode}
      usageDescription="Use InputGroupField for each field, then wrap several fields in InputGroup when you want the same vertical spacing across a compact form section."
      v0PageCode={usageToV0Page(usageCode)}
    />
  );
}
