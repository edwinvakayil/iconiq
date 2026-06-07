import { NextResponse } from "next/server";

function iconProbeNotFound() {
  return new NextResponse(null, {
    status: 404,
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

export function GET() {
  return iconProbeNotFound();
}

export function HEAD() {
  return iconProbeNotFound();
}
