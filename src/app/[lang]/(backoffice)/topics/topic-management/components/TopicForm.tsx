"use client"
import { useEffect, useState, useTransition } from "react";
import BackArrow from "@/assets/images/icons/back_arrow.svg";
import { Topic, TopicStatus, updateTopic } from "@/app/feature/topic";
import { Tag } from "@/app/feature/topic-tags";
import {
  SkeletonElement,
  SkeletonWrapper,
} from "@/components/SkeletionLoading";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@/app/feature/auth";
import { getTopicTagService } from "@/app/core/server/context";
import FloatInput from "../../../components/FloatInput";
import FloatTextarea from "../../../components/FloatTextarea";
import AutoComplete from "../../../components/AutoComplete";

type InternalState = {
  title: string;
  content: string;
  tags: Tag[];
  slug: string;
  summary: string;
  thumbnailUrl: string;
  tagQ: string;
  status?: TopicStatus;
  suggestions: Tag[];
  loadingButton?: TopicStatus;
};

export type ActionProperites = {
  key: TopicStatus;
  label: string;
  waitingLabel: string;
  className: string;
  onClick?: () => void;
};

const slugify = (text: string) => {
  return (
    text
      .toLowerCase()
      // bỏ dấu tiếng Việt
      .normalize("NFD") // tách ký tự có dấu thành base + dấu
      .replace(/[\u0300-\u036f]/g, "") // xóa dấu
      // thay ký tự đặc biệt, khoảng trắng thành "-"
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") // thay khoảng trắng bằng -
      .replace(/-+/g, "-")
  ); // gộp nhiều dấu - liên tiếp
};

const initialState: InternalState = {
  title: "",
  content: "",
  slug: "",
  summary: "",
  thumbnailUrl: "",
  tags: [],
  suggestions: [],
  tagQ: "",
  loadingButton: undefined,
};

const topicMode = (pathname: string, id?: string) => {
  if (pathname.endsWith("/create") && !id) return "create";
  if (pathname.endsWith("/edit") && id) return "edit";
  if (pathname.endsWith("/review") && id) return "review";
  if (id) return "view";
  return "unknown";
};

