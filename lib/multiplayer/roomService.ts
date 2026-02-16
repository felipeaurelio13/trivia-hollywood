import { prisma } from '@/lib/prisma';
import {
  createRoomCode,
  getPlayerDisplayNameError,
  getRoomCapacityError,
  isRoomCapacityValid,
  isRoomCodeFormatValid,
  normalizePlayerDisplayName,
  normalizeRoomCode,
  ROOM_MAX_PLAYERS,
  ROOM_MIN_PLAYERS
} from '@/lib/multiplayer/room';

interface CreateRoomInput {
  maxPlayers: number;
}


interface JoinRoomInput {
  roomCode: string;
  displayName: string;
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

export async function findRoomByCode(inputCode: string) {
  const normalizedCode = normalizeRoomCode(inputCode);

  if (!isRoomCodeFormatValid(normalizedCode)) {
    throw new Error('Ingresa un código de sala válido de 6 caracteres.');
  }

  const room = await prisma.room.findUnique({
    where: { code: normalizedCode },
    select: {
      code: true,
      status: true,
      maxPlayers: true,
      createdAt: true,
      _count: {
        select: {
          players: true
        }
      }
    }
  });

  if (!room) {
    throw new Error('No encontramos una sala con ese código. Revisa e intenta de nuevo.');
  }

  const currentPlayers = room._count.players;

  return {
    code: room.code,
    status: room.status,
    maxPlayers: room.maxPlayers,
    currentPlayers,
    seatsLeft: Math.max(room.maxPlayers - currentPlayers, 0),
    createdAt: room.createdAt
  };
}


export async function joinRoom({ roomCode, displayName }: JoinRoomInput) {
  const normalizedCode = normalizeRoomCode(roomCode);

  if (!isRoomCodeFormatValid(normalizedCode)) {
    throw new Error('Ingresa un código de sala válido de 6 caracteres.');
  }

  const normalizedDisplayName = normalizePlayerDisplayName(displayName);
  const displayNameError = getPlayerDisplayNameError(normalizedDisplayName);

  if (displayNameError) {
    throw new Error(displayNameError);
  }

  const room = await prisma.room.findUnique({
    where: { code: normalizedCode },
    select: {
      id: true,
      code: true,
      status: true,
      maxPlayers: true,
      _count: {
        select: { players: true }
      }
    }
  });

  if (!room) {
    throw new Error('No encontramos una sala con ese código. Revisa e intenta de nuevo.');
  }

  if (room.status !== 'waiting') {
    throw new Error('Esta sala ya no está disponible para nuevos jugadores.');
  }

  const currentPlayers = room._count.players;

  if (currentPlayers >= room.maxPlayers) {
    throw new Error('La sala está completa. Pide otro código o crea una nueva sala.');
  }

  try {
    const player = await prisma.roomPlayer.create({
      data: {
        roomId: room.id,
        displayName: normalizedDisplayName
      },
      select: {
        id: true,
        displayName: true,
        joinedAt: true
      }
    });

    return {
      room: {
        code: room.code,
        status: room.status,
        maxPlayers: room.maxPlayers
      },
      player
    };
  } catch (error) {
    const duplicateNameError =
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P2002';

    if (duplicateNameError) {
      throw new Error('Ese nombre ya está en uso en esta sala. Elige otro para continuar.');
    }

    throw error;
  }
}
