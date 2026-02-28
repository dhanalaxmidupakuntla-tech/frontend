import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import Confetti from "react-confetti";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [celebrate, setCelebrate] = useState(false);

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const savedXP = localStorage.getItem("xp");
    if (savedXP) {
      setXp(Number(savedXP));
      setLevel(Math.floor(savedXP / 100) + 1);
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 3000);
    }
  }, []);

  const addXP = () => {
    const newXP = xp + 20;
    setXp(newXP);
    localStorage.setItem("xp", newXP);
    setLevel(Math.floor(newXP / 100) + 1);
  };

  useEffect(() => {
    api.get("/auth/me").then(res => setUser(res.data));
  }, []);

  if (!user) return null;

  const getBadge = () => {
    if (level >= 5) return "🏅 Language Master";
    if (level >= 3) return "🥈 Fast Learner";
    if (level >= 2) return "🥉 Beginner Star";
    return "🌱 Starter";
  };

  return (
    <div className="p-6">
      {celebrate && <Confetti />}
      <h2 className="text-2xl font-bold">Welcome 🎉</h2>

      <div className="mt-6 bg-green-200 p-6 rounded-xl">
        <p>Level: {user.level}</p>
        <p>XP: {user.xp}/100</p>
        <p>🔥 Streak: {user.streak}</p>
      </div>

      <div className="w-full bg-gray-300 rounded h-4 mt-2">
        <div
          className="bg-green-500 h-4 rounded"
          style={{ width: `${xp % 100}%` }}
        ></div>
      </div>

      <div className="bg-green-200 p-6 rounded-xl text-center mb-6">
        <h2 className="text-2xl font-bold">Meet Lingoo 🐼</h2>
        <p>Your fun language buddy!</p>
      </div>

      <div className="mt-6 bg-yellow-200 p-4 rounded-xl text-center">
        <h3 className="text-lg font-bold">⭐ XP Points: {xp}</h3>
        <p>🏆 Level: {level}</p>

        <button
          onClick={addXP}
          className="mt-2 bg-yellow-500 px-4 py-2 rounded text-white"
        >
          Complete Lesson (+20 XP)
        </button>
      </div>

      <div className="mt-4 bg-purple-200 p-4 rounded-xl text-center">
        <h3 className="text-lg font-bold">Your Badge</h3>
        <p className="text-xl">{getBadge()}</p>
      </div>
    </div>
  );
}