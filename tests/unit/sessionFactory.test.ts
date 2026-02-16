import { createSoloSession } from '../../lib/game/sessionFactory';

describe('createSoloSession', () => {
  it('crea una sesión local lista para jugar sin API runtime', () => {
    const session = createSoloSession();

    expect(session.sessionId).toBeTruthy();
    expect(typeof session.startedAt).toBe('number');
    expect(session.questions).toHaveLength(10);
    expect(session.currentQuestionIndex).toBe(0);
    expect(session.answers).toEqual([]);

    session.questions.forEach((question) => {
      expect(question.options).toHaveLength(4);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(4);
    });
  });
});
