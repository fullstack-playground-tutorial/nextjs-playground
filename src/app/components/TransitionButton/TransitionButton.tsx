"use client";
interface Props {
  transitionElement: Element|null;
  transitionName: "page-transition";
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
    e.preventDefault();
    
    props.transitionElement?.classList.add(props.transitionName);
    await sleep(500);
    props.transitionElement?.classList.remove(props.transitionName);
    props.handleTransition()
  };
  return (
    <button onClick={(e) => handleTransitionClick(e)}>{props.children}</button>
  );
}

export default TransitionButton;
