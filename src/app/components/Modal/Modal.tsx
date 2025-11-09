"use client";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "@/assets/images/icons/close.svg";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
interface ModalProps {
  open: boolean;
  title?: ReactNode;
  body?: ReactNode;
  footer?:ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

export default function Modal({
  open,
  title,
  body,
  footer,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEsc]);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) return null;

  const onClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("showModal");    
    router.replace(`${pathname}?${params.toString()}`);
  };

  const modal = (
    <div className={`fixed inset-0 z-50`} aria-hidden={!open}>
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => {
          if (closeOnOverlayClick) onClose();
        }}
      />

      <div className="relative h-full w-full flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          className={`w-full max-w-lg dark:text-primary dark:bg-surface-0 border border-border rounded-lg shadow-xl outline-none`}
          onClick={(e) => e.stopPropagation()}
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
                <button
                  type="button"
                  aria-label="Close"
                  onClick={onClose}
                  className="inline-flex items-center justify-center group cursor-pointer outline-none"
                >
                  <CloseIcon className="size-5 dark:fill-secondary dark:group-hover:fill-accent-0" />
                </button>
              )}
            </div>
          )}

          <div className="lg:px-6 px-4 pt-4 max-h-[70vh]">{body}</div>

          {footer && <div className="p-4 px-6">{footer}</div>}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
