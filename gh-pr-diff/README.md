# gh-pr-diff

gh コマンドを利用してGitHub Pull Requestの差分を取得するスクリプト

## 仕様

- PR番号を引数で指定
- PR内容を、以下のフォーマットで標準出力する

```plaintext
<title>
{PRのタイトル}
</title>

<description>
{PRの本文}
</description>

<diff>
{PRの差分}
</diff>
```

### 内部的に利用するコマンド

```sh
# タイトルと本文を取得(json形式)
gh pr view {PR番号} --json title,body

# 差分を取得(plain text)
gh pr diff {PR番号} --color="never"
```
