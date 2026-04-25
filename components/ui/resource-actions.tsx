"use client";

type ResourceActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
  extraActions?: React.ReactNode;
};

function PencilIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20h4l10-10-4-4L4 16v4Z" />
      <path d="m12 6 4 4" />
    </svg>
  );
}

function BinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 12h10l1-12" />
      <path d="M9 4h6l1 3H8l1-3Z" />
    </svg>
  );
}

export function ResourceActions({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
  extraActions,
}: ResourceActionsProps) {
  return (
    <div className="resource-actions">
      {extraActions}
      <button className="icon-button" type="button" onClick={onEdit} aria-label={editLabel} title={editLabel}>
        <PencilIcon />
      </button>
      <button
        className="icon-button danger"
        type="button"
        onClick={onDelete}
        aria-label={deleteLabel}
        title={deleteLabel}
      >
        <BinIcon />
      </button>
    </div>
  );
}
