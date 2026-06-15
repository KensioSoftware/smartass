import { describe, expect, expectTypeOf, it } from "vitest";
import { assertBufferEqual } from "./buffer-equal.assert.js";
import { bufferEqualTo } from "./buffer-equal.match.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";

describe("assertBufferEqual", () => {
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
      }).toThrow(
        "Expected object Uint8Array(4) to equal object Uint8Array(4).",
      );
    });

    it("throws when Uint8Arrays differ in length", () => {
      const a = new Uint8Array([1, 2, 3]);
      const b = new Uint8Array([1, 2, 3, 4]);
      expect(() => {
        assertBufferEqual(a, b);
      }).toThrow(
        "Expected object Uint8Array(3) to equal object Uint8Array(4).",
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
      }).toThrow(
        "Expected array [1,2,3] (len 3) to equal object Uint8Array(3).",
      );
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
      }).toThrow("Custom error message");
    });

    it("detects difference at first index", () => {
      const a = new Uint8Array([99, 2, 3]);
      const b = new Uint8Array([1, 2, 3]);
      expect(() => {
        assertBufferEqual(a, b);
      }).toThrow(
        "Expected object Uint8Array(3) to equal object Uint8Array(3).",
      );
    });

    it("detects difference at last index", () => {
      const a = new Uint8Array([1, 2, 3, 99]);
      const b = new Uint8Array([1, 2, 3, 4]);
      expect(() => {
        assertBufferEqual(a, b);
      }).toThrow(
        "Expected object Uint8Array(4) to equal object Uint8Array(4).",
      );
    });

    it("narrows unknown values to the expected buffer type", () => {
      const actual: unknown = new Uint8Array([1, 2, 3]);
      const expected = new Uint8Array([1, 2, 3]);

      assertBufferEqual(actual, expected);

      expectTypeOf(actual).toEqualTypeOf<Uint8Array<ArrayBuffer>>();
      expectTypeOf(actual).not.toEqualTypeOf<Int8Array>();
      expect(actual).toBeInstanceOf(Uint8Array);
    });

    it("narrows to the specific TypedArray class used as expected", () => {
      const actual: unknown = new BigInt64Array([1n, 2n, 3n]);
      const expected = new BigInt64Array([1n, 2n, 3n]);

      assertBufferEqual(actual, expected);

      expectTypeOf(actual).toEqualTypeOf<BigInt64Array<ArrayBuffer>>();
      expectTypeOf(actual).not.toEqualTypeOf<BigUint64Array>();
      expect(actual).toBeInstanceOf(BigInt64Array);
    });
  });

  describe("bufferEqualTo", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: Buffer | string };
      }

      function getFoo(): Foo {
        return { bar: { foobar: Buffer.from("foobar") } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: bufferEqualTo(Buffer.from("foobar")) },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is a Buffer.
      expectTypeOf(foo.bar.foobar).toExtend<Buffer>();
      expect(foo.bar.foobar).toBeInstanceOf(Buffer);
    });

    it("matches equal TypedArrays", () => {
      expect(
        bufferEqualTo(new Uint8Array([1, 2, 3])).matches(
          new Uint8Array([1, 2, 3]),
        ),
      ).toBe(true);
    });

    it("does not match different TypedArrays", () => {
      expect(
        bufferEqualTo(new Uint8Array([1, 2, 3])).matches(
          new Uint8Array([1, 2, 4]),
        ),
      ).toBe(false);
    });

    it("does not match non-TypedArrays", () => {
      expect(bufferEqualTo(new Uint8Array([1, 2, 3])).matches([1, 2, 3])).toBe(
        false,
      );
    });

    it("describes and represents the bufferEqualTo matcher", () => {
      const matcher = bufferEqualTo(new Uint8Array([1, 2, 3]));

      expect(desc(matcher)).toBe("buffer equal to object Uint8Array(3)");
      expect(repr(matcher)).toBe("Uint8Array(3)");
    });
  });
});
