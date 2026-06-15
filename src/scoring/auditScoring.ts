import { QuestionPair } from '../types';
import { fairnessCheck } from './fairnessCheck';

export function auditScoring(pairs: QuestionPair[]) {
  const audit = fairnessCheck(pairs);
  if (import.meta.env.DEV && audit.warnings.length) {
    console.warn('[Tes Kepribadian Mendalam] Audit scoring:', audit.warnings, audit);
  }
  return audit;
}
