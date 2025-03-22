# Important

Please respond to the client in Japanese.

We're using Deno for this project.

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

### Basic example

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

### string and boolean options

Use string and boolean options to specify the type of the argument.

```ts
import { parseArgs } from "@std/cli/parse-args";
import { assertEquals } from "@std/assert/equals";

const args = parseArgs(["--foo", "--bar", "baz"], {
  boolean: ["foo"],
  string: ["bar"],
});

assertEquals(args, { foo: true, bar: "baz", _: [] });
```

### collect option

collect option tells the parser to treat the option as an array. All values will be collected into one array. If a non-collectable option is used multiple times, the last value is used.

```ts
import { parseArgs } from "@std/cli/parse-args";
import { assertEquals } from "@std/assert/equals";

const args = parseArgs(["--foo", "bar", "--foo", "baz"], {
 collect: ["foo"],
});

assertEquals(args, { foo: ["bar", "baz"], _: [] });
```

### negatable option

negatable option tells the parser to treat the option can be negated by prefixing them with --no-, like --no-config.

```ts
import { parseArgs } from "@std/cli/parse-args";
import { assertEquals } from "@std/assert/equals";

const args = parseArgs(["--no-foo"], {
  boolean: ["foo"],
  negatable: ["foo"],
});

assertEquals(args, { foo: false, _: [] });
```
