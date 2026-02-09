import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: ReactNode;
  className?: string;
}

export function MetricCard({ title, value, trend, trendUp, icon, className }: MetricCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          {icon}
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold font-display tracking-tight text-foreground">{value}</h3>
      </div>
    </div>
  );
}
