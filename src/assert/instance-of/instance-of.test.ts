import { describe, expect, it } from "vitest";
import { assertInstanceOf } from "./instance-of.assert.js";
import { instanceOf } from "./instance-of.match.js";

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
    }).toThrow("Expected value to be instance of TestClass, but it was not.");
  });

  it("throws when value is a plain object", () => {
    const obj = { value: 42 };
    expect(() => {
      assertInstanceOf(obj, TestClass);
    }).toThrow("Expected value to be instance of TestClass, but it was not.");
  });

  it("throws when value is null", () => {
    expect(() => {
      assertInstanceOf(null, TestClass);
    }).toThrow("Expected value to be instance of TestClass, but it was not.");
  });

  it("throws when value is undefined", () => {
    expect(() => {
      assertInstanceOf(undefined, TestClass);
    }).toThrow("Expected value to be instance of TestClass, but it was not.");
  });

  it("throws with custom message", () => {
    expect(() => {
      assertInstanceOf({}, TestClass, "Custom error message");
    }).toThrow("Custom error message");
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
    }).toThrow("Expected value to be instance of Date, but it was not.");
  });

  describe("instanceOf", () => {
    it("matches correct instances", () => {
      expect(instanceOf(TestClass).matches(new TestClass())).toBe(true);
    });

    it("does not match incorrect instances", () => {
      expect(instanceOf(TestClass).matches(new OtherClass())).toBe(false);
    });

    it("does not match plain objects", () => {
      expect(instanceOf(TestClass).matches({ value: 42 })).toBe(false);
    });

    it("does not match null", () => {
      expect(instanceOf(TestClass).matches(null)).toBe(false);
    });

    it("does not match undefined", () => {
      expect(instanceOf(TestClass).matches(undefined)).toBe(false);
    });

    it("describes the matcher", () => {
      expect(instanceOf(TestClass).describe()).toBe("instance of TestClass");
    });

    it("represents the matcher", () => {
      expect(instanceOf(TestClass).represent()).toBe("TestClass()");
    });

    it("describes when constructor has no name", () => {
      const noNameCtor = function (): void {
        //
      } as unknown as abstract new (...args: never[]) => unknown;
      const matcher = instanceOf(noNameCtor);

      expect(matcher.describe()).toBe("instance of noNameCtor");
      expect(matcher.represent()).toBe("noNameCtor()");
    });
  });
});
