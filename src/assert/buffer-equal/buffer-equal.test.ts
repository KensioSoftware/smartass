import { describe, expect, it } from "vitest";
import { assertBufferEqual } from "./buffer-equal.assert.js";

describe("assertBufferEqual", () => {
  it("does not throw when Uint8Arrays are equal", () => {
    const a = new Uint8Array([1, 2, 3, 4]);
    const b = new Uint8Array([1, 2, 3, 4]);
    expect(() => {
      assertBufferEqual(a, b);
    }).not.toThrow();
  });

  it("throws when Uint8Arrays differ in content", () => {
    const a = new Uint8Array([1, 2, 3, 4]);
    const b = new Uint8Array([1, 2, 5, 4]);
    expect(() => {
      assertBufferEqual(a, b);
    }).toThrowError(
      "Expected object Uint8Array (4 bytes) to equal object Uint8Array (4 bytes).",
    );
  });

  it("throws when Uint8Arrays differ in length", () => {
    const a = new Uint8Array([1, 2, 3]);
    const b = new Uint8Array([1, 2, 3, 4]);
    expect(() => {
      assertBufferEqual(a, b);
    }).toThrowError(
      "Expected object Uint8Array (3 bytes) to equal object Uint8Array (4 bytes).",
    );
  });

  it("works with Int8Array", () => {
    const a = new Int8Array([-1, 2, -3, 4]);
    const b = new Int8Array([-1, 2, -3, 4]);
    expect(() => {
      assertBufferEqual(a, b);
    }).not.toThrow();
  });

  it("works with Uint16Array", () => {
    const a = new Uint16Array([256, 512, 1024]);
    const b = new Uint16Array([256, 512, 1024]);
    expect(() => {
      assertBufferEqual(a, b);
    }).not.toThrow();
  });

  it("works with Int16Array", () => {
    const a = new Int16Array([-256, 512, -1024]);
    const b = new Int16Array([-256, 512, -1024]);
    expect(() => {
      assertBufferEqual(a, b);
    }).not.toThrow();
  });

  it("works with Uint32Array", () => {
    const a = new Uint32Array([1_000_000, 2_000_000]);
    const b = new Uint32Array([1_000_000, 2_000_000]);
    expect(() => {
      assertBufferEqual(a, b);
    }).not.toThrow();
  });

  it("works with Int32Array", () => {
    const a = new Int32Array([-1_000_000, 2_000_000]);
    const b = new Int32Array([-1_000_000, 2_000_000]);
    expect(() => {
      assertBufferEqual(a, b);
    }).not.toThrow();
  });

  it("works with Float32Array", () => {
    const a = new Float32Array([1.5, 2.5, 3.5]);
    const b = new Float32Array([1.5, 2.5, 3.5]);
    expect(() => {
      assertBufferEqual(a, b);
    }).not.toThrow();
  });

  it("works with Float64Array", () => {
    const a = new Float64Array([1.123_456_789, 2.987_654_321]);
    const b = new Float64Array([1.123_456_789, 2.987_654_321]);
    expect(() => {
      assertBufferEqual(a, b);
    }).not.toThrow();
  });

  it("works with BigInt64Array", () => {
    const a = new BigInt64Array([
      9_007_199_254_740_991n,
      -9_007_199_254_740_991n,
    ]);
    const b = new BigInt64Array([
      9_007_199_254_740_991n,
      -9_007_199_254_740_991n,
    ]);
    expect(() => {
      assertBufferEqual(a, b);
    }).not.toThrow();
  });

  it("works with BigUint64Array", () => {
    const a = new BigUint64Array([
      9_007_199_254_740_991n,
      18_014_398_509_481_982n,
    ]);
    const b = new BigUint64Array([
      9_007_199_254_740_991n,
      18_014_398_509_481_982n,
    ]);
    expect(() => {
      assertBufferEqual(a, b);
    }).not.toThrow();
  });

  it("throws when actual value is not a TypedArray", () => {
    const a = [1, 2, 3];
    const b = new Uint8Array([1, 2, 3]);
    expect(() => {
      assertBufferEqual(a, b);
    }).toThrowError("to be a TypedArray");
  });

  it("works with empty buffers", () => {
    const a = new Uint8Array([]);
    const b = new Uint8Array([]);
    expect(() => {
      assertBufferEqual(a, b);
    }).not.toThrow();
  });

  it("throws with custom message", () => {
    const a = new Uint8Array([1, 2, 3]);
    const b = new Uint8Array([1, 2, 4]);
    expect(() => {
      assertBufferEqual(a, b, "Custom error message");
    }).toThrowError("Custom error message");
  });

  it("detects difference at first index", () => {
    const a = new Uint8Array([99, 2, 3]);
    const b = new Uint8Array([1, 2, 3]);
    expect(() => {
      assertBufferEqual(a, b);
    }).toThrowError(
      "Expected object Uint8Array (3 bytes) to equal object Uint8Array (3 bytes).",
    );
  });

  it("detects difference at last index", () => {
    const a = new Uint8Array([1, 2, 3, 99]);
    const b = new Uint8Array([1, 2, 3, 4]);
    expect(() => {
      assertBufferEqual(a, b);
    }).toThrowError(
      "Expected object Uint8Array (4 bytes) to equal object Uint8Array (4 bytes).",
    );
  });
});
