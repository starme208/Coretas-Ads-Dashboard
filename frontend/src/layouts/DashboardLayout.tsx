import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/pages/Dashboard";

const style = {
  "--sidebar-width": "16rem",
  "--sidebar-width-icon": "4rem",
} as React.CSSProperties;

export function DashboardLayout() {
  return (
    <SidebarProvider style={style}>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-hidden">
            <Dashboard />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
