import { useContext } from "react";
import { ModalContext } from "./context";

export default function useModal() {
    const ctx = useContext(ModalContext);
    if (!ctx) {
      throw new Error("useModal must be used inside a ModalProvider");
    }
    return ctx;
  }
  