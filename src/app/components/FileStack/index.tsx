"use client";

import { MouseEvent } from "react";
import FileItem from "./FileItem";

interface Props {
  files: File[];
  handleRemoveFile: (fileName: string) => void;
}

function FileStack(props: Props) {
  const handleClose = (fileName: string) => {
    props.handleRemoveFile(fileName)
  };
  return (
    <div className="flex flex-wrap flex-row h-auto p-2 gap-2 w-[inherit] items-center justify-center">
      {props.files.map((item) => {
        return (
          <FileItem
            file={item}
            key={item.name}
            handleClose={handleClose}
          />
        );
      })}
    </div>
  );
}

export default FileStack;
