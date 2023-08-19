import React from "react";
import { ReactComponent as ArrowUp } from "../assets/arrow-up.svg";
import { ReactComponent as ArrowDown } from "../assets/arrow-down.svg";
import { ReactComponent as BigMinus } from "../assets/big-minus.svg";

interface Props {
  folderTitle: string;
  unfolded: boolean;
  onAccordionClick: () => void;
  onRemoveFolder: () => void;
}

export default function FolderItem({
  folderTitle,
  unfolded,
  onAccordionClick,
  onRemoveFolder,
}: Props) {
  return (
    <div className={"folder-item"}>
      <div className={"unfold-folder-part"} onClick={onAccordionClick}>
        {unfolded ? <ArrowUp /> : <ArrowDown />} <h1>{folderTitle}</h1>
      </div>
      <div>
        <BigMinus onClick={onRemoveFolder} />
      </div>
    </div>
  );
}
