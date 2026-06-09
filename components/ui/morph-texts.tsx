"use client";

import { MorphText as RegistryMorphText } from "@/registry/morph-texts";

type MorphTextProps = import("@/registry/morph-texts").MorphTextProps;

function MorphText(props: MorphTextProps) {
  return <RegistryMorphText {...props} />;
}

export { MorphText, type MorphTextProps };
