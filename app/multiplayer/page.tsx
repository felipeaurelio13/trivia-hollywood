import {
  ROOM_MAX_PLAYERS,
  ROOM_MIN_PLAYERS,
  ROOM_CODE_LENGTH
} from '@/lib/multiplayer/room';

export default function MultiplayerPage() {
  return (
    <section className="space-y-6 pt-4">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">Multiplayer (Milestone 2)</h1>
        <p className="text-lg leading-relaxed text-slate-100">
          Salas privadas asíncronas para {ROOM_MIN_PLAYERS}–{ROOM_MAX_PLAYERS} jugadores.
        </p>
      </header>

      <div className="space-y-4 rounded-2xl border-2 border-slate-700 bg-slate-900/70 p-5">
        <h2 className="text-2xl font-semibold">Crear sala</h2>
        <p className="text-lg text-slate-100">Define capacidad y comparte el código con tus amigos.</p>

        <label className="block space-y-2 text-base" htmlFor="capacity">
          <span className="font-semibold text-slate-100">Capacidad</span>
          <input
            id="capacity"
            type="number"
            min={ROOM_MIN_PLAYERS}
            max={ROOM_MAX_PLAYERS}
            defaultValue={2}
            className="h-14 w-full rounded-xl border-2 border-slate-500 bg-slate-950 px-4 text-lg text-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
          />
        </label>

        <button
          type="button"
          disabled
          className="h-16 w-full rounded-2xl border-2 border-slate-500 bg-slate-700 text-lg font-semibold text-slate-200"
        >
          Crear sala (siguiente paso)
        </button>
      </div>

      <div className="space-y-4 rounded-2xl border-2 border-slate-700 bg-slate-900/70 p-5">
        <h2 className="text-2xl font-semibold">Unirse a sala</h2>
        <p className="text-lg text-slate-100">Ingresa un código de {ROOM_CODE_LENGTH} caracteres.</p>

        <label className="block space-y-2 text-base" htmlFor="room-code">
          <span className="font-semibold text-slate-100">Código de sala</span>
          <input
            id="room-code"
            type="text"
            maxLength={ROOM_CODE_LENGTH}
            placeholder="ABC123"
            className="h-14 w-full rounded-xl border-2 border-slate-500 bg-slate-950 px-4 font-semibold uppercase tracking-[0.2em] text-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
          />
        </label>

        <button
          type="button"
          disabled
          className="h-16 w-full rounded-2xl border-2 border-slate-500 bg-slate-700 text-lg font-semibold text-slate-200"
        >
          Unirme (siguiente paso)
        </button>
      </div>
    </section>
  );
}
