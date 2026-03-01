export default function QuizCard({ question, options, handleAnswer, currentQuestion, totalQuestions, hearts }) {
  return (
    <div className="bg-blue-50 dark:bg-gray-800 p-8 rounded-xl shadow">
      <p className="text-sm mb-2">
        Question {currentQuestion + 1}/{totalQuestions} ❤️ {hearts}
      </p>
      <h3 className="text-xl font-bold mb-6">{question}</h3>
      <div className="space-y-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            className="w-full bg-green-500 text-white p-3 rounded-lg flex justify-between hover:bg-green-600"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}