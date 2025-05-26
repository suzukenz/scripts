import { ensureDir, join, PDFDocument, pdfjs } from "./deps.ts";

export interface ChapterInfo {
  title: string;
  page: number;
}

/**
 * PDFファイルからアウトライン情報を取得し、章情報を抽出する
 */
export async function getChapterInfo(path: string): Promise<ChapterInfo[]> {
  const data = await Deno.readFile(path);
  const doc = await pdfjs.getDocument({ data }).promise;
  const outline = await doc.getOutline();

  if (!outline) {
    throw new Error("PDFにアウトライン情報が見つかりません");
  }

  const chapters: ChapterInfo[] = [];

  for (const item of outline) {
    if (!item.dest) continue;

    const dest = await doc.getDestination(item.dest as string);
    if (!dest || !Array.isArray(dest)) continue;

    const [ref] = dest;
    const page = (await doc.getPageIndex(ref)) + 1; // 1-based

    chapters.push({ title: item.title, page });
  }

  // ページ順でソート
  chapters.sort((a, b) => a.page - b.page);

  // 最後の章の終端を示すために仮想的な章を追加
  chapters.push({ title: "__END__", page: doc.numPages + 1 });

  return chapters;
}

/**
 * ファイル名として安全な文字列に変換
 * 日本語文字（ひらがな、カタカナ、漢字）と英数字、一部の記号を許可し、
 * ファイルシステムで禁止されている文字のみを置換する
 */
export function sanitizeFilename(title: string): string {
  // ファイルシステムで禁止されている文字を置換
  // Windows, macOS, Linuxで使用できない文字: / \ : * ? " < > |
  // 加えて、全角コロンなどの紛らわしい文字も置換
  const invalidChars = /[\/\\:*?"<>|：]/g;

  // 禁止文字を _ に置換し、連続する _ を1つにまとめる
  const sanitized = title
    .replace(invalidChars, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, ""); // 先頭と末尾の _ を削除

  // ファイル名の長さ制限（多くのファイルシステムで255バイト制限）
  // 日本語文字は3バイトなので、安全のため100文字に制限
  return sanitized.slice(0, 100);
}

/**
 * PDFをアウトラインに基づいて分割し、指定されたディレクトリに保存
 */
export async function splitByOutline(
  srcPath: string,
  outputDir: string,
): Promise<void> {
  const chapters = await getChapterInfo(srcPath);
  const srcBytes = await Deno.readFile(srcPath);
  const srcDoc = await PDFDocument.load(srcBytes);

  // 出力ディレクトリを作成
  await ensureDir(outputDir);

  // 最後の仮想章を除いて処理
  for (let i = 0; i < chapters.length - 1; i++) {
    const { title, page } = chapters[i];
    const endPage = chapters[i + 1].page;

    const newDoc = await PDFDocument.create();
    const pageIndices = Array.from(
      { length: endPage - page },
      (_, k) => k + page - 1,
    );

    const pages = await newDoc.copyPages(srcDoc, pageIndices);
    pages.forEach((p) => newDoc.addPage(p));

    const safeFilename = sanitizeFilename(title);
    const outputPath = join(outputDir, `${safeFilename}.pdf`);

    await Deno.writeFile(outputPath, await newDoc.save());

    console.log(`保存しました: ${outputPath} (${page}-${endPage - 1}ページ)`);
  }
}
