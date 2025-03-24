// GithubのPRの差分を取得するための機能を実装します

type PrInfo = {
  title: string;
  body: string;
  diff: string;
};

/**
 * PRのタイトルと本文を取得する
 * @param prNumber PR番号
 * @returns タイトルと本文を含むオブジェクト
 */
async function fetchPrDetails(
  prNumber: string,
): Promise<{ title: string; body: string }> {
  const command = new Deno.Command("gh", {
    args: ["pr", "view", prNumber, "--json", "title,body"],
  });

  const output = await command.output();
  if (!output.success) {
    throw new Error(
      `Failed to fetch PR details: ${new TextDecoder().decode(output.stderr)}`,
    );
  }

  const responseText = new TextDecoder().decode(output.stdout);
  const response = JSON.parse(responseText);

  return {
    title: response.title,
    body: response.body,
  };
}

/**
 * PRの差分を取得する
 * @param prNumber PR番号
 * @returns 差分の文字列
 */
async function fetchPrDiff(prNumber: string): Promise<string> {
  const command = new Deno.Command("gh", {
    args: ["pr", "diff", prNumber, "--color=never"],
  });

  const output = await command.output();
  if (!output.success) {
    throw new Error(
      `Failed to fetch PR diff: ${new TextDecoder().decode(output.stderr)}`,
    );
  }

  return new TextDecoder().decode(output.stdout);
}

/**
 * PRの情報を取得する
 * @param prNumber PR番号
 * @returns タイトル、本文、差分を含むオブジェクト
 */
async function fetchPrInfo(prNumber: string): Promise<PrInfo> {
  // タイトルと本文を取得
  const prDetails = await fetchPrDetails(prNumber);
  // 差分を取得
  const diff = await fetchPrDiff(prNumber);

  return {
    title: prDetails.title,
    body: prDetails.body,
    diff,
  };
}

/**
 * PRの情報をフォーマットする
 * @param prInfo PRの情報
 * @returns フォーマットされた文字列
 */
function formatPrInfo(prInfo: PrInfo): string {
  return `<title>
${prInfo.title}
</title>

<description>
${prInfo.body}
</description>

<diff>
${prInfo.diff}
</diff>`;
}

/**
 * PRの差分情報を取得する
 * @param prNumber PR番号
 * @returns フォーマットされたPR情報、またはPR番号が提供されない場合はundefined
 */
export async function getPrDiff(
  prNumber?: string,
): Promise<string | undefined> {
  if (!prNumber) {
    return undefined;
  }

  try {
    const prInfo = await fetchPrInfo(prNumber);
    return formatPrInfo(prInfo);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`PR情報の取得に失敗しました: ${error.message}`);
    } else {
      console.error("PR情報の取得に失敗しました: 不明なエラーが発生しました");
    }
    throw error;
  }
}
