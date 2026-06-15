import { FinalResults, RawScores } from '../types';
import { calculateAttitudinalPsyche } from './attitudinalPsyche';
import { calculateEnneagram } from './enneagram';
import { calculateInstinctStack } from './instinct';
import { calculateMBTI, calculateDichotomy, inferStackRoles, buildShadow } from './mbtiStack';
import { rankScores } from './rankScores';
import { estimateSocionics } from './socionics';
import { calculateTritype } from './tritype';
import { confidenceLabel } from './scoringGuide';

function contextSpreadScore(raw: RawScores): number {
  const values = Object.values(raw.contextSpread).map((byTheme) => Object.keys(byTheme).length);
  if (!values.length) return 0;
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.min(1, average / 6);
}

function computeConfidence(raw: RawScores, topGap: number): number {
  const answeredTotal = raw.meta.answered + raw.meta.skipped;
  const completeness = answeredTotal ? raw.meta.answered / answeredTotal : 0;
  const contradictionRate = raw.meta.answered ? raw.meta.contradiction / raw.meta.answered : 0;
  const ambiguityRate = raw.meta.answered ? (raw.meta.both + raw.meta.depends + raw.meta.neither) / raw.meta.answered : 0;
  const evidenceVolume = Math.min(1, Object.values(raw.evidence).filter((v) => Math.abs(v) > 1).length / 35);
  const spread = contextSpreadScore(raw);
  const consistency = Math.max(0, 1 - ambiguityRate * 0.75);
  const lowContradiction = Math.max(0, 1 - contradictionRate * 1.8);
  const gapScore = Math.max(0, Math.min(1, topGap));

  return Math.round(
    (gapScore * 0.25 + evidenceVolume * 0.18 + spread * 0.18 + consistency * 0.18 + lowContradiction * 0.11 + completeness * 0.1) * 100
  );
}

function inferTemperament(mbti: string, raw: RawScores) {
  const modern = mbti.includes('NT') ? 'NT' : mbti.includes('NF') ? 'NF' : mbti.includes('SJ') ? 'SJ' : 'SP';
  const classical = (() => {
    const c = raw.bigFive.conscientiousness ?? 0;
    const e = raw.bigFive.extraversion ?? 0;
    const n = raw.bigFive.neuroticism ?? 0;
    const d = raw.disc.D ?? 0;
    if (n > c && raw.evidence.withdrawal > raw.evidence.confrontation) return 'melancholic';
    if (raw.evidence.peaceSeeking > d && raw.stress.fawn >= raw.stress.fight) return 'phlegmatic';
    if (d + raw.stress.fight > e + raw.communication.expressive) return 'choleric';
    return 'sanguine';
  })();
  return { modern, classical };
}

function makeSummary(raw: RawScores, mbtiType: string, enneagramType: string): string {
  const observe = (raw.evidence.observeFirst ?? 0) + (raw.evidence.silentMonitoring ?? 0);
  const direct = (raw.evidence.directEngagement ?? 0) + (raw.evidence.actionFirst ?? 0);
  const boundary = (raw.evidence.boundarySetting ?? 0) + (raw.relationship.autonomyProtection ?? 0);
  const care = (raw.moral.careBased ?? 0) + (raw.evidence.peopleFirst ?? 0);
  const control = (raw.evidence.controlSeeking ?? 0) + (raw.stress.control ?? 0);

  const opening = observe >= direct
    ? 'Pola jawabanmu menunjukkan kau sering menahan gerak pertama, melihat celah, lalu baru masuk ketika situasi terasa cukup terbaca.'
    : 'Pola jawabanmu menunjukkan kau lebih sering belajar dari gerak langsung: bertanya, mencoba, mengambil alih kecil, lalu memperbaiki arah sambil berjalan.';
  const middle = boundary > care
    ? 'Saat batasmu disentuh, hasilmu tidak selalu lembut; ada sisi yang bisa menutup pintu, memotong akses, atau bicara sangat dingin.'
    : 'Saat orang lain retak di depanmu, jawabanmu sering bergerak ke arah merawat suasana, menjaga orang tetap berdiri, atau menyelesaikan luka tanpa membuatnya makin ramai.';
  const ending = control > 8
    ? 'Di bawah tekanan, kau cenderung ingin memegang kendali atas bagian yang kacau, terutama ketika namamu, niatmu, atau harga dirimu ikut diseret.'
    : 'Di bawah tekanan, kau lebih sering mencari ruang aman dulu sebelum mengambil sikap yang lebih besar.';

  return `${opening} ${middle} ${ending} Pembacaan utama mengarah ke ${mbtiType} dengan Enneagram ${enneagramType}, tetapi tetap dibaca sebagai kemungkinan tipologi, bukan diagnosis.`;
}

