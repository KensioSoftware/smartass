import { describe, expect, it } from "vitest";
import { desc, repr } from "./describe.js";

describe("desc", () => {
  it("describes null", () => {
    expect(desc(null)).toBe("null");
  });

  it("describes undefined", () => {
    expect(desc(undefined)).toBe("undefined");
  });

  it("describes boolean true", () => {
    expect(desc(true)).toBe("boolean true");
  });

  it("describes boolean false", () => {
    expect(desc(false)).toBe("boolean false");
  });

  it("describes numbers", () => {
    expect(desc(42)).toBe("number 42");
    expect(desc(0)).toBe("number 0");
    expect(desc(-0)).toBe("number -0");
    expect(desc(3.14)).toBe("number 3.14");
    expect(desc(Number.NaN)).toBe("number NaN");
    expect(desc(Infinity)).toBe("number Infinity");
    expect(desc(-Infinity)).toBe("number -Infinity");
  });

  it("describes bigints", () => {
    expect(desc(42n)).toBe("bigint 42n");
    expect(desc(0n)).toBe("bigint 0n");
    expect(desc(-123n)).toBe("bigint -123n");
  });

  it("describes strings", () => {
    expect(desc("hello")).toBe('string "hello"');
    expect(desc("")).toBe('string ""');
    expect(desc("with\nnewline")).toBe(String.raw`string "with\nnewline"`);
  });

  it("describes symbols", () => {
    expect(desc(Symbol("test"))).toBe("symbol Symbol(test)");
    expect(desc(Symbol())).toBe("symbol Symbol()");
  });

  it("describes functions", () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    function testFunc(a: number, b: number): number {
      return a + b;
    }
    expect(desc(testFunc)).toBe("function testFunc(){} (2 args)");
    expect(
      desc(() => {
        /* empty */
      }),
    ).toBe("function anonymous(){} (0 args)");
    expect(desc((x: number) => x * 2)).toBe("function anonymous(){} (1 args)");
  });

  it("describes arrays", () => {
    expect(desc([1, 2, 3])).toBe("array [1,2,3] (len 3)");
    expect(desc([])).toBe("array [] (len 0)");
    expect(desc(["a", "b"])).toBe('array ["a","b"] (len 2)');
  });

  it("describes arrays with more than 10 items", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    expect(desc(arr)).toBe("array [1,2,3,...,11,12,13] (len 13)");
  });

  it("describes Maps", () => {
    const map = new Map([
      ["a", 1],
      ["b", 2],
    ]);
    expect(desc(map)).toBe('Map([["a",1],["b",2]]) (size 2)');
    expect(desc(new Map())).toBe("Map([]) (size 0)");
  });

  it("describes Sets", () => {
    const set = new Set([1, 2, 3]);
    expect(desc(set)).toBe("Set([1,2,3]) (size 3)");
    expect(desc(new Set())).toBe("Set([]) (size 0)");
  });

  it("describes RegExp", () => {
    expect(desc(/test/g)).toBe("RegExp /test/g");
    expect(desc(/^[a-z]+$/i)).toBe("RegExp /^[a-z]+$/i");
  });

  it("describes plain objects", () => {
    expect(desc({ a: 1, b: 2 })).toBe('object {"a":1,"b":2}');
    expect(desc({})).toBe("object {}");
  });

  it("describes objects with more than 10 properties", () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
      g: 7,
      h: 8,
      i: 9,
      j: 10,
      k: 11,
      l: 12,
    };
    const result = desc(obj);
    expect(result).toContain("object");
    expect(result).toContain("...");
  });
});

