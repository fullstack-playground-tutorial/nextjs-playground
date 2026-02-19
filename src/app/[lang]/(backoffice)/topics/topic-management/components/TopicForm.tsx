"use client";
import { useEffect, useState, useTransition } from "react";
import BackArrow from "@/assets/images/icons/back_arrow.svg";
import { createTopic, Topic, updateTopic } from "@/app/feature/topic";
import { Tag } from "@/app/feature/tags";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { User } from "@/app/feature/auth";
import FloatInput from "../../../components/FloatInput";
import FloatTextarea from "../../../components/FloatTextarea";
import AutoComplete from "../../../components/AutoComplete";
import dynamic from "next/dynamic";
import useToast from "@/components/Toast";
import {
  ActionButtons,
  ActionStatus,
} from "../../../components/ActionButtons/ActionButtons";

const CKEditorComponent = dynamic(
  () => import("../../../components/CKEditor"),
  { ssr: false }
);

type InternalState = {
  topic: Topic;
  tagQ: string;
  suggestions: Tag[];
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

let initialState: InternalState = {
  topic: {
    id: "",
    title: "",
    content: "",
    slug: "",
    summary: "",
    thumbnailUrl: "",
    tags: [],
  },
  suggestions: [],
  tagQ: "",
};

const topicMode = (pathname: string, id?: string) => {
  if (pathname.endsWith("/create") && !id) return "create";
  if (pathname.endsWith("/edit") && id) return "edit";
  if (pathname.endsWith("/review") && id) return "review";
  if (id) return "view";
  return "unknown";
};

type Props = {
  user: User;
  topic?: Topic;
  tagSuggestions?: Tag[];
};

export default function TopicForm({ user, topic, tagSuggestions }: Props) {
  if (topic) {
    initialState = {
      ...initialState,
      topic: {
        ...topic,
        thumbnailUrl: topic?.thumbnailUrl || "",
        title: topic?.title || "",
        content: topic?.content || "",
        tags: topic?.tags || [],
        slug: topic?.slug || "",
        summary: topic?.summary || "",
        status: topic?.status,
      },
    };
  }

  const [state, setState] = useState<InternalState>(initialState);

  const licenseKey = process.env.NEXT_PUBLIC_CKEDITOR_LICENSE_KEY || "";
  const urlSearchParam = useSearchParams();
  const pathname = usePathname();
  const mode = topicMode(pathname, topic?.id);
  const [submitting, startSubmitting] = useTransition();
  const [approving, startApproving] = useTransition();
  const [rejecting, startRejecting] = useTransition();
  const [drafting, startDrafting] = useTransition();
  const userId = user?.id;
  const router = useRouter();
  const [debouncedValue, setDebouncedValue] = useState(state.tagQ);
  const toast = useToast();
  useEffect(() => {
    const titleSlug = slugify(state.topic.title);
    setState((prev) => ({ ...prev, slug: titleSlug }));
  }, [state.topic.title]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(state.tagQ);
    }, 400);
    return () => clearTimeout(handler);
  }, [state.tagQ]);

  useEffect(() => {
    const newSearchParam = new URLSearchParams(urlSearchParam);
    if (state.tagQ) {
      newSearchParam.set("tag_q", state.tagQ);
    } else {
      newSearchParam.delete("tag_q");
    }
    router.replace(`${pathname}?${newSearchParam.toString()}`);
  }, [debouncedValue]);

  const updateState = (val: Partial<InternalState>) => {
    setState((prev) => ({ ...prev, ...val }));
  };

  function getChangedFields(initialObj: any, currentObj: any) {
    const changed: Record<string, any> = {};

    for (const key of Object.keys(currentObj)) {
      if (currentObj[key] !== initialObj[key]) {
        changed[key] = currentObj[key];
      }
    }

    return changed;
  }

  const statusColor = (status: ActionStatus) => {
    switch (status) {
      case "submit":
        return "border-2 border-accent-0 text-accent-0"; // cam
      case "draft":
        return "border-2 border-secondary text-secondary"; // xam
      case "reject":
        return "border-2 border-alert-1 text-alert-0"; // do
      case "approve":
        return "border-2 border-success text-success"; // xanh la
      default:
        return "";
    }
  };

  const handleTopicChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let newTopic: Topic = { ...state.topic };
    (newTopic as any)[name] = value;
    updateState({ topic: newTopic });
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

  const handleDraft = async () => {
    startDrafting(async () => {
      if (mode == "create") {
        try {
          const { successMsg } = await createTopic({
            ...state.topic,
            status: "draft",
          });
          toast.addToast("success", successMsg);
          router.replace("/topics/topic-management");
        } catch (error: any) {
          toast.addToast("error", error.message);
        }
      } else if (mode == "edit" && topic?.id) {
        const changedFields = getChangedFields(initialState.topic, state.topic);
        try {
          const { successMsg } = await updateTopic(topic.id, {
            ...changedFields,
            status: "draft",
          });
          toast.addToast("success", successMsg);
          router.replace("/topics/topic-management");
        } catch (error: any) {
          toast.addToast("error", error.message);
        }
      }
    });
  };
  const handleSubmit = async () => {
    startSubmitting(async () => {
      if (mode == "create") {
        try {
          const { successMsg } = await createTopic({
            ...state.topic,
            status: "submit",
          });
          toast.addToast("success", successMsg);
        } catch (error: any) {
          toast.addToast("error", error.message);
        }
      } else if (mode == "edit" && topic?.id) {
        const changedFields = getChangedFields(initialState.topic, state.topic);
        try {
          const { successMsg } = await updateTopic(topic.id, {
            ...changedFields,
            status: "submit",
          });
          toast.addToast("success", successMsg);
          router.replace("/topics/topic-management");
        } catch (error: any) {
          toast.addToast("error", error.message);
        }
      }
    });
  };

  const handleApprove = async () => {
    if (userId && topic?.id) {
      startApproving(async () => {
        try {
          const { successMsg } = await updateTopic(topic?.id, {
            status: "approve",
          });
          toast.addToast("success", successMsg);
          router.replace("/topics/topic-management");
        } catch (error: any) {
          toast.addToast("error", error.message);
        }
      });
    }
  };

  const handleReject = async () => {
    if (userId && topic?.id) {
      startRejecting(async () => {
        try {
          const { successMsg } = await updateTopic(topic?.id, {
            status: "reject",
          });
          toast.addToast("success", successMsg);
        } catch (error: any) {
          toast.addToast("error", error.message);
        }
      });
    }
  };

  const { tagQ, topic: topicInternal } = state;
  const { title, content, summary, thumbnailUrl, slug, tags, status } =
    topicInternal;
  return (
    <>
      <div className="flex flex-col h-screen items-start mx-auto max-w-300 p-6">
        <div className="flex flex-row justify-between mt-8 mb-6 items-center group w-full">
          <div className="flex flex-row gap-4">
            <div
              className="rounded-full shadow size-8 flex items-center justify-center p-2 dark:bg-surface-2 transition cursor-pointer  group-hover:dark:bg-orange-500"
              onClick={handleCancel}
            >
              <BackArrow className="hover:underline group-hover:dark:fill-primary dark:fill-accent-0" />
            </div>
            <div className="text-2xl font-semibold dark:text-accent-0 items-center">
              {mode === "create"
                ? "Topic Create"
                : mode === "edit"
                  ? "Topic Edit" + " - " + topic?.id
                  : mode === "review"
                    ? "Topic Review" + " - " + topic?.id
                    : "Topic View" + " - " + topic?.id}{" "}
            </div>
          </div>
          {status && (
            <span
              className={
                "text-xl dark:bg-surface-1 bordercontent-center shadow px-2 py-1 " +
                statusColor(status)
              }
            >
              {status}
            </span>
          )}
        </div>
        <form className="flex flex-col gap-4 w-full">
          <div className="flex flex-row flex-wrap mb-4 gap-4">
            <div className="flex flex-col items-start flex-1 min-w-0">
              <div className="w-full h-12">
                <FloatInput
                  onChange={handleTopicChange}
                  name={"title"}
                  value={title}
                  disable={mode === "view" || mode === "review"}
                  label={"Title"}
                  required
                />
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
                      <span>
                        {"https://example/some-thing-like-this</span"}
                      </span>
                    )}
                  </a>
                </>
              </p>
            </div>

            <div className="flex flex-row items-center gap-4 flex-1 focus-within:[&>label]:dark:text-accent-0 h-12">
              <AutoComplete<Tag>
                name={"tags"}
                label={"Tag"}
                onTagChange={(newSelected) =>
                  updateState({ topic: { ...state.topic, tags: newSelected } })
                }
                disable={mode === "view" || mode === "review"}
                suggestions={tagSuggestions || []}
                maxTags={4}
                q={tagQ}
                selected={tags}
                onQChange={handleQChange}
              />
            </div>
          </div>
          <div className="flex flex-row items-center gap-4 mb-4 focus-within:[&>label]:dark:text-accent-0">
            <div className="w-full h-12">
              <FloatInput
                disable={mode === "view" || mode === "review"}
                onChange={handleTopicChange}
                name={"thumbnailUrl"}
                value={thumbnailUrl}
                label={"ThumbnailURL"}
              />
            </div>
          </div>
          <div className="w-full h-30 mb-4">
            <FloatTextarea
              disable={mode === "view" || mode === "review"}
              onChange={handleTopicChange}
              name={"summary"}
              value={summary}
              label={"Summary"}
            />
          </div>
          <div className="w-full min-h-80 dark:border dark:border-border rounded-md overflow-hidden">
            <CKEditorComponent
              content={content}
              onChange={handleEditorChange}
              licenseKey={licenseKey}
              disable={mode === "view" || mode === "review"}
            />
          </div>
          <ActionButtons
            mode={mode}
            mutationPendings={{
              draft: drafting,
              submit: submitting,
              reject: rejecting,
              approve: approving,
            }}
            onSaveDraft={() => handleDraft()}
            onSubmit={() => handleSubmit()}
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
