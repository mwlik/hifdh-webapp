import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as Minus } from "../assets/minus.svg";
import { ReactComponent as Pause } from "../assets/pause.svg";
import { ReactComponent as Record } from "../assets/record.svg";
import { ReactComponent as Show } from "../assets/show.svg";
import { ReactComponent as Hide } from "../assets/hide.svg";
import Modal from "react-modal";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import formatInput from "../utils/formatInput";

interface Props {
  fileTitle: string;
  fileContent: string;
  onRemoveFile: () => void;
}

Modal.setAppElement("#root");

export default function FileItem({
  fileTitle,
  fileContent,
  onRemoveFile,
}: Props) {
  const correctedArea = useRef<HTMLDivElement>(null);
  const enteredArea = useRef<HTMLAreaElement>(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isShowContent, setIsShowContent] = useState(false);
  const [typedText, setTypedText] = useState("");
  const { listening, finalTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    if (isRecording) {
      SpeechRecognition.startListening({ language: "ar" });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [isRecording]);

  useEffect(() => {
    if (!listening && isRecording)
      SpeechRecognition.startListening({ language: "ar" });
  }, [isRecording, listening]);

  useEffect(() => {
    setTypedText((typedText) => {
      if (typedText === "") return finalTranscript;
      else return typedText + " " + finalTranscript;
    });
  }, [finalTranscript]);

  useEffect(() => {
    setTypedText((typedText) => formatInput(typedText));
    correctedArea.current?.scrollTo(0, correctedArea.current.scrollHeight);
    enteredArea.current?.scrollTo(0, enteredArea.current.scrollHeight);
  }, [typedText]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTypedText(event.target.value);
  };

  const getHighlightedText = (
    original: string,
    typed: string
  ): JSX.Element[] => {
    if (typed === "") return [<span key={0}></span>];

    const originalWords = original.split(" ");
    const typedWords = typed.split(" ");

    return typedWords.map((word, index) => {
      if (
        index === typedWords.length - 1 &&
        word.length !== originalWords[index]?.length
      )
        return <span key={index}></span>;
      if (word === originalWords[index]) {
        return <span key={index}>{word} </span>;
      } else if (word !== "")
        return (
          <span key={index} style={{ color: "var(--error-color)" }}>
            {originalWords[index]}{" "}
          </span>
        );
      else return <span key={index}></span>;
    });
  };

  function openModal() {
    setIsOpen(true);
    setTypedText("");
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <h2 onClick={openModal}>{fileTitle}</h2> <Minus onClick={onRemoveFile} />
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0, 0, 0, 0)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "min(375px, 95%)",
            height: "auto",
            border: "1px solid var(--second-beige)",
            borderRadius: "20px",
          },
        }}
        contentLabel="مراجعة النص"
      >
        <form className="add-file-form">
          <div className="file-title-input">
            <label>{fileTitle}</label>
          </div>
          <div className="response-input">
            <div className="corrected-text-input" ref={correctedArea}>
              {isShowContent
                ? fileContent
                : getHighlightedText(fileContent, typedText)}
            </div>
            <textarea
              // @ts-ignore
              ref={enteredArea}
              className="entered-text-input"
              value={typedText}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-btns">
            <label>
              {isShowContent ? (
                <Hide onClick={() => setIsShowContent(false)} />
              ) : (
                <Show onClick={() => setIsShowContent(true)} />
              )}
            </label>
            {browserSupportsSpeechRecognition && (
              <label>
                {isRecording ? (
                  <Pause onClick={() => setIsRecording(false)} />
                ) : (
                  <Record onClick={() => setIsRecording(true)} />
                )}
              </label>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
}
