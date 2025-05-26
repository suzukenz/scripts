# PDF Splitter

PDFファイルを一番大きな見出し（章）ごとに分割するツールです。

## 機能

- PDFのアウトライン情報を読み込み
- 一番大きな見出し（トップレベル）ごとにPDFを分割
- 安全なファイル名で分割されたPDFを保存

## 依存関係

- [pdf.js](https://github.com/mozilla/pdf.js) - PDFの読み込みとアウトライン解析
- [pdf-lib](https://github.com/Hopding/pdf-lib) - PDFの分割と保存

## インストール

```bash
deno task install
```

## 使用方法

### コマンドライン

```bash
pdf-splitter <入力PDFファイル> <出力ディレクトリ>
```

### 例

```bash
pdf-splitter book.pdf ./chapters
```

### プログラムから使用

```typescript
import { splitByOutline } from "@suzukenz/pdf-splitter";

await splitByOutline("input.pdf", "./output");
```

## 開発

### テスト実行

```bash
deno task test
```

### ローカルでの実行

```bash
deno task run input.pdf output_dir
```

## 制限事項

- PDFにアウトライン情報が含まれている必要があります
- トップレベルの見出しのみを章として認識します
- ファイル名は英数字とアンダースコアのみに変換されます（最大50文字）

## ライセンス

MIT
