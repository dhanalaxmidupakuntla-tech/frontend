import { useState, useEffect, useContext, useMemo } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import FlashCardView from "../components/flashcards/FlashCardView";
import ReviewButtons from "../components/flashcards/ReviewButtons";
import useFlashcardStats from "../hooks/useFlashcardStats";
import { calculateSM2 } from "../utils/sm2";
import { XpContext } from "../context/XpContext";
import { useNavigate } from "react-router-dom";

export default function Flashcards() {
  const { addXp } = useContext(XpContext);
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newWord, setNewWord] = useState("");
  const [newMeaning, setNewMeaning] = useState("");
  const [newCategory, setNewCategory] = useState("Basics");

  const [flashcards, setFlashcards] = useState(() => {
    const saved = localStorage.getItem("flashcards");
    if (saved) return JSON.parse(saved);

    const now = Date.now();

    return [
      { id: 1, word: "Hello", meaning: "Hola", category: "Basics", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 2, word: "Thank you", meaning: "Gracias", category: "Basics", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 3, word: "Airport", meaning: "Aeropuerto", category: "Travel", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 4, word: "Hotel", meaning: "Hotel", category: "Travel", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 5, word: "Water", meaning: "Agua", category: "Food", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 6, word: "Bread", meaning: "Pan", category: "Food", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 7, word: "One", meaning: "Uno", category: "Numbers", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 8, word: "Two", meaning: "Dos", category: "Numbers", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
    ];
  });

  const [index, setIndex] = useState(0);

  const readyCards = useMemo(() => {
    const now = Date.now();
    return flashcards
      .filter((c) => c.nextReview <= now)
      .filter((c) =>
        selectedCategory === "All" ? true : c.category === selectedCategory
      )
      .sort((a, b) => a.nextReview - b.nextReview);
  }, [flashcards, selectedCategory]);

  const currentCard = readyCards[index] ?? null;

  const stats = useFlashcardStats(flashcards);

  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

  const reviewCard = (quality) => {
    if (!currentCard) return;

    setFlashcards((prev) =>
      prev.map((card) => {
        if (card.id !== currentCard.id) return card;

        const updated = calculateSM2(card, quality);

        return {
          ...card,
          ...updated,
          correctCount:
            quality >= 3 ? card.correctCount + 1 : card.correctCount,
          wrongCount:
            quality < 3 ? card.wrongCount + 1 : card.wrongCount,
        };
      })
    );

    addXp(quality * 5);
    setIndex((prev) => prev + 1);
  };

  const addNewCard = () => {
    if (!newWord || !newMeaning) return;

    const newCard = {
      id: Date.now(),
      word: newWord,
      meaning: newMeaning,
      category: newCategory,
      repetitions: 0,
      easeFactor: 2.5,
      interval: 1,
      nextReview: Date.now(),
      correctCount: 0,
      wrongCount: 0,
    };

    setFlashcards((prev) => [...prev, newCard]);
    setNewWord("");
    setNewMeaning("");
  };

  useEffect(() => {
    const today = new Date().toDateString();
    const lastReview = localStorage.getItem("lastReview");

    if (lastReview !== today) {
      const streak = Number(localStorage.getItem("streak") || 0);
      localStorage.setItem("streak", streak + 1);
      localStorage.setItem("lastReview", today);
    }
  }, []);

  if (!currentCard) {
    return (
      <PageWrapper title="Flashcards">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">
            🎉 You're done for today!
          </h2>

          <button
            onClick={() =>
              setFlashcards((prev) =>
                prev.map((card) => ({
                  ...card,
                  nextReview: Date.now(),
                }))
              )
            }
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
          >
            ⚡ Force Review Mode
          </button>
        </div>
      </PageWrapper>
    );
  }

  const achievements = [];
  if (stats.accuracy >= 90) achievements.push("🎯 Accuracy Master");
  if (flashcards.length >= 20) achievements.push("📚 Card Collector");
  if ((localStorage.getItem("streak") || 0) >= 7)
    achievements.push("🔥 7-Day Streak");

  return (
    <PageWrapper title="Flashcards">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-gray-500 text-white px-4 py-2 rounded"
        >
          ⬅ Back
        </button>

        {/* Category Filter */}
        <div className="mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option>All</option>
            <option>Basics</option>
            <option>Travel</option>
            <option>Food</option>
            <option>Numbers</option>
          </select>
        </div>

        <p className="text-blue-600 font-semibold">
          📚 Due Today: {readyCards.length}
        </p>

        <p className="text-orange-600 font-bold">
          🔥 Streak: {localStorage.getItem("streak") || 0} days
        </p>

        <div className="mt-2">
          {achievements.map((a, i) => (
            <p key={i} className="text-purple-700 font-semibold">
              {a}
            </p>
          ))}
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Card {index + 1} of {readyCards.length}
        </p>

        <div className="w-full bg-gray-300 h-3 rounded-full mb-6">
          <div
            className="bg-green-500 h-3 rounded-full transition-all"
            style={{
              width: `${((index + 1) / readyCards.length) * 100}%`,
            }}
          />
        </div>

        <div className="mb-6 p-4 bg-gray-200 rounded">
          <p>Total Cards: {stats.total}</p>
          <p>Accuracy: {stats.accuracy}%</p>
        </div>

        <FlashCardView card={currentCard} />
        <ReviewButtons onReview={reviewCard} />

        {/* Add Card Form */}
        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">➕ Add New Card</h3>

          <input
            type="text"
            placeholder="Word"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />

          <input
            type="text"
            placeholder="Meaning"
            value={newMeaning}
            onChange={(e) => setNewMeaning(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />

          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          >
            <option>Basics</option>
            <option>Travel</option>
            <option>Food</option>
            <option>Numbers</option>
          </select>

          <button
            onClick={addNewCard}
            className="bg-purple-600 text-white px-4 py-2 rounded w-full"
          >
            Add Card
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}