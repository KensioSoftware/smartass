import { readFileSync } from "node:fs";
import path from "node:path";

import { AssertionError } from "../../assertion-error.js";
import { repr } from "../../describe/describe.js";
import { assertFileExists } from "../file-exists/file-exists.assert.js";

export interface AssertFileEqualsOptions {
  normalizeLineEndings?: boolean;
  trimTrailingWhitespace?: boolean;
}

const defaultOptions = {
  normalizeLineEndings: true,
  trimTrailingWhitespace: true,
} satisfies Required<AssertFileEqualsOptions>;

/**
 * Assert that a file's content exactly equals the expected content.
 */
export function assertFileEquals(
  filePath: string | string[],
  expected: string,
  opts: AssertFileEqualsOptions = {},
  message?: string,
): void {
  const resolvedFilePath = Array.isArray(filePath)
    ? path.join(...filePath)
    : filePath;
  const options = { ...defaultOptions, ...opts };

  assertFileExists(resolvedFilePath, message);

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const actual = readFileSync(resolvedFilePath, "utf8");
  const normalizedActual = normalizeFileContent(actual, options);
  const normalizedExpected = normalizeFileContent(expected, options);

  if (normalizedActual !== normalizedExpected) {
    throw new AssertionError(
      message ??
        `Expected file ${repr(resolvedFilePath)} to equal ${repr(expected)}, but it did not.`,
      normalizedActual,
      normalizedExpected,
    );
  }
}

function normalizeFileContent(
  content: string,
  options: Required<AssertFileEqualsOptions>,
): string {
  let normalized = content;

  if (options.normalizeLineEndings) {
    normalized = normalized.replaceAll("\r\n", "\n").replaceAll("\r", "\n");
  }

  if (options.trimTrailingWhitespace) {
    normalized = normalized.replace(/\s+$/u, "");
  }

  return normalized;
}
