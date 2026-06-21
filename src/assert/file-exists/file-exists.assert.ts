import { statSync } from "node:fs";
import path from "node:path";

import { AssertionError } from "../../assertion-error.js";
import { repr } from "../../describe/describe.js";
import { assertPathExists } from "../path-exists/path-exists.assert.js";

/**
 * Assert that a filesystem path exists and is a file.
 */
export function assertFileExists(
  filePath: string | string[],
  message?: string,
): void {
  const resolvedFilePath = Array.isArray(filePath)
    ? path.join(...filePath)
    : filePath;

  assertPathExists(resolvedFilePath, message);

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (!statSync(resolvedFilePath).isFile()) {
    throw new AssertionError(
      message ??
        `Expected path ${repr(resolvedFilePath)} to be a file, but it was not.`,
      resolvedFilePath,
      "file",
    );
  }
}
