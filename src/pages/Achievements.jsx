import { useContext } from "react";
import { AchievementContext } from "../context/AchievementContext";
import PageWrapper from "../components/layout/PageWrapper";

export default function Achievements() {
  const { achievements } = useContext(AchievementContext);

  return (
    <PageWrapper title="Achievements">
      <div className="max-w-2xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-center">🏅 Your Achievements</h3>

        {achievements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">No achievements yet!</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Keep learning to earn badges!</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((a, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-yellow-200 to-amber-200 dark:from-yellow-700 dark:to-amber-700 p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:scale-105"
            >
              <p className="text-2xl mb-2">🏆</p>
              <p className="font-bold text-lg text-gray-800 dark:text-white">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
