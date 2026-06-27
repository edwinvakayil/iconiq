import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildTimeLabelCells,
  formatTimezoneTime,
  getTimezoneAbbreviation,
  resetTimezoneIndexForTests,
  resolveTimezone,
  resolveTimezoneAriaLive,
  shouldDigitRollUp,
} from "@/registry/timezone";

const PST_SUFFIX_PATTERN = /PST$/;
const ASCII_TIME_PATTERN = /^\d{1,2}:\d{2}$/;

describe("resolveTimezone", () => {
  it("resolves curated aliases and typo-tolerant city names", () => {
    assert.equal(resolveTimezone("San Francisco"), "America/Los_Angeles");
    assert.equal(resolveTimezone("san fransisco"), "America/Los_Angeles");
    assert.equal(resolveTimezone("NYC"), "America/New_York");
    assert.equal(resolveTimezone("india"), "Asia/Kolkata");
    assert.equal(resolveTimezone("gmt"), "UTC");
  });

  it("resolves IANA paths and city slugs", () => {
    assert.equal(resolveTimezone("Africa/Cairo"), "Africa/Cairo");
    assert.equal(resolveTimezone("cairo"), "Africa/Cairo");
    assert.equal(resolveTimezone("Europe/London"), "Europe/London");
  });

  it("returns null for empty or unknown zones", () => {
    assert.equal(resolveTimezone(""), null);
    assert.equal(resolveTimezone("   "), null);
    assert.equal(resolveTimezone("Not/A_Real_Zone"), null);
  });
});

describe("shouldDigitRollUp", () => {
  it("rolls up on normal increments and 9 to 0 wraps", () => {
    assert.equal(shouldDigitRollUp("1", "2"), true);
    assert.equal(shouldDigitRollUp("9", "0"), true);
    assert.equal(shouldDigitRollUp("2", "1"), false);
  });
});

describe("resolveTimezoneAriaLive", () => {
  it("defaults to polite for minute clocks and off for live clocks", () => {
    assert.equal(resolveTimezoneAriaLive(undefined, false), "polite");
    assert.equal(resolveTimezoneAriaLive(undefined, true), undefined);
  });

  it("honors explicit aria-live overrides", () => {
    assert.equal(resolveTimezoneAriaLive(true, true), "polite");
    assert.equal(resolveTimezoneAriaLive("assertive", false), "assertive");
    assert.equal(resolveTimezoneAriaLive(false, false), undefined);
    assert.equal(resolveTimezoneAriaLive("off", false), undefined);
  });
});

describe("buildTimeLabelCells", () => {
  it("uses stable digit and colon keys across value changes", () => {
    const before = buildTimeLabelCells("9:05 AM");
    const after = buildTimeLabelCells("10:05 AM");

    assert.deepEqual(
      before.filter((cell) => cell.kind === "digit").map((cell) => cell.key),
      ["digit-2", "digit-1", "digit-0"]
    );
    assert.deepEqual(
      after.filter((cell) => cell.kind === "digit").map((cell) => cell.key),
      ["digit-3", "digit-2", "digit-1", "digit-0"]
    );
    assert.equal(before.find((cell) => cell.kind === "colon")?.key, "colon-0");
    assert.equal(after.find((cell) => cell.kind === "colon")?.key, "colon-0");
  });
});

describe("getTimezoneAbbreviation", () => {
  it("returns daylight-aware abbreviations from the fallback table", () => {
    const winter = new Date("2026-01-15T18:00:00.000Z");
    const summer = new Date("2026-07-15T18:00:00.000Z");

    assert.equal(
      getTimezoneAbbreviation(winter, "America/Los_Angeles", "en-US"),
      "PST"
    );
    assert.equal(
      getTimezoneAbbreviation(summer, "America/Los_Angeles", "en-US"),
      "PDT"
    );
    assert.equal(
      getTimezoneAbbreviation(winter, "Asia/Kolkata", "en-US"),
      "IST"
    );
  });
});

describe("formatTimezoneTime", () => {
  it("appends zone labels when requested", () => {
    const date = new Date("2026-01-15T18:00:00.000Z");

    const withAbbreviation = formatTimezoneTime({
      date,
      format: "12h",
      live: false,
      locale: "en-US",
      showZoneLabel: true,
      timeZone: "America/Los_Angeles",
      zoneName: "abbreviation",
    });

    assert.match(withAbbreviation, PST_SUFFIX_PATTERN);

    const withoutLabel = formatTimezoneTime({
      date,
      format: "24h",
      live: false,
      locale: "en-US",
      showZoneLabel: false,
      timeZone: "America/Los_Angeles",
      zoneName: "abbreviation",
    });

    assert.doesNotMatch(withoutLabel, PST_SUFFIX_PATTERN);
  });

  it("uses latin digits for locales that default to other numbering systems", () => {
    const date = new Date("2026-01-15T18:00:00.000Z");
    const label = formatTimezoneTime({
      date,
      format: "24h",
      live: false,
      locale: "ja-JP",
      showZoneLabel: false,
      timeZone: "Asia/Tokyo",
      zoneName: "abbreviation",
    });

    assert.match(label, ASCII_TIME_PATTERN);
  });
});

describe("resetTimezoneIndexForTests", () => {
  it("rebuilds the timezone index after reset", () => {
    resetTimezoneIndexForTests();
    assert.equal(resolveTimezone("Tokyo"), "Asia/Tokyo");
    resetTimezoneIndexForTests();
    assert.equal(resolveTimezone("Tokyo"), "Asia/Tokyo");
  });
});
