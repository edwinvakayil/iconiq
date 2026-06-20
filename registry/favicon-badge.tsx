"use client";

import { Globe } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const WWW_PREFIX_RE = /^www\./;

function extractDomain(input: string): string | null {
  if (!input.trim()) return null;
  try {
    const raw = input.includes("://") ? input : `https://${input}`;
    const url = new URL(raw);
    const host = url.hostname.replace(WWW_PREFIX_RE, "");
    if (host.includes(".") && host.split(".").every(Boolean)) return host;
    return null;
  } catch {
    const cleaned = input.trim().replace(WWW_PREFIX_RE, "");
    if (cleaned.includes(".") && cleaned.split(".").every(Boolean))
      return cleaned;
    return null;
  }
}

function getFaviconCandidates(domain: string, size = 64): string[] {
  const origin = `https://${domain}`;

  return [
    `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(origin)}&sz=${size}`,
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`,
    `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`,
  ];
}

function getFaviconUrl(domain: string, size = 64): string {
  const [primary, ...fallbacks] = getFaviconCandidates(domain, size);
  return (
    primary ??
    fallbacks[0] ??
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`
  );
}

const sizeConfig = {
  sm: { badge: "size-6", icon: 14, gap: "gap-1.5" },
  md: { badge: "size-7", icon: 16, gap: "gap-2" },
  lg: { badge: "size-8", icon: 18, gap: "gap-2" },
} as const;

export type FaviconBadgeSize = keyof typeof sizeConfig;

export interface FaviconBadgeProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "children"> {
  /** Domain or URL used to resolve the favicon. */
  website: string;
  /** Optional label shown beside the favicon badge. */
  label?: string;
  /** @default 64 */
  faviconSize?: 16 | 32 | 64 | 128;
  /** @default md */
  size?: FaviconBadgeSize;
  badgeClassName?: string;
  labelClassName?: string;
}

function loadFavicon(
  urls: string[],
  onSuccess: (url: string) => void,
  onFailure: () => void
) {
  let cancelled = false;
  let index = 0;
  let activeImage: HTMLImageElement | null = null;

  const cleanup = () => {
    if (!activeImage) return;
    activeImage.onload = null;
    activeImage.onerror = null;
    activeImage.src = "";
    activeImage = null;
  };

  const tryNext = () => {
    cleanup();

    if (cancelled) return;

    const url = urls[index];

    if (!url) {
      onFailure();
      return;
    }

    const image = new Image();
    activeImage = image;

    const handleSuccess = () => {
      if (cancelled) return;
      onSuccess(url);
    };

    const handleFailure = () => {
      if (cancelled) return;
      index += 1;
      tryNext();
    };

    image.onload = handleSuccess;
    image.onerror = handleFailure;
    image.src = url;

    if (image.complete) {
      if (image.naturalWidth > 0) {
        handleSuccess();
      } else {
        handleFailure();
      }
    }
  };

  tryNext();

  return () => {
    cancelled = true;
    cleanup();
  };
}

function FaviconBadge({
  website,
  label,
  faviconSize = 64,
  size = "md",
  className,
  badgeClassName,
  labelClassName,
  ...props
}: FaviconBadgeProps) {
  const domain = React.useMemo(() => extractDomain(website), [website]);
  const [resolvedFaviconUrl, setResolvedFaviconUrl] = React.useState<
    string | null
  >(null);
  const [faviconReady, setFaviconReady] = React.useState(false);
  const [faviconError, setFaviconError] = React.useState(false);
  const config = sizeConfig[size];

  React.useEffect(() => {
    if (!domain) {
      setResolvedFaviconUrl(null);
      setFaviconReady(false);
      setFaviconError(false);
      return;
    }

    setResolvedFaviconUrl(null);
    setFaviconReady(false);
    setFaviconError(false);

    return loadFavicon(
      getFaviconCandidates(domain, faviconSize),
      (url) => {
        setResolvedFaviconUrl(url);
        setFaviconReady(true);
        setFaviconError(false);
      },
      () => {
        setResolvedFaviconUrl(null);
        setFaviconReady(false);
        setFaviconError(true);
      }
    );
  }, [domain, faviconSize]);

  const showFavicon = Boolean(
    domain && faviconReady && !faviconError && resolvedFaviconUrl
  );
  const accessibleLabel = label ?? domain ?? website;

  return (
    <span
      className={cn(
        "inline-flex items-center",
        label ? config.gap : undefined,
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center rounded-full border-[0.5px] border-border/60 bg-muted p-1",
          config.badge,
          badgeClassName
        )}
      >
        <AnimatePresence mode="wait">
          {showFavicon && resolvedFaviconUrl ? (
            // biome-ignore lint/performance/noImgElement: external favicon URLs are resolved at runtime and must stay framework-agnostic.
            <motion.img
              alt=""
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              className="size-full rounded-full object-contain"
              exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              height={config.icon}
              initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              key={resolvedFaviconUrl}
              src={resolvedFaviconUrl}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              width={config.icon}
            />
          ) : (
            <motion.span
              animate={{ opacity: 1, scale: 1 }}
              className="flex size-full items-center justify-center text-muted-foreground"
              exit={{ opacity: 0, scale: 0.7 }}
              initial={{ opacity: 0, scale: 0.7 }}
              key={domain ? `globe-${domain}` : "globe-fallback"}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              <Globe style={{ width: config.icon, height: config.icon }} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {label ? (
        <span
          className={cn("font-medium text-foreground text-sm", labelClassName)}
        >
          {label}
        </span>
      ) : (
        <span className="sr-only">{accessibleLabel}</span>
      )}
    </span>
  );
}

FaviconBadge.displayName = "FaviconBadge";

export { FaviconBadge, extractDomain, getFaviconUrl };
export default FaviconBadge;
