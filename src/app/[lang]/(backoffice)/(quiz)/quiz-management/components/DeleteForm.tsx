// src/app/[lang]/(backoffice)/topics/tags/components/DeleteForm.tsx
"use client";
import BinIcon from "@/assets/images/icons/bin.svg";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import useToast from "@/components/Toast";
import { deleteQuiz } from "@/app/feature/quiz";

type Props = {
  id: string;
};

export type ActionState = {
  successMsg?: string;
};

export default function DeleteForm({ id }: Props) {
  const router = useRouter();
  const toast = useToast();

  const [pending, startTransition] = useTransition();
  function handleCloseModal() {
    router.back();
  }

  async function handleDelete(e: React.MouseEvent) {
    try {
      startTransition(async () => {
        const res = await deleteQuiz(id);
        if (res.successMsg) {
          toast.addToast("success", res.successMsg);
          router.back()
        }
      });
    } catch (error: any) {
      toast.addToast("error", error.message);
    }
  }

  return (
    <>
      <div className="relative h-full w-full max-w-lg shadow-xl flex flex-col items-center justify-center px-4 py-3 dark:bg-surface-0 border border-border outline-none rounded-lg">
        <div
          id="modal-title"
          className="flex w-full text-base font-semibold text-gray-900 px-4 py-3 border-b border-border dark:text-gray-100 self-start"
        >
          <div className="flex flex-row gap-2 items-center">
            <BinIcon className="size-5 fill-primary" />
            <h3 className="text-base md:text-xl font-semibold dark:text-primary">
              {"Delete " + id}
            </h3>
          </div>
        </div>

        <form className="lg:px-6 px-4 pt-4 max-h-[70vh] flex flex-col gap-4">
          <div className="text-base font-medium">{`Are you sure you want to delete ${id}?`}</div>
          <div className="flex flex-row gap-3 items-end justify-center pb-3">
            <button
              onClick={handleCloseModal}
              type="button"
              className="btn btn-sm dark:border-secondary dark:border dark:text-primary hover:dark:bg-secondary cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-sm dark:bg-alert-1 dark:text-primary hover:dark:bg-alert-2 cursor-pointer transition-colors"
            >
              {pending ? "Deleting ..." : "Delete"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
