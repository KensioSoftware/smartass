import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, expectTypeOf, it } from "vitest";
import { assertFileIncludes } from "./file-includes.assert.js";

/* eslint-disable security/detect-non-literal-fs-filename */

describe("file-includes", () => {
  describe("assertFileIncludes", () => {
    it("does not throw when the file includes the substring", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        expect(() => {
          assertFileIncludes(filePath, "world");
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
          assertFileIncludes([directory, "document.txt"], "hello");
        }).not.toThrow();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("does not throw when the substring is empty", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        expect(() => {
          assertFileIncludes(filePath, "");
        }).not.toThrow();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("finds a substring that spans a chunk boundary", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(
          filePath,
          `${"a".repeat(64 * 1024 - 3)}needle${"a".repeat(1024)}`,
          "utf8",
        );

        expect(() => {
          assertFileIncludes(filePath, "needle");
        }).not.toThrow();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("finds a substring longer than one read chunk", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");
      const substring = "n".repeat(100 * 1024);

      try {
        writeFileSync(filePath, `${"a".repeat(1024)}${substring}b`, "utf8");

        expect(() => {
          assertFileIncludes(filePath, substring);
        }).not.toThrow();
        expect(() => {
          assertFileIncludes(filePath, `${substring}c`);
        }).toThrow("to include");
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("is synchronous, so it cannot be left unawaited", () => {
      expectTypeOf(assertFileIncludes).returns.toBeVoid();
    });

    it("throws when the file does not include the substring", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        expect(() => {
          assertFileIncludes(filePath, "goodbye");
        }).toThrow(
          `Expected file ${JSON.stringify(filePath)} to include "goodbye", but it did not.`,
        );
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws with custom message", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        expect(() => {
          assertFileIncludes(filePath, "goodbye", "Custom error message");
        }).toThrow("Custom error message");
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });
  });
});
