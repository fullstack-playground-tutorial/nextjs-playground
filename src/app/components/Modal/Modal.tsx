"use client";
import { type MouseEvent, type ReactNode } from "react";
import CloseIcon from "@/assets/images/icons/close.svg";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
interface ModalProps {
  open: boolean;
  title?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export default function Modal({
  open,
  title,
  body,
  footer,
  showCloseButton = true,
  closeOnOverlayClick = true,
}: ModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const hanldeDialogClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const handleClose = () => {
    if (closeOnOverlayClick) {
      const params = new URLSearchParams(searchParams);
      params.delete("showModal");
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex flex-col justify-center items-center bg-opacity-50 z-50`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-black/50" onClick={handleClose}>
        <div className="relative h-full w-full flex items-center justify-center p-4">
          <div
            role="dialog"
            onClick={(e) => hanldeDialogClick(e)}
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            className={`w-full max-w-lg dark:text-primary dark:bg-surface-0 border border-border rounded-lg shadow-xl outline-none`}
          >
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-4 py-3 border-b dark:border-border">
                <div
                  id="modal-title"
                  className="text-base font-semibold text-gray-900 dark:text-gray-100"
                >
                  {title}
                </div>
                {showCloseButton && (
                  <div
                    aria-label="Close"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center group cursor-pointer outline-none"
                  >
                    <CloseIcon className="size-5 dark:fill-secondary dark:group-hover:fill-accent-0" />
                  </div>
                )}
              </div>
            )}

            <div className="lg:px-6 px-4 pt-4 max-h-[70vh]">{body}</div>

            {footer && <div className="p-4 px-6">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
