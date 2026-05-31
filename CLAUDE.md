# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (http://localhost:5173)
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally

There is no test runner, linter, or TypeScript in this project. Source is plain JSX (`.jsx`).

## Architecture

A single-page React app that quizzes the player on world flags. The entire game is one component; there is no router, state library, or backend.

- `src/main.jsx` → mounts `App` into `#root` (see `index.html`).
- `src/App.jsx` → thin wrapper that renders `<FlagGame />`.
- `src/FlagGame.jsx` → **the whole application.** Holds the `countries` data array (ISO 3166-1 alpha-2 `code` + display `name`), all game state, and all UI.

### How a round works (`FlagGame.jsx`)

- `generateRound()` shuffles `countries`, picks index 0 as the correct answer and indices 1–2 as distractors, then shuffles those three into `choices`. Called on mount and after each answer.
- `handleChoice()` compares the picked country's `code` to `currentCountry.code`. Correct → +1 score, advance after 1.2s. Wrong → −1 life, reveal the answer, advance after 1.5s. At 0 lives → update `highScore` and switch `gameState` to `'gameOver'`.
- `highScore` lives in component state only — it resets on full page reload (not persisted to `localStorage`).
- Flag images are fetched at runtime from `flagcdn.com` via `getFlagUrl(code)` → `https://flagcdn.com/w320/{code}.png`. Adding a country = adding a `{ code, name }` entry whose `code` exists on flagcdn.

### Styling

Tailwind CSS utility classes inline in JSX. Tailwind scans `index.html` and `src/**/*` (see `tailwind.config.js`); PostCSS config in `postcss.config.js`. No custom theme — `theme.extend` is empty.
