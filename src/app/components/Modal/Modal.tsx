"use client";
import { type MouseEvent, type ReactNode } from "react";
import CloseIcon from "@/assets/images/icons/close.svg";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
interface ModalProps {
  children?: ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export default function Modal({ children, showCloseButton = true }: ModalProps) {
  const router = useRouter();

  const hanldeDialogClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const handleClose = () => {
   router.back()
  };

  return (
    <div
      className={`fixed inset-0 flex flex-col justify-center items-center bg-opacity-50 z-50`}
    >
      <div className="absolute inset-0 dark:bg-black/50" onClick={handleClose}>
        <div className="relative h-full w-full flex items-center justify-center">
          <div
            role="dialog"
            onClick={(e) => hanldeDialogClick(e)}
            aria-modal="true"
            aria-labelledby={"modal-title"}
            className={`max-w-lg outline-none relative`}
          >
            {showCloseButton && (
              <div
                aria-label="Close"
                onClick={handleClose}
                className="inline-flex items-center justify-center group cursor-pointer outline-none absolute -right-6 -top-6"
              >
                <CloseIcon className="size-6 dark:fill-secondary dark:group-hover:fill-accent-0" />
              </div>
            )}

            <div className="overflow-y-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
