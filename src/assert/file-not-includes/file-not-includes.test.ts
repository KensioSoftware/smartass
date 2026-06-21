import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";
import { assertFileNotIncludes } from "./file-not-includes.assert.js";

/* eslint-disable security/detect-non-literal-fs-filename */

describe("file-not-includes", () => {
  describe("assertFileNotIncludes", () => {
    it("does not throw when the file does not include the substring", async () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        await expect(
          assertFileNotIncludes(filePath, "goodbye"),
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
          assertFileNotIncludes([directory, "document.txt"], "goodbye"),
        ).resolves.toBeUndefined();
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws when the file includes the substring", async () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        await expect(assertFileNotIncludes(filePath, "world")).rejects.toThrow(
          `Expected file ${JSON.stringify(filePath)} not to include "world", but it did.`,
        );
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });

    it("throws when the substring is empty", async () => {
      const directory = mkdtempSync(path.join(tmpdir(), "smartass-"));
      const filePath = path.join(directory, "document.txt");

      try {
        writeFileSync(filePath, "hello world", "utf8");

        await expect(assertFileNotIncludes(filePath, "")).rejects.toThrow(
          `Expected file ${JSON.stringify(filePath)} not to include "", but it did.`,
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
          assertFileNotIncludes(filePath, "world", "Custom error message"),
        ).rejects.toThrow("Custom error message");
      } finally {
        rmSync(directory, { recursive: true, force: true });
      }
    });
  });
});
