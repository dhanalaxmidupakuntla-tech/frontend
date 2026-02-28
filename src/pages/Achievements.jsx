import { useContext } from "react";
import { AchievementContext } from "../context/AchievementContext";

export default function Achievements() {
  const { achievements } = useContext(AchievementContext);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🏅 Achievements</h2>

      {achievements.length === 0 && (
        <p>No achievements yet! Keep learning 🚀</p>
      )}

      {achievements.map((a, i) => (
        <div key={i} className="bg-yellow-200 p-3 rounded mb-2">
          {a}
        </div>
      ))}
    </div>
  );
}