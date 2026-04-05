import { useState } from "react";
import { usePolicies, usePolicyStats } from "@/hooks/usePolicies";
import StatsCards from "@/components/StatsCards";
import FilterBar from "@/components/FilterBar";
import PolicyTable from "@/components/PolicyTable";

export default function Index() {
  const [filter, setFilter] = useState("all");
  const { data: policies = [], isLoading } = usePolicies(filter);
  const { data: stats, isLoading: statsLoading } = usePolicyStats();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2 h-2 rounded-full bg-primary inline-block"
            style={{ animation: "pulse-dot 1.8s infinite" }}
          />
          <h1 className="text-xl sm:text-2xl font-medium text-foreground">
            African AI Policy Tracker
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Monitoring AI legislation and regulatory proposals across 55 AU member states
        </p>
      </div>

      <StatsCards stats={stats} isLoading={statsLoading} />
      <FilterBar current={filter} onChange={setFilter} />
      <PolicyTable policies={policies} isLoading={isLoading} />

      {/* Footer */}
      <div className="mt-4 flex justify-between text-[11px] text-muted-foreground">
        <span>Data refreshes in real-time. Click any row for details.</span>
        <a
          href="https://github.com/cercuit-ola"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-xs"
        >
          by Samuel Okediji ↗
        </a>
      </div>
    </div>
  );
}
