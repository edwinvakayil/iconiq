"use client";

import { Globe } from "lucide-react";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const componentThemeClassName =
  "[--ic-background:#ffffff] [--ic-foreground:#111111] [--ic-primary:#111111] [--ic-secondary:#646b75] [--ic-surface-border:#e9edf2] [--ic-border:#e3e7ec] [--ic-card:#ffffff] [--ic-card-foreground:#111111] [--ic-muted:#f5f7fa] [--ic-muted-foreground:#6d7480] [--ic-accent:#f3f5f8] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--ic-accent-foreground:#111111] [--ic-input:#e3e7ec] [--ic-ring:rgba(17,17,17,0.16)] [--ic-destructive:#dc2626] [--ic-paper:#fcfcfd] [--ic-popover-foreground:#111111] [--ic-brand:#0ea5e9] [--ic-brand-soft:#bae6fd] [--ic-shadow-soft:0_18px_38px_-24px_rgba(15,23,42,0.35)] [--ic-chart-1:oklch(0.52_0.19_254)] [--ic-chart-2:oklch(0.74_0.11_232)] [--ic-chart-3:oklch(0.42_0.16_262)] [--ic-chart-4:oklch(0.84_0.07_228)] [--ic-chart-5:oklch(0.62_0.14_240)] [--color-background:var(--ic-background)] [--color-foreground:var(--ic-foreground)] [--color-primary:var(--ic-primary)] [--color-secondary:var(--ic-secondary)] [--color-border:var(--ic-border)] [--color-card:var(--ic-card)] [--color-card-foreground:var(--ic-card-foreground)] [--color-muted:var(--ic-muted)] [--color-muted-foreground:var(--ic-muted-foreground)] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] [--color-input:var(--ic-input)] [--color-ring:var(--ic-ring)] [--color-destructive:var(--ic-destructive)] [--color-paper:var(--ic-paper)] [--color-popover-foreground:var(--ic-popover-foreground)] [--color-brand:var(--ic-brand)] [--color-brand-soft:var(--ic-brand-soft)] [--color-chart-1:var(--ic-chart-1)] [--color-chart-2:var(--ic-chart-2)] [--color-chart-3:var(--ic-chart-3)] [--color-chart-4:var(--ic-chart-4)] [--color-chart-5:var(--ic-chart-5)] dark:[--ic-background:#111111] dark:[--ic-foreground:#f6f3ec] dark:[--ic-primary:#f6f3ec] dark:[--ic-secondary:#cbc6bb] dark:[--ic-surface-border:#2a2a25] dark:[--ic-border:#2b2a25] dark:[--ic-card:#111111] dark:[--ic-card-foreground:#f6f3ec] dark:[--ic-muted:#171716] dark:[--ic-muted-foreground:#9a958a] dark:[--ic-accent:#1a1a18] [--color-accent:var(--ic-accent)] [--color-accent-foreground:var(--ic-accent-foreground)] dark:[--ic-accent-foreground:#f6f3ec] dark:[--ic-input:#2b2a25] dark:[--ic-ring:rgba(246,243,236,0.18)] dark:[--ic-destructive:#f87171] dark:[--ic-paper:#171716] dark:[--ic-popover-foreground:#f6f3ec] dark:[--ic-brand:#38bdf8] dark:[--ic-brand-soft:#0c4a6e] dark:[--ic-shadow-soft:0_20px_44px_-28px_rgba(0,0,0,0.6)] dark:[--ic-chart-1:oklch(0.68_0.17_250)] dark:[--ic-chart-2:oklch(0.82_0.09_225)] dark:[--ic-chart-3:oklch(0.58_0.15_260)] dark:[--ic-chart-4:oklch(0.75_0.12_235)] dark:[--ic-chart-5:oklch(0.88_0.06_220)]";

const WWW_PREFIX_RE = /^www\./;
const GOOGLE_FAVICON_RE = /google\.com\/s2\/favicons/;

type FaviconResolveStatus = "idle" | "loading" | "success" | "error";

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

function isLikelyDefaultFavicon(url: string, image: HTMLImageElement): boolean {
  if (!GOOGLE_FAVICON_RE.test(url)) return false;
  return image.naturalWidth <= 16 && image.naturalHeight <= 16;
}

function getImageSourceUrl(image: HTMLImageElement): string {
  return image.currentSrc || image.src;
}

function getInitialResolveStatus(
  domain: string | null,
  overrideUrl: string | undefined,
  website: string
): FaviconResolveStatus {
  if (overrideUrl) return "loading";
  if (!domain) return website.trim() ? "error" : "idle";
  return "loading";
}

const sizeConfig = {
  sm: {
    badge: "size-6",
    icon: 14,
    gap: "gap-1.5",
    label: "text-sm leading-none",
  },
  md: {
    badge: "size-7",
    icon: 16,
    gap: "gap-2",
    label: "text-base leading-none",
  },
  lg: {
    badge: "size-8",
    icon: 18,
    gap: "gap-2",
    label: "text-lg leading-none",
  },
} as const;

