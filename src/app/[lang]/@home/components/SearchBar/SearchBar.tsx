import { useRef, useState } from "react";
interface Props {
  list: string[];
  onSearchSubmit: (q: string) => void;
}

interface InternalState {
  q?: string;
}

const internalState: InternalState = {};

export const SearchBar = (props: Props) => {
  const [state, setState] = useState(internalState);
  const formRef = useRef(null)
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, q: e.target.value }));
    console.log(formRef);
    
    // props.onSearchSubmit(e.target.value);
  };

  return (
    <div className="relative">
      <form ref={formRef} className="relative flex bg-white rounded-full items-center flex-row justify-center shadow-md gap-2 h-8 overflow-hidden">
        <div className="h-full flex justify-center items-center">
          <div
            className="flex items-center rounded-full justify-center p-1 shadow-md h-4/5 ml-1"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-2 h-full stroke-blue-300"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
          </div>
        </div>
        <input
          type="text"
          className=" w-full h-full border-none outline-none"
          placeholder="Type to search ..."
          onChange={(e) => onSearchChange}
        />
      </form>

      {props.list.length > 0 && (
        <div className="absolute bg-white w-full rounded-lg p-1 mt-2 shadow-md">
          {props.list.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      )}
    </div>
  );
};
