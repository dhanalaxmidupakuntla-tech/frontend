import React, { useState, useEffect } from "react";
import PageWrapper from "../components/layout/PageWrapper";

const letterData = {
  A: "Apple",
  B: "Ball",
  C: "Cat",
  D: "Dog",
  E: "Elephant",
  F: "Fish",
  G: "Grapes",
  H: "House",
  I: "Ice Cream",
  J: "Jellyfish",
  K: "Kite",
  L: "Lion",
  M: "Monkey",
  N: "Nest",
  O: "Orange",
  P: "Penguin",
  Q: "Queen",
  R: "Rainbow",
  S: "Sun",
  T: "Tiger",
  U: "Umbrella",
  V: "Violin",
  W: "Whale",
  X: "Xylophone",
  Y: "Yo-yo",
  Z: "Zebra",
};

const letters = Object.keys(letterData);

export default function AlphabetQuiz() {
  const [currentLetter, setCurrentLetter] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState("Easy");
  const [questionCount, setQuestionCount] = useState(0);
  const [stars, setStars] = useState("");

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const generateQuestion = () => {
    const randomLetter =
      letters[Math.floor(Math.random() * letters.length)];

    const correctWord = letterData[randomLetter];

    let optionCount = 3;
    if (level === "Medium") optionCount = 4;
    if (level === "Hard") optionCount = 5;

    const wrongOptions = letters
      .filter((l) => l !== randomLetter)
      .sort(() => 0.5 - Math.random())
      .slice(0, optionCount - 1)
      .map((l) => letterData[l]);

    const shuffled = [correctWord, ...wrongOptions].sort(
      () => 0.5 - Math.random()
    );

    setCurrentLetter(randomLetter);
    setOptions(shuffled);
    speak(randomLetter);
  };

  const handleAnswer = (word) => {
    if (word === letterData[currentLetter]) {
      setScore(score + 1);
      setStars("⭐⭐⭐");
      speak("Great job!");
    } else {
      speak("Try again");
    }

    setQuestionCount(questionCount + 1);

    setTimeout(() => {
      setStars("");
      generateQuestion();
    }, 1500);
  };

  useEffect(() => {
    generateQuestion();
  }, [level]);

  return (
    <PageWrapper title="Alphabet Quiz Game">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold mb-2">
          Level: {level}
        </h2>

        <div className="flex justify-center gap-3 mb-4">
          {["Easy", "Medium", "Hard"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setLevel(lvl);
                setScore(0);
                setQuestionCount(0);
              }}
              className={`px-4 py-2 rounded-lg ${
                level === lvl
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <p className="text-2xl font-bold">
          What word starts with:
        </p>

        <h1 className="text-7xl font-bold text-purple-700 mt-2">
          {currentLetter}
        </h1>
      </div>

      <div className="grid gap-4 max-w-md mx-auto">
        {options.map((word, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(word)}
            className="bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl text-xl transition transform hover:scale-105"
          >
            {word}
          </button>
        ))}
      </div>

      <div className="text-center mt-6">
        <p className="text-3xl">{stars}</p>
        <p className="text-xl mt-2">
          Score: {score}
        </p>
        <p className="text-gray-500">
          Questions: {questionCount}
        </p>
      </div>
    </PageWrapper>
  );
}