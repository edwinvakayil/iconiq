import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getStatusDotConfig,
  resolveStatusDotA11yProps,
  resolveStatusDotAccessibleName,
  resolveStatusDotLabel,
  statusDotSizeConfig,
  statusDotStateConfig,
  statusDotStates,
} from "@/registry/status-dot";

describe("getStatusDotConfig", () => {
  it("maps deployment states to tone, label, and default animation", () => {
    assert.deepEqual(getStatusDotConfig({ state: "QUEUED" }), {
      animate: false,
      colorVar: "var(--status-dot-queued)",
      defaultLabel: "Queued",
      tone: "neutral",
    });
    assert.deepEqual(getStatusDotConfig({ state: "BUILDING" }), {
      animate: true,
      colorVar: "var(--status-dot-warning)",
      defaultLabel: "Building",
      tone: "warning",
    });
    assert.deepEqual(getStatusDotConfig({ state: "READY" }), {
      animate: false,
      colorVar: "var(--status-dot-success)",
      defaultLabel: "Ready",
      tone: "success",
    });
    assert.deepEqual(getStatusDotConfig({ state: "CANCELED" }), {
      animate: false,
      colorVar: "var(--status-dot-canceled)",
      defaultLabel: "Canceled",
      tone: "neutral",
    });
  });

  it("lets animate override the state default", () => {
    assert.equal(
      getStatusDotConfig({ animate: true, state: "READY" }).animate,
      true
    );
    assert.equal(
      getStatusDotConfig({ animate: false, state: "BUILDING" }).animate,
      false
    );
  });

  it("resolves generic tones without a deployment state", () => {
    assert.deepEqual(getStatusDotConfig({ tone: "warning" }), {
      animate: false,
      colorVar: "var(--status-dot-warning)",
      defaultLabel: "Warning",
      tone: "warning",
    });
    assert.deepEqual(getStatusDotConfig({ tone: "active" }), {
      animate: true,
      colorVar: "var(--status-dot-active)",
      defaultLabel: "Active",
      tone: "active",
    });
  });
});

describe("resolveStatusDotAccessibleName", () => {
  it("falls back to the mapped label for empty overrides", () => {
    assert.equal(resolveStatusDotAccessibleName("Ready", ""), "Ready");
    assert.equal(
      resolveStatusDotAccessibleName("Ready", "Live in production"),
      "Live in production"
    );
  });
});

describe("resolveStatusDotLabel", () => {
  it("defaults to dot-only labels for screen readers", () => {
    assert.deepEqual(
      resolveStatusDotLabel({ defaultLabel: "Ready", showLabel: false }),
      {
        accessibleName: "Ready",
        displayLabel: null,
      }
    );
  });

  it("shows mapped labels when showLabel is enabled", () => {
    assert.deepEqual(
      resolveStatusDotLabel({ defaultLabel: "Building", showLabel: true }),
      {
        accessibleName: "Building",
        displayLabel: "Building",
      }
    );
  });

  it("uses the mapped label when showLabel is enabled with an empty override", () => {
    assert.deepEqual(
      resolveStatusDotLabel({
        defaultLabel: "Ready",
        label: "",
        showLabel: true,
      }),
      {
        accessibleName: "Ready",
        displayLabel: "Ready",
      }
    );
  });

  it("supports custom label overrides in both modes", () => {
    assert.deepEqual(
      resolveStatusDotLabel({
        defaultLabel: "Ready",
        label: "Live in production",
        showLabel: true,
      }),
      {
        accessibleName: "Live in production",
        displayLabel: "Live in production",
      }
    );
    assert.deepEqual(
      resolveStatusDotLabel({
        defaultLabel: "Ready",
        label: "Live in production",
        showLabel: false,
      }),
      {
        accessibleName: "Live in production",
        displayLabel: null,
      }
    );
  });
});

describe("resolveStatusDotA11yProps", () => {
  it("announces dot-only indicators as live status regions", () => {
    assert.deepEqual(
      resolveStatusDotA11yProps({
        accessibleName: "Building",
        showVisibleLabel: false,
      }),
      {
        "aria-label": "Building",
        "aria-live": "polite",
        role: "status",
      }
    );
  });

  it("keeps live status semantics when a visible label is shown", () => {
    assert.deepEqual(
      resolveStatusDotA11yProps({
        accessibleName: "Building",
        showVisibleLabel: true,
      }),
      {
        "aria-live": "polite",
        role: "status",
      }
    );
  });
});

describe("statusDotStates", () => {
  it("covers every deployment preset in state config", () => {
    assert.equal(statusDotStates.length, 5);
    for (const state of statusDotStates) {
      assert.ok(statusDotStateConfig[state]);
    }
  });
});

describe("statusDotSizeConfig", () => {
  it("maps every size option to scaled dimensions", () => {
    assert.equal(statusDotSizeConfig.sm.dot, 6);
    assert.equal(statusDotSizeConfig.md.dot, 8);
    assert.equal(statusDotSizeConfig.lg.dot, 10);
    assert.equal(Object.keys(statusDotSizeConfig).length, 3);
  });
});
