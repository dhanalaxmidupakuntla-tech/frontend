import { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import FlashCardView from "../components/flashcards/FlashCardView";
import ReviewButtons from "../components/flashcards/ReviewButtons";
import useFlashcardStats from "../hooks/useFlashcardStats";
import { calculateSM2 } from "../utils/sm2";
import { XpContext } from "../context/XpContext";

/* ---------------------------------- */
/* Helpers */
/* ---------------------------------- */

const NOW = () => Date.now();

const DEFAULT_CARDS = [
  { id: 1, word: "Hello", meaning: "Hola", category: "Basics" },
  { id: 2, word: "Thank you", meaning: "Gracias", category: "Basics" },
  { id: 3, word: "Airport", meaning: "Aeropuerto", category: "Travel" },
  { id: 4, word: "Hotel", meaning: "Hotel", category: "Travel" },
  { id: 5, word: "Water", meaning: "Agua", category: "Food" },
  { id: 6, word: "Bread", meaning: "Pan", category: "Food" },
].map((c) => ({
  ...c,
  repetitions: 0,
  easeFactor: 2.5,
  interval: 1,
  nextReview: NOW(),
  correctCount: 0,
  wrongCount: 0,
}));

const loadFlashcards = () => {
  const saved = localStorage.getItem("flashcards");
  return saved ? JSON.parse(saved) : DEFAULT_CARDS;
};

const getLevelFromAccuracy = (accuracy) => {
  if (accuracy >= 90) return "Advanced";
  if (accuracy >= 70) return "Intermediate";
  return "Beginner";
};

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */

export default function Flashcards() {
  const { addXp } = useContext(XpContext);
  const navigate = useNavigate();

  const [flashcards, setFlashcards] = useState(loadFlashcards);
  const [index, setIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [shuffleMode, setShuffleMode] = useState(false);

  const [newWord, setNewWord] = useState("");
  const [newMeaning, setNewMeaning] = useState("");
  const [newCategory, setNewCategory] = useState("Basics");

  const stats = useFlashcardStats(flashcards);
  const level = getLevelFromAccuracy(stats.accuracy);

  /* ---------------------------------- */
  /* Derived Cards */
  /* ---------------------------------- */

  const readyCards = useMemo(() => {
    const now = NOW();

    const filtered = flashcards.filter(
      (c) =>
        c.nextReview <= now &&
        (selectedCategory === "All" || c.category === selectedCategory)
    );

    return shuffleMode
      ? [...filtered].sort(() => Math.random() - 0.5)
      : filtered.sort((a, b) => a.nextReview - b.nextReview);
  }, [flashcards, selectedCategory, shuffleMode]);

  const currentCard = readyCards[index] ?? null;

  /* ---------------------------------- */
  /* Effects */
  /* ---------------------------------- */

  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    setIndex(0);
  }, [selectedCategory, shuffleMode, readyCards.length]);

  /* ---------------------------------- */
  /* Actions */
  /* ---------------------------------- */

  const nextCard = () =>
    setIndex((i) => (i < readyCards.length - 1 ? i + 1 : 0));

  const prevCard = () =>
    setIndex((i) => (i > 0 ? i - 1 : i));

  const reviewCard = (quality) => {
    if (!currentCard) return;

    setFlashcards((prev) =>
      prev.map((card) =>
        card.id !== currentCard.id
          ? card
          : {
              ...card,
              ...calculateSM2(card, quality),
              correctCount:
                quality >= 3 ? card.correctCount + 1 : card.correctCount,
              wrongCount:
                quality < 3 ? card.wrongCount + 1 : card.wrongCount,
            }
      )
    );

    addXp(quality * 5);
    nextCard();
  };

  const addNewCard = () => {
    if (!newWord.trim() || !newMeaning.trim()) return;

    setFlashcards((prev) => [
      ...prev,
      {
        id: NOW(),
        word: newWord,
        meaning: newMeaning,
        category: newCategory,
        repetitions: 0,
        easeFactor: 2.5,
        interval: 1,
        nextReview: NOW(),
        correctCount: 0,
        wrongCount: 0,
      },
    ]);

    setNewWord("");
    setNewMeaning("");
  };

  /* ---------------------------------- */
  /* UI */
  /* ---------------------------------- */

  if (!currentCard) {
    return (
      <PageWrapper title="Flashcards">
        <div className="text-center text-xl font-bold">
          🎉 You're done for today!
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

        <div className="mb-3 font-bold text-purple-700">
          🏆 Level: {level}
        </div>

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

        <button
          onClick={() => setShuffleMode((s) => !s)}
          className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded w-full"
        >
          🔀 Shuffle: {shuffleMode ? "ON" : "OFF"}
        </button>

        <p className="text-sm text-gray-600 mb-2">
          Card {index + 1} of {readyCards.length}
        </p>

        <div className="w-full bg-gray-300 h-3 rounded-full mb-6">
          <div
            className="bg-green-500 h-3 rounded-full transition-all"
            style={{ width: `${((index + 1) / readyCards.length) * 100}%` }}
          />
        </div>

        <FlashCardView card={currentCard} />
        <ReviewButtons onReview={reviewCard} />

        <div className="flex gap-2 mt-4">
          <button
            onClick={prevCard}
            disabled={index === 0}
            className="bg-gray-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
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

        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">➕ Add New Card</h3>

          <input
            placeholder="Word"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />

          <input
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