export type FaviconBadgeSize = keyof typeof sizeConfig;

export interface FaviconBadgeProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "children"> {
  /** Domain or URL used to resolve the favicon. */
  website: string;
  /** Optional label shown beside the favicon badge. */
  label?: string;
  /** Skip provider resolution and render this favicon URL directly. */
  faviconUrl?: string;
  /** @default 64 */
  faviconSize?: 16 | 32 | 64 | 128;
  /** @default md */
  size?: FaviconBadgeSize;
  badgeClassName?: string;
  labelClassName?: string;
  /** Called when a favicon URL resolves successfully. */
  onFaviconLoad?: (url: string) => void;
  /** Called when resolution fails or an override URL fails to load. */
  onFaviconError?: () => void;
}

function useLatestRef<T>(value: T) {
  const ref = React.useRef(value);
  ref.current = value;
  return ref;
}

function useFaviconResolver({
  domain,
  faviconSize,
  onFaviconError,
  onFaviconLoad,
  overrideUrl,
  website,
}: {
  domain: string | null;
  faviconSize: NonNullable<FaviconBadgeProps["faviconSize"]>;
  onFaviconError?: () => void;
  onFaviconLoad?: (url: string) => void;
  overrideUrl?: string;
  website: string;
}) {
  const candidates = React.useMemo(
    () => (domain ? getFaviconCandidates(domain, faviconSize) : []),
    [domain, faviconSize]
  );

  const [status, setStatus] = React.useState<FaviconResolveStatus>(() =>
    getInitialResolveStatus(domain, overrideUrl, website)
  );
  const [candidateIndex, setCandidateIndex] = React.useState(0);
  const [displayUrl, setDisplayUrl] = React.useState<string | null>(null);

  const probeImgRef = React.useRef<HTMLImageElement>(null);
  const resolveGenerationRef = React.useRef(0);
  const processedProbeRef = React.useRef<string | null>(null);
  const statusRef = useLatestRef(status);
  const candidateIndexRef = useLatestRef(candidateIndex);
  const candidatesRef = useLatestRef(candidates);
  const callbacksRef = useLatestRef({ onFaviconError, onFaviconLoad });
  const overrideUrlRef = useLatestRef(overrideUrl);

  // biome-ignore lint/correctness/useExhaustiveDependencies: faviconSize updates provider URLs and must reset probing.
  React.useEffect(() => {
    resolveGenerationRef.current += 1;
    processedProbeRef.current = null;
    setCandidateIndex(0);
    setDisplayUrl(null);
    setStatus(getInitialResolveStatus(domain, overrideUrl, website));

    return () => {
      resolveGenerationRef.current += 1;
    };
  }, [domain, faviconSize, overrideUrl, website]);

  const probeUrl = overrideUrl ?? candidates[candidateIndex] ?? null;
  const isLoading = status === "loading" && Boolean(probeUrl);
  const isSuccess = status === "success" && Boolean(displayUrl);
  const showImage = isLoading || isSuccess;
  const imageSrc = isSuccess ? displayUrl : probeUrl;
  const showError = status === "error";

  const isActiveGeneration = React.useCallback(
    (generation: number) => generation === resolveGenerationRef.current,
    []
  );

  const failResolution = React.useCallback(
    (generation: number) => {
      if (!isActiveGeneration(generation)) return;
      if (statusRef.current !== "loading") return;

      processedProbeRef.current = null;
      setDisplayUrl(null);
      setStatus("error");
      callbacksRef.current.onFaviconError?.();
    },
    [callbacksRef, isActiveGeneration, statusRef]
  );

  const advanceCandidate = React.useCallback(
    (generation: number) => {
      if (!isActiveGeneration(generation)) return;
      if (statusRef.current !== "loading") return;

      processedProbeRef.current = null;

      const nextIndex = candidateIndexRef.current + 1;

      if (nextIndex >= candidatesRef.current.length) {
        failResolution(generation);
        return;
      }

      setCandidateIndex(nextIndex);
    },
    [
      candidateIndexRef,
      candidatesRef,
      failResolution,
      isActiveGeneration,
      statusRef,
    ]
  );

  const completeProbe = React.useCallback(
    (image: HTMLImageElement, url: string, generation: number) => {
      if (!isActiveGeneration(generation)) return;
      if (statusRef.current !== "loading") return;

      const probeKey = `${generation}:${url}`;
      if (processedProbeRef.current === probeKey) return;
      processedProbeRef.current = probeKey;

      if (!overrideUrlRef.current && isLikelyDefaultFavicon(url, image)) {
        advanceCandidate(generation);
        return;
      }

      setDisplayUrl(url);
      setStatus("success");
      callbacksRef.current.onFaviconLoad?.(url);
    },
    [
      advanceCandidate,
      callbacksRef,
      isActiveGeneration,
      overrideUrlRef,
      statusRef,
    ]
  );

  const handleImageLoad = React.useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const image = event.currentTarget;
      const url = getImageSourceUrl(image);

      if (!url) return;

      completeProbe(image, url, resolveGenerationRef.current);
    },
    [completeProbe]
  );

  const handleImageError = React.useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const generation = resolveGenerationRef.current;
      if (statusRef.current !== "loading") return;

      const url = getImageSourceUrl(event.currentTarget);
      const probeKey = `${generation}:${url}`;

      if (processedProbeRef.current === probeKey) return;
      processedProbeRef.current = probeKey;

      if (overrideUrlRef.current) {
        failResolution(generation);
        return;
      }

      advanceCandidate(generation);
    },
    [advanceCandidate, failResolution, overrideUrlRef, statusRef]
  );

  React.useLayoutEffect(() => {
    if (!(isLoading && probeUrl)) return;

    const image = probeImgRef.current;
    if (!image?.complete) return;

    const generation = resolveGenerationRef.current;
    const url = getImageSourceUrl(image);
    if (!url) return;

    if (image.naturalWidth > 0) {
      completeProbe(image, url, generation);
      return;
    }

    handleImageError({
      currentTarget: image,
    } as React.SyntheticEvent<HTMLImageElement>);
  }, [completeProbe, handleImageError, isLoading, probeUrl]);

  return {
    handleImageError,
    handleImageLoad,
    imageSrc,
    isLoading,
    isSuccess,
    probeImgRef,
    showError,
    showImage,
    status,
  };
}

