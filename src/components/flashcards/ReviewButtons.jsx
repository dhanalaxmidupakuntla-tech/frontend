export default function ReviewButtons({ onReview }) {
  return (
    <div className="grid grid-cols-6 gap-2 mb-6">
      {[0, 1, 2, 3, 4, 5].map((q) => (
        <button
          key={q}
          onClick={() => onReview(q)}
          className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          {q}
        </button>
      ))}
    </div>
  );
}