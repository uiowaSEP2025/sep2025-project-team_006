import Papa from "papaparse";

export async function loadQsRankings(): Promise<Record<string, string>> {
  const response = await fetch("/qs_rankings.csv");
  const csvText = await response.text();

  return new Promise((resolve) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rankingMap: Record<string, string> = {};
        results.data.forEach((row: any) => {
          const name = row["Institution"]?.trim()?.toLowerCase();
          const rank = row["Rank"]?.trim();
          if (name && rank) {
            rankingMap[name] = rank;
          }
        });
        resolve(rankingMap);
      },
    });
  });
}
