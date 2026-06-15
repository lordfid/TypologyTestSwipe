import { PairKind, StackRole } from '../types';

export const cognitiveFunctions = ['Ni', 'Ne', 'Si', 'Se', 'Fi', 'Fe', 'Ti', 'Te'] as const;
export const stackRoles = ['dominant', 'auxiliary', 'tertiary', 'inferior', 'opposing', 'critical', 'trickster', 'transformative'] as const;

export const roleWeights: Record<StackRole, number> = {
  dominant: 4,
  auxiliary: 3,
  tertiary: 2,
  inferior: 1.5,
  opposing: 2,
  critical: 2,
  trickster: 1.2,
  transformative: 1.2,
};

export const pairKindModifier: Record<PairKind, number> = {
  cognitiveContrast: 1,
  roleContrast: 0.95,
  sameBehaviorDifferentMotive: 0.9,
  sameMotiveDifferentBehavior: 0.9,
  shadowContrast: 0.85,
  traitContrast: 0.8,
  tieBreak: 1.1,
  symbolicChoice: 0.9,
  chatChoice: 0.9,
  placeChoice: 0.85,
};

export const answerLabels = {
  left: 'Pilih kiri',
  right: 'Pilih kanan',
  both: 'Dua-duanya',
  neither: 'Tidak dua-duanya',
  depends: 'Tergantung',
  skip: 'Lewati',
};

export function confidenceLabel(value: number): string {
  if (value < 40) return 'lemah / masih kabur';
  if (value < 60) return 'sedang';
  if (value < 75) return 'cukup kuat';
  if (value < 90) return 'kuat';
  return 'sangat kuat, tetap bukan diagnosis';
}

export const readableLabels: Record<string, string> = {
  openness: 'Openness',
  conscientiousness: 'Conscientiousness',
  extraversion: 'Extraversion',
  agreeableness: 'Agreeableness',
  neuroticism: 'Neuroticism',
  honestyHumility: 'Honesty-Humility',
  emotionality: 'Emotionality',
  ruleBased: 'rule-based',
  careBased: 'care-based',
  justiceBased: 'justice-based',
  loyaltyBased: 'loyalty-based',
  freedomBased: 'freedom-based',
  outcomeBased: 'outcome-based',
  truthBased: 'truth-based',
  purityIntegrityBased: 'purity / integrity-based',
  secureLeaning: 'relasi cukup aman',
  anxiousLeaning: 'butuh kepastian relasi',
  avoidantLeaning: 'menjauh saat terluka',
  fearfulAvoidantLeaning: 'ingin dekat tapi mudah mundur',
  fight: 'melawan balik',
  flight: 'pergi / kabur',
  freeze: 'membeku',
  fawn: 'menenangkan orang dulu',
  control: 'mengambil alih',
  collapse: 'drop total',
  intellectualize: 'membawa semua ke kepala',
  numb: 'mematikan rasa',
  perform: 'tetap tampil',
  isolate: 'mengurung diri',
};
