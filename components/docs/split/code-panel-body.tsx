import { HighlightedCode } from "@/components/docs/code-snippet";
import { cn } from "@/lib/utils";

export function CodePanelBody({
  code,
  className,
}: {
  code: string;
  html?: string;
  className?: string;
}) {
  return (
    <pre
      className={cn(
        "overflow-x-auto whitespace-pre-wrap break-words p-4 font-mono text-[13px] leading-relaxed",
        className
      )}
    >
      <HighlightedCode code={code} />
    </pre>
  );
}
