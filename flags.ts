import { vercelAdapter } from "@flags-sdk/vercel";
import { flag } from "flags/next";

export const clickedGithubFlag = flag<boolean>({
  key: "clickedGITHUB",
  description: "When user clicked GitHub - Flag should be recorded",
  defaultValue: false,
  options: [
    { value: false, label: "Off" },
    { value: true, label: "On" },
  ],
  adapter: vercelAdapter(),
});
