"use client";

import { useEffect } from "react";

import { capturePostHogEvent } from "@/lib/posthog";

export function SponsorshipTracker() {
  useEffect(() => {
    capturePostHogEvent("sponsorship_page_viewed");
  }, []);

  return null;
}
