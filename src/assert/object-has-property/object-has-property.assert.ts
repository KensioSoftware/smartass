import { AssertionError } from "../../assertion-error.js";
import { desc } from "../../describe/describe.js";
import {
  objectWithProperty,
  type ObjectWithProperty,
} from "./object-has-property.match.js";

/**
 * Assert that an object has a certain named property.
 * The property only has to exist on the object, but could be undefined.
 */
export function assertObjectHasProperty<
  T extends object,
  K extends PropertyKey,
>(
  value: T,
  key: K,
  message?: string,
): asserts value is T & ObjectWithProperty<K> {
  const matcher = objectWithProperty(key);

  if (!matcher.matches(value)) {
    throw new AssertionError(
      message ?? `Expected ${desc(value)} to be ${matcher.describe()}.`,
      value,
      matcher.represent(),
    );
  }
}
