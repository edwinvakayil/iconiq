"use client";

import { forwardRef } from "react";

import RegistryStatusDot from "@/registry/status-dot";

type StatusDotProps = import("@/registry/status-dot").StatusDotProps;

const StatusDot = forwardRef<HTMLElement, StatusDotProps>(
  function StatusDot(props, ref) {
    return <RegistryStatusDot ref={ref} {...props} />;
  }
);

StatusDot.displayName = "StatusDot";

export { StatusDot };
export default StatusDot;
export type {
  StatusDotProps,
  StatusDotSize,
  StatusDotState,
  StatusDotTone,
} from "@/registry/status-dot";
