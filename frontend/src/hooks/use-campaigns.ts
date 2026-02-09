import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type PlanInput, type GeneratedPlan } from "@/lib/routes";
import { type CampaignWithMetrics } from "@/lib/schema";
import { mockData } from "@/lib/mockData";

const CAMPAIGNS_QUERY_KEY = [api.campaigns.list.path] as const;

export function useCampaigns() {
  return useQuery({
    queryKey: CAMPAIGNS_QUERY_KEY,
    queryFn: () => mockData.getCampaigns() as Promise<CampaignWithMetrics[]>,
  });
}

export function useGeneratePlan() {
  return useMutation({
    mutationFn: async (input: PlanInput) => {
      const plan = mockData.generatePlan(input);
      return api.campaigns.generatePlan.responses[200].parse(plan) as GeneratedPlan;
    },
  });
}

export function useExecutePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (plan: GeneratedPlan) => {
      const result = mockData.addCampaignsFromPlan(plan);
      return api.campaigns.createFromPlan.responses[201].parse({
        message: result.message,
        campaigns: result.campaigns,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
    },
  });
}
