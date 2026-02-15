import { computeScore, POINTS_PER_CORRECT } from '../../lib/game/scoring';

describe('computeScore', () => {
  it('calcula puntaje con regla de 100 por respuesta correcta', () => {
    expect(computeScore(0)).toBe(0);
    expect(computeScore(4)).toBe(4 * POINTS_PER_CORRECT);
    expect(computeScore(10)).toBe(1000);
  });
});
