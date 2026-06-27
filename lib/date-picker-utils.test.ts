import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DEFAULT_DATE_PICKER_FORMAT,
  formatDatePickerLabel,
  getDatePickerFormValue,
  getDatePickerPanelPosition,
  getDatePickerPanelWidth,
  resolveDatePickerViewMonth,
} from "@/registry/date-picker";

const JUN_PATTERN = /Jun/;
const DAY_27_PATTERN = /27/;
const YEAR_2026_PATTERN = /2026/;

describe("getDatePickerPanelWidth", () => {
  it("returns width for each calendar size", () => {
    assert.equal(getDatePickerPanelWidth("sm"), 212);
    assert.equal(getDatePickerPanelWidth("md"), 240);
    assert.equal(getDatePickerPanelWidth("lg"), 282);
  });
});

describe("resolveDatePickerViewMonth", () => {
  it("prefers controlled value month", () => {
    const value = new Date(2026, 5, 15);
    const selected = new Date(2026, 0, 1);

    assert.equal(resolveDatePickerViewMonth(value, selected).getMonth(), 5);
  });

  it("falls back to selected month when value is undefined", () => {
    const selected = new Date(2026, 2, 10);

    assert.equal(resolveDatePickerViewMonth(undefined, selected).getMonth(), 2);
  });

  it("uses fallback month when value is cleared to null", () => {
    const fallback = new Date(2026, 8, 1);

    assert.equal(
      resolveDatePickerViewMonth(null, null, fallback).getMonth(),
      8
    );
  });
});

describe("formatDatePickerLabel", () => {
  it("formats with the default pattern", () => {
    const label = formatDatePickerLabel(
      new Date(2026, 5, 27),
      DEFAULT_DATE_PICKER_FORMAT
    );

    assert.match(label, JUN_PATTERN);
    assert.match(label, DAY_27_PATTERN);
    assert.match(label, YEAR_2026_PATTERN);
  });

  it("falls back when dateFormat is invalid", () => {
    const label = formatDatePickerLabel(
      new Date(2026, 5, 27),
      "not-a-real-format"
    );

    assert.match(label, JUN_PATTERN);
    assert.match(label, DAY_27_PATTERN);
  });
});

describe("getDatePickerFormValue", () => {
  it("uses a local yyyy-MM-dd value for forms", () => {
    assert.equal(getDatePickerFormValue(new Date(2026, 5, 27)), "2026-06-27");
  });
});

describe("getDatePickerPanelPosition", () => {
  it("places the panel below the trigger by default", () => {
    const position = getDatePickerPanelPosition({
      align: "start",
      panelHeight: 320,
      panelWidth: 240,
      side: "bottom",
      triggerRect: {
        bottom: 120,
        left: 40,
        right: 280,
        top: 80,
      },
      viewportHeight: 800,
      viewportWidth: 1024,
    });

    assert.equal(position.side, "bottom");
    assert.equal(position.top, 132);
    assert.equal(position.left, 40);
  });

  it("flips above when there is not enough space below", () => {
    const position = getDatePickerPanelPosition({
      align: "start",
      panelHeight: 320,
      panelWidth: 240,
      side: "bottom",
      triggerRect: {
        bottom: 760,
        left: 40,
        right: 280,
        top: 720,
      },
      viewportHeight: 800,
      viewportWidth: 1024,
    });

    assert.equal(position.side, "top");
    assert.equal(position.top, 388);
  });

  it("aligns to the trigger end", () => {
    const position = getDatePickerPanelPosition({
      align: "end",
      panelHeight: 320,
      panelWidth: 240,
      side: "bottom",
      triggerRect: {
        bottom: 120,
        left: 100,
        right: 500,
        top: 80,
      },
      viewportHeight: 800,
      viewportWidth: 1024,
    });

    assert.equal(position.left, 260);
  });

  it("clamps the panel inside the viewport", () => {
    const position = getDatePickerPanelPosition({
      align: "start",
      panelHeight: 320,
      panelWidth: 240,
      side: "bottom",
      triggerRect: {
        bottom: 120,
        left: -20,
        right: 220,
        top: 80,
      },
      viewportHeight: 800,
      viewportWidth: 1024,
    });

    assert.equal(position.left, 8);
  });

  it("does not flip sides before the panel has a measured height", () => {
    const position = getDatePickerPanelPosition({
      align: "start",
      panelHeight: 0,
      panelWidth: 240,
      side: "bottom",
      triggerRect: {
        bottom: 760,
        left: 40,
        right: 280,
        top: 720,
      },
      viewportHeight: 800,
      viewportWidth: 1024,
    });

    assert.equal(position.side, "bottom");
  });
});
