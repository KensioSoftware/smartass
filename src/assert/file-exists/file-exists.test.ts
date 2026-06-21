import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";
import { assertFileExists } from "./file-exists.assert.js";

/* eslint-disable security/detect-non-literal-fs-filename */

describe("file-exists", () => {
  describe("assertFileExists", () => {
    it("does not throw when a file exists", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        expect(() => {
          assertFileExists(filePath);
        }).not.toThrow();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("joins path segments when filePath is an array", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        expect(() => {
          assertFileExists([directory, "document.txt"]);
        }).not.toThrow();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws when the path does not exist", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "missing.txt");

      try {
        expect(() => {
          assertFileExists(filePath);
        }).toThrow(
          `Expected path ${JSON.stringify(filePath)} to exist, but it did not.`,
        );
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws when the path exists but is not a file", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));

      try {
        expect(() => {
          assertFileExists(directory);
        }).toThrow(
          `Expected path ${JSON.stringify(directory)} to be a file, but it was not.`,
        );
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws with custom message when the path does not exist", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "missing.txt");

      try {
        expect(() => {
          assertFileExists(filePath, "Custom error message");
        }).toThrow("Custom error message");
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws with custom message when the path is not a file", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));

      try {
        expect(() => {
          assertFileExists(directory, "Custom error message");
        }).toThrow("Custom error message");
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });
  });
});
