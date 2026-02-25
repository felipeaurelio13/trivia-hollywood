import React from 'react';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function HomePage() {
  return (
    <section className="flex min-h-[calc(100dvh-8rem)] flex-col justify-center gap-8">
      <header className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Trivia clara y simple</p>
        <h1 className="text-4xl font-bold leading-tight">Hollywood + Oscar</h1>
        <p className="text-lg leading-relaxed text-slate-100">
          Letras grandes, alto contraste y pasos guiados para jugar sin complicaciones.
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-2 text-sm font-semibold text-cyan-100" aria-label="Resumen rápido del juego">
        <li className="rounded-xl border border-cyan-400/60 bg-cyan-950/40 px-3 py-2 text-center">10 preguntas</li>
        <li className="rounded-xl border border-cyan-400/60 bg-cyan-950/40 px-3 py-2 text-center">4 opciones</li>
        <li className="rounded-xl border border-cyan-400/60 bg-cyan-950/40 px-3 py-2 text-center">+100 acierto</li>
        <li className="rounded-xl border border-cyan-400/60 bg-cyan-950/40 px-3 py-2 text-center">Sin vidas</li>
      </ul>

      <div className="space-y-4">
        <PrimaryButton href="/solo" ariaLabel="Jugar modo solo">
          Jugar modo Solo
        </PrimaryButton>
        <PrimaryButton href="/multiplayer" ariaLabel="Ir a modo multiplayer">
          Ir a Multiplayer
        </PrimaryButton>
        <PrimaryButton href="/settings" ariaLabel="Abrir ajustes">
          Abrir Ajustes
        </PrimaryButton>
      </div>
    </section>
  );
}
