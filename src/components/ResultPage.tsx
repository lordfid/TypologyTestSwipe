import { FinalResults, RankedScore, StackRole } from '../types';
import { resultDescriptions } from '../data/resultDescriptions';
import { humanKey } from '../scoring/rankScores';
import { ResultSection } from './ResultSection';

type ResultPageProps = {
  result: FinalResults;
  onRestart: () => void;
};

const roleLabel: Record<StackRole, string> = {
  dominant: 'dominant',
  auxiliary: 'auxiliary',
  tertiary: 'tertiary',
  inferior: 'inferior',
  opposing: 'opposing',
  critical: 'critical parent',
  trickster: 'trickster',
  transformative: 'transformative/demon',
};

function ScoreList({ items, max = 8 }: { items: RankedScore[]; max?: number }) {
  return (
    <div className="score-list">
      {items.slice(0, max).map((item) => (
        <div className="score-row" key={item.key}>
          <span>{humanKey(item.key)}</span>
          <div className="mini-bar"><i style={{ width: `${Math.max(4, item.percent ?? 0)}%` }} /></div>
          <b>{Math.round(item.score * 10) / 10}</b>
        </div>
      ))}
    </div>
  );
}

function copyText(result: FinalResults) {
  const lines = [
    'Tes Kepribadian Mendalam',
    '',
    `Ringkasan: ${result.summary}`,
    `Confidence: ${result.confidence}/100 (${result.confidenceLabel})`,
    '',
    `Top 3 MBTI: ${result.mbtiTop.map((item) => `${item.type} ${Math.round(item.confidence)}%`).join(', ')}`,
    `Fungsi: ${result.cognitiveRanking.map((item) => `${item.key}:${Math.round(item.score * 10) / 10}`).join(', ')}`,
    `Enneagram: ${result.enneagram.wing}`,
    `Instinct: ${result.instinctStack}`,
    `Tritype: ${result.tritype}`,
    `Socionics: ${result.socionics.type} (${result.socionics.quadra})`,
    `AP/Psychosophy: ${result.attitudinalPsyche}`,
    '',
    'Catatan:',
    ...result.notes.map((note) => `- ${note}`),
  ];
  navigator.clipboard?.writeText(lines.join('\n'));
}

