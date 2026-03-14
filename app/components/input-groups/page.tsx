"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ComponentPager } from "@/components/component-pager";
import { PackageManagerTabs } from "@/components/docs/package-manager-tabs";
import { PreviewTabs } from "@/components/docs/preview-tabs";
import { PropsTable, type PropsTableRow } from "@/components/docs/props-table";
import { OnThisPage } from "@/components/on-this-page";
import { SidebarNav } from "@/components/sidebar-nav";
import {
  PasswordValidationInput,
  type PasswordValidationRule,
} from "@/registry/input-group";

const HAS_DIGIT = /\d/;
const HAS_UPPERCASE = /[A-Z]/;
const HAS_SPECIAL = /[!@#$%^&*]/;

const demoValidations: PasswordValidationRule[] = [
  { text: "At least 8 characters", validate: (v) => v.length >= 8 },
  { text: "Contains a number", validate: (v) => HAS_DIGIT.test(v) },
  { text: "Contains uppercase letter", validate: (v) => HAS_UPPERCASE.test(v) },
  { text: "Contains special character", validate: (v) => HAS_SPECIAL.test(v) },
];

const PASSWORD_CODE = `"use client";

import { PasswordValidationInput } from "@/components/ui/input-group";

const validations = [
  { text: "At least 8 characters", validate: (v) => v.length >= 8 },
  { text: "Contains a number", validate: (v) => /\\d/.test(v) },
];

export function Example() {
  return (
    <PasswordValidationInput
      validations={validations}
      label="Create password"
      placeholder="Enter your password"
    />
  );
}`;

const PASSWORD_PROPS: PropsTableRow[] = [
  {
    name: "validations",
    type: "PasswordValidationRule[]",
    desc: "Array of rules. Each rule has text (label) and validate (function that takes the current value and returns a boolean).",
  },
  {
    name: "label",
    type: "string",
    desc: 'Optional label for the input (default "Password").',
  },
  {
    name: "placeholder",
    type: "string",
    desc: 'Optional placeholder (default "Enter password").',
  },
  {
    name: "inputId",
    type: "string",
    desc: 'Optional id for the input element (default "password").',
  },
  {
    name: "className",
    type: "string",
    desc: "Optional class name for the root container.",
  },
];

export default function InputGroupsPage() {
  return (
    <div className="flex min-h-[calc(100vh-0px)] w-full min-w-0">
      <SidebarNav />

      <motion.main
        animate={{ opacity: 1 }}
        className="min-w-0 flex-1 overflow-x-hidden"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto w-full min-w-0 max-w-[760px] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
          {/* Breadcrumb + pager */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-wrap items-center justify-between gap-3 sm:mb-10"
            initial={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground sm:text-[12px]">
              <Link
                className="transition-colors hover:text-foreground"
                href="/"
              >
                Docs
              </Link>
              <span className="text-muted-foreground/40">/</span>
              <Link
                className="transition-colors hover:text-foreground"
                href="/components/badges"
              >
                Components
              </Link>
              <span className="text-muted-foreground/40">/</span>
              <span className="font-medium text-foreground">Input Groups</span>
            </div>
            <div className="shrink-0">
              <ComponentPager />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 12 }}
            transition={{ delay: 0.05, duration: 0.35 }}
          >
            <h1 className="mb-3 font-bold text-2xl text-foreground leading-tight tracking-tight sm:mb-5 sm:text-3xl md:text-[3rem] md:leading-[1.05]">
              Input Groups
            </h1>
            <p className="max-w-[580px] text-muted-foreground text-sm leading-relaxed sm:text-base sm:leading-[1.75]">
              Password field with validation rules. Built with Framer Motion.
            </p>
          </motion.div>

          <div className="mb-8 h-px bg-border sm:mb-10" />

          {/* Section 1: Password field */}
          <section className="mb-12 sm:mb-16" id="password-field">
            <h2 className="mb-4 font-semibold text-base text-foreground sm:text-lg">
              Password field
            </h2>
            <p className="mb-6 max-w-[580px] text-muted-foreground text-sm leading-relaxed">
              A password input with live validation rules. Type to see rules
              update.
            </p>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mb-10 sm:mb-12"
              initial={{ opacity: 0, y: 8 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <h3 className="mb-3 font-semibold text-[12px] text-muted-foreground uppercase tracking-widest sm:mb-4 sm:text-[13px]">
                Installation
              </h3>
              <PackageManagerTabs componentName="input-group-01" />
            </motion.div>

            <div className="mb-10 sm:mb-12" id="preview">
              <h3 className="mb-3 font-semibold text-[12px] text-muted-foreground uppercase tracking-widest sm:mb-4 sm:text-[13px]">
                Demo
              </h3>
              <PreviewTabs
                codeSample={PASSWORD_CODE}
                previewChildren={
                  <PasswordValidationInput
                    label="Create password"
                    placeholder="Enter your password"
                    validations={demoValidations}
                  />
                }
                previewDescription="Type to see validation rules update in real time."
              />
            </div>

            <div className="mb-10 sm:mb-12" id="props">
              <h3 className="mb-3 font-semibold text-[12px] text-muted-foreground uppercase tracking-widest sm:mb-4 sm:text-[13px]">
                API Reference
              </h3>
              <PropsTable
                componentTag="input-group-01"
                props={PASSWORD_PROPS}
              />
            </div>
          </section>
        </div>
      </motion.main>

      <OnThisPage />
    </div>
  );
}
