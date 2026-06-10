"use client";

import { RollingDigits as RegistryRollingDigits } from "@/registry/rolling-digits";

type RollingDigitsProps =
  import("@/registry/rolling-digits").RollingDigitsProps;

function RollingDigits(props: RollingDigitsProps) {
  return <RegistryRollingDigits {...props} />;
}

export { RollingDigits, type RollingDigitsProps };
