"use client";

import { useState } from "react";

import { GridCornerDots } from "@/components/design/line-grid";
import {
  HomeShowcaseGrid,
  HomeShowcaseRow,
} from "@/components/home-showcase-grid";
import {
  COMMUNITY_TESTIMONIALS,
  type CommunityTestimonial,
} from "@/lib/community-testimonials";
import { cn } from "@/lib/utils";

const CARDS_PER_ROW = 3;
const WHITESPACE_REGEX = /\s+/;
const X_PROFILE_URL_REGEX =
  /^https?:\/\/(?:www\.)?(?:x|twitter)\.com\/@?([^/?#]+)/i;
const LEADING_AT_REGEX = /^@/;

function normalizeHandle(handle: string) {
  return handle.replace(LEADING_AT_REGEX, "");
}

/**
 * Accepts a direct image URL, or an X/Twitter profile link (e.g.
 * "https://x.com/evilrabbit_/photo") which is an HTML page — those are
 * resolved to the actual profile picture via unavatar.io.
 */
function resolveAvatarUrl(avatar?: string) {
  if (!avatar) {
    return;
  }

  const profileMatch = avatar.match(X_PROFILE_URL_REGEX);

  if (profileMatch) {
    return `https://unavatar.io/x/${profileMatch[1]}`;
  }

  return avatar;
}

function getInitials(name: string) {
  const parts = name.trim().split(WHITESPACE_REGEX);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : "";

  return `${first}${last}`.toUpperCase();
}

function VerifiedBadge() {
  return (
    <svg
      aria-label="Verified"
      className="size-4 shrink-0 fill-[#1d9bf0]"
      role="img"
      viewBox="0 0 24 24"
    >
      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
    </svg>
  );
}

function XSourceIcon() {
  return (
    <svg
      aria-label="Posted on X"
      className="size-4 fill-muted-foreground transition-colors group-hover/source:fill-foreground"
      role="img"
      viewBox="0 0 24 24"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TestimonialSource({
  source,
  sourceLink,
  handle,
}: {
  source?: CommunityTestimonial["source"];
  sourceLink?: string;
  handle: string;
}) {
  if (!source) {
    return null;
  }

  // No explicit link? Fall back to the author's profile on the source platform.
  const resolvedHref = sourceLink ?? `https://x.com/${normalizeHandle(handle)}`;

  return (
    <a
      className="group/source ml-auto shrink-0 cursor-pointer self-center"
      href={resolvedHref}
      rel="noopener noreferrer"
      target="_blank"
    >
      <XSourceIcon />
      <span className="sr-only">Open on X</span>
    </a>
  );
}

function TestimonialAvatar({
  name,
  avatar,
}: {
  name: string;
  avatar?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (avatar && !failed) {
    return (
      // biome-ignore lint/performance/noImgElement: avatars come from arbitrary external hosts.
      <img
        alt=""
        className="size-10 shrink-0 select-none rounded-full border border-border/60 object-cover"
        height={40}
        onError={() => setFailed(true)}
        src={avatar}
        width={40}
      />
    );
  }

  return (
    <span
      aria-hidden
      className="flex size-10 shrink-0 select-none items-center justify-center rounded-full border border-border bg-muted font-semibold text-muted-foreground text-xs uppercase tracking-[0.08em]"
    >
      {getInitials(name)}
    </span>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: CommunityTestimonial;
}) {
  return (
    <div className="relative col-span-full min-w-0 border-border border-r border-b bg-background md:col-span-4">
      <GridCornerDots className="z-3 md:hidden" columns={1} rows={1} />
      <div className="flex h-full flex-col gap-3.5 p-5 md:p-6">
        <div className="flex items-center gap-3">
          <TestimonialAvatar
            avatar={resolveAvatarUrl(testimonial.avatar)}
            name={testimonial.name}
          />
          <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <span className="flex items-center gap-1 font-semibold text-foreground text-sm">
              {testimonial.name}
              {testimonial.verified ? <VerifiedBadge /> : null}
            </span>
            <span className="truncate text-muted-foreground text-sm">
              @{normalizeHandle(testimonial.handle)}
            </span>
          </div>
          <TestimonialSource
            handle={testimonial.handle}
            source={testimonial.source}
            sourceLink={testimonial.sourceLink}
          />
        </div>
        <p className="text-[15px] text-foreground leading-relaxed">
          {testimonial.text}
        </p>
      </div>
    </div>
  );
}

function chunkTestimonials(items: CommunityTestimonial[]) {
  const rows: CommunityTestimonial[][] = [];

  for (let index = 0; index < items.length; index += CARDS_PER_ROW) {
    rows.push(items.slice(index, index + CARDS_PER_ROW));
  }

  return rows;
}

export function HomeCommunityVoices({ className }: { className?: string }) {
  const rows = chunkTestimonials(COMMUNITY_TESTIMONIALS);

  if (rows.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="home-community-voices-heading"
      className={cn("isolate mt-24 overflow-visible sm:mt-32", className)}
    >
      <h3
        className="max-w-[18ch] font-light text-[clamp(0.9rem,3.4vw,1.85rem)] text-foreground tracking-[-0.07em] sm:max-w-none sm:whitespace-nowrap"
        id="home-community-voices-heading"
      >
        Community Voices
      </h3>

      <HomeShowcaseGrid className="mt-8 sm:mt-10">
        {rows.map((row) => (
          <HomeShowcaseRow
            columnWeights={row.map(() => 4)}
            key={row[0]?.id ?? "row"}
          >
            {row.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </HomeShowcaseRow>
        ))}
      </HomeShowcaseGrid>
    </section>
  );
}
