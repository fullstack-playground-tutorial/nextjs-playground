export type ActionStatus = "submit" | "draft" | "approve" | "reject" | "archive" | "publish" | "close";

export type ActionProperites = ButtonAppearance & {
  key: ActionStatus;
  onClick?: () => void;
};

type ButtonAppearance = {
  label: string;
  waitingLabel: string;
  className: string;
  hidden?: boolean;
}

export const ActionButtons = ({
  mode,
  mutationPendings,
  status,
  onCancel,
  onSubmit,
  onSaveDraft,
  onApprove,
  onReject,
  onArchive,
  onPublish,
  onClose,
  modeActionConfig,
  buttonAppearanceConfig,
}: {
  mode: "create" | "edit" | "review" | "view" | "unknown";
  mutationPendings: Partial<Record<ActionStatus, boolean>>;
  status?: ActionStatus;
  modeActionConfig?: Record<string, Array<ActionStatus>>;
  buttonAppearanceConfig?: Partial<Record<ActionStatus, ButtonAppearance>>;
  onCancel?: () => void;
  onSubmit?: () => void;
  onSaveDraft?: () => void;
  onReject?: () => void;
  onApprove?: () => void;
  onArchive?: () => void;
  onPublish?: () => void;
  onClose?: () => void;
}) => {
  const actionButtonProperties: Record<ActionStatus, ActionProperites> = {
    draft: {
      key: "draft",
      label: "Save as Draft",
      waitingLabel: "Saving...",
      className: "dark:bg-surface-2 hover:dark:bg-surface-0 dark:text-primary",
      ...buttonAppearanceConfig?.draft,
      onClick: onSaveDraft,
    },
    submit: {
      key: "submit",
      label: "Submit",
      waitingLabel: "Submitting...",
      className: "dark:bg-accent-0 hover:dark:bg-accent-1",
      ...buttonAppearanceConfig?.submit,
      onClick: onSubmit,
    },
    publish: {
      key: "publish",
      label: "Publish",
      waitingLabel: "Publishing...",
      className: "dark:bg-accent-0 hover:dark:bg-accent-1",
      ...buttonAppearanceConfig?.publish,
      onClick: onPublish,
    },
    approve: {
      key: "approve",
      label: "Approve",
      waitingLabel: "Approving...",
      hidden: status == "approve",
      className: "dark:bg-accent-0 hover:dark:bg-accent-1",
      ...buttonAppearanceConfig?.approve,
      onClick: onApprove,
    },
    reject: {
      key: "reject",
      label: "Reject",
      hidden: status == "reject",
      waitingLabel: "Rejecting...",
      className: "dark:bg-alert-1 hover:dark:bg-alert-2",
      ...buttonAppearanceConfig?.reject,
      onClick: onReject,
    },
    archive: {
      key: "archive",
      label: "Archive",
      waitingLabel: "Archiving...",
      className: "dark:bg-alert-1 hover:dark:bg-alert-2",
      ...buttonAppearanceConfig?.archive,
      onClick: onArchive,
    },
    close: {
      key: "close",
      label: "Close",
      waitingLabel: "Closing...",
      className: "dark:bg-alert-1 hover:dark:bg-alert-2",
      ...buttonAppearanceConfig?.close,
      onClick: onClose,
    }
  };

  const _modeActionConfig: Record<string, Array<ActionStatus>> = modeActionConfig ?? {
    create: ["draft", "submit"],
    edit: ["draft", "submit"],
    review: ["approve", "reject"],
    view: [],
  };

  if (mode == "view") return <></>;

  return (
    <>
      <div className="mt-6 mb-4 mx-auto flex flex-row gap-3">
        {_modeActionConfig[mode].map((k) => {
          const { className, label, waitingLabel, onClick, hidden } =
            actionButtonProperties[k];
          return (
            <button
              key={k}
              disabled={
                mutationPendings[k] ||
                (status === "approve" && k === "approve") ||
                (status === "reject" && k === "reject")
              }
              hidden={hidden}
              type="button"
              className={`btn btn-sm cursor-pointer transition-colors ${className}`}
              onClick={onClick}
            >
              {mutationPendings[k] ? waitingLabel : label}
            </button>
          );
        })}

        <button
          disabled={Object.values(mutationPendings).some((v) => v === true)}
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
