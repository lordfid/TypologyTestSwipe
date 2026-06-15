import { AnswerRecord, QuestionPair, RawScores } from '../types';
import { calculatePairAnswer } from './calculatePairAnswer';
import { createEmptyRawScores } from './scoreSchema';

export function calculateRawScores(pairs: QuestionPair[], answers: Record<string, AnswerRecord>): RawScores {
  return pairs.reduce((raw, pair) => {
    const record = answers[pair.id];
    if (!record) return raw;
    return calculatePairAnswer(pair, record.answer, raw);
  }, createEmptyRawScores());
}
