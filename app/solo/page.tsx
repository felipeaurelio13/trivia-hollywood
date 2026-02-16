'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { saveSoloSession } from '@/lib/game/session';
import { createSoloSession } from '@/lib/game/sessionFactory';

export default function SoloStartPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const startGame = async () => {
    setLoading(true);
    const session = createSoloSession();
    saveSoloSession(session);
    router.push('/solo/play');
  };

  return (
    <section className="flex min-h-[calc(100dvh-7rem)] flex-col justify-center gap-5">
      <h1 className="text-2xl font-bold">Modo Solo</h1>
      <p className="text-sm text-slate-300">
        Vas a responder 10 preguntas sobre largometrajes estadounidenses nominados al Oscar.
      </p>
      <button
        type="button"
        onClick={startGame}
        disabled={loading}
        className="h-14 rounded-2xl bg-cyan-500 text-base font-semibold text-slate-950 disabled:opacity-50"
      >
        {loading ? 'Preparando partida...' : 'Comenzar partida'}
      </button>
    </section>
  );
}
