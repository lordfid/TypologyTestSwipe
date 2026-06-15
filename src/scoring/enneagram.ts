import { RankedScore, RawScores } from '../types';
import { rankScores } from './rankScores';

export const enneagramBlurbs: Record<string, { fear: string; desire: string; note: string }> = {
  '1': { fear: 'takut salah arah atau menjadi orang yang tidak bisa dipercaya', desire: 'ingin tetap lurus dan bisa menghormati dirinya sendiri', note: 'sering muncul sebagai dorongan memperbaiki, menahan marah, dan menuntut diri lebih keras.' },
  '2': { fear: 'takut tidak dibutuhkan atau dicintai saat tidak memberi apa-apa', desire: 'ingin terasa berarti bagi orang yang dipedulikan', note: 'sering muncul lewat perhatian, bantuan, dan luka saat usaha tidak dilihat.' },
  '3': { fear: 'takut gagal, tidak bernilai, atau kalah di mata orang', desire: 'ingin berhasil dan terlihat mampu', note: 'sering muncul lewat dorongan tampil kuat, produktif, dan tidak mau terlihat runtuh.' },
  '4': { fear: 'takut menjadi biasa saja atau tidak punya tempat yang terasa benar', desire: 'ingin hidupnya terasa khas, jujur, dan dalam', note: 'sering muncul lewat kepekaan, rasa kurang, dan kebutuhan akan cerita yang terasa milik sendiri.' },
  '5': { fear: 'takut tidak siap, tidak paham, atau kehabisan tenaga', desire: 'ingin mengerti sebelum masuk terlalu jauh', note: 'sering muncul lewat jarak, pengamatan, dan kebutuhan menguasai sesuatu dari dalam.' },
  '6': { fear: 'takut ditinggal dalam keadaan tidak siap', desire: 'ingin pegangan, kejelasan, dan orang yang bisa dipercaya', note: 'sering muncul lewat cek ulang, curiga sehat, dan kesetiaan yang diuji.' },
  '7': { fear: 'takut terjebak dalam rasa sakit atau hidup yang sempit', desire: 'ingin jalan keluar, napas baru, dan ruang bergerak', note: 'sering muncul lewat candaan, kabur cepat, dan mencari pintu lain saat hidup terasa mengurung.' },
  '8': { fear: 'takut dikendalikan, dilemahkan, atau dibuat tidak berdaya', desire: 'ingin kuat, bebas, dan melindungi yang dianggap miliknya', note: 'sering muncul lewat keberanian menyerang balik dan alergi pada permainan kuasa.' },
  '9': { fear: 'takut pecah hubungan, ribut panjang, atau kehilangan tenang', desire: 'ingin damai, tidak dipaksa memilih sisi, dan tetap punya tempat', note: 'sering muncul lewat meredakan, menunda marah, atau menghilang pelan-pelan.' },
};

const neighbors: Record<string, [string, string]> = {
  '1': ['9', '2'], '2': ['1', '3'], '3': ['2', '4'], '4': ['3', '5'], '5': ['4', '6'],
  '6': ['5', '7'], '7': ['6', '8'], '8': ['7', '9'], '9': ['8', '1'],
};

export function calculateEnneagram(raw: RawScores): { top: RankedScore[]; mainType: string; wing: string } {
  const mixed: Record<string, number> = { ...raw.enneagram };
  const fearToType: Record<string, string> = {
    fearWrong: '1', fearUnwanted: '2', fearFailure: '3', fearOrdinary: '4', fearIncompetent: '5',
    fearUnsafe: '6', fearTrapped: '7', fearControlled: '8', fearConflict: '9',
  };
  const desireToType: Record<string, string> = {
    needIntegrity: '1', needNeeded: '2', needAchievement: '3', needIdentity: '4', needUnderstanding: '5',
    needCertainty: '6', needFreedom: '7', needStrength: '8', needPeace: '9',
  };
  Object.entries(raw.coreFear).forEach(([key, value]) => {
    const type = fearToType[key];
    if (type) mixed[type] = (mixed[type] ?? 0) + value * 0.7;
  });
  Object.entries(raw.coreDesire).forEach(([key, value]) => {
    const type = desireToType[key];
    if (type) mixed[type] = (mixed[type] ?? 0) + value * 0.55;
  });

  const top = rankScores(mixed).slice(0, 3);
  const mainType = top[0]?.key ?? '9';
  const [a, b] = neighbors[mainType];
  const wingType = (mixed[a] ?? 0) >= (mixed[b] ?? 0) ? a : b;
  return { top, mainType, wing: `${mainType}w${wingType}` };
}
