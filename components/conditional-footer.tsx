"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";

import { Footer } from "@/components/footer";

export function ConditionalFooter() {
  const pathname = usePathname();

  if (pathname === "/sponsorship") return null;

  return (
    <motion.div
      className="mt-auto w-full shrink-0"
      initial={{ opacity: 0, y: 16 }}
      transition={{ type: "spring", stiffness: 260, damping: 32 }}
      viewport={{ margin: "0px 0px -48px 0px", once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Footer />
    </motion.div>
  );
}
