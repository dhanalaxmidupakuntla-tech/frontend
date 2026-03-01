export default function MatchGame({ pairs, completeMatch, matched }) {
  return (
    <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-xl mb-6">
      <h3 className="font-bold mb-4">Match the words</h3>
      {pairs.map((p, i) => (
        <div
          key={i}
          className="flex justify-between bg-white dark:bg-gray-700 p-3 rounded mb-2"
        >
          <span>🔊 {p.word}</span>
          <span>↔</span>
          <span className="font-semibold">{p.match}</span>
        </div>
      ))}
      {!matched && (
        <button
          onClick={completeMatch}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          ✅ Finish Match (+20 XP)
        </button>
      )}
    </div>
  );
}