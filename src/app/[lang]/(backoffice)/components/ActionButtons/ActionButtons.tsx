export type ActionStatus = "submit" | "draft" | "approve" | "reject";

export type ActionProperites = {
    key: ActionStatus;
    label: string;
    waitingLabel: string;
    className: string;
    hidden?: boolean;
    onClick?: () => void;
  };

export const ActionButtons = ({
    mode,
    mutationPendings,
    status,
    onCancel,
    onSubmit,
    onSaveDraft,
    onApprove,
    onReject,
  }: {
    mode: "create" | "edit" | "review" | "view" | "unknown";
    mutationPendings: Record<ActionStatus, boolean>;
    status?: ActionStatus;
    onCancel?: () => void;
    onSubmit?: () => void;
    onSaveDraft?: () => void;
    onReject?: () => void;
    onApprove?: () => void;
  }) => {
    const actionButtonProperties: Record<ActionStatus, ActionProperites> = {
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
        hidden: status == "approve",
        className: "dark:bg-accent-0 hover:dark:bg-accent-1",
        onClick: onApprove,
      },
      reject: {
        key: "reject",
        label: "Reject",
        hidden: status == "reject",
        waitingLabel: "Rejecting...",
        className: "dark:bg-alert-1 hover:dark:bg-alert-2",
        onClick: onReject,
      },
    };
  
    const modeActionConfig: Record<string, Array<ActionStatus>> = {
      create: ["draft", "submit"],
      edit: ["draft", "submit"],
      review: ["approve", "reject"],
      view: [],
    };
  
    if (mode == "view") return <></>;
  
    return (
      <>
        <div className="mt-6 mb-4 mx-auto flex flex-row gap-3">
          {modeActionConfig[mode].map((k) => {
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