"use client";
import CloseIcon from "@/assets/images/icons/close.svg";
type Props = {
  onClose: () => void;
};

export default function PackForm({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl border dark:border-border dark:bg-surface-1 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Create New Pack</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-primary block text-left">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g. Summer Vacation"
              className="w-full rounded-lg border dark:border-border dark:bg-surface-0 px-4 py-2.5 dark:text-primary placeholder:dark:text-secondary focus:border-accent-0 focus:outline-none focus:ring-1 focus:ring-accent-0 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-primary block text-left">
                Amount
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full rounded-lg border dark:border-border dark:bg-surface-0 px-4 py-2.5 dark:text-primary placeholder:dark:text-secondary focus:border-accent-0 focus:outline-none focus:ring-1 focus:ring-accent-0 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium dark:text-primary block text-left">
                Interest Rate (%)
              </label>
              <input
                type="number"
                placeholder="5"
                className="w-full rounded-lg border dark:border-border dark:bg-surface-0 px-4 py-2.5 dark:text-primary placeholder:dark:text-secondary focus:border-accent-0 focus:outline-none focus:ring-1 focus:ring-accent-0 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-primary block text-left">
              Duration
            </label>
            <select className="w-full rounded-lg border dark:border-border dark:bg-surface-0 px-4 py-2.5 dark:text-primary focus:border-accent-0 focus:outline-none focus:ring-1 focus:ring-accent-0 transition-all appearance-none cursor-pointer">
              <option value="1 week">1 Week</option>
              <option value="1 month">1 Month</option>
              <option value="3 month">3 Months</option>
              <option value="6 month">6 Months</option>
              <option value="1 year">1 Year</option>
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-lg border border-white/10 bg-transparent text-sm font-semibold dark:text-primary hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn btn-lg bg-accent-0 text-sm font-semibold dark:text-primary shadow-lg shadow-accent-0/20 hover:bg-accent-0/90 transition-all"
            >
              Create Pack
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
