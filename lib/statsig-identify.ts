import type { StatsigUser } from "@flags-sdk/statsig";
import type { Identify } from "flags";
import { dedupe } from "flags/next";

export const identify = dedupe(({ cookies }) => {
  return {
    userID: cookies.get("iconiq-statsig-user-id")?.value ?? "anonymous",
  };
}) satisfies Identify<StatsigUser>;
