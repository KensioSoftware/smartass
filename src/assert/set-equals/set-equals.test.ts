import { describe, expect, expectTypeOf, it } from "vitest";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectEquals } from "../object-equals/object-equals.assert.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";
import { assertSetEquals } from "./set-equals.assert.js";
import { setOf } from "./set-equals.match.js";

class Tag {
  constructor(public readonly name: string) {}
}

describe("set-equals", () => {
  describe("assertSetEquals", () => {
    it("does not throw when the Sets hold the same members", () => {
      expect(() => {
        assertSetEquals(new Set(["a", "b"]), new Set(["a", "b"]));
      }).not.toThrow();
    });

    it("ignores insertion order", () => {
      expect(() => {
        assertSetEquals(new Set(["b", "a"]), new Set(["a", "b"]));
      }).not.toThrow();
    });

    it("reports a member the expected Set holds and the actual Set lacks", () => {
      expect(() => {
        assertSetEquals(new Set(["a"]), new Set(["a", "b"]));
      }).toThrow(
        'Expected Set(["a"]) (size 1) to equal Set(["a","b"]) (size 2), missing ["b"].',
      );
    });

    it("reports a member the actual Set holds and the expected Set lacks", () => {
      expect(() => {
        assertSetEquals(new Set(["a", "b"]), new Set(["a"]));
      }).toThrow(
        'Expected Set(["a","b"]) (size 2) to equal Set(["a"]) (size 1), unexpected ["b"].',
      );
    });

    it("reports both sides when the Sets are the same size", () => {
      expect(() => {
        assertSetEquals(new Set(["a", "b"]), new Set(["a", "c"]));
      }).toThrow(
        'Expected Set(["a","b"]) (size 2) to equal Set(["a","c"]) (size 2), missing ["c"], unexpected ["b"].',
      );
    });

    it("matches empty Sets", () => {
      expect(() => {
        assertSetEquals(new Set(), new Set());
      }).not.toThrow();
    });

    it("throws with a custom message", () => {
      expect(() => {
        assertSetEquals(new Set(), new Set(["a"]), "Custom error message");
      }).toThrow("Custom error message");
    });

    it("throws on null", () => {
      expect(() => {
        assertSetEquals(null, new Set(["a"]));
      }).toThrow('Expected null to be a Set equal to Set(["a"]) (size 1).');
    });

    it("throws on undefined", () => {
      expect(() => {
        assertSetEquals(undefined, new Set(["a"]));
      }).toThrow(
        'Expected undefined to be a Set equal to Set(["a"]) (size 1).',
      );
    });

    it("throws on non-Sets", () => {
      expect(() => {
        assertSetEquals(["a"], new Set(["a"]));
      }).toThrow(
        'Expected array ["a"] (len 1) to be a Set equal to Set(["a"]) (size 1).',
      );
    });

    it("compares plain object members by value", () => {
      expect(() => {
        assertSetEquals(
          new Set([{ id: 1 }, { id: 2 }]),
          new Set([{ id: 2 }, { id: 1 }]),
        );
      }).not.toThrow();
    });

    it("requires object members to match on every key", () => {
      expect(() => {
        assertSetEquals(
          new Set([{ id: 1, draft: true }]),
          new Set([{ id: 1 }]),
        );
      }).toThrow('missing [{"id":1}], unexpected [{"id":1,"draft":true}]');
    });

    it("compares nested array members by value", () => {
      expect(() => {
        assertSetEquals(new Set([["a", "b"]]), new Set([["a", "b"]]));
      }).not.toThrow();
    });

    it("compares Date members by the instant they hold", () => {
      expect(() => {
        assertSetEquals(
          new Set([new Date("2026-01-01T00:00:00.000Z")]),
          new Set([new Date("2026-01-01T00:00:00.000Z")]),
        );
      }).not.toThrow();
    });

    it("compares class instance members through Object.is", () => {
      const tag = new Tag("draft");

      expect(() => {
        assertSetEquals(new Set([tag]), new Set([tag]));
      }).not.toThrow();

      expect(() => {
        assertSetEquals(
          new Set([new Tag("draft")]),
          new Set([new Tag("draft")]),
        );
      }).toThrow("to equal");
    });

    it("pairs NaN members with each other", () => {
      expect(() => {
        assertSetEquals(new Set([Number.NaN]), new Set([Number.NaN]));
      }).not.toThrow();
    });

    it("pairs 0 with -0, which a Set normalises on the way in", () => {
      // Set.prototype.add stores -0 as +0, so Object.is never sees the two
      // apart here the way it does for an array member.
      expect(Object.is([...new Set([-0])][0], 0)).toBe(true);

      expect(() => {
        assertSetEquals(new Set([0]), new Set([-0]));
      }).not.toThrow();
    });

    it("reports equal-valued object members greedy pairing leaves over", () => {
      expect(() => {
        assertSetEquals(
          new Set([{ a: 1 }, { a: 2 }]),
          new Set([{ a: 1 }, { a: 1 }]),
        );
      }).toThrow('missing [{"a":1}], unexpected [{"a":2}]');
    });

    it("narrows an unknown value to the expected Set type", () => {
      const value: unknown = new Set(["draft", "featured"]);

      assertSetEquals(value, new Set(["draft", "featured"] as const));

      expectTypeOf(value).toEqualTypeOf<Set<"draft" | "featured">>();
      expect(value.size).toBe(2);
    });

    it("keeps a wider member type when the expected Set has one", () => {
      const value: unknown = new Set(["draft"]);

      assertSetEquals(value, new Set<string>(["draft"]));

      expectTypeOf(value).toEqualTypeOf<Set<string>>();
      expect(value.has("draft")).toBe(true);
    });
  });

  describe("nested Sets", () => {
    it("compares Sets held on an object by value", () => {
      expect(() => {
        assertObjectEquals(
          { tags: new Set(["draft", "featured"]) },
          { tags: new Set(["featured", "draft"]) },
        );
      }).not.toThrow();
    });

    it("reports the size of a nested Set that differs", () => {
      expect(() => {
        assertObjectEquals(
          { tags: new Set(["draft"]) },
          { tags: new Set(["draft", "featured"]) },
        );
      }).toThrow("Mismatch at $.tags.size: expected 2, got 1.");
    });

    it("reports a member a nested Set lacks", () => {
      expect(() => {
        assertObjectEquals(
          { tags: new Set(["draft"]) },
          { tags: new Set(["featured"]) },
        );
      }).toThrow(
        'Mismatch at $.tags.members: expected "featured", got Set(["draft"]).',
      );
    });

    it("reports a non-Set held where a Set is expected", () => {
      expect(() => {
        assertObjectEquals({ tags: ["draft"] }, { tags: new Set(["draft"]) });
      }).toThrow('Mismatch at $.tags: expected Set(["draft"]), got ["draft"].');
    });
  });

  describe("setOf", () => {
    it("works as a composable matcher", () => {
      interface Article {
        meta?: { tags?: Set<string> };
      }

      function getArticle(): Article {
        return { meta: { tags: new Set(["draft", "featured"]) } };
      }

      const article = getArticle();

      assertObjectMatches(article, {
        meta: { tags: setOf(new Set(["draft", "featured"] as const)) },
      });

      expectTypeOf(article.meta.tags).toEqualTypeOf<
        Set<"draft" | "featured">
      >();
      expect(article.meta.tags.size).toBe(2);
    });

    it("refines an unknown property to a ReadonlySet", () => {
      interface Article {
        tags?: unknown;
      }

      function getArticle(): Article {
        return { tags: new Set(["draft"]) };
      }

      const article = getArticle();

      assertObjectMatches(article, {
        tags: setOf(new Set(["draft"] as const)),
      });

      expectTypeOf(article.tags).toEqualTypeOf<ReadonlySet<"draft">>();
      expect(article.tags.size).toBe(1);
    });

    it("matches a Set holding the expected members", () => {
      const matcher = setOf(new Set(["a", "b"]));

      expect(matcher.isMatch(new Set(["b", "a"]))).toBe(true);
      expect(matcher.isMatch(new Set(["a"]))).toBe(false);
      expect(matcher.isMatch(new Set(["a", "b", "c"]))).toBe(false);
    });

    it("does not match non-Sets", () => {
      const matcher = setOf(new Set(["a"]));

      expect(matcher.isMatch(["a"])).toBe(false);
      expect(matcher.isMatch({ a: 1 })).toBe(false);
      expect(matcher.isMatch(null)).toBe(false);
    });

    it("describes the setOf matcher", () => {
      const matcher = setOf(new Set(["a", "b"]));

      expect(desc(matcher)).toBe('Set equal to Set(["a","b"]) (size 2)');
      expect(repr(matcher)).toBe('Set(["a","b"])');
    });
  });
});
