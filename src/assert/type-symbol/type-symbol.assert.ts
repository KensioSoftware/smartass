import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import { typeSymbol } from "./type-symbol.match.js";

/**
 * Assert that a value is of type symbol, with type-narrowing.
 * @example
 * ```ts
 * import { assertTypeSymbol } from "@kensio/smartass";
 *
 * const value: unknown = Symbol("id");
 *
 * assertTypeSymbol(value);
 *
 * // value is now narrowed to symbol
 * ```
 */
export function assertTypeSymbol(
  value: unknown,
  message = `Expected ${desc(value)} to be of type symbol.`,
): asserts value is symbol {
  const matcher = typeSymbol();
  if (!matcher.matches(value)) {
    throw new AssertionError(message, value, matcher.represent());
  }
}
