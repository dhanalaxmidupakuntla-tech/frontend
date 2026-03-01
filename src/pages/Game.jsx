import { useState, useEffect } from "react";
import { useXp } from "../context/XpContext";
import PageWrapper from "../components/layout/PageWrapper";

export default function Game() {
  const [cards, setCards] = useState(
    JSON.parse(localStorage.getItem("flashcards")) || []
  );
  const { addXp } = useXp();
  const [current, setCurrent] = useState(null);
  const [choices, setChoices] = useState([]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (cards.length) pickCard();
  }, [cards]);

  const pickCard = () => {
    const idx = Math.floor(Math.random() * cards.length);
    const card = cards[idx];

    // build choices: correct meaning + 3 others
    const otherMeanings = cards
      .filter((c, i) => i !== idx)
      .map((c) => c.meaning);
    shuffleArray(otherMeanings);
    const opts = [card.meaning, ...otherMeanings.slice(0, 3)];
    shuffleArray(opts);

    setCurrent(card);
    setChoices(opts);
    setFeedback("");
  };

  const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };

  const handleChoice = (choice) => {
    if (!current) return;
    if (choice === current.meaning) {
      setFeedback("Correct! 🎉");
      addXp(10);
    } else {
      setFeedback(`Oops, the right answer was "${current.meaning}".`);
    }
    setTimeout(pickCard, 1500);
  };

  if (!cards.length) {
    return (
      <PageWrapper title="Game">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300">You need to add some flashcards first.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Go to Flashcards to create new cards!</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Word Quiz Game">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-center">🎮 What is the meaning?</h3>
        {current && (
          <>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 p-8 rounded-2xl shadow-lg mb-8">
              <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-4">Translate this word</p>
              <p className="text-center text-5xl font-bold text-purple-700 dark:text-purple-300">{current.word}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-8">
              {choices.map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(c)}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 dark:from-purple-700 dark:to-indigo-700 dark:hover:from-purple-600 dark:hover:to-indigo-600 text-white font-bold py-4 px-6 rounded-xl transition transform hover:scale-105 active:scale-95 text-lg shadow-md"
                >
                  {c}
                </button>
              ))}
            </div>
            {feedback && (
              <div className={`text-center text-xl font-bold p-4 rounded-lg ${feedback.includes('Correct') ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`} aria-live="polite">
                {feedback}
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
