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
