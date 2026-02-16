import { afterEach, describe, expect, it, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

async function loadNextConfig() {
  vi.resetModules();
  return (await import('../../next.config')).default;
}

describe('next.config', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it('mantiene build SSR por defecto para soportar API routes', async () => {
    delete process.env.GITHUB_PAGES;
    delete process.env.STATIC_EXPORT;
    delete process.env.GITHUB_WORKFLOW;
    process.env.GITHUB_REPOSITORY = 'acme/trivia-hollywood';

    const config = await loadNextConfig();

    expect(config.output).toBeUndefined();
    expect(config.basePath).toBe('');
    expect(config.assetPrefix).toBeUndefined();
    expect(config.env?.NEXT_PUBLIC_STATIC_EXPORT).toBe('false');
  });

  it('activa export estático cuando detecta despliegue en GitHub Pages', async () => {
    process.env.GITHUB_PAGES = 'true';
    process.env.GITHUB_REPOSITORY = 'acme/trivia-hollywood';

    const config = await loadNextConfig();

    expect(config.output).toBe('export');
    expect(config.basePath).toBe('/trivia-hollywood');
    expect(config.assetPrefix).toBe('/trivia-hollywood');
    expect(config.env?.NEXT_PUBLIC_STATIC_EXPORT).toBe('true');
  });
});
