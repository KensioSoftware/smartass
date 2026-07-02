import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import { objectWithProperty } from "./object-has-property.match.js";
import type { ObjectWithProperty } from "./object-has-property.type.js";

export function assertObjectHasProperty<
  T extends object,
  K extends PropertyKey,
>(
  value: T,
  key: K,
  message?: string,
): asserts value is T & ObjectWithProperty<K, T>;

export function assertObjectHasProperty<K extends PropertyKey>(
  value: unknown,
  key: K,
  message?: string,
): asserts value is ObjectWithProperty<K>;

/**
 * Assert that an object has a certain named property.
 * The property only has to exist on the object, but could be undefined.
 * @example
 * ```ts
 * import { assertObjectHasProperty } from "@kensio/smartass";
 *
 * const user: object = { name: "Ada" };
 *
 * assertObjectHasProperty(user, "name");
 *
 * // user is now narrowed to an object with a "name" property
 * ```
 */
export function assertObjectHasProperty(
  value: unknown,
  key: PropertyKey,
  message?: string,
): void {
  const matcher = objectWithProperty(key);

  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ?? `Expected ${desc(value)} to be ${matcher.describe()}.`,
      value,
      matcher.represent(),
    );
  }
}
