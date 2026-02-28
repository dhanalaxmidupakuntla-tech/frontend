import { useEffect, useState } from "react";
import api from "../services/api";

export default function Lessons() {
  const [lessons, setLessons] = useState([
      {
      language: "Spanish 🇪🇸",
      title: "Basics 1",
      words: ["Hola", "Adiós", "Gracias", "Por favor"],
    },
    {
      language: "French 🇫🇷",
      title: "Greetings",
      words: ["Bonjour", "Au revoir", "Merci", "S'il vous plaît"],
    },
    {
      language: "German 🇩🇪",
      title: "Starter",
      words: ["Hallo", "Tschüss", "Danke", "Bitte"],
    },
    {
      language: "Japanese 🇯🇵",
      title: "Basics",
      words: ["こんにちは", "ありがとう", "さようなら"],
    },
    {
      language: "Hindi 🇮🇳",
      title: "Basic Words",
      words: ["नमस्ते", "धन्यवाद", "अलविदा"],
    },
  ]);

  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);

  const questions = [
    { question: "Hola means?", options: ["Hello", "Bye", "Thanks"], answer: "Hello" },
    { question: "Bonjour means?", options: ["Please", "Hello", "Sorry"], answer: "Hello" },
  ];

  const handleAnswer = (option) => {
    if (option === questions[currentQuestion].answer) {
      setScore(score + 1);
    }else {
      setHearts(hearts - 1);
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  useEffect(() => {
    api.get("/lessons").then(res => setLessons(res.data));
  }, []);

  const complete = async (id) => {
    await api.post("/lessons/complete", { lessonId: id });
    alert("Lesson Completed 🎉");
  };

  const speakWord = (word) => {
    const speech = new SpeechSynthesisUtterance(word);
    speech.lang = "es-ES";
    window.speechSynthesis.speak(speech);
  };

  const [matchGame, setMatchGame] = useState(false);

  const pairs = [
    { word: "Hola", match: "Hello" },
    { word: "Gracias", match: "Thanks" },
  ];

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <button
        onClick={() => setQuizMode(!quizMode)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {quizMode ? "Back to Lessons" : "Start Quiz 🎯"}
      </button>

      <div className="mb-4">
      ❤️ Hearts: {hearts}
    </div>

      {quizMode && currentQuestion < questions.length && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold mb-4">
            {questions[currentQuestion].question}
          </h3>

          {questions[currentQuestion].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="block w-full bg-green-300 p-2 rounded mb-2"
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setMatchGame(!matchGame)}
        className="bg-purple-500 text-white px-4 py-2 rounded mt-4"
      >
        Matching Game 🧩
      </button>

      {matchGame && (
        <div className="mt-4 bg-blue-100 p-4 rounded">
          {pairs.map((p, i) => (
            <div key={i} className="mb-2">
              {p.word} → {p.match}
            </div>
          ))}
        </div>
      )}

      {lessons.map((l, index) => (
        <div key={index} className="bg-yellow-200 p-6 rounded-xl">
          <h3 className="font-bold">{l.title}</h3>
          {l.words.map((word, wordIndex) => (
            <span key={wordIndex} onClick={() => speakWord(word)} className="cursor-pointer hover:text-purple-600 block">
              {word} 🔊
            </span>
          ))}
          <button
            onClick={() => complete(index)}
            className="mt-3 bg-purple-600 text-white px-3 py-1 rounded"
          >
            Complete 🎁
          </button>
        </div>
      ))}<br />
    </div>
  );
}