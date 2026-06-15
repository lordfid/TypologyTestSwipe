import { RankedScore } from '../types';
import { readableLabels } from './scoringGuide';

export function rankScores(scores: Record<string, number>, limit?: number): RankedScore[] {
  const values = Object.values(scores);
  const max = Math.max(1, ...values.map((value) => Math.abs(value)));
  const ranked = Object.entries(scores)
    .map(([key, score]) => ({ key, score, percent: Math.max(0, Math.round((score / max) * 100)) }))
    .sort((a, b) => b.score - a.score);
  return typeof limit === 'number' ? ranked.slice(0, limit) : ranked;
}

export function humanKey(key: string): string {
  return readableLabels[key] ?? key;
}
