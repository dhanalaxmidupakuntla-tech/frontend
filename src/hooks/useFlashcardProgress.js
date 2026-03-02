import { useState, useEffect } from "react";

export default function useFlashcardProgress(cardsLength) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [cardsLength]);

  const next = () =>
    setIndex((i) => (i < cardsLength - 1 ? i + 1 : 0));

  const prev = () =>
    setIndex((i) => (i > 0 ? i - 1 : i));

  const progress =
    cardsLength === 0 ? 0 : ((index + 1) / cardsLength) * 100;

  return { index, next, prev, progress };
}