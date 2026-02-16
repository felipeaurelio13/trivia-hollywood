import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SettingsPage from '../../app/settings/page';

describe('SettingsPage', () => {
  it('muestra diagnóstico de despliegue para GitHub Pages con URL esperada', () => {
    render(<SettingsPage />);

    expect(screen.getByRole('heading', { name: /Diagnóstico rápido de despliegue/i })).toBeInTheDocument();
    expect(screen.getByText(/si al abrir la web ves el README/i)).toBeInTheDocument();
    expect(screen.getByText(/https:\/\/<usuario>\.github\.io\/trivia-hollywood\//i)).toBeInTheDocument();
    expect(screen.getByText(/Settings → Pages/i)).toBeInTheDocument();
    expect(screen.getAllByText(/GitHub Actions/i).length).toBeGreaterThan(0);
  });
});
