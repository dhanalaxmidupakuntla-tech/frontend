export default function FlashcardStats({ mastered, weak, totalQuizzes }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h3 className="font-bold mb-2">Flashcard Stats</h3>
      <p>Mastered: {mastered}</p>
      <p>Needs Review: {weak}</p>
      <p>Total Quizzes: {totalQuizzes}</p>
    </div>
  );
}