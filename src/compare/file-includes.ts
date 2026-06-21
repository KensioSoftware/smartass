import { createReadStream } from "node:fs";

/**
 * Check whether a file contains a substring, without loading the entire file
 * into memory.
 */
export function fileIncludesSubstring(
  filePath: string,
  substring: string,
  encoding: BufferEncoding = "utf8",
): Promise<boolean> {
  if (substring === "") {
    return Promise.resolve(true);
  }

  return new Promise((resolve, reject) => {
    const needle = Buffer.from(substring, encoding);
    const overlap = needle.length - 1;
    let tail = Buffer.alloc(0);

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const stream = createReadStream(filePath);

    stream.on("data", (chunk: string | Buffer) => {
      const buffer = Buffer.isBuffer(chunk)
        ? chunk
        : Buffer.from(chunk, encoding);
      const combined = Buffer.concat([tail, buffer]);

      if (combined.includes(needle)) {
        resolve(true);
        stream.destroy();
        return;
      }

      tail =
        combined.length > overlap
          ? combined.subarray(combined.length - overlap)
          : combined;
    });

    stream.on("end", () => {
      resolve(false);
    });

    stream.on("error", reject);
  });
}
