<!-- AIに指示したファイルを記念に記録しておく。 -->

pdfjs、pdf-libを利用して、PDFを一番大きな見出しごとに分割するツールを作成します。

- <https://github.com/mozilla/pdf.js>
- <https://github.com/Hopding/pdf-lib>

1. 入力の引数は、 inputのPDFファイルと、出力先ディレクトリ。
2. PDFを読み込み、一番大きな見出し(章)ごとに、PDFを分割して出力する。

## 実装メモ

**あくまで現時点の参考情報です。実際に実装する上で、より良いアイデアがあれば修正してください。**

1. アウトラインを読む

```typescript
export async function getChapterInfo(path: string) {
  const data = new Uint8Array(fs.readFileSync(path));
  const doc   = await pdfjs.getDocument({ data }).promise;
  const ol    = await doc.getOutline();           // トップレベルのみ取得
  if (!ol) throw new Error('No outline in PDF');

  const chapters: { title: string; page: number }[] = [];
  for (const item of ol) {
    if (!item.dest) continue;
    const dest  = await doc.getDestination(item.dest);
    const [ref] = dest;
    const page  = (await doc.getPageIndex(ref)) + 1; // 1-based
    chapters.push({ title: item.title, page });
  }
  chapters.sort((a, b) => a.page - b.page);
  chapters.push({ title: '__END__', page: doc.numPages + 1 });
  return chapters;
}
```

2. pdf-libで分割保存

```typescript
export async function splitByOutline(srcPath: string) {
  const chap = await getChapterInfo(srcPath);
  const srcBytes = fs.readFileSync(srcPath);
  const srcDoc   = await PDFDocument.load(srcBytes);

  for (let i = 0; i < chap.length - 1; i++) {
    const { title, page } = chap[i];
    const endPage = chap[i + 1].page;
    const newDoc  = await PDFDocument.create();
    const pages   = await newDoc.copyPages(
      srcDoc,
      Array.from({ length: endPage - page }, (_, k) => k + page - 1),
    );
    pages.forEach(p => newDoc.addPage(p));

    const safe = title.replace(/[^a-z0-9]/gi, '_').slice(0, 50);
    fs.writeFileSync(`${safe}.pdf`, await newDoc.save());
  }
}
```
