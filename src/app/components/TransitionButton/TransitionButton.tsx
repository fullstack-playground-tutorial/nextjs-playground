"use client";

import { MutableRefObject } from "react";

interface Props {
  refElement: MutableRefObject<any>;
  effectTransition: "page-transition";
  children: Readonly<React.ReactNode>;
  handleTransition: () => void;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function TransitionButton(props: Props) {
  const handleTransitionClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    props.refElement?.current.classList.add(props.effectTransition);
    await sleep(500);
    props.refElement?.current.classList.remove(props.effectTransition);
    props.handleTransition()
  };
  return (
    <button type="button" onClick={(e) => handleTransitionClick(e)}>{props.children}</button>
  );
}

export default TransitionButton;
