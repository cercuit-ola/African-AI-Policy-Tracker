import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Policy = {
  id: string;
  title: string;
  author: string;
  country: string;
  flag: string | null;
  region: string | null;
  type: string | null;
  status: string | null;
  summary: string | null;
  source_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PolicyStats = {
  total: number;
  countries: number;
  recentUpdates: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
};

export function usePolicies(typeFilter: string) {
  return useQuery({
    queryKey: ["policies", typeFilter],
    queryFn: async () => {
      let query = supabase
        .from("policies")
        .select("*")
        .order("published_at", { ascending: false });

      if (typeFilter !== "all") {
        query = query.eq("type", typeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Policy[];
    },
  });
}

export function usePolicyStats() {
  return useQuery({
    queryKey: ["policy-stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("policies").select("*");
      if (error) throw error;

      const policies = data as Policy[];
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const byStatus: Record<string, number> = {};
      const byType: Record<string, number> = {};
      const countries = new Set<string>();
      let recentUpdates = 0;

      for (const p of policies) {
        if (p.status) byStatus[p.status] = (byStatus[p.status] || 0) + 1;
        if (p.type) byType[p.type] = (byType[p.type] || 0) + 1;
        countries.add(p.country);
        if (new Date(p.updated_at) >= monthStart) recentUpdates++;
      }

      return {
        total: policies.length,
        countries: countries.size,
        recentUpdates,
        byStatus,
        byType,
      } as PolicyStats;
    },
  });
}
