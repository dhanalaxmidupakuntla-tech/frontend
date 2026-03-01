export default function LevelCard({ level }) {
  return (
    <div className="bg-green-200 dark:bg-green-700 p-6 rounded-xl shadow-lg hover:scale-105 transform transition duration-300">
      <p className="font-bold text-lg">Level</p>
      <p className="text-2xl">{level}</p>
    </div>
  );
}