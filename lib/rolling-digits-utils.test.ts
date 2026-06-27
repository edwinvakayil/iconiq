import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildRollingDigitCells,
  formatRollingDigitsValue,
} from "@/registry/rolling-digits";

const USD_CURRENCY_PATTERN = /\$1,250/;

describe("formatRollingDigitsValue", () => {
  it("pads raw digits before formatting", () => {
    assert.equal(formatRollingDigitsValue(5, { pad: 3 }), "005");
  });

  it("uses minimumIntegerDigits when pad and locale are combined", () => {
    const formatted = formatRollingDigitsValue(1000, {
      pad: 5,
      locale: "en-US",
    });

    assert.equal(formatted, "01,000");
  });

  it("formats with a locale tag", () => {
    const formatted = formatRollingDigitsValue(1234.6, {
      locale: "de-DE",
    });

    assert.equal(formatted, "1.235");
  });

  it("formats with Intl.NumberFormat options", () => {
    const formatted = formatRollingDigitsValue(1250, {
      locale: {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      },
    });

    assert.match(formatted, USD_CURRENCY_PATTERN);
  });

  it("lets custom formatters override locale", () => {
    assert.equal(
      formatRollingDigitsValue(42, {
        locale: true,
        format: (next) => `${next}%`,
      }),
      "42%"
    );
  });

  it("falls back to zero for non-finite values", () => {
    assert.equal(formatRollingDigitsValue(Number.NaN, {}), "0");
    assert.equal(formatRollingDigitsValue(Number.POSITIVE_INFINITY, {}), "0");
  });

  it("ignores invalid pad values", () => {
    assert.equal(formatRollingDigitsValue(7, { pad: -2 }), "7");
    assert.equal(formatRollingDigitsValue(7, { pad: 0 }), "7");
  });

  it("falls back when custom formatters return empty strings", () => {
    assert.equal(
      formatRollingDigitsValue(12, {
        format: () => "",
      }),
      "12"
    );
  });

  it("falls back when custom formatters throw", () => {
    assert.equal(
      formatRollingDigitsValue(12, {
        format: () => {
          throw new Error("format failed");
        },
      }),
      "12"
    );
  });

  it("formats negative numbers with padding", () => {
    assert.equal(formatRollingDigitsValue(-7, { pad: 3 }), "-007");
  });
});

describe("buildRollingDigitCells", () => {
  it("assigns stable right-aligned keys to digits", () => {
    const first = buildRollingDigitCells("09");
    const second = buildRollingDigitCells("10");

    assert.deepEqual(
      first.map((cell) => [cell.key, cell.char]),
      [
        ["digit-r1", "0"],
        ["digit-r0", "9"],
      ]
    );
    assert.deepEqual(
      second.map((cell) => [cell.key, cell.char]),
      [
        ["digit-r1", "1"],
        ["digit-r0", "0"],
      ]
    );
  });

  it("anchors separator keys to the digit group on the right", () => {
    const cells = buildRollingDigitCells("1,000");

    assert.deepEqual(
      cells.map((cell) => [cell.key, cell.isDigit]),
      [
        ["digit-r3", true],
        ["sep-r2", false],
        ["digit-r2", true],
        ["digit-r1", true],
        ["digit-r0", true],
      ]
    );
  });

  it("keeps separator keys stable when digit count grows", () => {
    const compact = buildRollingDigitCells("999");
    const grouped = buildRollingDigitCells("1,000");

    assert.equal(compact.find((cell) => cell.key === "digit-r0")?.char, "9");
    assert.equal(grouped.find((cell) => cell.key === "digit-r0")?.char, "0");
    assert.equal(
      grouped.some((cell) => cell.key === "sep-r2"),
      true
    );
  });

  it("handles currency strings with symbol prefixes", () => {
    const cells = buildRollingDigitCells("$1,250");

    assert.deepEqual(
      cells.map((cell) => [cell.key, cell.char, cell.isDigit]),
      [
        ["sep-l0", "$", false],
        ["digit-r3", "1", true],
        ["sep-r2", ",", false],
        ["digit-r2", "2", true],
        ["digit-r1", "5", true],
        ["digit-r0", "0", true],
      ]
    );
  });

  it("falls back to a zero digit for empty strings", () => {
    assert.deepEqual(buildRollingDigitCells(""), [
      { key: "digit-r0", char: "0", isDigit: true },
    ]);
  });
});
