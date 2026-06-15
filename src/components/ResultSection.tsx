import { ReactNode } from 'react';

type ResultSectionProps = {
  title: string;
  children: ReactNode;
};

export function ResultSection({ title, children }: ResultSectionProps) {
  return (
    <section className="result-section card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
