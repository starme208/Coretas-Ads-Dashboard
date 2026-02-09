import { BadgeDollarSign, MousePointer2, Eye, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { CampaignWithMetrics } from "@/lib/schema";

interface CampaignMetricsProps {
  campaigns: CampaignWithMetrics[];
}

export function CampaignMetrics({ campaigns }: CampaignMetricsProps) {
  const totalSpend = campaigns?.reduce((acc, c) => acc + Number(c.totalSpend || 0), 0) || 0;
  const totalConversions = campaigns?.reduce((acc, c) => acc + Number(c.totalConversions || 0), 0) || 0;
  const totalClicks = campaigns?.reduce((acc, c) => acc + Number(c.totalClicks || 0), 0) || 0;
  const totalImpressions = campaigns?.reduce((acc, c) => acc + Number(c.totalImpressions || 0), 0) || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Spend"
        value={`$${totalSpend.toLocaleString()}`}
        icon={<BadgeDollarSign className="w-5 h-5" />}
        trend="+12%"
        trendUp={true}
      />
      <MetricCard
        title="Total Conversions"
        value={totalConversions.toLocaleString()}
        icon={<TrendingUp className="w-5 h-5" />}
        trend="+5%"
        trendUp={true}
      />
      <MetricCard
        title="Total Clicks"
        value={totalClicks.toLocaleString()}
        icon={<MousePointer2 className="w-5 h-5" />}
        trend="-2%"
        trendUp={false}
      />
      <MetricCard
        title="Impressions"
        value={totalImpressions.toLocaleString()}
        icon={<Eye className="w-5 h-5" />}
        trend="+8%"
        trendUp={true}
      />
    </div>
  );
}
