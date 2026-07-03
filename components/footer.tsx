import Image from "next/image";

const VERCEL_OSS_BADGE_SRC = "/vercel-oss-program-badge-2026.svg";
const VERCEL_OSS_PROGRAM_URL = "https://vercel.com/open-source-program";

function VercelOssBadge() {
  return (
    <a
      className="inline-flex transition-opacity hover:opacity-85"
      href={VERCEL_OSS_PROGRAM_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Image
        alt="Vercel OSS Program"
        className="h-5 w-auto"
        height={24}
        src={VERCEL_OSS_BADGE_SRC}
        unoptimized
        width={240}
      />
      <span className="sr-only">Vercel Open Source Program</span>
    </a>
  );
}

const Footer = () => {
  return (
    <footer className="w-full border-neutral-200/50 border-t bg-background dark:border-neutral-800/50 dark:bg-background">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6 lg:px-10">
        <div className="space-y-1">
          <p className="text-[14px] text-muted-foreground leading-7 tracking-[-0.02em]">
            Built by{" "}
            <a
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
              href="https://x.com/edwinvakayil"
              rel="noopener noreferrer"
              target="_blank"
            >
              edwinvakayil
            </a>{" "}
            at{" "}
            <a
              className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
              href="https://vercel.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Vercel
            </a>{" "}
            :)
          </p>
        </div>

        <div className="flex shrink-0 items-center sm:justify-end">
          <VercelOssBadge />
        </div>
      </div>
    </footer>
  );
};

export { Footer };
