import { describe, expect, it } from "vitest";
import { assertTypeOf } from "./typeof.assert.js";

describe("typeof", () => {
  it("does not throw when value has the asserted typeof result", () => {
    expect(() => {
      assertTypeOf("hello", "string");
    }).not.toThrow();

    expect(() => {
      assertTypeOf(123, "number");
    }).not.toThrow();

    expect(() => {
      assertTypeOf(true, "boolean");
    }).not.toThrow();

    expect(() => {
      assertTypeOf(123n, "bigint");
    }).not.toThrow();

    expect(() => {
      assertTypeOf(Symbol("test"), "symbol");
    }).not.toThrow();

    expect(() => {
      assertTypeOf(undefined, "undefined");
    }).not.toThrow();

    expect(() => {
      assertTypeOf({}, "object");
    }).not.toThrow();

    expect(() => {
      assertTypeOf(null, "object");
    }).not.toThrow();

    expect(() => {
      assertTypeOf(() => {
        //
      }, "function");
    }).not.toThrow();
  });

  it("throws when value does not have the asserted typeof result", () => {
    expect(() => {
      assertTypeOf("123", "number");
    }).toThrow('Expected string "123" to be of type number.');
  });

  it("throws with custom message", () => {
    expect(() => {
      assertTypeOf("123", "number", "Custom error message");
    }).toThrow("Custom error message");
  });

  it("narrows string values", () => {
    const value: unknown = "hello";

    assertTypeOf(value, "string");

    expect(value.toUpperCase()).toBe("HELLO");
  });

  it("narrows number values", () => {
    const value: unknown = 123;

    assertTypeOf(value, "number");

    expect(value.toFixed(2)).toBe("123.00");
  });

  it("narrows object values to the precise typeof object result", () => {
    const value: unknown = null;

    assertTypeOf(value, "object");

    expect(value).toBeNull();
  });
});
