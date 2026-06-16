"use client";

import { TextLoop as RegistryTextLoop } from "@/registry/text-loop";

type TextLoopProps = import("@/registry/text-loop").TextLoopProps;

function TextLoop(props: TextLoopProps) {
  return <RegistryTextLoop {...props} />;
}

export { TextLoop, type TextLoopProps };
