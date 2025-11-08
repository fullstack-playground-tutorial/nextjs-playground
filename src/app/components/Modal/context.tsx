"use client"
import { createContext, useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Modal from "./Modal";

type ModalContextShape = {
  openModal: (title: ReactNode, children: ReactNode, footer: ReactNode) => void;
  closeModal: () => void;
  open: boolean;
  title: ReactNode | undefined;
  footer: ReactNode | undefined;
};

export const ModalContext = createContext<ModalContextShape | null>(null);

type InternalState = {
  open: boolean;
  title: ReactNode | undefined;
  footer: ReactNode | undefined;
  body: ReactNode | undefined;
};
const initialState: InternalState = {
  open: false,
  title: undefined,
  footer: undefined,
  body: undefined,
};

export function ModalProvider({ children }: React.PropsWithChildren<{}>) {
  const [state, setState] = useState(initialState);
  const openModal = useCallback(
    (title: ReactNode, body: ReactNode, footer?: ReactNode) => {
      setState((prev) => ({ ...prev, title, body, footer, open: true }));
    },
    [setState]
  );
  const closeModal = useCallback(
    () => setState((prev) => ({ ...prev, open: false })),
    [setState]
  );

  const value = useMemo(
    () => ({ openModal, closeModal, ...state }),
    [openModal, closeModal, state]
  );

  const { body, title, footer, open } = state;

  return (
    <ModalContext.Provider value={value}>
      {children}
      <Modal
        open={open}
        onClose={closeModal}
        title={title}
        body={body}
        footer={footer}
      />
    </ModalContext.Provider>
  );
}