const ActionButtons = ({
  mode,
  isFetching,
  loadingButton,
  mutationPending,
  status,
  onCancel,
  onSubmit,
  onSaveDraft,
  onApprove,
  onReject,
}: {
  mode: "create" | "edit" | "review" | "view" | "unknown";
  isFetching: boolean;
  mutationPending: boolean;
  status?: TopicStatus;
  loadingButton?: TopicStatus;
  onCancel?: () => void;
  onSubmit?: () => void;
  onSaveDraft?: () => void;
  onReject?: () => void;
  onApprove?: () => void;
}) => {
  const actionButtonProperties: Record<TopicStatus, ActionProperites> = {
    draft: {
      key: "draft",
      label: "Save as Draft",
      waitingLabel: "Saving...",
      className: "dark:bg-surface-2 hover:dark:bg-surface-0 dark:text-primary",
      onClick: onSaveDraft,
    },
    submit: {
      key: "submit",
      label: "Submit",
      waitingLabel: "Submitting...",
      className: "dark:bg-accent-0 hover:dark:bg-accent-1",
      onClick: onSubmit,
    },
    approve: {
      key: "approve",
      label: "Approve",
      waitingLabel: "Approving...",
      className: "dark:bg-accent-0 hover:dark:bg-accent-1",
      onClick: onApprove,
    },
    reject: {
      key: "reject",
      label: "Reject",
      waitingLabel: "Rejecting...",
      className: "dark:bg-alert-1 hover:dark:bg-alert-2",
      onClick: onReject,
    },
  };

  const modeActionConfig: Record<string, Array<TopicStatus>> = {
    create: ["draft", "submit"],
    edit: ["draft", "submit"],
    review: ["approve", "reject"],
    view: [],
  };

  if (mode == "view") return <></>;

  if (isFetching) {
    return (
      <div className="mx-auto mt-6 mb-4 flex flex-row gap-3">
        {modeActionConfig[mode].map((_, idx) => (
          <SkeletonWrapper className="rounded-md" key={idx}>
            <SkeletonElement width="80px" height="40px" />
          </SkeletonWrapper>
        ))}
      </div>
    );
  }
  return (
    <>
      <div className="mt-6 mb-4 mx-auto flex flex-row gap-3">
        {modeActionConfig[mode].map((k) => {
          const { className, label, waitingLabel, onClick } =
            actionButtonProperties[k];
          return (
            <button
              key={k}
              disabled={
                (mutationPending && loadingButton == k) ||
                (status === "approve" && k === "approve") ||
                (status === "reject" && k === "reject")
              }
              type="button"
              className={`btn btn-sm cursor-pointer transition-colors ${className}`}
              onClick={onClick}
            >
              {mutationPending && loadingButton == k ? waitingLabel : label}
            </button>
          );
        })}

        <button
          disabled={mutationPending}
          type="button"
          className="btn btn-sm dark:border-secondary dark:border dark:text-primary hover:dark:bg-secondary cursor-pointer transition-colors"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

type Props = {
  id: string;
  user: User;
  topic: Topic;
};

export default function TopicForm({ id, user, topic }: Props) {
  const [state, setState] = useState<InternalState>({
    ...initialState,
    thumbnailUrl: topic.thumbnailUrl || "",
    title: topic.title || "",
    content: topic.content || "",
    tags: topic.tags || [],
    slug: topic.slug || "",
    summary: topic.summary || "",
    status: topic.status,
  });

  const pathname = usePathname();
  const mode = topicMode(pathname, id);
  const [pending, startTransition] = useTransition();
  const userId = user?.id;
  const authorName = user?.username || user?.email;
  const router = useRouter();

  const updateState = (val: Partial<InternalState>) => {
    setState((prev) => ({ ...prev, ...val }));
  };

  useEffect(() => {
    const titleSlug = slugify(state.title);
    setState((prev) => ({ ...prev, slug: titleSlug }));
  }, [state.title]);

  useEffect(() => {
    startTransition(async () => {
      const res = await getTopicTagService().search(
        { keyword: state.tagQ },
        { tags: ["topic-tag-search"] },
        false,
        false
      );
      updateState({ suggestions: res.list });
    });
  }, [state.tagQ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateState({ [name]: value });
  };

  const handleEditorChange = (content: string) => {
    setState((prev) => ({ ...prev, content }));
  };

  const handleQChange = (text: string) => {
    updateState({ tagQ: text });
  };

  const handleCancel = () => {
    return router.back();
  };
  const handleSubmit = async (status: TopicStatus) => {
    if (!userId) {
      console.error("No user id found in cookies. Aborting submit.");
      return;
    }
  };

  const handleApprove = async () => {
    if (!userId) {
      console.error("No user id found in cookies. Aborting submit.");
      return;
    }
    updateState({
      loadingButton: "approve",
    });

    startTransition(async () => {
      try {
        await updateTopic(id, { status: "approve" });
      } catch (err) {
        console.error(err);
        updateState({ loadingButton: undefined });
      }
    });
  };

  const handleReject = async () => {
    if (!userId) {
      console.error("No user id found in cookies. Aborting submit.");
      return;
    }
    updateState({
      loadingButton: "reject",
    });
    try {
      await updateTopic(id, { status: "reject" });
    } catch (err) {
      console.error(err);
      updateState({ loadingButton: undefined });
    }
  };

  const {
    title,
    content,
    summary,
    thumbnailUrl,
    slug,
    tags,
    suggestions,
    status,
    tagQ,
    loadingButton,
  } = state;
  return (
    <>
      <div className="flex flex-col h-screen items-start mx-auto max-w-300 p-6">
        <div className="flex flex-row mt-8 mb-6 items-center gap-4 group">
          <div
            className="rounded-full shadow size-8 flex items-center justify-center p-2 dark:bg-surface-2 transition cursor-pointer  group-hover:dark:bg-orange-500"
            onClick={handleCancel}
          >
            <BackArrow className="hover:underline group-hover:dark:fill-primary dark:fill-accent-0" />
          </div>

          <div className="text-2xl font-semibold dark:text-accent-0 ">
            {mode === "create"
              ? "Topic Create"
              : mode === "edit"
              ? "Topic Edit"
              : mode === "review"
              ? "Topic Review"
              : "Topic View"}
          </div>
        </div>
        <form className="flex flex-col gap-4 w-full">
          <div className="flex flex-row flex-wrap mb-4 gap-4">
            <div className="flex flex-col items-start flex-1 min-w-0">
              <div className="w-full h-12">
                {!pending ? (
                  <FloatInput
                    onChange={handleChange}
                    name={"title"}
                    value={title}
                    disable={mode === "view" || mode === "review"}
                    label={"Title"}
                  />
                ) : (
                  <SkeletonWrapper className="rounded-md">
                    <SkeletonElement width="100%" height="100%" />
                  </SkeletonWrapper>
                )}
              </div>
              <p
                className={`text-xs text-tertiary-0 w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-start mt-2 `}
              >
                <>
                  <span className="font-bold text-secondary shrink-0">
                    Topic URL:
                  </span>{" "}
                  <a
                    href={"https://localhost:5137/topics/" + slug}
                    className="underline cursor-pointer italic overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {slug.length != 0 ? (
                      "https://localhost:5137/topics/" + slug
                    ) : (
                      <span>{"https://example/some-thing-like-this</span"}</span>
                    )}
                  </a>
                </>
              </p>
            </div>

            <div className="flex flex-row items-center gap-4 flex-1 focus-within:[&>label]:dark:text-accent-0 h-12">
              {!pending ? (
                <AutoComplete<Tag>
                  name={"tags"}
                  label={"Tag"}
                  onTagChange={(newSelected) =>
                    updateState({ tags: newSelected })
                  }
                  disable={mode === "view" || mode === "review"}
                  suggestions={suggestions}
                  maxTags={4}
                  q={tagQ}
                  selected={tags}
                  onQChange={handleQChange}
                />
              ) : (
                <SkeletonWrapper className="rounded-md">
                  <SkeletonElement width="100%" height="100%" />
                </SkeletonWrapper>
              )}
            </div>
          </div>
          <div className="flex flex-row items-center gap-4 mb-4 focus-within:[&>label]:dark:text-accent-0">
            <div className="w-full h-12">
              {!pending ? (
                <FloatInput
                  disable={mode === "view" || mode === "review"}
                  onChange={handleChange}
                  name={"thumbnailUrl"}
                  value={thumbnailUrl}
                  label={"ThumbnailURL"}
                />
              ) : (
                <SkeletonWrapper className="rounded-md">
                  <SkeletonElement width="100%" height="100%" />
                </SkeletonWrapper>
              )}
            </div>
          </div>
          <div className="w-full h-30 mb-4">
            {!pending ? (
              <FloatTextarea
                disable={mode === "view" || mode === "review"}
                onChange={handleChange}
                name={"summary"}
                value={summary}
                label={"Summary"}
              />
            ) : (
              <SkeletonWrapper className="rounded-md">
                <SkeletonElement width="100%" height="100%" />
              </SkeletonWrapper>
            )}
          </div>
          <div className="w-full min-h-80 rounded-lg overflow-hidden">
            {!pending ? (
              //   <CKEditorComponent
              //     content={content}
              //     onChange={handleEditorChange}
              //     licenseKey={import.meta.env.VITE_CKEDITOR_LICENSE_KEY}
              //     disable={mode === "view" || mode === "review"}
              //   />
              <></>
            ) : (
              <SkeletonWrapper className="rounded-lg w-full">
                <SkeletonElement width="100%" height="100%" />
              </SkeletonWrapper>
            )}
          </div>
          <ActionButtons
            mode={mode}
            isFetching={pending}
            loadingButton={loadingButton}
            mutationPending={pending}
            onSaveDraft={() => handleSubmit("draft")}
            onSubmit={() => handleSubmit("submit")}
            onCancel={handleCancel}
            onApprove={handleApprove}
            status={status}
            onReject={handleReject}
          />
        </form>
      </div>
    </>
  );
}
