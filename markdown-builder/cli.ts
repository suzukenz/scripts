import { combineMarkdownFiles } from "./mod.ts";

export function main(): void {
  const result = combineMarkdownFiles("");
  // console.log(`${a} + ${b} = ${result}`);
}

if (import.meta.main) {
  main();
}
