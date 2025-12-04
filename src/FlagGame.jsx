import React, { useState, useEffect, useCallback } from 'react';

const countries = [
    { code: 'de', name: 'Germany' },
    { code: 'fr', name: 'France' },
    { code: 'it', name: 'Italy' },
    { code: 'es', name: 'Spain' },
    { code: 'gb', name: 'United Kingdom' },
    { code: 'nl', name: 'Netherlands' },
    { code: 'be', name: 'Belgium' },
    { code: 'at', name: 'Austria' },
    { code: 'ch', name: 'Switzerland' },
    { code: 'pl', name: 'Poland' },
    { code: 'se', name: 'Sweden' },
    { code: 'no', name: 'Norway' },
    { code: 'dk', name: 'Denmark' },
    { code: 'fi', name: 'Finland' },
    { code: 'pt', name: 'Portugal' },
    { code: 'gr', name: 'Greece' },
    { code: 'cz', name: 'Czech Republic' },
    { code: 'hu', name: 'Hungary' },
    { code: 'ie', name: 'Ireland' },
    { code: 'ro', name: 'Romania' },
    { code: 'jp', name: 'Japan' },
    { code: 'kr', name: 'South Korea' },
    { code: 'cn', name: 'China' },
    { code: 'in', name: 'India' },
    { code: 'au', name: 'Australia' },
    { code: 'nz', name: 'New Zealand' },
    { code: 'ca', name: 'Canada' },
    { code: 'us', name: 'United States' },
    { code: 'mx', name: 'Mexico' },
    { code: 'br', name: 'Brazil' },
    { code: 'ar', name: 'Argentina' },
    { code: 'cl', name: 'Chile' },
    { code: 'za', name: 'South Africa' },
    { code: 'eg', name: 'Egypt' },
    { code: 'ng', name: 'Nigeria' },
    { code: 'ke', name: 'Kenya' },
    { code: 'tr', name: 'Turkey' },
    { code: 'ru', name: 'Russia' },
    { code: 'ua', name: 'Ukraine' },
    { code: 'il', name: 'Israel' },
    { code: 'sa', name: 'Saudi Arabia' },
    { code: 'ae', name: 'United Arab Emirates' },
    { code: 'th', name: 'Thailand' },
    { code: 'vn', name: 'Vietnam' },
    { code: 'id', name: 'Indonesia' },
    { code: 'my', name: 'Malaysia' },
    { code: 'sg', name: 'Singapore' },
    { code: 'ph', name: 'Philippines' },
    { code: 'bg', name: 'Bulgaria' },
    { code: 'hr', name: 'Croatia' },
    { code: 'sk', name: 'Slovakia' },
    { code: 'si', name: 'Slovenia' },
    { code: 'ee', name: 'Estonia' },
    { code: 'lv', name: 'Latvia' },
    { code: 'lt', name: 'Lithuania' },
    { code: 'is', name: 'Iceland' },
    { code: 'lu', name: 'Luxembourg' },
    { code: 'mt', name: 'Malta' },
    { code: 'cy', name: 'Cyprus' },
    { code: 'pk', name: 'Pakistan' },
    { code: 'bd', name: 'Bangladesh' },
    { code: 'np', name: 'Nepal' },
    { code: 'lk', name: 'Sri Lanka' },
    { code: 'mm', name: 'Myanmar' },
    { code: 'kh', name: 'Cambodia' },
    { code: 'la', name: 'Laos' },
    { code: 'mn', name: 'Mongolia' },
    { code: 'kp', name: 'North Korea' },
    { code: 'tw', name: 'Taiwan' },
    { code: 'hk', name: 'Hong Kong' },
    { code: 'mo', name: 'Macau' },
    { code: 'qa', name: 'Qatar' },
    { code: 'kw', name: 'Kuwait' },
    { code: 'bh', name: 'Bahrain' },
    { code: 'om', name: 'Oman' },
    { code: 'ye', name: 'Yemen' },
    { code: 'jo', name: 'Jordan' },
    { code: 'lb', name: 'Lebanon' },
    { code: 'sy', name: 'Syria' },
    { code: 'iq', name: 'Iraq' },
    { code: 'ir', name: 'Iran' },
    { code: 'af', name: 'Afghanistan' },
    { code: 'uz', name: 'Uzbekistan' },
    { code: 'kz', name: 'Kazakhstan' },
    { code: 'tm', name: 'Turkmenistan' },
    { code: 'kg', name: 'Kyrgyzstan' },
    { code: 'tj', name: 'Tajikistan' },
    { code: 'az', name: 'Azerbaijan' },
    { code: 'ge', name: 'Georgia' },
    { code: 'am', name: 'Armenia' },
    { code: 'ma', name: 'Morocco' },
    { code: 'dz', name: 'Algeria' },
    { code: 'tn', name: 'Tunisia' },
    { code: 'ly', name: 'Libya' },
    { code: 'sd', name: 'Sudan' },
    { code: 'et', name: 'Ethiopia' },
    { code: 'tz', name: 'Tanzania' },
    { code: 'ug', name: 'Uganda' },
    { code: 'rw', name: 'Rwanda' },
    { code: 'gh', name: 'Ghana' },
    { code: 'ci', name: 'Ivory Coast' },
    { code: 'sn', name: 'Senegal' },
    { code: 'cm', name: 'Cameroon' },
    { code: 'ao', name: 'Angola' },
    { code: 'zw', name: 'Zimbabwe' },
    { code: 'bw', name: 'Botswana' },
    { code: 'na', name: 'Namibia' },
    { code: 'mz', name: 'Mozambique' },
    { code: 'mg', name: 'Madagascar' },
    { code: 'co', name: 'Colombia' },
    { code: 've', name: 'Venezuela' },
    { code: 'pe', name: 'Peru' },
    { code: 'ec', name: 'Ecuador' },
    { code: 'bo', name: 'Bolivia' },
    { code: 'py', name: 'Paraguay' },
    { code: 'uy', name: 'Uruguay' },
    { code: 'gy', name: 'Guyana' },
    { code: 'sr', name: 'Suriname' },
    { code: 'pa', name: 'Panama' },
    { code: 'cr', name: 'Costa Rica' },
    { code: 'ni', name: 'Nicaragua' },
    { code: 'hn', name: 'Honduras' },
    { code: 'sv', name: 'El Salvador' },
    { code: 'gt', name: 'Guatemala' },
    { code: 'bz', name: 'Belize' },
    { code: 'cu', name: 'Cuba' },
    { code: 'jm', name: 'Jamaica' },
    { code: 'ht', name: 'Haiti' },
    { code: 'do', name: 'Dominican Republic' },
    { code: 'pr', name: 'Puerto Rico' },
    { code: 'bs', name: 'Bahamas' },
    { code: 'tt', name: 'Trinidad and Tobago' },
    { code: 'bb', name: 'Barbados' },
];

