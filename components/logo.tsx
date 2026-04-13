import Link from "next/link";
import { SITE } from "@/constants";
import { cn } from "@/lib/utils";

function LogoIcon({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 48 48"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        className="text-primary"
        fill="currentColor"
        height="18"
        rx="3"
        width="18"
        x="4"
        y="4"
      />
      <rect
        className="text-primary opacity-60"
        fill="currentColor"
        height="18"
        rx="3"
        width="18"
        x="26"
        y="4"
      />
      <rect
        className="text-primary opacity-80"
        fill="currentColor"
        height="18"
        rx="3"
        width="40"
        x="4"
        y="26"
      />
    </svg>
  );
}

function Logo({
  href = "/",
  iconSize = 20,
  className,
  showWordmark = true,
}: {
  href?: string;
  iconSize?: number;
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      className={cn("flex items-center gap-2 font-semibold text-lg", className)}
      href={href}
    >
      <LogoIcon size={iconSize} />
      {showWordmark && <span>{SITE.LOGO}</span>}
    </Link>
  );
}

export { Logo, LogoIcon };
