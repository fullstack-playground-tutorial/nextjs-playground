import "./range-slider.css";
interface Props {
  min: number;
  max: number;
  step: number;
  value: number;
  trackColor?: string;
  trackHoverColor?:string;
  foregroundColor?: string;
  thumbColor?: string;
  thumbHoverColor?: string;
  onChange?: (n: number) => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
}

const colors = {
  purple: "var(--color-purple-500)", // tailwind purple-500
  gray: "var(--color-gray-300)", // tailwind gray-300
  orange: "var(--color-orange-500)",
  hoverOrange: "var(--color-orange-600)",
};

export default function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value = 50,
  trackColor = colors.purple,
  foregroundColor = colors.gray,
  thumbColor = colors.orange,
  thumbHoverColor = colors.hoverOrange,
  onChange: onChange,
  onMouseDown,
  onMouseUp,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(parseFloat(e.target.value));
  };

  const handleMouseUp = () => {
    onMouseUp && onMouseUp();
  };

  const handleMouseDown = () => {
    onMouseDown && onMouseDown();
  };

  const percent = ((value - min) / (max - min)) * 100;
  const background = `linear-gradient(to right, ${trackColor} 0%, ${trackColor} ${percent}%, ${foregroundColor} ${percent}%, ${foregroundColor} 100%)`;

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={handleChange}
      style={{
        background: background,
        ["--thumb-color" as any]: thumbColor,
        ["--thumb-hover-color" as any]: thumbHoverColor,
      }}
      className="slider appearance-none w-full h-1 rounded transition"
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
    />
  );
}
