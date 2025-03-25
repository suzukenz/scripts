import { parseArgs } from "@std/cli";
import { getPrDiff } from "./mod.ts";

/**
 * メイン関数
 */
async function main(): Promise<void> {
  try {
    // コマンドライン引数を解析
    const args = parseArgs(Deno.args, {
      string: ["pr"],
      boolean: ["help"],
      alias: { "p": "pr", "h": "help" },
    });

    // ヘルプを表示
    if (args.help || (!args.pr && args._.length === 0)) {
      console.log("使用方法: gh-pr-diff [オプション] [PR番号]");
      console.log("オプション:");
      console.log("  -p, --pr <番号>  PR番号を指定");
      console.log("  -h, --help       このヘルプを表示");
      console.log("");
      console.log("または、PR番号を直接引数として指定することもできます:");
      console.log("  gh-pr-diff 123");
      return;
    }

    // PR番号を取得（--pr オプションまたは直接の引数）
    const prNumber = args.pr ||
      (args._.length > 0 ? String(args._[0]) : undefined);

    if (!prNumber) {
      console.error("エラー: PR番号を指定してください");
      Deno.exit(1);
    }

    // PR情報を取得して出力
    const result = await getPrDiff(prNumber);
    if (result) {
      console.log(result);
    } else {
      console.error("エラー: PR情報を取得できませんでした");
      Deno.exit(1);
    }
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "不明なエラーが発生しました";
    console.error(`エラー: ${message}`);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  main();
}
