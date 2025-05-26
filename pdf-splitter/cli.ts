#!/usr/bin/env deno

import { basename, parseArgs } from "./deps.ts";
import { splitByOutline } from "./lib.ts";

function showHelp() {
  console.log(`
使用方法: pdf-splitter <入力PDFファイル> <出力ディレクトリ>

説明:
  PDFファイルを一番大きな見出し（章）ごとに分割します。

引数:
  <入力PDFファイル>    分割するPDFファイルのパス
  <出力ディレクトリ>   分割したPDFファイルを保存するディレクトリ

オプション:
  -h, --help          このヘルプメッセージを表示
  -v, --version       バージョン情報を表示

例:
  pdf-splitter input.pdf ./output
  pdf-splitter /path/to/book.pdf /path/to/chapters
`);
}

function showVersion() {
  console.log("pdf-splitter v0.1.0");
}

async function main() {
  const args = parseArgs(Deno.args, {
    boolean: ["help", "version"],
    alias: {
      h: "help",
      v: "version",
    },
  });

  if (args.help) {
    showHelp();
    return;
  }

  if (args.version) {
    showVersion();
    return;
  }

  if (args._.length !== 2) {
    console.error(
      "エラー: 入力PDFファイルと出力ディレクトリを指定してください",
    );
    showHelp();
    Deno.exit(1);
  }

  const [inputPath, outputDir] = args._ as [string, string];

  try {
    // ファイルの存在確認
    await Deno.stat(inputPath);

    console.log(`PDFファイルを分割中: ${basename(inputPath)}`);
    console.log(`出力先: ${outputDir}`);

    await splitByOutline(inputPath, outputDir);

    console.log("分割が完了しました！");
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.error(`エラー: ファイルが見つかりません: ${inputPath}`);
    } else {
      if (error instanceof Error) {
        console.error(`エラー: ${error.message}`);
      } else {
        console.error(`エラー: ${String(error)}`);
      }
    }
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
