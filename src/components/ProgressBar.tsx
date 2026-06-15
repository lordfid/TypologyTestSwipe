type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = total ? Math.min(100, Math.round((current / total) * 100)) : 0;
  return (
    <div className="progress-wrap" aria-label={`Progress ${percent}%`}>
      <div className="progress-line">
        <span style={{ width: `${percent}%` }} />
      </div>
      <p>{current} / {total}</p>
    </div>
  );
}
