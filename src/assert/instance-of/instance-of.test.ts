import { describe, expect, it } from "vitest";
import { assertInstanceOf } from "./instance-of.assert.js";

class TestClass {
  value = 42;
}

class OtherClass {
  data = "test";
}

describe("instance-of", () => {
  it("does not throw when value is an instance of the class", () => {
    const instance = new TestClass();
    expect(() => {
      assertInstanceOf(instance, TestClass);
    }).not.toThrow();
  });

  it("throws when value is not an instance of the class", () => {
    const instance = new OtherClass();
    expect(() => {
      assertInstanceOf(instance, TestClass);
    }).toThrowError(
      "Expected value to be instance of TestClass, but it was not.",
    );
  });

  it("throws when value is a plain object", () => {
    const obj = { value: 42 };
    expect(() => {
      assertInstanceOf(obj, TestClass);
    }).toThrowError(
      "Expected value to be instance of TestClass, but it was not.",
    );
  });

  it("throws when value is null", () => {
    expect(() => {
      assertInstanceOf(null, TestClass);
    }).toThrowError(
      "Expected value to be instance of TestClass, but it was not.",
    );
  });

  it("throws when value is undefined", () => {
    expect(() => {
      assertInstanceOf(undefined, TestClass);
    }).toThrowError(
      "Expected value to be instance of TestClass, but it was not.",
    );
  });

  it("throws with custom message", () => {
    expect(() => {
      assertInstanceOf({}, TestClass, "Custom error message");
    }).toThrowError("Custom error message");
  });

  it("works with built-in classes", () => {
    expect(() => {
      assertInstanceOf(new Date(), Date);
    }).not.toThrow();

    expect(() => {
      assertInstanceOf(new Error("foobar"), Error);
    }).not.toThrow();

    expect(() => {
      assertInstanceOf("string", Date);
    }).toThrowError("Expected value to be instance of Date, but it was not.");
  });
});
