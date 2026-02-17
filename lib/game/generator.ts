import { MovieRecord, TriviaQuestion } from './types';

function randomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) return 0;

  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return values[0] % maxExclusive;
  }

  return Math.floor(Math.random() * maxExclusive);
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
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
    explanation: `También figura con nominación al Oscar en ${movie.nominations[0].ceremonyYear}.`,
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
    explanation: `${movie.title} compitió por Mejor Película en ${movie.nominations[0].ceremonyYear}.`,
    movieTitle: movie.title
  };
}

function createYearQuestion(movie: MovieRecord, pool: MovieRecord[]): TriviaQuestion {
  const correct = String(movie.releaseYear);
  const allYears = uniqueValues(pool.map((m) => String(m.releaseYear))).filter((year) => year !== correct);
  const nearbyYears = allYears
    .map((year) => ({
      year,
      distance: Math.abs(Number(year) - movie.releaseYear)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 8)
    .map((item) => item.year);
  const options = buildOptions(
    correct,
    nearbyYears.length >= 3 ? nearbyYears : allYears,
    `YEAR · ${movie.title}`
  );
  return {
    id: crypto.randomUUID(),
    type: 'YEAR',
    prompt: `¿En qué año se estrenó "${movie.title}"?`,
    options,
    correctIndex: options.indexOf(correct),
    explanation: `Se estrenó en la etapa ${movie.decade} del cine de Hollywood con nominación al Oscar.`,
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

const NON_NOMINATED_US_FILMS = [
  'The Hangover',
  'Hocus Pocus',
  'The Warriors',
  'Fast & Furious',
  'Zodiac',
  'The Breakfast Club',
  'The Goonies',
  'Groundhog Day',
  'School of Rock',
  'The Truman Show',
  'Fight Club',
  'The Big Lebowski',
  'Mean Girls',
  'The Iron Giant',
  'The Princess Bride',
  'Nightcrawler',
  'Superbad',
  'Taken',
  'The Conjuring',
  'Madagascar'
];

function createIntruderQuestion(movie: MovieRecord, pool: MovieRecord[]): TriviaQuestion {
  const nominated = pickDistinct(
    pool
      .filter((m) => m !== movie)
      .map((m) => m.title),
    3
  );
  const intruder = NON_NOMINATED_US_FILMS[randomInt(NON_NOMINATED_US_FILMS.length)];
  const options = buildOptions(intruder, nominated, `INTRUDER · ${movie.title}`);
  return {
    id: crypto.randomUUID(),
    type: 'INTRUDER',
    prompt: '¿Cuál de estas películas NO tiene nominaciones al Oscar?',
    options,
    correctIndex: options.indexOf(intruder),
    explanation: `${intruder} no recibió nominaciones al Oscar; las demás sí fueron nominadas.`,
    movieTitle: movie.title
  };
}

function buildQuestionPlan(): Array<TriviaQuestion['type']> {
  const required: Array<TriviaQuestion['type']> = ['DIRECTOR', 'CAST', 'YEAR', 'OSCAR', 'INTRUDER'];
  const weightedPool: Array<TriviaQuestion['type']> = [
    'DIRECTOR',
    'DIRECTOR',
    'CAST',
    'CAST',
    'YEAR',
    'YEAR',
    'OSCAR',
    'OSCAR',
    'INTRUDER'
  ];

  const additional = Array.from({ length: 5 }).map(() => weightedPool[randomInt(weightedPool.length)]);
  return shuffle([...required, ...additional]);
}

export function generateSoloQuestions(movies: MovieRecord[]): TriviaQuestion[] {
  if (movies.length < 12) {
    throw new Error('Se requieren al menos 12 películas para generar 10 preguntas confiables.');
  }

  const selected = shuffle(movies).slice(0, 10);
  const questionPlan = buildQuestionPlan();

  return questionPlan.map((type, index) => {
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
