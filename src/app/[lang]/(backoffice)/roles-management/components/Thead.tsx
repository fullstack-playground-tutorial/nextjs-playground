"use client";
import React, { useState } from "react";
import ThreeDot from "@/assets/images/icons/three_dot.svg";
import BinIcon from "@/assets/images/icons/bin.svg";
import EditIcon from "@/assets/images/icons/edit.svg";
import DuplicateIcon from "@/assets/images/icons/duplicate.svg";
import { deleteRole } from "@/app/feature/role";
import useToast from "@/components/Toast";
import { ResponseError } from "@/app/utils/exception/model/response-error";
import FloatInput from "../../components/FloatInput";
type Props = {
  id: string;
  title: string;
  mode?: "view" | "edit" | "create";
  onSetProperties: (id: string, title: string) => Promise<boolean>;
  onDuplicate: (id: string) => void;
  onCancel?: () => void;
};

type InternalState = {
  mode: "view" | "edit" | "create";
  title: string;
  id: string;
  tooltipShow: boolean;
};

export default function Thead({
  id,
  title,
  onSetProperties,
  onDuplicate,
  mode: propsMode,
  onCancel,
}: Props) {
  const toast = useToast();
  const [state, setState] = useState<InternalState>({
    mode: propsMode || "view",
    title,
    id,
    tooltipShow: false,
  });

  const { mode, tooltipShow } = state;
  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleIdChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState((prev) => ({ ...prev, id: e.target.value, tooltipShow: false }));
  };

  const handleDuplicate = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    onDuplicate(id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const { successMsg } = await deleteRole(id);
      if (successMsg) {
        toast.addToast("success", successMsg);
      }
    } catch (error: any) {
      if (error instanceof ResponseError) {
        if (error.status == 409) {
          toast.addToast(
            "error",
            "Delete role failed. User must be unassigned from this role before deleting"
          );
        }
      } else {
        toast.addToast("error", "Delete role failed");
      }
    }
  };
  const handleSetProperties = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const isSuccess = await onSetProperties(state.id, state.title);
      if (!isSuccess) {
        toast.addToast("error", "Set properties failed");
        return;
      }
      setState((prev) => ({ ...prev, mode: "view" }));
    } catch (error: any) {
      toast.addToast("error", "Set properties failed");
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, mode: "view" }));
    onCancel?.();
  };
  return (
    <th className="px-3 py-2 border border-border dark:text-primary" key={id}>
      <div className="flex flex-col relative">
        <div className="flex flex-row justify-between">
          <div className="dark:text-secondary font-medium text-sm">Role</div>
          <div className="relative">
            <ThreeDot
              className={`size-6 dark:fill-secondary cursor-pointer hover:dark:fill-primary transition ${
                state.mode !== "view"
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              }`}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  tooltipShow: !prev.tooltipShow,
                }))
              }
            />
            <div
              className={`absolute flex flex-col top-full right-0 text-left  min-w-16 z-1 dark:bg-surface-1 rounded transition-opacity overflow-hidden ${
                !tooltipShow ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <div
                onClick={() =>
                  setState({ ...state, mode: "edit", tooltipShow: false })
                }
                className="text-sm font-normal gap-2 whitespace-nowrap flex flex-row px-1.5 py-1 transition hover:text-accent-0 hover:*:fill-accent-0 dark:border-border dark:border dark:hover:bg-surface-2 cursor-pointer"
              >
                <EditIcon className="dark:fill-primary size-5" />
                <div>Edit Properties</div>
              </div>
              <div
                onClick={(e) => handleDuplicate(e, id)}
                className="text-sm font-normal gap-2 whitespace-nowrap flex flex-row px-1.5 py-1 transition hover:text-accent-0 hover:*:fill-accent-0 dark:border-border dark:border dark:hover:bg-surface-2 cursor-pointer"
              >
                <DuplicateIcon className="dark:fill-primary size-5" />
                <div>Dublicate Role</div>
              </div>
              <div
                className="text-sm font-normal whitespace-nowrap gap-2 flex flex-row items-center justify-start px-1.5 py-1 transition hover:text-accent-0 hover:*:fill-accent-0 dark:border-border dark:border dark:hover:bg-surface-2 cursor-pointer"
                onClick={handleDelete}
              >
                <BinIcon className="dark:fill-primary size-5" />
                <div>Delete</div>
              </div>
            </div>
          </div>
        </div>
        <div className="dark:text-primary font-medium text-base text-left">
          {title}{" "}
          <span className="dark:text-secondary dark:bg-surface-1 text-xs w-fit text-left px-1 py-0.5 rounded-lg shadow">
            {id}
          </span>
        </div>

        {(mode == "edit" || mode == "create") && (
          <>
            <div className="dark:text-primary font-medium flex flex-col gap-3 rounded-md text-sm text-left left-0 top-0 z-10 absolute w-full py-2 px-3 bg-surface-2 border border-border">
              <FloatInput
                name={"id"}
                value={state.id}
                label={"Id"}
                disable={mode != "create"}
                onChange={handleIdChange}
              />
              <FloatInput
                name={"title"}
                value={state.title}
                label={"Title"}
                disable={false}
                onChange={handleTitleChange}
              />

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="btn btn-sm dark:bg-accent-0 dark:hover:bg-accent-1 dark:hover:text-primary hover:bg-surface-1 transition flex-1"
                  onClick={(e) => handleSetProperties(e)}
                >
                  Set Properties
                </button>
                <button
                  type="button"
                  className="btn btn-sm dark:border-secondary dark:border dark:hover:bg-secondary dark:hover:text-primary dark:text-secondary transition flex-1"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </th>
  );
}
