'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';

function formatSeconds(ms: number) {
  return `${Math.round(ms / 1000)} s`;
}

function buildPerformanceLabel(correctAnswers: number) {
  if (correctAnswers >= 8) return 'Racha de experto en Hollywood';
  if (correctAnswers >= 5) return 'Buen dominio, vas por excelente camino';
  return 'Sigue jugando: cada ronda mejora tu memoria cinéfila';
}

export default function SoloResultsPage() {
  const [copied, setCopied] = useState(false);
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

  const performanceLabel = buildPerformanceLabel(result.correctAnswers);

  const copySummary = async () => {
    const summary = `Trivia Hollywood: ${result.correctAnswers}/10, ${result.score} puntos en ${formatSeconds(result.elapsedMs)}.`;
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
  };

  return (
    <section className="flex min-h-[calc(100dvh-8rem)] flex-col justify-center gap-5">
      <h1 className="text-3xl font-bold">Resultados</h1>
      <div className="card-panel space-y-3">
        <p className="text-base text-slate-200">Puntaje total</p>
        <p className="text-5xl font-bold text-cyan-200">{result.score}</p>
        <p className="text-lg">Aciertos: {result.correctAnswers}/10</p>
        <p className="text-lg">Tiempo total: {formatSeconds(result.elapsedMs)}</p>
        <p className="rounded-xl border border-cyan-400/60 bg-cyan-950/40 px-3 py-2 text-sm font-semibold text-cyan-100">
          {performanceLabel}
        </p>
      </div>
      <p className="text-sm text-slate-200" aria-live="polite">
        Consejo rápido: mejora tu puntaje si priorizas precisión sobre velocidad.
      </p>
      <button
        type="button"
        onClick={copySummary}
        className="btn-secondary"
      >
        {copied ? 'Resumen copiado' : 'Copiar resumen'}
      </button>
      <Link
        href="/solo"
        className="btn-primary !flex !h-16 !items-center !justify-center"
      >
        Jugar otra vez
      </Link>
      <Link href="/" className="text-center text-sm font-semibold text-cyan-200 underline underline-offset-4">
        Volver al inicio
      </Link>
    </section>
  );
}
