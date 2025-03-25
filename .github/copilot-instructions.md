# Important

Please respond to the client in Japanese.

We're using Deno for this project.


## 各Scriptの基本構造

```plaintext
.(root)
├── README.md
├── deno.json
├── deno.lock
├── my-script-name      # Scriptのルートディレクトリ
    ├── cli.ts            # CLIエントリーポイント
    ├── deno.json         # Denoプロジェクト設定
    ├── deps.ts           # 依存関係の一元管理
    ├── lib.ts            # コア機能の実装
    ├── mod.ts            # 公開APIエントリーポイント
    ├── mod.test.ts       # テストファイル
    ├── README.md         # プロジェクト説明
    └── tests/            # テストリソース(必要な場合のみ)
```

新しくScriptを追加したときは、rootの deno.json に workspace を追加します。

${PROJECT_ROOT}/deno.json"

```json
{
  "workspace": ["./my-script-name"],
  ...
}
```

### 開発ワークフロー

1. 機能を `lib.ts` に実装
2. テストを `mod.test.ts` に追加
3. 公開APIを `mod.ts` で定義
4. CLIを `cli.ts` で実装
5. `deno task test` でテストを実行

### deno.json

cliのinstallは、`deno install -g` を利用しておこない、deno.json には必ず install, uninstall コマンドを含めます。
各commandには、適切なパーミッション許可を付与します。例: `--allow-read`

最小のdeno.json example:

```json
{
  "name": "@suzukenz/my-script-name",
  "version": "0.1.0",
  "exports": {
    ".": "./mod.ts"
  },
  "tasks": {
    "run": "deno run --allow-read cli.ts", 
    "test": "deno test --allow-read",
    "install": "deno install -g --allow-read --config=deno.json -n my-script-name cli.ts",
    "uninstall": "deno uninstall -g my-script-name",
  }
}
```


## Dependencies

依存関係の管理は deno.json の "imports" を使用します。そのため、global install 時には `--config=deno.json` で、明示的にconfigファイルを指定します。



## Testing

テストはビルトインのテストランナーを使用して記述します。以下がその例です。

```ts
import { assertEquals } from "jsr:@std/assert";

Deno.test("simple test", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});

import { delay } from "jsr:@std/async";

Deno.test("async test", async () => {
  const x = 1 + 2;
  await delay(100);
  assertEquals(x, 3);
});

Deno.test({
  name: "read file test",
  permissions: { read: true },
  fn: () => {
    const data = Deno.readTextFileSync("./somefile.txt");
    assertEquals(data, "expected content");
  },
});
```

テスト名は、 "should return 3 when adding 1 and 2" の形式で記述してください。


## CLI

CLIの実装には、 `@std/cli` の `parseArgs` を利用します。

### Example Usage

```ts
import { parseArgs } from "@std/cli/parse-args";
import { assertEquals } from "@std/assert/equals";

// For proper use, one should use `parseArgs(Deno.args)`
assertEquals(parseArgs(["--foo", "--bar=baz", "./quux.txt"]), {
  foo: true,
  bar: "baz",
  _: ["./quux.txt"],
});
```

### `string` and `boolean` options

Use `string` and `boolean` options to specify the type of the argument.

```ts
import { parseArgs } from "@std/cli/parse-args";
import { assertEquals } from "@std/assert/equals";

const args = parseArgs(["--foo", "--bar", "baz"], {
  boolean: ["foo"],
  string: ["bar"],
});

assertEquals(args, { foo: true, bar: "baz", _: [] });
```

### `collect` option

The `collect` option tells the parser to treat the option as an array. All values will be collected into one array. If a non-collectable option is used multiple times, the last value is used.

```ts
import { parseArgs } from "@std/cli/parse-args";
import { assertEquals } from "@std/assert/equals";

const args = parseArgs(["--foo", "bar", "--foo", "baz"], {
  collect: ["foo"],
});

assertEquals(args, { foo: ["bar", "baz"], _: [] });
```

### `negatable` option

The `negatable` option tells the parser to treat the option so that it can be negated by prefixing it with `--no-`, like `--no-config`.

```ts
import { parseArgs } from "@std/cli/parse-args";
import { assertEquals } from "@std/assert/equals";

const args = parseArgs(["--no-foo"], {
  boolean: ["foo"],
  negatable: ["foo"],
});

assertEquals(args, { foo: false, _: [] });
```


## Coding Style

### 基本方針

- 状態を持つ必要がない場合は、class による実装を避け、関数による実装を優先する。
- 具体的な型を使用する。as, any の使用を避ける。
- コードコメントは、 Whyのみを記載する。HowやWhatはコードから読み取れるようにする。
