import { describe, expect, it } from "vitest";
import { assertObjectMatches } from "./object-matches.assert.js";
import {
  type ArrayIncluding,
  arrayIncluding,
} from "../array-includes/array-includes.match.js";

describe("object-matches", () => {
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
      'Expected object {"id":1,"tags":["hello"]} to match object {"id":1,"tags":["foobar"]}. Mismatch at $.tags: expected ["foobar"], got ["hello"].',
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

    const id: 1 = actual.id;
    const tags: ArrayIncluding<unknown, "foobar"> = actual.tags;

    expect(id).toBe(1);
    expect(tags.includes("foobar")).toBe(true);
  });
});
