import { z } from 'zod';

export const nominationSchema = z.object({
  ceremonyYear: z.number().int().gte(1929),
  category: z.string().min(2),
  won: z.boolean()
});

export const movieSeedSchema = z.object({
  title: z.string().min(1),
  releaseYear: z.number().int().gte(1927),
  productionCountry: z.literal('USA'),
  distributor: z.string().min(2),
  director: z.string().min(2),
  topCast: z.array(z.string().min(2)).min(2),
  nominations: z.array(nominationSchema).min(1)
});

export const movieSeedListSchema = z.array(movieSeedSchema).min(10);

export type MovieSeed = z.infer<typeof movieSeedSchema>;
