import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { XpContext } from "../context/XpContext";
import PageWrapper from "../components/layout/PageWrapper";
import LessonCard from "../components/Lessons/LessonCard";
import QuizCard from "../components/Lessons/QuizCard";
import MatchGame from "../components/Lessons/MatchGame";
import useSound from "use-sound";
import successSound from "../assets/success.mp3";
import api from "../services/api";

export default function Lessons() {
  const { addXp } = useContext(XpContext);
  const [playSuccess] = useSound(successSound);

  const [quizMode, setQuizMode] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [combo, setCombo] = useState(0);
  const [matchGame, setMatchGame] = useState(false);
  const [matched, setMatched] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const [lessons] = useState([
    {
      language: "Spanish 🇪🇸",
      title: "Basics 1",
      words: [
        { native: "Hola", english: "Hello" },
        { native: "Adiós", english: "Goodbye" },
        { native: "Gracias", english: "Thanks" },
        { native: "Por favor", english: "Please" },
      ],
    },
    {
      language: "French 🇫🇷",
      title: "Greetings",
      words: [
        { native: "Bonjour", english: "Hello" },
        { native: "Au revoir", english: "Goodbye" },
        { native: "Merci", english: "Thanks" },
        { native: "S'il vous plaît", english: "Please" },
      ],
    },
    {
      language: "Hindi 🇮🇳",
      title: "Basic Words",
      words: [
        { native: "नमस्ते", english: "Hello" },
        { native: "धन्यवाद", english: "Thanks" },
        { native: "कृपया", english: "Please" },
      ],
    },
  ]);

  const speakWord = (word) => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(word);
    speech.lang = /[ぁ-んァ-ン]/.test(word)
      ? "ja-JP"
      : /[ऀ-ॿ]/.test(word)
        ? "hi-IN"
        : "es-ES";
    window.speechSynthesis.speak(speech);
  };

  const matchPairs = lessons.flatMap((lesson) =>
    lesson.words.map((w) => ({ word: w.native, match: w.english }))
  );

  const handleAnswer = (option) => {
    if (currentQuestion === questions.length - 1) {
      const finalScore = score + (correct ? 1 : 0);
      setScore(finalScore);
      setQuizFinished(true);
    } else {
      setCurrentQuestion((q) => q + 1);
    }

    if (option === questions[currentQuestion].answer) {
      setScore(score + 1);
      playSuccess();
      setCombo(combo + 1);
      addXp(10 + combo * 2);// 10 XP per correct answer
    } else {
      setHearts(hearts - 1);
      setCombo(0);
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  useEffect(() => {
    localStorage.setItem("quiz_score", score);
  }, [score]);

  useEffect(() => {
    localStorage.setItem("quiz_current", currentQuestion);
  }, [currentQuestion]);

  const completeMatch = () => {
    setMatched(true);
    addXp(20);
  };

  const completeLesson = async (lessonId) => {
    try {
      const res = await api.post("/lessons/complete", { lessonId });
      alert(`+${res.data.xpGain} XP`);
      alert(res.data.message);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  const startRandomQuiz = () => {
    const allWords = lessons.flatMap((lesson) => lesson.words);

    const shuffled = [...allWords].sort(() => 0.5 - Math.random());

    const quizQuestions = shuffled.slice(0, 5).map((word) => {
      const wrongOptions = allWords
        .filter((w) => w.english !== word.english)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((w) => w.english);

      const options = [...wrongOptions, word.english].sort(
        () => 0.5 - Math.random()
      );

      return {
        question: word.native,
        answer: word.english,
        options,
      };
    });

    setQuestions(quizQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setHearts(3);
    setCombo(0);
    setQuizMode(true);
  };

  const finishQuiz = async () => {
    try {
      const xpEarned = score * 10;

      await api.post("/quiz/complete", {
        score,
        xpEarned,
      });

      alert(`Quiz Complete! +${xpEarned} XP`);

    } catch (err) {
      console.log(err);
    }

    resetQuiz();
  };

  const resetQuiz = () => {
    setQuizMode(false);
    setQuizFinished(false);
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setHearts(3);
    setCombo(0);
  };

  return (
    <PageWrapper title="Lessons">
      <div className="flex justify-between items-center mb-6">
        {quizMode ? (
          <Link
            to="/lessons"
            onClick={() => startRandomQuiz(false)}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg font-bold"
          >
            ← Back to Lessons
          </Link>
        ) : (
          <button
            onClick={() => startRandomQuiz()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold"
          >
            🎯 Start Random Quiz

          </button>)}
        <div className="text-lg font-bold text-red-500">❤️ {hearts}</div>
      </div>

      {quizFinished && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold mb-4">🎉 Quiz Finished!</h2>
          <p className="text-lg mb-4">Your Score: {score}/{questions.length}</p>

          <div className="flex justify-center gap-4">
            <button
              onClick={finishQuiz}
              className="bg-green-500 text-white px-6 py-2 rounded-lg"
            >
              Claim XP
            </button>

            <button
              onClick={resetQuiz}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg"
            >
              Back to Lessons
            </button>
          </div>
        </div>
      )}

      {quizMode && questions[currentQuestion] && (
        <QuizCard
          question={questions[currentQuestion].question}
          options={questions[currentQuestion].options}
          handleAnswer={(opt) => {
            const correct = opt === questions[currentQuestion].answer;

            if (correct) {
              setScore((s) => s + 1);
              setCombo((c) => c + 1);
              playSuccess();
              addXp(10 + combo * 2);
            } else {
              setHearts((h) => h - 1);
              setCombo(0);
            }

            if (currentQuestion === questions.length - 1) {
              alert(`Quiz finished! Score: ${score + (correct ? 1 : 0)}`);
              setQuizMode(false);
            } else {
              setCurrentQuestion((q) => q + 1);
            }
          }}
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          hearts={hearts}
        />
      )}

      {matchGame && (
        <MatchGame pairs={matchPairs} completeMatch={completeMatch} matched={matched} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson, i) => (
          <LessonCard
            key={i}
            lesson={lesson}
            speakWord={speakWord}
            completeLesson={() => completeLesson(i)}
          />
        ))}
      </div>
    </PageWrapper>
  );
}