import { useMemo } from "react";

export default function useFlashcardStats(flashcards) {
  return useMemo(() => {
    const total = flashcards.length;

    const correct = flashcards.reduce(
      (sum, c) => sum + (c.correctCount || 0),
      0
    );

    const wrong = flashcards.reduce(
      (sum, c) => sum + (c.wrongCount || 0),
      0
    );

    const accuracy =
      correct + wrong === 0
        ? 0
        : Math.round((correct / (correct + wrong)) * 100);

    return { total, accuracy };
  }, [flashcards]);
}