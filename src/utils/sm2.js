export const calculateSM2 = (card, quality) => {
  let { repetitions, easeFactor, interval } = card;

  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);

    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor =
    easeFactor +
    (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  if (easeFactor < 1.3) easeFactor = 1.3;

  return {
    repetitions,
    easeFactor,
    interval,
    nextReview: Date.now() + interval * 24 * 60 * 60 * 1000,
  };
};