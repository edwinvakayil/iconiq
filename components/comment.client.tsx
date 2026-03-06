"use client";

import { useOpenPanel } from "@openpanel/nextjs";

import { ANALYTIC_EVENT } from "./analytics";

const CommentAnimationsDevLinkClient = () => {
  const op = useOpenPanel();

  return (
    <a
      className="inline-block underline underline-offset-3 transition-[decoration-color,color] duration-100 focus-within:outline-offset-0 hover:text-primary hover:decoration-primary focus-visible:text-primary focus-visible:outline-1 focus-visible:outline-primary"
      href="https://animations.dev/"
      onClick={() => op.track(ANALYTIC_EVENT.COMMENT_ANIMATION_DEV_LINK)}
      rel="noopener external"
      tabIndex={0}
      target="_blank"
    >
      animations.dev
    </a>
  );
};

const CommentButtonClient = () => {
  return null;
};

export { CommentAnimationsDevLinkClient, CommentButtonClient };
