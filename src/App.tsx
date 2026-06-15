import { useEffect, useMemo, useState } from 'react';
import { questionPairs } from './data/questionPairs';
import { AnswerKind, AnswerRecord } from './types';
import { auditScoring } from './scoring/auditScoring';
import { calculateRawScores } from './scoring/calculateRawScores';
import { calculateResults } from './scoring/calculateResults';
import { ProgressBar } from './components/ProgressBar';
import { ResultPage } from './components/ResultPage';
import { StartScreen } from './components/StartScreen';
import { SwipeQuestionCard } from './components/SwipeQuestionCard';
import { ThemeToggle } from './components/ThemeToggle';

const STORAGE_KEY = 'tes-kepribadian-mendalam:v1';
const THEME_KEY = 'tes-kepribadian-mendalam:theme';

type Phase = 'start' | 'quiz' | 'result';

type StoredProgress = {
  answers: Record<string, AnswerRecord>;
  currentIndex: number;
};

function loadProgress(): StoredProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { answers: {}, currentIndex: 0 };
    const parsed = JSON.parse(raw) as StoredProgress;
    return {
      answers: parsed.answers ?? {},
      currentIndex: Math.min(Math.max(parsed.currentIndex ?? 0, 0), questionPairs.length - 1),
    };
  } catch {
    return { answers: {}, currentIndex: 0 };
  }
}

function loadTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'dark';
}

export default function App() {
  const saved = useMemo(loadProgress, []);
  const [theme, setTheme] = useState<'light' | 'dark'>(loadTheme);
  const [phase, setPhase] = useState<Phase>('start');
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>(saved.answers);
  const [currentIndex, setCurrentIndex] = useState(saved.currentIndex);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, currentIndex }));
  }, [answers, currentIndex]);

  useEffect(() => {
    auditScoring(questionPairs);
  }, []);

  useEffect(() => {
    if (phase !== 'quiz') return;
    const handler = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const map: Record<string, AnswerKind> = { a: 'left', d: 'right', w: 'both', s: 'neither', t: 'depends', l: 'skip' };
      const answer = map[key];
      if (answer) handleAnswer(answer);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, currentIndex, answers]);

  const answeredCount = Object.keys(answers).length;
  const result = useMemo(() => {
    const raw = calculateRawScores(questionPairs, answers);
    return calculateResults(raw);
  }, [answers]);

  function startFresh() {
    setAnswers({});
    setCurrentIndex(0);
    setPhase('quiz');
  }

  function resetAll() {
    setAnswers({});
    setCurrentIndex(0);
    localStorage.removeItem(STORAGE_KEY);
    setPhase('start');
  }

  function continueTest() {
    setPhase('quiz');
  }

  function handleAnswer(answer: AnswerKind) {
    const pair = questionPairs[currentIndex];
    if (!pair) return;
    const nextAnswers = {
      ...answers,
      [pair.id]: { pairId: pair.id, answer, answeredAt: Date.now() },
    };
    setAnswers(nextAnswers);
    if (currentIndex >= questionPairs.length - 1) {
      setPhase('result');
      return;
    }
    setCurrentIndex((index) => Math.min(index + 1, questionPairs.length - 1));
  }

  function goBack() {
    setCurrentIndex((index) => Math.max(0, index - 1));
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <span className="app-name">Tes Kepribadian Mendalam</span>
          <small>pilih adegan yang paling dekat denganmu</small>
        </div>
        <ThemeToggle theme={theme} onToggle={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')} />
      </header>

      {phase === 'start' ? (
        <StartScreen
          total={questionPairs.length}
          hasProgress={answeredCount > 0}
          onStart={startFresh}
          onContinue={continueTest}
          onReset={resetAll}
        />
      ) : null}

      {phase === 'quiz' ? (
        <>
          <ProgressBar current={Math.min(answeredCount + 1, questionPairs.length)} total={questionPairs.length} />
          <SwipeQuestionCard
            pair={questionPairs[currentIndex]}
            index={currentIndex}
            total={questionPairs.length}
            onAnswer={handleAnswer}
            onBack={goBack}
            canBack={currentIndex > 0}
          />
        </>
      ) : null}

      {phase === 'result' ? <ResultPage result={result} onRestart={resetAll} /> : null}
    </div>
  );
}
