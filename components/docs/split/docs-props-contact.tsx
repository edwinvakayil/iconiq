import { Github } from "lucide-react";

import { LINK } from "@/constants";
import { cn } from "@/lib/utils";

const GITHUB_ISSUE_URL = `${LINK.GITHUB}/issues/new?template=issue.md`;

export function DocsPropsContact({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <p className="font-medium text-[11px] text-zinc-400 uppercase tracking-[0.1em] dark:text-zinc-500">
        Contact
      </p>
      <p className="mt-3 text-[15px] text-zinc-800 leading-6 dark:text-zinc-200">
        Additionally, if you find any bug or issue, feel free to{" "}
        <a
          className="group inline-flex items-center gap-1.5 text-zinc-800 transition-colors hover:text-zinc-600 dark:text-zinc-200 dark:hover:text-zinc-400"
          href={GITHUB_ISSUE_URL}
          rel="noreferrer"
          target="_blank"
        >
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <Github className="size-3.5 text-zinc-900 dark:text-zinc-100" />
          </span>
          <span className="relative">
            raise an issue
            <span
              aria-hidden
              className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-200 ease-out group-hover:scale-x-100"
            />
          </span>
        </a>
        .
      </p>
    </div>
  );
}
