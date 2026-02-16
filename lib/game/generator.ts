import { MovieRecord, TriviaQuestion } from './types';

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function uniqueValues(items: string[]): string[] {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function pickDistinct(items: string[], amount: number, avoid?: string): string[] {
  const filtered = uniqueValues(items).filter((item) => item !== avoid);
  return shuffle(filtered).slice(0, amount);
}

function buildOptions(correct: string, candidates: string[], context: string): string[] {
  const distractors = pickDistinct(candidates, 3, correct);
  const options = shuffle([correct, ...distractors]);

  if (new Set(options).size !== 4) {
    throw new Error(`No hay suficientes opciones únicas para ${context}.`);
  }

  return options;
}

function castFirst(movie: MovieRecord) {
  return movie.topCast.split(',')[0]?.trim() ?? movie.topCast;
}

function oscarLabel(movie: MovieRecord) {
  const nomination = movie.nominations[0];
  return `${nomination.ceremonyYear} · ${nomination.won ? 'Ganó' : 'Nominada'} · ${nomination.category}`;
}

function createDirectorQuestion(movie: MovieRecord, pool: MovieRecord[]): TriviaQuestion {
  const options = buildOptions(movie.director, pool.map((m) => m.director), `DIRECTOR · ${movie.title}`);
  return {
    id: crypto.randomUUID(),
    type: 'DIRECTOR',
    prompt: `¿Quién dirigió "${movie.title}"?`,
    options,
    correctIndex: options.indexOf(movie.director),
    explanation: `${movie.title} fue dirigida por ${movie.director}.`,
    movieTitle: movie.title
  };
}

function createCastQuestion(movie: MovieRecord, pool: MovieRecord[]): TriviaQuestion {
  const correct = castFirst(movie);
  const options = buildOptions(
    correct,
    pool.map((m) => castFirst(m)).filter(Boolean),
    `CAST · ${movie.title}`
  );
  return {
    id: crypto.randomUUID(),
    type: 'CAST',
    prompt: `¿Qué actor/actriz forma parte del reparto principal de "${movie.title}"?`,
    options,
    correctIndex: options.indexOf(correct),
    explanation: `${correct} aparece dentro del reparto principal acreditado.`,
    movieTitle: movie.title
  };
}

function createYearQuestion(movie: MovieRecord, pool: MovieRecord[]): TriviaQuestion {
  const correct = String(movie.releaseYear);
  const options = buildOptions(
    correct,
    pool.map((m) => String(m.releaseYear)),
    `YEAR · ${movie.title}`
  );
  return {
    id: crypto.randomUUID(),
    type: 'YEAR',
    prompt: `¿En qué año se estrenó "${movie.title}"?`,
    options,
    correctIndex: options.indexOf(correct),
    explanation: `${movie.title} se estrenó en ${movie.releaseYear}.`,
    movieTitle: movie.title
  };
}

function createOscarQuestion(movie: MovieRecord, pool: MovieRecord[]): TriviaQuestion {
  const correct = oscarLabel(movie);
  const options = buildOptions(correct, pool.map((m) => oscarLabel(m)), `OSCAR · ${movie.title}`);
  return {
    id: crypto.randomUUID(),
    type: 'OSCAR',
    prompt: `¿Cuál dato Oscar corresponde a "${movie.title}"?`,
    options,
    correctIndex: options.indexOf(correct),
    explanation: `Tuvo al menos una nominación Oscar en ${movie.nominations[0].ceremonyYear}.`,
    movieTitle: movie.title
  };
}

const NON_NOMINATED_US_FILMS = ['The Hangover', 'Hocus Pocus', 'The Warriors', 'Fast & Furious'];

function createIntruderQuestion(movie: MovieRecord, pool: MovieRecord[]): TriviaQuestion {
  const nominated = pickDistinct(
    pool
      .filter((m) => m !== movie)
      .map((m) => m.title),
    3
  );
  const intruder = NON_NOMINATED_US_FILMS[Math.floor(Math.random() * NON_NOMINATED_US_FILMS.length)];
  const options = buildOptions(intruder, nominated, `INTRUDER · ${movie.title}`);
  return {
    id: crypto.randomUUID(),
    type: 'INTRUDER',
    prompt: '¿Cuál opción es la intrusa según el set confiable de nominadas?',
    options,
    correctIndex: options.indexOf(intruder),
    explanation: `${intruder} no registra nominación al Oscar en el set curado.`,
    movieTitle: movie.title
  };
}

const ORDER: Array<TriviaQuestion['type']> = [
  'DIRECTOR',
  'CAST',
  'YEAR',
  'OSCAR',
  'DIRECTOR',
  'CAST',
  'YEAR',
  'OSCAR',
  'DIRECTOR',
  'INTRUDER'
];

export function generateSoloQuestions(movies: MovieRecord[]): TriviaQuestion[] {
  if (movies.length < 12) {
    throw new Error('Se requieren al menos 12 películas para generar 10 preguntas confiables.');
  }

  const selected = shuffle(movies).slice(0, 10);

  return ORDER.map((type, index) => {
    const movie = selected[index];
    switch (type) {
      case 'DIRECTOR':
        return createDirectorQuestion(movie, movies);
      case 'CAST':
        return createCastQuestion(movie, movies);
      case 'YEAR':
        return createYearQuestion(movie, movies);
      case 'OSCAR':
        return createOscarQuestion(movie, movies);
      case 'INTRUDER':
        return createIntruderQuestion(movie, movies);
      default:
        return createDirectorQuestion(movie, movies);
    }
  });
}
