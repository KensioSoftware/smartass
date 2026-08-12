import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, expectTypeOf, it } from "vitest";
import { assertFileNotIncludes } from "./file-not-includes.assert.js";

/* eslint-disable security/detect-non-literal-fs-filename */

describe("file-not-includes", () => {
  describe("assertFileNotIncludes", () => {
    it("does not throw when the file does not include the substring", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        expect(() => {
          assertFileNotIncludes(filePath, "goodbye");
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
          assertFileNotIncludes([directory, "document.txt"], "goodbye");
        }).not.toThrow();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("is synchronous, so it cannot be left unawaited", () => {
      expectTypeOf(assertFileNotIncludes).returns.toBeVoid();
    });

    it("throws when the file includes the substring", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        expect(() => {
          assertFileNotIncludes(filePath, "world");
        }).toThrow(
          `Expected file ${JSON.stringify(filePath)} not to include "world", but it did.`,
        );
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws when the substring spans a chunk boundary", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(
          filePath,
          `${"a".repeat(64 * 1024 - 3)}needle${"a".repeat(1024)}`,
          "utf8",
        );

        expect(() => {
          assertFileNotIncludes(filePath, "needle");
        }).toThrow(
          `Expected file ${JSON.stringify(filePath)} not to include "needle", but it did.`,
        );
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws when the substring is empty", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        expect(() => {
          assertFileNotIncludes(filePath, "");
        }).toThrow(
          `Expected file ${JSON.stringify(filePath)} not to include "", but it did.`,
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
          assertFileNotIncludes(filePath, "world", "Custom error message");
        }).toThrow("Custom error message");
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });
  });
});
