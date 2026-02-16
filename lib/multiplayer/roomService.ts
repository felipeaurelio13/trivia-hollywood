import { prisma } from '@/lib/prisma';
import {
  createRoomCode,
  getRoomCapacityError,
  isRoomCapacityValid,
  ROOM_MAX_PLAYERS,
  ROOM_MIN_PLAYERS
} from '@/lib/multiplayer/room';

interface CreateRoomInput {
  maxPlayers: number;
}

export async function createRoom({ maxPlayers }: CreateRoomInput) {
  if (!isRoomCapacityValid(maxPlayers)) {
    const message = getRoomCapacityError(maxPlayers) ?? 'Capacidad inválida para la sala.';
    throw new Error(message);
  }

  const MAX_RETRIES = 5;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    try {
      return await prisma.room.create({
        data: {
          code: createRoomCode(),
          maxPlayers,
          status: 'waiting'
        },
        select: {
          id: true,
          code: true,
          maxPlayers: true,
          status: true,
          createdAt: true
        }
      });
    } catch (error) {
      const isUniqueCodeError =
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as { code?: string }).code === 'string' &&
        (error as { code: string }).code === 'P2002';

      if (!isUniqueCodeError) {
        throw error;
      }
    }
  }

  throw new Error(
    `No se pudo crear la sala. Intenta de nuevo con una capacidad entre ${ROOM_MIN_PLAYERS} y ${ROOM_MAX_PLAYERS} jugadores.`
  );
}
