import { describe, expect, it } from "vitest";
import { assertTypeObject } from "./type-object.assert.js";

describe("type-object", () => {
  it("throws when value is not an object", () => {
    expect(() => {
      assertTypeObject("object");
    }).toThrowError(
      "Expected object to be of type object, but it was of type string",
    );
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
    }).toThrowError(
      "Expected undefined to be of type object, but it was of type undefined",
    );
    expect(() => {
      assertTypeObject(true);
    }).toThrowError(
      "Expected true to be of type object, but it was of type boolean",
    );
    expect(() => {
      assertTypeObject(123);
    }).toThrowError(
      "Expected 123 to be of type object, but it was of type number",
    );
    expect(() => {
      assertTypeObject("string");
    }).toThrowError(
      "Expected string to be of type object, but it was of type string",
    );
  });
});
