"use client";

import { forwardRef } from "react";

import {
  Timezone as RegistryTimezone,
  getWorldTimezones as registryGetWorldTimezones,
  resolveTimezone as registryResolveTimezone,
} from "@/registry/timezone";

type TimezoneProps = import("@/registry/timezone").TimezoneProps;

const Timezone = forwardRef<HTMLElement, TimezoneProps>(
  function Timezone(props, ref) {
    return <RegistryTimezone ref={ref} {...props} />;
  }
);

Timezone.displayName = "Timezone";

const getWorldTimezones = registryGetWorldTimezones;
const resolveTimezone = registryResolveTimezone;

export { Timezone, getWorldTimezones, resolveTimezone };
export type { TimezoneProps };
