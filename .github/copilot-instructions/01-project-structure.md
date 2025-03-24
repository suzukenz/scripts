## 各Scriptの基本構造

```plaintext
project-name/
├── cli.ts            # CLIエントリーポイント
├── deno.json         # Denoプロジェクト設定
├── deps.ts           # 依存関係の一元管理
├── lib.ts            # コア機能の実装
├── mod.ts            # 公開APIエントリーポイント
├── mod.test.ts       # テストファイル
├── README.md         # プロジェクト説明
└── tests/            # テストリソース(必要な場合のみ)
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
    "install": "deno install -g --allow-read -n my-script-name cli.ts",
    "uninstall": "deno uninstall -g my-script-name",
  }
}
```
