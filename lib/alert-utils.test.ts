import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  getAlertConfig,
  getAlertToastStackIndex,
  resolveAlertToastStackOffset,
  resolveAlertWidth,
} from "@/registry/alert";

describe("resolveAlertWidth", () => {
  it("returns preset inline widths by size", () => {
    assert.deepEqual(resolveAlertWidth({ size: "sm", variant: "inline" }), {
      className: "max-w-[320px]",
    });
    assert.deepEqual(resolveAlertWidth({ size: "lg", variant: "inline" }), {
      className: "max-w-[480px]",
    });
  });

  it("returns responsive toast widths by size", () => {
    assert.deepEqual(resolveAlertWidth({ size: "md", variant: "toast" }), {
      className: "max-w-full sm:max-w-[400px]",
    });
  });

  it("honors numeric custom widths", () => {
    assert.deepEqual(
      resolveAlertWidth({ size: "md", variant: "inline", width: 440 }),
      {
        className: "max-w-full",
        style: { maxWidth: "440px" },
      }
    );
  });

  it("honors string custom widths", () => {
    assert.deepEqual(
      resolveAlertWidth({ size: "md", variant: "toast", width: "28rem" }),
      {
        className: "max-w-full",
        style: { maxWidth: "28rem" },
      }
    );
  });

  it("falls back to preset width for invalid numeric widths", () => {
    assert.deepEqual(
      resolveAlertWidth({ size: "xl", variant: "inline", width: 0 }),
      {
        className: "max-w-[560px]",
      }
    );
  });
});

describe("getAlertConfig", () => {
  it("keeps compound inline alerts static by default", () => {
    assert.deepEqual(
      getAlertConfig({
        hasCompoundChildren: true,
        variant: "inline",
      }),
      {
        resolvedDismissible: false,
        resolvedPosition: undefined,
        resolvedTimeout: 0,
        resolvedVariant: "inline",
      }
    );
  });

  it("defaults toast alerts to dismissible with timeout", () => {
    assert.deepEqual(
      getAlertConfig({
        hasCompoundChildren: true,
        position: "bottom-center",
      }),
      {
        resolvedDismissible: true,
        resolvedPosition: "bottom-center",
        resolvedTimeout: 5000,
        resolvedVariant: "toast",
      }
    );
  });

  it("defaults legacy prop alerts to dismissible with timeout", () => {
    assert.deepEqual(
      getAlertConfig({
        hasCompoundChildren: false,
      }),
      {
        resolvedDismissible: true,
        resolvedPosition: undefined,
        resolvedTimeout: 5000,
        resolvedVariant: "inline",
      }
    );
  });

  it("respects explicit dismissible and timeout overrides", () => {
    assert.deepEqual(
      getAlertConfig({
        dismissible: true,
        hasCompoundChildren: true,
        timeout: 0,
        variant: "inline",
      }),
      {
        resolvedDismissible: true,
        resolvedPosition: undefined,
        resolvedTimeout: 0,
        resolvedVariant: "inline",
      }
    );
  });
});

describe("getAlertToastStackIndex", () => {
  it("returns the index for the same corner only", () => {
    const registry = [
      { id: "a", position: "top-right" as const },
      { id: "b", position: "top-left" as const },
      { id: "c", position: "top-right" as const },
    ];

    assert.equal(getAlertToastStackIndex("a", "top-right", registry), 0);
    assert.equal(getAlertToastStackIndex("c", "top-right", registry), 1);
    assert.equal(getAlertToastStackIndex("b", "top-left", registry), 0);
  });
});

describe("resolveAlertToastStackOffset", () => {
  it("returns no offset for the first toast", () => {
    assert.deepEqual(
      resolveAlertToastStackOffset({
        position: "top-right",
        stackIndex: 0,
      }),
      {}
    );
  });

  it("offsets top and bottom corners independently", () => {
    assert.deepEqual(
      resolveAlertToastStackOffset({
        position: "top-right",
        stackIndex: 2,
      }),
      { top: "calc(1rem + 168px)" }
    );
    assert.deepEqual(
      resolveAlertToastStackOffset({
        position: "bottom-left",
        stackIndex: 1,
      }),
      { bottom: "calc(1rem + 84px)" }
    );
  });
});
