import Word from "./Word";

const Suggestion = ({ currentSuggestion, onWordAction }) => {
  return (
    <Word
      className="text-gray-500 hover:text-white hover:!bg-green-700"
      word={currentSuggestion}
      onWordAction={onWordAction}
      isSuggestion={true}
    />
  );
};

export default Suggestion;
