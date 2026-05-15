"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

import { Footer } from "@/components/footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  if (pathname === "/sponsorship") return null;

  return (
    <motion.div
      className="mt-auto w-full shrink-0"
      initial={
        prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 260, damping: 32 }
      }
      viewport={{ margin: "0px 0px -48px 0px", once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Footer />
    </motion.div>
  );
}
