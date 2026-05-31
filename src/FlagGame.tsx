import { useCallback, useEffect, useState } from 'react'
import { countries } from './countries'
import {
    answerQuestion,
    createGame,
    generateRound,
    getFlagUrl,
    INITIAL_LIVES,
    restart,
    type Country,
    type Feedback,
    type GameState,
    type Round,
} from './game'

const CORRECT_DELAY_MS = 1200
const WRONG_DELAY_MS = 1500

const Heart = ({ filled }: { filled: boolean }) => (
    <span className={`text-2xl transition-all ${filled ? '' : 'grayscale opacity-30'}`}>
        ❤️
    </span>
)

export default function FlagGame() {
    const [game, setGame] = useState<GameState>(() => createGame())
    const [round, setRound] = useState<Round | null>(null)
    const [feedback, setFeedback] = useState<Feedback | null>(null)
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

    const nextRound = useCallback(() => {
        setRound(generateRound(countries))
        setFeedback(null)
        setSelectedAnswer(null)
    }, [])

    useEffect(() => {
        nextRound()
    }, [nextRound])

    const handleChoice = (country: Country) => {
        if (feedback || !round) return

        setSelectedAnswer(country.code)
        const outcome = answerQuestion(game, round.correct, country)
        setFeedback(outcome.feedback)

        if (outcome.feedback.correct) {
            setGame(outcome.state)
            window.setTimeout(nextRound, CORRECT_DELAY_MS)
            return
        }

        // Decrement lives immediately for visual feedback, but reveal the answer
        // for a beat before either advancing or showing the game-over screen.
        setGame({ ...outcome.state, status: 'playing' })
        window.setTimeout(() => {
            if (outcome.state.status === 'gameOver') {
                setGame(outcome.state)
            } else {
                nextRound()
            }
        }, WRONG_DELAY_MS)
    }

    const restartGame = () => {
        setGame(restart(game))
        nextRound()
    }

    if (game.status === 'gameOver') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">Game Over!</h1>
                    <div className="text-6xl mb-6">🏁</div>
                    <div className="space-y-2 mb-8">
                        <p className="text-2xl text-slate-700">
                            Final Score: <span className="font-bold text-blue-600">{game.score}</span>
                        </p>
                        {game.score >= game.highScore && game.score > 0 && (
                            <p className="text-lg text-amber-500 font-semibold">🏆 New High Score!</p>
                        )}
                        <p className="text-lg text-slate-500">
                            High Score: <span className="font-semibold text-amber-600">{game.highScore}</span>
                        </p>
                    </div>
                    <button
                        onClick={restartGame}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform transition hover:scale-105"
                    >
                        Play Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-1">
                        {[...Array(INITIAL_LIVES)].map((_, i) => (
                            <Heart key={i} filled={i < game.lives} />
                        ))}
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500">Score</p>
                        <p className="text-2xl font-bold text-slate-800">{game.score}</p>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">
                        Which country does this flag belong to?
                    </h2>

                    {round && (
                        <div className="py-6">
                            <img
                                src={getFlagUrl(round.correct.code)}
                                alt="Flag to guess"
                                className="w-72 h-auto mx-auto rounded-lg shadow-xl border-4 border-slate-200"
                            />
                        </div>
                    )}
                </div>

                {/* Reserve the feedback slot so showing/hiding it doesn't shift the buttons. */}
                <div className="mb-4 min-h-[3.25rem] flex items-stretch">
                    {feedback && (
                        <div className={`w-full text-center p-3 rounded-lg ${feedback.correct
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                            <p className="font-semibold">{feedback.message}</p>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    {round?.choices.map((country, index) => {
                        let buttonStyle = 'bg-slate-100 hover:bg-slate-200 text-slate-800'

                        if (selectedAnswer && round) {
                            if (country.code === round.correct.code) {
                                buttonStyle = 'bg-green-500 text-white'
                            } else if (country.code === selectedAnswer) {
                                buttonStyle = 'bg-red-500 text-white'
                            } else {
                                buttonStyle = 'bg-slate-100 text-slate-400'
                            }
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleChoice(country)}
                                disabled={!!feedback}
                                className={`w-full py-3 px-4 rounded-xl font-medium text-lg transition-all ${buttonStyle} ${!feedback ? 'hover:shadow-md transform hover:scale-[1.02]' : ''
                                    }`}
                            >
                                {country.name}
                            </button>
                        )
                    })}
                </div>

                <p className="text-center text-slate-400 text-sm mt-6">
                    🏆 High Score: {game.highScore} | 🌍 {countries.length} countries
                </p>
            </div>
        </div>
    )
}
