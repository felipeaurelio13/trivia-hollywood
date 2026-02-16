import movies from '../../data/movies.sample.json';
import { movieSeedListSchema } from '../../lib/data/schema';

describe('movie seed schema', () => {
  it('valida que todas las películas sean USA y con al menos una nominación', () => {
    const parsed = movieSeedListSchema.parse(movies);

    expect(parsed.length).toBeGreaterThanOrEqual(50);
    parsed.forEach((movie) => {
      expect(movie.productionCountry).toBe('USA');
      expect(movie.nominations.length).toBeGreaterThan(0);
    });
  });
});
