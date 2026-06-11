"use client";

import { RevealText as RegistryRevealText } from "@/registry/reveal-text";

type RevealTextProps = import("@/registry/reveal-text").RevealTextProps;

function RevealText(props: RevealTextProps) {
  return <RegistryRevealText {...props} />;
}

export { RevealText, type RevealTextProps };
