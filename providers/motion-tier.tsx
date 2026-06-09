"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

import { getMotionTier, type MotionTier } from "@/lib/motion-tier";

const MotionTierContext = createContext<MotionTier>("full");

export function MotionTierProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<MotionTier>("full");

  useLayoutEffect(() => {
    const applyTier = () => {
      const nextTier = getMotionTier();
      setTier(nextTier);
      document.documentElement.dataset.motionTier = nextTier;
    };

    applyTier();

    return () => {
      delete document.documentElement.dataset.motionTier;
    };
  }, []);

  return (
    <MotionTierContext.Provider value={tier}>
      {children}
    </MotionTierContext.Provider>
  );
}

export function useMotionTier() {
  return useContext(MotionTierContext);
}
