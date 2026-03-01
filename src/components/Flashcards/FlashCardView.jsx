import { useState, useEffect } from "react";

export default function FlashCardView({ card }) {
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    setFlip(false);
  }, [card]);

  if (!card) return null;

  return (
    <div
      onClick={() => setFlip((f) => !f)}
      className="bg-gradient-to-r from-pink-400 to-purple-500 p-16 rounded-2xl cursor-pointer shadow-lg hover:scale-105 transition mb-8"
    >
      <p className="text-center text-4xl font-bold text-white">
        {flip ? card.meaning : card.word}
      </p>
      <p className="text-center text-sm text-white mt-4">
        Click to flip
      </p>
    </div>
  );
}