import { cn } from "@/lib/utils";

function BaseUILogo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("shrink-0", className)}
      fill="currentColor"
      viewBox="0 0 17 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M9.5001 7.01537C9.2245 6.99837 9 7.22385 9 7.49999V23C13.4183 23 17 19.4183 17 15C17 10.7497 13.6854 7.27351 9.5001 7.01537Z" />
      <path d="M8 9.8V12V23C3.58172 23 0 19.0601 0 14.2V12V1C4.41828 1 8 4.93989 8 9.8Z" />
    </svg>
  );
}

function RadixUILogo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("shrink-0", className)}
      fill="currentColor"
      viewBox="0 0 35 35"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17 35C10.3726 35 5 30.0751 5 24C5 17.9249 10.3726 13 17 13L17 35Z" />
      <rect height="12" width="12" x="5" />
      <circle cx="24" cy="6" r="6" />
    </svg>
  );
}

export { BaseUILogo, RadixUILogo };
