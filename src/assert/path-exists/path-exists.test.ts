import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";
import { assertPathExists } from "./path-exists.assert.js";

/* eslint-disable security/detect-non-literal-fs-filename */

describe("path-exists", () => {
  describe("assertPathExists", () => {
    it("does not throw when a file exists", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        expect(() => {
          assertPathExists(filePath);
        }).not.toThrow();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("does not throw when a directory exists", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));

      try {
        expect(() => {
          assertPathExists(directory);
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
          assertPathExists([directory, "document.txt"]);
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
          assertPathExists(filePath);
        }).toThrow(
          `Expected path ${JSON.stringify(filePath)} to exist, but it did not.`,
        );
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws with custom message", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "missing.txt");

      try {
        expect(() => {
          assertPathExists(filePath, "Custom error message");
        }).toThrow("Custom error message");
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });
  });
});
