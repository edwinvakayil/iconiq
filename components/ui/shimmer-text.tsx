"use client";

import { TextShimmer as RegistryTextShimmer } from "@/registry/shimmer-text";

type TextShimmerProps = import("@/registry/shimmer-text").TextShimmerProps;

function TextShimmer(props: TextShimmerProps) {
  return <RegistryTextShimmer {...props} />;
}

export { TextShimmer, type TextShimmerProps };
