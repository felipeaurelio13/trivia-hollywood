# Trivia Hollywood

App web mobile-first de trivia sobre largometrajes de producción/distribución mayoritariamente estadounidense con al menos una nominación al Oscar.

## Stack
- Next.js (App Router) + TypeScript
- TailwindCSS
- Zod
- Prisma + SQLite (dev)
- Vitest + Playwright

## Requisitos
- Node 20+

## Setup
```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
```

## Desarrollo
```bash
npm run dev
```

## Calidad
```bash
npm run lint
npm run test:unit
npm run test:e2e
```

## Reglas MVP implementadas
- Partida de 10 preguntas exactas.
- 4 opciones por pregunta.
- Feedback inmediato.
- Sin vidas.
- Puntaje +100 por correcta.

## Despliegue
El MVP actual usa Prisma + API routes, por lo que necesita runtime con backend.
Si tu frontend va a GitHub Pages, debes desplegar API/DB en un servicio aparte.
