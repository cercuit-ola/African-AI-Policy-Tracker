import type { PolicyStats } from "@/hooks/usePolicies";

interface StatsCardsProps {
  stats: PolicyStats | undefined;
  isLoading: boolean;
}

const cards = [
  { key: "total", label: "Documents tracked", sub: "Across 55 member states" },
  { key: "active", label: "Active legislation", sub: "Enacted or in review" },
  { key: "recent", label: "Updates this month", sub: "Recent changes" },
  { key: "countries", label: "Countries active", sub: "Of 55 AU members" },
] as const;

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const getValue = (key: string) => {
    if (!stats) return "—";
    if (key === "total") return stats.total;
    if (key === "active") return (stats.byStatus?.enacted ?? 0) + (stats.byStatus?.review ?? 0);
    if (key === "recent") return stats.recentUpdates;
    if (key === "countries") return stats.countries;
    return "—";
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {cards.map((c) => (
        <div
          key={c.key}
          className={`bg-card rounded-lg p-4 transition-opacity ${isLoading ? "opacity-50" : ""}`}
        >
          <div className="text-xs text-muted-foreground mb-1.5">{c.label}</div>
          <div className="text-2xl font-semibold text-foreground">{getValue(c.key)}</div>
          <div className="text-[11px] text-muted-foreground mt-1">{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
