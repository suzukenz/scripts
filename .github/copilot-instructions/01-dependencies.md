## Dependencies

依存関係の管理は deps.ts を使用します。

> [!NOTE]
> 本当は `deno.json` の "imports" を使いたいですが、`deno install` した際に import map が解決されない問題があるため、deps.tsを利用します。

例:

```ts
// deps.ts
export { BufReader } from "https://deno.land/std@0.50.0/io/bufio.ts";
export * as path from "https://deno.land/std@0.50.0/path/mod.ts";
```

```ts
// a.ts
import { BufReader } from "./deps.ts";

// b.ts
import { BufReader, path } from "./deps.ts";
```
