import { SidebarTrigger } from "@/components/ui/sidebar";

interface AppHeaderProps {
  workspaceName?: string;
}

export function AppHeader({ workspaceName = "My Store" }: AppHeaderProps) {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-30 shrink-0">
      <div className="h-16 flex items-center gap-4 px-4 sm:px-6 lg:px-8">
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1 flex items-center justify-end gap-4">
          <div className="hidden md:flex text-sm text-muted-foreground">
            Workspace: <span className="font-medium text-foreground ml-1">{workspaceName}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200 border border-white ring-2 ring-primary/10" />
        </div>
      </div>
    </header>
  );
}
