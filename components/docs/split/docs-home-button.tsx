import { House } from "lucide-react";
import Link from "next/link";

export function DocsHomeButton() {
  return (
    <Link
      aria-label="Go to home"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-zinc-500 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      href="/"
    >
      <House className="size-4" strokeWidth={1.75} />
    </Link>
  );
}
