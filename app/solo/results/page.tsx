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
      <section className="space-y-4 pt-6">
        <p>No hay partida reciente.</p>
        <Link href="/solo" className="text-cyan-300 underline">
          Empezar una nueva
        </Link>
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100dvh-7rem)] flex-col justify-center gap-4">
      <h1 className="text-2xl font-bold">Resultados</h1>
      <div className="space-y-2 rounded-2xl border border-slate-800 p-4">
        <p className="text-sm text-slate-300">Puntaje total</p>
        <p className="text-4xl font-bold text-cyan-300">{result.score}</p>
        <p className="text-sm">Aciertos: {result.correctAnswers}/10</p>
        <p className="text-sm">Tiempo total: {formatSeconds(result.elapsedMs)}</p>
      </div>
      <Link
        href="/solo"
        className="flex h-12 items-center justify-center rounded-2xl bg-cyan-500 font-semibold text-slate-950"
      >
        Jugar otra vez
      </Link>
    </section>
  );
}
