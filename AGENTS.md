# AGENTS.md · Convenciones del repositorio

## Principios
- UX mobile-first, minimalista, sin fricción.
- Pantalla de pregunta sin scroll en móviles.
- Accesibilidad: foco visible, botones grandes, labels claros y contraste alto.
- Datos elegibles: SOLO largometrajes mayoritariamente estadounidenses con >=1 nominación Oscar.
- Cada nueva funcionalidad debe venir con test nuevo o actualización de test existente.
- Actualizar `README.md` y versión visible en footer cuando se agregue funcionalidad relevante.

## Estructura sugerida
- `app/`: rutas UI y API route handlers.
- `components/`: UI reutilizable.
- `lib/`: dominio (game, analytics, data, prisma).
- `prisma/`: `schema.prisma` y seed.
- `data/`: datasets validados.
- `docs/`: PRD, arquitectura y seeding.
- `tests/unit` y `tests/e2e`.

## Comandos
- `npm run dev`: entorno local.
- `npm run lint`: linting.
- `npm run test:unit`: pruebas unitarias.
- `npm run test:e2e`: pruebas e2e.
- `npm run prisma:migrate`: migraciones.
- `npm run prisma:seed`: carga de dataset.

## Reglas del juego (MVP)
- 10 preguntas por partida.
- 4 opciones por pregunta.
- Tipos A/B/C/D/E en mezcla.
- Feedback inmediato + explicación de 1 línea.
- Sin vidas: el usuario responde las 10 sí o sí.
- Scoring: +100 correcta, 0 incorrecta.

## Nota de despliegue
- El proyecto usa Prisma + API routes, por lo que requiere runtime server para MVP actual.
- Si se despliega en GitHub Pages, separar frontend estático y backend/API en servicio aparte.
