import { statSync } from "node:fs";
import path from "node:path";

import { AssertionError } from "../../assertion-error.js";
import { repr } from "../../describe/describe.js";
import { assertPathExists } from "../path-exists/path-exists.assert.js";

/**
 * Assert that a filesystem path exists and is a directory.
 * @example
 * ```ts
 * import { assertDirectoryExists } from "@kensio/smartass";
 *
 * const directoryPath = "src";
 *
 * assertDirectoryExists(directoryPath);
 *
 * // This validates the directory at runtime without changing the path type.
 * ```
 */
export function assertDirectoryExists(
  directoryPath: string | string[],
  message?: string,
): void {
  const resolvedDirectoryPath = Array.isArray(directoryPath)
    ? path.join(...directoryPath)
    : directoryPath;

  assertPathExists(resolvedDirectoryPath, message);

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (!statSync(resolvedDirectoryPath).isDirectory()) {
    throw new AssertionError(
      message ??
        `Expected path ${repr(resolvedDirectoryPath)} to be a directory, but it was not.`,
      resolvedDirectoryPath,
      "directory",
    );
  }
}
