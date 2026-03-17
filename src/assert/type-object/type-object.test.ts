import { describe, expect, it } from "vitest";
import { assertTypeObject } from "./type-object.assert.js";

describe("type-object", () => {
  it("throws when value is not an object", () => {
    expect(() => {
      assertTypeObject("not an object");
    }).toThrowError('Expected string "not an object" to be of type object.');
  });

  it("does not throw when value is an object", () => {
    expect(() => {
      assertTypeObject({});
    }).not.toThrow();
    expect(() => {
      assertTypeObject({ key: "value" });
    }).not.toThrow();
    expect(() => {
      assertTypeObject([]);
    }).not.toThrow();
    expect(() => {
      assertTypeObject(null);
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    expect(() => {
      assertTypeObject(123, "Custom error message");
    }).toThrowError("Custom error message");
  });

  it("works with various non-object types", () => {
    expect(() => {
      assertTypeObject(undefined);
    }).toThrowError("Expected undefined to be of type object.");
    expect(() => {
      assertTypeObject(true);
    }).toThrowError("Expected boolean true to be of type object.");
    expect(() => {
      assertTypeObject(123);
    }).toThrowError("Expected number 123 to be of type object.");
    expect(() => {
      assertTypeObject("foobar");
    }).toThrowError('Expected string "foobar" to be of type object.');
  });
});
