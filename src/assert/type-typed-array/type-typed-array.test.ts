import { describe, expect, it } from "vitest";
import { assertTypeTypedArray } from "./type-typed-array.assert.js";

describe("type-typed-array", () => {
  it("does not throw for Uint8Array", () => {
    expect(() => {
      assertTypeTypedArray(new Uint8Array([1, 2, 3]));
    }).not.toThrow();
  });

  it("does not throw for Int8Array", () => {
    expect(() => {
      assertTypeTypedArray(new Int8Array([-1, 2, -3]));
    }).not.toThrow();
  });

  it("does not throw for Uint16Array", () => {
    expect(() => {
      assertTypeTypedArray(new Uint16Array([256, 512]));
    }).not.toThrow();
  });

  it("does not throw for Int16Array", () => {
    expect(() => {
      assertTypeTypedArray(new Int16Array([-256, 512]));
    }).not.toThrow();
  });

  it("does not throw for Uint32Array", () => {
    expect(() => {
      assertTypeTypedArray(new Uint32Array([1_000_000]));
    }).not.toThrow();
  });

  it("does not throw for Int32Array", () => {
    expect(() => {
      assertTypeTypedArray(new Int32Array([-1_000_000]));
    }).not.toThrow();
  });

  it("does not throw for Float32Array", () => {
    expect(() => {
      assertTypeTypedArray(new Float32Array([1.5, 2.5]));
    }).not.toThrow();
  });

  it("does not throw for Float64Array", () => {
    expect(() => {
      assertTypeTypedArray(new Float64Array([1.123_456_789]));
    }).not.toThrow();
  });

  it("does not throw for BigInt64Array", () => {
    expect(() => {
      assertTypeTypedArray(new BigInt64Array([9_007_199_254_740_991n]));
    }).not.toThrow();
  });

  it("does not throw for BigUint64Array", () => {
    expect(() => {
      assertTypeTypedArray(new BigUint64Array([9_007_199_254_740_991n]));
    }).not.toThrow();
  });

  it("throws when value is a regular array", () => {
    expect(() => {
      assertTypeTypedArray([1, 2, 3]);
    }).toThrowError("Expected array [1,2,3] (len 3) to be a TypedArray.");
  });

  it("throws when value is null", () => {
    expect(() => {
      assertTypeTypedArray(null);
    }).toThrowError("Expected null to be a TypedArray.");
  });

  it("throws when value is undefined", () => {
    expect(() => {
      assertTypeTypedArray(undefined);
    }).toThrowError("Expected undefined to be a TypedArray.");
  });

  it("throws when value is a number", () => {
    expect(() => {
      assertTypeTypedArray(123);
    }).toThrowError("Expected number 123 to be a TypedArray.");
  });

  it("throws when value is a string", () => {
    expect(() => {
      assertTypeTypedArray("hello");
    }).toThrowError('Expected string "hello" to be a TypedArray.');
  });

  it("throws when value is an object", () => {
    expect(() => {
      assertTypeTypedArray({});
    }).toThrowError("Expected object {} to be a TypedArray.");
  });

  it("throws with custom message", () => {
    expect(() => {
      assertTypeTypedArray(123, "Custom error message");
    }).toThrowError("Custom error message");
  });

  it("works with empty TypedArrays", () => {
    expect(() => {
      assertTypeTypedArray(new Uint8Array([]));
    }).not.toThrow();
  });
});
