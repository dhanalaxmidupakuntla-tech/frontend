import { useState } from "react";

export default function SpeakingPractice() {
  const [text, setText] = useState("");
  const recognition = new window.webkitSpeechRecognition();

  recognition.onresult = (event) => {
    setText(event.results[0][0].transcript);
  };

  const start = () => {
    recognition.start();
  };

  return (
    <div className="p-6">
      <button
        onClick={start}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        🎤 Start Speaking
      </button>
      <p className="mt-4">{text}</p>
    </div>
  );
}