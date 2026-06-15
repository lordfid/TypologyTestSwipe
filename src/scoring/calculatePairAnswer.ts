import { AnswerKind, QuestionPair, RawScores, ScoreWeight } from '../types';
import { pairKindModifier } from './scoringGuide';

const mapCategories: Array<keyof ScoreWeight> = [
  'mbtiAxis', 'enneagram', 'instinct', 'bigFive', 'hexaco', 'attitudinalPsyche', 'disc', 'riasec',
  'moral', 'decision', 'conflict', 'communication', 'relationship', 'stress', 'defense', 'values',
  'work', 'learning', 'coreFear', 'coreDesire', 'evidence',
];

function addToRecord(record: Record<string, number>, key: string, value: number) {
  record[key] = (record[key] ?? 0) + value;
}

function rememberContext(raw: RawScores, key: string, theme: string, amount: number) {
  if (!raw.contextSpread[key]) raw.contextSpread[key] = {};
  raw.contextSpread[key][theme] = (raw.contextSpread[key][theme] ?? 0) + Math.max(0, amount);
}

function applyWeight(raw: RawScores, weights: ScoreWeight, finalMultiplier: number, theme: string) {
  if (weights.cognitive) {
    Object.entries(weights.cognitive).forEach(([key, value]) => {
      raw.cognitive[key as keyof RawScores['cognitive']] += (value ?? 0) * finalMultiplier;
      rememberContext(raw, `cognitive:${key}`, theme, (value ?? 0) * finalMultiplier);
    });
  }

  if (weights.stackRole) {
    Object.entries(weights.stackRole).forEach(([key, value]) => {
      raw.stackRole[key as keyof RawScores['stackRole']] += (value ?? 0) * finalMultiplier;
    });
  }

  if (weights.cognitive && weights.stackRole) {
    Object.entries(weights.cognitive).forEach(([fn, fnValue]) => {
      Object.entries(weights.stackRole ?? {}).forEach(([role, roleValue]) => {
        raw.roleFunctions[fn as keyof RawScores['roleFunctions']][role as keyof RawScores['stackRole']] +=
          (fnValue ?? 0) * (roleValue ?? 0) * 0.55 * finalMultiplier;
      });
    });
  }

  mapCategories.forEach((category) => {
    const values = weights[category] as Record<string, number> | undefined;
    if (!values) return;
    const target = raw[category as keyof RawScores] as Record<string, number>;
    Object.entries(values).forEach(([key, value]) => {
      addToRecord(target, key, (value ?? 0) * finalMultiplier);
      if (category === 'evidence') rememberContext(raw, `evidence:${key}`, theme, (value ?? 0) * finalMultiplier);
    });
  });

  raw.meta.ambiguity += (weights.ambiguity ?? 0) * finalMultiplier;
  raw.meta.contradiction += (weights.contradiction ?? 0) * finalMultiplier;
}

function addSoftCounter(raw: RawScores, weights: ScoreWeight, finalMultiplier: number, theme: string) {
  const counter = -0.12 * finalMultiplier;
  if (weights.evidence) {
    Object.entries(weights.evidence).slice(0, 4).forEach(([key, value]) => {
      addToRecord(raw.evidence, key, Math.max(-0.3, (value ?? 0) * counter));
      rememberContext(raw, `counter:${key}`, theme, Math.abs((value ?? 0) * counter));
    });
  }
  if (weights.cognitive) {
    Object.entries(weights.cognitive).slice(0, 3).forEach(([key, value]) => {
      raw.cognitive[key as keyof RawScores['cognitive']] += Math.max(-0.25, (value ?? 0) * counter);
    });
  }
}

export function calculatePairAnswer(pair: QuestionPair, answer: AnswerKind, raw: RawScores): RawScores {
  raw.meta.pairKinds[pair.kind] = (raw.meta.pairKinds[pair.kind] ?? 0) + 1;

  if (answer === 'skip') {
    raw.meta.skipped += 1;
    raw.meta.skippedThemes[pair.context.theme] = (raw.meta.skippedThemes[pair.context.theme] ?? 0) + 1;
    raw.meta.skippedKinds[pair.kind] = (raw.meta.skippedKinds[pair.kind] ?? 0) + 1;
    return raw;
  }

  raw.meta.answered += 1;
  raw.meta[answer] += 1;

  const base = pair.reliability * pairKindModifier[pair.kind];
  const strongOpposition = pair.opposition.strength === 'strong' || pair.opposition.strength === 'extreme';

  if (answer === 'left') {
    applyWeight(raw, pair.left.weights, base, pair.context.theme);
    if (strongOpposition) addSoftCounter(raw, pair.right.weights, base, pair.context.theme);
    raw.meta.reliabilityTotal += base;
    return raw;
  }

  if (answer === 'right') {
    applyWeight(raw, pair.right.weights, base, pair.context.theme);
    if (strongOpposition) addSoftCounter(raw, pair.left.weights, base, pair.context.theme);
    raw.meta.reliabilityTotal += base;
    return raw;
  }

  if (answer === 'both') {
    applyWeight(raw, pair.left.weights, base * 0.45, pair.context.theme);
    applyWeight(raw, pair.right.weights, base * 0.45, pair.context.theme);
    raw.meta.ambiguity += 1;
    raw.meta.contextFlexibility += 1;
    raw.evidence.contextSensitivity = (raw.evidence.contextSensitivity ?? 0) + 1;
    if (strongOpposition) {
      raw.meta.contradiction += pair.kind === 'sameBehaviorDifferentMotive' ? 0.35 : 1;
      raw.meta.mixedPattern += 1;
      raw.evidence.mixedPattern = (raw.evidence.mixedPattern ?? 0) + 1;
    }
    raw.meta.reliabilityTotal += base * 0.65;
    return raw;
  }

  if (answer === 'neither') {
    applyWeight(raw, pair.left.weights, base * -0.15, pair.context.theme);
    applyWeight(raw, pair.right.weights, base * -0.15, pair.context.theme);
    raw.meta.nonIdentification += 1;
    raw.meta.ambiguity += 0.5;
    raw.evidence.nonIdentification = (raw.evidence.nonIdentification ?? 0) + 1;
    raw.meta.reliabilityTotal += base * 0.35;
    return raw;
  }

  if (answer === 'depends') {
    applyWeight(raw, pair.left.weights, base * 0.25, pair.context.theme);
    applyWeight(raw, pair.right.weights, base * 0.25, pair.context.theme);
    raw.meta.contextDependence += 1;
    raw.meta.ambiguity += 0.7;
    raw.evidence.contextSensitivity = (raw.evidence.contextSensitivity ?? 0) + 1.4;
    raw.evidence.ambiguityTolerance = (raw.evidence.ambiguityTolerance ?? 0) + 1;
    raw.meta.reliabilityTotal += base * 0.45;
  }

  return raw;
}
