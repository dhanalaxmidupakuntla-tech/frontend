import { useState, useEffect } from "react";

const FlashCard = ({ word, meaning }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip when new word comes
  useEffect(() => {
    setIsFlipped(false);
  }, [word]);

  return (
    <div className="flex justify-center items-center">
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative w-72 h-44 cursor-pointer perspective"
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div
            className="absolute w-full h-full bg-yellow-200 dark:bg-yellow-700 rounded-xl shadow-xl flex items-center justify-center text-xl font-bold backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            {word}
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full bg-purple-300 dark:bg-purple-800 text-white rounded-xl shadow-xl flex items-center justify-center text-xl font-bold rotate-y-180"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {meaning}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;