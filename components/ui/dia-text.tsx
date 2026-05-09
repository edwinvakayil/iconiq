"use client";

import {
  DiaText as RegistryDiaText,
  DiaTextReveal as RegistryDiaTextReveal,
} from "@/registry/dia-text";

type DiaTextRevealProps = import("@/registry/dia-text").DiaTextRevealProps;

function DiaText(props: DiaTextRevealProps) {
  return <RegistryDiaText {...props} />;
}

function DiaTextReveal(props: DiaTextRevealProps) {
  return <RegistryDiaTextReveal {...props} />;
}

export { DiaText, DiaTextReveal, type DiaTextRevealProps };
