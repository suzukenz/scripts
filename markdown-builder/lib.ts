import { join } from "@std/path/join";

/**
 * @param dirPath - The path to the directory containing the markdown files
 * @returns The combined markdown content as a string
 */
export function combineMarkdownFiles(
  dirPath: string,
): string {
  // ディレクトリ内のすべてのファイルを取得
  const entries = [...Deno.readDirSync(dirPath)]
    .filter((entry) => entry.isFile && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort(); // ファイル名でソート

  // 各Markdownファイルの内容を結合
  const contents = [];
  for (const fileName of entries) {
    const filePath = join(dirPath, fileName);
    const content = Deno.readTextFileSync(filePath);
    contents.push(content);
  }

  return contents.join("\n\n");
}
