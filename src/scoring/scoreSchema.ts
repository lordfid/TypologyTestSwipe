import { CognitiveFunction, RawScores, StackRole } from '../types';
import { cognitiveFunctions, stackRoles } from './scoringGuide';

const emptyRecord = (keys: readonly string[]): Record<string, number> =>
  Object.fromEntries(keys.map((key) => [key, 0]));

const cognitiveEmpty = (): Record<CognitiveFunction, number> =>
  Object.fromEntries(cognitiveFunctions.map((key) => [key, 0])) as Record<CognitiveFunction, number>;

const roleEmpty = (): Record<StackRole, number> =>
  Object.fromEntries(stackRoles.map((key) => [key, 0])) as Record<StackRole, number>;

export const scoreKeys = {
  mbtiAxis: ['I', 'E', 'S', 'N', 'T', 'F', 'J', 'P'],
  enneagram: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
  instinct: ['sp', 'sx', 'so'],
  bigFive: ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'],
  hexaco: ['honestyHumility', 'emotionality', 'extraversion', 'agreeableness', 'conscientiousness', 'openness'],
  attitudinalPsyche: [
    'L_confidence', 'L_flexibility', 'L_insecurity', 'L_indifference',
    'E_confidence', 'E_flexibility', 'E_insecurity', 'E_indifference',
    'F_confidence', 'F_flexibility', 'F_insecurity', 'F_indifference',
    'V_confidence', 'V_flexibility', 'V_insecurity', 'V_indifference',
  ],
  disc: ['D', 'I', 'S', 'C'],
  riasec: ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'],
  moral: ['ruleBased', 'careBased', 'justiceBased', 'loyaltyBased', 'freedomBased', 'outcomeBased', 'truthBased', 'purityIntegrityBased'],
  decision: ['intuitiveLongView', 'optionExplorer', 'experienceBased', 'actionBased', 'valueLed', 'peopleLed', 'logicLed', 'executionLed'],
  conflict: ['avoiding', 'confronting', 'compromising', 'strategicDelay', 'directRepair', 'silentExit'],
  communication: ['softDirect', 'bluntDirect', 'expressive', 'reserved', 'written', 'practical', 'humorShield'],
  relationship: ['secureLeaning', 'anxiousLeaning', 'avoidantLeaning', 'fearfulAvoidantLeaning', 'reassuranceSeeking', 'intimacyFear', 'abandonmentFear', 'autonomyProtection', 'emotionalTesting', 'withdrawalWhenHurt', 'overExplaining', 'silentMonitoring'],
  stress: ['fight', 'flight', 'freeze', 'fawn', 'control', 'collapse', 'intellectualize', 'numb', 'perform', 'isolate'],
  defense: ['withdrawal', 'peoplePleasing', 'intellectualization', 'perfectionism', 'control', 'humorDeflection', 'idealization', 'devaluation', 'emotionalSuppression', 'rationalization', 'projection', 'selfBlame', 'avoidance', 'overExplaining'],
  values: ['meaning', 'freedom', 'stability', 'love', 'truth', 'success', 'beauty', 'power', 'peace', 'impact', 'skill', 'respect', 'belonging'],
  work: ['planner', 'executor', 'mediator', 'creator', 'analyst', 'rescuer', 'leader', 'specialist', 'supporter', 'improviser'],
  learning: ['deepDive', 'tryFirst', 'repeatPractice', 'discussion', 'visualStory', 'stepByStep', 'soloStudy', 'teachOthers'],
  coreFear: ['fearWrong', 'fearUnwanted', 'fearFailure', 'fearOrdinary', 'fearIncompetent', 'fearUnsafe', 'fearTrapped', 'fearControlled', 'fearConflict', 'fearBetrayal'],
  coreDesire: ['needIntegrity', 'needNeeded', 'needAchievement', 'needIdentity', 'needUnderstanding', 'needCertainty', 'needFreedom', 'needStrength', 'needPeace', 'needLove', 'needAutonomy'],
  evidence: [
    'patternReading', 'possibilitySeeking', 'memoryReferencing', 'sensoryImmediacy', 'personalValueFiltering', 'socialHarmonyMonitoring', 'internalLogicChecking', 'externalEfficiencySeeking', 'futureProjection', 'pastComparison', 'bodyAwareness', 'statusAwareness', 'rejectionSensitivity', 'autonomyProtection', 'controlSeeking', 'intimacySeeking', 'emotionalSuppression', 'emotionalExpression', 'riskAvoidance', 'riskTaking', 'orderSeeking', 'noveltySeeking', 'meaningSeeking', 'validationSeeking', 'truthSeeking', 'peaceSeeking', 'achievementSeeking', 'competenceSeeking', 'loyaltySeeking', 'justiceSeeking', 'comfortSeeking', 'intensitySeeking', 'belongingSeeking', 'shameResponse', 'fearResponse', 'angerResponse', 'withdrawal', 'confrontation', 'appeasement', 'analysisLoop', 'actionFirst', 'observeFirst', 'peopleFirst', 'systemFirst', 'selfFirst', 'dutyFirst', 'boundarySetting', 'ambiguityTolerance', 'certaintySeeking', 'imageManagement', 'emotionalTesting', 'overExplaining', 'silentMonitoring', 'practicalRepair', 'symbolicMeaning', 'directEngagement', 'indirectEngagement', 'contextSensitivity', 'nonIdentification', 'mixedPattern', 'selfRespect'],
};

export function createEmptyRawScores(): RawScores {
  const roleFunctions = Object.fromEntries(
    cognitiveFunctions.map((fn) => [fn, roleEmpty()])
  ) as RawScores['roleFunctions'];

  return {
    cognitive: cognitiveEmpty(),
    roleFunctions,
    stackRole: roleEmpty(),
    mbtiAxis: emptyRecord(scoreKeys.mbtiAxis),
    enneagram: emptyRecord(scoreKeys.enneagram),
    instinct: emptyRecord(scoreKeys.instinct),
    bigFive: emptyRecord(scoreKeys.bigFive),
    hexaco: emptyRecord(scoreKeys.hexaco),
    attitudinalPsyche: emptyRecord(scoreKeys.attitudinalPsyche),
    disc: emptyRecord(scoreKeys.disc),
    riasec: emptyRecord(scoreKeys.riasec),
    moral: emptyRecord(scoreKeys.moral),
    decision: emptyRecord(scoreKeys.decision),
    conflict: emptyRecord(scoreKeys.conflict),
    communication: emptyRecord(scoreKeys.communication),
    relationship: emptyRecord(scoreKeys.relationship),
    stress: emptyRecord(scoreKeys.stress),
    defense: emptyRecord(scoreKeys.defense),
    values: emptyRecord(scoreKeys.values),
    work: emptyRecord(scoreKeys.work),
    learning: emptyRecord(scoreKeys.learning),
    coreFear: emptyRecord(scoreKeys.coreFear),
    coreDesire: emptyRecord(scoreKeys.coreDesire),
    evidence: emptyRecord(scoreKeys.evidence),
    contextSpread: {},
    meta: {
      answered: 0,
      skipped: 0,
      both: 0,
      neither: 0,
      depends: 0,
      left: 0,
      right: 0,
      contradiction: 0,
      ambiguity: 0,
      contextDependence: 0,
      contextFlexibility: 0,
      nonIdentification: 0,
      mixedPattern: 0,
      reliabilityTotal: 0,
      skippedThemes: {},
      skippedKinds: {},
      pairKinds: {},
    },
  };
}
