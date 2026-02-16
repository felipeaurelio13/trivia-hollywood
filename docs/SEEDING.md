# Seeding de datos

## Objetivo
Cargar películas elegibles (USA + >=1 nominación Oscar) para alimentar trivia.

## Fuente actual
- `data/movies.sample.json`
- Dataset **real** curado manualmente (54 largometrajes elegibles) para mejorar cobertura y variedad de preguntas en modo solo.

## Formato
Cada item:
- `title`
- `releaseYear`
- `productionCountry` (debe ser `USA`)
- `distributor`
- `director`
- `topCast` (array de strings)
- `nominations` (array con `ceremonyYear`, `category`, `won`)

## Validación
- Zod en `lib/data/schema.ts`.
- Reglas: mínimo 1 nominación, campos obligatorios.

## Carga
1. `cp .env.example .env`
2. `npm run prisma:generate`
3. `npm run prisma:migrate -- --name init`
4. `npm run prisma:seed`

## Agregar nuevas películas
1. Editar `data/movies.sample.json` con datos reales verificables.
2. Correr `npm run test:unit` para validar esquema.
3. Volver a correr `npm run prisma:seed`.
