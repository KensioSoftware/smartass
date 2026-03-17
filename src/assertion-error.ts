/**
 * An assertion failed.
 * Provide helpful string message, as well as actual and expected properties to
 * allow test frameworks to display better diffs.
 */
export class AssertionError extends Error {
  override name = "AssertionError" as const;
  showDiff = true;

  constructor(
    message: string,
    public actual: unknown,
    public expected: unknown,
  ) {
    super(message);
  }
}
