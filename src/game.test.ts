import { describe, expect, it } from 'vitest'
import {
    answerQuestion,
    createGame,
    CHOICES_PER_ROUND,
    Country,
    generateRound,
    getFlagUrl,
    INITIAL_LIVES,
    restart,
    shuffle,
} from './game'

// A deterministic RNG that cycles through fixed values, so shuffles and rounds
// are reproducible in tests.
const seededRng = (values: number[]) => {
    let i = 0
    return () => values[i++ % values.length]
}

const sample: Country[] = [
    { code: 'de', name: 'Germany' },
    { code: 'fr', name: 'France' },
    { code: 'it', name: 'Italy' },
    { code: 'es', name: 'Spain' },
    { code: 'gb', name: 'United Kingdom' },
]

describe('getFlagUrl', () => {
    it('builds a flagcdn URL from a country code', () => {
        expect(getFlagUrl('de')).toBe('https://flagcdn.com/w320/de.png')
    })
})

describe('shuffle', () => {
    it('does not mutate the input array', () => {
        const input = [...sample]
        const before = [...input]
        shuffle(input, seededRng([0.1, 0.5, 0.9]))
        expect(input).toEqual(before)
    })

    it('returns a permutation containing exactly the same elements', () => {
        const result = shuffle(sample, seededRng([0.3, 0.7, 0.2, 0.9]))
        expect(result).toHaveLength(sample.length)
        expect([...result].sort((a, b) => a.code.localeCompare(b.code))).toEqual(
            [...sample].sort((a, b) => a.code.localeCompare(b.code)),
        )
    })

    it('is deterministic for a fixed RNG sequence', () => {
        const a = shuffle(sample, seededRng([0.42, 0.17, 0.83, 0.5]))
        const b = shuffle(sample, seededRng([0.42, 0.17, 0.83, 0.5]))
        expect(a).toEqual(b)
    })
})

describe('generateRound', () => {
    it('produces CHOICES_PER_ROUND choices including the correct country', () => {
        const round = generateRound(sample, seededRng([0.1, 0.4, 0.8, 0.2, 0.6]))
        expect(round.choices).toHaveLength(CHOICES_PER_ROUND)
        expect(round.choices).toContainEqual(round.correct)
    })

    it('produces choices with distinct codes', () => {
        const round = generateRound(sample, seededRng([0.9, 0.1, 0.5, 0.3, 0.7]))
        const codes = round.choices.map((c) => c.code)
        expect(new Set(codes).size).toBe(codes.length)
    })

    it('throws when there are too few countries', () => {
        expect(() => generateRound(sample.slice(0, 2))).toThrow()
    })
})

describe('createGame', () => {
    it('starts with full lives, zero score, and playing status', () => {
        expect(createGame()).toEqual({
            lives: INITIAL_LIVES,
            score: 0,
            highScore: 0,
            status: 'playing',
        })
    })

    it('carries an existing high score', () => {
        expect(createGame(7).highScore).toBe(7)
    })
})

describe('answerQuestion', () => {
    const de = sample[0]
    const fr = sample[1]

    it('increments score and keeps playing on a correct answer', () => {
        const { state, feedback } = answerQuestion(createGame(), de, de)
        expect(state.score).toBe(1)
        expect(state.lives).toBe(INITIAL_LIVES)
        expect(state.status).toBe('playing')
        expect(feedback).toEqual({ correct: true, message: 'Correct! 🎉' })
    })

    it('loses a life and names the right answer on a wrong guess', () => {
        const { state, feedback } = answerQuestion(createGame(), de, fr)
        expect(state.lives).toBe(INITIAL_LIVES - 1)
        expect(state.score).toBe(0)
        expect(state.status).toBe('playing')
        expect(feedback).toEqual({ correct: false, message: 'Wrong! It was Germany' })
    })

    it('ends the game when the last life is lost', () => {
        const oneLife = { ...createGame(), lives: 1, score: 4 }
        const { state } = answerQuestion(oneLife, de, fr)
        expect(state.lives).toBe(0)
        expect(state.status).toBe('gameOver')
    })

    it('promotes the score to high score at game over when it beats the record', () => {
        const oneLife = { lives: 1, score: 10, highScore: 5, status: 'playing' as const }
        const { state } = answerQuestion(oneLife, de, fr)
        expect(state.highScore).toBe(10)
    })

    it('keeps a higher existing high score at game over', () => {
        const oneLife = { lives: 1, score: 3, highScore: 8, status: 'playing' as const }
        const { state } = answerQuestion(oneLife, de, fr)
        expect(state.highScore).toBe(8)
    })

    it('does not mutate the input state', () => {
        const state = createGame()
        const snapshot = { ...state }
        answerQuestion(state, de, fr)
        expect(state).toEqual(snapshot)
    })
})

describe('restart', () => {
    it('resets lives/score/status but preserves the high score', () => {
        const ended = { lives: 0, score: 2, highScore: 9, status: 'gameOver' as const }
        expect(restart(ended)).toEqual({
            lives: INITIAL_LIVES,
            score: 0,
            highScore: 9,
            status: 'playing',
        })
    })
})
