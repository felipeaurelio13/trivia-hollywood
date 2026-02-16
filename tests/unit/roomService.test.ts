import { findRoomByCode, getRoomLobbyByCode, joinRoom } from '@/lib/multiplayer/roomService';

const { findUniqueMock, createPlayerMock } = vi.hoisted(() => ({
  findUniqueMock: vi.fn(),
  createPlayerMock: vi.fn()
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    room: {
      findUnique: findUniqueMock
    },
    roomPlayer: {
      create: createPlayerMock
    }
  }
}));

describe('roomService.findRoomByCode', () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
    createPlayerMock.mockReset();
  });

  it('normaliza el código y devuelve resumen de cupos', async () => {
    findUniqueMock.mockResolvedValue({
      code: 'ABC234',
      status: 'waiting',
      maxPlayers: 4,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      _count: { players: 3 }
    });

    const room = await findRoomByCode('  abc234 ');

    expect(findUniqueMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { code: 'ABC234' }
      })
    );
    expect(room).toMatchObject({
      code: 'ABC234',
      status: 'waiting',
      maxPlayers: 4,
      currentPlayers: 3,
      seatsLeft: 1
    });
  });

  it('falla cuando el formato del código no es válido', async () => {
    await expect(findRoomByCode('A1')).rejects.toThrow(/código de sala válido/);
    expect(findUniqueMock).not.toHaveBeenCalled();
  });

  it('falla cuando la sala no existe', async () => {
    findUniqueMock.mockResolvedValue(null);

    await expect(findRoomByCode('ABC234')).rejects.toThrow(/No encontramos una sala/);
  });
});


describe('roomService.getRoomLobbyByCode', () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
    createPlayerMock.mockReset();
  });

  it('devuelve jugadores ordenados para el lobby', async () => {
    findUniqueMock
      .mockResolvedValueOnce({
        code: 'ABC234',
        status: 'waiting',
        maxPlayers: 4,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        _count: { players: 2 }
      })
      .mockResolvedValueOnce({
        players: [
          { id: 'p1', displayName: 'Sofía', joinedAt: new Date('2026-01-01T00:00:00.000Z') },
          { id: 'p2', displayName: 'Mario', joinedAt: new Date('2026-01-01T00:01:00.000Z') }
        ]
      });

    const room = await getRoomLobbyByCode('abc234');

    expect(findUniqueMock).toHaveBeenNthCalledWith(2,
      expect.objectContaining({
        where: { code: 'ABC234' },
        select: expect.objectContaining({
          players: expect.any(Object)
        })
      })
    );
    expect(room.players).toHaveLength(2);
    expect(room.players[0]?.displayName).toBe('Sofía');
  });
});

describe('roomService.joinRoom', () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
    createPlayerMock.mockReset();
  });

  it('permite unirse a sala waiting con nombre válido', async () => {
    findUniqueMock.mockResolvedValue({
      id: 'room-1',
      code: 'ABC234',
      status: 'waiting',
      maxPlayers: 4,
      _count: { players: 2 }
    });
    createPlayerMock.mockResolvedValue({
      id: 'player-1',
      displayName: 'Sofía',
      joinedAt: new Date('2026-01-01T00:00:00.000Z')
    });

    const joined = await joinRoom({ roomCode: 'abc234', displayName: '  Sofía ' });

    expect(findUniqueMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { code: 'ABC234' }
      })
    );
    expect(createPlayerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          roomId: 'room-1',
          displayName: 'Sofía'
        }
      })
    );
    expect(joined.room.code).toBe('ABC234');
    expect(joined.player.displayName).toBe('Sofía');
  });

  it('falla cuando la sala está completa', async () => {
    findUniqueMock.mockResolvedValue({
      id: 'room-1',
      code: 'ABC234',
      status: 'waiting',
      maxPlayers: 2,
      _count: { players: 2 }
    });

    await expect(joinRoom({ roomCode: 'ABC234', displayName: 'Mario' })).rejects.toThrow(/completa/);
    expect(createPlayerMock).not.toHaveBeenCalled();
  });

  it('falla cuando el nombre ya existe en la sala', async () => {
    findUniqueMock.mockResolvedValue({
      id: 'room-1',
      code: 'ABC234',
      status: 'waiting',
      maxPlayers: 4,
      _count: { players: 3 }
    });
    createPlayerMock.mockRejectedValue({ code: 'P2002' });

    await expect(joinRoom({ roomCode: 'ABC234', displayName: 'Mario' })).rejects.toThrow(/ya está en uso/);
  });
});
