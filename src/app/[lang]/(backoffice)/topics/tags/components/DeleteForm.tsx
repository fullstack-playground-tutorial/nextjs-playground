// src/app/[lang]/(backoffice)/topics/tags/components/DeleteForm.tsx
"use server";
import Modal from "@/components/Modal";
import BinIcon from "@/assets/images/icons/bin.svg";
import { deleteTag } from "@/app/feature/topic-tags";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

type Props = {
  id: string;
  action: "create" | "edit" | "delete";
};

export default async function DeleteForm({ id, action }: Props) {
  const headerList = await headers();
  const queryString = headerList.get("x-query-string");
  const params = new URLSearchParams(queryString || "");
  const pathname = headerList.get("x-pathname");

  async function closeAction(form: FormData) {
    "use server"
    params.delete("showModal");
    params.delete("action");
    redirect(`/topics/tags/${pathname}?${params.toString()}`);
  }

  const deleteTagWithId = deleteTag.bind(null, id);
  return (
    <Modal
      open={action === "delete" && id !== undefined}
      title={
        <div className="flex flex-row gap-2 items-center">
          <BinIcon className="size-5 fill-primary" />
          <h3 className="text-lg md:text-xl font-semibold text-primary">
            {"Delete " + id}
          </h3>
        </div>
      }
      body={`Are you sure you want to delete ${id}?`}
      footer={
        <div className="flex flex-row gap-3 items-center justify-center">
          <button
            formAction={closeAction}
            type="submit"
            className="btn btn-md dark:border-secondary dark:border dark:text-primary hover:dark:bg-secondary cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            formAction={deleteTagWithId}
            className="btn btn-md dark:bg-alert-0 dark:text-primary hover:dark:bg-alert-1 cursor-pointer transition-colors"
          >
            Delete
          </button>
        </div>
      }
    />
  );
}