const getFlagUrl = (code) => `https://flagcdn.com/w320/${code}.png`;

const shuffle = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export default function FlagGame() {
    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [currentCountry, setCurrentCountry] = useState(null);
    const [choices, setChoices] = useState([]);
    const [gameState, setGameState] = useState('playing');
    const [feedback, setFeedback] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const generateRound = useCallback(() => {
        const shuffled = shuffle(countries);
        const correct = shuffled[0];
        const wrong = shuffled.slice(1, 3);
        const allChoices = shuffle([correct, ...wrong]);

        setCurrentCountry(correct);
        setChoices(allChoices);
        setFeedback(null);
        setSelectedAnswer(null);
    }, []);

    useEffect(() => {
        generateRound();
    }, [generateRound]);

    const handleChoice = (country) => {
        if (feedback) return;

        setSelectedAnswer(country.code);

        if (country.code === currentCountry.code) {
            setFeedback({ correct: true, message: 'Correct! 🎉' });
            setScore(prev => prev + 1);
            setTimeout(() => {
                generateRound();
            }, 1200);
        } else {
            const newLives = lives - 1;
            setLives(newLives);
            setFeedback({
                correct: false,
                message: `Wrong! It was ${currentCountry.name}`
            });

            if (newLives === 0) {
                setTimeout(() => {
                    setHighScore(prev => Math.max(prev, score));
                    setGameState('gameOver');
                }, 1500);
            } else {
                setTimeout(() => {
                    generateRound();
                }, 1500);
            }
        }
    };

    const restartGame = () => {
        setLives(3);
        setScore(0);
        setGameState('playing');
        generateRound();
    };

    const Heart = ({ filled }) => (
        <span className={`text-2xl transition-all ${filled ? '' : 'grayscale opacity-30'}`}>
            ❤️
        </span>
    );

    if (gameState === 'gameOver') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">Game Over!</h1>
                    <div className="text-6xl mb-6">🏁</div>
                    <div className="space-y-2 mb-8">
                        <p className="text-2xl text-slate-700">
                            Final Score: <span className="font-bold text-blue-600">{score}</span>
                        </p>
                        {score >= highScore && score > 0 && (
                            <p className="text-lg text-amber-500 font-semibold">🏆 New High Score!</p>
                        )}
                        <p className="text-lg text-slate-500">
                            High Score: <span className="font-semibold text-amber-600">{Math.max(highScore, score)}</span>
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
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                            <Heart key={i} filled={i < lives} />
                        ))}
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500">Score</p>
                        <p className="text-2xl font-bold text-slate-800">{score}</p>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">
                        Which country does this flag belong to?
                    </h2>

                    {currentCountry && (
                        <div className="py-6">
                            <img
                                src={getFlagUrl(currentCountry.code)}
                                alt="Flag to guess"
                                className="w-72 h-auto mx-auto rounded-lg shadow-xl border-4 border-slate-200"
                            />
                        </div>
                    )}
                </div>

                {feedback && (
                    <div className={`text-center mb-4 p-3 rounded-lg ${feedback.correct
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                        <p className="font-semibold">{feedback.message}</p>
                    </div>
                )}

                <div className="space-y-3">
                    {choices.map((country, index) => {
                        let buttonStyle = 'bg-slate-100 hover:bg-slate-200 text-slate-800';

                        if (selectedAnswer) {
                            if (country.code === currentCountry.code) {
                                buttonStyle = 'bg-green-500 text-white';
                            } else if (country.code === selectedAnswer) {
                                buttonStyle = 'bg-red-500 text-white';
                            } else {
                                buttonStyle = 'bg-slate-100 text-slate-400';
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
                        );
                    })}
                </div>

                <p className="text-center text-slate-400 text-sm mt-6">
                    🏆 High Score: {highScore} | 🌍 {countries.length} countries
                </p>
            </div>
        </div>
    );
}