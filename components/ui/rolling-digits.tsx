"use client";

import {
  RollingDigits as RegistryRollingDigits,
  RollingDigitsText as RegistryRollingDigitsText,
} from "@/registry/rolling-digits";

type RollingDigitsProps =
  import("@/registry/rolling-digits").RollingDigitsProps;
type RollingDigitsTextProps =
  import("@/registry/rolling-digits").RollingDigitsTextProps;

function RollingDigits(props: RollingDigitsProps) {
  return <RegistryRollingDigits {...props} />;
}

function RollingDigitsText(props: RollingDigitsTextProps) {
  return <RegistryRollingDigitsText {...props} />;
}

export { RollingDigits, RollingDigitsText };
export type {
  RollingDigitsLocale,
  RollingDigitsProps,
  RollingDigitsTextProps,
} from "@/registry/rolling-digits";
