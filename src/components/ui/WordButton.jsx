export default function WordButton({ word, speakWord }) {
  return (
    <button
      onClick={() => speakWord(word.native)}
      className="flex justify-between w-full bg-white dark:bg-gray-700 p-2 mb-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200"
    >
      <span>🔊 {word.native}</span>
      <span className="text-gray-500 font-semibold hover:text-black dark:hover:text-white">
        {word.english}
      </span>
    </button>
  );
}