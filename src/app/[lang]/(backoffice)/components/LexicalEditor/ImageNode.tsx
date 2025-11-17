// src/app/[lang]/(backoffice)/components/LexicalEditor/ImageNode.tsx
"use client";
import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  NodeKey,
  SerializedLexicalNode,
} from "lexical";
import { JSX } from "react";

type ImageProperties = {
  src: string;
  alt: string;
  height?: "inherit" | number;
  width?: "inherit" | number;
  maxWidth?: "inherit" | number;
  alignment?: "left" | "center" | "right" | "justify";
  key?: NodeKey;
};

export const $createImageNode = ({
  src,
  alt,
  height,
  width,
  maxWidth = 400,
  alignment,
}: ImageProperties) => {
  return new ImageNode({ alt, src, height, width, maxWidth,alignment });
};

const convertImageElement = (domNode: Node): DOMConversionOutput | null => {
  if (domNode instanceof HTMLImageElement) {
    const { src, alt } = domNode;
    const node = $createImageNode({ src, alt });
    return { node: node };
  }

  return null;
};

type SerializedImageNode = SerializedLexicalNode & {
  src: string;
  alt: string;
  height: "inherit" | number;
  width: "inherit" | number;
  maxWidth: "inherit" | number;
  alignment: "left" | "center" | "right" | "justify";
};

export class ImageNode extends DecoratorNode<JSX.Element> {
  _src: string;
  _alt: string;
  _height: "inherit" | number;
  _width: "inherit" | number;
  _maxWidth: "inherit" | number;
  _alignment: "left" | "center" | "right" | "justify";

  constructor({
    src,
    alt,
    height = "inherit",
    width = "inherit",
    maxWidth = 400,
    alignment = "center",
    key,
  }: {
    src: string;
    alt: string;
    height?: any;
    width?: any;
    maxWidth?: any;
    alignment?: "left" | "center" | "right" | "justify";
    key?: NodeKey;
  }) {
    super(key);
    this._src = src;
    this._alt = alt;
    this._height = height;
    this._width = width;
    this._maxWidth = maxWidth;
    this._alignment = alignment;
  }

  static getType(): string {
    return "image";
  }

  static clone(_node: ImageNode): ImageNode {
    return new ImageNode({
      src: _node._src,
      alt: _node._alt,
      height: _node._height,
      width: _node._width,
      maxWidth: _node._maxWidth,
      alignment: _node._alignment,
      key: _node.getKey(),
    });
  }

  static importJSON(json: SerializedImageNode): ImageNode {
    return new ImageNode({
      src: json.src,
      alt: json.alt,
      height: json.height,
      width: json.width,
      maxWidth: json.maxWidth,
      alignment: json.alignment ?? "center",
    });
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      src: this._src,
      alt: this._alt,
      height: this._height,
      width: this._width,
      maxWidth: this._maxWidth,
      alignment: this._alignment,
      type: "image",
      version: 1,
    };
  }

  decorate() {
    return (
      <div
        key={this._alignment}
        style={{
          display: "flex",
          justifyContent:
            this._alignment === "left"
              ? "flex-start"
              : this._alignment === "right"
              ? "flex-end"
              : "center",
          width: "100%",
        }}
      >
        <img
          src={this._src}
          alt={this._alt}
          style={{
            width: this._alignment === "justify" ? "100%" : this._width,
            maxWidth: this._alignment === "justify" ? "100%" : this._maxWidth,
            height: this._height,
          }}
        />
      </div>
    );
  }

  setAlignment(alignment: "left" | "center" | "right" | "justify") {
    const writable = this.getWritable();
    writable._alignment = alignment;
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.style.display = "flex";
  
    if (this._alignment === "left") div.style.justifyContent = "flex-start";
    else if (this._alignment === "right") div.style.justifyContent = "flex-end";
    else div.style.justifyContent = "center";
  
    return div;
  }

  updateDOM(prevNode: ImageNode, dom: HTMLElement): boolean {
    if (prevNode._alignment !== this._alignment) {
      if (this._alignment === "left") dom.style.justifyContent = "flex-start";
      else if (this._alignment === "right") dom.style.justifyContent = "flex-end";
      else dom.style.justifyContent = "center";
    }
  
    return false; // dom reused, not create new
  }
    

  exportDOM(): DOMExportOutput {
    const img = document.createElement("img");
    img.setAttribute("src", this._src);
    img.setAttribute("alt", this._alt);
    return { element: img };
  }

  static importDOM(): DOMConversionMap<any> | null {
    return {
      img: (node: Node) => {
        return {
          conversion: convertImageElement,
          priority: 0,
        };
      },
    };
  }
}
