import { existsSync } from "node:fs";
import path from "node:path";

import { AssertionError } from "../../assertion-error.js";
import { repr } from "../../describe/describe.js";

/**
 * Assert that a filesystem path exists.
 */
export function assertPathExists(
  filePath: string | string[],
  message?: string,
): void {
  const resolvedPath = Array.isArray(filePath)
    ? path.join(...filePath)
    : filePath;

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (!existsSync(resolvedPath)) {
    throw new AssertionError(
      message ??
        `Expected path ${repr(resolvedPath)} to exist, but it did not.`,
      resolvedPath,
      "existing path",
    );
  }
}
