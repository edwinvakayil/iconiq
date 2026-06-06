import type { StatsigUser } from "@flags-sdk/statsig";
import type { Identify } from "flags";
import { dedupe } from "flags/next";

/** Default Statsig user — matches console gate tests (`{ userID: "123" }`). */
export const DEFAULT_STATSIG_USER_ID = "123";

export const identify = dedupe(({ cookies }) => {
  return {
    userID:
      cookies.get("iconiq-statsig-user-id")?.value ?? DEFAULT_STATSIG_USER_ID,
  };
}) satisfies Identify<StatsigUser>;
