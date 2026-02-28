import { useEffect, useState } from "react";
import api from "../services/api";

export default function Flashcards() {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    api.get("/flashcards").then(res => setCards(res.data));
  }, []);

  if (!cards.length) return null;

  const card = cards[index];

  return (
    <div className="p-6 text-center">
      <div
        onClick={() => setFlip(!flip)}
        className="bg-pink-200 p-12 rounded-xl cursor-pointer"
      >
        {flip ? card.meaning : card.word}
      </div>

      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={() => setIndex((i) => i+1)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}