import type { Policy } from "@/hooks/usePolicies";
import StatusBadge from "./StatusBadge";
import PolicyDetailDialog from "./PolicyDetailDialog";
import { useState } from "react";

function fmt(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

interface PolicyTableProps {
  policies: Policy[];
  isLoading: boolean;
}

export default function PolicyTable({ policies, isLoading }: PolicyTableProps) {
  const [selected, setSelected] = useState<Policy | null>(null);

  return (
    <>
      <div className="border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-card">
              <tr>
                {["#", "Document / Author", "Country", "Type", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground border-b border-border"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`transition-opacity ${isLoading ? "opacity-40" : ""}`}>
              {policies.map((p, i) => (
                <tr
                  key={p.id}
                  className="border-b border-border/50 hover:bg-card/60 cursor-pointer transition-colors"
                  onClick={() => setSelected(p)}
                >
                  <td className="px-4 py-3 text-xs text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium leading-snug text-foreground">{p.title}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{p.author}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="mr-1.5 text-base">{p.flag}</span>
                    <span className="text-foreground">{p.country}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-badge text-badge-foreground border border-badge-border whitespace-nowrap">
                      {p.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {fmt(p.published_at)}
                  </td>
                </tr>
              ))}
              {policies.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No policies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <PolicyDetailDialog policy={selected} onClose={() => setSelected(null)} />
    </>
  );
}
