import { NextResponse } from 'next/server';
import moviesSeed from '@/data/movies.sample.json';
import { movieSeedListSchema } from '@/lib/data/schema';
import { generateSoloQuestions } from '@/lib/game/generator';
import type { MovieRecord } from '@/lib/game/types';

export async function GET() {
  const validated = movieSeedListSchema.parse(moviesSeed);
  const movies: MovieRecord[] = validated.map((movie, index) => ({
    id: String(index + 1),
    title: movie.title,
    releaseYear: movie.releaseYear,
    decade: `${Math.floor(movie.releaseYear / 10) * 10}s`,
    director: movie.director,
    topCast: movie.topCast.join(', '),
    nominations: movie.nominations
  }));

  const questions = generateSoloQuestions(movies);

  return NextResponse.json({
    sessionId: crypto.randomUUID(),
    startedAt: Date.now(),
    questions
  });
}
