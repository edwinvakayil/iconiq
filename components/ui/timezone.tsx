"use client";

import { Timezone as RegistryTimezone } from "@/registry/timezone";

type TimezoneProps = import("@/registry/timezone").TimezoneProps;

function Timezone(props: TimezoneProps) {
  return <RegistryTimezone {...props} />;
}

export { Timezone, type TimezoneProps };
