// import { assertEquals } from "@std/assert";
import * as assert from "@std/assert";
import { combineMarkdownFiles } from "./mod.ts";
import { dirname, fromFileUrl } from "@std/path";

const __dirname = dirname(fromFileUrl(import.meta.url));

Deno.test({
  name: "should correctly combine markdown files when given a directory path",
  permissions: { read: true },
  fn: () => {
    const testFilesDirPath = __dirname + "/tests/files";
    const result = combineMarkdownFiles(testFilesDirPath);

    const expected = Deno.readTextFileSync(__dirname + "/tests/expected.md");

    // 結合された結果と期待される結果を比較
    assert.assertEquals(result, expected);
  },
});
