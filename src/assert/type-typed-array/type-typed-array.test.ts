import { describe, expect, expectTypeOf, it } from "vitest";
import { assertTypeTypedArray } from "./type-typed-array.assert.js";
import { typeTypedArray } from "./type-typed-array.match.js";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";
import type { TypedArray } from "./type-typed-array.type.js";

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
        assertTypeTypedArray(new Float64Array([1.123456789]));
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

    it("narrows unknown values to TypedArray", () => {
      const value: unknown = new Uint8Array([1, 2, 3]);

      assertTypeTypedArray(value);

      expectTypeOf(value).toEqualTypeOf<TypedArray>();
      expectTypeOf(value).not.toEqualTypeOf<unknown[]>();
      expectTypeOf(value).not.toEqualTypeOf<DataView>();
      expect(value).toBeInstanceOf(Uint8Array);
    });

    it("narrows object unions to TypedArray", () => {
      function getValue():
        Uint8Array | Int16Array | string[] | DataView | null {
        return new Uint8Array([1, 2, 3]);
      }

      const value = getValue();

      assertTypeTypedArray(value);

      expectTypeOf(value).toEqualTypeOf<Uint8Array | Int16Array>();
      expectTypeOf(value).toExtend<TypedArray>();
      expectTypeOf(value).not.toEqualTypeOf<TypedArray>();
      expectTypeOf(value).not.toEqualTypeOf<string[]>();
      expectTypeOf(value).not.toEqualTypeOf<DataView>();
      expectTypeOf(value).not.toEqualTypeOf<null>();
      expect(value).toBeInstanceOf(Uint8Array);
    });

    it("preserves specific TypedArray union overlap", () => {
      function getValue(): Uint8Array | Float32Array | string {
        return new Uint8Array([1, 2, 3]);
      }

      const value = getValue();

      assertTypeTypedArray(value);

      expectTypeOf(value).toEqualTypeOf<Uint8Array | Float32Array>();
      expectTypeOf(value).toExtend<TypedArray>();
      expectTypeOf(value).not.toEqualTypeOf<TypedArray>();
      expectTypeOf(value).not.toEqualTypeOf<string>();
      expect(value).toBeInstanceOf(Uint8Array);
    });
  });

  describe("typeTypedArray", () => {
    it("works as composable matcher", () => {
      interface Foo {
        bar?: { foobar?: Buffer | string };
      }

      function getFoo(): Foo {
        return { bar: { foobar: Buffer.from("foobar") } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: typeTypedArray() },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript knows foo.bar.foobar is a TypedArray.
      expectTypeOf(foo.bar.foobar).toExtend<TypedArray>();
      expect(foo.bar.foobar).toBeInstanceOf(Uint8Array);
    });

    it("preserves specific TypedArray union overlap in object matches", () => {
      interface Foo {
        bar?: {
          foobar?: Uint8Array | Float32Array | DataView | string | null;
        };
      }

      function getFoo(): Foo {
        return { bar: { foobar: new Uint8Array([1, 2, 3]) } };
      }

      // Given an object property whose static type includes specific
      // TypedArray variants and non-TypedArray alternatives.
      const foo = getFoo();

      // When the property is matched with the composable TypedArray matcher.
      assertObjectMatches(foo, {
        bar: { foobar: typeTypedArray() },
      });

      // Then the property should keep the known TypedArray overlap instead
      // of widening to the less precise TypedArray union type.
      expectTypeOf(foo.bar.foobar).toEqualTypeOf<Uint8Array | Float32Array>();
      expectTypeOf(foo.bar.foobar).toExtend<TypedArray>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<TypedArray>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<DataView>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<string>();
      expectTypeOf(foo.bar.foobar).not.toEqualTypeOf<null>();
      expect(foo.bar.foobar).toBeInstanceOf(Uint8Array);
    });

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
      expect(matcher.matches(new Float64Array([1.123456789]))).toBe(true);
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
