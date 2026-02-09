import { z } from "zod";

// === SCHEMAS (Zod-only, no DB) ===

export const campaignSchema = z.object({
  id: z.number(),
  name: z.string(),
  platform: z.string(),
  type: z.string(),
  status: z.string(),
  objective: z.string(),
  dailyBudget: z.string(),
  productCategories: z.array(z.string()),
  createdAt: z.string().nullable().optional(),
});

export type Campaign = z.infer<typeof campaignSchema>;

// Input for generating a plan
export const planInputSchema = z.object({
  objective: z.enum(["Sales", "Leads"]),
  dailyBudget: z.coerce.number().min(1),
  productCategories: z.string().min(1, "Product categories are required"),
  country: z.string().optional(),
  language: z.string().optional(),
});

export type PlanInput = z.infer<typeof planInputSchema>;

// Structure of the generated plan (Platform Agnostic)
export const generatedPlanSchema = z.object({
  objective: z.string(),
  daily_budget: z.number(),
  geo: z.array(z.string()),
  lang: z.array(z.string()),
  product_categories: z.array(z.string()),
  creative_pack: z.object({
    headlines: z.array(z.string()),
    descriptions: z.array(z.string()),
    long_headlines: z.array(z.string()).optional(),
    primary_texts: z.array(z.string()).optional(),
    callouts: z.array(z.string()).optional(),
    image_urls: z.array(z.string()),
    logo_url: z.string().optional(),
  }),
  targeting_hints: z.object({
    keywords: z.array(z.string()),
    audiences: z.array(z.string()),
    placements: z.array(z.string()).optional(),
  }),
  bidding_strategy: z.string(),
});

export type GeneratedPlan = z.infer<typeof generatedPlanSchema>;

// For dashboard display, we mix campaign info with aggregated metrics
export type CampaignWithMetrics = Campaign & {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalConversionValue: number;
  ctr: number;
  roas: number;
};
