import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

async function loadMultiplayerPage() {
  vi.resetModules();
  return (await import('../../app/multiplayer/page')).default;
}

describe('MultiplayerPage', () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    cleanup();
  });

  it('muestra aviso y bloquea acciones cuando corre en static export', async () => {
    process.env.NEXT_PUBLIC_STATIC_EXPORT = 'true';
    const MultiplayerPage = await loadMultiplayerPage();

    render(<MultiplayerPage />);

    expect(
      screen.getByText(/GitHub Pages \(export estático\) este flujo no está disponible/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Crear sala privada/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Buscar sala/i })).toBeDisabled();
  });

  it('permite flujo normal cuando hay runtime server', async () => {
    process.env.NEXT_PUBLIC_STATIC_EXPORT = 'false';
    const MultiplayerPage = await loadMultiplayerPage();

    render(<MultiplayerPage />);

    expect(
      screen.queryByText(/GitHub Pages \(export estático\) este flujo no está disponible/i)
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Crear sala privada/i })).not.toBeDisabled();
  });
});
