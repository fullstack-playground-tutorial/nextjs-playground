"use client";
import Modal from "@/components/Modal";
import BinIcon from "@/assets/images/icons/bin.svg";
import { deleteTag } from "@/app/feature/topic-tags";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  showModal: boolean;
  id?: string;
  action: "create" | "edit" | "delete";
};

export default function DeleteForm({ showModal, id, action }: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router =useRouter();
    function onClose(){
        const params = new URLSearchParams(searchParams);
        params.delete("showModal");
        params.delete("action");
        router.replace(`${pathname}?${params.toString()}`);
    }
  return (
    <Modal
      open={showModal && action === "delete" && id !== undefined}
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
            type="button"
            className="btn btn-md dark:border-secondary dark:border dark:text-primary hover:dark:bg-secondary cursor-pointer transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-md dark:bg-alert-0 dark:text-primary hover:dark:bg-alert-1 cursor-pointer transition-colors"
            formAction={async () =>{await deleteTag(id!)}}
          >
            Delete
          </button>
        </div>
      }
    />
  );
}
