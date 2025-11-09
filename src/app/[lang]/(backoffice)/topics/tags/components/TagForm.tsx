"use client";
import { Suspense, use, useState, type FormEvent } from "react";
import {
  SkeletonElement,
  SkeletonWrapper,
} from "@/components/SkeletionLoading";
import { addTags, Tag } from "@/app/feature/topic-tags";

type Props = {
  tag: Promise<Tag | undefined>;
  onCancel?: () => void;
};

type InternalState = {
  title: string;
  slug: string;
  description?: string;
  color?: string;
  id?: string;
};

export default function TagForm({ onCancel, tag: tagPromise }: Props) {
  const tag = use(tagPromise);
  
  let initialState: InternalState = {
    title: tag?.title || "",
    slug: tag?.slug || "",
    description: tag?.description || "",  
    color: tag?.color || "#ffffff",
    id: tag?.id || undefined
  };

  const [state, setState] = useState(initialState);
  const { slug, description, title, color, id } = state;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addTags(title, slug);
  };

  const updateState = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.value && e.target.name) {
      setState((prev) => ({
        ...prev,
        [e.target.name]: [e.target.value],
      }));
    }
  };

  const ActionButtons = () => {
    const handleCancel = () => {
      onCancel?.();
    };

    return (
      <div className="flex flex-row gap-3 mx-auto pt-2 pb-6 px-8">
        <button
          type="button"
          className="btn btn-md dark:border-secondary dark:border dark:text-primary hover:dark:bg-secondary cursor-pointer transition-colors"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-md dark:bg-accent-0 dark:text-primary hover:dark:bg-accent-1 cursor-pointer transition-colors"
          onClick={(e) => handleSubmit(e)}
        >
          {id ? "Edit" : "Create"}
        </button>
      </div>
    );
  };

  return (
    <>
      <Suspense
        fallback={
          <SkeletonWrapper>
            <div className="flex flex-col items-start max-w-300 gap-4 dark:bg-surface-0">
              <div className="flex flex-row items-center gap-4">
                <SkeletonElement
                  width={"80px"}
                  height={"40px"}
                  borderRadius="8px"
                />
                <SkeletonElement
                  width={"200px"}
                  height={"40px"}
                  borderRadius="8px"
                />
              </div>
              <div className="flex flex-row items-center gap-4">
                <SkeletonElement
                  width={"80px"}
                  height={"40px"}
                  borderRadius="8px"
                />
                <SkeletonElement
                  width={"200px"}
                  height={"40px"}
                  borderRadius="8px"
                />
              </div>
              <div className="flex flex-row items-center gap-4">
                <SkeletonElement
                  width={"80px"}
                  height={"40px"}
                  borderRadius="8px"
                />
                <SkeletonElement
                  width={"320px"}
                  height={"120px"}
                  borderRadius="8px"
                />
              </div>
              <div className="flex flex-row items-center gap-4">
                <SkeletonElement
                  width={"80px"}
                  height={"40px"}
                  borderRadius="8px"
                />
                <SkeletonElement
                  width={"100px"}
                  height={"40px"}
                  borderRadius="8px"
                />
              </div>
              <div className="flex flex-row gap-3 mx-auto pt-2 pb-6 px-8">
                <SkeletonElement
                  width={"100px"}
                  height={"40px"}
                  borderRadius="8px"
                />
                <SkeletonElement
                  width={"100px"}
                  height={"40px"}
                  borderRadius="8px"
                />
              </div>
            </div>
          </SkeletonWrapper>
        }
      >
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
              value={title}
              onChange={(e) => updateState(e)}
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
              value={slug}
              onChange={(e) => updateState(e)}
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
              value={description}
              onChange={(e) => updateState(e)}
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
              <p className="h-full w-full">{color ?? ""}</p>
              <input
                type="color"
                className="h-full text-baseshadow"
                name="color"
                value={color}
                onChange={(e) => updateState(e)}
              />
            </div>
          </div>
          <ActionButtons />
        </form>
      </Suspense>
    </>
  );
}
