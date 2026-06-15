import { FinalResults, QuestionPair } from '../types';

export function generateTieBreakPairs(result: FinalResults, allPairs: QuestionPair[]): QuestionPair[] {
  const chosen: QuestionPair[] = [];
  const [first, second] = result.mbtiTop;
  if (first && second && first.confidence - second.confidence < 8) {
    chosen.push(...allPairs.filter((pair) => pair.kind === 'tieBreak' && pair.targetSignals.some((signal) => signal.includes(first.type) || signal.includes(second.type))).slice(0, 5));
  }
  if (result.enneagram.top[1] && result.enneagram.top[0].score - result.enneagram.top[1].score < 3) {
    chosen.push(...allPairs.filter((pair) => pair.kind === 'tieBreak' && pair.targetSignals.some((signal) => signal.toLowerCase().includes('enneagram'))).slice(0, 3));
  }
  if (result.instinctStack.split('/').length === 3) {
    chosen.push(...allPairs.filter((pair) => pair.kind === 'tieBreak' && pair.targetSignals.some((signal) => signal.includes('instinct'))).slice(0, 2));
  }
  return [...new Map(chosen.map((pair) => [pair.id, pair])).values()].slice(0, 8);
}
