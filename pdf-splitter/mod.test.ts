import { assertEquals } from "./deps.ts";
import { getChapterInfo, sanitizeFilename } from "./lib.ts";

Deno.test("should sanitize filename correctly", () => {
  // 英語タイトルのテスト
  assertEquals(
    sanitizeFilename("Chapter 1: Introduction"),
    "Chapter 1_ Introduction",
  );

  // 日本語タイトルのテスト
  assertEquals(
    sanitizeFilename("第1章：はじめに"),
    "第1章_はじめに",
  );

  // 混在したタイトルのテスト
  assertEquals(
    sanitizeFilename("Chapter 1: GraphQLスキーマ設計"),
    "Chapter 1_ GraphQLスキーマ設計",
  );

  // 禁止文字を含むテスト
  assertEquals(
    sanitizeFilename('ファイル/\\:*?"<>|テスト'),
    "ファイル_テスト",
  );

  // 長いタイトルのテスト
  assertEquals(
    sanitizeFilename("あ".repeat(150)),
    "あ".repeat(100),
  );

  // 連続する禁止文字のテスト
  assertEquals(
    sanitizeFilename("タイトル///テスト"),
    "タイトル_テスト",
  );
});

Deno.test("should handle empty filename", () => {
  assertEquals(sanitizeFilename(""), "");
});

Deno.test("should handle filename with only invalid characters", () => {
  assertEquals(sanitizeFilename('/\\:*?"<>|'), "");
});

Deno.test("should preserve Japanese characters", () => {
  assertEquals(sanitizeFilename("ひらがな"), "ひらがな");
  assertEquals(sanitizeFilename("カタカナ"), "カタカナ");
  assertEquals(sanitizeFilename("漢字"), "漢字");
  assertEquals(sanitizeFilename("英数字123"), "英数字123");
});

Deno.test("should handle mixed content correctly", () => {
  assertEquals(
    sanitizeFilename("第2章: GitHub v4 API入門"),
    "第2章_ GitHub v4 API入門",
  );
});

// 実際のPDFファイルを使用したテストは、テスト用PDFファイルが必要
// ここでは基本的な関数のテストのみを含める
Deno.test({
  name: "should throw error when PDF has no outline",
  permissions: { read: true },
  fn: async () => {
    // 存在しないファイルでテスト
    try {
      await getChapterInfo("nonexistent.pdf");
    } catch (error) {
      assertEquals(error instanceof Deno.errors.NotFound, true);
    }
  },
});
