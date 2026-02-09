import { z } from 'zod';
import { campaignSchema, planInputSchema, generatedPlanSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  campaigns: {
    list: {
      method: 'GET' as const,
      path: '/api/campaigns' as const,
      responses: {
        200: z.array(z.custom<any>()), // Returns CampaignWithMetrics[]
      },
    },
    // Step 1: Generate the plan preview
    generatePlan: {
      method: 'POST' as const,
      path: '/api/plans/generate' as const,
      input: planInputSchema,
      responses: {
        200: generatedPlanSchema,
        400: errorSchemas.validation,
      },
    },
    // Step 2: Execute the plan (create campaigns)
    createFromPlan: {
      method: 'POST' as const,
      path: '/api/campaigns/execute' as const,
      input: generatedPlanSchema,
      responses: {
        201: z.object({ message: z.string(), campaigns: z.array(campaignSchema) }),
        400: errorSchemas.validation,
      },
    },
  },
  metrics: {
    list: {
        method: 'GET' as const,
        path: '/api/metrics' as const,
        input: z.object({
            campaignId: z.coerce.number().optional()
        }).optional(),
        responses: {
            200: z.array(z.any())
        }
    }
  }
};

export type PlanInput = z.infer<typeof api.campaigns.generatePlan.input>;
export type GeneratedPlan = z.infer<typeof api.campaigns.generatePlan.responses[200]>;
