import PropTypes from "prop-types";
import styled from "styled-components";
import { SuggestionWordActionIcons, WordActionIcons } from "./Options";

const Word = ({
  className,
  word,
  wordIndex,
  setReplaceActive,
  onWordAction,
  isSuggestion = false,
}) => {
  return (
    <StyledWord isSuggestion={isSuggestion}>
      <div className={className}>{word}</div>
      <StyledOptions
        setReplaceActive={setReplaceActive}
        onWordAction={onWordAction}
        wordIndex={wordIndex}
        WordActions={isSuggestion ? SuggestionWordActionIcons : WordActionIcons}
      ></StyledOptions>
    </StyledWord>
  );
};

const WordOptions = ({ className, onWordAction, wordIndex, WordActions }) => {
  return (
    <div className={className}>
      {Object.keys(WordActions).map((action, index) => {
        return (
          <span
            key={index}
            className="w-5 h-5 cursor-pointer"
            onClick={() => {
              onWordAction(action, wordIndex);
            }}
          >
            {WordActions[action].icon}
          </span>
        );
      })}
    </div>
  );
};

Word.prototype = {
  word: PropTypes.string,
  className: PropTypes.string,
};

const StyledWord = styled.div`
  padding: 5px 2px;
  margin-bottom: 20px;
  display: inline;
  max-width: 200px;
  position: relative;
  &:hover div:first-child {
    background: ${(props) => (props.isSuggestion ? "#15803D" : "blue")};
    color: white;
    border-radius: 10px;
    padding: 8px 9px;
  }
`;

const StyledOptions = styled(WordOptions)`
  position: absolute;
  bottom: -30px;
  right: 0px;
  width: fit-content;
  display: none;
  background: black;
  padding: 5px;
  border-radius: 10px;
  gap: 10px;
  font-size: 10px;
  z-index: 1000;
  ${StyledWord}:hover & {
    display: flex;
  }
  &:hover {
    display: flex;
  }
`;

const StyledWordWrapper = styled(Word)`
  display: inline-block;
`;

export default StyledWordWrapper;
