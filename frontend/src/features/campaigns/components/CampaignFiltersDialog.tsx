import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CampaignFiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platformFilter: string;
  campaignTypeFilter: string;
  onPlatformFilterChange: (value: string) => void;
  onCampaignTypeFilterChange: (value: string) => void;
}

export function CampaignFiltersDialog({
  open,
  onOpenChange,
  platformFilter,
  campaignTypeFilter,
  onPlatformFilterChange,
  onCampaignTypeFilterChange,
}: CampaignFiltersDialogProps) {
  const hasActiveFilters = platformFilter !== "all" || campaignTypeFilter !== "all";

  const handleClearAll = () => {
    onPlatformFilterChange("all");
    onCampaignTypeFilterChange("all");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Campaigns
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Platform Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Platform</Label>
            <RadioGroup value={platformFilter} onValueChange={onPlatformFilterChange} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="platform-all" />
                <Label htmlFor="platform-all" className="text-sm font-normal cursor-pointer">
                  All Platforms
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="google" id="platform-google" />
                <Label htmlFor="platform-google" className="text-sm font-normal cursor-pointer">
                  Google
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="meta" id="platform-meta" />
                <Label htmlFor="platform-meta" className="text-sm font-normal cursor-pointer">
                  Meta
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amazon" id="platform-amazon" />
                <Label htmlFor="platform-amazon" className="text-sm font-normal cursor-pointer">
                  Amazon
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Campaign Type Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Campaign Type</Label>
            <RadioGroup value={campaignTypeFilter} onValueChange={onCampaignTypeFilterChange} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="type-all" />
                <Label htmlFor="type-all" className="text-sm font-normal cursor-pointer">
                  All Types
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pmax" id="type-pmax" />
                <Label htmlFor="type-pmax" className="text-sm font-normal cursor-pointer">
                  Performance Max
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="shopping" id="type-shopping" />
                <Label htmlFor="type-shopping" className="text-sm font-normal cursor-pointer">
                  Shopping
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sponsored_brands" id="type-sponsored" />
                <Label htmlFor="type-sponsored" className="text-sm font-normal cursor-pointer">
                  Sponsored Brands
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          {hasActiveFilters && (
            <Button variant="outline" onClick={handleClearAll} className="mr-auto">
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
          <Button onClick={() => onOpenChange(false)}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
