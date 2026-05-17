"use client";

import { MotionConfig, useReducedMotion } from "motion/react";
import { createContext, type ReactNode, useContext } from "react";

export interface ReducedMotionProp {
  reducedMotion?: boolean;
}

const ReducedMotionOverrideContext = createContext(false);

export function useResolvedReducedMotion(reducedMotion?: boolean) {
  const reducedMotionOverride = useContext(ReducedMotionOverrideContext);
  const prefersReducedMotion = useReducedMotion() ?? false;

  return Boolean(
    reducedMotion || reducedMotionOverride || prefersReducedMotion
  );
}

export function ReducedMotionOverride({
  children,
  reducedMotion = false,
}: ReducedMotionProp & {
  children: ReactNode;
}) {
  return (
    <ReducedMotionOverrideContext.Provider value={reducedMotion}>
      {children}
    </ReducedMotionOverrideContext.Provider>
  );
}

export function ReducedMotionConfig({
  children,
  reducedMotion,
}: ReducedMotionProp & {
  children: ReactNode;
}) {
  const resolvedReducedMotion = useResolvedReducedMotion(reducedMotion);

  return (
    <MotionConfig reducedMotion={resolvedReducedMotion ? "always" : "user"}>
      {children}
    </MotionConfig>
  );
}
