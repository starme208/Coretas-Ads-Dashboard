import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type PlanInput, type GeneratedPlan } from "@/lib/routes";
import { type CampaignWithMetrics } from "@/lib/schema";
import { apiRequest } from "@/lib/queryClient";

const CAMPAIGNS_QUERY_KEY = [api.campaigns.list.path] as const;

export function useCampaigns(platform?: string, campaignType?: string) {
  return useQuery({
    queryKey: [...CAMPAIGNS_QUERY_KEY, platform, campaignType],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (platform) params.append('platform', platform);
      if (campaignType) {
        params.append('campaign_type', campaignType);
      }
      const url = params.toString() ? `${api.campaigns.list.path}?${params.toString()}` : api.campaigns.list.path;
      const response = await fetch(url);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
      }
      const data = await response.json();
      return data as CampaignWithMetrics[];
    },
  });
}

export function useGeneratePlan() {
  return useMutation({
    mutationFn: async (input: PlanInput) => {
      const response = await apiRequest(
        api.campaigns.generatePlan.method,
        api.campaigns.generatePlan.path,
        input
      );
      const data = await response.json();
      return api.campaigns.generatePlan.responses[200].parse(data) as GeneratedPlan;
    },
  });
}

export function useExecutePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (plan: GeneratedPlan) => {
      const response = await apiRequest(
        api.campaigns.createFromPlan.method,
        api.campaigns.createFromPlan.path,
        plan
      );
      const data = await response.json();
      return api.campaigns.createFromPlan.responses[201].parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
    },
  });
}
