import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  resolveVerifiedBadgeA11yProps,
  resolveVerifiedBadgePixelSize,
  resolveVerifiedBadgeStrokeWidth,
  shouldRenderVerifiedBadgeShimmer,
} from "@/registry/verified-badge";

describe("resolveVerifiedBadgePixelSize", () => {
  it("maps size presets to pixel values", () => {
    assert.equal(resolveVerifiedBadgePixelSize("sm"), 18);
    assert.equal(resolveVerifiedBadgePixelSize("md"), 22);
    assert.equal(resolveVerifiedBadgePixelSize("lg"), 28);
  });

  it("returns explicit numeric sizes unchanged", () => {
    assert.equal(resolveVerifiedBadgePixelSize(32), 32);
  });

  it("defaults to medium when omitted", () => {
    assert.equal(resolveVerifiedBadgePixelSize(), 22);
  });

  it("falls back to medium for invalid numeric sizes", () => {
    assert.equal(resolveVerifiedBadgePixelSize(0), 22);
    assert.equal(resolveVerifiedBadgePixelSize(-4), 22);
    assert.equal(resolveVerifiedBadgePixelSize(Number.NaN), 22);
    assert.equal(resolveVerifiedBadgePixelSize(Number.POSITIVE_INFINITY), 22);
  });
});

describe("resolveVerifiedBadgeStrokeWidth", () => {
  it("scales stroke width with badge size within bounds", () => {
    assert.equal(resolveVerifiedBadgeStrokeWidth(18), 2.88);
    assert.equal(resolveVerifiedBadgeStrokeWidth(22), 3.52);
    assert.equal(resolveVerifiedBadgeStrokeWidth(8), 2);
    assert.equal(resolveVerifiedBadgeStrokeWidth(64), 4);
  });
});

describe("resolveVerifiedBadgeA11yProps", () => {
  it("returns img semantics by default", () => {
    assert.deepEqual(resolveVerifiedBadgeA11yProps({}), {
      "aria-label": "Verified",
      role: "img",
    });
  });

  it("hides decorative badges from assistive tech", () => {
    assert.deepEqual(resolveVerifiedBadgeA11yProps({ decorative: true }), {
      "aria-hidden": true,
    });
  });

  it("honors custom aria labels", () => {
    assert.deepEqual(
      resolveVerifiedBadgeA11yProps({ ariaLabel: "Official account" }),
      {
        "aria-label": "Official account",
        role: "img",
      }
    );
  });
});

describe("shouldRenderVerifiedBadgeShimmer", () => {
  it("renders shimmer only after mount when motion is allowed", () => {
    assert.equal(
      shouldRenderVerifiedBadgeShimmer({
        mounted: false,
        prefersReducedMotion: false,
        variant: "shimmer",
      }),
      false
    );
    assert.equal(
      shouldRenderVerifiedBadgeShimmer({
        mounted: true,
        prefersReducedMotion: false,
        variant: "shimmer",
      }),
      true
    );
    assert.equal(
      shouldRenderVerifiedBadgeShimmer({
        mounted: true,
        prefersReducedMotion: true,
        variant: "shimmer",
      }),
      false
    );
    assert.equal(
      shouldRenderVerifiedBadgeShimmer({
        mounted: true,
        prefersReducedMotion: null,
        variant: "shimmer",
      }),
      true
    );
    assert.equal(
      shouldRenderVerifiedBadgeShimmer({
        mounted: true,
        prefersReducedMotion: false,
        variant: "static",
      }),
      false
    );
  });
});
