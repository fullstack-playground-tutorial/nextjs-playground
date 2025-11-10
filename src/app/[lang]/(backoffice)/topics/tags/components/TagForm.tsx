//src/app/[lang]/(backoffice)/topics/tags/components/TagForm.tsx
"use client";
import { Suspense, use } from "react";
import { addTag, editTag, loadTag, Tag } from "@/app/feature/topic-tags";
import Modal from "@/components/Modal";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import TagFormLoading from "./TagFormLoading";

type Props = {
  id?: string;
  action?: "delete" | "edit" | "create";
  tag?: Tag;
};
export default function TagForm({ tag, id, action }: Props) {

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

   function handleCloseModal(form: FormData) {
    const params = new URLSearchParams(searchParams);
    params.delete("showModal");
    params.delete("action");
    router.replace(`${pathname}?${params.toString()}`);
  }

  async function submitFormAction(form: FormData) {
    if (id) {
      await editTag.bind(null, id)(form);
    } else {
      await addTag(form);
    }
  }

  return (
    <Modal
      open={action === "create" || action === "edit"}
      title={id ? "Edit Tag" : "Create Tag"}
      body={
        <Suspense fallback={<TagFormLoading />}>
          <form className="flex flex-col items-start max-w-300 gap-4 dark:bg-surface-0">
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
                defaultValue={tag?.title || ""}
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
                defaultValue={tag?.slug || ""}
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
                defaultValue={tag?.description || ""}
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
                <p className="h-full w-full">{tag?.color || ""}</p>
                <input
                  type="color"
                  className="h-full text-baseshadow"
                  name="color"
                  defaultValue={tag?.color || ""}
                />
              </div>
            </div>
            <div className="flex flex-row gap-3 mx-auto pt-2 pb-6 px-8">
              <button
                type="submit"
                className="btn btn-md dark:border-secondary dark:border dark:text-primary hover:dark:bg-secondary cursor-pointer transition-colors"
                formAction={handleCloseModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-md dark:bg-accent-0 dark:text-primary hover:dark:bg-accent-1 cursor-pointer transition-colors"
                formAction={submitFormAction}
              >
                {id ? "Edit" : "Create"}
              </button>
            </div>
          </form>
        </Suspense>
      }
    />
  );
}
