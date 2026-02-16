'use client';

import Link from 'next/link';
import { useMemo } from 'react';

function formatSeconds(ms: number) {
  return `${Math.round(ms / 1000)} s`;
}

export default function SoloResultsPage() {
  const result = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('trivia_hollywood_last_result');
    return raw ? (JSON.parse(raw) as { score: number; correctAnswers: number; elapsedMs: number }) : null;
  }, []);

  if (!result) {
    return (
      <section className="space-y-5 pt-6">
        <p className="text-lg">No hay partida reciente.</p>
        <Link href="/solo" className="text-lg font-semibold text-cyan-200 underline">
          Empezar una nueva
        </Link>
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100dvh-8rem)] flex-col justify-center gap-5">
      <h1 className="text-3xl font-bold">Resultados</h1>
      <div className="space-y-3 rounded-2xl border-2 border-slate-700 p-5">
        <p className="text-base text-slate-200">Puntaje total</p>
        <p className="text-5xl font-bold text-cyan-200">{result.score}</p>
        <p className="text-lg">Aciertos: {result.correctAnswers}/10</p>
        <p className="text-lg">Tiempo total: {formatSeconds(result.elapsedMs)}</p>
      </div>
      <Link
        href="/solo"
        className="flex h-16 items-center justify-center rounded-2xl border-2 border-cyan-300 bg-cyan-200 px-4 text-lg font-bold text-slate-950 shadow-sm transition hover:bg-cyan-100"
      >
        Jugar otra vez
      </Link>
    </section>
  );
}
