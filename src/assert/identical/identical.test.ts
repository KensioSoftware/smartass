import { describe, expect, expectTypeOf, it } from "vitest";
import { assertIdentical } from "./identical.assert.js";

describe("identical", () => {
  it("throws when values are not identical", () => {
    expect(() => {
      assertIdentical("foo", "bar");
    }).toThrow('Expected string "foo" to be identical to string "bar".');
  });

  it("does not throw when values are identical", () => {
    expect(() => {
      assertIdentical("foo", "foo");
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    expect(() => {
      assertIdentical(1, 2, "Custom error message");
    }).toThrow("Custom error message");
  });

  it("uses === for comparison (not ==)", () => {
    expect(() => {
      assertIdentical(1, "1");
    }).toThrow('Expected number 1 to be identical to string "1".');
  });

  it("works with object references", () => {
    const object = { foo: "bar" };
    expect(() => {
      assertIdentical(object, object);
    }).not.toThrow();
    expect(() => {
      assertIdentical(object, { foo: "bar" });
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
    }).toThrow("Expected number 42 to be identical to number 43");
  });

  it("works with booleans", () => {
    expect(() => {
      assertIdentical(true, true);
    }).not.toThrow();
    expect(() => {
      assertIdentical(true, false);
    }).toThrow();
  });

  it("narrows to identical type", () => {
    const actual: unknown = "foo";
    const expected = "foo";

    assertIdentical(actual, expected);

    expectTypeOf(actual).toEqualTypeOf<"foo">();
    expectTypeOf(actual).not.toEqualTypeOf<string>();
    expect(actual).toBeTypeOf("string");
  });
});
