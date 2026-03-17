import { describe, expect, it } from "vitest";
import { assertIdentical } from "./identical.assert.js";

describe("identical", () => {
  it("throws when values are not identical", () => {
    expect(() => {
      assertIdentical("foo", "bar");
    }).toThrowError('Expected string "foo" to be identical to string "bar".');
  });

  it("does not throw when values are identical", () => {
    expect(() => {
      assertIdentical("foo", "foo");
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    expect(() => {
      assertIdentical(1, 2, "Custom error message");
    }).toThrowError("Custom error message");
  });

  it("uses === for comparison (not ==)", () => {
    expect(() => {
      assertIdentical(1, "1");
    }).toThrowError('Expected number 1 to be identical to string "1".');
  });

  it("works with object references", () => {
    const obj = { foo: "bar" };
    expect(() => {
      assertIdentical(obj, obj);
    }).not.toThrow();
    expect(() => {
      assertIdentical(obj, { foo: "bar" });
    }).toThrow();
  });

  it("works with null and undefined", () => {
    expect(() => {
      assertIdentical(null, null);
    }).not.toThrow();
    expect(() => {
      assertIdentical(undefined, undefined);
    }).not.toThrow();
    expect(() => {
      assertIdentical(null, undefined);
    }).toThrow();
  });

  it("works with numbers", () => {
    expect(() => {
      assertIdentical(42, 42);
    }).not.toThrow();
    expect(() => {
      assertIdentical(42, 43);
    }).toThrowError("Expected number 42 to be identical to number 43");
  });

  it("works with booleans", () => {
    expect(() => {
      assertIdentical(true, true);
    }).not.toThrow();
    expect(() => {
      assertIdentical(true, false);
    }).toThrow();
  });
});
