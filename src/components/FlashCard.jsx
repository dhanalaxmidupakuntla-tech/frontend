import { useState } from "react";

const FlashCard = ({ word, meaning }) => {
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    const loadFlashcards = async () => {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("flashcards")
          .eq("id", user.id)
          .single();

        if (data?.flashcards) {
          setFlashcards(data.flashcards);
        }
      }
    };

    loadFlashcards();
  }, [user]);

  return (
    <div
      onClick={() => setFlip(!flip)}
      className="cursor-pointer bg-yellow-200 p-10 rounded-xl text-center shadow-xl"
    >
      {flip ? meaning : word}
    </div>
  );
};

export default FlashCard;