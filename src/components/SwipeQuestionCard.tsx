import { useMemo, useRef, useState } from 'react';
import { AnswerKind, QuestionPair } from '../types';

type SwipeQuestionCardProps = {
  pair: QuestionPair;
  index: number;
  total: number;
  onAnswer: (answer: AnswerKind) => void;
  onBack: () => void;
  canBack: boolean;
};

export function SwipeQuestionCard({ pair, index, total, onAnswer, onBack, canBack }: SwipeQuestionCardProps) {
  const [dragX, setDragX] = useState(0);
  const startX = useRef<number | null>(null);
  const cardStyle = useMemo(() => ({ transform: `translateX(${dragX}px) rotate(${dragX / 45}deg)` }), [dragX]);

  const start = (x: number) => { startX.current = x; };
  const move = (x: number) => {
    if (startX.current === null) return;
    const next = x - startX.current;
    setDragX(Math.max(-130, Math.min(130, next)));
  };
  const end = () => {
    if (dragX < -72) onAnswer('left');
    else if (dragX > 72) onAnswer('right');
    setDragX(0);
    startX.current = null;
  };

  return (
    <section className="quiz-area fade-in">
      <div className="quiz-topline">
        <button className="ghost-button" onClick={onBack} disabled={!canBack}>Back</button>
        <span>Situasi {index + 1} dari {total}</span>
        <button className="ghost-button" onClick={() => onAnswer('skip')}>Lewati</button>
      </div>

      <div
        className="swipe-card"
        style={cardStyle}
        onPointerDown={(event) => start(event.clientX)}
        onPointerMove={(event) => move(event.clientX)}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <p className="question-label">Dalam situasi ini, mana yang lebih dekat denganmu?</p>
        <h2>{pair.prompt}</h2>
        <div className="choice-grid">
          <button className="choice-card left-choice" onClick={() => onAnswer('left')}>
            <span>Kartu kiri</span>
            {pair.left.text}
          </button>
          <button className="choice-card right-choice" onClick={() => onAnswer('right')}>
            <span>Kartu kanan</span>
            {pair.right.text}
          </button>
        </div>
        <div className="swipe-caption">
          <span>Geser kiri untuk kartu kiri</span>
          <span>Geser kanan untuk kartu kanan</span>
        </div>
      </div>

      <div className="answer-grid">
        <button onClick={() => onAnswer('left')}>Pilih kiri</button>
        <button onClick={() => onAnswer('right')}>Pilih kanan</button>
        <button onClick={() => onAnswer('both')}>Dua-duanya</button>
        <button onClick={() => onAnswer('neither')}>Tidak dua-duanya</button>
        <button onClick={() => onAnswer('depends')}>Tergantung</button>
        <button onClick={() => onAnswer('skip')}>Lewati</button>
      </div>
    </section>
  );
}
