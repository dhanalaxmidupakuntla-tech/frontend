import { useState, useEffect, useMemo } from "react";
import { calculateSM2 } from "../utils/sm2";

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

export default function useFlashcards({ selectedCategory, shuffleMode }) {
  const [flashcards, setFlashcards] = useState(loadFlashcards);

  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

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

  const reviewCard = (cardId, quality) => {
    setFlashcards((prev) =>
      prev.map((card) =>
        card.id !== cardId
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
  };

  const addNewCard = ({ word, meaning, category }) => {
    if (!word || !meaning) return;

    setFlashcards((prev) => [
      ...prev,
      {
        id: NOW(),
        word,
        meaning,
        category,
        repetitions: 0,
        easeFactor: 2.5,
        interval: 1,
        nextReview: NOW(),
        correctCount: 0,
        wrongCount: 0,
      },
    ]);
  };

  return {
    flashcards,
    readyCards,
    reviewCard,
    addNewCard,
  };
}