describe("repr", () => {
  it("represents null", () => {
    expect(repr(null)).toBe("null");
  });

  it("represents undefined", () => {
    expect(repr(undefined)).toBe("undefined");
  });

  it("represents booleans", () => {
    expect(repr(true)).toBe("true");
    expect(repr(false)).toBe("false");
  });

  it("represents numbers", () => {
    expect(repr(42)).toBe("42");
    expect(repr(0)).toBe("0");
    expect(repr(-0)).toBe("-0");
    expect(repr(3.141_59)).toBe("3.14159");
    expect(repr(Number.NaN)).toBe("NaN");
    expect(repr(Infinity)).toBe("Infinity");
    expect(repr(-Infinity)).toBe("-Infinity");
  });

  it("represents bigints", () => {
    expect(repr(42n)).toBe("42n");
    expect(repr(0n)).toBe("0n");
    expect(repr(-999n)).toBe("-999n");
  });

  it("represents strings with proper escaping", () => {
    expect(repr("hello")).toBe('"hello"');
    expect(repr("")).toBe('""');
    expect(repr("with\nnewline")).toBe(String.raw`"with\nnewline"`);
    expect(repr('with"quotes')).toBe(String.raw`"with\"quotes"`);
  });

  it("represents symbols", () => {
    expect(repr(Symbol("test"))).toBe("Symbol(test)");
    expect(repr(Symbol())).toBe("Symbol()");
    expect(repr(Symbol.iterator)).toBe("Symbol(Symbol.iterator)");
  });

  it("represents functions", () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    function namedFunc(): void {
      /* empty */
    }
    expect(repr(namedFunc)).toBe("function namedFunc(){}");
    expect(
      repr(() => {
        /* empty */
      }),
    ).toBe("function anonymous(){}");
    expect(
      repr(function () {
        /* empty */
      }),
    ).toBe("function anonymous(){}");
  });

  it("represents arrays", () => {
    expect(repr([1, 2, 3])).toBe("[1,2,3]");
    expect(repr([])).toBe("[]");
    expect(repr(["a", "b", "c"])).toBe('["a","b","c"]');
    expect(repr([1, "two", true, null])).toBe('[1,"two",true,null]');
  });

  it("represents nested arrays", () => {
    expect(repr([1, [2, 3], 4])).toBe("[1,[2,3],4]");
    expect(
      repr([
        [1, 2],
        [3, 4],
      ]),
    ).toBe("[[1,2],[3,4]]");
  });

  it("represents arrays with exactly 10 items", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(repr(arr)).toBe("[1,2,3,4,5,6,7,8,9,10]");
  });

  it("represents arrays with more than 10 items", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    expect(repr(arr)).toBe("[1,2,3,...,11,12,13]");
  });

  it("represents Maps", () => {
    const map = new Map([
      ["a", 1],
      ["b", 2],
    ]);
    expect(repr(map)).toBe('Map([["a",1],["b",2]])');
    expect(repr(new Map())).toBe("Map([])");
  });

  it("represents Sets", () => {
    const set = new Set([1, 2, 3]);
    expect(repr(set)).toBe("Set([1,2,3])");
    expect(repr(new Set())).toBe("Set([])");
    expect(repr(new Set(["a", "b"]))).toBe('Set(["a","b"])');
  });

  it("represents WeakMap and WeakSet", () => {
    expect(repr(new WeakMap())).toBe("WeakMap{}");
    expect(repr(new WeakSet())).toBe("WeakSet{}");
  });

  it("represents Dates", () => {
    const date = new Date("2024-01-15T12:30:00.000Z");
    expect(repr(date)).toBe('Date("2024-01-15T12:30:00.000Z")');
    expect(repr(new Date("invalid"))).toBe('Date("Invalid")');
  });

  it("represents RegExp", () => {
    expect(repr(/test/g)).toBe("/test/g");
    expect(repr(/^[a-z]+$/i)).toBe("/^[a-z]+$/i");
    expect(repr(/\d{3}-\d{4}/)).toBe(String.raw`/\d{3}-\d{4}/`);
  });

  it("represents Promises", () => {
    expect(repr(Promise.resolve(1))).toBe("Promise{}");
    expect(
      repr(
        new Promise(() => {
          /* empty */
        }),
      ),
    ).toBe("Promise{}");
  });

  it("represents TypedArrays", () => {
    expect(repr(new Uint8Array(10))).toBe("Uint8Array (10 bytes)");
    expect(repr(new Int32Array(5))).toBe("Int32Array (20 bytes)");
    expect(repr(new Float64Array(3))).toBe("Float64Array (24 bytes)");
  });

  it("represents URLs", () => {
    expect(repr(new URL("https://example.com"))).toBe(
      'URL("https://example.com/")',
    );
    expect(repr(new URL("https://example.com/path?query=1"))).toBe(
      'URL("https://example.com/path?query=1")',
    );
  });

  it("represents Errors", () => {
    const error = new Error("test error");
    const result = repr(error);
    expect(result).toContain('Error("test error")');
    expect(result).toContain("stack=");
  });

  it("represents Errors with cause", () => {
    const cause = new Error("root cause");
    const error = new Error("wrapper", { cause });
    const result = repr(error);
    expect(result).toContain('Error("wrapper")');
    expect(result).toContain("cause=");
  });

  it("represents custom Error types", () => {
    const error = new TypeError("type error");
    const result = repr(error);
    expect(result).toContain('TypeError("type error")');
  });

  it("represents plain objects", () => {
    expect(repr({ a: 1, b: 2 })).toBe('{"a":1,"b":2}');
    expect(repr({})).toBe("{}");
    expect(repr({ nested: { value: 42 } })).toBe('{"nested":{"value":42}}');
  });

  it("represents objects with null prototype", () => {
    const obj = Object.create(null);
    obj.a = 1;
    expect(repr(obj)).toBe('Object.create(null) {"a":1}');
  });

  it("represents custom class instances", () => {
    class CustomClass {
      value = 42;
    }
    const instance = new CustomClass();
    const result = repr(instance);
    expect(result).toContain("CustomClass");
    expect(result).toContain('"value":42');
  });

  it("handles circular references", () => {
    const obj: { self?: unknown } = {};
    obj.self = obj;
    const result = repr(obj);
    expect(result).toContain("[Circular]");
  });

  it("handles circular references in arrays", () => {
    const arr: unknown[] = [1, 2];
    arr.push(arr);
    const result = repr(arr);
    expect(result).toContain("[Circular]");
  });

  it("handles unserializable objects", () => {
    const obj = {};
    Object.defineProperty(obj, "prop", {
      get() {
        throw new TypeError("big trouble");
      },
      enumerable: true,
    });
    const result = repr(obj);
    expect(result).toContain("[Unserializable");
  });

  it("handles objects with more than 10 properties", () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
      g: 7,
      h: 8,
      i: 9,
      j: 10,
      k: 11,
      l: 12,
    };
    const result = repr(obj);
    expect(result).toContain("...");
    expect(result).toContain('"a":1');
    expect(result).toContain('"l":12');
  });

  it("handles non-TypeError when accessing object entries", () => {
    const obj = {};
    Object.defineProperty(obj, "prop", {
      get() {
        throw new RangeError("non-type error");
      },
      enumerable: true,
    });
    expect(() => repr(obj)).toThrow(RangeError);
  });

  it("represents mixed nested structures", () => {
    const complex = {
      arr: [1, 2, { nested: "value" }],
      map: new Map([["key", [1, 2, 3]]]),
      set: new Set([true, false]),
    };
    const result = repr(complex);
    expect(result).toContain("[1,2,3]");
    expect(result).toContain("Map");
    expect(result).toContain("Set");
  });
});
