import { type StatsigUser, statsigAdapter } from "@flags-sdk/statsig";
import { flag } from "flags/next";

import { COPIED_CLI_GATE, getDocsCopyGateName } from "@/lib/copy-gate-keys";
import { identify } from "@/lib/statsig-identify";
import registry from "@/registry.json";

function createManualCopyGateFlag(componentName: string) {
  const key = getDocsCopyGateName(componentName, "manual");

  return flag<boolean, StatsigUser>({
    key,
    description: `Tracks manual install copy on the ${componentName} docs page.`,
    identify,
    adapter: statsigAdapter.featureGate((gate) => gate.value),
  });
}

export const copyGateFlags = {
  copied_cli: flag<boolean, StatsigUser>({
    key: COPIED_CLI_GATE,
    description: "Tracks CLI install copy on component docs pages.",
    identify,
    adapter: statsigAdapter.featureGate((gate) => gate.value),
  }),
  ...Object.fromEntries(
    registry.items.map((item) => [
      getDocsCopyGateName(item.name, "manual").replaceAll("-", "_"),
      createManualCopyGateFlag(item.name),
    ])
  ),
};
