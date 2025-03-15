"use client"

import { DragEvent, useState } from "react";

interface Props {
  children: React.ReactNode;
  handleDrop: (files: FileList)=> void;
}


function Uploader(props: Props) {
  const handleDrop =(e: DragEvent) => {
    e.preventDefault()
    const droppedFiles = e.dataTransfer.files;
    props.handleDrop(droppedFiles)
  }
  return (
    <div className="border-2 border-dashed w-[inherit] border-white rounded-lg h-auto flex justify-center items-center" onDrop={(e)=>handleDrop(e)}>
        {props.children}
    </div>
  );
}

export default Uploader;
