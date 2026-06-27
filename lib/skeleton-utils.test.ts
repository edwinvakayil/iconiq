import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getSkeletonVariantDuration,
  resolveSkeletonA11yProps,
  skeletonRoundedClasses,
} from "@/registry/skeleton";

describe("resolveSkeletonA11yProps", () => {
  it("hides decorative skeletons from assistive tech", () => {
    assert.deepEqual(resolveSkeletonA11yProps({ decorative: true }), {
      "aria-hidden": true,
    });
  });

  it("hides skeletons when label is explicitly null", () => {
    assert.deepEqual(
      resolveSkeletonA11yProps({ decorative: false, label: null }),
      {
        "aria-hidden": true,
      }
    );
  });

  it("announces standalone loading skeletons", () => {
    assert.deepEqual(resolveSkeletonA11yProps({ decorative: false }), {
      "aria-label": "Loading",
      "aria-live": "polite",
      role: "status",
    });
  });

  it("uses a custom label when provided", () => {
    assert.deepEqual(
      resolveSkeletonA11yProps({
        decorative: false,
        label: "Loading profile",
      }),
      {
        "aria-label": "Loading profile",
        "aria-live": "polite",
        role: "status",
      }
    );
  });

  it("uses a static placeholder label when animation is disabled", () => {
    assert.deepEqual(
      resolveSkeletonA11yProps({ animate: false, decorative: false }),
      {
        "aria-label": "Placeholder",
        "aria-live": "polite",
        role: "status",
      }
    );
  });
});

describe("getSkeletonVariantDuration", () => {
  it("returns variant-specific defaults when duration is omitted", () => {
    assert.equal(getSkeletonVariantDuration("shimmer"), 1.6);
    assert.equal(getSkeletonVariantDuration("fade"), 2.4);
  });

  it("respects an explicit duration override", () => {
    assert.equal(getSkeletonVariantDuration("fade", 4), 4);
  });
});

describe("skeletonRoundedClasses", () => {
  it("maps every rounded option to a tailwind class", () => {
    assert.equal(skeletonRoundedClasses.full, "rounded-full");
    assert.equal(Object.keys(skeletonRoundedClasses).length, 5);
  });
});
