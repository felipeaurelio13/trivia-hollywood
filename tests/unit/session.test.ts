import {
  SOLO_SESSION_KEY,
  hasInProgressSoloSession,
  loadSoloSession,
  saveSoloSession,
  type SoloSession
} from '../../lib/game/session';

function buildSession(overrides: Partial<SoloSession> = {}): SoloSession {
  return {
    sessionId: 'session-id',
    startedAt: 1743273000000,
    questions: [
      {
        id: 'q-1',
        type: 'YEAR',
        prompt: '¿En qué año se estrenó Titanic?',
        options: ['1995', '1996', '1997', '1998'],
        correctIndex: 2,
        explanation: 'Titanic se estrenó en 1997.',
        movieTitle: 'Titanic'
      }
    ],
    currentQuestionIndex: 0,
    answers: [],
    ...overrides
  };
}

describe('solo session storage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('normaliza sesiones antiguas sin progreso guardado', () => {
    const legacySession = {
      sessionId: 'legacy',
      startedAt: 1743273000000,
      questions: [buildSession().questions[0]]
    };

    localStorage.setItem(SOLO_SESSION_KEY, JSON.stringify(legacySession));

    expect(loadSoloSession()).toEqual({
      ...legacySession,
      currentQuestionIndex: 0,
      answers: []
    });
  });

  it('detecta cuando existe una partida en progreso', () => {
    saveSoloSession(buildSession());

    expect(hasInProgressSoloSession()).toBe(true);
  });

  it('detecta cuando la partida ya está completa', () => {
    saveSoloSession(buildSession({ answers: [2] }));

    expect(hasInProgressSoloSession()).toBe(false);
  });
});
