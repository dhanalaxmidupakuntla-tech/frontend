import { useState, useEffect } from "react";
import { useXp } from "../context/XpContext";
import PageWrapper from "../components/layout/PageWrapper";

export default function Game() {
  const { addXp } = useXp();

  // Difficulty Levels
  const LEVELS = {
    Easy: 5,
    Medium: 10,
    Hard: 20,
  };

  const [difficulty, setDifficulty] = useState("Medium");
  const QUESTION_LIMIT = LEVELS[difficulty];

  // Default fallback cards
  const defaultCards = [
    { word: "Hello", meaning: "Hola" },
    { word: "Thank you", meaning: "Gracias" },
    { word: "Goodbye", meaning: "Adiós" },
    { word: "Water", meaning: "Agua" },
    { word: "Bread", meaning: "Pan" },
    { word: "One", meaning: "Uno" },
    { word: "Two", meaning: "Dos" },
    { word: "Airport", meaning: "Aeropuerto" },
    { word: "Hotel", meaning: "Hotel" },
    { word: "Friend", meaning: "Amigo" },
  ];

  const storedCards =
    JSON.parse(localStorage.getItem("flashcards")) || [];

  const cards = storedCards.length ? storedCards : defaultCards;

  const [current, setCurrent] = useState(null);
  const [choices, setChoices] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [questionCount, setQuestionCount] = useState(0);
  const [usedIndexes, setUsedIndexes] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (cards.length >= 4) {
      pickCard();
    }
  }, [difficulty]);

  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const pickCard = () => {
    if (cards.length < 4) return;

    let availableIndexes = cards
      .map((_, i) => i)
      .filter((i) => !usedIndexes.includes(i));

    if (availableIndexes.length === 0) {
      setUsedIndexes([]);
      availableIndexes = cards.map((_, i) => i);
    }

    const randomIndex =
      availableIndexes[Math.floor(Math.random() * availableIndexes.length)];

    const card = cards[randomIndex];

    const wrongOptions = shuffleArray(
      cards
        .filter((_, i) => i !== randomIndex)
        .map((c) => c.meaning)
    ).slice(0, 3);

    const options = shuffleArray([
      card.meaning,
      ...wrongOptions,
    ]);

    setCurrent(card);
    setChoices(options);
    setUsedIndexes((prev) => [...prev, randomIndex]);
    setFeedback("");
  };

  const handleChoice = (choice) => {
    if (!current || gameOver) return;

    const isCorrect = choice === current.meaning;

    if (isCorrect) {
      setFeedback("Correct! 🎉");
      setScore((prev) => prev + 10);
      addXp(10);
    } else {
      setFeedback(`Wrong! Correct answer: ${current.meaning}`);
      setLives((prev) => prev - 1);
    }

    const newQuestionCount = questionCount + 1;
    setQuestionCount(newQuestionCount);

    setTimeout(() => {
      if (
        lives - (isCorrect ? 0 : 1) <= 0 ||
        newQuestionCount >= QUESTION_LIMIT
      ) {
        setGameOver(true);
      } else {
        pickCard();
      }
    }, 1000);
  };

  const restartGame = () => {
    setScore(0);
    setLives(3);
    setQuestionCount(0);
    setUsedIndexes([]);
    setGameOver(false);
    pickCard();
  };

  if (cards.length < 4) {
    return (
      <PageWrapper title="Game">
        <div className="text-center">
          <p>You need at least 4 flashcards to play.</p>
        </div>
      </PageWrapper>
    );
  }

  const progress = (questionCount / QUESTION_LIMIT) * 100;

  return (
    <PageWrapper title="Word Quiz Game">
      <div className="max-w-2xl mx-auto text-center">

        {/* Difficulty Selector */}
        <div className="mb-6">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border p-2 rounded"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        {/* Score & Lives */}
        <div className="flex justify-between mb-6">
          <p className="text-lg font-bold">Score: {score}</p>
          <p className="text-lg font-bold text-red-500">
            Lives: {"❤️".repeat(lives)}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-300 h-3 rounded-full mb-8">
          <div
            className="bg-purple-600 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {gameOver ? (
          <div>
            <h2 className="text-3xl font-bold mb-4">
              {lives <= 0 ? "Game Over 💀" : "Level Complete 🎉"}
            </h2>
            <p className="text-xl mb-6">Final Score: {score}</p>
            <button
              onClick={restartGame}
              className="bg-purple-600 text-white px-6 py-3 rounded-xl"
            >
              🔄 Play Again
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-3xl font-bold mb-8">
              🎮 What is the meaning?
            </h3>

            {current && (
              <>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-2xl shadow-lg mb-8">
                  <p className="text-sm mb-4">Translate this word</p>
                  <p className="text-5xl font-bold text-purple-700">
                    {current.word}
                  </p>
                </div>

                <div className="grid gap-4 mb-6">
                  {choices.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => handleChoice(c)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl transition transform hover:scale-105"
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {feedback && (
                  <div
                    className={`text-xl font-bold p-4 rounded-lg ${
                      feedback.includes("Correct")
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {feedback}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}