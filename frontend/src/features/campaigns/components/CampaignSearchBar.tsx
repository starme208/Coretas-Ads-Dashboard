import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CampaignSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onFilterClick: () => void;
  activeFilterCount: number;
}

export function CampaignSearchBar({
  search,
  onSearchChange,
  onFilterClick,
  activeFilterCount,
}: CampaignSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search campaigns..."
          className="pl-9 w-full bg-muted/30 border-transparent focus:bg-background transition-colors"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <button
        onClick={onFilterClick}
        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-muted/20 hover:bg-muted/30 border border-border/50 transition-all group relative min-w-[44px] sm:min-w-auto"
      >
        <Filter className={`h-4 w-4 text-muted-foreground ${activeFilterCount > 0 ? 'text-primary' : ''}`} />
        <span className="text-sm font-medium text-foreground hidden sm:inline">Filters</span>
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
}
