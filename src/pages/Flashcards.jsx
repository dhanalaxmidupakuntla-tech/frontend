import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { XpContext } from "../context/XpContext";

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState(
    JSON.parse(localStorage.getItem("flashcards")) || [
      {
        word: "Hello",
        meaning: "Hola",
        strength: 0,
        reviews: 0,
        nextReview: Date.now(),
      },
      {
        word: "Thanks",
        meaning: "Gracias",
        strength: 0,
        reviews: 0,
        nextReview: Date.now(),
      },
    ]
  );

  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState(false);

  const { addXp } = useContext(XpContext);

  // Filter ready cards
  const readyCards = flashcards.filter((card) => card.nextReview <= Date.now());

  const currentCard = readyCards[index] || null;

  // Load flashcards from API once
  useEffect(() => {
    api.get("/flashcards").then((res) => {
      if (res.data && res.data.length > 0) setFlashcards(res.data);
    });
  }, []);

  // Save flashcards to localStorage whenever they update
  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

  const reviewCard = (difficulty) => {
    if (!currentCard) return;

    const updatedCards = [...flashcards];
    const cardIndex = flashcards.findIndex((c) => c.word === currentCard.word);

    if (cardIndex === -1) return;

    const card = updatedCards[cardIndex];
    card.reviews += 1;

    let interval;
    if (difficulty === "easy") {
      card.strength += 2;
      interval = 1000 * 60 * 60 * 24 * 3; // 3 days
      addXp(15);
    } else if (difficulty === "medium") {
      card.strength += 1;
      interval = 1000 * 60 * 60 * 24 * 1; // 1 day
      addXp(10);
    } else {
      card.strength = Math.max(0, card.strength - 1);
      interval = 1000 * 60 * 10; // 10 minutes
      addXp(5);
    }

    card.nextReview = Date.now() + interval;

    setFlashcards(updatedCards);
    setIndex((prev) => (prev + 1) % readyCards.length);
    setFlip(false);
  };

  if (!currentCard) return <p className="p-6">No flashcards ready for review!</p>;

  return (
    <div className="p-6 text-center">
      <div
        onClick={() => setFlip(!flip)}
        className="bg-pink-200 p-12 rounded-xl cursor-pointer"
      >
        {flip ? currentCard.meaning : currentCard.word}
      </div>

      <div className="w-full bg-gray-200 h-3 rounded mb-4">
        <div
          className="bg-purple-500 h-3 rounded"
          style={{ width: `${(currentCard.strength / 10) * 100}%` }}
        />
      </div>

      <p className="mt-2 text-sm text-gray-600">
        Mastery Level: {currentCard.strength}
      </p>

      <div className="flex gap-3 mt-4 justify-center">
        <button
          onClick={() => reviewCard("easy")}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Easy 😎
        </button>

        <button
          onClick={() => reviewCard("medium")}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Medium 🙂
        </button>

        <button
          onClick={() => reviewCard("hard")}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Hard 😰
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={() => setIndex((i) => (i + 1) % readyCards.length)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}