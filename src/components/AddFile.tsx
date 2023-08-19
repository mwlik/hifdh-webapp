import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { ReactComponent as Plus } from "../assets/plus.svg";
import { ReactComponent as Record } from "../assets/record.svg";
import { ReactComponent as Done } from "../assets/done.svg";
import { ReactComponent as Pause } from "../assets/pause.svg";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import formatInput from "../utils/formatInput";

interface Props {
  onAddFile: (fileTitle: string, fileContent: string) => void;
}

Modal.setAppElement("#root");

export default function FileItem({ onAddFile }: Props) {
  let fileTitleEl = useRef<HTMLInputElement>(null);
  const [fileTitle, setFileTitle] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
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
    setFileContent((fileContent) => {
      if (fileContent === "") return finalTranscript;
      else return fileContent + " " + finalTranscript;
    });
  }, [finalTranscript]);

  useEffect(
    () => setFileContent((fileContent) => formatInput(fileContent)),
    [fileContent]
  );

  function handleFileTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileTitle(e.target.value);
  }

  function handleFileContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setFileContent(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (fileTitle.length > 0 && fileContent.length > 0) {
      onAddFile(fileTitle, fileContent);
      setFileTitle("");
      setFileContent("");
      closeModal();
    }
  }

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    if (fileTitleEl.current) {
      fileTitleEl.current.focus();
    }
  }

  function closeModal() {
    setIsOpen(false);
    setFileTitle("");
    setFileContent("");
  }

  return (
    <>
      <span className="second-beige">
        <h2 onClick={openModal}>أضف نصا</h2>
      </span>{" "}
      <Plus onClick={openModal} />
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
        contentLabel="إضافة نص"
      >
        <form className="add-file-form" onSubmit={handleSubmit}>
          <div className="file-title-input">
            <label>عنوان النص</label>
            <input
              ref={fileTitleEl}
              className="folder-title-input"
              type="text"
              value={fileTitle}
              onChange={handleFileTitleChange}
            />
          </div>
          <div className="file-content-input">
            <label>محتوى النص</label>
            <textarea
              className="file-content-input"
              value={fileContent}
              onChange={handleFileContentChange}
            />
          </div>
          <div className="form-btns">
            <label>
              <input type="submit" />
              <Done />
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