export function ResultPage({ result, onRestart }: ResultPageProps) {
  const stack = result.mbtiTop[0]?.stack ?? [];
  return (
    <main className="results fade-in">
      <section className="result-hero card">
        <div className="eyebrow">Tes Kepribadian Mendalam</div>
        <h1>Hasilmu</h1>
        <p>{result.summary}</p>
        <div className="result-actions">
          <button className="primary-button" onClick={() => copyText(result)}>Salin hasil</button>
          <button className="ghost-button danger" onClick={onRestart}>Ulangi tes</button>
        </div>
      </section>

      <ResultSection title="1. Ringkasan utama">
        <p><strong>Confidence:</strong> {result.confidence}/100 — {result.confidenceLabel}.</p>
        {result.notes.map((note) => <p key={note}>{note}</p>)}
      </ResultSection>

      <ResultSection title="2. Top 3 MBTI dan stack">
        <div className="top-type-grid">
          {result.mbtiTop.map((item) => (
            <article key={item.type}>
              <h3>{item.type}</h3>
              <p>{Math.round(item.confidence)}% confidence</p>
              <p>{item.stack.join(' → ')}</p>
              <small>{item.reasons[0]}</small>
            </article>
          ))}
        </div>
        <p><strong>Kemungkinan stack utama:</strong> {stack.join(' → ')}</p>
      </ResultSection>

      <ResultSection title="3. Ranking fungsi kognitif">
        <ScoreList items={result.cognitiveRanking} />
        <div className="description-grid">
          {result.cognitiveRanking.slice(0, 4).map((item) => (
            <p key={item.key}><strong>{item.key}:</strong> {resultDescriptions.cognitiveFunctions[item.key as keyof typeof resultDescriptions.cognitiveFunctions]}</p>
          ))}
        </div>
      </ResultSection>

      <ResultSection title="4. Posisi fungsi dan shadow role">
        <div className="role-grid">
          {(['dominant','auxiliary','tertiary','inferior'] as StackRole[]).map((role) => (
            <p key={role}><strong>{roleLabel[role]}:</strong> {result.stackRoles[role]}</p>
          ))}
          {(['opposing','critical','trickster','transformative'] as StackRole[]).map((role) => (
            <p key={role}><strong>{roleLabel[role]}:</strong> {result.shadowRoles[role]}</p>
          ))}
        </div>
      </ResultSection>

      <ResultSection title="5. Enneagram, wing, instinct, tritype">
        <p><strong>Enneagram + wing:</strong> {result.enneagram.wing}</p>
        <ScoreList items={result.enneagram.top} max={3} />
        <p><strong>Instinctual stacking:</strong> {result.instinctStack}</p>
        <p><strong>Tritype:</strong> {result.tritype}</p>
      </ResultSection>

      <ResultSection title="6. Big Five dan HEXACO">
        <h3>Big Five</h3>
        <ScoreList items={result.bigFive} max={5} />
        <h3>HEXACO</h3>
        <ScoreList items={result.hexaco} max={6} />
      </ResultSection>

      <ResultSection title="7. Socionics, temperament, AP/Psychosophy">
        <p><strong>Socionics estimate:</strong> {result.socionics.type}</p>
        <p><strong>Quadra tendency:</strong> {result.socionics.quadra}</p>
        <p><strong>Temperament:</strong> {result.temperament.modern} / {result.temperament.classical}</p>
        <p><strong>Attitudinal Psyche:</strong> {result.attitudinalPsyche}</p>
      </ResultSection>

      <ResultSection title="8. DISC dan RIASEC">
        <h3>DISC</h3>
        <ScoreList items={result.disc} max={4} />
        <h3>RIASEC</h3>
        <ScoreList items={result.riasec} max={6} />
      </ResultSection>

      <ResultSection title="9. Moral, decision, conflict, communication">
        <h3>Moral style</h3>
        <ScoreList items={result.moral} max={5} />
        <h3>Decision-making style</h3>
        <ScoreList items={result.decision} max={5} />
        <h3>Conflict style</h3>
        <ScoreList items={result.conflict} max={5} />
        <h3>Communication style</h3>
        <ScoreList items={result.communication} max={5} />
      </ResultSection>

      <ResultSection title="10. Relationship, stress, fear, desire">
        <h3>Relationship / attachment tendency</h3>
        <ScoreList items={result.relationship} max={7} />
        <h3>Stress response</h3>
        <ScoreList items={result.stress} max={6} />
        <h3>Core fear</h3>
        <ScoreList items={result.coreFear} max={5} />
        <h3>Core desire</h3>
        <ScoreList items={result.coreDesire} max={5} />
      </ResultSection>

      <ResultSection title="11. Values, work, learning, defense">
        <h3>Values ranking</h3>
        <ScoreList items={result.values} max={8} />
        <h3>Work style</h3>
        <ScoreList items={result.work} max={6} />
        <h3>Learning style</h3>
        <ScoreList items={result.learning} max={6} />
        <h3>Shadow / defense pattern</h3>
        <ScoreList items={result.defense} max={7} />
      </ResultSection>

      <ResultSection title="12. Saran membaca hasil">
        {resultDescriptions.readingAdvice.map((line) => <p key={line}>{line}</p>)}
        <p>Jawaban statistik: kiri {result.answerStats.left}, kanan {result.answerStats.right}, dua-duanya {result.answerStats.both}, tidak dua-duanya {result.answerStats.neither}, tergantung {result.answerStats.depends}, lewati {result.answerStats.skipped}.</p>
      </ResultSection>
    </main>
  );
}
