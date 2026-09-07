import { describe, expect, expectTypeOf, it } from "vitest";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";
import { assertSetNotIncludes } from "./set-not-includes.assert.js";
import { setNotIncluding } from "./set-not-includes.match.js";

describe("set-not-includes", () => {
  describe("assertSetNotIncludes", () => {
    it("does not throw when the Set lacks the member", () => {
      expect(() => {
        assertSetNotIncludes(new Set(["draft"]), "archived");
      }).not.toThrow();
    });

    it("throws when the Set holds the member", () => {
      expect(() => {
        assertSetNotIncludes(new Set(["draft", "featured"]), "draft");
      }).toThrow(
        'Expected Set(["draft","featured"]) (size 2) not to include string "draft", but it did.',
      );
    });

    it("throws with a custom message", () => {
      expect(() => {
        assertSetNotIncludes(
          new Set(["draft"]),
          "draft",
          "Custom error message",
        );
      }).toThrow("Custom error message");
    });

    it("throws on null", () => {
      expect(() => {
        assertSetNotIncludes(null, "draft");
      }).toThrow('Expected null to be a Set not including string "draft".');
    });

    it("throws on undefined", () => {
      expect(() => {
        assertSetNotIncludes(undefined, "draft");
      }).toThrow(
        'Expected undefined to be a Set not including string "draft".',
      );
    });

    it("throws on non-Sets", () => {
      expect(() => {
        assertSetNotIncludes(["featured"], "draft");
      }).toThrow(
        'Expected array ["featured"] (len 1) to be a Set not including string "draft".',
      );
    });

    it("passes for an equal-valued object held under another reference", () => {
      expect(() => {
        assertSetNotIncludes(new Set([{ name: "draft" }]), { name: "draft" });
      }).not.toThrow();
    });

    it("narrows an unknown value to a Set", () => {
      const value: unknown = new Set(["draft"]);

      assertSetNotIncludes(value, "archived");

      expectTypeOf(value).toEqualTypeOf<ReadonlySet<unknown>>();
      expect(value.size).toBe(1);
    });

    it("preserves a Set type the calling scope already knows", () => {
      const value = new Set<"draft" | "featured">(["draft"]);

      assertSetNotIncludes(value, "featured");

      expectTypeOf(value).toEqualTypeOf<Set<"draft" | "featured">>();
      expect(value.size).toBe(1);
    });
  });

  describe("setNotIncluding", () => {
    it("works as a composable matcher", () => {
      interface Article {
        meta?: { tags?: Set<string> };
      }

      function getArticle(): Article {
        return { meta: { tags: new Set(["draft"]) } };
      }

      const article = getArticle();

      assertObjectMatches(article, {
        meta: { tags: setNotIncluding("archived") },
      });

      expectTypeOf(article.meta.tags).toEqualTypeOf<Set<string>>();
      expect(article.meta.tags.has("archived")).toBe(false);
    });

    it("refines an unknown property to a Set", () => {
      interface Article {
        tags?: unknown;
      }

      function getArticle(): Article {
        return { tags: new Set(["draft"]) };
      }

      const article = getArticle();

      assertObjectMatches(article, { tags: setNotIncluding("archived") });

      expectTypeOf(article.tags).toEqualTypeOf<ReadonlySet<unknown>>();
      expect(article.tags.size).toBe(1);
    });

    it("matches Sets without the member", () => {
      const matcher = setNotIncluding("archived");

      expect(matcher.isMatch(new Set(["draft"]))).toBe(true);
      expect(matcher.isMatch(new Set(["archived"]))).toBe(false);
    });

    it("does not match non-Sets", () => {
      const matcher = setNotIncluding("archived");

      expect(matcher.isMatch(["draft"])).toBe(false);
      expect(matcher.isMatch("draft")).toBe(false);
      expect(matcher.isMatch(null)).toBe(false);
    });

    it("describes the setNotIncluding matcher", () => {
      const matcher = setNotIncluding("archived");

      expect(desc(matcher)).toBe('Set not including string "archived"');
      expect(repr(matcher)).toBe('Set([…,✗"archived"✗,…])');
    });
  });
});
