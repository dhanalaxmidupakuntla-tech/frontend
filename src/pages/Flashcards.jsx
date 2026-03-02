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

  const [flashcards, setFlashcards] = useState(() => {
    const saved = localStorage.getItem("flashcards");
    if (saved) return JSON.parse(saved);

    const now = Date.now();

    return [
      { id: 1, word: "Hello", meaning: "Hola", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 2, word: "Thank you", meaning: "Gracias", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 3, word: "Goodbye", meaning: "Adiós", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 4, word: "Please", meaning: "Por favor", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 5, word: "Yes", meaning: "Sí", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 6, word: "No", meaning: "No", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 7, word: "Good morning", meaning: "Buenos días", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 8, word: "Good night", meaning: "Buenas noches", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 9, word: "How are you?", meaning: "¿Cómo estás?", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 10, word: "I am fine", meaning: "Estoy bien", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 11, word: "What is your name?", meaning: "¿Cómo te llamas?", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 12, word: "My name is...", meaning: "Me llamo...", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 13, word: "Where are you from?", meaning: "¿De dónde eres?", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 14, word: "I don’t understand", meaning: "No entiendo", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
      { id: 15, word: "Can you help me?", meaning: "¿Puedes ayudarme?", repetitions: 0, easeFactor: 2.5, interval: 1, nextReview: now, correctCount: 0, wrongCount: 0 },
    ];
  });

  const [index, setIndex] = useState(0);

  const readyCards = useMemo(() => {
    const now = Date.now();
    return flashcards
      .filter((c) => c.nextReview <= now)
      .sort((a, b) => a.nextReview - b.nextReview); // oldest first
  }, [flashcards]);

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

    const nextDue = flashcards.length
      ? Math.min(...flashcards.map((c) => c.nextReview))
      : null;

    const timeLeft = nextDue ? nextDue - Date.now() : 0;

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    const dueTomorrow = flashcards.filter(
      (c) =>
        c.nextReview > Date.now() &&
        c.nextReview <= Date.now() + 24 * 60 * 60 * 1000
    ).length;

    return (
      <PageWrapper title="Flashcards">
        <div className="max-w-xl mx-auto text-center">

          <h2 className="text-2xl font-bold mb-4">
            🎉 You're done for today!
          </h2>

          {nextDue && (
            <p className="mb-2">
              ⏳ Next review in {hours}h {minutes}m
            </p>
          )}

          <p className="mb-2">
            📅 {dueTomorrow} cards due within 24 hours
          </p>

          <button
            onClick={() => {
              setFlashcards((prev) =>
                prev.map((card) => ({
                  ...card,
                  nextReview: Date.now(),
                }))
              );
            }}
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
          className="mb-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          ⬅ Back
        </button>

        <p className="mb-2 text-blue-600 font-semibold">
          📚 Due Today: {readyCards.length}
        </p>

        {/* Stats */}

        <p className="text-orange-600 font-bold">
          🔥 Streak: {localStorage.getItem("streak") || 0} days
        </p>

        <div className="mt-4">
          {achievements.map((a, i) => (
            <p key={i} className="text-purple-700 font-semibold">
              {a}
            </p>
          ))}
        </div>

        <p className="mb-4 text-sm text-gray-600">
          Card {index + 1} of {readyCards.length}
        </p>
        <div className="w-full bg-gray-300 h-3 rounded-full mb-6">
          <div
            className="bg-green-500 h-3 rounded-full transition-all"
            style={{
              width: `${((index + 1) / readyCards.length) * 100}%`
            }}
          />
        </div>

        <div className="mb-6 p-4 bg-gray-200 rounded">
          <p>Total Cards: {stats.total}</p>
          <p>Accuracy: {stats.accuracy}%</p>
        </div>

        <FlashCardView card={currentCard} />

        <ReviewButtons onReview={reviewCard} />

      </div>
    </PageWrapper>
  );
}