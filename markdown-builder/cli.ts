import { add } from "./mod.ts";

export function main(): void {
  const args = Deno.args;

  if (args.length < 2) {
    console.log("使用方法: deno run --allow-read cli.ts <数値1> <数値2>");
    Deno.exit(1);
  }

  const a = Number(args[0]);
  const b = Number(args[1]);

  if (isNaN(a) || isNaN(b)) {
    console.log("エラー: 有効な数値を入力してください");
    Deno.exit(1);
  }

  const result = add(a, b);
  console.log(`${a} + ${b} = ${result}`);
}

if (import.meta.main) {
  main();
}
