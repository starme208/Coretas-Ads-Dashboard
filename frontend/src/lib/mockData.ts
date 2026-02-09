import type { CampaignWithMetrics, GeneratedPlan, PlanInput } from "@/lib/schema";

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function seedMetricsForCampaign(): {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalConversionValue: number;
  ctr: number;
  roas: number;
} {
  const impressions = Math.floor(randomBetween(500, 5000)) * 7;
  const ctr = randomBetween(1, 6) / 100;
  const clicks = Math.floor(impressions * ctr);
  const totalSpend = Number((clicks * randomBetween(0.5, 2)).toFixed(2));
  const conversions = Math.floor(clicks * randomBetween(0, 0.1));
  const totalConversionValue = Number((conversions * randomBetween(20, 70)).toFixed(2));
  const roas = totalSpend > 0 ? totalConversionValue / totalSpend : 0;
  return {
    totalSpend,
    totalImpressions: impressions,
    totalClicks: clicks,
    totalConversions: conversions,
    totalConversionValue,
    ctr: ctr * 100,
    roas,
  };
}

function makeCampaign(
  id: number,
  name: string,
  platform: string,
  type: string,
  status: string,
  objective: string,
  dailyBudget: string,
  productCategories: string[]
): CampaignWithMetrics {
  const metrics = seedMetricsForCampaign();
  return {
    id,
    name,
    platform,
    type,
    status,
    objective,
    dailyBudget,
    productCategories,
    createdAt: new Date().toISOString(),
    ...metrics,
  };
}

const initialCampaigns: CampaignWithMetrics[] = [
  makeCampaign(
    1,
    "Spring Sale 2024 - PMax",
    "google",
    "pmax",
    "created",
    "Sales",
    "50.00",
    ["Shoes", "Apparel"]
  ),
  makeCampaign(
    2,
    "Retargeting - Catalog Sales",
    "meta",
    "shopping",
    "created",
    "Sales",
    "30.00",
    ["Shoes"]
  ),
  makeCampaign(
    3,
    "Brand Awareness - SB",
    "amazon",
    "sponsored_brands",
    "created",
    "Awareness",
    "20.00",
    ["Accessories"]
  ),
];

let campaignsStore = [...initialCampaigns];
let nextId = 4;

export const mockData = {
  getCampaigns(): Promise<CampaignWithMetrics[]> {
    return Promise.resolve([...campaignsStore]);
  },

  generatePlan(input: PlanInput): GeneratedPlan {
    const categories = Array.isArray(input.productCategories)
      ? input.productCategories
      : String(input.productCategories).split(",").map((s) => s.trim()).filter(Boolean);
    const first = categories[0] || "Products";
    return {
      objective: input.objective,
      daily_budget: input.dailyBudget,
      geo: [input.country || "US"],
      lang: [input.language || "en"],
      product_categories: categories,
      creative_pack: {
        headlines: [
          `Best ${first} Deals`,
          "Shop Top Brands",
          "Limited Time Offers",
        ],
        descriptions: [
          "Free shipping on all orders over $50. Shop now!",
          "Discover the best selection of high-quality gear.",
        ],
        image_urls: [
          "https://placehold.co/600x400/2563eb/white?text=Hero+Image",
          "https://placehold.co/600x400/16a34a/white?text=Lifestyle+Shot",
        ],
      },
      targeting_hints: {
        keywords: categories.flatMap((c) => [`${c} reviews`, `buy ${c}`]),
        audiences: ["Shoppers", "Tech Enthusiasts", "Outdoor Lovers"],
      },
      bidding_strategy: "maximize_conversion_value",
    };
  },

  addCampaignsFromPlan(plan: GeneratedPlan): { message: string; campaigns: CampaignWithMetrics[] } {
    const created: CampaignWithMetrics[] = [];
    const dateStr = new Date().toISOString().slice(0, 10);
    const firstCat = plan.product_categories[0] || "Products";

    const google = makeCampaign(
      nextId++,
      `PMax - ${firstCat} - ${dateStr}`,
      "google",
      "pmax",
      "created",
      plan.objective,
      (plan.daily_budget * 0.4).toFixed(2),
      plan.product_categories
    );
    campaignsStore.push(google);
    created.push(google);

    const meta = makeCampaign(
      nextId++,
      `Advantage+ Shopping - ${firstCat}`,
      "meta",
      "shopping",
      "created",
      plan.objective,
      (plan.daily_budget * 0.4).toFixed(2),
      plan.product_categories
    );
    campaignsStore.push(meta);
    created.push(meta);

    const amazon = makeCampaign(
      nextId++,
      `SB - ${firstCat}`,
      "amazon",
      "sponsored_brands",
      "created",
      plan.objective,
      (plan.daily_budget * 0.2).toFixed(2),
      plan.product_categories
    );
    campaignsStore.push(amazon);
    created.push(amazon);

    return {
      message: "Campaigns created successfully",
      campaigns: created,
    };
  },
};
