"use client";

import { FaqPro as RegistryFaqPro } from "@/registry/faq-pro";

type FaqProItem = import("@/registry/faq-pro").FaqProItem;
type FaqProProps = import("@/registry/faq-pro").FaqProProps;

function FaqPro(props: FaqProProps) {
  return <RegistryFaqPro {...props} />;
}

export { FaqPro };
export type { FaqProItem, FaqProProps };
