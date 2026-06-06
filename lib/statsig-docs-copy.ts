"use client";

import { useStatsigClient } from "@statsig/react-bindings";
import { useCallback } from "react";
import { SITE } from "@/constants";
import { type DocsCopySource, getDocsCopyGateName } from "@/lib/copy-gate-keys";

const STATSIG_PRODUCTION_HOST = new URL(SITE.URL).hostname;

export function useTrackDocsCopyGate() {
  const { checkGate } = useStatsigClient();

  return useCallback(
    (componentName: string, source: DocsCopySource) => {
      if (
        typeof window === "undefined" ||
        window.location.hostname !== STATSIG_PRODUCTION_HOST
      ) {
        return;
      }

      checkGate(getDocsCopyGateName(componentName, source));
    },
    [checkGate]
  );
}
