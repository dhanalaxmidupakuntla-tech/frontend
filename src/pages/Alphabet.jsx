import React, { useState, useEffect } from "react";
import PageWrapper from "../components/layout/PageWrapper";

const letterData = {
  A: { phonics: "Ah", en: "Apple", es: "Manzana" },
  B: { phonics: "Buh", en: "Ball", es: "Pelota" },
  C: { phonics: "Cuh", en: "Cat", es: "Gato" },
  D: { phonics: "Duh", en: "Dog", es: "Perro" },
  E: { phonics: "Eh", en: "Elephant", es: "Elefante" },
  F: { phonics: "Fuh", en: "Fish", es: "Pez" },
  G: { phonics: "Guh", en: "Grapes", es: "Uvas" },
  H: { phonics: "Huh", en: "House", es: "Casa" },
  I: { phonics: "Ih", en: "Ice Cream", es: "Helado" },
  J: { phonics: "Juh", en: "Jellyfish", es: "Medusa" },
  K: { phonics: "Kuh", en: "Kite", es: "Cometa" },
  L: { phonics: "Luh", en: "Lion", es: "León" },
  M: { phonics: "Muh", en: "Monkey", es: "Mono" },
  N: { phonics: "Nuh", en: "Nest", es: "Nido" },
  O: { phonics: "Oh", en: "Orange", es: "Naranja" },
  P: { phonics: "Puh", en: "Penguin", es: "Pingüino" },
  Q: { phonics: "Quh", en: "Queen", es: "Reina" },
  R: { phonics: "Ruh", en: "Rainbow", es: "Arcoíris" },
  S: { phonics: "Sss", en: "Sun", es: "Sol" },
  T: { phonics: "Tuh", en: "Tiger", es: "Tigre" },
  U: { phonics: "Uh", en: "Umbrella", es: "Paraguas" },
  V: { phonics: "Vuh", en: "Violin", es: "Violín" },
  W: { phonics: "Wuh", en: "Whale", es: "Ballena" },
  X: { phonics: "Xuh", en: "Xylophone", es: "Xilófono" },
  Y: { phonics: "Yuh", en: "Yo-yo", es: "Yo-yo" },
  Z: { phonics: "Zzz", en: "Zebra", es: "Cebra" },
};

export default function Alphabet() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const [selected, setSelected] = useState(null);

  const speak = (text, lang = "en-US", delay = 0) => {
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.7; // slow for kids
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }, delay);
  };

  const speakSequence = (letter) => {
    window.speechSynthesis.cancel();

    speak(letter, "en-US", 0);                 // Say letter
    speak(letterData[letter].phonics, "en-US", 800); // Say phonics
    speak(letterData[letter].en, "en-US", 1600);     // English word
    speak(letterData[letter].es, "es-ES", 3000);     // Spanish word
  };

  useEffect(() => {
    if (selected) {
      speakSequence(selected);
    }
  }, [selected]);

  return (
    <PageWrapper title="Alphabet Learning">
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-8">
        {letters.map((l) => (
          <button
            key={l}
            onClick={() => setSelected(l)}
            className="aspect-square border-2 border-purple-300 bg-purple-50 rounded-xl text-3xl font-bold text-purple-700 hover:scale-110 transition"
          >
            {l}
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm text-center relative">
            <button
              className="absolute top-3 right-3 text-2xl"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>

            <h3 className="text-6xl font-bold mb-2 text-purple-700">
              {selected}
            </h3>

            <p className="text-lg text-gray-500 mb-4">
              Sound: <strong>{letterData[selected].phonics}</strong>
            </p>

            <div className="mb-4">
              <p className="text-xl font-bold text-blue-600">
                🇺🇸 {letterData[selected].en}
              </p>
              <p className="text-xl font-bold text-pink-600">
                🇪🇸 {letterData[selected].es}
              </p>
            </div>

            <button
              onClick={() => speakSequence(selected)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
            >
              🔊 Play Again
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}