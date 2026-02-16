import {
  ROOM_MAX_PLAYERS,
  ROOM_MIN_PLAYERS,
  ROOM_CODE_LENGTH
} from '@/lib/multiplayer/room';

export default function MultiplayerPage() {
  return (
    <section className="space-y-6 pt-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Multiplayer (Milestone 2)</h1>
        <p className="text-sm text-slate-300">
          Salas privadas asíncronas para {ROOM_MIN_PLAYERS}–{ROOM_MAX_PLAYERS} jugadores. Flujo mobile-first
          pensado para crear y unirse en segundos.
        </p>
      </header>

      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h2 className="text-lg font-semibold">Crear sala</h2>
        <p className="text-sm text-slate-300">Define capacidad y comparte el código con tus amigos.</p>

        <label className="block space-y-2 text-sm" htmlFor="capacity">
          <span className="font-medium text-slate-100">Capacidad</span>
          <input
            id="capacity"
            type="number"
            min={ROOM_MIN_PLAYERS}
            max={ROOM_MAX_PLAYERS}
            defaultValue={2}
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 text-base text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          />
        </label>

        <button
          type="button"
          disabled
          className="h-14 w-full rounded-2xl bg-slate-700 text-base font-semibold text-slate-300"
        >
          Crear sala (siguiente paso)
        </button>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <h2 className="text-lg font-semibold">Unirse a sala</h2>
        <p className="text-sm text-slate-300">Ingresa un código de {ROOM_CODE_LENGTH} caracteres.</p>

        <label className="block space-y-2 text-sm" htmlFor="room-code">
          <span className="font-medium text-slate-100">Código de sala</span>
          <input
            id="room-code"
            type="text"
            maxLength={ROOM_CODE_LENGTH}
            placeholder="ABC123"
            className="h-12 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 font-semibold uppercase tracking-[0.2em] text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          />
        </label>

        <button
          type="button"
          disabled
          className="h-14 w-full rounded-2xl bg-slate-700 text-base font-semibold text-slate-300"
        >
          Unirme (siguiente paso)
        </button>
      </div>
    </section>
  );
}
