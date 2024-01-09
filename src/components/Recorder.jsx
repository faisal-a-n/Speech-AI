import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Word from "./Word/Word";
import { useEffect, useState } from "react";
import WordOptions from "../enums/WordOptions";
import { WordActions, removeDuplicates } from "../utils/word";
import { buildDialogGPTRequest } from "../utils/ai_generator";
import Suggestion from "./Word/Suggestion";

const Recorder = () => {
  let {
    interimTranscript,
    finalTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [words, setWords] = useState([]);
  const [lastTranscribedIndex, setLastTranscribedIndex] = useState(0);
  const [isReplaceActive, setReplaceActive] = useState(false);
  const [generatedSuggestions] = useState([]);
  const [currentSuggestion, setCurrentSuggestion] = useState();
  let nextWordTimeout;

  const getNewTimeout = (currentTimeout) => {
    if (!currentTimeout) clearTimeout(currentTimeout);
    return setTimeout(() => {
      getNextWord(words.join(" "));
    }, 2 * 1000);
  };

  const getNextWord = async function query(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/ahxt/LiteLlama-460M-1T",
      {
        headers: {
          Authorization: "Bearer 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",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    setCurrentSuggestion(removeDuplicates(data, result[0]?.generated_text));
    return result;
  };
  const getData = async (content) => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large",
      {
        headers: {
          Authorization: "Bearer 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",
        },
        method: "POST",
        body: JSON.stringify(
          buildDialogGPTRequest(generatedSuggestions, [], content)
        ),
      }
    );

    const result = await response.json();
    setCurrentSuggestion(result.generated_text);
    return result;
  };
  useEffect(() => {
    window.getOpenAI = getData;
  }, []);

  useEffect(() => {
    if (!interimTranscript) return;
    setWords((prev) => {
      prev[lastTranscribedIndex] = interimTranscript;
      return prev;
    });
  }, [interimTranscript]);

  useEffect(() => {
    if (!finalTranscript) return;
    setWords((prev) => {
      prev[lastTranscribedIndex] = finalTranscript;
      return prev;
    });
    resetTranscript();
    setLastTranscribedIndex(words.length);
    if (isReplaceActive) setReplaceActive(false);
    getNewTimeout(nextWordTimeout);
  }, [finalTranscript]);

  const onStartListening = () => {
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: false,
    });
  };

  const onWordAction = function (action, wordIndex) {
    let mutations = [...words];
    switch (action) {
      case WordOptions.CLEAR_WORD:
        mutations = WordActions.CLEAR_WORD(mutations, wordIndex);
        setLastTranscribedIndex(words.length - 1);
        break;
      case WordOptions.CLEAR_NEXT:
        mutations = WordActions.CLEAR_NEXT(mutations, wordIndex);
        setLastTranscribedIndex(wordIndex + 1);
        break;
      case WordOptions.REPLACE:
        setReplaceActive(true);
        setLastTranscribedIndex(wordIndex);
        break;
      case WordOptions.ACCEPT:
        mutations.push(currentSuggestion);
        setCurrentSuggestion("");
        setLastTranscribedIndex(words.length + 1);
        break;
      case WordOptions.REJECT:
        setCurrentSuggestion("");
        break;
      default:
        console.log("ACTION not setup", action);
    }
    setWords(mutations);
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }
  return (
    <div>
      <p className="my-5">Microphone: {listening ? "on" : "off"}</p>
      <button className="mx-2" onClick={onStartListening}>
        Start
      </button>
      <button className="mx-2" onClick={SpeechRecognition.stopListening}>
        Stop
      </button>
      <button
        className="mx-2"
        onClick={() => {
          setWords([]);
          setLastTranscribedIndex(0);
          setCurrentSuggestion("");
        }}
      >
        Reset
      </button>
      {isReplaceActive && (
        <button
          className="mx-2 bg-red-600"
          onClick={() => {
            setReplaceActive(false);
            setLastTranscribedIndex(words.length);
          }}
        >
          Cancel Replace
        </button>
      )}

      <div
        style={{
          maxWidth: "600px",
          textAlign: "left",
          wordWrap: "break-word",
        }}
        className="mt-5"
      >
        <div className="mb-[4px]">Transcript:</div>
        {words.map((word, index) => {
          return (
            <Word
              key={index}
              word={word}
              onWordAction={onWordAction}
              wordIndex={index}
            />
          );
        })}
        {currentSuggestion && (
          <Suggestion
            className="text-gray-500"
            currentSuggestion={currentSuggestion}
            onWordAction={onWordAction}
          />
        )}
      </div>
    </div>
  );
};
export default Recorder;