const FaviconBadge = React.forwardRef<HTMLSpanElement, FaviconBadgeProps>(
  function FaviconBadge(
    {
      website,
      label,
      faviconUrl,
      faviconSize = 64,
      size = "md",
      className,
      badgeClassName,
      labelClassName,
      onFaviconLoad,
      onFaviconError,
      ...props
    },
    ref
  ) {
    const overrideUrl = React.useMemo(
      () => faviconUrl?.trim() || undefined,
      [faviconUrl]
    );
    const domain = React.useMemo(() => extractDomain(website), [website]);

    const {
      handleImageError,
      handleImageLoad,
      imageSrc,
      isLoading,
      isSuccess,
      probeImgRef,
      showError,
      showImage,
      status,
    } = useFaviconResolver({
      domain,
      faviconSize,
      onFaviconError,
      onFaviconLoad,
      overrideUrl,
      website,
    });

    const config = sizeConfig[size];
    const accessibleLabel = label ?? domain ?? website;

    return (
      <span
        aria-busy={isLoading || undefined}
        className={cn(
          componentThemeClassName,
          "inline-flex items-center",
          label ? config.gap : undefined,
          className
        )}
        ref={ref}
        {...props}
      >
        <span
          aria-hidden
          className={cn(
            "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-[0.5px] border-border/60 bg-muted p-1",
            showError && "border-destructive/30",
            config.badge,
            badgeClassName
          )}
          data-favicon-status={status}
        >
          {showImage && imageSrc ? (
            <>
              {/* biome-ignore lint/performance/noImgElement: external favicon URLs are resolved at runtime and must stay framework-agnostic. */}
              <motion.img
                alt=""
                animate={
                  isSuccess
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.96 }
                }
                className="relative z-[1] size-full rounded-full object-contain"
                decoding="async"
                height={config.icon}
                initial={false}
                key={imageSrc}
                onError={isLoading ? handleImageError : undefined}
                onLoad={isLoading ? handleImageLoad : undefined}
                ref={isLoading ? probeImgRef : undefined}
                referrerPolicy="no-referrer"
                src={imageSrc}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                width={config.icon}
              />
              {isLoading ? (
                <span
                  aria-hidden
                  className="absolute inset-0 z-[2] rounded-full bg-muted-foreground/15"
                >
                  <span className="block size-full animate-pulse rounded-full bg-muted-foreground/20" />
                </span>
              ) : null}
            </>
          ) : (
            <span
              className={cn(
                "flex size-full items-center justify-center",
                showError ? "text-muted-foreground/70" : "text-muted-foreground"
              )}
            >
              <Globe style={{ width: config.icon, height: config.icon }} />
            </span>
          )}
        </span>

        {label ? (
          <span
            className={cn(
              "font-medium text-foreground",
              config.label,
              labelClassName
            )}
          >
            {label}
          </span>
        ) : (
          <span className="sr-only">{accessibleLabel}</span>
        )}
      </span>
    );
  }
);

FaviconBadge.displayName = "FaviconBadge";

export {
  FaviconBadge,
  extractDomain,
  getFaviconCandidates,
  getFaviconUrl,
  isLikelyDefaultFavicon,
};
export default FaviconBadge;
