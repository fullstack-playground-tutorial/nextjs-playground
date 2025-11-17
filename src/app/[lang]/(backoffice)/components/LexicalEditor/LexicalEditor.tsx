// src/app/[lang]/(backoffice)/components/LexicalEditor/LexicalEditor.tsx
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./ToolbarPlugin";

import { EditorThemeClasses } from "lexical";
import { ImageNode } from "./ImageNode";
const theme: EditorThemeClasses = {};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
  console.error(error);
}

type Props = {
  placeholder: string;
};

export default function LexicalEditorComponent({ placeholder }: Props) {
  const initialConfig: InitialConfigType = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [ImageNode]
  };

  return (
    <div className="h-full w-full">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="h-full w-full relative min-h-50">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="rounded-b-sm dark:bg-surface-1 dark:border-border dark:border-x dark:border-b shadow min-h-50 px-3 py-2 outline-none text-sm"
                aria-placeholder={"Enter some text..."}
                placeholder={
                  <div className=" absolute top-0 left-0 w-full h-full pointer-events-none px-3 py-2 text-secondary">
                    Enter some text...
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <AutoFocusPlugin />
      </LexicalComposer>
    </div>
  );
}
