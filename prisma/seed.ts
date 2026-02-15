import { PrismaClient } from '@prisma/client';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { movieSeedListSchema } from '../lib/data/schema';

const prisma = new PrismaClient();

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  const raw = await readFile(resolve(process.cwd(), 'data/movies.sample.json'), 'utf-8');
  const parsed = movieSeedListSchema.parse(JSON.parse(raw));

  await prisma.oscarNomination.deleteMany();
  await prisma.movie.deleteMany();

  for (const movie of parsed) {
    const created = await prisma.movie.create({
      data: {
        slug: slugify(movie.title),
        title: movie.title,
        releaseYear: movie.releaseYear,
        decade: `${Math.floor(movie.releaseYear / 10) * 10}s`,
        productionCountry: movie.productionCountry,
        distributor: movie.distributor,
        director: movie.director,
        topCast: movie.topCast.join(', ')
      }
    });

    await prisma.oscarNomination.createMany({
      data: movie.nominations.map((nomination) => ({
        movieId: created.id,
        ceremonyYear: nomination.ceremonyYear,
        category: nomination.category,
        won: nomination.won
      }))
    });
  }

  console.log(`Seed completado: ${parsed.length} películas elegibles cargadas.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
