import Papa from "papaparse";

export function parseQsRanking(csvText: string): Record<string, string> {
  const rankingMap: Record<string, string> = {};
  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      results.data.forEach((row: any) => {
        const name = row["Institution"]?.trim()?.toLowerCase();
        const rank = row["Rank"]?.trim();
        if (name && rank) {
          rankingMap[name] = rank;
        }
      });
    },
  });
  return rankingMap;
}

export async function loadQsRankings(): Promise<Record<string, string>> {
  const response = await fetch("/qs_rankings.csv");
  const csvText = await response.text();
  return parseQsRanking(csvText);
}
