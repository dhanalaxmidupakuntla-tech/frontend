import WordButton from "./WordButton";

export default function LessonCard({ lesson, speakWord, completeLesson }) {
  return (
    <div className="bg-yellow-100 dark:bg-yellow-800 content-center flex flex-col items-center p-6 rounded-xl shadow hover:shadow-2xl transition duration-300">
      <h3 className="font-bold text-lg mb-2">{lesson.language}</h3>
      <p className="text-sm mb-2">{lesson.title}</p>

      {lesson.words.map((w, i) => (
        <div key={i} className="mb-2">
          <WordButton word={w} speakWord={speakWord} />
        </div>
      ))}

      <button
        onClick={completeLesson}
        className="w-50 bg-purple-600 text-white py-2
         rounded-lg hover:bg-purple-700 transition"
      >
        ✅ Complete Lesson
      </button>
    </div>
  );
}