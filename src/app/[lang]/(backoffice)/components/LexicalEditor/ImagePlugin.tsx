// src/app/[lang]/(backoffice)/components/LexicalEditor/ImagePlugin.tsx
"use client";
import Modal from "@/components/Modal";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { $createImageNode } from "./ImageNode";
import { $insertNodes } from "lexical";
import ImageIcon from "./icons/image.svg";
import FloatInput from "../FloatInput";
export default function ImagePlugin() {
  const searchParam = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [editor] = useLexicalComposerContext();
  const [imageURL, setImageURL] = useState<string>();
  const [imageFile, setImageFile] = useState<File>();
  const onShowImageUload = () => {
    const params = new URLSearchParams(searchParam);
    params.set("img-editor-modal", "true");
    router.push(`${pathname}?${params.toString()}`);
  };
  const onUploadImage = () => {
    imageInputRef.current?.click();

  }
  const onAddImage = () => {
    if (!imageURL && !imageFile) {
      return;
    }
    editor.update(() => {
      const src = imageFile
        ? URL.createObjectURL(imageFile)
        : imageURL ?? "";
      const node = $createImageNode({ src, alt: "Dummy Text" });
      $insertNodes([node]);
    });
    setImageFile(undefined);
    setImageURL(undefined);

    const params = new URLSearchParams(searchParam);
    params.delete("img-editor-modal");
    router.push(`${pathname}?${params.toString()}`);
  };

  const onURLImageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setImageURL(e.currentTarget.value);
  };

  const onAddImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const file = files?.[0];
    if (file) {
      setImageFile(file);
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const imgEditorModal = searchParam.get("img-editor-modal");

  return (
    <>
      <button
        className="dark:text-secondary size-8 cursor-pointer dark:*:fill-tertiary-0 hover:*:fill-accent-0"
        type="button"
        onClick={onShowImageUload}
      >
        <ImageIcon className="size-5 transition-colors" />
      </button>
      {imgEditorModal && (
        <Modal>
          <div className="flex flex-col justify-between p-6 items-center w-90 dark:bg-surface-0 rounded-md h-80 overflow-hidden">
            <input
              type="file"
              name="image"
              accept="image/*"
              className="hidden"
              ref={imageInputRef}
              onChange={onAddImageChange}
            />
            <div className="w-full h-12">
              <FloatInput
                onChange={onURLImageChange}
                name={"image"}
                value={imageURL}
                label={"image url"}
                disable={false}
              />
            </div>
            <button
              type="button"
              className="btn btn-sm border text-accent-0 hover:text-primary font-semibold border-accent-0 hover:bg-accent-1 transition"
              onClick={onUploadImage}
            >
              Upload Image
            </button>
            <button
              type="button"
              className="btn btn-sm border-1 text-accent-0 hover:text-primary font-semibold border-accent-0 hover:bg-accent-1 transition"
              onClick={onAddImage}
              disabled={!imageURL?.length && !imageFile}
            >
              Add Image
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
