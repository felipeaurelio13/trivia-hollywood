import { afterEach, describe, expect, it, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

async function loadMultiplayerApi() {
  vi.resetModules();
  return import('../../lib/multiplayer/api');
}

describe('multiplayer api helper', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it('usa rutas relativas cuando no hay backend externo', async () => {
    delete process.env.NEXT_PUBLIC_MULTIPLAYER_API_BASE_URL;
    const api = await loadMultiplayerApi();

    expect(api.hasExternalMultiplayerApi).toBe(false);
    expect(api.buildMultiplayerApiUrl('/api/multiplayer/rooms')).toBe('/api/multiplayer/rooms');
    expect(api.buildMultiplayerApiUrl('api/multiplayer/rooms')).toBe('/api/multiplayer/rooms');
  });

  it('compone URL absoluta cuando hay backend externo', async () => {
    process.env.NEXT_PUBLIC_MULTIPLAYER_API_BASE_URL = 'https://backend.example.com/';
    const api = await loadMultiplayerApi();

    expect(api.hasExternalMultiplayerApi).toBe(true);
    expect(api.multiplayerApiBaseUrl).toBe('https://backend.example.com');
    expect(api.buildMultiplayerApiUrl('/api/multiplayer/rooms')).toBe(
      'https://backend.example.com/api/multiplayer/rooms'
    );
  });
});
