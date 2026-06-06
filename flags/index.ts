import { type StatsigUser, statsigAdapter } from "@flags-sdk/statsig";
import { flag } from "flags/next";

import {
  COPY_GATE_SOURCES,
  type DocsCopySource,
  getDocsCopyGateName,
} from "@/lib/copy-gate-keys";
import { identify } from "@/lib/statsig-identify";
import registry from "@/registry.json";

function createCopyGateFlag(componentName: string, source: DocsCopySource) {
  const key = getDocsCopyGateName(componentName, source);

  return flag<boolean, StatsigUser>({
    key,
    description: `Tracks ${source} install copy on the ${componentName} docs page.`,
    identify,
    adapter: statsigAdapter.featureGate((gate) => gate.value),
  });
}

export const copyGateFlags = Object.fromEntries(
  registry.items.flatMap((item) =>
    COPY_GATE_SOURCES.map((source) => [
      getDocsCopyGateName(item.name, source).replaceAll("-", "_"),
      createCopyGateFlag(item.name, source),
    ])
  )
);
