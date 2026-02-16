import moviesSeed from '../../data/movies.sample.json';
import { movieSeedListSchema } from '../data/schema';
import { generateSoloQuestions } from './generator';
import type { MovieRecord } from './types';
import type { SoloSession } from './session';

function buildMovieRecords(): MovieRecord[] {
  const validated = movieSeedListSchema.parse(moviesSeed);

  return validated.map((movie, index) => ({
    id: String(index + 1),
    title: movie.title,
    releaseYear: movie.releaseYear,
    decade: `${Math.floor(movie.releaseYear / 10) * 10}s`,
    director: movie.director,
    topCast: movie.topCast.join(', '),
    nominations: movie.nominations
  }));
}

export function createSoloSession(): SoloSession {
  const movies = buildMovieRecords();
  const questions = generateSoloQuestions(movies);

  return {
    sessionId: crypto.randomUUID(),
    startedAt: Date.now(),
    questions,
    currentQuestionIndex: 0,
    answers: []
  };
}
