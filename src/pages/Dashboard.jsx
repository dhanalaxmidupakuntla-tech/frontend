import { useContext, useEffect, useState, useRef } from "react";
import { useKidMode } from "../context/KidModeContext";
import { useTheme } from "../context/ThemeContext";
import { XpContext } from "../context/XpContext";
import { AchievementContext } from "../context/AchievementContext";
import { NavLink } from "react-router-dom";
import useSound from "use-sound";
import successSound from "../assets/success.mp3";
import Confetti from "react-confetti";

import PageWrapper from "../components/layout/PageWrapper";
import LevelCard from "../components/dashboard/LevelCard";
import XPCard from "../components/dashboard/XPCard";
import StreakCard from "../components/dashboard/StreakCard";
import BadgeCard from "../components/dashboard/BadgeCard";
import FlashcardStats from "../components/dashboard/FlashcardStats";

import api from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const { xp } = useContext(XpContext);

  const { kidMode, toggleKidMode } = useKidMode();
  const { theme, toggleTheme } = useTheme();
  const { unlockAchievement } = useContext(AchievementContext);

  const flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
  const mastered = flashcards.filter((c) => c.strength >= 5).length;
  const weak = flashcards.filter((c) => c.strength < 2).length;
  const totalQuizzes = Number(localStorage.getItem("total_quizzes")) || 0;

  const level = user?.level || 1;
  const progress = user?.xp || 0;

  const [play] = useSound(successSound, { volume: 0.5 });
  const prevXpRef = useRef(xp);

  const claimDailyReward = async () => {
    try {
      const res = await api.post("/reward");
      alert(res.data.message);
      const updated = await api.get("/auth/me");
      setUser(updated.data);
    } catch (err) {
      alert(err.response?.data?.message || "Already claimed");
    }
  };

  // fetch user
  useEffect(() => {
    api.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  // XP animations
  const prevXpRef2 = useRef(xp);
  useEffect(() => {
    if (xp > prevXpRef2.current) {
      setCelebrate(true);
      const timer = setTimeout(() => setCelebrate(false), 1500);
      if (xp % 100 === 0) {
        setShowLevelUp(true);
        const lvlTimer = setTimeout(() => setShowLevelUp(false), 3000);
        return () => {
          clearTimeout(timer);
          clearTimeout(lvlTimer);
        };
      }
      return () => clearTimeout(timer);
    }
    prevXpRef2.current = xp;
  }, [xp]);

  // play sound on XP increase
  useEffect(() => {
    if (xp > prevXpRef.current) play();
    prevXpRef.current = xp;
  }, [xp, play]);

  // achievements
  useEffect(() => {
    if (xp >= 100) unlockAchievement("Rookie Learner");
    if (xp >= 300) unlockAchievement("Language Explorer");
    if (xp >= 500) unlockAchievement("Master Speaker");
  }, [xp, unlockAchievement]);

  const getBadge = () => {
    if (level >= 5) return "Language Master";
    if (level >= 3) return "Fast Learner";
    if (level >= 2) return "Beginner Star";
    return "Starter";
  };

  const getNextLevelTip = (lvl) => {
    if (lvl < 2) return "Try the flashcards to build your vocabulary!";
    if (lvl < 4) return "Check out the AI Tutor or take a lesson.";
    if (lvl < 6) return "Practice speaking with the tutor.";
    return "Keep exploring! Maybe add your own flashcards!";
  };

  if (user === null) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Please login to continue
        </p>
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
    <PageWrapper title="Dashboard">
      {celebrate && <Confetti />}

      {showLevelUp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-yellow-300 p-8 rounded-xl animate-bounce text-2xl font-bold">
            LEVEL UP! 🎉 You are now level {level}!
          </div>
        </div>
      )}

      <div className="flex items-center justify-between space-x-4 mb-6">
        <h2 className="text-2xl font-bold">Welcome, {user.name}</h2>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={kidMode} onChange={toggleKidMode} />
            <span className="text-sm">Kid mode</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} />
            <span className="text-sm">Dark mode</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <LevelCard level={level} />
        <XPCard xp={xp} progress={progress} kidMode={kidMode} />
        <StreakCard streak={user.streak} />
      </div>

      <div className="bg-blue-100 dark:bg-blue-800 p-4 rounded-md mb-6">
        <strong>Next Level Tip:</strong> {getNextLevelTip(level)}
      </div>

      <div className="bg-yellow-200 dark:bg-yellow-700 p-4 rounded-xl text-center mb-6">
        <h3 className="text-lg font-bold">Total XP: {user?.total_xp}</h3>
        <div className="mt-2 flex justify-center gap-2">
          <button
            onClick={claimDailyReward}
            className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600"
          >
            🎁 Claim Daily Reward
          </button>
        </div>
      </div>

      <FlashcardStats mastered={mastered} weak={weak} totalQuizzes={totalQuizzes} />
      <BadgeCard badge={getBadge()} />
    </PageWrapper>
  );
}