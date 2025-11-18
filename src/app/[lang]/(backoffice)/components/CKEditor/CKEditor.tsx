"use client";

import { useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  BlockToolbar,
  Bold,
  ClassicEditor,
  CloudServices,
  Code,
  Essentials,
  EventInfo,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Highlight,
  HtmlComment,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsertViaUrl,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  MediaEmbed,
  Paragraph,
  PlainTableOutput,
  Plugin,
  ShowBlocks,
  SourceEditing,
  Strikethrough,
  Style,
  Table,
  TableCaption,
  TableToolbar,
  TextPartLanguage,
  TextTransformation,
  TodoList,
  Underline,
  type EditorConfig,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import "./custom.css";

type Props = {
  content: string;
  onChange: (content: string) => void;
  licenseKey: string;
  disable:boolean;
};

class TabIndentPlugin extends Plugin {
  init() {
    const editor = this.editor;
    editor.editing.view.document.on("keydown", (_, data) => {
      if (data.keyCode === 9 && data.shiftKey) {
        data.preventDefault();
        editor.model.change((writer) => {
          const selection = editor.model.document.selection;
          const position = selection.getFirstPosition();
          if (position) {
            const range = editor.model.createRange(
              editor.model.createPositionAt(
                position.parent,
                position.offset - 4
              ),
              position
            );
            writer.remove(range);
          }
        });
      } else if (data.keyCode === 9) {
        data.preventDefault();
        editor.model.change((writer) => {
          const insertPosition =
            editor.model.document.selection.getFirstPosition();
          if (insertPosition) {
            writer.insertText("    ", insertPosition);
          }
        });
      }
    });
  }
}

export default function CKEditorComponent({
  content,
  onChange,
  licenseKey,
  disable,
}: Props) {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const LICENSE_KEY = licenseKey || "";
  const editorConfig: EditorConfig = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "sourceEditing",
        "showBlocks",
        "textPartLanguage",
        "|",
        "style",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "code",
        "|",
        "link",
        "mediaEmbed",
        "insertTable",
        "highlight",
        "|",
        "alignment",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "outdent",
        "indent",
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      Alignment,
      Autoformat,
      AutoImage,
      AutoLink,
      Autosave,
      BalloonToolbar,
      BlockToolbar,
      Bold,
      CloudServices,
      Code,
      Essentials,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      GeneralHtmlSupport,
      Highlight,
      HtmlComment,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsertViaUrl,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      MediaEmbed,
      Paragraph,
      PlainTableOutput,
      ShowBlocks,
      SourceEditing,
      Strikethrough,
      Style,
      Table,
      TableCaption,
      TableToolbar,
      TextPartLanguage,
      TextTransformation,
      TodoList,
      Underline,
    ],
    extraPlugins: [TabIndentPlugin],
    balloonToolbar: [
      "bold",
      "italic",
      "|",
      "link",
      "|",
      "bulletedList",
      "numberedList",
    ],
    blockToolbar: [
      "fontSize",
      "fontColor",
      "fontBackgroundColor",
      "|",
      "bold",
      "italic",
      "|",
      "link",
      "insertTable",
      "|",
      "bulletedList",
      "numberedList",
      "outdent",
      "indent",
    ],
    fontFamily: {
      supportAllValues: true,
    },
    fontSize: {
      options: [10, 12, 14, "default", 18, 20, 22],
      supportAllValues: true,
    },
    htmlSupport: {
      allow: [
        {
          name: /^.*$/,
          styles: true,
          attributes: true,
          classes: true,
        },
      ],
    },
    image: {
      toolbar: [
        "toggleImageCaption",
        "imageTextAlternative",
        "|",
        "imageStyle:inline",
        "imageStyle:wrapText",
        "imageStyle:breakText",
      ],
    },
    licenseKey: LICENSE_KEY,
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      decorators: {
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },
    placeholder: "Type or paste your content here!",
    initialData: "",
    style: {
      definitions: [
        {
          name: "Article category",
          element: "h3",
          classes: ["category"],
        },
        {
          name: "Title",
          element: "h2",
          classes: ["document-title"],
        },
        {
          name: "Subtitle",
          element: "h3",
          classes: ["document-subtitle"],
        },
        {
          name: "Info box",
          element: "p",
          classes: ["info-box"],
        },
        {
          name: "CTA Link Primary",
          element: "a",
          classes: ["button", "button--green"],
        },
        {
          name: "CTA Link Secondary",
          element: "a",
          classes: ["button", "button--black"],
        },
        {
          name: "Marker",
          element: "span",
          classes: ["marker"],
        },
        {
          name: "Spoiler",
          element: "span",
          classes: ["spoiler"],
        },
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
  };
  const handleEditorChange = (
    _: EventInfo<string, unknown>,
    editor: ClassicEditor
  ) => {
    const data = editor.getData();
    if (onChange) {
      onChange(data);
    }
  };

  return (
    <div className="main-container">
      <div
        className="editor-container editor-container_classic-editor"
        ref={editorContainerRef}
      >
        <div className="editor-container__editor" ref={editorRef}>
          <CKEditor
            editor={ClassicEditor}
            data={content}
            onChange={handleEditorChange}
            config={editorConfig}
            disabled={disable}
          />
        </div>
      </div>
    </div>
  );
}
