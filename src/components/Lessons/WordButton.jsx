const WordButton = ({ word, speakword }) => {
  return (
    <button
      onClick={() => speakword?.(word)}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
    >
      {word.native} - {word.english}
    </button>
  );
};

export default WordButton;