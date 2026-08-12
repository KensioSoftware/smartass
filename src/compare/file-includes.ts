import { closeSync, openSync, readSync } from "node:fs";

const chunkSize = 64 * 1024;

/**
 * Check whether a file contains a substring, without loading the entire file
 * into memory.
 *
 * Reads synchronously so that the assertions built on this can stay
 * synchronous, like the rest of the file and path assertions: an async
 * assertion left unawaited is one that always passes.
 *
 * The file is scanned a chunk at a time through one reused buffer, which holds
 * a chunk plus enough of the previous chunk's tail that a substring straddling
 * a chunk boundary is still found. Memory use is therefore flat in the size of
 * the file, and nothing is allocated per chunk.
 */
export function hasSubstring(
  filePath: string,
  substring: string,
  encoding: BufferEncoding = "utf8",
): boolean {
  if (substring === "") {
    return true;
  }

  const needle = Buffer.from(substring, encoding);
  const overlap = needle.length - 1;
  const buffer = Buffer.alloc(overlap + chunkSize);

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const fileDescriptor = openSync(filePath, "r");
  let carried = 0;

  try {
    let bytesRead = readSync(fileDescriptor, buffer, {
      offset: carried,
      length: chunkSize,
    });

    while (bytesRead > 0) {
      const filled = carried + bytesRead;

      if (buffer.subarray(0, filled).includes(needle)) {
        return true;
      }

      carried = Math.min(overlap, filled);
      buffer.copy(buffer, 0, filled - carried, filled);

      bytesRead = readSync(fileDescriptor, buffer, {
        offset: carried,
        length: chunkSize,
      });
    }

    return false;
  } finally {
    closeSync(fileDescriptor);
  }
}
