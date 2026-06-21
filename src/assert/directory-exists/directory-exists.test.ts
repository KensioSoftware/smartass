import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";
import { assertDirectoryExists } from "./directory-exists.assert.js";

/* eslint-disable security/detect-non-literal-fs-filename */

describe("directory-exists", () => {
  describe("assertDirectoryExists", () => {
    it("does not throw when a directory exists", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));

      try {
        expect(() => {
          assertDirectoryExists(directory);
        }).not.toThrow();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("joins path segments when directoryPath is an array", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const childDirectory = path.join(directory, "child");

      try {
        mkdirSync(childDirectory);

        expect(() => {
          assertDirectoryExists([directory, "child"]);
        }).not.toThrow();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws when the path does not exist", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const missingDirectory = path.join(directory, "missing");

      try {
        expect(() => {
          assertDirectoryExists(missingDirectory);
        }).toThrow(
          `Expected path ${JSON.stringify(missingDirectory)} to exist, but it did not.`,
        );
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws when the path exists but is not a directory", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        expect(() => {
          assertDirectoryExists(filePath);
        }).toThrow(
          `Expected path ${JSON.stringify(filePath)} to be a directory, but it was not.`,
        );
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws with custom message when the path does not exist", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const missingDirectory = path.join(directory, "missing");

      try {
        expect(() => {
          assertDirectoryExists(missingDirectory, "Custom error message");
        }).toThrow("Custom error message");
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws with custom message when the path is not a directory", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        expect(() => {
          assertDirectoryExists(filePath, "Custom error message");
        }).toThrow("Custom error message");
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });
  });
});
