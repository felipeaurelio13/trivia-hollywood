import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  replaceMock,
  pushMock,
  saveSoloSessionMock,
  clearSoloSessionMock,
  trackEventMock,
  loadSoloSessionMock
} = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  pushMock: vi.fn(),
  saveSoloSessionMock: vi.fn(),
  clearSoloSessionMock: vi.fn(),
  trackEventMock: vi.fn(),
  loadSoloSessionMock: vi.fn(() => ({
    sessionId: 'session-1',
    startedAt: 1743273000000,
    currentQuestionIndex: 0,
    answers: [],
    questions: [
      {
        id: 'q1',
        type: 'YEAR',
        prompt: '¿En qué año se estrenó Titanic?',
        options: ['1995', '1996', '1997', '1998'],
        correctIndex: 2,
        explanation: 'Titanic se estrenó en 1997.',
        movieTitle: 'Titanic'
      },
      {
        id: 'q2',
        type: 'YEAR',
        prompt: '¿En qué año se estrenó Avatar?',
        options: ['2007', '2008', '2009', '2010'],
        correctIndex: 2,
        explanation: 'Avatar se estrenó en 2009.',
        movieTitle: 'Avatar'
      }
    ]
  }))
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
    push: pushMock
  })
}));

vi.mock('../../lib/game/session', () => ({
  clearSoloSession: clearSoloSessionMock,
  loadSoloSession: loadSoloSessionMock,
  saveSoloSession: saveSoloSessionMock
}));

vi.mock('../../lib/game/scoring', () => ({
  computeScore: vi.fn(() => 100)
}));

vi.mock('../../lib/analytics/events', () => ({
  trackEvent: trackEventMock
}));

import SoloPlayPage from '../../app/solo/play/page';

describe('SoloPlayPage', () => {
  beforeEach(() => {
    replaceMock.mockReset();
    pushMock.mockReset();
    saveSoloSessionMock.mockReset();
    clearSoloSessionMock.mockReset();
    trackEventMock.mockReset();
    localStorage.clear();
  });

  it('muestra progreso y feedback con estado correcto/incorrecto tras responder', () => {
    render(<SoloPlayPage />);

    const progressBar = screen.getByRole('progressbar', { name: /progreso de preguntas respondidas/i });
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(screen.getByText(/Aciertos actuales:/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Opción 3: 1997/i }));

    expect(screen.getByText(/¡Respuesta correcta!/i)).toBeInTheDocument();
    expect(screen.getByText(/Titanic se estrenó en 1997/i)).toBeInTheDocument();
    expect(trackEventMock).toHaveBeenCalledWith(
      'answer_submitted',
      expect.objectContaining({
        questionId: 'q1',
        correct: true,
        questionType: 'YEAR'
      })
    );
  });
});
