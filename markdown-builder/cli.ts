import { combineMarkdownFiles } from "./mod.ts";
import { parseArgs } from "@std/cli";

export function main(): void {
  try {
    // コマンドライン引数を解析
    const args = parseArgs(Deno.args, {
      string: ["dir"],
      boolean: ["help"],
      alias: { "d": "dir", "h": "help" },
    });

    // 引数がない場合またはhelpフラグが指定された場合にヘルプを表示
    if (args.help || !args.dir) {
      console.log("使用方法: markdown-builder [オプション]");
      console.log("オプション:");
      console.log(
        "  -d, --dir <パス>  Markdownファイルを含むディレクトリを指定 (デフォルト: カレントディレクトリ)",
      );
      console.log("  -h, --help        ヘルプを表示");
      return;
    }

    // ファイルを結合
    const dirPath = args.dir;
    const result = combineMarkdownFiles(dirPath);

    // 結果を標準出力に表示
    Deno.stdout.writeSync(new TextEncoder().encode(result));
  } catch (error) {
    if (error instanceof Error) {
      console.error(`エラー: ${error.message}`);
    } else {
      console.error("不明なエラーが発生しました");
    }
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
