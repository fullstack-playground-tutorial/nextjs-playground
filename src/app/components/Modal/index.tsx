"use client";

import { useEffect, useState } from "react";
import ReactPortal from "../ReactPortal";

export interface Props {
  children: React.ReactElement;
  closeModal?: () => void;
  isVisible: boolean;
  backdropColor?: string;
  contentColor?: string;
}

export const Modal = ({
  backdropColor = "bg-dark-theme/90",
  contentColor = "bg-gray-700",
  ...props
}: Props) => {
  const handleCloseModal = (e: React.MouseEvent) => {
    e.preventDefault();
    props.closeModal && props.closeModal();
  };

  return (
    <ReactPortal wrapperId={"portal-modal"}>
      {props.isVisible ? (
        <div
          id="modal"
          aria-labelledby="modal-title"
          role="dialog"
          tabIndex={-1}
          aria-modal={true}
        >
          <div
            className={`fixed z-49 inset-0 ${backdropColor} transition-opacity opacity-80`}
          ></div>
          <div className="flex fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-50 justify-center items-center">
            <div className="relative w-full">
              {/* Modal content */}
              <div
                className={`relative rounded-lg ${contentColor} shadow-sm p-4`}
              >
                {/* Modal header */}
                <div className={`flex items-center rounded-lg-t`}>
                  <button
                    onClick={(e) => handleCloseModal(e)}
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600"
                    data-modal-hide="static-modal"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/* Modal content */}
                <div>{props.children}</div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </ReactPortal>
  );
};
