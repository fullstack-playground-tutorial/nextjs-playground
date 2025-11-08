import type { ToastType } from "./Toast";
import Toast from "./Toast";

export type ToastItem = {
  id: string;
  type: ToastType;
  message: string;
};

type Props = {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
};

export default function ToastContainer({ toasts, removeToast }: Props) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col items-end">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={removeToast}
        />
      ))}
    </div>
  );
}
