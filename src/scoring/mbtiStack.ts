import { CognitiveFunction, MBTIStackResult, RawScores, StackRole } from '../types';
import { confidenceLabel, roleWeights } from './scoringGuide';

export const MBTI_STACKS: Record<string, CognitiveFunction[]> = {
  INTJ: ['Ni', 'Te', 'Fi', 'Se'],
  INFJ: ['Ni', 'Fe', 'Ti', 'Se'],
  ENTJ: ['Te', 'Ni', 'Se', 'Fi'],
  ENFJ: ['Fe', 'Ni', 'Se', 'Ti'],
  INTP: ['Ti', 'Ne', 'Si', 'Fe'],
  INFP: ['Fi', 'Ne', 'Si', 'Te'],
  ENTP: ['Ne', 'Ti', 'Fe', 'Si'],
  ENFP: ['Ne', 'Fi', 'Te', 'Si'],
  ISTJ: ['Si', 'Te', 'Fi', 'Ne'],
  ISFJ: ['Si', 'Fe', 'Ti', 'Ne'],
  ESTJ: ['Te', 'Si', 'Ne', 'Fi'],
  ESFJ: ['Fe', 'Si', 'Ne', 'Ti'],
  ISTP: ['Ti', 'Se', 'Ni', 'Fe'],
  ISFP: ['Fi', 'Se', 'Ni', 'Te'],
  ESTP: ['Se', 'Ti', 'Fe', 'Ni'],
  ESFP: ['Se', 'Fi', 'Te', 'Ni'],
};

const shadowOrder: StackRole[] = ['opposing', 'critical', 'trickster', 'transformative'];
const consciousOrder: StackRole[] = ['dominant', 'auxiliary', 'tertiary', 'inferior'];

function opposite(fn: CognitiveFunction): CognitiveFunction {
  const map: Record<CognitiveFunction, CognitiveFunction> = {
    Ni: 'Ne', Ne: 'Ni', Si: 'Se', Se: 'Si', Fi: 'Fe', Fe: 'Fi', Ti: 'Te', Te: 'Ti',
  };
  return map[fn];
}

export function buildShadow(stack: CognitiveFunction[]): Record<StackRole, CognitiveFunction> {
  return {
    dominant: stack[0],
    auxiliary: stack[1],
    tertiary: stack[2],
    inferior: stack[3],
    opposing: opposite(stack[0]),
    critical: opposite(stack[1]),
    trickster: opposite(stack[2]),
    transformative: opposite(stack[3]),
  };
}

function rawRankFit(raw: RawScores, stack: CognitiveFunction[]): number {
  const sorted = Object.entries(raw.cognitive).sort((a, b) => b[1] - a[1]).map(([key]) => key);
  return stack.reduce((sum, fn, index) => {
    const rank = sorted.indexOf(fn);
    return sum + Math.max(0, 8 - rank) * (4 - index);
  }, 0) / 70;
}

function dichotomySupport(raw: RawScores, type: string): number {
  const pairs: Array<[string, string, string]> = [
    ['I', 'E', type[0]],
    ['S', 'N', type[1]],
    ['T', 'F', type[2]],
    ['J', 'P', type[3]],
  ];
  return pairs.reduce((sum, [a, b, letter]) => {
    const winnerScore = raw.mbtiAxis[letter] ?? 0;
    const other = letter === a ? b : a;
    const gap = winnerScore - (raw.mbtiAxis[other] ?? 0);
    return sum + Math.max(-0.5, Math.min(1, gap / 8));
  }, 0) / 4;
}

function behaviorEvidence(raw: RawScores, type: string): number {
  const intro = (raw.evidence.observeFirst ?? 0) + (raw.evidence.silentMonitoring ?? 0) + (raw.evidence.analysisLoop ?? 0);
  const extro = (raw.evidence.directEngagement ?? 0) + (raw.evidence.actionFirst ?? 0) + (raw.communication.expressive ?? 0);
  const judging = (raw.evidence.orderSeeking ?? 0) + (raw.evidence.practicalRepair ?? 0) + (raw.work.planner ?? 0);
  const perceiving = (raw.evidence.noveltySeeking ?? 0) + (raw.evidence.riskTaking ?? 0) + (raw.work.improviser ?? 0);
  let score = 0;
  score += type[0] === 'I' ? intro - extro * 0.35 : extro - intro * 0.35;
  score += type[3] === 'J' ? judging - perceiving * 0.25 : perceiving - judging * 0.25;
  return Math.max(-1, Math.min(1, score / 20));
}

