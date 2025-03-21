interface Props {
  checked: boolean;
  onToggle: () => void;
  //  background Tailwind css
  backgroundColor?: string;
  backgroundActiveColor?: string;
}
export default function CustomSwitch(props: Props) {
  const backgroundColor = props.backgroundColor ?? "bg-[#ccc]";
  const backgroundActiveColor = props.backgroundActiveColor ?? "bg-[#2196f3]";
  const onToggleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    props.onToggle();
  };
  return (
    <label
      className="relative inline-block w-15 h-8"
      onClick={(e) => onToggleClick(e)}
    >
      <input
        placeholder=""
        readOnly
        type="checkbox"
        className="opacity-0 size-0"
        checked={props.checked}
      />
      <span
        className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 duration-400 rounded-[36px]
        before:[''] before:absolute before:size-6 before:left-1 before:bottom-1 before:bg-white before:duration-400 before:rounded-[50%] ${
          props.checked
            ? backgroundActiveColor + " before:translate-x-7"
            : backgroundColor
        }`}
      ></span>
    </label>
  );
}
