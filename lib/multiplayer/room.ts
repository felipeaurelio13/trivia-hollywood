const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const ROOM_CODE_LENGTH = 6;
export const ROOM_MIN_PLAYERS = 2;
export const ROOM_MAX_PLAYERS = 8;

export function createRoomCode(randomFn: () => number = Math.random) {
  return Array.from({ length: ROOM_CODE_LENGTH }, () => {
    const index = Math.floor(randomFn() * ROOM_CODE_ALPHABET.length);
    return ROOM_CODE_ALPHABET[index] ?? ROOM_CODE_ALPHABET[0];
  }).join('');
}

export function createUniqueRoomCode(
  existingCodes: Iterable<string>,
  randomFn: () => number = Math.random,
  maxAttempts = 50
) {
  const normalizedCodes = new Set(Array.from(existingCodes, (code) => normalizeRoomCode(code)));

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = createRoomCode(randomFn);

    if (!normalizedCodes.has(candidate)) {
      return candidate;
    }
  }

  throw new Error('No se pudo generar un código de sala único. Intenta nuevamente.');
}

export function normalizeRoomCode(value: string) {
  return value.trim().toUpperCase();
}

export function isRoomCapacityValid(maxPlayers: number) {
  return Number.isInteger(maxPlayers) && maxPlayers >= ROOM_MIN_PLAYERS && maxPlayers <= ROOM_MAX_PLAYERS;
}

export function getRoomCapacityError(maxPlayers: number) {
  if (Number.isNaN(maxPlayers)) {
    return 'La capacidad debe ser un número entero.';
  }

  if (!Number.isInteger(maxPlayers)) {
    return 'La capacidad debe ser un número entero.';
  }

  if (maxPlayers < ROOM_MIN_PLAYERS || maxPlayers > ROOM_MAX_PLAYERS) {
    return `La sala debe permitir entre ${ROOM_MIN_PLAYERS} y ${ROOM_MAX_PLAYERS} jugadores.`;
  }

  return null;
}
