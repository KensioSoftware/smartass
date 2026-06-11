import { AssertionError } from "../../assertion-error.js";
import { desc, repr } from "../../describe/describe.js";

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
): asserts value is T & { [P in K]: P extends keyof T ? T[P] : unknown } {
  if (!(key in value)) {
    throw new AssertionError(
      message ?? `Expected ${desc(value)} to have property ${repr(key)}.`,
      value,
      [key],
    );
  }
}
