import { useState, useEffect, useRef } from "react";
import api from "../services/api"; // your axios instance
import { useXp } from "../context/XpContext";

// fallback to OpenAI directly from the client when the backend is unreachable
// If an API key is configured it calls the OpenAI API; otherwise it returns a
// polite canned response so the chat UI still feels responsive.
async function openAiFallback(prompt) {
  const key = import.meta.env.VITE_OPENAI_API_KEY;
  if (!key) {
    return "Sorry, I'm having trouble connecting to the AI right now.";
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are Lingoo AI, a friendly language tutor." },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${errText}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
}

export default function AITutor() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I am Lingoo AI 🤖 Ask me a word!" },
  ]);
  const { addXp } = useXp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    let replyText = "";

    try {
      // send both properties in case the server expects `prompt` instead of `message`
      const res = await api.post("/ai/chat", { message: input, prompt: input });
      replyText = res.data.reply;
    } catch (err) {
      console.error("AI request failed:", err);

      // if the server sent back a message, log it for debugging but don't
      // necessarily expose raw text to the user (could contain sensitive data).
      if (err.response?.data) {
        const serverMsg =
          err.response.data.error || err.response.data.message || JSON.stringify(err.response.data);
        console.warn("Server response:", serverMsg);
        if (!replyText) replyText = "Service unavailable – please try again later.";
      }

      // if backend returned a 500 we attempt a client-side call directly to OpenAI
      if (err.response?.status === 500) {
        try {
          // openAiFallback always returns something sensible, so we can assign
          // the result directly.
          replyText = await openAiFallback(input);
        } catch (fallbackErr) {
          console.error("OpenAI fallback failed:", fallbackErr);
          // fall through to the generic message below
        }
      }

      if (!replyText) {
        replyText = "Oops! AI is not responding 😢";
      }
    } finally {
      setLoading(false);
    }

    const botMsg = { role: "bot", text: replyText };
    setMessages((prev) => [...prev, botMsg]);

    if (replyText && replyText !== "Oops! AI is not responding 😢") {
      // Award XP only if we got a real answer
      addXp(5);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // scroll to bottom whenever a new message is added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">AI Tutor 🤖</h2>

      <div className="bg-white p-4 rounded-xl h-64 overflow-y-auto mb-4 flex flex-col gap-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <span className={`px-3 py-1 rounded ${msg.role === "user" ? "bg-purple-200" : "bg-green-200"}`}>
              {msg.text}
            </span>
          </div>
        ))}
        {/* dummy div used for scrolling */}
        <div ref={chatEndRef} />
      </div>

      <div className="flex">
        <input
          className="flex-1 border p-2 rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a word..."
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-4 rounded-r"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}