import React, { useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import FolderItem from "./FolderItem";
import FileItem from "./FileItem";
import AddFile from "./AddFile";
import AddFolder from "./AddFolder";

export interface IFiles {
  fileTitle: string;
  fileContent: string;
}

export interface IFolders {
  folderTitle: string;
  folderContent: IFiles[];
}

export default function Main() {
  const [folders, setFolders] = useLocalStorage<IFolders[]>("folders", []);
  const [activeFolderIndex, setActiveFolderIndex] = useState<number | null>(
    null
  );

  const handleAccordionClick = (index: number) => {
    setActiveFolderIndex(index === activeFolderIndex ? null : index);
  };

  const handleAddFile = (
    folderIndex: number,
    fileTitle: string,
    fileContent: string
  ) => {
    setFolders((folders) => {
      const updatedFolders = [...folders];
      updatedFolders[folderIndex].folderContent.push({
        fileTitle,
        fileContent,
      });
      return updatedFolders;
    });
  };

  const handleAddFolder = (folderTitle: string) => {
    setFolders((folders) => [...folders, { folderTitle, folderContent: [] }]);
  };

  const handleRemoveFile = (folderIndex: number, fileIndex: number) => {
    setFolders((folders) => {
      const updatedFolders = [...folders];
      const folder = updatedFolders[folderIndex];

      if (folder && folder.folderContent) {
        folder.folderContent.splice(fileIndex, 1);
      }

      return updatedFolders;
    });
  };

  const handleRemoveFolder = (index: number) => {
    setFolders((folders) => folders.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <ul className="folder-list">
        {folders.map((folder, folderIndex) => (
          <li key={folderIndex}>
            <FolderItem
              folderTitle={folder.folderTitle}
              unfolded={activeFolderIndex === folderIndex}
              onAccordionClick={() => handleAccordionClick(folderIndex)}
              onRemoveFolder={() => handleRemoveFolder(folderIndex)}
            />
            {activeFolderIndex === folderIndex && (
              <ul className="file-list">
                {folder.folderContent.map((file, fileIndex) => (
                  <li key={fileIndex} className="file-item">
                    <FileItem
                      fileTitle={file.fileTitle}
                      fileContent={file.fileContent}
                      onRemoveFile={() =>
                        handleRemoveFile(folderIndex, fileIndex)
                      }
                    />
                  </li>
                ))}
                <li key={folder.folderContent.length} className="file-item">
                  <AddFile
                    onAddFile={(fileTitle, fileContent) =>
                      handleAddFile(folderIndex, fileTitle, fileContent)
                    }
                  />
                </li>
              </ul>
            )}
          </li>
        ))}
        <li key={folders.length}>
          <AddFolder onAddFolder={handleAddFolder} />
        </li>
      </ul>
    </div>
  );
}
