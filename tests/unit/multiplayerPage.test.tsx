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

  it('muestra aviso y bloquea acciones en static export sin backend externo', async () => {
    process.env.NEXT_PUBLIC_STATIC_EXPORT = 'true';
    delete process.env.NEXT_PUBLIC_MULTIPLAYER_API_BASE_URL;
    const MultiplayerPage = await loadMultiplayerPage();

    render(<MultiplayerPage />);

    expect(
      screen.getByText(/debes configurar NEXT_PUBLIC_MULTIPLAYER_API_BASE_URL para conectar un backend externo/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Crear sala privada/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Buscar sala/i })).toBeDisabled();
  });

  it('habilita multiplayer en static export cuando hay backend externo configurado', async () => {
    process.env.NEXT_PUBLIC_STATIC_EXPORT = 'true';
    process.env.NEXT_PUBLIC_MULTIPLAYER_API_BASE_URL = 'https://api.example.com';
    const MultiplayerPage = await loadMultiplayerPage();

    render(<MultiplayerPage />);

    expect(
      screen.getByText(/Multiplayer activo: esta versión estática usa un backend externo configurado/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/debes configurar NEXT_PUBLIC_MULTIPLAYER_API_BASE_URL/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Crear sala privada/i })).not.toBeDisabled();
  });

  it('permite flujo normal cuando hay runtime server', async () => {
    process.env.NEXT_PUBLIC_STATIC_EXPORT = 'false';
    delete process.env.NEXT_PUBLIC_MULTIPLAYER_API_BASE_URL;
    const MultiplayerPage = await loadMultiplayerPage();

    render(<MultiplayerPage />);

    expect(screen.queryByText(/debes configurar NEXT_PUBLIC_MULTIPLAYER_API_BASE_URL/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Crear sala privada/i })).not.toBeDisabled();
  });
});
