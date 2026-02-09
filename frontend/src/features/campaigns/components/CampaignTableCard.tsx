import { CampaignSearchBar } from "./CampaignSearchBar";
import { CampaignTable } from "./CampaignTable";
import { CampaignWithMetrics } from "@/lib/schema";

interface CampaignTableCardProps {
  campaigns: CampaignWithMetrics[];
  search: string;
  onSearchChange: (value: string) => void;
  onFilterClick: () => void;
  activeFilterCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function CampaignTableCard({
  campaigns,
  search,
  onSearchChange,
  onFilterClick,
  activeFilterCount,
  currentPage,
  onPageChange,
}: CampaignTableCardProps) {
  return (
    <div className="bg-card rounded-xl sm:rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex gap-4  justify-between">
          <h3 className="text-base sm:text-lg font-bold font-display">Active Campaigns</h3>
          <CampaignSearchBar
            search={search}
            onSearchChange={onSearchChange}
            onFilterClick={onFilterClick}
            activeFilterCount={activeFilterCount}
          />
        </div>
      </div>

      <CampaignTable
        campaigns={campaigns}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}
