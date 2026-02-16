import {
  ROOM_CODE_LENGTH,
  ROOM_MAX_PLAYERS,
  ROOM_MIN_PLAYERS,
  createRoomCode,
  getRoomCapacityError,
  isRoomCapacityValid,
  normalizeRoomCode
} from '../../lib/multiplayer/room';

describe('multiplayer room helpers', () => {
  it('genera códigos cortos en mayúsculas para compartir sala', () => {
    const code = createRoomCode(() => 0);

    expect(code).toHaveLength(ROOM_CODE_LENGTH);
    expect(code).toBe(code.toUpperCase());
    expect(code).toMatch(/^[A-Z2-9]+$/);
  });

  it('normaliza el código al pegar texto con espacios', () => {
    expect(normalizeRoomCode('  abC123  ')).toBe('ABC123');
  });

  it('valida capacidad de sala entre 2 y 8 jugadores', () => {
    expect(isRoomCapacityValid(ROOM_MIN_PLAYERS)).toBe(true);
    expect(isRoomCapacityValid(ROOM_MAX_PLAYERS)).toBe(true);
    expect(isRoomCapacityValid(ROOM_MIN_PLAYERS - 1)).toBe(false);
    expect(isRoomCapacityValid(ROOM_MAX_PLAYERS + 1)).toBe(false);
    expect(isRoomCapacityValid(2.5)).toBe(false);
  });

  it('retorna un mensaje útil cuando la capacidad no es válida', () => {
    expect(getRoomCapacityError(Number.NaN)).toMatch(/número entero/);
    expect(getRoomCapacityError(1)).toMatch(/entre/);
    expect(getRoomCapacityError(4)).toBeNull();
  });
});
