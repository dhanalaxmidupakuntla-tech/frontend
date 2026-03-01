import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useXp } from "../context/XpContext";
import PageWrapper from "../components/layout/PageWrapper";

export default function AITutor() {
  const topics = [
    "General",
    "Greetings",
    "Food",
    "Travel",
    "Animals",
    "Family",
    "Colors",
    "Numbers",
    "Sports",
  ];

  const quickQuestions = {
    General: ["What is this?", "How do you say hello?", "Teach me a new word"],
    Greetings: ["How to say goodbye?", "How to greet someone?", "Polite phrases"],
    Food: ["Fruits in Spanish", "Vegetables list", "Cooking words"],
    Travel: ["Hotel phrases", "Direction words", "Transportation"],
    Animals: ["Common animals", "Pet names", "Animal sounds"],
    Family: ["Family members", "Relationships", "Family phrases"],
    Colors: ["All colors", "Color adjectives", "Describe colors"],
    Numbers: ["Count 1-10", "Learn 11-20", "Phone numbers"],
    Sports: ["Sports vocabulary", "Games", "Athletic activities"],
  };

  const [topic, setTopic] = useState(topics[0]);
  const [difficulty, setDifficulty] = useState("beginner");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm Lingoo AI 🤖 Choose a topic and let's learn together!" },
  ]);
  const { addXp } = useXp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const chatEndRef = useRef(null);

  // ----- Send message to backend API -----
  const sendMessage = async (quickQuestion = null) => {
    const messageText = quickQuestion || input.trim();
    if (!messageText) return;

    const userMsg = { role: "user", text: messageText };
    setMessages((prev) => [...prev, userMsg]);
    if (!quickQuestion) setInput("");
    setLoading(true);
    setNotice("");

    let replyText = "";
    let xpReward = 5; // base XP
    if (difficulty === "intermediate") xpReward = 10;
    if (difficulty === "advanced") xpReward = 15;

    try {
      const res = await api.post("/ai/chat", {
        message: messageText,
        topic,
        difficulty,
      });

      const data = res.data;
      replyText = data.reply;  // ✅ Axios response
      setNotice("✅ Response from AI provider");
    } catch (err) {
      console.error("Frontend API call failed:", err);

      replyText =
        err.response?.data?.error ||
        "Unable to get response from AI. Please try again.";

      setNotice("❌ AI error");
    }

    // ----- Add AI message and XP -----
    const botMsg = { role: "bot", text: replyText };
    setMessages((prev) => [...prev, botMsg]);

    if (replyText && !replyText.includes("Unable")) {
      addXp(xpReward);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <PageWrapper title="AI Tutor">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">🤖 AI Tutor</h3>

        {/* Topic & Difficulty Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full border-2 border-purple-300 p-2 rounded-lg bg-white dark:bg-gray-700 dark:text-white font-semibold"
            >
              {topics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Difficulty</label>
            <div className="flex gap-2">
              {["beginner", "intermediate", "advanced"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  className={`flex-1 px-3 py-2 rounded-lg font-semibold ${difficulty === lvl
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700"
                    }`}
                >
                  {lvl === "beginner" ? "🌱" : lvl === "intermediate" ? "🌿" : "🌳"}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() =>
              setMessages([{ role: "bot", text: "Hi! I'm Lingoo AI 🤖 Ready to learn? Choose a topic!" }])
            }
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg"
          >
            Clear Chat
          </button>
        </div>

        {/* Quick Questions */}
        {quickQuestions[topic] && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-xs font-semibold mb-2">💡 Quick Questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions[topic].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  className="text-xs bg-blue-500 text-white py-2 px-3 rounded-full"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Status Notice */}
        {notice && (
          <div className="mb-4 text-sm text-yellow-700 bg-yellow-100 p-3 rounded-lg border-l-4 border-yellow-500">
            {notice}
          </div>
        )}

        {/* Chat Messages */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl h-96 overflow-y-auto mb-6 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs px-4 py-3 rounded-xl ${msg.role === "user"
                ? "bg-purple-500 text-white rounded-br-none"
                : "bg-green-200 text-black dark:bg-green-700 dark:text-white rounded-bl-none"
                }`}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-3">
          <input
            className="flex-1 border-2 border-purple-300 p-3 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me anything..."
          />
          <button
            onClick={() => sendMessage()}
            className="bg-purple-600 text-white font-bold px-6 rounded-lg"
            disabled={loading}
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}