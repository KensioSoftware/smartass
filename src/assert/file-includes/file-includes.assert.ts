import path from "node:path";

import { AssertionError } from "../../assertion-error.js";
import { repr } from "../../describe/describe.js";
import { hasSubstring } from "../../compare/file-includes.js";

/**
 * Assert that a file includes a given substring.
 * @example
 * ```ts
 * import { assertFileIncludes } from "@kensio/smartass";
 *
 * const filePath = "README.md";
 *
 * assertFileIncludes(filePath, "Installation");
 *
 * // This validates file contents at runtime without changing the path type.
 * ```
 */
export function assertFileIncludes(
  filePath: string | string[],
  substring: string,
  message?: string,
): void {
  const resolvedFilePath = Array.isArray(filePath)
    ? path.join(...filePath)
    : filePath;

  if (!hasSubstring(resolvedFilePath, substring)) {
    throw new AssertionError(
      message ??
        `Expected file ${repr(resolvedFilePath)} to include ${repr(substring)}, but it did not.`,
      resolvedFilePath,
      substring,
    );
  }
}
