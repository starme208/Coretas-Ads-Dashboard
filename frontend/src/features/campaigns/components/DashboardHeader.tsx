import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onCreateCampaignClick: () => void;
}

export function DashboardHeader({ onCreateCampaignClick }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Overview</h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your cross-platform campaigns and performance.</p>
      </div>
      <Button
        onClick={onCreateCampaignClick}
        className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 h-10 sm:h-11 px-4 sm:px-6 rounded-xl text-sm sm:text-base w-full sm:w-auto"
      >
        <Plus className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Create Campaigns</span>
        <span className="sm:hidden">Create</span>
      </Button>
    </div>
  );
}
