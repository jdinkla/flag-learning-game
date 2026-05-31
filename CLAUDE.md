# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (http://localhost:5173)
- `npm run build` — type-check (`tsc -b`) then production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run typecheck` — type-check only (`tsc -b`)
- `npm test` — run Vitest in watch mode; `npm run test:run` runs once (CI)

There is also a `justfile` (`just --list`): `just dev`, `just typecheck`, `just test`, `just test-watch`, `just check` (typecheck + tests), `just build`.

The project is **TypeScript** (strict) with **Vitest** + React Testing Library for tests. Source is `.ts`/`.tsx`. There is no separate linter — `tsc` in strict mode is the static check.

### Working style: TDD

Game rules live in pure, framework-free functions (`src/game.ts`) so they can be driven test-first without React or timers. When changing or adding a rule, write/extend the test in `src/game.test.ts` first, watch it fail, then implement. Keep side-effects (timing, DOM, RNG defaults) in the component; keep decisions in `game.ts`.

## Architecture

A single-page React app that quizzes the player on world flags. There is no router, state library, or backend. Logic and UI are deliberately separated for testability:

- `src/game.ts` → **pure game logic + types.** `Country`, `GameState`, `shuffle`, `generateRound`, `answerQuestion`, `createGame`, `restart`, `getFlagUrl`. All deterministic; the RNG is an injectable `Rng` parameter (defaults to `Math.random`). No React, no timers.
- `src/countries.ts` → the `countries` data array (ISO 3166-1 alpha-2 `code` + display `name`).
- `src/FlagGame.tsx` → the UI shell. Holds React state, renders, and owns the *timing* side-effects (advance delays, game-over reveal). Delegates every decision to `game.ts`.
- `src/App.tsx` → thin wrapper that renders `<FlagGame />`.
- `src/main.tsx` → mounts `App` into `#root` (see `index.html`).
- `src/game.test.ts` → unit tests for the pure logic. `src/FlagGame.test.tsx` → component tests (answers deterministically by reading the correct code from the flag image `src`).
- `vitest.setup.ts` → registers `@testing-library/jest-dom` matchers. Vitest config lives in `vite.config.ts` (jsdom env, globals).

### How a round works

- `generateRound(countries, rng?)` (in `game.ts`) shuffles `countries`, takes index 0 as the correct answer and the next `CHOICES_PER_ROUND - 1` as distractors, then shuffles those into `choices`. The component calls it on mount and after each answer.
- `answerQuestion(state, current, chosen)` (pure) returns the next `GameState` + `Feedback`. Correct → +1 score. Wrong → −1 life; at 0 lives → `status: 'gameOver'` with `highScore` promoted to `max(highScore, score)`.
- `FlagGame.tsx` adds timing on top: correct → advance after 1.2s; wrong → reveal the answer for 1.5s, then advance or show game-over. Lives decrement immediately for visual feedback even when the game is about to end.
- `highScore` lives in component state only — it resets on full page reload (not persisted to `localStorage`).
- Flag images are fetched at runtime from `flagcdn.com` via `getFlagUrl(code)` → `https://flagcdn.com/w320/{code}.png`. Adding a country = adding a `{ code, name }` entry to `src/countries.ts` whose `code` exists on flagcdn.

### Styling

Tailwind CSS utility classes inline in JSX. Tailwind scans `index.html` and `src/**/*` (see `tailwind.config.js`); PostCSS config in `postcss.config.js`. No custom theme — `theme.extend` is empty.
