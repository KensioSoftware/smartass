import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";
import { assertFileEquals } from "./file-equals.assert.js";

/* eslint-disable security/detect-non-literal-fs-filename */

describe("file-equals", () => {
  describe("assertFileEquals", () => {
    it("does not throw when the file content matches exactly", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        expect(() => {
          assertFileEquals(filePath, "hello world");
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
          assertFileEquals([directory, "document.txt"], "hello world");
        }).not.toThrow();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("normalizes line endings by default", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello\r\nworld\r\n", "utf8");

        expect(() => {
          assertFileEquals(filePath, "hello\nworld");
        }).not.toThrow();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("can disable line ending normalization", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello\r\nworld", "utf8");

        expect(() => {
          assertFileEquals(filePath, "hello\nworld", {
            normalizeLineEndings: false,
          });
        }).toThrow(
          String.raw`Expected file ${JSON.stringify(filePath)} to equal "hello\nworld", but it did not.`,
        );
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("trims trailing whitespace by default", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world  \n\t", "utf8");

        expect(() => {
          assertFileEquals(filePath, "hello world");
        }).not.toThrow();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("can disable trailing whitespace trimming", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world\n", "utf8");

        expect(() => {
          assertFileEquals(filePath, "hello world", {
            trimTrailingWhitespace: false,
          });
        }).toThrow(
          `Expected file ${JSON.stringify(filePath)} to equal "hello world", but it did not.`,
        );
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws when the file content does not match", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        expect(() => {
          assertFileEquals(filePath, "goodbye world");
        }).toThrow(
          `Expected file ${JSON.stringify(filePath)} to equal "goodbye world", but it did not.`,
        );
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws when the path is not a file", () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));

      try {
        expect(() => {
          assertFileEquals(directory, "hello world");
        }).toThrow(
          `Expected path ${JSON.stringify(directory)} to be a file, but it was not.`,
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
          assertFileEquals(
            filePath,
            "goodbye world",
            {},
            "Custom error message",
          );
        }).toThrow("Custom error message");
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });
  });
});
