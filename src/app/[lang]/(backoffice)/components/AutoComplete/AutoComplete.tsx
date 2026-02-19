"use client"
import { useMemo, useRef } from "react";

export type AutoCompeleteItem<
  T extends {
    id: string;
    title: string;
    color?: string;
  }
> = T;
type Props<
  T extends {
    id: string;
    title: string;
    color?: string;
  }
> = {
  maxTags: number;
  name: string;
  label: string;
  suggestions: AutoCompeleteItem<T>[];
  selected: AutoCompeleteItem<T>[];
  q: string;
  disable: boolean;
  onTagChange: (selected: AutoCompeleteItem<T>[]) => void;
  onQChange: (text: string) => void;
  required?: boolean;

};

function AutoComplete<
  T extends {
    id: string;
    title: string;
    color?: string;
  }
>({
  label,
  name,
  q,
  suggestions,
  maxTags,
  selected,
  onTagChange,
  onQChange,
  disable,
  required,
}: Props<T>) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQChange(e.target.value);
  };

  const handleItemSelected = (
    e: React.MouseEvent,
    item: AutoCompeleteItem<T>
  ) => {
    e.stopPropagation();
    if (maxTags > selected.length && !selected.includes(item)) {
      onTagChange([...selected, item]);
      onQChange("");
    }
  };

  const renderTag = (id: string, title: string, color?: string) => {
    const removeItem = (id: string) => {
      onTagChange(selected.filter((item) => item.id !== id));
    };
    return (
      <div
        key={id}
        className={`text-xs font-normal dark:text-primary dark:bg-surface-4 px-2 py-0.5 rounded-full flex flex-row items-center justify-center`}
        style={{ backgroundColor: color || "var(--color-tertiary-0)" }}
      >
        <span>{title}</span>
        <button
          className=" transition cursor-pointer text-tertiary-0 hover:text-tertiary-1 group"
          onClick={() => removeItem(id)}
          disabled={disable}
          hidden={disable}
        >
          x
        </button>
      </div>
    );
  };

  const filteredTags = useMemo(() => {
    return suggestions
      .filter((s) => !selected.includes(s))
      .filter((s) => s.title.toLowerCase().includes(q.toLowerCase()));
  }, [suggestions, selected, q]);

  return (
    <div
      className="relative w-full h-full cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div
        className="relative flex flex-row flex-wrap gap-1 items-center w-full h-full
        shadow rounded-md px-3 pt-6 pb-2
        dark:bg-surface-1 dark:border dark:border-border dark:focus-within:ring dark:focus-within:ring-accent-0
        has-[div]:[&>label]:top-1 has-[div]:[&>label]:-translate-y-0 has-[div]:[&>label]:text-sm has-[div]:[&>label]:font-medium
        has-[input:not(:placeholder-shown)]:[&>label]:top-1 has-[input:not(:placeholder-shown)]:[&>label]:-translate-y-0 has-[input:not(:placeholder-shown)]:[&>label]:text-sm has-[input:not(:placeholder-shown)]:[&>label]:font-normal
        has-[input:focus]:[&>label]:top-1.5 has-[input:focus]:[&>label]:-translate-y-0 has-[input:focus]:[&>label]:text-sm has-[input:focus]:[&>label]:font-normal
        dark:has-[input:focus]:[&>label]:text-accent-0"
      >
        {selected.map((tag) => renderTag(tag.id, tag.title, tag.color))}

        <input
          ref={inputRef}
          type="text"
          id={name}
          name={name}
          value={q}
          placeholder=" "
          onChange={(e) => handleChange(e)}
          disabled={disable}
          className="peer h-full leading-5
      text-sm dark:text-primary placeholder-transparent
      outline-none transition-all duration-200 bg-transparent"
        />

        <label
          htmlFor={name}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-secondary font-medium 
      transition-all duration-200"
        >
          {label}{required && <span className="text-alert-0">*</span>}
        </label>
      </div>

      <div
        className={`absolute transition-colors z-1 shadow dark:bg-surface-1 overflow-hidden text-sm ${q.length > 0 ? "opacity-100" : "opacity-0 pointer-events-none"
          } flex flex-col items-center justify-center rounded-md border dark:border-border shadow top-[calc(100%+8px)] left-0 w-full`}
      >
        {filteredTags.length > 0 ? (
          filteredTags.map((item) => (
            <div
              key={item.title}
              onClick={(e) => handleItemSelected(e, item)}
              className="dark:hover:text-accent-0 w-full cursor-pointer px-3 py-2 dark:hover:bg-surface-0 dark:active:bg-surface-2"
            >
              {item.title}
            </div>
          ))
        ) : (
          <div className=" w-full px-3 py-2">Cannot found the result</div>
        )}
      </div>
    </div>
  );
}
export default AutoComplete;
