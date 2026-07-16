import Image from "next/image";

import { cn } from "@/lib/utils";

const VERCEL_OSS_BADGE_SRC = "/vercel-oss-program-badge-2026.svg";
const VERCEL_OSS_PROGRAM_URL =
  "https://vercel.com/blog/vercel-open-source-program-spring-2026-cohort#iconiq";

function VercelOssBadge({ className }: { className?: string }) {
  return (
    <a
      className={cn(
        "inline-flex transition-opacity hover:opacity-85",
        className
      )}
      href={VERCEL_OSS_PROGRAM_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Image
        alt="Vercel OSS Program"
        className="h-5 w-auto sm:h-6"
        height={24}
        src={VERCEL_OSS_BADGE_SRC}
        unoptimized
        width={240}
      />
      <span className="sr-only">Vercel Open Source Program</span>
    </a>
  );
}

export { VercelOssBadge };
