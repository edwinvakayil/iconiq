import { getProviderData as getStatsigProviderData } from "@flags-sdk/statsig";
import { mergeProviderData } from "flags";
import { createFlagsDiscoveryEndpoint, getProviderData } from "flags/next";

import { copyGateFlags } from "@/flags";

export const GET = createFlagsDiscoveryEndpoint(async () => {
  const providers = [getProviderData(copyGateFlags)];

  if (process.env.STATSIG_CONSOLE_API_KEY && process.env.STATSIG_PROJECT_ID) {
    providers.push(
      await getStatsigProviderData({
        consoleApiKey: process.env.STATSIG_CONSOLE_API_KEY,
        projectId: process.env.STATSIG_PROJECT_ID,
      })
    );
  }

  return mergeProviderData(providers);
});
