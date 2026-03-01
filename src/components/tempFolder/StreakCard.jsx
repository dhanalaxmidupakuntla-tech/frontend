export default function StreakCard({ streak }) {
  return (
    <div className="bg-blue-200 dark:bg-blue-700 p-6 rounded-xl shadow-lg hover:scale-105 transform transition duration-300">
      <p className="font-bold text-lg">Streak</p>
      <p className="text-2xl">{streak}</p>
    </div>
  );
}