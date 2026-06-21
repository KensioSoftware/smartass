import path from "node:path";

import { AssertionError } from "../../assertion-error.js";
import { repr } from "../../describe/describe.js";
import { fileIncludesSubstring } from "../../compare/file-includes.js";

/**
 * Assert that a file does not include a given substring.
 */
export async function assertFileNotIncludes(
  filePath: string | string[],
  substring: string,
  message?: string,
): Promise<void> {
  const resolvedFilePath = Array.isArray(filePath)
    ? path.join(...filePath)
    : filePath;

  if (await fileIncludesSubstring(resolvedFilePath, substring)) {
    throw new AssertionError(
      message ??
        `Expected file ${repr(resolvedFilePath)} not to include ${repr(substring)}, but it did.`,
      resolvedFilePath,
      substring,
    );
  }
}
