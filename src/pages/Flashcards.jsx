import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import FlashCardView from "../components/flashcards/FlashCardView";
import ReviewButtons from "../components/flashcards/ReviewButtons";
import useFlashcardStats from "../hooks/useFlashcardStats";
import useFlashcards from "../hooks/useFlashcards";
import useFlashcardProgress from "../hooks/useFlashcardProgress";
import useUserLevel from "../hooks/useUserLevel";
import { XpContext } from "../context/XpContext";

export default function Flashcards() {
  const navigate = useNavigate();
  const { addXp } = useContext(XpContext);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [shuffleMode, setShuffleMode] = useState(false);

  const [newWord, setNewWord] = useState("");
  const [newMeaning, setNewMeaning] = useState("");
  const [newCategory, setNewCategory] = useState("Basics");

  const { readyCards, reviewCard, addNewCard, flashcards } =
    useFlashcards({ selectedCategory, shuffleMode });

  const stats = useFlashcardStats(flashcards);
  const level = useUserLevel(stats.accuracy);

  const { index, next, prev, progress } =
    useFlashcardProgress(readyCards.length);

  const currentCard = readyCards[index];

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

        <div className="font-bold text-purple-700 mb-3">
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

        <p className="text-sm mb-2">
          Card {index + 1} of {readyCards.length}
        </p>

        <div className="bg-gray-300 h-3 rounded-full mb-6">
          <div
            className="bg-green-500 h-3 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <FlashCardView card={currentCard} />

        <ReviewButtons
          onReview={(q) => {
            reviewCard(currentCard.id, q);
            addXp(q * 5);
            next();
          }}
        />

        <div className="flex gap-2 mt-4">
          <button onClick={prev} className="btn-gray">⬅ Prev</button>
          <button onClick={next} className="btn-blue">Next ➡</button>
        </div>

      </div>
    </PageWrapper>
  );
}