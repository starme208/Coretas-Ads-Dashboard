import { useState } from "react";
import { useCampaigns } from "@/hooks/use-campaigns";
import { CreateCampaignModal, StatusBadge, PlatformIcon } from "@/features/campaigns/components";
import { MetricCard } from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  BadgeDollarSign, MousePointer2, Eye, TrendingUp, 
  Plus, Search, Filter, Loader2 
} from "lucide-react";
import { Input } from "@/components/ui/input";

export function Dashboard() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: campaigns, isLoading, error } = useCampaigns();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/20 text-destructive">
        Error loading dashboard data.
      </div>
    );
  }

  // Calculate aggregates
  const totalSpend = campaigns?.reduce((acc, c) => acc + Number(c.totalSpend || 0), 0) || 0;
  const totalConversions = campaigns?.reduce((acc, c) => acc + Number(c.totalConversions || 0), 0) || 0;
  const totalClicks = campaigns?.reduce((acc, c) => acc + Number(c.totalClicks || 0), 0) || 0;
  const totalImpressions = campaigns?.reduce((acc, c) => acc + Number(c.totalImpressions || 0), 0) || 0;

  const filteredCampaigns = campaigns?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.platform.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-end">
          <div className="flex items-center gap-4">
            <div className="hidden md:flex text-sm text-muted-foreground">
              Workspace: <span className="font-medium text-foreground ml-1">My Store</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 border border-white ring-2 ring-primary/10" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Actions & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground">Overview</h2>
            <p className="text-muted-foreground mt-1">Manage your cross-platform campaigns and performance.</p>
          </div>
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 h-11 px-6 rounded-xl"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        {/* Metrics Grid */}
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

        {/* Campaign Table Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold font-display">Active Campaigns</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search campaigns..." 
                  className="pl-9 w-full sm:w-64 bg-muted/30 border-transparent focus:bg-background transition-colors"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[250px]">Campaign</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead className="text-right">Impr.</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">ROAS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns && filteredCampaigns.length > 0 ? (
                  filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id} className="group hover:bg-muted/20 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="text-foreground font-semibold">{campaign.name}</span>
                          <span className="text-xs text-muted-foreground capitalize">{campaign.type.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground capitalize">
                          <PlatformIcon platform={campaign.platform} />
                          {campaign.platform}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={campaign.status} />
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        ${Number(campaign.totalSpend).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {campaign.totalImpressions.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {campaign.totalClicks.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {Number(campaign.ctr).toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-semibold text-green-600">
                        {Number(campaign.roas).toFixed(1)}x
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                      No campaigns found. Create one to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      <CreateCampaignModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
