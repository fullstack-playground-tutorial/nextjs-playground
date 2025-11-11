// src/app/[lang]/(backoffice)/topics/tags/components/DeleteForm.tsx
"use client";
import BinIcon from "@/assets/images/icons/bin.svg";
import { deleteTag } from "@/app/feature/topic-tags";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  id: string;
};

export default function DeleteForm({ id }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleCloseModal() {
    router.back();
  }

  const deleteTagWithId = deleteTag.bind(null, id);
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

        <div className="lg:px-6 px-4 pt-4 max-h-[70vh] flex flex-col gap-4">
          <div className="text-base font-medium">{`Are you sure you want to delete ${id}?`}</div>
          <div className="flex flex-row gap-3 items-end justify-center pb-3">
          <button
            onClick={handleCloseModal}
            type="submit"
            className="btn btn-sm dark:border-secondary dark:border dark:text-primary hover:dark:bg-secondary cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            formAction={deleteTagWithId}
            className="btn btn-sm dark:bg-alert-1 dark:text-primary hover:dark:bg-alert-2 cursor-pointer transition-colors"
          >
            Delete
          </button>
        </div>
        </div>
        
      </div>
    </>
  );
}
