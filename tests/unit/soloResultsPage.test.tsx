import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SoloResultsPage from '../../app/solo/results/page';

describe('SoloResultsPage', () => {
  beforeEach(() => {
    localStorage.clear();
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  });

  it('muestra feedback de desempeño y permite copiar resumen', async () => {
    localStorage.setItem(
      'trivia_hollywood_last_result',
      JSON.stringify({ score: 800, correctAnswers: 8, elapsedMs: 45000 })
    );

    render(<SoloResultsPage />);

    expect(screen.getByText(/Racha de experto en Hollywood/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /copiar resumen/i }));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'Trivia Hollywood: 8/10, 800 puntos en 45 s.'
    );
    expect(await screen.findByText(/Resumen copiado/i)).toBeInTheDocument();
  });
});
