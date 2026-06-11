import { describe, expect, it } from "vitest";
import { assertObjectHasProperty } from "./object-has-property.assert.js";

describe("object-has-property", () => {
  it("throws when object does not have property", () => {
    expect(() => {
      assertObjectHasProperty({ a: 1 }, "b");
    }).toThrow('Expected object {"a":1} to have property "b".');
  });

  it("does not throw when object has property", () => {
    expect(() => {
      assertObjectHasProperty({ a: 1 }, "a");
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    expect(() => {
      assertObjectHasProperty({ a: 1 }, "b", "Custom error message");
    }).toThrow("Custom error message");
  });

  it("works with nested objects", () => {
    const obj = { outer: { inner: "value" } };
    expect(() => {
      assertObjectHasProperty(obj, "outer");
    }).not.toThrow();

    expect(() => {
      assertObjectHasProperty(obj.outer, "inner");
    }).not.toThrow();
  });

  it("works with arrays (has length property)", () => {
    expect(() => {
      assertObjectHasProperty([1, 2, 3], "length");
    }).not.toThrow();
  });

  it("works with inherited properties", () => {
    const obj = { a: 1 };
    //Prototype property is accessible via 'toString'
    expect(() => {
      assertObjectHasProperty(obj, "toString");
    }).not.toThrow();
  });

  it("works with undefined property value", () => {
    expect(() => {
      assertObjectHasProperty({ a: undefined }, "a");
    }).not.toThrow();
  });

  it("works with empty object", () => {
    expect(() => {
      assertObjectHasProperty({}, "__proto__");
    }).not.toThrow();
  });

  it("narrows the value type to include the property", () => {
    const value: { name?: string } = { name: "Ada" };

    assertObjectHasProperty(value, "name");

    expect(value.name).toBe("Ada");
  });
});
