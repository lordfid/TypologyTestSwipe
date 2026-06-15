import { RawScores } from '../types';

const aspects = ['L', 'E', 'F', 'V'] as const;

type Aspect = typeof aspects[number];

function positionScores(raw: RawScores, aspect: Aspect) {
  const confidence = raw.attitudinalPsyche[`${aspect}_confidence`] ?? 0;
  const flexibility = raw.attitudinalPsyche[`${aspect}_flexibility`] ?? 0;
  const insecurity = raw.attitudinalPsyche[`${aspect}_insecurity`] ?? 0;
  const indifference = raw.attitudinalPsyche[`${aspect}_indifference`] ?? 0;
  return {
    1: confidence * 1.2 - insecurity * 0.45 + flexibility * 0.2,
    2: flexibility * 1.2 + confidence * 0.35 - insecurity * 0.15,
    3: insecurity * 1.25 + confidence * 0.15 - flexibility * 0.2,
    4: indifference * 1.2 + flexibility * 0.15 - confidence * 0.2,
  };
}

export function calculateAttitudinalPsyche(raw: RawScores): string {
  const open = new Set(['1', '2', '3', '4']);
  const assigned: Record<string, Aspect> = {};
  const all = aspects.flatMap((aspect) => Object.entries(positionScores(raw, aspect)).map(([position, score]) => ({ aspect, position, score })));
  all.sort((a, b) => b.score - a.score);
  const usedAspects = new Set<Aspect>();

  all.forEach(({ aspect, position }) => {
    if (!usedAspects.has(aspect) && open.has(position)) {
      assigned[position] = aspect;
      usedAspects.add(aspect);
      open.delete(position);
    }
  });

  aspects.forEach((aspect) => {
    if (!usedAspects.has(aspect)) {
      const free = [...open][0];
      if (free) {
        assigned[free] = aspect;
        open.delete(free);
      }
    }
  });

  return ['1', '2', '3', '4'].map((position) => assigned[position] ?? 'L').join('');
}
