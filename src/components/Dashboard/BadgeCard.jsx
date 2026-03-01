export default function BadgeCard({ badge }) {
  return (
    <div className="bg-purple-200 dark:bg-purple-700 p-4 rounded-xl text-center">
      <h3 className="text-lg font-bold">Your Badge</h3>
      <p className="text-xl">{badge}</p>
    </div>
  );
}