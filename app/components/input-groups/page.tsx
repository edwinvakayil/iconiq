"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { CodeBlockInstall } from "@/components/code-block-install";
import { ComponentActions } from "@/components/component-actions";
import { ComponentPager } from "@/components/component-pager";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";
import {
  PasswordValidationInput,
  type PasswordValidationRule,
} from "@/registry/input-group";
import InputFloatingLabel from "@/registry/input-group-02";

const HAS_DIGIT = /\d/;
const HAS_UPPERCASE = /[A-Z]/;
const HAS_SPECIAL = /[!@#$%^&*]/;

const demoValidations: PasswordValidationRule[] = [
  { text: "At least 8 characters", validate: (v) => v.length >= 8 },
  { text: "Contains a number", validate: (v) => HAS_DIGIT.test(v) },
  { text: "Contains uppercase letter", validate: (v) => HAS_UPPERCASE.test(v) },
  { text: "Contains special character", validate: (v) => HAS_SPECIAL.test(v) },
];

export default function InputGroupsPage() {
  return (
    <div className="flex min-h-[calc(100vh-0px)] w-full min-w-0">
      <SidebarNav />

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[720px] px-4 py-10 sm:px-6 sm:py-12">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center justify-between gap-3"
          >
            <ol className="flex items-center gap-1.5 font-sans text-neutral-500 text-sm">
              <li>
                <Link
                  className="transition-colors hover:text-neutral-900"
                  href="/"
                >
                  Docs
                </Link>
              </li>

              <li aria-hidden="true">
                <ChevronRight className="size-4 text-neutral-400" />
              </li>

              <li aria-current="page" className="text-neutral-900">
                Components
              </li>

              <li aria-hidden="true">
                <ChevronRight className="size-4 text-neutral-400" />
              </li>

              <li aria-current="page" className="text-neutral-900">
                Input Groups
              </li>
            </ol>
            <ComponentPager />
          </nav>

          <h1 className="font-bold font-sans text-3xl text-neutral-900 tracking-tight sm:text-4xl dark:text-white">
            Input Groups
          </h1>

          <p className="mt-2 font-sans text-lg text-neutral-600 dark:text-neutral-400">
            Input groups combine a label, input, and optional controls (buttons,
            icons, validation) into a single cohesive block. Use them for forms,
            search bars, and any field that needs extra UI around the input.
          </p>

          <p className="mt-6 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            This page lists several input group components. Each can be
            installed separately via the shadcn CLI. More variants will be added
            over time.
          </p>

          <h2
            className="mt-12 font-sans font-semibold text-lg text-neutral-900 dark:text-white"
            id="password-field"
          >
            Password field
          </h2>

          <p className="mt-1 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            A password field with real-time validation, strength indicator, and
            visibility toggle. You define the validation rules; the component
            displays them and shows progress as the user types. Good for sign-up
            and password change flows.
          </p>

          <div className="mt-4">
            <CodeBlockInstall componentName="input-group-01" />
          </div>

          <h3
            className="mt-8 font-sans font-semibold text-base text-neutral-900 dark:text-white"
            id="preview"
          >
            Preview
          </h3>

          <p className="mt-1 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            Example with custom rules: length, number, uppercase, and special
            character. Type in the field to see each rule turn green as it’s
            satisfied.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <PasswordValidationInput validations={demoValidations} />
          </div>

          <h3
            className="mt-8 font-sans font-semibold text-base text-neutral-900 dark:text-white"
            id="usage"
          >
            Usage
          </h3>

          <p className="mt-1 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            Import{" "}
            <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
              PasswordValidationInput
            </code>{" "}
            and pass your own{" "}
            <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
              validations
            </code>{" "}
            array. Each rule has a{" "}
            <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
              text
            </code>{" "}
            label and a{" "}
            <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
              validate
            </code>{" "}
            function that receives the current value and returns a boolean.
          </p>

          <div className="mt-4">
            <CodeBlock
              code={`import {
  PasswordValidationInput,
  type PasswordValidationRule,
} from "@/components/ui/input-group-01";

const HAS_DIGIT = /\\d/;
const HAS_UPPERCASE = /[A-Z]/;
const HAS_SPECIAL = /[!@#$%^&*]/;

const myValidations: PasswordValidationRule[] = [
  { text: "At least 8 characters", validate: (v) => v.length >= 8 },
  { text: "Contains a number", validate: (v) => HAS_DIGIT.test(v) },
  { text: "Contains uppercase letter", validate: (v) => HAS_UPPERCASE.test(v) },
  { text: "Contains special character", validate: (v) => HAS_SPECIAL.test(v) },
];

export function MyPasswordForm() {
  return (
    <PasswordValidationInput
      validations={myValidations}
      label="Create password"
      placeholder="Enter your password"
      inputId="signup-password"
    />
  );
}
`}
              language="tsx"
            />
          </div>

          <h3
            className="mt-8 font-sans font-semibold text-base text-neutral-900 dark:text-white"
            id="get-code"
          >
            Get the Component
          </h3>

          <p className="mt-1 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            Copy the password field component into your project or open it in v0
            to customize and generate variations.
          </p>

          <div className="mt-6">
            <ComponentActions name="input-group-01" />
          </div>

          <h4
            className="mt-6 font-sans font-semibold text-neutral-900 text-sm dark:text-white"
            id="props"
          >
            Props
          </h4>

          <ul className="mt-2 list-inside list-disc font-sans text-neutral-600 text-sm dark:text-neutral-400">
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                validations
              </code>{" "}
              — array of rules. Each rule has{" "}
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                text
              </code>{" "}
              (label) and{" "}
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                validate
              </code>{" "}
              (function that takes the current value and returns a boolean).
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                label
              </code>{" "}
              — optional label for the input (default: &quot;Password&quot;).
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                placeholder
              </code>{" "}
              — optional placeholder (default: &quot;Enter password&quot;).
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                inputId
              </code>{" "}
              — optional id for the input element (default:
              &quot;password&quot;).
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                className
              </code>{" "}
              — optional class name for the root container.
            </li>
          </ul>

          <h2
            className="mt-12 font-sans font-semibold text-lg text-neutral-900 dark:text-white"
            id="input-label"
          >
            Input Label
          </h2>

          <p className="mt-1 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            A floating label input where the label sits inside the field and
            animates upward on focus or when the input has a value. Great for
            compact forms while keeping the label always visible.
          </p>

          <div className="mt-4">
            <CodeBlockInstall componentName="input-group-02" />
          </div>

          <h3
            className="mt-8 font-sans font-semibold text-base text-neutral-900 dark:text-white"
            id="input-label-preview"
          >
            Preview
          </h3>

          <p className="mt-1 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            Click the field to see the label float; type to keep it pinned above
            the input.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <InputFloatingLabel />
          </div>

          <h3
            className="mt-8 font-sans font-semibold text-base text-neutral-900 dark:text-white"
            id="input-label-usage"
          >
            Usage
          </h3>

          <p className="mt-1 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            Import{" "}
            <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
              InputFloatingLabel
            </code>{" "}
            and render it where you need a floating label input.
          </p>

          <div className="mt-4">
            <CodeBlock
              code={`import InputFloatingLabel from "@/components/ui/input-group-02";

export function Example() {
  return <InputFloatingLabel />;
}
`}
              language="tsx"
            />
          </div>

          <h3
            className="mt-8 font-sans font-semibold text-base text-neutral-900 dark:text-white"
            id="input-label-get-code"
          >
            Get the Component
          </h3>

          <p className="mt-1 font-sans text-neutral-600 text-sm dark:text-neutral-400">
            Copy the input label component into your project or open it in v0 to
            customize and generate variations.
          </p>

          <div className="mt-6">
            <ComponentActions name="input-group-02" />
          </div>

          <h4
            className="mt-6 font-sans font-semibold text-neutral-900 text-sm dark:text-white"
            id="input-label-props"
          >
            Props
          </h4>

          <ul className="mt-2 list-inside list-disc font-sans text-neutral-600 text-sm dark:text-neutral-400">
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                id
              </code>{" "}
              — generated via{" "}
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                useId
              </code>{" "}
              for label association.
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                placeholder
              </code>{" "}
              — text shown inside the input (e.g. &quot;Username&quot;).
            </li>
            <li>
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                className
              </code>{" "}
              — optional class name for the underlying{" "}
              <code className="rounded bg-neutral-200 px-1 font-mono text-xs dark:bg-neutral-700 dark:text-neutral-200">
                Input
              </code>
              .
            </li>
          </ul>
        </div>
      </main>

      <OnThisPage />
    </div>
  );
}