function stressShadowFit(raw: RawScores, shadow: Record<StackRole, CognitiveFunction>): number {
  const opposing = raw.roleFunctions[shadow.opposing].opposing ?? 0;
  const critical = raw.roleFunctions[shadow.critical].critical ?? 0;
  const trickster = raw.roleFunctions[shadow.trickster].trickster ?? 0;
  const transformative = raw.roleFunctions[shadow.transformative].transformative ?? 0;
  return Math.max(0, Math.min(1, (opposing + critical + trickster + transformative) / 18));
}

export function calculateDichotomy(raw: RawScores): Record<string, string> {
  const pick = (a: string, b: string) => (raw.mbtiAxis[a] >= raw.mbtiAxis[b] ? a : b);
  return {
    IE: pick('I', 'E'),
    SN: pick('S', 'N'),
    TF: pick('T', 'F'),
    JP: pick('J', 'P'),
  };
}

export function calculateMBTI(raw: RawScores): MBTIStackResult[] {
  const maxRaw = Math.max(1, ...Object.values(raw.cognitive).map(Math.abs));
  const maxRole = Math.max(1, ...Object.values(raw.roleFunctions).flatMap((roles) => Object.values(roles)).map(Math.abs));

  const results = Object.entries(MBTI_STACKS).map(([type, stack]) => {
    const [dom, aux, ter, inf] = stack;
    const shadow = buildShadow(stack);
    const roleFit =
      ((raw.roleFunctions[dom].dominant * 0.35) +
        (raw.roleFunctions[aux].auxiliary * 0.25) +
        (raw.roleFunctions[ter].tertiary * 0.15) +
        (raw.roleFunctions[inf].inferior * 0.15)) / maxRole;
    const rawFit = rawRankFit(raw, stack);
    const dichotomyFit = dichotomySupport(raw, type);
    const behaviorFit = behaviorEvidence(raw, type);
    const shadowFit = stressShadowFit(raw, shadow);

    let score = roleFit * 0.6 + rawFit * 0.15 + dichotomyFit * 0.1 + behaviorFit * 0.1 + shadowFit * 0.05;

    if ((raw.roleFunctions[dom].inferior ?? 0) > (raw.roleFunctions[dom].dominant ?? 0) * 1.2) score -= 0.08;
    if ((raw.roleFunctions[inf].dominant ?? 0) > (raw.roleFunctions[inf].inferior ?? 0) * 1.5) score -= 0.05;
    score += (raw.cognitive[dom] + raw.cognitive[aux] * 0.7 + raw.cognitive[ter] * 0.35 + raw.cognitive[inf] * 0.2) / (maxRaw * 35);

    const reasons = [
      `${dom}-${aux} muncul sebagai jalur paling kuat di beberapa bagian jawaban.`,
      `Fungsi ${inf} dibaca sebagai area sensitif atau lebih mudah muncul ketika tekanan naik.`,
      confidenceLabel(Math.max(0, Math.min(100, score * 100))),
    ];

    return {
      type,
      score,
      confidence: Math.max(0, Math.min(100, score * 100)),
      stack,
      shadow,
      reasons,
    };
  });

  return results.sort((a, b) => b.score - a.score).slice(0, 3);
}

export function inferStackRoles(raw: RawScores): Record<StackRole, CognitiveFunction> {
  const result = {} as Record<StackRole, CognitiveFunction>;
  const used = new Set<CognitiveFunction>();
  consciousOrder.forEach((role) => {
    const picked = Object.entries(raw.roleFunctions)
      .filter(([fn]) => !used.has(fn as CognitiveFunction))
      .sort((a, b) => (b[1][role] * roleWeights[role] + raw.cognitive[b[0] as CognitiveFunction] * 0.05) - (a[1][role] * roleWeights[role] + raw.cognitive[a[0] as CognitiveFunction] * 0.05))[0][0] as CognitiveFunction;
    result[role] = picked;
    used.add(picked);
  });
  shadowOrder.forEach((role) => {
    const picked = Object.entries(raw.roleFunctions)
      .sort((a, b) => b[1][role] - a[1][role])[0][0] as CognitiveFunction;
    result[role] = picked;
  });
  return result;
}
