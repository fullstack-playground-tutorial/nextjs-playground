"use client";
import { useState } from "react";
import TopicIcon from "@/assets/images/icons/topic.svg";
import EditIcon from "@/assets/images/icons/edit.svg";
import BinIcon from "@/assets/images/icons/bin.svg";
import ApprovalIcon from "@/assets/images/icons/approval.svg";
import { TopicStatus } from "@/app/feature/topic";
import Link from "next/link";
import { Tag } from "@/app/feature/topic-tags";
type Props = {
  id: string;
  thumbnail: string;
  title: string;
  summary: string;
  author: string;
  publishedAt?: Date;
  tags: Tag[];
  status: TopicStatus;
  onDelete?: (id: string) => void;
};

export default function TopicCard({
  id,
  thumbnail,
  title,
  summary,
  author,
  publishedAt,
  tags,
  status,
  onDelete,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const statusColor = (status: TopicStatus) => {
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

  const handleOnDelete = (e: React.MouseEvent) => {
    onDelete?.(id);
  };
  return (
    <div
      key={id}
      className="dark:bg-surface-1 border dark:border-border rounded-md shadow dark:hover:border-border-strong overflow-hidden flex flex-col"
    >
      <div className="w-full h-40 relative">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full flex flex-wrap gap-1 p-1 transition-opacity">
          {tags.map(({ title, id }) => (
            <span
              key={id}
              className="bg-surface-2 text-primary px-2 py-1 rounded-full text-xs"
            >
              {title}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h2 className="text-lg font-bold text-[#e0e0e0]">{title}</h2>
        <p className="dark:text-secondary text-sm line-clamp-3 flex-1">{summary}</p>
        <div className="flex justify-between items-center text-sm text-secondary">
          <span>{author}</span>
          <span>
            {publishedAt !== undefined && publishedAt !== null
              ? new Date(publishedAt).toLocaleDateString()
              : "unknown"}
          </span>
        </div>

        <div className="flex flex-row justify-between items-center mt-2">
          <span
            className={`px-2 py-1 flex w-auto text-center text-xs font-semibold cursor-default ${statusColor(
              status
            )}`}
          >
            {status}
          </span>

          {/* Dropdown (basic) */}
          <div className="relative">
            <button
              className={`px-2 py-1 dark:border rounded-md text-sm w-full text-center transition cursor-pointer ${
                showDropdown
                  ? "dark:text-accent-0 dark:bg-surface-1 dark:border-border-strong dark:font-semibold"
                  : "dark:text-primary dark:bg-surface-2 dark:border-border "
              }`}
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              Actions
            </button>
            {/* Dropdown items (hidden on default) */}
            <div
              className={`absolute top-0 right-full mr-1 h-full flex flex-row items-center justify-center dark:bg-surface-1 border dark:border-border rounded-md shadow-md z-10 transition-all
    ${
      showDropdown
        ? "opacity-100 translate-x-0"
        : "opacity-0 translate-x-2 pointer-events-none"
    }
`}
            >
              <Link
                href={`/topics/topic-management/${id}/review`}
                title="Review"
                aria-disabled={status === "draft"}
                tabIndex={status === "draft" ? -1 : undefined}
                className={`w-full text-left px-2 py-1 text-sm
                items-center dark:enabled:hover:bg-surface-4 transition-colors
                cursor-pointer dark:enabled:hover:*:fill-accent-0 dark:not-enabled:*:fill-secondary ${
                  status === "draft" ? "pointer-events-none" : ""
                }`}
              >
                <ApprovalIcon className="dark:fill-primary size-5" />
              </Link>
              <Link
                href={`/topics/topic-management/${id}/edit`}
                title="Edit"
                aira-disabled={status === "approve"}
                className={`w-full text-left px-2 py-1 text-sm
                items-center dark:enabled:hover:bg-surface-4 transition-colors
                cursor-pointer dark:enabled:hover:*:fill-accent-0 dark:not-enabled:*:fill-secondary ${
                  status === "draft" ? "pointer-events-none" : ""
                }`}
              >
                <EditIcon className="dark:fill-primary size-5" />
              </Link>
              <button
                title="delete"
                className="w-full text-left px-2 py-1 text-sm
                items-center dark:enabled:hover:bg-surface-4 transition-colors
                cursor-pointer dark:enabled:hover:*:fill-accent-0 dark:not-enabled:*:fill-secondary"
                onClick={(e) => handleOnDelete(e)}
              >
                <BinIcon className="dark:fill-primary size-5" />
              </button>
              <Link
                href={`/topics/topic-management/${id}`}
                title="View detail"
                className="w-full text-left px-2 py-1 text-sm
                items-center dark:enabled:hover:bg-surface-4 transition-colors
                cursor-pointer dark:enabled:hover:*:fill-accent-0 dark:not-enabled:*:fill-secondary"
              >
                <TopicIcon className="dark:fill-primary size-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
