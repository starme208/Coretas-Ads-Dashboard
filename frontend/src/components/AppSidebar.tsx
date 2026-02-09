import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Rocket, History, Settings, LogOut, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard", disabled: false },
  { title: "Campaigns", icon: Rocket, url: "#", disabled: true },
  { title: "History", icon: History, url: "#", disabled: true },
  { title: "Settings", icon: Settings, url: "#", disabled: true },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-0 shadow-xl shadow-black/5">
      <SidebarHeader className="p-5 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3 outline-none rounded-xl focus-visible:ring-2 focus-visible:ring-primary/30">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-display font-bold text-lg tracking-tight text-foreground truncate">
              AutoAds
            </span>
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Campaign Manager
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p0x-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "rounded-lg transition-all duration-200",
                        isActive &&
                          "bg-primary/10 text-primary font-medium shadow-sm border border-primary/10"
                      )}
                    >
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-5 text-sm",
                          !isActive &&
                            "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                            isActive ? "bg-primary/15 text-primary" : "bg-muted/50 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                        </span>
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto p-3 border-t border-border/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50">
                  <LogOut className="h-4 w-4" />
                </span>
                <span className="truncate">Sign out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}
