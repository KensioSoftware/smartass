import { describe, expect, expectTypeOf, it } from "vitest";

import { AssertionError } from "../../assertion-error.js";
import { assertNotEqual } from "./not-equal.assert.js";

describe("not-equal", () => {
  it("throws an AssertionError when primitive values are equal", () => {
    // Given two equal digest values.
    const before = "9f2c1a";
    const after = "9f2c1a";

    // When their difference is asserted.
    const assertion = () => {
      assertNotEqual(before, after);
    };

    // Then the failure reports the value that was found.
    expect(assertion).toThrow(AssertionError);
    expect(assertion).toThrow(
      'Expected string "9f2c1a" not to equal string "9f2c1a", but it did.',
    );
  });

  it("retains both values on the AssertionError", () => {
    // Given distinct references with equal values.
    const actual = { digest: "9f2c1a" };
    const unexpected = { digest: "9f2c1a" };

    // When their difference is asserted.
    let thrown: unknown;
    try {
      assertNotEqual(actual, unexpected);
    } catch (error) {
      thrown = error;
    }

    // Then the framework can diff the original values.
    expect(thrown).toBeInstanceOf(AssertionError);
    const error = thrown as AssertionError;
    expect(error.actual).toBe(actual);
    expect(error.expected).toBe(unexpected);
  });

  it("passes when values differ at any depth", () => {
    // Given objects with one different nested array value.
    const actual = { user: { roles: ["admin", "editor"] } };
    const unexpected = { user: { roles: ["admin", "viewer"] } };

    // When their difference is asserted.
    const assertion = () => {
      assertNotEqual(actual, unexpected);
    };

    // Then the nested difference satisfies the assertion.
    expect(assertion).not.toThrow();
  });

  it("passes when values have different types", () => {
    // Given values with different types and similar representations.
    const actual = 1;
    const unexpected = "1";

    // When their difference is asserted.
    const assertion = () => {
      assertNotEqual(actual, unexpected);
    };

    // Then the type difference satisfies the assertion.
    expect(assertion).not.toThrow();
  });

  it("passes when an object carries an extra key", () => {
    // Given objects whose shared keys have equal values.
    const actual = { name: "Ada", active: true };
    const unexpected = { name: "Ada" };

    // When their difference is asserted.
    const assertion = () => {
      assertNotEqual(actual, unexpected);
    };

    // Then the extra key satisfies the assertion.
    expect(assertion).not.toThrow();
  });

  it("passes for a class instance and a plain object with the same fields", () => {
    // Given a class instance and a plain object with equal field values.
    class User {
      constructor(readonly name: string) {}
    }
    const actual = new User("Ada");
    const unexpected = { name: "Ada" };

    // When their difference is asserted.
    const assertion = () => {
      assertNotEqual(actual, unexpected);
    };

    // Then the prototype difference satisfies the assertion.
    expect(assertion).not.toThrow();
  });

  it("uses Object.is semantics for numbers", () => {
    // Given the two number pairs where Object.is and strict equality disagree.
    const equalNanValues = () => {
      assertNotEqual(Number.NaN, Number.NaN);
    };
    const differentZeroValues = () => {
      assertNotEqual(0, -0);
    };

    // When each pair's difference is asserted.
    // Then NaN is equal and signed zero differs.
    expect(equalNanValues).toThrow(
      "Expected number NaN not to equal number NaN, but it did.",
    );
    expect(differentZeroValues).not.toThrow();
  });

  it("uses a custom failure message", () => {
    // Given equal values and a caller-supplied message.
    const assertion = () => {
      assertNotEqual("same", "same", "The digest should have changed");
    };

    // When their difference is asserted.
    // Then the supplied message is used.
    expect(assertion).toThrow("The digest should have changed");
  });

  it("does not narrow the actual value or accept comparison options", () => {
    // Given a value whose union type must remain intact.
    const getValue = (): string | number => "before";
    const value = getValue();

    // When its difference from another value is asserted.
    assertNotEqual(value, "after");

    // Then the value keeps its original type and the function has three parameters.
    expectTypeOf(value).toEqualTypeOf<string | number>();
    expectTypeOf(assertNotEqual).toEqualTypeOf<
      (actual: unknown, unexpected: unknown, message?: string) => void
    >();
  });
});
