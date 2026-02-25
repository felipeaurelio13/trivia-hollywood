import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HomePage from '../../app/page';

describe('HomePage', () => {
  it('muestra resumen rápido de reglas clave para reducir fricción', () => {
    render(<HomePage />);

    expect(screen.getByRole('list', { name: /resumen rápido del juego/i })).toBeInTheDocument();
    expect(screen.getByText(/10 preguntas/i)).toBeInTheDocument();
    expect(screen.getByText(/4 opciones/i)).toBeInTheDocument();
    expect(screen.getByText(/\+100 acierto/i)).toBeInTheDocument();
    expect(screen.getByText(/sin vidas/i)).toBeInTheDocument();
  });
});
