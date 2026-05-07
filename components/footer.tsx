import Link from "next/link";

import { LINK } from "@/constants";

const Footer = () => {
  return (
    <footer className="mt-auto w-full shrink-0 border-neutral-200/50 border-t bg-background dark:border-neutral-800/50 dark:bg-background">
      <div className="mx-auto w-full max-w-[1480px] px-4 py-5 sm:px-6 sm:py-6 lg:px-10">
        <p className="text-[14px] text-muted-foreground leading-7 tracking-[-0.02em]">
          Built by{" "}
          <Link
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
            href="/"
          >
            iconiq
          </Link>{" "}
          at{" "}
          <a
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
            href="https://vercel.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            Vercel
          </a>
          . The source code is available on{" "}
          <a
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300"
            href={LINK.GITHUB}
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
};

export { Footer };
