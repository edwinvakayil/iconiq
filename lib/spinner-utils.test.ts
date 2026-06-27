import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildMatrixCells,
  getMatrixDiagonalPhase,
  getMatrixGridSize,
  resolveSpinnerA11yProps,
  spinnerSizeClasses,
} from "@/registry/spinner";

describe("resolveSpinnerA11yProps", () => {
  it("announces standalone loading spinners by default", () => {
    assert.deepEqual(resolveSpinnerA11yProps({}), {
      "aria-label": "Loading",
      "aria-live": "polite",
      role: "status",
    });
  });

  it("hides decorative spinners from assistive tech", () => {
    assert.deepEqual(resolveSpinnerA11yProps({ decorative: true }), {
      "aria-hidden": true,
    });
  });
});

describe("spinnerSizeClasses", () => {
  it("maps every size option to scaled classes", () => {
    assert.equal(spinnerSizeClasses.sm.root, "size-4");
    assert.equal(spinnerSizeClasses.md.root, "size-6");
    assert.equal(spinnerSizeClasses.lg.root, "size-8");
    assert.equal(Object.keys(spinnerSizeClasses).length, 3);
  });
});

describe("getMatrixGridSize", () => {
  it("uses a fixed 5x5 matrix grid", () => {
    assert.equal(getMatrixGridSize(), 5);
  });
});

describe("getMatrixDiagonalPhase", () => {
  it("starts at the top-left and ends at the bottom-right", () => {
    assert.equal(getMatrixDiagonalPhase(0, 0, 5), 0);
    assert.ok(getMatrixDiagonalPhase(4, 4, 5) > 0.9);
  });

  it("keeps cells on the same diagonal closer in phase", () => {
    const upper = getMatrixDiagonalPhase(0, 2, 5);
    const lower = getMatrixDiagonalPhase(2, 0, 5);

    assert.equal(upper, lower);
  });
});

describe("buildMatrixCells", () => {
  it("creates one cell per grid position with phase values", () => {
    const cells = buildMatrixCells(5);

    assert.equal(cells.length, 25);
    assert.equal(cells[0]?.phase, 0);
    assert.ok((cells.at(-1)?.phase ?? 0) > 0.9);
  });
});
