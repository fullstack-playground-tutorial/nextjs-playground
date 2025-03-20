"use client";

import { InternalizationContext } from "@/app/core/client/context/internalization/InternalizationContext";
import { useContext, useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error(props: Props) {
  const internalization = useContext(InternalizationContext);

  useEffect(() => {
    console.log(props.error);
  }, [props.error]);

  return (
    <div className="mt-12 mx-auto">
      <div className="relative bg-white rounded-2xl shadow-lg dark:bg-gray-700 min-w-80 mx-auto overflow-hidden">
          {/* Modal header */}
          <div className="flex bg-red-500 p-4">
            <div className="my-auto mx-auto flex text-center rounded-full w-8 h-8 border-white border-2 text-white items-center justify-center">
              !
            </div>
          </div>
          {/* Modal body */}
          <div className="flex flex-col p-4">
            <div className=""></div>
            <div className="text-center font-semibold text-lg">
              {"Error"}
            </div>
            <div className="text-center text-base">
              {props.error.message ?? "Something go wrong"}
            </div>
          </div>
          {/* footer */}
          <div className="flex flex-row justify-center p-4">
            <button
              type="button"
              className="p-2 rounded-full mx-4 w-1/3 text-white bg-red-500 text-base hover:bg-red-600 shadow-lg"
              onClick={()=>props.reset()}
            >
              Try Again
            </button>
          </div>
      </div>
    </div>
  );
}
