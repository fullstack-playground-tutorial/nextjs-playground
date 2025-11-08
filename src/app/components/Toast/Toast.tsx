import { useEffect, useRef, useState } from "react";

export type ToastType = "success" | "error" | "info";

type Props = {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
};

export default function Toast({
  id,
  type,
  message,
  duration = 4000,
  onClose,
}: Props) {
  const [progress, setProgress] = useState(100);
  //   const icons = {
  //     success: <CheckCircle className="text-green-400" />,
  //     error: <XCircle className="text-red-400" />,
  //     info: <Info className="text-blue-400" />,
  //   };

  const timer = useRef<NodeJS.Timeout | null>(null);

  // Countdown progress bar
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining > 0) timer.current = setTimeout(tick, 50);
      else onClose(id);
    };
    tick();
    return () => {
      timer.current && clearTimeout(timer.current);
    };
  }, [duration, id, onClose]);

  const handleClick = () => onClose(id);

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 px-4 py-3 mb-3 rounded-2xl shadow-lg border cursor-pointer
      backdrop-blur-md transition-all duration-300 animate-slide-in-right
      ${
        type === "success"
          ? "bg-green-500/10 border-green-600/30"
          : type === "error"
          ? "bg-red-500/10 border-red-600/30"
          : "bg-blue-500/10 border-blue-600/30"
      }`}
    >
      {/* {icons[type]} */}
      <div className="flex-1">
        <p className="text-sm text-white dark:text-gray-200">{message}</p>
        <div className="mt-1 h-[3px] rounded-full overflow-hidden bg-white/20">
          <div
            className={`h-full transition-all duration-100 ${
              type === "success"
                ? "bg-green-400"
                : type === "error"
                ? "bg-red-400"
                : "bg-blue-400"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
