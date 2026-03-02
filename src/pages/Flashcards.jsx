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
  const [shuffleMode, setShuffleMode] = useState(false);
  const [level, setLevel] = useState("Beginner");

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
    ];
  });

  const [index, setIndex] = useState(0);

  const stats = useFlashcardStats(flashcards);

  // Auto Level Upgrade
  useEffect(() => {
    if (stats.accuracy >= 90) setLevel("Advanced");
    else if (stats.accuracy >= 70) setLevel("Intermediate");
    else setLevel("Beginner");
  }, [stats.accuracy]);

  const readyCards = useMemo(() => {
    const now = Date.now();

    let filtered = flashcards
      .filter((c) => c.nextReview <= now)
      .filter((c) =>
        selectedCategory === "All" ? true : c.category === selectedCategory
      );

    if (shuffleMode) {
      return [...filtered].sort(() => Math.random() - 0.5);
    }

    return filtered.sort((a, b) => a.nextReview - b.nextReview);
  }, [flashcards, selectedCategory, shuffleMode]);

  const currentCard = readyCards[index] ?? null;

  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    setIndex(0);
  }, [selectedCategory, shuffleMode]);

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
    nextCard();
  };

  const nextCard = () => {
    if (index < readyCards.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      setIndex(0);
    }
  };

  const prevCard = () => {
    if (index > 0) {
      setIndex((prev) => prev - 1);
    }
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

  if (!currentCard) {
    return (
      <PageWrapper title="Flashcards">
        <div className="text-center">
          <h2 className="text-2xl font-bold">🎉 You're done for today!</h2>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Flashcards">
      <div className="max-w-xl mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-gray-500 text-white px-4 py-2 rounded"
        >
          ⬅ Back
        </button>

        {/* Level Badge */}
        <div className="mb-3 font-bold text-purple-700">
          🏆 Level: {level}
        </div>

        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        >
          <option>All</option>
          <option>Basics</option>
          <option>Travel</option>
          <option>Food</option>
        </select>

        {/* Shuffle Toggle */}
        <button
          onClick={() => setShuffleMode(!shuffleMode)}
          className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded w-full"
        >
          🔀 Shuffle: {shuffleMode ? "ON" : "OFF"}
        </button>

        {/* Progress */}
        <p className="text-sm text-gray-600 mb-2">
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

        <FlashCardView card={currentCard} />
        <ReviewButtons onReview={reviewCard} />

        {/* Navigation Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={prevCard}
            className="bg-gray-600 text-white px-4 py-2 rounded w-full"
          >
            ⬅ Previous
          </button>

          <button
            onClick={nextCard}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            ➡ Next
          </button>
        </div>

        {/* Add New Card */}
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