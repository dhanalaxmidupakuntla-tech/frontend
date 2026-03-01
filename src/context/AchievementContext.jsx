import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const AchievementContext = createContext(null);

export const AchievementProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [achievements, setAchievements] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("achievements")) || [];
    } catch {
      return [];
    }
  });

  // persist achievements
  useEffect(() => {
    localStorage.setItem("achievements", JSON.stringify(achievements));
  }, [achievements]);

  // unlock safely
  const unlockAchievement = (title) => {
    setAchievements(prev => {
      if (prev.includes(title)) return prev;
      return [...prev, title];
    });
  };

  return (
    <AchievementContext.Provider
      value={{
        achievements,
        unlockAchievement,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
};