import { PrimaryButton } from '@/components/PrimaryButton';

export default function HomePage() {
  return (
    <section className="flex min-h-[calc(100dvh-7rem)] flex-col justify-center gap-6">
      <header className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Mobile-first trivia</p>
        <h1 className="text-3xl font-bold">Hollywood + Oscar</h1>
        <p className="text-sm text-slate-300">10 preguntas por partida, feedback inmediato y experiencia simple.</p>
      </header>

      <div className="space-y-3">
        <PrimaryButton href="/solo" ariaLabel="Jugar modo solo">
          Solo
        </PrimaryButton>
        <PrimaryButton href="/multiplayer" ariaLabel="Ir a modo multiplayer">
          Multiplayer
        </PrimaryButton>
        <PrimaryButton href="/settings" ariaLabel="Abrir ajustes">
          Ajustes
        </PrimaryButton>
      </div>
    </section>
  );
}
