import { useState, useRef, useEffect } from "react";
import { useXp } from "../context/XpContext";
import PageWrapper from "../components/layout/PageWrapper";
import api from "../services/api";

const phrases = [
  "Hello",
  "Thank you",
  "How are you",
  "Good morning",
  "I love learning",
];

export default function SpeakingPractice() {
  const [text, setText] = useState("");
  const [score, setScore] = useState(0);
  const [aiScore, setAiScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const { addXp } = useXp();
  const recognitionRef = useRef(null);

  /* =========================
     SPEECH RECOGNITION SETUP
  ========================= */
  useEffect(() => {
    if (!recognitionRef.current && window.webkitSpeechRecognition) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
        await evaluateWithAI(transcript);
      };

      recognitionRef.current.onstart = () => setListening(true);
      recognitionRef.current.onend = () => setListening(false);
      recognitionRef.current.onerror = () => setListening(false);
    }
  }, []);

  /* =========================
     START / STOP LISTENING
  ========================= */
  const startListening = () => {
    setText("");
    setFeedback("");
    setAiScore(null);

    if (recognitionRef.current && !listening) {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch (err) {
        console.warn("Speech recognition error:", err);
        setListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
    }
  };

  /* =========================
     AI EVALUATION (BACKEND)
  ========================= */
  const evaluateWithAI = async (spokenText) => {
    const target = phrases[currentPhraseIndex];

    try {
      setLoadingAI(true);

      const res = await api.post("/ai/evaluate-speech", {
        target,
        spoken: spokenText,
        language: "English",
      });

      const { correct, score, feedback } = res.data;

      setAiScore(score);
      setFeedback(feedback);

      if (correct) {
        setScore((s) => s + 1);
        addXp(score); // XP based on pronunciation score
      }
    } catch (err) {
      console.error("AI evaluation failed:", err);
      setFeedback("AI evaluation failed. Try again.");
    } finally {
      setLoadingAI(false);
    }
  };

  /* =========================
     NEXT PHRASE
  ========================= */
  const nextPhrase = () => {
    setText("");
    setFeedback("");
    setAiScore(null);
    setCurrentPhraseIndex((i) => (i + 1) % phrases.length);
  };

  return (
    <PageWrapper title="Speaking Practice">
      <div className="p-6 bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">🎙 Speaking Practice</h2>

        <p className="mb-2">Repeat this phrase:</p>
        <div className="mb-4 font-semibold text-lg text-blue-600">
          "{phrases[currentPhraseIndex]}"
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={startListening}
            disabled={listening}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {listening ? "Listening..." : "🎤 Speak"}
          </button>

          <button
            onClick={stopListening}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Stop
          </button>

          <button
            onClick={nextPhrase}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </div>

        <p className="mt-2">
          <strong>You said:</strong> {text}
        </p>

        {loadingAI && <p className="mt-2 text-yellow-500">Evaluating...</p>}

        {aiScore !== null && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
            <p>
              ⭐ <strong>AI Score:</strong> {aiScore}/10
            </p>
            <p>
              💬 <strong>Feedback:</strong> {feedback}
            </p>
          </div>
        )}

        <p className="mt-4 font-bold">🏆 Total Correct: {score}</p>
      </div>
    </PageWrapper>
  );
}