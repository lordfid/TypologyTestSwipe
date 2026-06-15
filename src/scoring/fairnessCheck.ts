import { QuestionPair } from '../types';

const forbiddenChoiceWords = ['pola', 'interaksi', 'makna', 'kemungkinan', 'harmoni', 'nilai pribadi', 'logika internal', 'efisiensi', 'sensorik', 'masa depan', 'masa lalu', 'struktur', 'sistem', 'konsistensi', 'validasi', 'identitas', 'intensitas', 'keamanan', 'kontrol', 'otonomi', 'keteraturan', 'spontanitas', 'abstrak', 'konkret', 'intuitif', 'rasional', 'emosional', 'sosial', 'fungsi', 'tipe', 'enneagram', 'mbti', 'introvert', 'extrovert'];

function addCount(record: Record<string, number>, key: string, amount = 1) {
  record[key] = (record[key] ?? 0) + amount;
}

export function fairnessCheck(pairs: QuestionPair[]) {
  const kindCounts: Record<string, number> = {};
  const evidenceCounts: Record<string, number> = {};
  const functionCounts: Record<string, number> = {};
  const roleCounts: Record<string, number> = {};
  let emptySides = 0;
  let extreme = 0;
  const suspiciousText: string[] = [];

  pairs.forEach((pair) => {
    addCount(kindCounts, pair.kind);
    if (pair.opposition.strength === 'extreme') extreme += 1;
    [pair.left, pair.right].forEach((side) => {
      const hasAny = Object.keys(side.weights).some((key) => key !== 'reliability');
      if (!hasAny) emptySides += 1;
      Object.keys(side.weights.evidence ?? {}).forEach((key) => addCount(evidenceCounts, key));
      Object.keys(side.weights.cognitive ?? {}).forEach((key) => addCount(functionCounts, key));
      Object.keys(side.weights.stackRole ?? {}).forEach((key) => addCount(roleCounts, key));
      const lower = side.text.toLowerCase();
      forbiddenChoiceWords.forEach((word) => {
        if (lower.includes(word)) suspiciousText.push(`${pair.id}:${side.id}:${word}`);
      });
    });
  });

  const warnings: string[] = [];
  if (pairs.length < 180) warnings.push(`Jumlah pair baru ${pairs.length}; minimal 180.`);
  if (emptySides) warnings.push(`${emptySides} sisi pilihan tidak punya bobot.`);
  if (extreme > pairs.length * 0.18) warnings.push('Terlalu banyak pair extreme; peserta bisa merasa dipaksa.');
  ['Ni', 'Ne', 'Si', 'Se', 'Fi', 'Fe', 'Ti', 'Te'].forEach((fn) => {
    if (!functionCounts[fn] || functionCounts[fn] < 20) warnings.push(`Fungsi ${fn} kurang terwakili.`);
  });
  ['dominant', 'auxiliary', 'tertiary', 'inferior', 'opposing', 'critical', 'trickster', 'transformative'].forEach((role) => {
    if (!roleCounts[role] || roleCounts[role] < 10) warnings.push(`Role ${role} kurang trigger.`);
  });
  if (suspiciousText.length) warnings.push(`Ada pilihan yang mengandung kata terlalu jelas: ${suspiciousText.slice(0, 8).join(', ')}`);

  return { warnings, kindCounts, evidenceCounts, functionCounts, roleCounts };
}
