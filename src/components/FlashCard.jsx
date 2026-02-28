import { useState } from "react";

const FlashCard = ({ word, meaning }) => {
  const [flip, setFlip] = useState(false);

  return (
    <div
      onClick={() => setFlip(!flip)}
      className="cursor-pointer bg-yellow-200 p-10 rounded-xl text-center shadow-xl"
    >
      {flip ? meaning : word}
    </div>
  );
};

export default FlashCard;