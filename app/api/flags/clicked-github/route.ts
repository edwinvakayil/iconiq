import { reportValue } from "flags";

export function POST() {
  reportValue("clickedGITHUB", true);

  return Response.json({ ok: true });
}