function notes(raw: RawScores): string[] {
  const result: string[] = [];
  if (raw.meta.both > raw.meta.answered * 0.22) {
    result.push('Beberapa bagian hasil dekat karena kau sering memilih dua sisi yang sama-sama terasa benar. Ini bisa berarti responsmu terbagi antara keadaan biasa dan keadaan tertekan.');
  }
  if (raw.meta.depends > raw.meta.answered * 0.18) {
    result.push('Jawaban “tergantung” cukup banyak, jadi hasilmu sangat kontekstual. Tipe teratas dibaca sebagai kecenderungan paling sering muncul, bukan label final.');
  }
  if (raw.meta.neither > raw.meta.answered * 0.16) {
    result.push('Beberapa kali kau menolak dua pilihan yang tersedia. Itu membuat confidence turun dan menunjukkan ada pola ketiga yang tidak selalu tertangkap oleh pasangan pertanyaan.');
  }
  if (raw.meta.skipped > 10) {
    result.push('Ada cukup banyak pertanyaan yang dilewati. Area yang banyak dilewati sebaiknya tidak dibaca terlalu keras.');
  }
  if (!result.length) result.push('Jawabanmu cukup terbaca lintas konteks, tetapi hasil ini tetap interpretasi tipologi, bukan kesimpulan mutlak tentang dirimu.');
  return result;
}

export function calculateResults(raw: RawScores): FinalResults {
  const mbtiTop = calculateMBTI(raw);
  const enneagram = calculateEnneagram(raw);
  const topGap = mbtiTop.length > 1 ? Math.max(0, mbtiTop[0].score - mbtiTop[1].score) : 1;
  const confidence = computeConfidence(raw, topGap * 2.5);
  const topType = mbtiTop[0]?.type ?? 'INFJ';
  const stackRoles = inferStackRoles(raw);
  const shadowRoles = buildShadow(mbtiTop[0]?.stack ?? [stackRoles.dominant, stackRoles.auxiliary, stackRoles.tertiary, stackRoles.inferior]);

  return {
    summary: makeSummary(raw, topType, enneagram.wing),
    confidence,
    confidenceLabel: confidenceLabel(confidence),
    notes: notes(raw),
    mbtiTop,
    cognitiveRanking: rankScores(raw.cognitive),
    stackRoles,
    shadowRoles,
    dichotomy: calculateDichotomy(raw),
    enneagram,
    instinctStack: calculateInstinctStack(raw),
    tritype: calculateTritype(raw, enneagram.mainType),
    bigFive: rankScores(raw.bigFive),
    hexaco: rankScores(raw.hexaco),
    socionics: estimateSocionics(topType),
    temperament: inferTemperament(topType, raw),
    attitudinalPsyche: calculateAttitudinalPsyche(raw),
    disc: rankScores(raw.disc),
    riasec: rankScores(raw.riasec),
    moral: rankScores(raw.moral, 5),
    decision: rankScores(raw.decision, 5),
    conflict: rankScores(raw.conflict, 5),
    communication: rankScores(raw.communication, 5),
    relationship: rankScores(raw.relationship, 7),
    stress: rankScores(raw.stress, 6),
    coreFear: rankScores(raw.coreFear, 5),
    coreDesire: rankScores(raw.coreDesire, 5),
    values: rankScores(raw.values, 8),
    work: rankScores(raw.work, 6),
    learning: rankScores(raw.learning, 6),
    defense: rankScores(raw.defense, 7),
    answerStats: raw.meta,
  };
}
