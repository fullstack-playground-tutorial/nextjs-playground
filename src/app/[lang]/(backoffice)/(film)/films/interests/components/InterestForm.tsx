//src/app/[lang]/(backoffice)/(film)/films/interests/components/UpsertForm.tsx
"use client";
import { upsertInterest } from "@/app/feature/film-interest/action";
import { Tag } from "@/app/feature/tags";
import useToast from "@/components/Toast";
import { useRouter } from "next/navigation";
import { use, useActionState, useEffect } from "react";

type Props = {
  interestPromise?: Promise<Tag | undefined>;
};

export type UpsertActionState = {
  successMessage?: string;
  error?: any;
};

export default function InterestForm({ interestPromise }: Props) {
  const toast = useToast();

  const [{ error, successMessage }, formAction, pending] = useActionState<
    UpsertActionState,
    FormData
  >(upsertInterest, {});
  const router = useRouter();
  const interest = interestPromise ? use(interestPromise) : undefined;
  function handleCloseModal() {
    router.back();
  }

  useEffect(() => {
    if (error) {
      toast.addToast("error", error.message);
    }
  }, [error]);

  useEffect(() => {
    if (successMessage) {
      toast.addToast("success", successMessage);
      router.back();
    }
  }, [successMessage]);

  return (
    <div className="relative h-full w-full flex items-center justify-center p-4">
      <div
        className={`w-full h-full dark:text-primary dark:bg-surface-0 border border-border rounded-lg shadow-xl outline-none`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-border">
          <div
            id="modal-title"
            className="text-base font-semibold dark:text-primary"
          >
            {interest?.id ? "Edit Interest" : "Create Interest"}
          </div>
        </div>
        <div className="lg:px-6 px-4 pt-4 max-h-[70vh]">
          <form className="flex flex-col items-start max-w-300 gap-4 dark:bg-surface-0">
            {interest && interest.id && <input type="hidden" name="id" value={interest.id} />}
            <div className="flex flex-row items-center gap-4">
              <label
                htmlFor="title"
                className="text-base font-medium w-20 text-left dark:text-primary"
              >
                Title
              </label>
              <input
                type="text"
                className="rounded-md outline-none px-3 py-2 h-10 text-base dark:bg-surface-1 dark:border-border dark:border shadow w-50"
                placeholder="Enter title"
                name="title"
                defaultValue={interest?.title || ""}
              />
            </div>
            <div className="flex flex-row items-center gap-4">
              <label
                htmlFor="slug"
                className="text-base font-medium w-20 text-left dark:text-primary"
              >
                Slug
              </label>
              <input
                type="text"
                className="rounded-md outline-none px-3 py-2 h-10 text-base dark:bg-surface-1 dark:border-border dark:border shadow w-50"
                placeholder="Enter slug"
                name="slug"
                defaultValue={interest?.slug || ""}
              />
            </div>
            <div className="flex flex-row items-center gap-4">
              <label
                htmlFor="description"
                className="text-base font-medium w-20 text-left dark:text-primary"
              >
                Description
              </label>
              <textarea
                className="rounded-md outline-none text-base px-3 py-2 dark:bg-surface-1 dark:border-border dark:border resize-none shadow w-80"
                placeholder="Enter Description"
                name="description"
                defaultValue={interest?.description || ""}
              />
            </div>
            <div className="flex flex-row items-center gap-4">
              <label
                htmlFor="color"
                className="text-base font-medium w-20 text-left dark:text-primary"
              >
                Tag color
              </label>
              <div className="flex flex-row items-center rounded-md outline-none px-3 py-2 h-10 text-base dark:bg-surface-1 dark:border-border dark:border shadow">
                <p className="h-full w-full">{interest?.color || ""}</p>
                <input
                  type="color"
                  className="h-full text-baseshadow"
                  name="color"
                  defaultValue={interest?.color || ""}
                />
              </div>
            </div>
            <div className="flex flex-row gap-3 mx-auto pt-2 pb-6 px-8">
              <button
                type="button"
                className="btn btn-sm dark:border-secondary dark:border dark:text-primary hover:dark:bg-secondary cursor-pointer transition-colors"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-sm dark:bg-accent-0 dark:text-primary hover:dark:bg-accent-1 cursor-pointer transition-colors"
                formAction={formAction}
              >
                {interest?.id
                  ? !pending
                    ? "Edit"
                    : "Editing ..."
                  : !pending
                    ? "Create"
                    : "Creating ..."}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
