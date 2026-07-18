"use client";

/**
 * Flux Button on the studio canvas: keeps pointer events in edit mode and
 * simulates a real async action so the loading spinner is visible.
 */

import { FluxButton, type FluxButtonProps } from "@/registry/flux-button";

const STUDIO_ACTION_DELAY_MS = 1500;

type StudioFluxButtonCanvasProps = Omit<FluxButtonProps, "onAction">;

export function StudioFluxButtonCanvas(props: StudioFluxButtonCanvasProps) {
  return (
    <div
      className="pointer-events-auto w-fit"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <FluxButton
        {...props}
        onAction={async () => {
          await new Promise<void>((resolve) => {
            window.setTimeout(resolve, STUDIO_ACTION_DELAY_MS);
          });
        }}
      />
    </div>
  );
}
