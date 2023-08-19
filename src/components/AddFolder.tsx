import React, { useRef, useState } from "react";
import Modal from "react-modal";
import { ReactComponent as BigPlus } from "../assets/big-plus.svg";

interface Props {
  onAddFolder: (folderTitle: string) => void;
}

Modal.setAppElement("#root");

export default function FileItem({ onAddFolder }: Props) {
  let folderTitleEl = useRef<HTMLInputElement>(null);
  const [folderTitle, setFolderTitle] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFolderTitle(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (folderTitle.length > 0) {
      onAddFolder(folderTitle);
      setFolderTitle("");
      closeModal();
    }
  }

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    if (folderTitleEl.current) {
      folderTitleEl.current.focus();
    }
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <div className={"folder-item"} onClick={openModal}>
        <h1>أضف ملفا</h1> <BigPlus style={{ marginLeft: "0.3em" }} />
      </div>
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
        contentLabel="إضافة ملف"
      >
        <form className="add-folder-form" onSubmit={handleSubmit}>
          <div className="folder-title-input">
            <label>عنوان الملف</label>
            <input
              ref={folderTitleEl}
              className="folder-title-input"
              type="text"
              value={folderTitle}
              onChange={handleTitleChange}
            />
          </div>
          <input type="submit" className="add-folder-btn" value="أضف الملف" />
        </form>
      </Modal>
    </>
  );
}
