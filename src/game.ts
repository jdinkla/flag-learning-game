// Pure, framework-free game logic. Everything here is deterministic given its
// inputs (the RNG is injectable), which is what makes the rules unit-testable
// without rendering React or waiting on timers. The component is a thin shell
// over these functions.

export interface Country {
    code: string
    name: string
}

export type GameStatus = 'playing' | 'gameOver'

export interface Feedback {
    correct: boolean
    message: string
}

export interface Round {
    correct: Country
    choices: Country[]
}

export interface GameState {
    lives: number
    score: number
    highScore: number
    status: GameStatus
}

/** A random source in [0, 1). Injected so tests can be deterministic. */
export type Rng = () => number

export const INITIAL_LIVES = 3
export const CHOICES_PER_ROUND = 3

export const getFlagUrl = (code: string): string =>
    `https://flagcdn.com/w320/${code}.png`

/** Fisher–Yates shuffle. Returns a new array; never mutates the input. */
export function shuffle<T>(array: readonly T[], rng: Rng = Math.random): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

/**
 * Build a round: one correct country plus `CHOICES_PER_ROUND - 1` distractors,
 * all shuffled together so the correct answer isn't always in the same slot.
 */
export function generateRound(
    countries: readonly Country[],
    rng: Rng = Math.random,
): Round {
    if (countries.length < CHOICES_PER_ROUND) {
        throw new Error(
            `Need at least ${CHOICES_PER_ROUND} countries to build a round, got ${countries.length}`,
        )
    }
    const shuffled = shuffle(countries, rng)
    const correct = shuffled[0]
    const distractors = shuffled.slice(1, CHOICES_PER_ROUND)
    const choices = shuffle([correct, ...distractors], rng)
    return { correct, choices }
}

/** A fresh game. `highScore` carries over between games. */
export function createGame(highScore = 0): GameState {
    return { lives: INITIAL_LIVES, score: 0, highScore, status: 'playing' }
}

export interface AnswerOutcome {
    state: GameState
    feedback: Feedback
}

/**
 * Apply an answer and return the next state plus feedback to show.
 *
 * - Correct: +1 score, game continues.
 * - Wrong: −1 life. If that empties the lives, the game ends and the high
 *   score is updated to the best of the previous high and this run's score.
 */
export function answerQuestion(
    state: GameState,
    current: Country,
    chosen: Country,
): AnswerOutcome {
    if (chosen.code === current.code) {
        return {
            state: { ...state, score: state.score + 1 },
            feedback: { correct: true, message: 'Correct! 🎉' },
        }
    }

    const lives = state.lives - 1
    const feedback: Feedback = {
        correct: false,
        message: `Wrong! It was ${current.name}`,
    }

    if (lives <= 0) {
        return {
            state: {
                ...state,
                lives: 0,
                status: 'gameOver',
                highScore: Math.max(state.highScore, state.score),
            },
            feedback,
        }
    }

    return { state: { ...state, lives }, feedback }
}

/** Start a new game while preserving the accumulated high score. */
export function restart(state: GameState): GameState {
    return createGame(state.highScore)
}
