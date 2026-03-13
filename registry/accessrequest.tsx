"use client";

import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface AccessRequest {
  id: string;
  name: string;
  username?: string;
  avatarColor: string;
  avatarEmoji: string;
}

const defaultRequests: AccessRequest[] = [
  {
    id: "1",
    name: "Louis Griffen",
    avatarColor: "hsl(270 60% 60%)",
    avatarEmoji: "👩🏽‍🦱",
  },
  {
    id: "2",
    name: "Peter Griffen",
    avatarColor: "hsl(350 60% 65%)",
    avatarEmoji: "👨🏽",
  },
  {
    id: "3",
    name: "Aditya Sur",
    username: "@adityaSur11",
    avatarColor: "hsl(50 80% 60%)",
    avatarEmoji: "😎",
  },
  {
    id: "4",
    name: "Chris Griffen",
    avatarColor: "hsl(90 60% 55%)",
    avatarEmoji: "👦🏼",
  },
];

export interface AccessRequestBannerProps {
  initialRequests?: AccessRequest[];
}

export function AccessRequestBanner({
  initialRequests = defaultRequests,
}: AccessRequestBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const [requests, setRequests] = useState<AccessRequest[]>(initialRequests);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const expandableRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (expandableRef.current) {
      setContentHeight(expandableRef.current.scrollHeight);
    }
  }, []);

  if (!visible || requests.length === 0) return null;

  const handleRemove = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      setRequests((r) => r.filter((req) => req.id !== id));
      setRemovingId(null);
    }, 300);
  };

  return (
    <div className="fixed top-6 left-1/2 z-50 w-full max-w-lg -translate-x-1/2">
      <div className="overflow-hidden rounded-2xl bg-banner shadow-banner transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]">
        {/* Collapsed header - always visible */}
        <div
          className="flex items-center gap-3 overflow-hidden px-4 transition-all duration-300"
          style={{
            opacity: expanded ? 0 : 1,
            maxHeight: expanded ? 0 : 64,
            padding: expanded ? "0 16px" : "12px 16px",
            transition:
              "opacity 0.25s ease, max-height 0.35s ease, padding 0.35s ease",
          }}
        >
          <div className="flex -space-x-3">
            {requests.slice(0, 2).map((r) => (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-banner text-lg"
                key={r.id}
                style={{ backgroundColor: r.avatarColor }}
              >
                {r.avatarEmoji}
              </div>
            ))}
            {requests.length > 2 && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-banner bg-destructive font-bold text-destructive-foreground text-xs">
                {requests.length - 2}
              </div>
            )}
          </div>
          <p className="flex-1 text-banner-foreground text-sm">
            <span className="font-medium text-banner-foreground">
              {requests[0].username ||
                `@${requests[0].name.split(" ")[0].toLowerCase()}`}
            </span>{" "}
            and{" "}
            <span className="font-medium text-banner-muted">
              {requests.length - 1} others
            </span>
            <br />
            <span className="text-banner-muted">requested access</span>
          </p>
          <button
            className="rounded-lg p-1.5 text-banner-muted transition-colors hover:text-banner-foreground"
            onClick={() => setExpanded(true)}
            type="button"
          >
            <ChevronDown size={20} />
          </button>
          <button
            className="rounded-lg p-1.5 text-banner-muted transition-colors hover:text-banner-foreground"
            onClick={() => setVisible(false)}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Expanded content */}
        <div
          className="overflow-hidden"
          ref={expandableRef}
          style={{
            maxHeight: expanded ? contentHeight + 40 : 0,
            opacity: expanded ? 1 : 0,
            transition:
              "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
          }}
        >
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-banner-foreground text-lg">
                Access Request
              </h3>
              <div className="flex gap-1">
                <button
                  className="rounded-lg p-1.5 text-banner-muted transition-colors hover:text-banner-foreground"
                  onClick={() => setExpanded(false)}
                  type="button"
                >
                  <ChevronUp size={20} />
                </button>
                <button
                  className="rounded-lg p-1.5 text-banner-muted transition-colors hover:text-banner-foreground"
                  onClick={() => setVisible(false)}
                  type="button"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="mb-2 h-px bg-banner-border" />
            <div className="space-y-1">
              {requests.map((r, i) => (
                <div
                  className="flex items-center gap-3 rounded-xl px-1 py-3"
                  key={r.id}
                  style={{
                    opacity: removingId === r.id ? 0 : 1,
                    transform:
                      removingId === r.id
                        ? "translateX(20px) scale(0.95)"
                        : "translateX(0) scale(1)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                    animationDelay: expanded ? `${i * 60}ms` : "0ms",
                  }}
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg"
                    style={{ backgroundColor: r.avatarColor }}
                  >
                    {r.avatarEmoji}
                  </div>
                  <span className="flex-1 font-medium text-banner-foreground text-sm">
                    {r.name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="rounded-full bg-banner-button px-4 py-1.5 font-medium text-banner-foreground text-xs transition-all duration-200 hover:scale-105 hover:bg-banner-button-hover active:scale-95"
                      onClick={() => handleRemove(r.id)}
                      type="button"
                    >
                      Approve
                    </button>
                    <button
                      className="rounded-full bg-banner-button px-4 py-1.5 font-medium text-banner-foreground text-xs transition-all duration-200 hover:scale-105 hover:bg-banner-button-hover active:scale-95"
                      onClick={() => handleRemove(r.id)}
                      type="button"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
