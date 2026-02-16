import { generateSoloQuestions } from '../../lib/game/generator';
import type { MovieRecord } from '../../lib/game/types';

const movies: MovieRecord[] = Array.from({ length: 12 }).map((_, idx) => ({
  id: `m${idx + 1}`,
  title: `Movie ${idx + 1}`,
  releaseYear: 1990 + idx,
  decade: '1990s',
  director: `Director ${idx + 1}`,
  topCast: `Actor ${idx + 1}, Actor B${idx + 1}`,
  nominations: [{ ceremonyYear: 2000 + idx, category: 'Best Picture', won: idx % 2 === 0 }]
}));

describe('generateSoloQuestions', () => {
  it('retorna exactamente 10 preguntas con 4 opciones', () => {
    const questions = generateSoloQuestions(movies);

    expect(questions).toHaveLength(10);
    questions.forEach((question) => {
      expect(question.options).toHaveLength(4);
      expect(question.correctIndex).toBeGreaterThanOrEqual(0);
      expect(question.correctIndex).toBeLessThan(4);
    });
  });

  it('garantiza 4 opciones únicas por pregunta', () => {
    const questions = generateSoloQuestions(movies);

    questions.forEach((question) => {
      expect(new Set(question.options).size).toBe(4);
    });
  });

  it('falla si no hay distractores únicos suficientes', () => {
    const duplicatedDirectors = movies.map((movie) => ({ ...movie, director: 'Same Director' }));

    expect(() => generateSoloQuestions(duplicatedDirectors)).toThrow(
      'No hay suficientes opciones únicas para DIRECTOR'
    );
  });
});
