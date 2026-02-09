import { useState, useEffect } from "react";
import { useCampaigns } from "@/hooks/use-campaigns";
import {
  CreateCampaignModal,
  CampaignFiltersDialog,
  CampaignMetrics,
  CampaignTableCard,
  DashboardHeader,
} from "@/features/campaigns/components";
import { AppHeader } from "@/components/AppHeader";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CampaignWithMetrics } from "@/lib/schema";

const ITEMS_PER_PAGE = 5;

export function Dashboard() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [campaignTypeFilter, setCampaignTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: campaigns, isLoading, error } = useCampaigns(
    platformFilter !== "all" ? platformFilter : undefined,
    campaignTypeFilter !== "all" ? campaignTypeFilter : undefined
  );

  // Filter campaigns by search
  const filteredCampaigns = (campaigns || []).filter((c: CampaignWithMetrics) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.platform.toLowerCase().includes(search.toLowerCase());
    const matchesPlatform =
      platformFilter === "all" ||
      c.platform.toLowerCase() === platformFilter.toLowerCase();
    const matchesType =
      campaignTypeFilter === "all" ||
      c.type.toLowerCase() === campaignTypeFilter.toLowerCase();
    return matchesSearch && matchesPlatform && matchesType;
  });

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, platformFilter, campaignTypeFilter]);

  // Ensure current page doesn't exceed total pages
  useEffect(() => {
    const totalPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE);
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredCampaigns.length, currentPage]);

  const activeFilterCount =
    (platformFilter !== "all" ? 1 : 0) +
    (campaignTypeFilter !== "all" ? 1 : 0);

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

  return (
    <div className="h-full flex flex-col bg-muted/20">
      <AppHeader />

      <ScrollArea className="flex-1">
        <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-20">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            <DashboardHeader onCreateCampaignClick={() => setIsCreateOpen(true)} />

            <CampaignMetrics campaigns={campaigns || []} />

            <CampaignTableCard
              campaigns={filteredCampaigns}
              search={search}
              onSearchChange={setSearch}
              onFilterClick={() => setShowFilters(true)}
              activeFilterCount={activeFilterCount}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </ScrollArea>

      <CreateCampaignModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      <CampaignFiltersDialog
        open={showFilters}
        onOpenChange={setShowFilters}
        platformFilter={platformFilter}
        campaignTypeFilter={campaignTypeFilter}
        onPlatformFilterChange={setPlatformFilter}
        onCampaignTypeFilterChange={setCampaignTypeFilter}
      />
    </div>
  );
}
