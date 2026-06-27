import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  type ChartConfig,
  getChartAnimationTimeoutMs,
  getChartLegendLabel,
  getChartLegendSwatchColor,
  getChartSeriesKey,
  getPayloadConfigFromPayload,
} from "@/registry/charts";

const chartConfig = {
  sessions: {
    label: "Sessions",
    color: "var(--chart-1)",
  },
  conversions: {
    label: "Conversions",
    color: "var(--chart-2)",
  },
  organic: {
    label: "Organic",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

describe("getPayloadConfigFromPayload", () => {
  it("returns config entry by data key", () => {
    const payload = { dataKey: "sessions", value: 120 };

    assert.equal(
      getPayloadConfigFromPayload(chartConfig, payload, "sessions"),
      chartConfig.sessions
    );
  });

  it("resolves nested payload label keys", () => {
    const payload = {
      dataKey: "metric",
      payload: { metric: "sessions" },
    };

    assert.equal(
      getPayloadConfigFromPayload(chartConfig, payload, "metric"),
      chartConfig.sessions
    );
  });

  it("returns undefined for invalid payload", () => {
    assert.equal(
      getPayloadConfigFromPayload(chartConfig, null, "sessions"),
      undefined
    );
  });
});

describe("getChartSeriesKey", () => {
  it("uses nameKey field value when provided", () => {
    assert.equal(
      getChartSeriesKey(
        {
          dataKey: "value",
          payload: { channel: "organic" },
          value: 42,
        },
        "channel"
      ),
      "organic"
    );
  });

  it("falls back to dataKey", () => {
    assert.equal(getChartSeriesKey({ dataKey: "sessions" }), "sessions");
  });
});

describe("getChartLegendLabel", () => {
  it("uses config label first", () => {
    assert.equal(
      getChartLegendLabel(
        { dataKey: "sessions", value: "ignored" },
        {
          label: "Sessions",
          color: "red",
        }
      ),
      "Sessions"
    );
  });

  it("falls back to item name", () => {
    assert.equal(
      getChartLegendLabel({ name: "Sessions" }, undefined),
      "Sessions"
    );
  });

  it("falls back to string item value", () => {
    assert.equal(
      getChartLegendLabel({ value: "organic" }, undefined),
      "organic"
    );
  });
});

describe("getChartLegendSwatchColor", () => {
  it("returns scoped css variable when config exists", () => {
    assert.equal(
      getChartLegendSwatchColor("sessions", chartConfig.sessions, "#111"),
      "var(--color-sessions)"
    );
  });

  it("falls back to series color", () => {
    assert.equal(
      getChartLegendSwatchColor("unknown", undefined, "#123456"),
      "#123456"
    );
  });
});

describe("getChartAnimationTimeoutMs", () => {
  it("scales with series count", () => {
    assert.equal(getChartAnimationTimeoutMs(1), 480);
    assert.equal(getChartAnimationTimeoutMs(3), 544);
    assert.equal(getChartAnimationTimeoutMs(5), 608);
  });

  it("never returns less than one series worth of duration", () => {
    assert.equal(getChartAnimationTimeoutMs(0), 480);
  });
});
