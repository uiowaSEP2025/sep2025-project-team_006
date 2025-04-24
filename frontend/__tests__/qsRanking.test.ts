import { parseQsCsv,loadQsRankings } from '@/utils/qsRanking';

const mockCSV = `Institution,Rank
Massachusetts Institute of Technology (MIT),1
University of Oxford,2
University of Cambridge,3
"University of California, Berkeley (UCB)",4
`;

describe('parseQsCsv', () => {
  it('parses CSV into a normalized ranking map', () => {
    const result = parseQsCsv(mockCSV);
    expect(result['massachusetts institute of technology (mit)']).toBe('1');
    expect(result['university of oxford']).toBe('2');
    expect(result['university of cambridge']).toBe('3');
    expect(result['university of california, berkeley (ucb)']).toBe('4');
  });

  it('skips rows with missing fields', () => {
    const brokenCSV = `Institution,Rank
MIT,
,2
Harvard University,3
`;
    const result = parseQsCsv(brokenCSV);
    expect(result['mit']).toBeUndefined();
    expect(result['']).toBeUndefined();
    expect(result['harvard university']).toBe('3');
  });

  describe('loadQsRankings', () => {
    beforeEach(() => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          text: () => Promise.resolve(mockCSV),
        })
      ) as jest.Mock;
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    it('fetches CSV and parses into a ranking map', async () => {
      const result = await loadQsRankings();
  
      expect(fetch).toHaveBeenCalledWith('/qs_rankings.csv');
      expect(result['massachusetts institute of technology (mit)']).toBe('1');
      expect(result['university of oxford']).toBe('2');
      expect(result['university of cambridge']).toBe('3');
      expect(result['university of california, berkeley (ucb)']).toBe('4');
    });
  });
});
