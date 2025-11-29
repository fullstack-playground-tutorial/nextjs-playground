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
  return new ImageNode({ alt, src, height, width, maxWidth, alignment });
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
  __src: string;
  __alt: string;
  __height: "inherit" | number;
  __width: "inherit" | number;
  __maxWidth: "inherit" | number;
  __alignment: "left" | "center" | "right" | "justify";

  constructor({
    src = "",
    alt = "",
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
    this.__src = src;
    this.__alt = alt;
    this.__height = height;
    this.__width = width;
    this.__maxWidth = maxWidth;
    this.__alignment = alignment;
  }

  static getType(): string {
    return "image";
  }

  static clone(_node: ImageNode): ImageNode {
    return new ImageNode({
      src: _node.__src,
      alt: _node.__alt,
      height: _node.__height,
      width: _node.__width,
      maxWidth: _node.__maxWidth,
      alignment: _node.__alignment,
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
      src: this.__src,
      alt: this.__alt,
      height: this.__height,
      width: this.__width,
      maxWidth: this.__maxWidth,
      alignment: this.__alignment,
      type: "image",
      version: 1,
    };
  }

  decorate() {
    return (
      <div
        key={this.__alignment}
        style={{
          display: "flex",
          justifyContent:
            this.__alignment === "left"
              ? "flex-start"
              : this.__alignment === "right"
              ? "flex-end"
              : "center",
          width: "100%",
        }}
      >
        <img
          src={this.__src}
          alt={this.__alt}
          style={{
            width: this.__alignment === "justify" ? "100%" : this.__width,
            maxWidth: this.__alignment === "justify" ? "100%" : this.__maxWidth,
            height: this.__height,
          }}
        />
      </div>
    );
  }

  setAlignment(alignment: "left" | "center" | "right" | "justify") {
    const writable = this.getWritable();
    writable.__alignment = alignment;
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.style.display = "flex";

    if (this.__alignment === "left") div.style.justifyContent = "flex-start";
    else if (this.__alignment === "right")
      div.style.justifyContent = "flex-end";
    else div.style.justifyContent = "center";

    return div;
  }

  updateDOM(prevNode: ImageNode, dom: HTMLElement): boolean {
    if (prevNode.__alignment !== this.__alignment) {
      if (this.__alignment === "left") dom.style.justifyContent = "flex-start";
      else if (this.__alignment === "right")
        dom.style.justifyContent = "flex-end";
      else dom.style.justifyContent = "center";
    }

    return false; // dom reused, not create new
  }

  exportDOM(): DOMExportOutput {
    const img = document.createElement("img");
    img.setAttribute("src", this.__src);
    img.setAttribute("alt", this.__alt);
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
