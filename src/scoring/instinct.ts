import { RawScores } from '../types';

export function calculateInstinctStack(raw: RawScores): string {
  return Object.entries(raw.instinct)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key)
    .join('/');
}
