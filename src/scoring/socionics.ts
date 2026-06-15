const map: Record<string, { type: string; quadra: string }> = {
  INTJ: { type: 'ILI / LII dekat', quadra: 'Gamma atau Alpha' },
  INFJ: { type: 'IEI / EII dekat', quadra: 'Beta atau Delta' },
  ENTJ: { type: 'LIE', quadra: 'Gamma' },
  ENFJ: { type: 'EIE', quadra: 'Beta' },
  INTP: { type: 'LII / ILI dekat', quadra: 'Alpha atau Gamma' },
  INFP: { type: 'EII / IEI dekat', quadra: 'Delta atau Beta' },
  ENTP: { type: 'ILE', quadra: 'Alpha' },
  ENFP: { type: 'IEE', quadra: 'Delta' },
  ISTJ: { type: 'SLI / LSI dekat', quadra: 'Delta atau Beta' },
  ISFJ: { type: 'SEI / ESI dekat', quadra: 'Alpha atau Gamma' },
  ESTJ: { type: 'LSE', quadra: 'Delta' },
  ESFJ: { type: 'ESE', quadra: 'Alpha' },
  ISTP: { type: 'LSI / SLI dekat', quadra: 'Beta atau Delta' },
  ISFP: { type: 'ESI / SEI dekat', quadra: 'Gamma atau Alpha' },
  ESTP: { type: 'SLE', quadra: 'Beta' },
  ESFP: { type: 'SEE', quadra: 'Gamma' },
};

export function estimateSocionics(mbti: string): { type: string; quadra: string } {
  return map[mbti] ?? { type: 'belum jelas', quadra: 'campuran' };
}
