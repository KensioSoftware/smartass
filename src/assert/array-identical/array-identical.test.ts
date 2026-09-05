import { describe, expect, expectTypeOf, it } from "vitest";
import { assertArrayIdentical } from "./array-identical.assert.js";

describe("array-identical", () => {
  it("does not throw when primitive members are equal", () => {
    expect(() => {
      assertArrayIdentical(["C", "B"], ["C", "B"]);
    }).not.toThrow();
  });

  it("does not throw when member objects are the same reference", () => {
    const object = { id: 1 };

    expect(() => {
      assertArrayIdentical([object], [object]);
    }).not.toThrow();
  });

  it("throws when member objects are equal but distinct references", () => {
    expect(() => {
      assertArrayIdentical([{ id: 1 }], [{ id: 1 }]);
    }).toThrow(
      'Expected array [{"id":1}] (len 1) to be identical to array [{"id":1}] (len 1).',
    );
  });

  it("throws when nested arrays are equal but distinct references", () => {
    expect(() => {
      assertArrayIdentical([["a"]], [["a"]]);
    }).toThrow(
      'Expected array [["a"]] (len 1) to be identical to array [["a"]] (len 1).',
    );
  });

  it("throws when arrays have different values", () => {
    expect(() => {
      assertArrayIdentical(["C", "B"], ["C", "A"]);
    }).toThrow(
      'Expected array ["C","B"] (len 2) to be identical to array ["C","A"] (len 2).',
    );
  });

  it("throws when arrays have different lengths", () => {
    expect(() => {
      assertArrayIdentical([1, 2, 3], [1, 2]);
    }).toThrow(
      "Expected array [1,2,3] (len 3) to be identical to array [1,2] (len 2).",
    );
  });

  it("throws when value is not an array", () => {
    expect(() => {
      assertArrayIdentical("not an array", ["not an array"]);
    }).toThrow(
      'Expected string "not an array" to be identical to array ["not an array"] (len 1).',
    );
  });

  it("throws with custom message", () => {
    expect(() => {
      assertArrayIdentical([1, 2, 3], [1, 2, 4], "Custom error message");
    }).toThrow("Custom error message");
  });

  it("narrows to the expected tuple type", () => {
    const value: unknown = ["admin", "editor"];

    assertArrayIdentical(value, ["admin", "editor"]);

    expectTypeOf(value).toEqualTypeOf<readonly ["admin", "editor"]>();
  });
});
