'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createSoloSession } from '@/lib/game/sessionFactory';
import { hasInProgressSoloSession, saveSoloSession } from '@/lib/game/session';

export default function SoloStartPage() {
  const [loading, setLoading] = useState(false);
  const [hasSessionToResume, setHasSessionToResume] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setHasSessionToResume(hasInProgressSoloSession());
  }, []);

  const startGame = async () => {
    setLoading(true);
    const session = createSoloSession();
    saveSoloSession(session);
    router.push('/solo/play');
  };

  const resumeGame = () => {
    router.push('/solo/play');
  };

  return (
    <section className="flex min-h-[calc(100dvh-8rem)] flex-col justify-center gap-6">
      <h1 className="text-3xl font-bold">Modo Solo</h1>
      <p className="text-lg leading-relaxed text-slate-100">
        Vas a responder 10 preguntas sobre largometrajes estadounidenses nominados al Oscar.
      </p>
      {hasSessionToResume ? (
        <button
          type="button"
          onClick={resumeGame}
          className="h-16 rounded-2xl border-2 border-emerald-300 bg-emerald-200 px-4 text-lg font-bold text-emerald-950 shadow-sm transition hover:bg-emerald-100"
        >
          Reanudar partida
        </button>
      ) : null}
      <button
        type="button"
        onClick={startGame}
        disabled={loading}
        className="h-16 rounded-2xl border-2 border-cyan-300 bg-cyan-200 px-4 text-lg font-bold text-slate-950 shadow-sm transition hover:bg-cyan-100 disabled:opacity-60"
      >
        {loading ? 'Preparando partida...' : hasSessionToResume ? 'Iniciar partida nueva' : 'Comenzar partida'}
      </button>
    </section>
  );
}
