import { useState } from "react";

export default function SpeakingPractice() {
  const [text, setText] = useState("");

  const recognition = new window.webkitSpeechRecognition();

  recognition.onresult = (event) => {
    setText(event.results[0][0].transcript);
  };

  return (
    <div className="p-6">
      <button
        onClick={() => recognition.start()}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        🎤 Speak
      </button>

      <p className="mt-4">{text}</p>
    </div>
  );
}