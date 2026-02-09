import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    created: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    failed: "bg-red-100 text-red-700 border-red-200",
  };

  const label = status.charAt(0).toUpperCase() + status.slice(1);
  const style = styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", style)}>
      {label}
    </span>
  );
}
