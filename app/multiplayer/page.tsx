'use client';

import { useState } from 'react';
import {
  ROOM_MAX_PLAYERS,
  ROOM_MIN_PLAYERS,
  ROOM_CODE_LENGTH,
  normalizeRoomCode
} from '@/lib/multiplayer/room';

interface CreatedRoom {
  code: string;
  maxPlayers: number;
}

export default function MultiplayerPage() {
  const [capacity, setCapacity] = useState(ROOM_MIN_PLAYERS);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<CreatedRoom | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState('');

  const onCreateRoom = async () => {
    setIsCreatingRoom(true);
    setCreateError(null);

    try {
      const response = await fetch('/api/multiplayer/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ maxPlayers: capacity })
      });

      const payload = (await response.json()) as { room?: CreatedRoom; error?: string };

      if (!response.ok || !payload.room) {
        throw new Error(payload.error ?? 'No se pudo crear la sala.');
      }

      setCreatedRoom(payload.room);
    } catch (error) {
      setCreatedRoom(null);
      setCreateError(error instanceof Error ? error.message : 'No se pudo crear la sala.');
    } finally {
      setIsCreatingRoom(false);
    }
  };

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
            value={capacity}
            onChange={(event) => setCapacity(Number(event.target.value))}
            className="h-14 w-full rounded-xl border-2 border-slate-500 bg-slate-950 px-4 text-lg text-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
          />
        </label>

        <button
          type="button"
          onClick={onCreateRoom}
          disabled={isCreatingRoom}
          className="h-16 w-full rounded-2xl border-2 border-cyan-300 bg-cyan-200 text-lg font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:opacity-60"
        >
          {isCreatingRoom ? 'Creando sala...' : 'Crear sala privada'}
        </button>

        {createdRoom ? (
          <div className="space-y-2 rounded-2xl border-2 border-emerald-300 bg-emerald-950/50 p-4">
            <p className="text-sm uppercase tracking-[0.16em] text-emerald-200">Código de sala</p>
            <p className="text-3xl font-bold tracking-[0.22em] text-emerald-100">{createdRoom.code}</p>
            <p className="text-base text-emerald-100">
              Sala lista para hasta {createdRoom.maxPlayers} jugadores.
            </p>
          </div>
        ) : null}

        {createError ? (
          <p className="rounded-xl border-2 border-rose-400 bg-rose-950/50 p-3 text-base text-rose-100">{createError}</p>
        ) : null}
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
            value={joinCode}
            onChange={(event) => setJoinCode(normalizeRoomCode(event.target.value))}
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
