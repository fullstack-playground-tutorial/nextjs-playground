"use client"
type Props = {
  name: string;
  value: string | undefined;
  label: string;
  disable: boolean;
  required?: boolean;
  type?: "text" | "email" | "password" | "number";
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};
function FloatInput({ onChange, value, label, name, disable, required, type = "text" }: Props) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(e);
  };
  return (
    <div className="relative w-full h-full">
      <input
        disabled={disable}
        type={type}
        id={name}
        name={name}
        value={value}
        placeholder=" "
        onChange={(e) => handleChange(e)}
        className="peer w-full h-full leading-5 rounded-md border dark:border-border dark:bg-surface-1
        px-3 pt-6 pb-2 text-sm dark:text-primary placeholder-transparent
        dark:focus:border-border-strong dark:focus:ring dark:focus:ring-accent-0 outline-none transition-all duration-200 shadow"
      />
      <label
        htmlFor={name}
        className="absolute left-3 top-1.5 text-sm font-medium transition-all duration-200
        peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2
        peer-placeholder-shown:text-base peer-placeholder-shown:text-secondary
        text-secondary
        peer-focus:top-1.5 peer-focus:-translate-y-0 peer-focus:text-sm peer-focus:font-normal dark:peer-focus:text-accent-0"
      >
        {label}{required && <span className="text-alert-0">*</span>}
      </label>
    </div>
  );
}

export default FloatInput;
