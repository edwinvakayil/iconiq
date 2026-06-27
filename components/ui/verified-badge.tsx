"use client";

import { forwardRef } from "react";

import RegistryVerifiedBadge from "@/registry/verified-badge";

type VerifiedBadgeProps =
  import("@/registry/verified-badge").VerifiedBadgeProps;

const VerifiedBadge = forwardRef<HTMLSpanElement, VerifiedBadgeProps>(
  function VerifiedBadge(props, ref) {
    return <RegistryVerifiedBadge ref={ref} {...props} />;
  }
);

VerifiedBadge.displayName = "VerifiedBadge";

export { VerifiedBadge };
export default VerifiedBadge;
export type {
  VerifiedBadgeProps,
  VerifiedBadgeSize,
  VerifiedBadgeTone,
  VerifiedBadgeVariant,
} from "@/registry/verified-badge";
