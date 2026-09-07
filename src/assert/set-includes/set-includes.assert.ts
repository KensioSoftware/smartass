import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import { setIncluding } from "./set-includes.match.js";
import type { SetIncludingMatch } from "./set-includes.type.js";

export function assertSetIncludes<
  TSet extends ReadonlySet<unknown>,
  const TMember,
>(
  value: TSet,
  member: TMember,
  message?: string,
): asserts value is TSet & SetIncludingMatch<TSet, TMember>;

export function assertSetIncludes<const TMember>(
  value: unknown,
  member: TMember,
  message?: string,
): asserts value is ReadonlySet<TMember>;

/**
 * Assert that a Set includes a specific member, with type narrowing.
 * Membership uses the Set's own has(), which is a SameValueZero match, so an
 * object only fulfills the assertion by being a reference the Set already
 * holds, rather than equivalent in value to a member. assertSetEquals()
 * compares members by value.
 * Note that presence has no type-level witness the way an array's leading tuple
 * slot gives one, so this narrows an unknown value to a Set of the member type
 * and stops there.
 * @example
 * ```ts
 * import { assertSetIncludes } from "@kensio/smartass";
 *
 * const value: unknown = new Set(["draft", "featured"]);
 *
 * assertSetIncludes(value, "draft");
 *
 * // value is now narrowed to ReadonlySet<"draft">
 * ```
 */
export function assertSetIncludes(
  value: unknown,
  member: unknown,
  message?: string,
): void {
  const matcher = setIncluding(member);

  if (!matcher.isMatch(value)) {
    throw new AssertionError(
      message ?? buildSetIncludesMessage(value, member),
      value,
      matcher.represent(),
    );
  }
}

function buildSetIncludesMessage(value: unknown, member: unknown): string {
  if (!(value instanceof Set)) {
    return `Expected ${desc(value)} to be a Set including ${desc(member)}.`;
  }

  return `Expected ${desc(value)} to include ${desc(member)}, but it did not.`;
}
