export type CognitiveFunction = 'Ni' | 'Ne' | 'Si' | 'Se' | 'Fi' | 'Fe' | 'Ti' | 'Te';

export type StackRole =
  | 'dominant'
  | 'auxiliary'
  | 'tertiary'
  | 'inferior'
  | 'opposing'
  | 'critical'
  | 'trickster'
  | 'transformative';

export type AnswerKind = 'left' | 'right' | 'both' | 'neither' | 'depends' | 'skip';

export type PairKind =
  | 'cognitiveContrast'
  | 'roleContrast'
  | 'sameBehaviorDifferentMotive'
  | 'sameMotiveDifferentBehavior'
  | 'shadowContrast'
  | 'traitContrast'
  | 'tieBreak'
  | 'symbolicChoice'
  | 'chatChoice'
  | 'placeChoice';

export type OppositionStrength = 'soft' | 'medium' | 'strong' | 'extreme';

export type PressureLevel = 'low' | 'medium' | 'high' | 'crisis';
export type TimeOrientation = 'past' | 'present' | 'future' | 'mixed';
export type SocialExposure = 'private' | 'semiPrivate' | 'public';
export type EmotionalCharge = 'low' | 'medium' | 'high';

export type ScoreWeight = {
  cognitive?: Partial<Record<CognitiveFunction, number>>;
  stackRole?: Partial<Record<StackRole, number>>;
  mbtiAxis?: Partial<Record<string, number>>;
  enneagram?: Partial<Record<string, number>>;
  instinct?: Partial<Record<string, number>>;
  bigFive?: Partial<Record<string, number>>;
  hexaco?: Partial<Record<string, number>>;
  attitudinalPsyche?: Partial<Record<string, number>>;
  disc?: Partial<Record<string, number>>;
  riasec?: Partial<Record<string, number>>;
  moral?: Partial<Record<string, number>>;
  decision?: Partial<Record<string, number>>;
  conflict?: Partial<Record<string, number>>;
  communication?: Partial<Record<string, number>>;
  relationship?: Partial<Record<string, number>>;
  stress?: Partial<Record<string, number>>;
  defense?: Partial<Record<string, number>>;
  values?: Partial<Record<string, number>>;
  work?: Partial<Record<string, number>>;
  learning?: Partial<Record<string, number>>;
  coreFear?: Partial<Record<string, number>>;
  coreDesire?: Partial<Record<string, number>>;
  evidence?: Partial<Record<string, number>>;
  reliability?: number;
  ambiguity?: number;
  contradiction?: number;
};

export type PairSide = {
  id: 'left' | 'right';
  text: string;
  subtleMeaning: string;
  weights: ScoreWeight;
};

export type QuestionPair = {
  id: string;
  kind: PairKind;
  context: {
    theme: string;
    place: string;
    relationship: string;
    emotion?: string;
    pressureLevel: PressureLevel;
    timeOrientation: TimeOrientation;
    socialExposure: SocialExposure;
    emotionalCharge: EmotionalCharge;
  };
  prompt: string;
  left: PairSide;
  right: PairSide;
  opposition: {
    strength: OppositionStrength;
    axis?: string;
    note: string;
  };
  targetSignals: string[];
  reliability: number;
};

export type AnswerRecord = {
  pairId: string;
  answer: AnswerKind;
  answeredAt: number;
};

export type ScoreCategory = Record<string, number>;

export type RoleFunctionScores = Record<CognitiveFunction, Record<StackRole, number>>;

export type RawScores = {
  cognitive: Record<CognitiveFunction, number>;
  roleFunctions: RoleFunctionScores;
  stackRole: Record<StackRole, number>;
  mbtiAxis: ScoreCategory;
  enneagram: ScoreCategory;
  instinct: ScoreCategory;
  bigFive: ScoreCategory;
  hexaco: ScoreCategory;
  attitudinalPsyche: ScoreCategory;
  disc: ScoreCategory;
  riasec: ScoreCategory;
  moral: ScoreCategory;
  decision: ScoreCategory;
  conflict: ScoreCategory;
  communication: ScoreCategory;
  relationship: ScoreCategory;
  stress: ScoreCategory;
  defense: ScoreCategory;
  values: ScoreCategory;
  work: ScoreCategory;
  learning: ScoreCategory;
  coreFear: ScoreCategory;
  coreDesire: ScoreCategory;
  evidence: ScoreCategory;
  contextSpread: Record<string, Record<string, number>>;
  meta: {
    answered: number;
    skipped: number;
    both: number;
    neither: number;
    depends: number;
    left: number;
    right: number;
    contradiction: number;
    ambiguity: number;
    contextDependence: number;
    contextFlexibility: number;
    nonIdentification: number;
    mixedPattern: number;
    reliabilityTotal: number;
    skippedThemes: Record<string, number>;
    skippedKinds: Record<string, number>;
    pairKinds: Record<string, number>;
  };
};

export type RankedScore = {
  key: string;
  score: number;
  percent?: number;
};

export type MBTIStackResult = {
  type: string;
  score: number;
  confidence: number;
  stack: CognitiveFunction[];
  shadow: Record<StackRole, CognitiveFunction>;
  reasons: string[];
};

export type FinalResults = {
  summary: string;
  confidence: number;
  confidenceLabel: string;
  notes: string[];
  mbtiTop: MBTIStackResult[];
  cognitiveRanking: RankedScore[];
  stackRoles: Record<StackRole, CognitiveFunction>;
  shadowRoles: Record<StackRole, CognitiveFunction>;
  dichotomy: Record<string, string>;
  enneagram: {
    top: RankedScore[];
    mainType: string;
    wing: string;
  };
  instinctStack: string;
  tritype: string;
  bigFive: RankedScore[];
  hexaco: RankedScore[];
  socionics: {
    type: string;
    quadra: string;
  };
  temperament: {
    modern: string;
    classical: string;
  };
  attitudinalPsyche: string;
  disc: RankedScore[];
  riasec: RankedScore[];
  moral: RankedScore[];
  decision: RankedScore[];
  conflict: RankedScore[];
  communication: RankedScore[];
  relationship: RankedScore[];
  stress: RankedScore[];
  coreFear: RankedScore[];
  coreDesire: RankedScore[];
  values: RankedScore[];
  work: RankedScore[];
  learning: RankedScore[];
  defense: RankedScore[];
  answerStats: RawScores['meta'];
};
