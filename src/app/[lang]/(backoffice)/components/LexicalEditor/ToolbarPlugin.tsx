// src/app/[lang]/(backoffice)/components/LexicalEditor/ToolbarPlugin.tsx
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import UndoIcon from "./icons/undo.svg";
import RedoIcon from "./icons/redo.svg";
import BoldIcon from "./icons/bold.svg";
import ItalicIcon from "./icons/italic.svg";
import UnderlinedIcon from "./icons/underlined.svg";
import StrikethroughIcon from "./icons/strikethrough.svg";
import AlignCenterIcon from "./icons/align_center.svg";
import AlignLeftIcon from "./icons/align_left.svg";
import AlignRightIcon from "./icons/align_right.svg";
import AlignJustifyIcon from "./icons/align_justify.svg";
import {
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import ImagePlugin from "./ImagePlugin";
import { $createImageNode, ImageNode } from "./ImageNode";

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(
          () => {
            $updateToolbar();
          },
          { editor }
        );
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, $updateToolbar]);

  const setAlignment = (alignment: "left" | "center" | "right" | "justify") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isNodeSelection(selection)) {
        const node = selection.getNodes()[0];
        if (node instanceof ImageNode) {
          // Tạo node mới với alignment mới
          const newNode = $createImageNode({
            src: node._src,
            alt: node._alt,
            width: node._width,
            height: node._height,
            maxWidth: node._maxWidth,
            alignment: alignment, // set alignment mới
          });
  
          // Replace node cũ bằng node mới → force re-render
          node.replace(newNode);
        }
      }
    });
  };
  

  return (
    <div
      className="flex flex-row h-8 w-full bg-surface-0 border-border border-t border-x items-center rounded-t-md"
      ref={toolbarRef}
    >
      <button
        type="button"
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="size-8 flex items-center justify-center dark:*:fill-tertiary-0  hover:*:fill-accent-0 cursor-pointer"
        aria-label="Undo"
      >
        <UndoIcon className="size-5 transition-colors" />
      </button>
      <button
        type="button"
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="size-8 flex items-center justify-center dark:*:fill-tertiary-0 hover:*:fill-accent-0 cursor-pointer"
        aria-label="Redo"
      >
        <RedoIcon className="size-5 transition-colors" />
      </button>
      <Divider />
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={
          "size-8 flex items-center justify-center cursor-pointer dark:*:fill-tertiary-0 hover:*:fill-accent-0" +
          (isBold ? "dark:*:fill-accent-0" : "")
        }
        aria-label="Format Bold"
      >
        <BoldIcon className="size-5 transition-colors" />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={
          "size-8 flex items-center justify-center cursor-pointer dark:*:fill-tertiary-0 hover:*:fill-accent-0" +
          (isItalic ? "dark:*:fill-accent-0" : "")
        }
        aria-label="Format Italics"
      >
        <ItalicIcon className="size-5 transition-colors" />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={
          "size-8 flex items-center justify-center cursor-pointer dark:*:fill-tertiary-0 hover:*:fill-accent-0" +
          (isUnderline ? "dark:*:fill-accent-0" : "")
        }
        aria-label="Format Underline"
      >
        <UnderlinedIcon className="size-5 transition-colors" />
      </button>
      <button
        type="button"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={
          "size-8 flex items-center justify-center cursor-pointer dark:*:fill-tertiary-0 hover:*:fill-accent-0" +
          (isStrikethrough ? "dark:*:fill-accent-0" : "")
        }
        aria-label="Format Strikethrough"
      >
        <StrikethroughIcon className="size-5 transition-colors" />
      </button>
      <Divider />
      <button
        type="button"
        onClick={() => {
          setAlignment("left");
        }}
        className="dark:text-secondary size-8 cursor-pointer dark:*:fill-tertiary-0 hover:*:fill-accent-0"
        aria-label="Left Align"
      >
        <AlignLeftIcon className="size-5 transition-colors" />
      </button>
      <button
        type="button"
        onClick={() => {
          setAlignment("center");
        }}
        className="dark:text-secondary size-8 cursor-pointer dark:*:fill-tertiary-0 hover:*:fill-accent-0"
        aria-label="Center Align"
      >
        <AlignCenterIcon className="size-5 transition-colors" />
      </button>
      <button
        type="button"
        onClick={() => {
          setAlignment("right");
        }}
        className="dark:text-secondary size-8 cursor-pointer dark:*:fill-tertiary-0 hover:*:fill-accent-0"
        aria-label="Right Align"
      >
        <AlignRightIcon className="size-5 transition-colors" />
      </button>
      <button
        type="button"
        onClick={() => {
          setAlignment("justify");
        }}
        className="dark:text-secondary size-8 cursor-pointer dark:*:fill-tertiary-0 hover:*:fill-accent-0"
        aria-label="Justify Align"
      >
        <AlignJustifyIcon className="size-5 transition-colors" />
      </button>{" "}
      <ImagePlugin />
    </div>
  );
}
