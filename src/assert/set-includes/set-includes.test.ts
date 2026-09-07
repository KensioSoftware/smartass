import { describe, expect, expectTypeOf, it } from "vitest";
import { desc, repr } from "../../describe/describe.js";
import { assertObjectMatches } from "../object-matches/object-matches.assert.js";
import { assertSetIncludes } from "./set-includes.assert.js";
import { setIncluding } from "./set-includes.match.js";

describe("set-includes", () => {
  describe("assertSetIncludes", () => {
    it("does not throw when the Set holds the member", () => {
      expect(() => {
        assertSetIncludes(new Set(["draft", "featured"]), "draft");
      }).not.toThrow();
    });

    it("throws when the Set lacks the member", () => {
      expect(() => {
        assertSetIncludes(new Set(["draft"]), "archived");
      }).toThrow(
        'Expected Set(["draft"]) (size 1) to include string "archived", but it did not.',
      );
    });

    it("throws with a custom message", () => {
      expect(() => {
        assertSetIncludes(new Set(), "draft", "Custom error message");
      }).toThrow("Custom error message");
    });

    it("throws on null", () => {
      expect(() => {
        assertSetIncludes(null, "draft");
      }).toThrow('Expected null to be a Set including string "draft".');
    });

    it("throws on undefined", () => {
      expect(() => {
        assertSetIncludes(undefined, "draft");
      }).toThrow('Expected undefined to be a Set including string "draft".');
    });

    it("throws on non-Sets", () => {
      expect(() => {
        assertSetIncludes(["draft"], "draft");
      }).toThrow(
        'Expected array ["draft"] (len 1) to be a Set including string "draft".',
      );
    });

    it("matches object members by identity", () => {
      const tag = { name: "draft" };

      expect(() => {
        assertSetIncludes(new Set([tag]), tag);
      }).not.toThrow();

      expect(() => {
        assertSetIncludes(new Set([{ name: "draft" }]), { name: "draft" });
      }).toThrow("but it did not");
    });

    it("finds NaN, which a Set matches by SameValueZero", () => {
      expect(() => {
        assertSetIncludes(new Set([Number.NaN]), Number.NaN);
      }).not.toThrow();
    });

    it("narrows an unknown value to a Set of the member type", () => {
      const value: unknown = new Set(["draft", "featured"]);

      assertSetIncludes(value, "draft");

      expectTypeOf(value).toEqualTypeOf<ReadonlySet<"draft">>();
      expect(value.has("draft")).toBe(true);
    });

    it("preserves a Set type the calling scope already knows", () => {
      const value = new Set<"draft" | "featured">(["draft", "featured"]);

      assertSetIncludes(value, "draft");

      expectTypeOf(value).toEqualTypeOf<Set<"draft" | "featured">>();
      expect(value.size).toBe(2);
    });
  });

  describe("setIncluding", () => {
    it("works as a composable matcher", () => {
      interface Article {
        meta?: { tags?: Set<string> };
      }

      function getArticle(): Article {
        return { meta: { tags: new Set(["draft", "featured"]) } };
      }

      const article = getArticle();

      assertObjectMatches(article, {
        meta: { tags: setIncluding("draft") },
      });

      expectTypeOf(article.meta.tags).toEqualTypeOf<Set<string>>();
      expect(article.meta.tags.has("draft")).toBe(true);
    });

    it("refines an unknown property to a Set of the member type", () => {
      interface Article {
        tags?: unknown;
      }

      function getArticle(): Article {
        return { tags: new Set(["draft"]) };
      }

      const article = getArticle();

      assertObjectMatches(article, { tags: setIncluding("draft") });

      expectTypeOf(article.tags).toEqualTypeOf<ReadonlySet<"draft">>();
      expect(article.tags.size).toBe(1);
    });

    it("matches Sets holding the member", () => {
      const matcher = setIncluding("draft");

      expect(matcher.isMatch(new Set(["draft", "featured"]))).toBe(true);
      expect(matcher.isMatch(new Set(["featured"]))).toBe(false);
    });

    it("does not match non-Sets", () => {
      const matcher = setIncluding("draft");

      expect(matcher.isMatch(["draft"])).toBe(false);
      expect(matcher.isMatch("draft")).toBe(false);
      expect(matcher.isMatch(null)).toBe(false);
    });

    it("describes the setIncluding matcher", () => {
      const matcher = setIncluding("draft");

      expect(desc(matcher)).toBe('Set including string "draft"');
      expect(repr(matcher)).toBe('Set([…,"draft",…])');
    });
  });
});
