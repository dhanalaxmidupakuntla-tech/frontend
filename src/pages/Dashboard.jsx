import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import Confetti from "react-confetti";
import { XpContext } from "../context/XpContext";
import { AchievementContext } from "../context/AchievementContext";
import { NavLink } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const { xp, addXp } = useContext(XpContext);
  const { unlockAchievement } = useContext(AchievementContext);

  const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  const mastered = flashcards.filter((c) => c.strength >= 5).length;
  const weak = flashcards.filter((c) => c.strength < 2).length;
  const totalQuizzes = Number(localStorage.getItem("total_quizzes")) || 0;

  const level = Math.floor(xp / 100) + 1;
  const progress = xp % 100;

  // fetch user
  useEffect(() => {
    api.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  // level-up animation
  useEffect(() => {
    if (xp > 0 && xp % 100 === 0) {
      setCelebrate(true);
      setShowLevelUp(true);

      const timer = setTimeout(() => {
        setCelebrate(false);
        setShowLevelUp(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [xp]);

  // daily reward
  useEffect(() => {
    const lastClaim = localStorage.getItem("daily_reward");
    const today = new Date().toDateString();
    if (lastClaim !== today) {
      addXp(20);
      localStorage.setItem("daily_reward", today);
    }
  }, [addXp]);

  // achievements
  useEffect(() => {
    if (xp >= 100) unlockAchievement("Rookie Learner 🐣");
    if (xp >= 300) unlockAchievement("Language Explorer 🌍");
    if (xp >= 500) unlockAchievement("Master Speaker 🧠");
  }, [xp, unlockAchievement]);

  const getBadge = () => {
    if (level >= 5) return "🏅 Language Master";
    if (level >= 3) return "🥈 Fast Learner";
    if (level >= 2) return "🥉 Beginner Star";
    return "🌱 Starter";
  };

  // ✅ Auth guard: show login message if not logged in
  if (user === null) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <p className="text-xl font-semibold text-gray-700">Please login to continue</p>
        <NavLink
          to="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Go to Login
        </NavLink>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {celebrate && <Confetti />}

      {showLevelUp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-yellow-300 p-8 rounded-xl animate-bounce text-2xl font-bold">
            🎉 LEVEL UP! 🚀
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold">Welcome, {user.name} 🎉</h2>

      <div className="bg-green-200 p-6 rounded-xl">
        <p>🏆 Level: {level}</p>
        <p>⭐ XP: {progress}/100</p>
        <p>🔥 Streak: {user.streak}</p>
      </div>

      <div className="w-full bg-gray-200 h-4 rounded">
        <div
          className="bg-purple-500 h-4 rounded transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-yellow-200 p-4 rounded-xl text-center">
        <h3 className="text-lg font-bold">⭐ Total XP: {xp}</h3>
        <button
          onClick={() => addXp(20)}
          className="mt-2 bg-yellow-500 px-4 py-2 rounded text-white"
        >
          Complete Lesson (+20 XP)
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2">Flashcard Stats</h3>
        <p>✅ Mastered: {mastered}</p>
        <p>⚠ Needs Review: {weak}</p>
        <p>📝 Total Quizzes: {totalQuizzes}</p>
      </div>

      <div className="bg-purple-200 p-4 rounded-xl text-center">
        <h3 className="text-lg font-bold">Your Badge</h3>
        <p className="text-xl">{getBadge()}</p>
      </div>
    </div>
  );
}