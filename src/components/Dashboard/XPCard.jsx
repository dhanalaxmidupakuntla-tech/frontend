export default function XPCard({ xp, progress, kidMode }) {
  return (
    <div className="bg-yellow-200 dark:bg-yellow-700 p-6 rounded-xl shadow-lg hover:scale-105 transform transition duration-300">
      <p className="font-bold text-lg">XP</p>
      <p className="text-2xl">{xp}</p>
      <div className="w-full bg-gray-300 h-2 rounded mt-2">
        <div
          className={`h-2 rounded transition-all duration-500 ${kidMode ? "bg-pink-500" : "bg-purple-500"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}