import { createVercelAdapter } from "@flags-sdk/vercel";
import type { Adapter } from "flags";
import { flag } from "flags/next";

function resolveVercelAdapter() {
  const connectionString = process.env.FLAGS;

  if (!connectionString) {
    return undefined;
  }

  return createVercelAdapter(connectionString)();
}

const clickedGithubFlagBase = {
  key: "clickedGITHUB",
  description: "When user clicked GitHub - Flag should be recorded",
  defaultValue: false,
  options: [
    { value: false as const, label: "Off" },
    { value: true as const, label: "On" },
  ],
};

const vercelFlagsAdapter = resolveVercelAdapter();

export const clickedGithubFlag = vercelFlagsAdapter
  ? flag<boolean>({
      ...clickedGithubFlagBase,
      adapter: vercelFlagsAdapter as Adapter<boolean, Record<string, never>>,
    })
  : flag<boolean>({
      ...clickedGithubFlagBase,
      decide() {
        return false;
      },
    });
