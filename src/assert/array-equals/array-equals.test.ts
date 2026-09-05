import { describe, expect, expectTypeOf, it } from "vitest";
import { assertArrayEquals } from "./array-equals.assert.js";
import { assertNotEqual } from "../not-equal/not-equal.assert.js";

describe("array-equals", () => {
  it("does not throw when arrays are equal", () => {
    expect(() => {
      assertArrayEquals(["C", "B"], ["C", "B"]);
    }).not.toThrow();
  });

  it("does not throw when nested arrays are equal by value", () => {
    const rows: unknown = [
      ["a", "b"],
      ["c", "d"],
    ];

    expect(() => {
      assertArrayEquals(rows, [
        ["a", "b"],
        ["c", "d"],
      ]);
    }).not.toThrow();
  });

  it("does not throw when member objects are equal by value", () => {
    expect(() => {
      assertArrayEquals([{ id: 1 }], [{ id: 1 }]);
    }).not.toThrow();
  });

  it("throws when arrays have different values", () => {
    expect(() => {
      assertArrayEquals(["C", "B"], ["C", "A"]);
    }).toThrow(
      'Expected array ["C","B"] (len 2) to equal array ["C","A"] (len 2). Mismatch at $[1]: expected "A", got "B".',
    );
  });

  it("throws when a nested member differs, naming the path", () => {
    expect(() => {
      assertArrayEquals(
        [
          ["a", "b"],
          ["c", "d"],
        ],
        [
          ["a", "b"],
          ["c", "X"],
        ],
      );
    }).toThrow('Mismatch at $[1][1]: expected "X", got "d".');
  });

  it("throws when a member object has an extra key", () => {
    expect(() => {
      assertArrayEquals([{ id: 1, name: "Ada" }], [{ id: 1 }]);
    }).toThrow("Mismatch at $[0]");
  });

  it("throws when arrays have different lengths", () => {
    expect(() => {
      assertArrayEquals([1, 2, 3], [1, 2]);
    }).toThrow(
      "Expected array [1,2,3] (len 3) to equal array [1,2] (len 2). Mismatch at $.length: expected 2, got 3.",
    );
  });

  it("throws when value is not an array", () => {
    expect(() => {
      assertArrayEquals("not an array", ["not an array"]);
    }).toThrow(
      'Expected string "not an array" to equal array ["not an array"]',
    );
  });

  it("is the exact negation of assertNotEqual", () => {
    const pairs: readonly (readonly [unknown, readonly unknown[]])[] = [
      [
        ["C", "B"],
        ["C", "B"],
      ],
      [
        ["C", "B"],
        ["C", "A"],
      ],
      [
        [
          ["a", "b"],
          ["c", "d"],
        ],
        [
          ["a", "b"],
          ["c", "d"],
        ],
      ],
      [[{ id: 1 }], [{ id: 1 }]],
      [[{ id: 1, name: "Ada" }], [{ id: 1 }]],
      [
        [1, 2, 3],
        [1, 2],
      ],
      ["not an array", ["not an array"]],
    ];

    for (const [actual, expected] of pairs) {
      expect(
        throws(() => {
          assertArrayEquals(actual, expected);
        }),
      ).toBe(
        !throws(() => {
          assertNotEqual(actual, expected);
        }),
      );
    }
  });

  it("throws with custom message", () => {
    expect(() => {
      assertArrayEquals([1, 2, 3], [1, 2, 4], "Custom error message");
    }).toThrow("Custom error message");
  });

  it("narrows to the expected tuple type", () => {
    const value: unknown = ["admin", "editor"];

    assertArrayEquals(value, ["admin", "editor"]);

    expectTypeOf(value).toEqualTypeOf<readonly ["admin", "editor"]>();
  });
});

function throws(run: () => void): boolean {
  try {
    run();

    return false;
  } catch {
    return true;
  }
}
