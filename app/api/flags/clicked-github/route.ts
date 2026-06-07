import { reportValue } from "flags";

export const dynamic = "force-dynamic";

export function POST() {
  reportValue("clickedGITHUB", true);

  return Response.json({ ok: true });
}
