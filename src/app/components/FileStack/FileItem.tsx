"use client";

import Image from "next/image";
import ghostChat from "@/app/assets/images/ghost-chat.png";
interface Props {
  file: File;
  handleClose: (fileName: string) => void;
}

function FileItem(props: Props) {
  const allowFileType = ["image/png", "image/jpeg"];
  const onClose = (e: MouseEvent) => {
    e.preventDefault();
    props.handleClose(props.file.name);
  };
  const renderFile = () => {
    switch (props.file.type) {
      case "image/png":
      case "image/jpeg":
        return (
          <div className="relative rounded-lg bg-slate-100 p-2">
            <div className="flex flex-col gap-2 rounded-[inherit] h-[300px] w-[240px]">
              <div className="relative basis-4/5 rounded-[inherit] bg-white">
                {/* <Image fill={true} src={URL.createObjectURL(props.file)} className="rounded-[inherit] object-contain shadow-xl" alt={props.file.name}/> */}
                <Image
                  fill={true}
                  src={ghostChat}
                  className=" object-contain shadow-md block rounded-[inherit]"
                  alt={props.file.name}
                />
              </div>
              <textarea
                name="note"
                id="note"
                className="w-full basis-1/5 shadow-md text-sm rounded-lg p-2 resize-none outline-none"
                placeholder="add note"
                value={""}
              >
              </textarea>
            </div>
            <button className="rounded-full w-4 h-4 text-sm text-white bg-slate-300 absolute flex items-center justify-center p-3 shadow-md top-[-12px] right-[-12px]">
              <span>X</span>
            </button>
          </div>
        );

      default:
        return <></>;
    }
  };

  return (
    <div className="rounded-3xl justify-center items-center flex flex-col flex-wrap">
      {renderFile()}
    </div>
  );
}

export default FileItem;
