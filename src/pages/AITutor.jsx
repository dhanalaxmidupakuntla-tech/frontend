import { useState } from "react";

export default function AITutor() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I am Lingoo AI 🤖 Ask me a word!" },
  ]);
  const [input, setInput] = useState("");

  const fakeAIResponse = (text) => {
    const responses = {
      hello: "Hola (Spanish), Bonjour (French), Hallo (German)",
      thanks: "Gracias (Spanish), Merci (French)",
    };
    return responses[text.toLowerCase()] || "Great question! Keep learning! 🌟";
  };

  const sendMessage = () => {
    const userMsg = { role: "user", text: input };
    const botMsg = { role: "bot", text: fakeAIResponse(input) };

    setMessages([...messages, userMsg, botMsg]);
    setInput("");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">AI Tutor 🤖</h2>

      <div className="bg-white p-4 rounded-xl h-64 overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === "user" ? "text-right" : ""}`}>
            <span className="bg-purple-200 px-3 py-1 rounded">
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          className="flex-1 border p-2 rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-4 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}