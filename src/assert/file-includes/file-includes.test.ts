import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { assertFileIncludes } from "./file-includes.assert.js";

/* eslint-disable security/detect-non-literal-fs-filename */

describe("file-includes", () => {
  describe("assertFileIncludes", () => {
    it("does not throw when the file includes the substring", async () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        await expect(
          assertFileIncludes(filePath, "world"),
        ).resolves.toBeUndefined();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("joins path segments when filePath is an array", async () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        await expect(
          assertFileIncludes([directory, "document.txt"], "hello"),
        ).resolves.toBeUndefined();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("does not throw when the substring is empty", async () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        await expect(assertFileIncludes(filePath, "")).resolves.toBeUndefined();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws when the file does not include the substring", async () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        await expect(assertFileIncludes(filePath, "goodbye")).rejects.toThrow(
          `Expected file ${JSON.stringify(filePath)} to include "goodbye", but it did not.`,
        );
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws with custom message", async () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        await expect(
          assertFileIncludes(filePath, "goodbye", "Custom error message"),
        ).rejects.toThrow("Custom error message");
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });
  });
});
