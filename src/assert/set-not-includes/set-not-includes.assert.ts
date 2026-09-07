import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import { setNotIncluding } from "./set-not-includes.match.js";
import type { SetNotIncludingMatch } from "./set-not-includes.type.js";

export function assertSetNotIncludes<
  TSet extends ReadonlySet<unknown>,
  const TMember,
>(
  value: TSet,
  unexpectedMember: TMember,
  message?: string,
): asserts value is TSet & SetNotIncludingMatch<TSet>;

export function assertSetNotIncludes<const TMember>(
  value: unknown,
  unexpectedMember: TMember,
  message?: string,
): asserts value is ReadonlySet<unknown>;

/**
 * Assert that a Set does not include a specific member, with type narrowing.
 * Membership uses the Set's own has(), which is a SameValueZero match, so an
 * object only fails the assertion by being a reference the Set already holds,
 * rather than equivalent in value to a member.
 * Note that absence has no type-level witness, so this narrows an unknown value
 * to a Set and stops there.
 * @example
 * ```ts
 * import { assertSetNotIncludes } from "@kensio/smartass";
 *
 * const value: unknown = new Set(["draft", "featured"]);
 *
 * assertSetNotIncludes(value, "archived");
 *
 * // value is now narrowed to ReadonlySet<unknown>
 * ```
 */
export function assertSetNotIncludes(
  value: unknown,
  unexpectedMember: unknown,
  message?: string,
): void {
  const matcher = setNotIncluding(unexpectedMember);

  if (!matcher.isMatch(value)) {
    throw new AssertionError(
      message ?? buildSetNotIncludesMessage(value, unexpectedMember),
      value,
      matcher.represent(),
    );
  }
}

function buildSetNotIncludesMessage(
  value: unknown,
  unexpectedMember: unknown,
): string {
  if (!(value instanceof Set)) {
    return `Expected ${desc(value)} to be a Set not including ${desc(unexpectedMember)}.`;
  }

  return `Expected ${desc(value)} not to include ${desc(unexpectedMember)}, but it did.`;
}
