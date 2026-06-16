"use client";

import { LiquidMarquee as RegistryLiquidMarquee } from "@/registry/liquid-marquee";

type LiquidMarqueeProps =
  import("@/registry/liquid-marquee").LiquidMarqueeProps;

function LiquidMarquee(props: LiquidMarqueeProps) {
  return <RegistryLiquidMarquee {...props} />;
}

export { LiquidMarquee, type LiquidMarqueeProps };
