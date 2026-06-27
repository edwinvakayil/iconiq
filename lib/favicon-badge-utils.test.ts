import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  extractDomain,
  getFaviconCandidates,
  getFaviconUrl,
  isLikelyDefaultFavicon,
} from "@/registry/favicon-badge";

const GOOGLE_DOMAIN_URL_RE = /google\.com\/s2\/favicons\?domain_url=/;
const GOOGLE_DOMAIN_RE = /google\.com\/s2\/favicons\?domain=/;
const DUCKDUCKGO_CANDIDATE_RE = /duckduckgo\.com\/ip3\/example\.com\.ico/;
const FAVICON_SIZE_128_RE = /sz=128/;

describe("extractDomain", () => {
  it("normalizes bare domains", () => {
    assert.equal(extractDomain("iconiqui.com"), "iconiqui.com");
  });

  it("strips www and protocol from full URLs", () => {
    assert.equal(extractDomain("https://www.github.com/repo"), "github.com");
  });

  it("returns null for empty or invalid hostnames", () => {
    assert.equal(extractDomain(""), null);
    assert.equal(extractDomain("   "), null);
    assert.equal(extractDomain("localhost"), null);
    assert.equal(extractDomain("not-a-domain"), null);
  });
});

describe("getFaviconCandidates", () => {
  it("returns Google and DuckDuckGo providers in order", () => {
    const candidates = getFaviconCandidates("example.com", 64);

    assert.equal(candidates.length, 3);
    assert.match(candidates[0], GOOGLE_DOMAIN_URL_RE);
    assert.match(candidates[1], GOOGLE_DOMAIN_RE);
    assert.match(candidates[2], DUCKDUCKGO_CANDIDATE_RE);
  });

  it("includes the requested favicon size in Google URLs", () => {
    const [primary] = getFaviconCandidates("example.com", 128);

    assert.match(primary, FAVICON_SIZE_128_RE);
  });
});

describe("getFaviconUrl", () => {
  it("returns the first candidate URL", () => {
    const [primary] = getFaviconCandidates("example.com");

    assert.equal(getFaviconUrl("example.com"), primary);
  });
});

describe("isLikelyDefaultFavicon", () => {
  it("flags tiny Google placeholder icons", () => {
    const image = {
      naturalWidth: 16,
      naturalHeight: 16,
    } as HTMLImageElement;

    assert.equal(
      isLikelyDefaultFavicon(
        "https://www.google.com/s2/favicons?domain=missing.test&sz=64",
        image
      ),
      true
    );
  });

  it("accepts larger Google responses", () => {
    const image = {
      naturalWidth: 32,
      naturalHeight: 32,
    } as HTMLImageElement;

    assert.equal(
      isLikelyDefaultFavicon(
        "https://www.google.com/s2/favicons?domain=example.com&sz=64",
        image
      ),
      false
    );
  });

  it("ignores non-Google providers", () => {
    const image = {
      naturalWidth: 16,
      naturalHeight: 16,
    } as HTMLImageElement;

    assert.equal(
      isLikelyDefaultFavicon(
        "https://icons.duckduckgo.com/ip3/example.com.ico",
        image
      ),
      false
    );
  });
});
