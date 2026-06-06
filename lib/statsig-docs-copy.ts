"use client";

import { useStatsigClient } from "@statsig/react-bindings";
import { useCallback } from "react";

import { SITE } from "@/constants";

export type DocsCopySource = "cli" | "manual";

const STATSIG_PRODUCTION_HOST = new URL(SITE.URL).hostname;

type StatsigLogClient = {
  logEvent: (
    eventName: string,
    value?: string,
    metadata?: Record<string, string>
  ) => void;
};

export function isStatsigProductionHost() {
  return (
    typeof window !== "undefined" &&
    window.location.hostname === STATSIG_PRODUCTION_HOST
  );
}

export function getDocsCopyEventName(componentName: string) {
  return `copied-${componentName.trim().toLowerCase()}`;
}

export function logDocsCopyEvent(
  client: StatsigLogClient | null | undefined,
  componentName: string,
  source: DocsCopySource
) {
  if (!(client && isStatsigProductionHost())) {
    return;
  }

  client.logEvent(getDocsCopyEventName(componentName), source, {
    componentName: componentName.trim().toLowerCase(),
    source,
  });
}

export function useLogDocsCopyEvent() {
  const { client } = useStatsigClient();

  return useCallback(
    (componentName: string, source: DocsCopySource) => {
      logDocsCopyEvent(client, componentName, source);
    },
    [client]
  );
}
