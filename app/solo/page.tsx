'use client';

import React from 'react';
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
      <div className="card-panel space-y-2 text-base text-slate-100" aria-label="Resumen de dinámica">
        <p className="font-semibold text-cyan-100">Antes de empezar:</p>
        <ul className="space-y-1 text-sm leading-relaxed text-slate-200">
          <li>• Duración estimada: 2 a 4 minutos.</li>
          <li>• Selecciona una opción y luego confirma para evitar errores de toque.</li>
          <li>• Puntaje: +100 por cada respuesta correcta.</li>
        </ul>
      </div>
      {hasSessionToResume ? (
        <button
          type="button"
          onClick={resumeGame}
          className="btn-secondary !h-16 !border-emerald-300 !bg-emerald-200 !text-lg !text-emerald-950 hover:!bg-emerald-100"
        >
          Reanudar partida
        </button>
      ) : null}
      <button
        type="button"
        onClick={startGame}
        disabled={loading}
        className="btn-primary !h-16"
      >
        {loading ? 'Preparando partida...' : hasSessionToResume ? 'Iniciar partida nueva' : 'Comenzar partida'}
      </button>
    </section>
  );
}
