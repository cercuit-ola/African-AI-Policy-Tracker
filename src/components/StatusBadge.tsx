const STATUS_MAP: Record<string, { label: string; bg: string; fg: string }> = {
  enacted: { label: "Enacted", bg: "bg-status-enacted-bg", fg: "text-status-enacted-fg" },
  review: { label: "In review", bg: "bg-status-review-bg", fg: "text-status-review-fg" },
  draft: { label: "Draft", bg: "bg-status-draft-bg", fg: "text-status-draft-fg" },
  proposed: { label: "Proposed", bg: "bg-status-proposed-bg", fg: "text-status-proposed-fg" },
  withdrawn: { label: "Withdrawn", bg: "bg-status-withdrawn-bg", fg: "text-status-withdrawn-fg" },
};

export default function StatusBadge({ status }: { status: string | null }) {
  const s = STATUS_MAP[status ?? ""] ?? STATUS_MAP.proposed;
  return (
    <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${s.bg} ${s.fg}`}>
      {s.label}
    </span>
  );
}
