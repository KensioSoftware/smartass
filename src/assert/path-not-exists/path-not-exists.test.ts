import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";
import { assertPathNotExists } from "./path-not-exists.assert.js";

/* eslint-disable security/detect-non-literal-fs-filename */

describe("path-not-exists", () => {
  describe("assertPathNotExists", () => {
    it("does not throw when the path does not exist", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const missingPath = path.join(directory, "missing.txt");

      try {
        expect(() => {
          assertPathNotExists(missingPath);
        }).not.toThrow();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("joins path segments when filePath is an array", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));

      try {
        expect(() => {
          assertPathNotExists([directory, "missing.txt"]);
        }).not.toThrow();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws when a file exists at the path", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        expect(() => {
          assertPathNotExists(filePath);
        }).toThrow(
          `Expected path ${JSON.stringify(filePath)} not to exist, but it did.`,
        );
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws when a directory exists at the path", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));

      try {
        expect(() => {
          assertPathNotExists(directory);
        }).toThrow(
          `Expected path ${JSON.stringify(directory)} not to exist, but it did.`,
        );
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws with custom message", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));

      try {
        expect(() => {
          assertPathNotExists(directory, "Custom error message");
        }).toThrow("Custom error message");
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });
  });
});
