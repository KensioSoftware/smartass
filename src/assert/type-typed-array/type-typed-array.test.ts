import { describe, expect, it } from "vitest";
import { assertTypeTypedArray } from "./type-typed-array.assert.js";
import { typeTypedArray } from "./type-typed-array.match.js";
import { desc, repr } from "../../describe/describe.js";

describe("type-typed-array", () => {
  describe("assertTypeTypedArray", () => {
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
      }).toThrow("Expected array [1,2,3] (len 3) to be a TypedArray.");
    });

    it("throws when value is null", () => {
      expect(() => {
        assertTypeTypedArray(null);
      }).toThrow("Expected null to be a TypedArray.");
    });

    it("throws when value is undefined", () => {
      expect(() => {
        assertTypeTypedArray(undefined);
      }).toThrow("Expected undefined to be a TypedArray.");
    });

    it("throws when value is a number", () => {
      expect(() => {
        assertTypeTypedArray(123);
      }).toThrow("Expected number 123 to be a TypedArray.");
    });

    it("throws when value is a string", () => {
      expect(() => {
        assertTypeTypedArray("hello");
      }).toThrow('Expected string "hello" to be a TypedArray.');
    });

    it("throws when value is an object", () => {
      expect(() => {
        assertTypeTypedArray({});
      }).toThrow("Expected object {} to be a TypedArray.");
    });

    it("throws with custom message", () => {
      expect(() => {
        assertTypeTypedArray(123, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("works with empty TypedArrays", () => {
      expect(() => {
        assertTypeTypedArray(new Uint8Array([]));
      }).not.toThrow();
    });
  });

  describe("typeTypedArray", () => {
    it("matches Uint8Array values", () => {
      const matcher = typeTypedArray();
      expect(matcher.matches(new Uint8Array([1, 2, 3]))).toBe(true);
    });

    it("matches Int8Array values", () => {
      const matcher = typeTypedArray();
      expect(matcher.matches(new Int8Array([-1, 2, -3]))).toBe(true);
    });

    it("matches Uint16Array values", () => {
      const matcher = typeTypedArray();
      expect(matcher.matches(new Uint16Array([256, 512]))).toBe(true);
    });

    it("matches Int16Array values", () => {
      const matcher = typeTypedArray();
      expect(matcher.matches(new Int16Array([-256, 512]))).toBe(true);
    });

    it("matches Uint32Array values", () => {
      const matcher = typeTypedArray();
      expect(matcher.matches(new Uint32Array([1_000_000]))).toBe(true);
    });

    it("matches Int32Array values", () => {
      const matcher = typeTypedArray();
      expect(matcher.matches(new Int32Array([-1_000_000]))).toBe(true);
    });

    it("matches Float32Array values", () => {
      const matcher = typeTypedArray();
      expect(matcher.matches(new Float32Array([1.5, 2.5]))).toBe(true);
    });

    it("matches Float64Array values", () => {
      const matcher = typeTypedArray();
      expect(matcher.matches(new Float64Array([1.123_456_789]))).toBe(true);
    });

    it("matches BigInt64Array values", () => {
      const matcher = typeTypedArray();
      expect(matcher.matches(new BigInt64Array([9_007_199_254_740_991n]))).toBe(
        true,
      );
    });

    it("matches BigUint64Array values", () => {
      const matcher = typeTypedArray();
      expect(
        matcher.matches(new BigUint64Array([9_007_199_254_740_991n])),
      ).toBe(true);
    });

    it("does not match regular arrays", () => {
      const matcher = typeTypedArray();
      expect(matcher.matches([1, 2, 3])).toBe(false);
    });

    it("does not match null", () => {
      const matcher = typeTypedArray();
      expect(matcher.matches(null)).toBe(false);
    });

    it("does not match undefined", () => {
      const matcher = typeTypedArray();
      expect(matcher.matches(undefined)).toBe(false);
    });

    it("does not match numbers", () => {
      const matcher = typeTypedArray();
      expect(matcher.matches(123)).toBe(false);
    });

    it("does not match strings", () => {
      const matcher = typeTypedArray();
      expect(matcher.matches("hello")).toBe(false);
    });

    it("does not match objects", () => {
      const matcher = typeTypedArray();
      expect(matcher.matches({})).toBe(false);
    });

    it("describes the matcher", () => {
      const matcher = typeTypedArray();
      expect(desc(matcher)).toBe("TypedArray");
    });

    it("represents the matcher", () => {
      const matcher = typeTypedArray();
      expect(repr(matcher)).toBe("TypedArray()");
    });
  });
});
