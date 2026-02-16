'use client';

import { useState } from 'react';
import {
  ROOM_MAX_PLAYERS,
  ROOM_MIN_PLAYERS,
  ROOM_CODE_LENGTH,
  ROOM_PLAYER_NAME_MAX_LENGTH,
  ROOM_PLAYER_NAME_MIN_LENGTH,
  isRoomCodeFormatValid,
  normalizePlayerDisplayName,
  normalizeRoomCode
} from '@/lib/multiplayer/room';

interface CreatedRoom {
  code: string;
  maxPlayers: number;
}

interface JoinedRoomPreview {
  code: string;
  status: 'waiting' | 'started' | 'finished';
  maxPlayers: number;
  currentPlayers: number;
  seatsLeft: number;
}

interface JoinedRoomResult {
  room: {
    code: string;
    status: 'waiting' | 'started' | 'finished';
    maxPlayers: number;
  };
  player: {
    id: string;
    displayName: string;
    joinedAt: string;
  };
}

const ROOM_STATUS_LABEL: Record<JoinedRoomPreview['status'], string> = {
  waiting: 'Esperando jugadores',
  started: 'Partida en curso',
  finished: 'Partida finalizada'
};

export default function MultiplayerPage() {
  const [capacity, setCapacity] = useState(ROOM_MIN_PLAYERS);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<CreatedRoom | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const [joinCode, setJoinCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [joinedRoom, setJoinedRoom] = useState<JoinedRoomPreview | null>(null);
  const [joinSuccess, setJoinSuccess] = useState<JoinedRoomResult | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

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

  const onSearchRoom = async () => {
    setIsJoiningRoom(true);
    setJoinError(null);
    setJoinedRoom(null);
    setJoinSuccess(null);

    try {
      const response = await fetch(`/api/multiplayer/rooms/${joinCode}`);
      const payload = (await response.json()) as { room?: JoinedRoomPreview; error?: string };

      if (!response.ok || !payload.room) {
        throw new Error(payload.error ?? 'No se pudo encontrar la sala.');
      }

      setJoinedRoom(payload.room);
    } catch (error) {
      setJoinError(error instanceof Error ? error.message : 'No se pudo encontrar la sala.');
    } finally {
      setIsJoiningRoom(false);
    }
  };

  const onJoinRoom = async () => {
    setIsJoiningRoom(true);
    setJoinError(null);
    setJoinSuccess(null);

    try {
      const response = await fetch(`/api/multiplayer/rooms/${joinCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ displayName })
      });
      const payload = (await response.json()) as { joined?: JoinedRoomResult; error?: string };

      if (!response.ok || !payload.joined) {
        throw new Error(payload.error ?? 'No se pudo unir a la sala.');
      }

      setJoinSuccess(payload.joined);
      setDisplayName('');
    } catch (error) {
      setJoinSuccess(null);
      setJoinError(error instanceof Error ? error.message : 'No se pudo unir a la sala.');
    } finally {
      setIsJoiningRoom(false);
    }
  };

  const canSearchRoom = isRoomCodeFormatValid(joinCode);
  const normalizedDisplayName = normalizePlayerDisplayName(displayName);
  const canJoinRoom = Boolean(joinedRoom) &&
    normalizedDisplayName.length >= ROOM_PLAYER_NAME_MIN_LENGTH &&
    normalizedDisplayName.length <= ROOM_PLAYER_NAME_MAX_LENGTH;

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
        <p className="text-lg text-slate-100">Busca una sala y entra con tu nombre de jugador.</p>

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
          onClick={onSearchRoom}
          disabled={!canSearchRoom || isJoiningRoom}
          className="h-16 w-full rounded-2xl border-2 border-cyan-300 bg-cyan-200 text-lg font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:border-slate-500 disabled:bg-slate-700 disabled:text-slate-200"
        >
          {isJoiningRoom ? 'Buscando sala...' : 'Buscar sala'}
        </button>

        {joinedRoom ? (
          <div className="space-y-4 rounded-2xl border-2 border-cyan-300 bg-cyan-950/40 p-4">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.16em] text-cyan-200">Sala encontrada</p>
              <p className="text-2xl font-bold tracking-[0.18em] text-cyan-100">{joinedRoom.code}</p>
              <p className="text-base text-cyan-100">Estado: {ROOM_STATUS_LABEL[joinedRoom.status]}</p>
              <p className="text-base text-cyan-100">
                Jugadores: {joinedRoom.currentPlayers}/{joinedRoom.maxPlayers} · Cupos libres: {joinedRoom.seatsLeft}
              </p>
            </div>

            <label className="block space-y-2 text-base" htmlFor="display-name">
              <span className="font-semibold text-cyan-100">Tu nombre para el lobby</span>
              <input
                id="display-name"
                type="text"
                maxLength={ROOM_PLAYER_NAME_MAX_LENGTH}
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Ej: Sofía"
                className="h-14 w-full rounded-xl border-2 border-cyan-300 bg-slate-950 px-4 text-lg text-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300"
              />
              <p className="text-sm text-cyan-200">
                Entre {ROOM_PLAYER_NAME_MIN_LENGTH} y {ROOM_PLAYER_NAME_MAX_LENGTH} caracteres.
              </p>
            </label>

            <button
              type="button"
              onClick={onJoinRoom}
              disabled={!canJoinRoom || isJoiningRoom}
              className="h-16 w-full rounded-2xl border-2 border-emerald-300 bg-emerald-200 text-lg font-semibold text-emerald-950 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:border-slate-500 disabled:bg-slate-700 disabled:text-slate-200"
            >
              {isJoiningRoom ? 'Uniéndote...' : 'Entrar al lobby'}
            </button>
          </div>
        ) : null}

        {joinSuccess ? (
          <div className="rounded-xl border-2 border-emerald-300 bg-emerald-950/50 p-4 text-emerald-100">
            <p className="text-sm uppercase tracking-[0.16em] text-emerald-200">Te uniste correctamente</p>
            <p className="mt-1 text-lg font-semibold">{joinSuccess.player.displayName}</p>
            <p className="text-base">Ya estás en la sala {joinSuccess.room.code}. Espera en el lobby para comenzar.</p>
          </div>
        ) : null}

        {joinError ? (
          <p className="rounded-xl border-2 border-rose-400 bg-rose-950/50 p-3 text-base text-rose-100">{joinError}</p>
        ) : null}
      </div>
    </section>
  );
}
