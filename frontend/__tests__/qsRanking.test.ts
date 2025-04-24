import { parseQsRanking } from '@/utils/qsRanking';

const mockCSV = `Institution,Rank
Massachusetts Institute of Technology (MIT),1
University of Oxford,2
University of Cambridge,3
"University of California, Berkeley (UCB)",4
`;

describe('parseQsRanking', () => {
  it('parses a basic CSV string into a mapping of normalized institution names to ranks', () => {
    const result = parseQsRanking(mockCSV);
    expect(result['massachusetts institute of technology (mit)']).toBe('1');
    expect(result['university of oxford']).toBe('2');
    expect(result['university of cambridge']).toBe('3');
    expect(result['university of california, berkeley (ucb)']).toBe('4');
  });

  it('ignores rows with missing names or ranks', () => {
    const brokenCSV = `Institution,Rank
MIT,
,2
Harvard University,3
`;
    const result = parseQsRanking(brokenCSV);
    expect(result['mit']).toBeUndefined();
    expect(result['']).toBeUndefined();
    expect(result['harvard university']).toBe('3');
  });
});
