import { findRoomByCode } from '@/lib/multiplayer/roomService';

const { findUniqueMock } = vi.hoisted(() => ({
  findUniqueMock: vi.fn()
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    room: {
      findUnique: findUniqueMock
    }
  }
}));

describe('roomService.findRoomByCode', () => {
  beforeEach(() => {
    findUniqueMock.mockReset();
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
