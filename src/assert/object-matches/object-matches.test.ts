import { describe, expect, expectTypeOf, it } from "vitest";
import { assertObjectMatches } from "./object-matches.assert.js";
import { arrayIncluding } from "../array-includes/array-includes.match.js";
import { arrayOfLength } from "../array-length/array-length.match.js";
import { stringOfLength } from "../string-length/string-length.match.js";
import { oneOf } from "../one-of/one-of.match.js";

describe("object-matches", () => {
  describe("matching literals", () => {
    it("does not throw when object matches expected properties", () => {
      expect(() => {
        assertObjectMatches(
          { id: 1, name: "Alice", extra: true },
          { id: 1, name: "Alice" },
        );
      }).not.toThrow();
    });

    it("does not throw when nested object matches", () => {
      expect(() => {
        assertObjectMatches(
          { user: { id: 1, name: "Alice", active: true } },
          { user: { id: 1, name: "Alice" } },
        );
      }).not.toThrow();
    });

    it("does not throw when arrays match", () => {
      expect(() => {
        assertObjectMatches({ values: [1, 2, 3] }, { values: [1, 2, 3] });
      }).not.toThrow();
    });

    it("throws when a property is missing", () => {
      expect(() => {
        assertObjectMatches({ id: 1 }, { id: 1, name: "Alice" });
      }).toThrow(
        'Expected object {"id":1} to match object {"id":1,"name":"Alice"}. Mismatch at $.name: expected "Alice", got undefined.',
      );
    });

    it("throws when a nested value does not match", () => {
      expect(() => {
        assertObjectMatches(
          { user: { id: 1, name: "Alice" } },
          { user: { id: 2 } },
        );
      }).toThrow(
        'Expected object {"user":{"id":1,"name":"Alice"}} to match object {"user":{"id":2}}. Mismatch at $.user.id: expected 2, got 1.',
      );
    });

    it("throws when array length does not match", () => {
      expect(() => {
        assertObjectMatches({ values: [1, 2, 3] }, { values: [1, 2] });
      }).toThrow(
        'Expected object {"values":[1,2,3]} to match object {"values":[1,2]}. Mismatch at $.values.length: expected 2, got 3.',
      );
    });

    it("throws when expected array receives non-array", () => {
      expect(() => {
        assertObjectMatches({ values: "nope" }, { values: [1] });
      }).toThrow(
        'Expected object {"values":"nope"} to match object {"values":[1]}. Mismatch at $.values: expected [1], got "nope".',
      );
    });

    it("throws when array element does not match", () => {
      expect(() => {
        assertObjectMatches({ values: [1, 3] }, { values: [1, 2] });
      }).toThrow(
        'Expected object {"values":[1,3]} to match object {"values":[1,2]}. Mismatch at $.values[1]: expected 2, got 3.',
      );
    });

    it("throws when expected object receives an array", () => {
      expect(() => {
        assertObjectMatches([], { id: 1 });
      }).toThrow(
        'Expected array [] (len 0) to match object {"id":1}. Mismatch at $: expected {"id":1}, got [].',
      );
    });

    it("formats paths for non-identifier and symbol keys", () => {
      const key = Symbol("id");

      expect(() => {
        assertObjectMatches({ "not-valid": 1 }, { "not-valid": 2 });
      }).toThrow('Mismatch at $["not-valid"]: expected 2, got 1.');

      expect(() => {
        assertObjectMatches({}, { [key]: 1 });
      }).toThrow("Mismatch at $[Symbol(id)]: expected 1, got undefined.");
    });

    it("throws with custom message", () => {
      expect(() => {
        assertObjectMatches({ id: 1 }, { id: 2 }, "Custom error message");
      }).toThrow("Custom error message");
    });

    it("does not throw when nested matcher matches", () => {
      expect(() => {
        assertObjectMatches(
          { id: 1, tags: ["foobar", "assertions"] },
          { id: 1, tags: arrayIncluding("foobar") },
        );
      }).not.toThrow();
    });

    it("throws when nested matcher does not match", () => {
      expect(() => {
        assertObjectMatches(
          { id: 1, tags: ["hello"] },
          { id: 1, tags: arrayIncluding("foobar") },
        );
      }).toThrow(
        'Expected object {"id":1,"tags":["hello"]} to match object {"id":1,"tags":[…,"foobar",…]}. Mismatch at $.tags: expected […,"foobar",…], got ["hello"].',
      );
    });

    it("narrows nested matcher values precisely", () => {
      const actual: unknown = {
        id: 1,
        tags: ["foobar", "assertions"],
      };

      assertObjectMatches(actual, {
        id: 1,
        tags: arrayIncluding("foobar"),
      });

      expectTypeOf(actual.tags).toEqualTypeOf<["foobar", ...unknown[]]>();

      const id: 1 = actual.id;
      const tags = actual.tags;

      expect(id).toBe(1);
      expect(tags.includes("foobar")).toBe(true);
    });
  });

  describe("matching composable matchers", () => {
    it("matches on single assertion matcher", () => {
      interface Foo {
        bar?: { foobar?: string[] };
      }

      function getFoo(): Foo {
        return { bar: { foobar: ["a", "b", "c"] } };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: arrayIncluding("a") },
      });

      // Null-chain operator ? is not required after type narrowing.
      // TypeScript now knows foobar is an array containing an element "a".
      const foobar = foo.bar.foobar;

      expect(foobar).toContain("a");
    });

    it("matches on mixed literals and assertion matchers", () => {
      interface Foo {
        bar?: { foobar?: string[] };
        something?: { nested?: { leaf?: string } };
        somethingElse?: object;
      }

      function getFoo(): Foo {
        return {
          bar: { foobar: ["a", "b", "c"] },
          something: { nested: { leaf: "LEAF" } },
          somethingElse: { hello: "yes" },
        };
      }

      const foo = getFoo();

      assertObjectMatches(foo, {
        bar: { foobar: arrayOfLength(3) },
        something: { nested: { leaf: stringOfLength(4) } },
        somethingElse: { hello: "yes" },
      });

      // TypeScript knows foo.bar.foobar is an array of 3 string elements.
      const foobar: [string, string, string] = foo.bar.foobar;
      const thirdFoobar = foobar[2];
      expect(foobar.includes("a")).toBe(true);
      expect(thirdFoobar).toBe("c");

      // TypeScript knows foo.something.nested.leaf is a string of 4 characters.
      const fourthLetter: string = foo.something.nested.leaf[3];
      expect(fourthLetter).toBe("F");

      // TypeScript knows hello is a literal string "yes".
      const yes: "yes" = foo.somethingElse.hello;
      expect(yes).toBe("yes");
    });
  });

  it("works with example from README", () => {
    interface User {
      role?: string | null;
      tags?: string[] | null;
      id?: string | null;
    }

    function getUser(): User {
      return {
        role: "editor",
        tags: ["beta", "pro"],
        id: "123",
      };
    }

    const user = getUser();
    expectTypeOf(user).toEqualTypeOf<User>();
    expectTypeOf(user.role).toEqualTypeOf<string | null | undefined>();
    expectTypeOf(user.tags).toEqualTypeOf<string[] | null | undefined>();
    expectTypeOf(user.id).toEqualTypeOf<string | null | undefined>();

    assertObjectMatches(user, {
      role: oneOf(["admin", "editor", "viewer"]),
      tags: arrayIncluding("beta"),
      id: stringOfLength(3),
    });

    expectTypeOf(user).not.toEqualTypeOf<User>();
    expectTypeOf(user.role).not.toEqualTypeOf<string>();
    expectTypeOf(user.tags).not.toEqualTypeOf<string[]>();
    expectTypeOf(user.id).not.toEqualTypeOf<string>();

    expectTypeOf(user).toExtend<{
      role: "admin" | "editor" | "viewer";
      tags: ["beta", ...string[]];
      id: string & { length: 3; 0: string; 1: string; 2: string };
    }>();
    expectTypeOf(user.role).toEqualTypeOf<"admin" | "editor" | "viewer">();
    expectTypeOf(user.tags).toEqualTypeOf<["beta", ...string[]]>();
    expectTypeOf(user.id).toEqualTypeOf<
      string & { length: 3; 0: string; 1: string; 2: string }
    >();

    expect(user.role).toBeTypeOf("string");
    expect(user.tags).toBeTypeOf("object");
    expect(user.id).toBeTypeOf("string");
  });
});
