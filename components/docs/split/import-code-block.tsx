import { HighlightedCode } from "@/components/docs/code-snippet";

interface ImportCodeBlockProps {
  code: string;
}

export function ImportCodeBlock({ code }: ImportCodeBlockProps) {
  return (
    <div
      className="overflow-hidden rounded-xl border-[0.5px] border-zinc-200/80 bg-white text-sm shadow-none dark:border-zinc-800/80 dark:bg-zinc-950 [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:px-4 [&_pre]:py-3.5"
      data-code-block
      data-line-numbers="false"
    >
      <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed">
        <HighlightedCode code={code} />
      </pre>
    </div>
  );
}
