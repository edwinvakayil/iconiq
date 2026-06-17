"use client";

import { StatusDot as RegistryStatusDot } from "@/registry/status-dot";

type StatusDotProps = import("@/registry/status-dot").StatusDotProps;
type StatusDotState = import("@/registry/status-dot").StatusDotState;

function StatusDot(props: StatusDotProps) {
  return <RegistryStatusDot {...props} />;
}

export { StatusDot, type StatusDotProps, type StatusDotState };
