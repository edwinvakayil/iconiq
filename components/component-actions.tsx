"use client";

import { OpenInV0Button } from "@/components/docs/open-in-v0-button";

export function ComponentActions({ name }: { name: string }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <OpenInV0Button name={name} />
    </div>
  );
}
