import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/pages/Dashboard";

const style = {
  "--sidebar-width": "16rem",
  "--sidebar-width-icon": "3rem",
} as React.CSSProperties;

export function DashboardLayout() {
  // Force sidebar to be open initially
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Ensure sidebar starts expanded on mount
  useEffect(() => {
    setSidebarOpen(true);
  }, []);

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen} style={style}>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <Dashboard />
      </SidebarInset>
    </SidebarProvider>
  );
}
