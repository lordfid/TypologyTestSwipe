import { RawScores } from '../types';

export function calculateTritype(raw: RawScores, mainType: string): string {
  const groups = {
    heart: ['2', '3', '4'],
    head: ['5', '6', '7'],
    gut: ['8', '9', '1'],
  };
  const picks = Object.values(groups).map((group) =>
    group.slice().sort((a, b) => (raw.enneagram[b] ?? 0) - (raw.enneagram[a] ?? 0))[0]
  );
  return [mainType, ...picks.filter((type) => type !== mainType)]
    .filter((type, index, arr) => arr.indexOf(type) === index)
    .slice(0, 3)
    .join('-');
}
