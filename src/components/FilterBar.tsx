const FILTERS = ["all", "legislation", "regulation", "framework", "policy"] as const;

interface FilterBarProps {
  current: string;
  onChange: (filter: string) => void;
}

export default function FilterBar({ current, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap items-center">
      <span className="text-xs text-muted-foreground">Filter:</span>
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`px-3 py-1 rounded-full text-xs border transition-colors ${
            current === f
              ? "bg-primary text-primary-foreground border-primary font-medium"
              : "bg-transparent text-muted-foreground border-border hover:border-primary/40"
          }`}
        >
          {f === "all" ? "All types" : f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
}
