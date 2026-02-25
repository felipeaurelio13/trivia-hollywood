import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const { pushMock, hasInProgressSoloSessionMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  hasInProgressSoloSessionMock: vi.fn(() => false)
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock
  })
}));

vi.mock('../../lib/game/sessionFactory', () => ({
  createSoloSession: vi.fn(() => ({ sessionId: 's1' }))
}));

vi.mock('../../lib/game/session', () => ({
  hasInProgressSoloSession: hasInProgressSoloSessionMock,
  saveSoloSession: vi.fn()
}));

import SoloStartPage from '../../app/solo/page';

describe('SoloStartPage', () => {
  it('muestra expectativas claras de duración y dinámica antes de iniciar', async () => {
    render(<SoloStartPage />);

    expect(await screen.findByLabelText(/resumen de dinámica/i)).toBeInTheDocument();
    expect(screen.getByText(/Duración estimada: 2 a 4 minutos/i)).toBeInTheDocument();
    expect(screen.getByText(/Selecciona una opción y luego confirma/i)).toBeInTheDocument();
    expect(screen.getByText(/Puntaje: \+100/i)).toBeInTheDocument();
  });
});
