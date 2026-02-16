# Trivia Hollywood

App web mobile-first de trivia sobre largometrajes de producción/distribución mayoritariamente estadounidense con al menos una nominación al Oscar.

## Stack
- Next.js (App Router) + TypeScript
- TailwindCSS
- Zod
- Vitest + Playwright

## Requisitos
- Node 20+

## Setup
```bash
npm install
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


## Avance Milestone 2 (multiplayer asincrónico)
- Modelado inicial en Prisma para salas privadas: `Room`, `RoomPlayer`, `RoomRun`, `RoomQuestionSet`.
- Estados de sala disponibles: `waiting`, `started`, `finished`.
- Helpers de dominio para código de sala y validación de capacidad (2-8).
- UI inicial mobile-first en `/multiplayer` para crear sala y unirse por código (paso siguiente: conectar handlers/API).

## Accesibilidad 70+
- Tipografía base aumentada para mejorar legibilidad en móvil.
- Contraste alto por defecto en botones, tarjetas y foco.
- Objetivos táctiles grandes (mínimo 56px) para reducir errores de toque.
- Opción de salto al contenido principal para navegación rápida con teclado/lectores.
- Respeto de `prefers-reduced-motion` para personas sensibles a animaciones.

## Despliegue en GitHub Pages
Este repositorio quedó preparado para despliegue estático en GitHub Pages.

1. En GitHub, entra a **Settings → Pages**.
2. En **Build and deployment**, selecciona **Source: GitHub Actions**.
3. Haz push a `main`.
4. El workflow `Deploy to GitHub Pages` construye y publica automáticamente el contenido estático en `out/`.

### Notas técnicas
- Se usa `output: "export"` para generar sitio estático.
- Se calcula `basePath`/`assetPrefix` automáticamente durante Actions usando `GITHUB_REPOSITORY`, para que funcione en repos de tipo `usuario/repo`.
- La partida solo usa datos locales curados (`data/movies.sample.json`), sin API runtime.
