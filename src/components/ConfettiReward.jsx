import Confetti from "react-confetti";
import { useState } from "react";

function LevelUp() {
  const [show, setShow] = useState(true);

  return (
    <>
      {show && <Confetti />}
      <div className="text-center text-3xl font-bold">
        🎉 LEVEL UP! 🎉
      </div>
    </>
  );
}