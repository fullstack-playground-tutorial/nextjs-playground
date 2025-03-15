"use client";

import { create, StoryActionState } from "@/app/feature/story/actions";
import {
  ChangeEvent,
  FocusEvent,
  FormEvent,
  use,
  useActionState,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "./StoryPost.css";
import Uploader from "@/app/components/Upload";
import { useDate } from "@/app/hooks/useDate";
import { InternalizationContext } from "@/app/core/client/store/internalization/InternalizationContext";
import FileStack from "@/app/components/FileStack";

interface Props {}

const initialActionState: StoryActionState = {
  fieldErrors: {},
};

interface InternalState {
  text: string;
  droppedfiles: File[];
}

const initialState: InternalState = {
  text: "",
  droppedfiles: [
    {
      lastModified: 0,
      name: "",
      webkitRelativePath: "",
      size: 0,
      type: "image/jpeg",
      arrayBuffer: function (): Promise<ArrayBuffer> {
        throw new Error("Function not implemented.");
      },
      slice: function (
        start?: number,
        end?: number,
        contentType?: string
      ): Blob {
        throw new Error("Function not implemented.");
      },
      stream: function (): ReadableStream<Uint8Array> {
        throw new Error("Function not implemented.");
      },
      text: function (): Promise<string> {
        throw new Error("Function not implemented.");
      },
    },
    {
      lastModified: 0,
      name: "",
      webkitRelativePath: "",
      size: 0,
      type: "image/jpeg",
      arrayBuffer: function (): Promise<ArrayBuffer> {
        throw new Error("Function not implemented.");
      },
      slice: function (
        start?: number,
        end?: number,
        contentType?: string
      ): Blob {
        throw new Error("Function not implemented.");
      },
      stream: function (): ReadableStream<Uint8Array> {
        throw new Error("Function not implemented.");
      },
      text: function (): Promise<string> {
        throw new Error("Function not implemented.");
      },
    },
    {
      lastModified: 0,
      name: "",
      webkitRelativePath: "",
      size: 0,
      type: "image/jpeg",
      arrayBuffer: function (): Promise<ArrayBuffer> {
        throw new Error("Function not implemented.");
      },
      slice: function (
        start?: number,
        end?: number,
        contentType?: string
      ): Blob {
        throw new Error("Function not implemented.");
      },
      stream: function (): ReadableStream<Uint8Array> {
        throw new Error("Function not implemented.");
      },
      text: function (): Promise<string> {
        throw new Error("Function not implemented.");
      },
    },
    {
      lastModified: 0,
      name: "",
      webkitRelativePath: "",
      size: 0,
      type: "image/jpeg",
      arrayBuffer: function (): Promise<ArrayBuffer> {
        throw new Error("Function not implemented.");
      },
      slice: function (
        start?: number,
        end?: number,
        contentType?: string
      ): Blob {
        throw new Error("Function not implemented.");
      },
      stream: function (): ReadableStream<Uint8Array> {
        throw new Error("Function not implemented.");
      },
      text: function (): Promise<string> {
        throw new Error("Function not implemented.");
      },
    },
    {
      lastModified: 0,
      name: "",
      webkitRelativePath: "",
      size: 0,
      type: "image/jpeg",
      arrayBuffer: function (): Promise<ArrayBuffer> {
        throw new Error("Function not implemented.");
      },
      slice: function (
        start?: number,
        end?: number,
        contentType?: string
      ): Blob {
        throw new Error("Function not implemented.");
      },
      stream: function (): ReadableStream<Uint8Array> {
        throw new Error("Function not implemented.");
      },
      text: function (): Promise<string> {
        throw new Error("Function not implemented.");
      },
    },
  ],
};

const StoryPost: React.FC<Props> = (props: Props) => {
  const [state, setState] = useState<InternalState>(initialState);
  const createWitText = create.bind(null, state.text);
  const internalization = use(InternalizationContext);
  if (!internalization) {
    return <></>;
  }
  const { timeSince } = useDate(internalization.localize);

  const [actionState, action] = useActionState(
    createWitText,
    initialActionState
  );

  const textRef = useRef<HTMLTextAreaElement>(null);

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState((prev) => ({ ...prev, text: e.target.value }));
  };

  const handleDrop = (files: FileList) => {
    setState((prev) => ({
      ...prev,
      droppedfiles: [...prev.droppedfiles, ...files],
    }));
  };

  const handleRemoveFile = (filename: string) => {
    const newFiles = state.droppedfiles.filter((file) => file.name != filename);
    setState((prev) => ({ ...prev, droppedfiles: newFiles }));
  };

  useEffect(() => {
    if (textRef.current && textRef.current.style) {
      // to ensure that first render not apply
      if (textRef.current == document.activeElement) {
        if (textRef.current.scrollHeight > 128) {
          textRef.current.style.minHeight = "auto"; // make smoothly enter to new line
          textRef.current.style.minHeight = `${textRef.current.scrollHeight}px`;
        } else {
          textRef.current.style.minHeight = "auto"; // make smoothly enter to new line
          textRef.current.style.minHeight = "128px";
        }
      }
    }
  }, [state.text]);

  const onFocusLeaveTextarea = (e: FocusEvent) => {
    if (textRef.current && textRef.current.style) {
      textRef.current.style.minHeight = `48px`;
    }
  };

  const onFocusTextarea = (e: FocusEvent) => {
    if (textRef.current && textRef.current.style) {
      if (textRef.current.scrollHeight > 128) {
        textRef.current.style.minHeight = `${textRef.current.scrollHeight}px`;
      } else {
        textRef.current.style.minHeight = "128px";
      }
    }
  };
  return (
    <form className="story-post" action={action}>
      <div className="header">
        <div className="avatar">
          <img
            src="https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
            alt=""
            srcSet="https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
          />
        </div>
        <div className="user-info">
          <span className="font-bold">username</span>
          <span>{timeSince(new Date())}</span>
        </div>
      </div>

      <div className="story-content">
        <Uploader handleDrop={handleDrop}>
          <div className="flex flex-col gap-1 w-[inherit] p-1">
            <textarea
              placeholder="share something ?"
              onFocus={(e) => onFocusTextarea(e)}
              onBlur={(e) => onFocusLeaveTextarea(e)}
              value={state.text}
              ref={textRef}
              onChange={(e) => onTextChange(e)}
              className="story-textarea"
            />
            {state.droppedfiles.length > 0 && (
              <div className="bg-white rounded-2xl">
                <FileStack
                  files={state.droppedfiles}
                  handleRemoveFile={handleRemoveFile}
                />
              </div>
            )}
          </div>
        </Uploader>
        <div className="flex flex-row gap-1">
          <button className="bg-white rounded-lg w-12 shadow-md">1</button>
          <button className="bg-white rounded-lg w-12 shadow-md">1</button>
          <button className="bg-white rounded-lg w-12 shadow-md">1</button>
        </div>

        <button
          type="submit"
          className="  bg-white rounded-full text-blue-400 py-1 px-2 shadow-md text-sm self-end font-bold"
        >
          Post
        </button>
      </div>
    </form>
  );
};

export default StoryPost;
