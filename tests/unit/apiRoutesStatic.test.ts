import { dynamic as roomCollectionDynamic } from '@/app/api/multiplayer/rooms/route';
import { dynamic as roomByCodeDynamic } from '@/app/api/multiplayer/rooms/[code]/route';

describe('api multiplayer routes static config', () => {
  it('marca la creación de salas como force-static para export', () => {
    expect(roomCollectionDynamic).toBe('force-static');
  });

  it('marca la ruta por código como force-static para export', () => {
    expect(roomByCodeDynamic).toBe('force-static');
  });
});
