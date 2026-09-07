import { describe, expect, it } from "vitest";
import { AssertionError } from "../assertion-error.js";
import { assertArrayEquals } from "../assert/array-equals/array-equals.assert.js";
import { assertNotEqual } from "../assert/not-equal/not-equal.assert.js";
import { assertObjectEquals } from "../assert/object-equals/object-equals.assert.js";
import { assertObjectMatches } from "../assert/object-matches/object-matches.assert.js";
import { assertSetEquals } from "../assert/set-equals/set-equals.assert.js";
import { typeNumber } from "../assert/type-number/type-number.match.js";

interface SelfObject {
  self?: SelfObject;
  n?: number;
}

function selfObject(n?: number): SelfObject {
  const value: SelfObject = n === undefined ? {} : { n };
  value.self = value;
  return value;
}

function selfArray(): unknown[] {
  const value: unknown[] = [];
  value.push(value);
  return value;
}

function selfSet(): Set<unknown> {
  const value = new Set<unknown>();
  value.add(value);
  return value;
}

describe("object-comparison cycles", () => {
  describe("values that refer back to themselves", () => {
    it("compares two self-referential objects as equal", () => {
      expect(() => {
        assertObjectEquals(selfObject(), selfObject());
      }).not.toThrow();
    });

    it("compares two self-referential arrays as equal", () => {
      expect(() => {
        assertArrayEquals(selfArray(), selfArray());
      }).not.toThrow();
    });

    it("compares two self-referential Sets as equal", () => {
      expect(() => {
        assertSetEquals(selfSet(), selfSet());
      }).not.toThrow();
    });

    it("compares two mutually recursive pairs as equal", () => {
      interface Node {
        name: string;
        other?: Node;
      }

      function pair(): Node {
        const first: Node = { name: "first" };
        const second: Node = { name: "second", other: first };
        first.other = second;
        return first;
      }

      expect(() => {
        assertObjectEquals(pair(), pair());
      }).not.toThrow();
    });

    it("compares cycles of different shape that unfold the same way as equal", () => {
      const short = selfObject();

      const inner: SelfObject = {};
      const long: SelfObject = { self: inner };
      inner.self = long;

      expect(() => {
        assertObjectEquals(short, long);
      }).not.toThrow();
    });

    it("applies matchers inside a cyclic value", () => {
      const value = selfObject(1);

      expect(() => {
        assertObjectMatches(value, { n: typeNumber() });
      }).not.toThrow();
    });
  });

  describe("cyclic values that differ", () => {
    it("reports a mismatch rather than running out of stack", () => {
      const error = captureError(() => {
        assertObjectEquals(selfObject(1), selfObject(2));
      });

      expect(error).toBeInstanceOf(AssertionError);
      expect(error?.message).toContain("Mismatch at $.n: expected 2, got 1.");
    });

    it("reports a cyclic value held against a finite one", () => {
      expect(() => {
        assertObjectEquals(selfObject(), { self: { self: null } });
      }).toThrow(AssertionError);
    });

    it("reports cycles that go round through different keys", () => {
      const self = selfObject();

      const next: Record<string, unknown> = {};
      next["next"] = next;

      expect(() => {
        assertObjectEquals(self, next);
      }).toThrow(AssertionError);
    });

    it("reports Sets whose cyclic members differ", () => {
      const actual = new Set<unknown>([1]);
      actual.add(actual);

      const expected = new Set<unknown>([2]);
      expected.add(expected);

      expect(() => {
        assertSetEquals(actual, expected);
      }).toThrow(AssertionError);
    });
  });

  describe("assertNotEqual", () => {
    it("throws on two cyclic values that compare equal", () => {
      expect(() => {
        assertNotEqual(selfObject(), selfObject());
      }).toThrow(AssertionError);
    });

    it("passes on two cyclic values that differ", () => {
      expect(() => {
        assertNotEqual(selfObject(1), selfObject(2));
      }).not.toThrow();
    });
  });

  describe("shared references that form no cycle", () => {
    it("compares a repeated sibling each time it is reached", () => {
      const shared = { a: 1 };

      expect(() => {
        assertObjectEquals(
          { x: shared, y: shared },
          { x: { a: 1 }, y: { a: 1 } },
        );
      }).not.toThrow();
    });

    it("still reports the second reach of a repeated sibling", () => {
      const shared = { a: 1 };

      expect(() => {
        assertObjectEquals(
          { x: shared, y: shared },
          { x: { a: 1 }, y: { a: 2 } },
        );
      }).toThrow("Mismatch at $.y.a: expected 2, got 1.");
    });

    it("compares one value against two different expected values", () => {
      const shared = { a: 1 };

      expect(() => {
        assertArrayEquals([shared, shared], [{ a: 1 }, { a: 1 }]);
      }).not.toThrow();
    });
  });
});

function captureError(run: () => void): Error | undefined {
  try {
    run();
    return undefined;
  } catch (error) {
    return error as Error;
  }
}
